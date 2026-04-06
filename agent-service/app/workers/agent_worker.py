import asyncio
import json
from app.config.redis import get_redis
from app.config.settings import settings
from app.services.deepseek_service import analyze_and_suggest
from app.schemas.reason import ReasonRequest
from app.utils.logger import get_logger

logger = get_logger()

TRIGGER_STREAM = "agent.trigger"
UPDATE_STREAM = "bot.update"

_worker_task: asyncio.Task | None = None


async def _ensure_stream_group():
    redis = await get_redis()
    try:
        await redis.xgroup_create(
            TRIGGER_STREAM,
            settings.agent_consumer_group,
            id="0",
            mkstream=True,
        )
    except Exception:
        pass


async def _process_trigger(data: dict):
    bot_id = data.get("bot_id", "")
    logger.info("agent trigger received", bot_id=bot_id)

    redis = await get_redis()
    await redis.set(f"bot:{bot_id}:status", "paused")

    request = ReasonRequest(
        bot_id=bot_id,
        bot_type=data.get("bot_type", "low_risk"),
        symbol=data.get("symbol", ""),
        market=data.get("market", "forex"),
        timeframe=data.get("timeframe", "1h"),
        current_parameters=json.loads(data.get("parameters", "{}")),
        consecutive_losses=int(data.get("consecutive_losses", 3)),
        recent_trades=json.loads(data.get("recent_trades", "[]")),
        market_summary=data.get("market_summary", ""),
    )

    response = await analyze_and_suggest(request)

    if response.success:
        await redis.xadd(UPDATE_STREAM, {
            "bot_id": bot_id,
            "new_parameters": json.dumps(response.new_parameters),
            "reasoning": response.reasoning,
        })
        logger.info("bot update published", bot_id=bot_id, params=response.new_parameters)
    else:
        logger.error("agent failed - bot stays paused", bot_id=bot_id, reason=response.reasoning)


async def _worker_loop():
    await _ensure_stream_group()
    redis = await get_redis()

    while True:
        try:
            messages = await redis.xreadgroup(
                groupname=settings.agent_consumer_group,
                consumername=settings.agent_consumer_name,
                streams={TRIGGER_STREAM: ">"},
                count=1,
                block=5000,
            )

            if not messages:
                continue

            for stream_name, stream_messages in messages:
                for msg_id, data in stream_messages:
                    try:
                        await _process_trigger(data)
                        await redis.xack(TRIGGER_STREAM, settings.agent_consumer_group, msg_id)
                    except Exception as e:
                        logger.error("trigger processing failed", msg_id=msg_id, error=str(e))

        except asyncio.CancelledError:
            break
        except Exception as e:
            logger.error("agent worker error", error=str(e))
            await asyncio.sleep(5)


def start_agent_worker():
    global _worker_task
    _worker_task = asyncio.create_task(_worker_loop())
    logger.info("agent worker started")


def stop_agent_worker():
    global _worker_task
    if _worker_task:
        _worker_task.cancel()
        _worker_task = None
        logger.info("agent worker stopped")
