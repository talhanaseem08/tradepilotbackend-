"""Live/paper adapter for crypto low-risk strategy (parameters align with `bot_selector` + cryptobots low_risk)."""

from __future__ import annotations

from app.bots.base_bot import BaseBot


class CryptoLowBot(BaseBot):
    """SMA/RSI/ATR-style params; live `analyze` is a stub until wired to cryptobots strategy."""

    def __init__(self, symbol: str, timeframe: str, parameters: dict):
        defaults = {
            "long_only": True,
            "rsi_low": 48,
            "rsi_high": 68,
            "stop_atr_mult": 2.0,
            "tp_atr_mult": 5.0,
            "risk_per_trade_usd": 10_000.0,
        }
        defaults.update(parameters)
        super().__init__(symbol.upper(), timeframe, defaults)

    def analyze(self, candles: list[dict]) -> str:
        return "hold"

    def calculate_stop_loss(self, entry_price: float, side: str) -> float:
        m = float(self.parameters.get("stop_atr_mult", 2.0))
        pct = min(0.5, 0.01 * m)
        return entry_price * (1 - pct) if side == "buy" else entry_price * (1 + pct)

    def calculate_take_profit(self, entry_price: float, side: str) -> float:
        m = float(self.parameters.get("tp_atr_mult", 5.0))
        pct = min(0.5, 0.01 * m)
        return entry_price * (1 + pct) if side == "buy" else entry_price * (1 - pct)
