from pydantic import BaseModel, Field


class TradeExplanationTrade(BaseModel):
    trade_id: str = Field(..., max_length=64)
    symbol: str = Field(..., max_length=32)
    market: str = "crypto"
    side: str | None = Field(default=None, max_length=16)
    status: str | None = Field(default=None, max_length=24)
    opened_at: str | None = Field(default=None, max_length=40)
    closed_at: str | None = Field(default=None, max_length=40)
    entry_price: float | None = None
    exit_price: float | None = None
    stop_loss: float | None = None
    take_profit: float | None = None
    pnl: float | None = None
    quantity: float | None = None
    bot_id: str | None = Field(default=None, max_length=64)
    bot_type: str | None = Field(default=None, max_length=64)
    timeframe: str | None = Field(default=None, max_length=16)


class TradeExplanationRequest(BaseModel):
    trade: TradeExplanationTrade


class TradeExplanationResponse(BaseModel):
    summary: str
    why_it_happened: str
    lesson: str
    risk_note: str
    confidence: float = 0.0
    generated_by: str = "ai"
