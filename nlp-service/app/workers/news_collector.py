import asyncio
from app.config.settings import settings
from app.services.news_service import fetch_and_cache_news, FOREX_SYMBOLS, CRYPTO_SYMBOLS
from app.utils.logger import get_logger

logger = get_logger()

_collector_task: asyncio.Task | None = None


async def _collection_loop():
    while True:
        try:
            logger.info("news collection cycle starting")
            all_symbols = FOREX_SYMBOLS + CRYPTO_SYMBOLS
            for symbol in all_symbols:
                try:
                    await fetch_and_cache_news(symbol)
                    await asyncio.sleep(2)
                except Exception as e:
                    logger.error("failed to fetch news", symbol=symbol, error=str(e))
            logger.info("news collection cycle complete")
        except Exception as e:
            logger.error("news collection cycle failed", error=str(e))

        await asyncio.sleep(settings.news_fetch_interval_minutes * 60)


def start_news_collector():
    global _collector_task
    _collector_task = asyncio.create_task(_collection_loop())
    logger.info("news collector started", interval_min=settings.news_fetch_interval_minutes)


def stop_news_collector():
    global _collector_task
    if _collector_task:
        _collector_task.cancel()
        _collector_task = None
        logger.info("news collector stopped")
