from app.core.redis_client import increment_losses, reset_losses, get_losses, set_bot_status
from app.utils.logger import get_logger

logger = get_logger()

LOSS_THRESHOLD = 3


async def record_trade_result(bot_id: str, pnl: float) -> dict:
    """Records trade result and returns action needed."""
    if pnl >= 0:
        await reset_losses(bot_id)
        logger.info("winning trade recorded", bot_id=bot_id, pnl=pnl)
        return {"action": "continue", "consecutive_losses": 0}

    loss_count = await increment_losses(bot_id)
    logger.warning("losing trade recorded", bot_id=bot_id, pnl=pnl,
                    consecutive_losses=loss_count)

    if loss_count >= LOSS_THRESHOLD:
        await set_bot_status(bot_id, "paused")
        logger.error("LOSS THRESHOLD reached - bot paused, agent trigger needed",
                      bot_id=bot_id, consecutive_losses=loss_count)
        return {
            "action": "trigger_agent",
            "consecutive_losses": loss_count,
        }

    return {"action": "continue", "consecutive_losses": loss_count}
