import asyncio
import json
from app.config.redis import get_redis
from app.core.redis_client import set_bot_status, store_bot_params
from app.utils.logger import get_logger

logger = get_logger()

UPDATE_STREAM = "bot.update"
CONSUMER_GROUP = "trading-workers"
CONSUMER_NAME = "trading-1"

_worker_task: asyncio.Task | None = None


async def _ensure_stream_group():
    redis = await get_redis()
    try:
        await redis.xgroup_create(UPDATE_STREAM, CONSUMER_GROUP, id="0", mkstream=True)
    except Exception:
        pass


async def _process_update(data: dict):
    bot_id = data.get("bot_id", "")
    new_params = json.loads(data.get("new_parameters", "{}"))
    reasoning = data.get("reasoning", "")

    logger.info("bot update received", bot_id=bot_id, reasoning=reasoning[:100])

    await store_bot_params(bot_id, new_params)
    await set_bot_status(bot_id, "active")

    logger.info("bot resumed with new parameters", bot_id=bot_id, params=new_params)


async def _worker_loop():
    await _ensure_stream_group()
    redis = await get_redis()

    while True:
        try:
            messages = await redis.xreadgroup(
                groupname=CONSUMER_GROUP,
                consumername=CONSUMER_NAME,
                streams={UPDATE_STREAM: ">"},
                count=1,
                block=5000,
            )

            if not messages:
                continue

            for stream_name, stream_messages in messages:
                for msg_id, data in stream_messages:
                    try:
                        await _process_update(data)
                        await redis.xack(UPDATE_STREAM, CONSUMER_GROUP, msg_id)
                    except Exception as e:
                        logger.error("update processing failed",
                                     msg_id=msg_id, error=str(e))

        except asyncio.CancelledError:
            break
        except Exception as e:
            logger.error("update worker error", error=str(e))
            await asyncio.sleep(5)


def start_update_worker():
    global _worker_task
    _worker_task = asyncio.create_task(_worker_loop())
    logger.info("bot update worker started")


def stop_update_worker():
    global _worker_task
    if _worker_task:
        _worker_task.cancel()
        _worker_task = None
        logger.info("bot update worker stopped")
