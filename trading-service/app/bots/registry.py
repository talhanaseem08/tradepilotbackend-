from app.bots.base_bot import BaseBot
from app.bots.low_risk_bot import LowRiskBot

BOT_REGISTRY: dict[str, type[BaseBot]] = {
    "low_risk": LowRiskBot,
}


def create_bot(bot_type: str, symbol: str, timeframe: str, parameters: dict) -> BaseBot:
    bot_class = BOT_REGISTRY.get(bot_type)
    if not bot_class:
        raise ValueError(f"Unknown bot type: {bot_type}. Available: {list(BOT_REGISTRY.keys())}")
    return bot_class(symbol=symbol, timeframe=timeframe, parameters=parameters)


def list_bot_types() -> list[str]:
    return list(BOT_REGISTRY.keys())
