"""Live/paper adapter for crypto medium-risk strategy (OB + pivot; params from `bot_selector`)."""

from __future__ import annotations

from app.bots.base_bot import BaseBot


class CryptoMediumBot(BaseBot):
    def __init__(self, symbol: str, timeframe: str, parameters: dict):
        defaults = {
            "initial_balance": 100_000.0,
            "position_pct": 0.10,
            "max_ob_pct": 4.0,
            "pivot_len": 5,
        }
        defaults.update(parameters)
        super().__init__(symbol.upper(), timeframe, defaults)

    def analyze(self, candles: list[dict]) -> str:
        return "hold"

    def calculate_stop_loss(self, entry_price: float, side: str) -> float:
        return entry_price * 0.98 if side == "buy" else entry_price * 1.02

    def calculate_take_profit(self, entry_price: float, side: str) -> float:
        return entry_price * 1.02 if side == "buy" else entry_price * 0.98
