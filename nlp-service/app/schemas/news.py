from pydantic import BaseModel


class NewsItem(BaseModel):
    title: str
    source: str
    symbol: str | None = None
    published_at: str | None = None
    url: str | None = None
    impact: str | None = None


class NewsResponse(BaseModel):
    symbol: str
    news: list[NewsItem] = []
    count: int = 0
