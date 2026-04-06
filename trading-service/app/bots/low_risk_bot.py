from app.bots.base_bot import BaseBot
from app.utils.indicators import calculate_rsi, calculate_ema


class LowRiskBot(BaseBot):
    """Sample bot using RSI + EMA crossover. Will be replaced with real strategy."""

    def __init__(self, symbol: str, timeframe: str, parameters: dict):
        defaults = {
            "rsi_period": 14,
            "ema_fast": 9,
            "ema_slow": 21,
            "rsi_oversold": 30,
            "rsi_overbought": 70,
            "stop_loss_pips": 30,
            "take_profit_pips": 60,
        }
        defaults.update(parameters)
        super().__init__(symbol, timeframe, defaults)

    def analyze(self, candles: list[dict]) -> str:
        if len(candles) < self.parameters["ema_slow"] + 5:
            return "hold"

        closes = [c["close"] for c in candles]
        rsi = calculate_rsi(closes, self.parameters["rsi_period"])
        ema_fast = calculate_ema(closes, self.parameters["ema_fast"])
        ema_slow = calculate_ema(closes, self.parameters["ema_slow"])

        if rsi is None or ema_fast is None or ema_slow is None:
            return "hold"

        if rsi < self.parameters["rsi_oversold"] and ema_fast > ema_slow:
            return "buy"
        elif rsi > self.parameters["rsi_overbought"] and ema_fast < ema_slow:
            return "sell"

        return "hold"

    def calculate_stop_loss(self, entry_price: float, side: str) -> float:
        pips = self.parameters["stop_loss_pips"] * 0.0001
        if side == "buy":
            return round(entry_price - pips, 5)
        return round(entry_price + pips, 5)

    def calculate_take_profit(self, entry_price: float, side: str) -> float:
        pips = self.parameters["take_profit_pips"] * 0.0001
        if side == "buy":
            return round(entry_price + pips, 5)
        return round(entry_price - pips, 5)
