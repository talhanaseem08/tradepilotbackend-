import json
from app.config.redis import get_redis
from app.utils.logger import get_logger

logger = get_logger()

TRIGGER_STREAM = "agent.trigger"
UPDATE_STREAM = "bot.update"


async def publish_agent_trigger(
    bot_id: str,
    bot_type: str,
    symbol: str,
    market: str,
    timeframe: str,
    parameters: dict,
    consecutive_losses: int,
    recent_trades: list[dict],
) -> str:
    redis = await get_redis()

    msg_id = await redis.xadd(TRIGGER_STREAM, {
        "bot_id": bot_id,
        "bot_type": bot_type,
        "symbol": symbol,
        "market": market,
        "timeframe": timeframe,
        "parameters": json.dumps(parameters),
        "consecutive_losses": str(consecutive_losses),
        "recent_trades": json.dumps(recent_trades[-10:]),
    })

    logger.info("agent trigger published", bot_id=bot_id,
                 consecutive_losses=consecutive_losses, msg_id=msg_id)
    return msg_id
