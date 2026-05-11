"""Python translation of the provided PineScript strategy (simplified for backtesting)."""
from __future__ import annotations

from dataclasses import dataclass
from typing import List, Optional

import numpy as np
import pandas as pd

from medium_risk.config import MAX_OB_PCT, PIVOT_LEN


@dataclass
class TradeResult:
    symbol: str
    entry_time: pd.Timestamp
    exit_time: pd.Timestamp
    entry_price: float
    exit_price: float
    stop_price: float
    target_price: float | None
    position_size: float
    pnl: float
    wallet_before: float
    wallet_after: float
    reason: str


def compute_pivot_high(high_series: pd.Series, left: int, right: int) -> pd.Series:
    """Compute pivot highs similar to TradingView's ta.pivothigh."""
    pivots = []
    length = len(high_series)
    for i in range(length):
        if i < left or i + right >= length:
            pivots.append(np.nan)
            continue
        window = high_series.iloc[i - left : i + right + 1]
        pivots.append(high_series.iloc[i] if high_series.iloc[i] == window.max() else np.nan)
    return pd.Series(pivots, index=high_series.index)


def run_backtest_for_symbol(
    symbol: str,
    df: pd.DataFrame,
    initial_balance: float,
    position_pct: float = 0.10,
    max_ob_pct: float = MAX_OB_PCT,
    pivot_len: int = PIVOT_LEN,
) -> tuple[float, List[TradeResult]]:
    """
    Run a simple long-only backtest for the OB retest strategy.
    Returns the final wallet balance and the list of trades.
    """
    wallet = initial_balance
    trades: List[TradeResult] = []

    ob_high: Optional[float] = None
    ob_low: Optional[float] = None
    ob_used = False

    pivot_high = compute_pivot_high(df["high"], pivot_len, pivot_len)

    position_open = False
    entry_price = 0.0
    position_size = 0.0
    stop_price = 0.0
    entry_time: Optional[pd.Timestamp] = None
    target_price: Optional[float] = None

    # Iterate with enough history for lookbacks
    for i in range(6, len(df)):
        row = df.iloc[i]
        # Order block detection referencing prior candles
        ob_range_pct = abs(df["high"].iloc[i - 3] - df["low"].iloc[i - 3]) / df["low"].iloc[i - 3] * 100
        bull_ob = (
            df["close"].iloc[i - 3] < df["open"].iloc[i - 3]
            and ob_range_pct <= max_ob_pct
            and df["close"].iloc[i - 5] > df["open"].iloc[i - 5]
            and df["close"].iloc[i - 4] > df["open"].iloc[i - 4]
            and df["close"].iloc[i - 2] > df["open"].iloc[i - 2]
            and df["close"].iloc[i - 1] > df["open"].iloc[i - 1]
        )

        if bull_ob:
            ob_high = df["high"].iloc[i - 3]
            ob_low = df["low"].iloc[i - 3]
            ob_used = False

        # Entry logic
        if not position_open and not ob_used and ob_high is not None and ob_low is not None:
            long_touch = row["low"] <= ob_high and row["high"] >= ob_low
            if long_touch:
                position_size = (wallet * position_pct) / row["close"]
                entry_price = row["close"]
                stop_price = ob_low
                position_open = True
                entry_time = row["datetime"]
                ob_used = True
                target_price = None

        if position_open:
            # Take profit at pivot highs if present and above entry
            if not np.isnan(pivot_high.iloc[i]) and pivot_high.iloc[i] > entry_price:
                target_price = pivot_high.iloc[i]
                if row["high"] >= target_price:
                    exit_price = target_price
                    pnl = (exit_price - entry_price) * position_size
                    wallet_before = wallet
                    wallet += pnl
                    trades.append(
                        TradeResult(
                            symbol=symbol,
                            entry_time=entry_time,
                            exit_time=row["datetime"],
                            entry_price=entry_price,
                            exit_price=exit_price,
                            stop_price=stop_price,
                            target_price=target_price,
                            position_size=position_size,
                            pnl=pnl,
                            wallet_before=wallet_before,
                            wallet_after=wallet,
                            reason="TP Pivot",
                        )
                    )
                    position_open = False
                    continue

            # Hard stop: close below obLow
            if row["close"] < stop_price:
                exit_price = stop_price
                pnl = (exit_price - entry_price) * position_size
                wallet_before = wallet
                wallet += pnl
                trades.append(
                    TradeResult(
                        symbol=symbol,
                        entry_time=entry_time,
                        exit_time=row["datetime"],
                        entry_price=entry_price,
                        exit_price=exit_price,
                        stop_price=stop_price,
                        target_price=target_price,
                        position_size=position_size,
                        pnl=pnl,
                        wallet_before=wallet_before,
                        wallet_after=wallet,
                        reason="SL",
                    )
                )
                position_open = False
                continue

    # Close any open position at final close
    if position_open and entry_time is not None:
        final_row = df.iloc[-1]
        exit_price = final_row["close"]
        pnl = (exit_price - entry_price) * position_size
        wallet_before = wallet
        wallet += pnl
        trades.append(
            TradeResult(
                symbol=symbol,
                entry_time=entry_time,
                exit_time=final_row["datetime"],
                entry_price=entry_price,
                exit_price=exit_price,
                stop_price=stop_price,
                target_price=target_price,
                position_size=position_size,
                pnl=pnl,
                wallet_before=wallet_before,
                wallet_after=wallet,
                reason="EOD Close",
            )
        )
    return wallet, trades

