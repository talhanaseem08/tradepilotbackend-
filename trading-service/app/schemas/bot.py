from pydantic import BaseModel


class BotCreate(BaseModel):
    bot_type: str
    symbol: str
    market: str = "forex"
    timeframe: str = "1h"
    parameters: dict = {}
    broker_mode: str = "paper"


class BotResponse(BaseModel):
    id: str
    bot_type: str
    symbol: str
    market: str
    timeframe: str
    parameters: dict
    status: str
    consecutive_losses: int = 0


class BotStatusUpdate(BaseModel):
    status: str
