"""
Data Ingestion Worker — pre-fetches candles for all active bot symbols.
Execution worker reads from Redis cache first; live API only on cache miss.
"""
import asyncio
import json

from app.config.database import get_db
from app.config.redis import get_redis
from app.adapters.factory import create_data_provider
from app.services.broker_credentials import get_user_broker_credentials
from app.services.bot_selector import normalize_timeframe_for_bot
from app.services.cryptobots_runtime_adapter import (
    is_cryptobot_type,
    required_cryptobot_candle_count,
    supported_cryptobot_symbols,
)
from app.utils.logger import get_logger

logger = get_logger()

_ingestion_task: asyncio.Task | None = None

INGESTION_INTERVAL_SECONDS = 60
CANDLE_CACHE_TTL = 300  # 5 min — matches execution interval


def _cache_key(symbol: str, timeframe: str, market: str) -> str:
    return f"candles:{market}:{symbol.upper()}:{timeframe}"


def _scoped_cache_key(
    symbol: str,
    timeframe: str,
    market: str,
    user_id: str | None = None,
) -> str:
    if market == "forex" and user_id:
        return f"{_cache_key(symbol, timeframe, market)}:user:{user_id}"
    return _cache_key(symbol, timeframe, market)


async def get_cached_candles(
    symbol: str,
    timeframe: str,
    market: str,
    user_id: str | None = None,
) -> list[dict] | None:
    """Return cached candles or None on miss."""
    redis = await get_redis()
    raw = await redis.get(_scoped_cache_key(symbol, timeframe, market, user_id))
    if raw:
        return json.loads(raw)
    return None


async def _ingest_symbol(
    symbol: str,
    timeframe: str,
    market: str,
    strategy_type: str | None = None,
    user_id: str | None = None,
):
    credentials = await get_user_broker_credentials(user_id, market) if user_id else None
    if market == "forex" and not credentials:
        logger.warning(
            "ingestion skipped - no verified broker credentials",
            symbol=symbol,
            timeframe=timeframe,
            market=market,
            user_id=user_id,
        )
        return

    provider = create_data_provider(market, credentials)
    try:
        candle_count = (
            required_cryptobot_candle_count(strategy_type)
            if strategy_type and is_cryptobot_type(strategy_type)
            else 100
        )
        candles = await provider.fetch_candles(symbol, timeframe, count=candle_count)
        if candles:
            redis = await get_redis()
            await redis.set(
                _scoped_cache_key(symbol, timeframe, market, user_id),
                json.dumps(candles),
                ex=CANDLE_CACHE_TTL,
            )
            logger.debug("candles ingested", symbol=symbol,
                         timeframe=timeframe, market=market, user_id=user_id, count=len(candles))
    except Exception as e:
        logger.warning(
            "ingestion failed",
            symbol=symbol,
            timeframe=timeframe,
            market=market,
            user_id=user_id,
            error=str(e),
        )
    finally:
        if hasattr(provider, "close"):
            await provider.close()


async def _ingestion_cycle():
    db = get_db()
    if db is None:
        return

    active_bots = await db.bot_instances.find(
        {"status": "active"},
        {"assetPair": 1, "timeframe": 1, "market": 1, "strategyType": 1, "userID": 1},
    ).to_list(None)

    if not active_bots:
        return

    # Deduplicate — multiple bots can share the same symbol/timeframe/market
    seen: set[tuple] = set()
    tasks = []
    for bot in active_bots:
        timeframe = bot.get("timeframe", "1h")
        market = bot.get("market", "forex")
        strategy_type = bot.get("strategyType")
        timeframe = normalize_timeframe_for_bot(strategy_type, market, timeframe)
        user_id = str(bot.get("userID")) if bot.get("userID") is not None else None
        if strategy_type and is_cryptobot_type(strategy_type):
            symbols = supported_cryptobot_symbols(strategy_type) or [bot["assetPair"]]
        else:
            symbols = [bot["assetPair"]]

        for symbol in symbols:
            key = (
                symbol,
                timeframe,
                market,
                strategy_type,
                user_id if market == "forex" else None,
            )
            if key not in seen:
                seen.add(key)
                tasks.append(_ingest_symbol(*key))

    logger.info("ingestion cycle", unique_feeds=len(tasks))
    await asyncio.gather(*tasks, return_exceptions=True)


async def _ingestion_loop():
    while True:
        try:
            await _ingestion_cycle()
        except asyncio.CancelledError:
            break
        except Exception as e:
            logger.error("ingestion loop crashed", error=str(e))
        await asyncio.sleep(INGESTION_INTERVAL_SECONDS)


def start_ingestion_worker():
    global _ingestion_task
    _ingestion_task = asyncio.create_task(_ingestion_loop())
    logger.info("data ingestion worker started", interval=INGESTION_INTERVAL_SECONDS)


def stop_ingestion_worker():
    global _ingestion_task
    if _ingestion_task:
        _ingestion_task.cancel()
        _ingestion_task = None
        logger.info("data ingestion worker stopped")
