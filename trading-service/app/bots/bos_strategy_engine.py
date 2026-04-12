"""
BOS (Break of Structure) Retest Strategy Implementation.
Based on Pine Script strategy logic — pandas DataFrame API (standalone-bot parity).

1. Identify swing highs/lows using pivot points
2. Detect Break of Structure (BOS) when price closes above swing high
3. Wait for price to retest the broken level
4. Enter long on bullish candle confirmation after retest
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import Optional, Tuple

import pandas as pd


@dataclass
class BOSSignal:
    """Signal output from BOS strategy."""
    action: str
    entry_price: float
    quantity: float
    stop_loss: float
    take_profit: float
    bos_level: float


class BOSRetestStrategy:
    def __init__(
        self,
        pivot_left_bars: int = 7,
        pivot_right_bars: int = 3,
        retest_max_bars: int = 3,
        sl_percent: float = 0.04,
        tp_r_multiple: float = 1.5,
        account_balance: float = 100_000.0,
        risk_per_trade_pct: float = 1.0,
    ):
        self.pivot_left_bars = pivot_left_bars
        self.pivot_right_bars = pivot_right_bars
        self.retest_max_bars = retest_max_bars
        self.sl_percent = sl_percent
        self.tp_r_multiple = tp_r_multiple
        self.account_balance = account_balance
        self.risk_per_trade_pct = risk_per_trade_pct

        self.last_confirmed_swing_low: Optional[float] = None
        self.last_confirmed_swing_high: Optional[float] = None
        self.swing_high_bar_index: Optional[int] = None
        self.bos_level: Optional[float] = None
        self.bos_bar_index: Optional[int] = None
        self.bos_sequence_active: bool = False
        self.entry_ready: bool = False

    def reset_state(self) -> None:
        self.last_confirmed_swing_low = None
        self.last_confirmed_swing_high = None
        self.swing_high_bar_index = None
        self.bos_level = None
        self.bos_bar_index = None
        self.bos_sequence_active = False
        self.entry_ready = False

    def identify_pivot_low(self, lows: pd.Series, index: int) -> Optional[float]:
        if index < self.pivot_left_bars or index >= len(lows) - self.pivot_right_bars:
            return None

        current_low = lows.iloc[index]

        for i in range(index - self.pivot_left_bars, index):
            if lows.iloc[i] <= current_low:
                return None

        for i in range(index + 1, index + self.pivot_right_bars + 1):
            if lows.iloc[i] < current_low:
                return None

        return float(current_low)

    def identify_pivot_high(self, highs: pd.Series, index: int) -> Optional[float]:
        if index < self.pivot_left_bars or index >= len(highs) - self.pivot_right_bars:
            return None

        current_high = highs.iloc[index]

        for i in range(index - self.pivot_left_bars, index):
            if highs.iloc[i] >= current_high:
                return None

        for i in range(index + 1, index + self.pivot_right_bars + 1):
            if highs.iloc[i] > current_high:
                return None

        return float(current_high)

    def update_swing_levels(self, df: pd.DataFrame, current_index: int) -> None:
        # A bar at index i can only be confirmed as a pivot once we have
        # `pivot_right_bars` bars to its right — i.e. when processing bar
        # `current_index`, the bar that *just* became confirmable is
        # `current_index - pivot_right_bars`. Calling identify_* on the last
        # bar every time always fails the right-side guard (no room on the right).
        idx = current_index - self.pivot_right_bars
        if idx < self.pivot_left_bars:
            return

        pivot_low = self.identify_pivot_low(df["low"], idx)
        if pivot_low is not None:
            self.last_confirmed_swing_low = pivot_low

        pivot_high = self.identify_pivot_high(df["high"], idx)
        if pivot_high is not None:
            self.last_confirmed_swing_high = pivot_high
            self.swing_high_bar_index = idx

    def check_bos(self, df: pd.DataFrame, current_index: int) -> bool:
        if current_index < 0 or current_index >= len(df):
            return False

        if self.last_confirmed_swing_high is None or self.swing_high_bar_index is None:
            return False

        current_close = df["close"].iloc[current_index]

        if (
            current_close > self.last_confirmed_swing_high
            and current_index > self.swing_high_bar_index
            and not self.bos_sequence_active
        ):
            self.bos_sequence_active = True
            self.bos_level = self.last_confirmed_swing_high
            self.bos_bar_index = current_index
            return True

        return False

    def check_bos_invalidation(self, df: pd.DataFrame, current_index: int) -> None:
        if not self.bos_sequence_active or self.bos_level is None:
            return

        if current_index < 0 or current_index >= len(df):
            return

        current_close = df["close"].iloc[current_index]

        if current_close < self.bos_level:
            self.bos_sequence_active = False
            self.bos_level = None
            self.bos_bar_index = None

    def check_retest(self, df: pd.DataFrame, current_index: int) -> bool:
        if not self.bos_sequence_active or self.bos_level is None or self.bos_bar_index is None:
            return False

        if current_index < 0 or current_index >= len(df):
            return False

        if current_index <= self.bos_bar_index:
            return False

        bars_since_bos = current_index - self.bos_bar_index

        if bars_since_bos > self.retest_max_bars:
            self.bos_sequence_active = False
            self.bos_level = None
            self.bos_bar_index = None
            return False

        current_low = df["low"].iloc[current_index]
        current_close = df["close"].iloc[current_index]
        current_open = df["open"].iloc[current_index]

        retested_broken_high = current_low <= self.bos_level
        closed_bullish = current_close > current_open

        if retested_broken_high and closed_bullish:
            self.entry_ready = True
            self.bos_sequence_active = False
            return True

        return False

    def calculate_position_size(
        self, entry_price: float
    ) -> Tuple[Optional[float], Optional[float], Optional[float]]:
        stop_loss = entry_price * (1 - self.sl_percent / 100)
        sl_distance_per_unit = entry_price - stop_loss

        if sl_distance_per_unit <= 0:
            return None, None, None

        take_profit = entry_price + self.tp_r_multiple * sl_distance_per_unit

        risk_usd = self.account_balance * (self.risk_per_trade_pct / 100.0)
        quantity = risk_usd / sl_distance_per_unit
        quantity = max(1000, round(quantity / 1000) * 1000)

        return quantity, stop_loss, take_profit

    def process_candle(self, df: pd.DataFrame, current_index: int) -> Optional[BOSSignal]:
        if current_index < max(self.pivot_left_bars, self.pivot_right_bars):
            return None

        self.update_swing_levels(df, current_index)
        self.check_bos(df, current_index)
        self.check_bos_invalidation(df, current_index)
        self.check_retest(df, current_index)

        if self.entry_ready:
            entry_price = float(df["open"].iloc[current_index])
            quantity, stop_loss, take_profit = self.calculate_position_size(entry_price)

            if quantity is not None and quantity > 0:
                self.entry_ready = False
                bl = float(self.bos_level) if self.bos_level is not None else 0.0
                return BOSSignal(
                    action="BUY",
                    entry_price=entry_price,
                    quantity=float(quantity),
                    stop_loss=float(stop_loss),
                    take_profit=float(take_profit),
                    bos_level=bl,
                )
            self.entry_ready = False

        return None
