"""Crypto low-risk bot — SMA50/200 + RSI + ATR (cryptobots low_risk port)."""
from __future__ import annotations

from app.bots.base_bot import BaseBot
from app.bots.crypto import analyze_crypto_low_intent, candles_to_ohlc_df


class CryptoLowBot(BaseBot):
    def __init__(self, symbol: str, timeframe: str, parameters: dict):
        defaults = {
            "long_only": True,
            "rsi_low": 48,
            "rsi_high": 68,
            "stop_atr_mult": 2.0,
            "tp_atr_mult": 5.0,
            "risk_per_trade_usd": 10_000.0,
        }
        defaults.update(parameters or {})
        super().__init__(symbol, timeframe, defaults)
        self._last_intent: dict | None = None

    def analyze(self, candles: list[dict]) -> str:
        if len(candles) < 210:
            return "hold"
        df = candles_to_ohlc_df(candles)
        self._last_intent = analyze_crypto_low_intent(df, self.parameters)
        if not self._last_intent:
            return "hold"
        return "buy" if self._last_intent["side"] == "LONG" else "sell"

    def calculate_stop_loss(self, entry_price: float, side: str) -> float:
        if self._last_intent and self._last_intent.get("stop"):
            return round(float(self._last_intent["stop"]), 8)
        atr_fallback = entry_price * 0.02
        if side == "buy":
            return round(entry_price - atr_fallback, 8)
        return round(entry_price + atr_fallback, 8)

    def calculate_take_profit(self, entry_price: float, side: str) -> float:
        if self._last_intent and self._last_intent.get("take_profit"):
            return round(float(self._last_intent["take_profit"]), 8)
        sl = self.calculate_stop_loss(entry_price, side)
        risk = abs(entry_price - sl)
        if side == "buy":
            return round(entry_price + risk * 2.5, 8)
        return round(entry_price - risk * 2.5, 8)

    def calculate_position_size(self, balance: float, risk_pct: float = 1.0) -> float:
        if self._last_intent and self._last_intent.get("units"):
            return abs(float(self._last_intent["units"]))
        return super().calculate_position_size(balance, risk_pct)
