from app.config.redis import get_redis
from app.utils.logger import get_logger

logger = get_logger()


async def set_bot_status(bot_id: str, status: str):
    redis = await get_redis()
    await redis.set(f"bot:{bot_id}:status", status)


async def get_bot_status(bot_id: str) -> str:
    redis = await get_redis()
    status = await redis.get(f"bot:{bot_id}:status")
    return status or "stopped"


async def increment_losses(bot_id: str) -> int:
    redis = await get_redis()
    count = await redis.incr(f"bot:{bot_id}:losses")
    return count


async def reset_losses(bot_id: str):
    redis = await get_redis()
    await redis.set(f"bot:{bot_id}:losses", 0)


async def get_losses(bot_id: str) -> int:
    redis = await get_redis()
    val = await redis.get(f"bot:{bot_id}:losses")
    return int(val) if val else 0


async def store_bot_params(bot_id: str, params: dict):
    redis = await get_redis()
    await redis.hset(f"bot:{bot_id}:params", mapping={k: str(v) for k, v in params.items()})


async def get_bot_params(bot_id: str) -> dict:
    redis = await get_redis()
    raw = await redis.hgetall(f"bot:{bot_id}:params")
    return dict(raw) if raw else {}


async def backup_bot_params(bot_id: str):
    """Snapshot current params to :params:backup before applying new ones."""
    redis = await get_redis()
    current = await redis.hgetall(f"bot:{bot_id}:params")
    if current:
        await redis.delete(f"bot:{bot_id}:params:backup")
        await redis.hset(f"bot:{bot_id}:params:backup", mapping=current)


async def get_backup_params(bot_id: str) -> dict:
    redis = await get_redis()
    raw = await redis.hgetall(f"bot:{bot_id}:params:backup")
    return dict(raw) if raw else {}


async def set_bot_runtime_value(bot_id: str, key: str, value: str):
    redis = await get_redis()
    await redis.set(f"bot:{bot_id}:runtime:{key}", value)


async def get_bot_runtime_value(bot_id: str, key: str) -> str | None:
    redis = await get_redis()
    value = await redis.get(f"bot:{bot_id}:runtime:{key}")
    return value or None


async def delete_bot_state(bot_id: str):
    redis = await get_redis()
    keys = [
        f"bot:{bot_id}:status",
        f"bot:{bot_id}:losses",
        f"bot:{bot_id}:params",
        f"bot:{bot_id}:params:backup",
    ]
    runtime_keys = await redis.keys(f"bot:{bot_id}:runtime:*")
    if runtime_keys:
        keys.extend(runtime_keys)
    if keys:
        await redis.delete(*keys)
