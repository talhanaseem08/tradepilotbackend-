import json
from datetime import datetime, timezone, timedelta
from app.config.redis import get_redis
from app.config.settings import settings
from app.schemas.news import NewsItem, NewsResponse
from app.scrapers.forexfactory import ForexFactoryScraper
from app.scrapers.cointelegraph import CoinTelegraphScraper
from app.scrapers.x_scraper import XScraper
from app.utils.logger import get_logger

logger = get_logger()

forexfactory = ForexFactoryScraper()
cointelegraph = CoinTelegraphScraper()
x_scraper = XScraper()

FOREX_SYMBOLS = ["EURUSD", "GBPUSD", "USDJPY", "USDCHF", "AUDUSD", "USDCAD", "NZDUSD"]
CRYPTO_SYMBOLS = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT", "XRPUSDT"]


def _is_forex(symbol: str) -> bool:
    return symbol.upper() in FOREX_SYMBOLS or len(symbol) == 6 and symbol.isalpha()


async def get_cached_news(symbol: str) -> list[NewsItem]:
    redis = await get_redis()
    key = f"news:{symbol.upper()}:latest"
    raw_items = await redis.lrange(key, 0, 49)
    items = []
    for raw in raw_items:
        try:
            items.append(NewsItem(**json.loads(raw)))
        except Exception:
            continue
    return items


async def cache_news(symbol: str, items: list[NewsItem]):
    if not items:
        return
    redis = await get_redis()
    key = f"news:{symbol.upper()}:latest"
    pipe = redis.pipeline()
    pipe.delete(key)
    for item in items[:50]:
        pipe.rpush(key, item.model_dump_json())
    pipe.expire(key, settings.news_max_age_hours * 3600)
    await pipe.execute()


async def fetch_and_cache_news(symbol: str) -> list[NewsItem]:
    all_items = []

    if _is_forex(symbol):
        ff_items = await forexfactory.fetch_news(symbol)
        x_items = await x_scraper.fetch_news(symbol)
        all_items = ff_items + x_items
    else:
        ct_items = await cointelegraph.fetch_news(symbol)
        x_items = await x_scraper.fetch_news(symbol)
        all_items = ct_items + x_items

    await cache_news(symbol, all_items)
    logger.info("news fetched and cached", symbol=symbol, count=len(all_items))
    return all_items


async def get_news_for_symbol(symbol: str) -> NewsResponse:
    items = await get_cached_news(symbol)
    if not items:
        items = await fetch_and_cache_news(symbol)
    return NewsResponse(symbol=symbol, news=items, count=len(items))


async def get_headlines_and_sources(symbol: str) -> tuple[list[str], dict[str, int]]:
    items = await get_cached_news(symbol)
    if not items:
        items = await fetch_and_cache_news(symbol)

    headlines = [item.title for item in items]
    sources: dict[str, int] = {}
    for item in items:
        sources[item.source] = sources.get(item.source, 0) + 1

    return headlines, sources
