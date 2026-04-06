from pydantic import BaseModel


class TradeSignal(BaseModel):
    action: str
    symbol: str
    price: float = 0.0
    stop_loss: float = 0.0
    take_profit: float = 0.0
    quantity: float = 0.0


class TradeResult(BaseModel):
    order_id: str | None = None
    symbol: str
    side: str
    entry_price: float
    quantity: float
    status: str
    sentiment_score: float | None = None
    sentiment_label: str | None = None
