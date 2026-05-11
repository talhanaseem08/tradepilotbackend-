import asyncio
import json
import httpx
from app.config.redis import get_redis
from app.config.database import get_db
from app.config.settings import settings
from app.services.deepseek_service import analyze_and_suggest
from app.services.ppo_service import build_trade_stats, suggest_parameters_async, PARAM_BOUNDS
from app.schemas.reason import ReasonRequest
from app.models.optimization_log import create_optimization_log
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


async def _blend_params(
    bot_type: str,
    deepseek_params: dict,
    current_params: dict,
    recent_trades: list[dict],
    consecutive_losses: int,
) -> dict:
    """
    Blend DeepSeek suggestions (60%) with PPO suggestions (40%).
    PPO only covers the 3 managed keys per bot type; remaining keys come from DeepSeek.
    Falls back to pure DeepSeek if no PPO model exists yet.
    """
    trade_stats = build_trade_stats(recent_trades)
    trade_stats["consecutive_losses"] = consecutive_losses

    ppo_params = await suggest_parameters_async(bot_type, current_params, trade_stats)

    if not ppo_params:
        return deepseek_params

    blended = dict(deepseek_params)
    for key in PARAM_BOUNDS.get(bot_type, {}):
        if key in deepseek_params and key in ppo_params:
            blended[key] = round(
                float(deepseek_params[key]) * 0.6 + float(ppo_params[key]) * 0.4, 6
            )

    logger.info("ppo blending applied", bot_type=bot_type, blended_keys=list(ppo_params))
    return blended


async def _write_finetuned_bot(
    bot_id: str,
    bot_type: str,
    old_parameters: dict,
    new_parameters: dict,
    reasoning: str,
    consecutive_losses: int,
) -> None:
    """Call trading-service to write a finetuned bot file on disk."""
    url = f"{settings.trading_service_url}/bots/finetune"
    payload = {
        "bot_id": bot_id,
        "bot_type": bot_type,
        "old_parameters": old_parameters,
        "new_parameters": new_parameters,
        "reasoning": reasoning,
        "consecutive_losses": consecutive_losses,
    }
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(url, json=payload)
            resp.raise_for_status()
            data = resp.json()
            logger.info(
                "finetuned bot file created",
                bot_id=bot_id,
                file_path=data.get("file_path"),
            )
    except Exception as exc:
        logger.error("finetuned bot write request failed", bot_id=bot_id, error=str(exc))


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
        # Blend DeepSeek output with PPO suggestions
        final_params = await _blend_params(
            bot_type=request.bot_type,
            deepseek_params=response.new_parameters,
            current_params=request.current_parameters,
            recent_trades=request.recent_trades,
            consecutive_losses=request.consecutive_losses,
        )

        await redis.xadd(UPDATE_STREAM, {
            "bot_id": bot_id,
            "new_parameters": json.dumps(final_params),
            "reasoning": response.reasoning,
        })
        logger.info("bot update published", bot_id=bot_id, params=final_params)

        # Save optimization log to MongoDB
        db = get_db()
        if db is not None:
            log = create_optimization_log(
                bot_id=bot_id,
                trigger_event="consecutive_losses_threshold",
                old_parameters=request.current_parameters,
                new_parameters=final_params,
                reasoning=response.reasoning,
                consecutive_losses=request.consecutive_losses,
            )
            await db.optimization_logs.insert_one(log)
            logger.info("optimization log saved", bot_id=bot_id)

        # Write finetuned bot file via trading-service
        await _write_finetuned_bot(
            bot_id=bot_id,
            bot_type=request.bot_type,
            old_parameters=request.current_parameters,
            new_parameters=final_params,
            reasoning=response.reasoning,
            consecutive_losses=request.consecutive_losses,
        )
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
