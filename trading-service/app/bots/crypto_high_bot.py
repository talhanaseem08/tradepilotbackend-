"""Live/paper adapter for crypto high-risk strategy (EMA/RSI/ATR; params from `bot_selector`)."""

from __future__ import annotations

from app.bots.base_bot import BaseBot


class CryptoHighBot(BaseBot):
    def __init__(self, symbol: str, timeframe: str, parameters: dict):
        defaults = {
            "risk_per_trade_usd": 1000.0,
            "atr_stop_mult": 1.5,
            "atr_tp_mult": 3.0,
        }
        defaults.update(parameters)
        super().__init__(symbol.upper(), timeframe, defaults)

    def analyze(self, candles: list[dict]) -> str:
        return "hold"

    def calculate_stop_loss(self, entry_price: float, side: str) -> float:
        m = float(self.parameters.get("atr_stop_mult", 1.5))
        pct = min(0.5, 0.01 * m)
        return entry_price * (1 - pct) if side == "buy" else entry_price * (1 + pct)

    def calculate_take_profit(self, entry_price: float, side: str) -> float:
        m = float(self.parameters.get("atr_tp_mult", 3.0))
        pct = min(0.5, 0.01 * m)
        return entry_price * (1 + pct) if side == "buy" else entry_price * (1 - pct)
