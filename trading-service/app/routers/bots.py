from fastapi import APIRouter, HTTPException
from app.schemas.bot import BotCreate, BotResponse, BotStatusUpdate
from app.bots.registry import create_bot, list_bot_types
from app.core.redis_client import set_bot_status, get_bot_status, store_bot_params, get_losses, get_bot_params
from app.utils.logger import get_logger
import uuid

logger = get_logger()
router = APIRouter(prefix="/bots", tags=["bots"])


@router.get("/types")
async def get_bot_types():
    return {"bot_types": list_bot_types()}


@router.post("/", response_model=BotResponse)
async def create_new_bot(request: BotCreate):
    try:
        bot = create_bot(request.bot_type, request.symbol, request.timeframe, request.parameters)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    bot_id = str(uuid.uuid4())[:8]
    await set_bot_status(bot_id, "active")
    await store_bot_params(bot_id, bot.get_parameters())

    return BotResponse(
        id=bot_id,
        bot_type=request.bot_type,
        symbol=request.symbol,
        market=request.market,
        timeframe=request.timeframe,
        parameters=bot.get_parameters(),
        status="active",
    )


@router.get("/{bot_id}")
async def get_bot(bot_id: str):
    status = await get_bot_status(bot_id)
    params = await get_bot_params(bot_id)
    losses = await get_losses(bot_id)

    return {
        "id": bot_id,
        "status": status,
        "parameters": params,
        "consecutive_losses": losses,
    }


@router.patch("/{bot_id}/status")
async def update_bot_status(bot_id: str, update: BotStatusUpdate):
    if update.status not in ("active", "paused", "stopped"):
        raise HTTPException(status_code=400, detail="Invalid status")
    await set_bot_status(bot_id, update.status)
    return {"bot_id": bot_id, "status": update.status}
