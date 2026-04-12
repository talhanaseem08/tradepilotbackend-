from app.bots.base_bot import BaseBot
from app.bots.crypto_high_bot import CryptoHighBot
from app.bots.crypto_low_bot import CryptoLowBot
from app.bots.crypto_medium_bot import CryptoMediumBot
from app.bots.low_risk_orb_bot import LowRiskOrbBot
from app.bots.high_risk_orb_bot import HighRiskOrbBot
from app.bots.medium_risk_bos_bot import MediumRiskBosBot

BOT_REGISTRY: dict[str, type[BaseBot]] = {
    "low_risk": LowRiskOrbBot,        # M5 ORB - 1% of account balance per trade
    "medium_risk": MediumRiskBosBot,  # BOS Retest; SL 0.04%, TP 1.5R; % balance risk
    "high_risk": HighRiskOrbBot,      # M5 ORB - % of balance risk
    "crypto_low": CryptoLowBot,       # SMA/RSI/ATR (cryptobots low_risk port)
    "crypto_medium": CryptoMediumBot,  # OB + pivot (cryptobots medium_risk port)
    "crypto_high": CryptoHighBot,     # EMA/RSI/ATR (cryptobots high_risk port)
}


def create_bot(bot_type: str, symbol: str, timeframe: str, parameters: dict) -> BaseBot:
    bot_class = BOT_REGISTRY.get(bot_type)
    if not bot_class:
        raise ValueError(f"Unknown bot type: {bot_type}. Available: {list(BOT_REGISTRY.keys())}")
    return bot_class(symbol=symbol, timeframe=timeframe, parameters=parameters)


def list_bot_types() -> list[str]:
    return list(BOT_REGISTRY.keys())
