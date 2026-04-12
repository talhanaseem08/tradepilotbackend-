"""Crypto high-risk bot — EMA9/21 + RSI + ATR (cryptobots high_risk port)."""
from __future__ import annotations

from app.bots.base_bot import BaseBot
from app.bots.crypto import analyze_crypto_high_intent, candles_to_ohlc_df


class CryptoHighBot(BaseBot):
    def __init__(self, symbol: str, timeframe: str, parameters: dict):
        defaults = {
            "risk_per_trade_usd": 1000.0,
            "atr_stop_mult": 1.5,
            "atr_tp_mult": 3.0,
        }
        defaults.update(parameters or {})
        super().__init__(symbol, timeframe, defaults)
        self._last_intent: dict | None = None

    def analyze(self, candles: list[dict]) -> str:
        if len(candles) < 40:
            return "hold"
        df = candles_to_ohlc_df(candles)
        self._last_intent = analyze_crypto_high_intent(df, self.parameters)
        if not self._last_intent:
            return "hold"
        side = self._last_intent["side"]
        return "buy" if side == "LONG" else "sell"

    def calculate_stop_loss(self, entry_price: float, side: str) -> float:
        if self._last_intent and self._last_intent.get("stop"):
            return round(float(self._last_intent["stop"]), 8)
        p = entry_price * 0.015
        if side == "buy":
            return round(entry_price - p, 8)
        return round(entry_price + p, 8)

    def calculate_take_profit(self, entry_price: float, side: str) -> float:
        if self._last_intent and self._last_intent.get("take_profit"):
            return round(float(self._last_intent["take_profit"]), 8)
        sl = self.calculate_stop_loss(entry_price, side)
        risk = abs(entry_price - sl)
        if side == "buy":
            return round(entry_price + risk * 2, 8)
        return round(entry_price - risk * 2, 8)

    def calculate_position_size(self, balance: float, risk_pct: float = 1.0) -> float:
        if self._last_intent and self._last_intent.get("units"):
            return abs(float(self._last_intent["units"]))
        return super().calculate_position_size(balance, risk_pct)
