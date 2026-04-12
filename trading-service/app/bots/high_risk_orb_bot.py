"""
High Risk ORB Bot — same V12.2 ORB engine as low risk; risk is % of balance.

Sessions **Pakistan (UTC+5)**: before 29 Mar 2026 → 1:00–1:05 PM / 1:05–5:00 PM; on/after → 12:00–12:05 PM / 12:05–4:00 PM. Symbols: USDCHF, UK100.
"""
from __future__ import annotations

from datetime import datetime, timezone

from app.bots.base_bot import BaseBot
from app.bots.orb_strategy_engine import (
    TP_R_MULTIPLE,
    EngineState,
    Signal,
    StrategyConfig,
    process_bar,
)


class HighRiskOrbBot(BaseBot):
    """
    High Risk M5 ORB Bot.

    Uses percentage of account balance per trade (dynamic sizing).
    More aggressive with larger position sizes relative to account.
    Allowed instruments: USDCHF, UK100.
    """

    ALLOWED_SYMBOLS = {"USDCHF", "UK100"}

    def __init__(self, symbol: str, timeframe: str, parameters: dict):
        if symbol.upper() not in self.ALLOWED_SYMBOLS:
            raise ValueError(
                f"HighRiskOrbBot only trades {self.ALLOWED_SYMBOLS}, got '{symbol}'"
            )
        defaults = {
            "risk_per_trade_pct": 1.0,  # 1% of balance
            "reward_ratio": 2.0,
            "max_wait_hours": 1.5,
            "account_balance": 10000.0,  # Default balance for position sizing
        }
        defaults.update(parameters)
        super().__init__(symbol.upper(), timeframe, defaults)
        self.parameters["reward_ratio"] = TP_R_MULTIPLE  # TP always 2R

        self._engine_state = EngineState()
        self._last_signal: Signal | None = None
        self._update_strategy_config()

    def _update_strategy_config(self) -> None:
        """Update strategy config based on current balance and risk percentage."""
        balance = self.parameters.get("account_balance", 10000.0)
        risk_pct = self.parameters.get("risk_per_trade_pct", 1.0)
        risk_usd = balance * (risk_pct / 100.0)
        
        self._strategy_config = StrategyConfig(
            risk_per_trade_usd=risk_usd,
            reward_ratio=TP_R_MULTIPLE,
            max_wait_hours=self.parameters["max_wait_hours"],
        )

    def update_balance(self, balance: float) -> None:
        """Update account balance for dynamic position sizing."""
        self.parameters["account_balance"] = balance
        self._update_strategy_config()

    def update_parameters(self, new_params: dict) -> None:
        super().update_parameters(new_params)
        self.parameters["reward_ratio"] = TP_R_MULTIPLE
        self._update_strategy_config()

    def step(self, candle: dict) -> str:
        """Single-bar advance; call `reset_state()` before a new series."""
        candle_time = self._parse_candle_time(candle)
        if candle_time is None:
            self._last_signal = None
            return "hold"

        close = float(candle.get("close", candle.get("c", 0)))
        self._engine_state, signal = process_bar(
            state=self._engine_state,
            candle_time=candle_time,
            open_=float(candle.get("open", candle.get("o", close))),
            high=float(candle.get("high", candle.get("h", close))),
            low=float(candle.get("low", candle.get("l", close))),
            close=close,
            mid_price_for_sizing=close,
            cfg=self._strategy_config,
        )
        self._last_signal = None
        if signal:
            self._last_signal = signal
            return "buy" if signal.side == "long" else "sell"
        return "hold"

    def analyze(self, candles: list[dict]) -> str:
        """Returns signal for the **last** candle only (full replay from reset)."""
        if len(candles) < 10:
            return "hold"

        self.reset_state()
        out = "hold"
        for candle in candles:
            out = self.step(candle)
        return out

    def calculate_stop_loss(self, entry_price: float, side: str) -> float:
        """Return stop loss from last signal or calculate based on range midpoint."""
        if self._last_signal and self._last_signal.stop:
            return round(self._last_signal.stop, 5)
        
        # Fallback: use range midpoint logic (approx 30 pips for forex)
        pips = 0.0030
        if side == "buy":
            return round(entry_price - pips, 5)
        return round(entry_price + pips, 5)

    def calculate_take_profit(self, entry_price: float, side: str) -> float:
        """Return take profit from last signal or calculate based on reward ratio."""
        if self._last_signal and self._last_signal.take_profit:
            return round(self._last_signal.take_profit, 5)
        
        # Fallback: use reward ratio
        sl = self.calculate_stop_loss(entry_price, side)
        risk = abs(entry_price - sl)
        tp_distance = risk * TP_R_MULTIPLE
        
        if side == "buy":
            return round(entry_price + tp_distance, 5)
        return round(entry_price - tp_distance, 5)

    def calculate_position_size(self, balance: float, risk_pct: float = None) -> float:
        """
        Calculate position size based on account balance and risk percentage.
        Uses the bot's configured risk percentage if not specified.
        """
        if self._last_signal and self._last_signal.units:
            return abs(self._last_signal.units)
        
        # Use provided risk_pct or default from parameters
        actual_risk_pct = risk_pct if risk_pct is not None else self.parameters["risk_per_trade_pct"]
        return round(balance * (actual_risk_pct / 100), 2)

    def get_signal_details(self) -> dict | None:
        """Return full signal details for advanced use cases."""
        if not self._last_signal:
            return None
        return {
            "side": self._last_signal.side,
            "entry": self._last_signal.entry,
            "stop": self._last_signal.stop,
            "take_profit": self._last_signal.take_profit,
            "units": self._last_signal.units,
        }

    def get_engine_state(self) -> dict:
        """Return current strategy engine state for debugging."""
        return {
            "bar_index": self._engine_state.bar_index,
            "day_stage": self._engine_state.day.stage,
            "range_high": self._engine_state.day.range_high,
            "range_low": self._engine_state.day.range_low,
            "range_mid": self._engine_state.day.range_mid,
            "can_trade_today": self._engine_state.day.can_trade_today,
        }

    def reset_state(self) -> None:
        """Reset the engine state for a new trading session."""
        self._engine_state = EngineState()
        self._last_signal = None

    def _parse_candle_time(self, candle: dict) -> datetime | None:
        """Parse candle timestamp to datetime."""
        time_val = candle.get("time") or candle.get("timestamp") or candle.get("t")
        if not time_val:
            return None
        
        if isinstance(time_val, datetime):
            return time_val.astimezone(timezone.utc)
        
        if isinstance(time_val, (int, float)):
            return datetime.fromtimestamp(time_val, tz=timezone.utc)
        
        if isinstance(time_val, str):
            try:
                t = time_val.replace("Z", "+00:00")
                return datetime.fromisoformat(t).astimezone(timezone.utc)
            except ValueError:
                return None
        
        return None
