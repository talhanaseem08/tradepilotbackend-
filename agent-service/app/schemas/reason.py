from pydantic import BaseModel


class ReasonRequest(BaseModel):
    bot_id: str
    bot_type: str
    symbol: str
    market: str = "forex"
    timeframe: str = "1h"
    current_parameters: dict = {}
    consecutive_losses: int = 3
    recent_trades: list[dict] = []
    market_summary: str = ""


class ReasonResponse(BaseModel):
    bot_id: str
    new_parameters: dict = {}
    reasoning: str = ""
    success: bool = False
