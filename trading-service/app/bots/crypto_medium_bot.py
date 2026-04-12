"""Crypto medium-risk bot — order block + pivot TP (cryptobots medium_risk port)."""
from __future__ import annotations

from app.bots.base_bot import BaseBot
from app.bots.crypto import analyze_crypto_medium_intent, candles_to_ohlc_df


class CryptoMediumBot(BaseBot):
    def __init__(self, symbol: str, timeframe: str, parameters: dict):
        defaults = {
            "initial_balance": 100_000.0,
            "position_pct": 0.10,
            "max_ob_pct": 4.0,
            "pivot_len": 5,
        }
        defaults.update(parameters or {})
        super().__init__(symbol, timeframe, defaults)
        self._last_intent: dict | None = None

    def analyze(self, candles: list[dict]) -> str:
        if len(candles) < 50:
            return "hold"
        df = candles_to_ohlc_df(candles)
        self._last_intent = analyze_crypto_medium_intent(df, self.parameters)
        if not self._last_intent:
            return "hold"
        return "buy"

    def calculate_stop_loss(self, entry_price: float, side: str) -> float:
        if self._last_intent and self._last_intent.get("stop"):
            return round(float(self._last_intent["stop"]), 8)
        return round(entry_price * 0.98, 8)

    def calculate_take_profit(self, entry_price: float, side: str) -> float:
        if self._last_intent and self._last_intent.get("take_profit"):
            return round(float(self._last_intent["take_profit"]), 8)
        sl = self.calculate_stop_loss(entry_price, side)
        return round(entry_price + abs(entry_price - sl) * 2, 8)

    def calculate_position_size(self, balance: float, risk_pct: float = 1.0) -> float:
        if self._last_intent and self._last_intent.get("units"):
            return abs(float(self._last_intent["units"]))
        return super().calculate_position_size(balance, risk_pct)
