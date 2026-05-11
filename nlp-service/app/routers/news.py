from fastapi import APIRouter

from app.schemas.news import NewsItem, NewsResponse
from app.services.news_service import cointelegraph, forexfactory, get_news_for_symbol

router = APIRouter()


@router.get("/news/forex-calendar")
async def forex_calendar():
    """
    Forex Factory calendar data (CSV cache + scraper via `ForexFactoryScraper`).
    No symbol filter — full month list.
    """
    items: list[NewsItem] = await forexfactory.fetch_news(None)
    return {
        "source": "forexfactory",
        "items": [i.model_dump() for i in items],
        "count": len(items),
    }


@router.get("/news/crypto")
async def crypto_headlines():
    """
    Crypto headlines from CoinTelegraph RSS (`CoinTelegraphScraper`).
    """
    items: list[NewsItem] = await cointelegraph.fetch_news(None)
    return {
        "source": "cointelegraph",
        "articles": [i.model_dump() for i in items],
        "count": len(items),
    }


@router.get("/news/{symbol}", response_model=NewsResponse)
async def get_news(symbol: str):
    return await get_news_for_symbol(symbol.upper())
