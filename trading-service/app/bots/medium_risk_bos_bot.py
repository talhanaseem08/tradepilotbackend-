"""
Medium Risk BOS Bot — Bullish BOS Retest (pandas strategy).

Risk: `risk_per_trade_pct` of `account_balance` per trade (default 1%).
Position size = (balance × risk%) / SL distance per unit, OANDA 1k rounding.
SL = entry × (1 - sl_percent/100) (default 0.04% of price).
TP = entry + tp_r_multiple × (entry − SL), default 1.5R.
Symbol: EURUSD only.
"""
from __future__ import annotations

import pandas as pd

from app.bots.base_bot import BaseBot
from app.bots.bos_strategy_engine import BOSRetestStrategy, BOSSignal


def _candles_to_dataframe(candles: list[dict]) -> pd.DataFrame:
    """Build OHLC DataFrame (integer index) for BOSRetestStrategy."""
    return pd.DataFrame(
        {
            "open": [float(c.get("open", c.get("o", 0))) for c in candles],
            "high": [float(c.get("high", c.get("h", 0))) for c in candles],
            "low": [float(c.get("low", c.get("l", 0))) for c in candles],
            "close": [float(c.get("close", c.get("c", 0))) for c in candles],
        }
    )


class MediumRiskBosBot(BaseBot):
    """
    Medium Risk BOS (Break of Structure) Bot.

    Risks a percentage of account balance per trade (default 1%).
    Allowed instruments: EURUSD only.
    """

    ALLOWED_SYMBOLS = {"EURUSD"}

    def __init__(self, symbol: str, timeframe: str, parameters: dict):
        if symbol.upper() not in self.ALLOWED_SYMBOLS:
            raise ValueError(
                f"MediumRiskBosBot only trades {self.ALLOWED_SYMBOLS}, got '{symbol}'"
            )
        defaults = {
            "pivot_left_bars": 7,
            "pivot_right_bars": 3,
            "retest_max_bars": 3,
            "sl_percent": 0.04,
            "tp_r_multiple": 1.5,
            "account_balance": 100_000.0,
            "risk_per_trade_pct": 1.0,
        }
        defaults.update(parameters)
        super().__init__(symbol.upper(), timeframe, defaults)

        self._strategy = self._build_strategy()
        self._last_signal: BOSSignal | None = None
        self._candle_buffer: list[dict] = []

    def _build_strategy(self) -> BOSRetestStrategy:
        return BOSRetestStrategy(
            pivot_left_bars=int(self.parameters["pivot_left_bars"]),
            pivot_right_bars=int(self.parameters["pivot_right_bars"]),
            retest_max_bars=int(self.parameters["retest_max_bars"]),
            sl_percent=float(self.parameters["sl_percent"]),
            tp_r_multiple=float(self.parameters.get("tp_r_multiple", 1.5)),
            account_balance=float(self.parameters["account_balance"]),
            risk_per_trade_pct=float(self.parameters["risk_per_trade_pct"]),
        )

    def _risk_usd(self) -> float:
        bal = float(self.parameters.get("account_balance", 0.0))
        pct = float(self.parameters.get("risk_per_trade_pct", 1.0))
        return max(0.0, bal * (pct / 100.0))

    def update_balance(self, balance: float) -> None:
        self.parameters["account_balance"] = float(balance)
        self._strategy = self._build_strategy()

    def step(self, candle: dict) -> str:
        """
        Advance one bar without full replay (used by `run_backtest`). Matches live incremental
        `process_candle(df, last_index)` semantics.
        """
        self._candle_buffer.append(candle)
        df = _candles_to_dataframe(self._candle_buffer)
        idx = len(df) - 1
        need = max(
            self.parameters["pivot_left_bars"],
            self.parameters["pivot_right_bars"],
        )
        if idx < need:
            return "hold"

        self._last_signal = None
        sig = self._strategy.process_candle(df, idx)
        if sig:
            self._last_signal = sig
            return "buy"
        return "hold"

    def analyze(self, candles: list[dict]) -> str:
        """
        Bar-by-bar replay with a **growing** OHLC window (same as `step()` / live).

        Using the full history length on every bar would let pivot confirmation see future
        bars on the right — not available in real time. Growing `df[:i+1]` matches OANDA.
        """
        min_bars = max(
            self.parameters["pivot_left_bars"],
            self.parameters["pivot_right_bars"],
        ) + 5

        if len(candles) < min_bars:
            return "hold"

        self.reset_state()
        need = max(
            self.parameters["pivot_left_bars"],
            self.parameters["pivot_right_bars"],
        )
        last_i = len(candles) - 1

        for i, candle in enumerate(candles):
            self._candle_buffer.append(candle)
            df = _candles_to_dataframe(self._candle_buffer)
            idx = len(df) - 1
            if idx < need:
                continue
            sig = self._strategy.process_candle(df, idx)
            if sig and i == last_i:
                self._last_signal = sig

        if self._last_signal and self._last_signal.action == "BUY":
            return "buy"

        return "hold"

    def calculate_stop_loss(self, entry_price: float, side: str) -> float:
        if self._last_signal and self._last_signal.stop_loss:
            return round(self._last_signal.stop_loss, 5)

        sl_pct = self.parameters["sl_percent"] / 100
        if side == "buy":
            return round(entry_price * (1 - sl_pct), 5)
        return round(entry_price * (1 + sl_pct), 5)

    def calculate_take_profit(self, entry_price: float, side: str) -> float:
        if self._last_signal and self._last_signal.take_profit:
            return round(self._last_signal.take_profit, 5)

        r = float(self.parameters.get("tp_r_multiple", 1.5))
        sl_pct = self.parameters["sl_percent"] / 100
        if side == "buy":
            sl = entry_price * (1 - sl_pct)
            dist = entry_price - sl
            return round(entry_price + r * dist, 5)
        sl = entry_price * (1 + sl_pct)
        dist = sl - entry_price
        return round(entry_price - r * dist, 5)

    def calculate_position_size(self, balance: float, risk_pct: float = 1.0) -> float:
        """Units from last signal, or recomputed from `balance` and `risk_per_trade_pct`."""
        if self._last_signal and self._last_signal.quantity:
            return abs(self._last_signal.quantity)

        pct = float(self.parameters.get("risk_per_trade_pct", risk_pct))
        risk_usd = max(0.0, float(balance) * (pct / 100.0))
        if self._last_signal and self._last_signal.stop_loss is not None:
            entry = float(self._last_signal.entry_price)
            sl = float(self._last_signal.stop_loss)
            dist = entry - sl
            if dist > 0:
                q = risk_usd / dist
                return float(max(1000, round(q / 1000) * 1000))
        return risk_usd

    def get_signal_details(self) -> dict | None:
        if not self._last_signal:
            return None
        return {
            "action": self._last_signal.action,
            "entry_price": self._last_signal.entry_price,
            "quantity": self._last_signal.quantity,
            "stop_loss": self._last_signal.stop_loss,
            "take_profit": self._last_signal.take_profit,
            "bos_level": self._last_signal.bos_level,
        }

    def get_strategy_state(self) -> dict:
        return {
            "last_swing_high": self._strategy.last_confirmed_swing_high,
            "last_swing_low": self._strategy.last_confirmed_swing_low,
            "bos_level": self._strategy.bos_level,
            "bos_sequence_active": self._strategy.bos_sequence_active,
            "entry_ready": self._strategy.entry_ready,
        }

    def reset_state(self) -> None:
        self._strategy.reset_state()
        self._last_signal = None
        self._candle_buffer = []

    def update_parameters(self, new_params: dict) -> None:
        super().update_parameters(new_params)
        self._strategy = self._build_strategy()
