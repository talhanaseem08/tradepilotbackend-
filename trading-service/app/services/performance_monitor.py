from app.core.redis_client import increment_losses, reset_losses, set_bot_status
from app.services.agent_trigger import publish_agent_trigger
from app.utils.logger import get_logger

logger = get_logger()

LOSS_THRESHOLD = 3


async def record_trade_result(
    bot_id: str,
    pnl: float,
    bot_type: str = "",
    symbol: str = "",
    market: str = "forex",
    timeframe: str = "1h",
    parameters: dict | None = None,
    recent_trades: list[dict] | None = None,
) -> dict:
    if pnl >= 0:
        await reset_losses(bot_id)
        logger.info("winning trade recorded", bot_id=bot_id, pnl=pnl)
        return {"action": "continue", "consecutive_losses": 0}

    loss_count = await increment_losses(bot_id)
    logger.warning("losing trade recorded", bot_id=bot_id, pnl=pnl,
                    consecutive_losses=loss_count)

    if loss_count >= LOSS_THRESHOLD:
        await set_bot_status(bot_id, "paused")
        logger.error("LOSS THRESHOLD reached - bot paused, triggering agent",
                      bot_id=bot_id, consecutive_losses=loss_count)

        await publish_agent_trigger(
            bot_id=bot_id,
            bot_type=bot_type,
            symbol=symbol,
            market=market,
            timeframe=timeframe,
            parameters=parameters or {},
            consecutive_losses=loss_count,
            recent_trades=recent_trades or [],
        )

        return {"action": "trigger_agent", "consecutive_losses": loss_count}

    return {"action": "continue", "consecutive_losses": loss_count}
