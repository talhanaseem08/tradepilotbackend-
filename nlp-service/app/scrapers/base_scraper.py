from abc import ABC, abstractmethod
from app.schemas.news import NewsItem


class BaseScraper(ABC):
    @property
    @abstractmethod
    def source_name(self) -> str:
        pass

    @abstractmethod
    async def fetch_news(self, symbol: str | None = None) -> list[NewsItem]:
        pass
