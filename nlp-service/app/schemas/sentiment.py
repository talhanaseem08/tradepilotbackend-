from pydantic import BaseModel


class SentimentRequest(BaseModel):
    symbol: str
    market: str = "forex"


class SentimentResponse(BaseModel):
    symbol: str
    sentiment_score: float
    sentiment_label: str
    news_count: int
    top_headlines: list[str] = []
    source_breakdown: dict[str, int] = {}
    timestamp: str
