from fastapi import APIRouter, HTTPException
from app.schemas.bot import BotCreate, BotResponse, BotStatusUpdate
from app.bots.registry import create_bot, list_bot_types
from app.services.bot_selector import normalize_timeframe_for_bot, select_bot
from app.core.redis_client import (
    set_bot_status,
    get_bot_status,
    store_bot_params,
    get_losses,
    get_bot_params,
    backup_bot_params,
    get_backup_params,
    delete_bot_state,
)
from app.models.bot_instance import create_bot_instance, update_bot_status_doc, update_bot_parameters_doc
from app.config.database import get_db
from app.utils.logger import get_logger
import uuid

logger = get_logger()
router = APIRouter(prefix="/bots", tags=["bots"])


@router.post("/from-parse", response_model=BotResponse)
async def create_bot_from_parse(payload: dict):
    """
    Auto-create a bot from an NLP parse result.
    Expects the raw parse result dict plus optional user_id and broker_mode.
    """
    user_id = payload.pop("user_id", None)
    broker_mode = payload.pop("broker_mode", "paper")

    selected = select_bot(payload)
    request = BotCreate(
        bot_type=selected["bot_type"],
        symbol=selected["symbol"],
        market=selected["market"],
        timeframe=selected["timeframe"],
        parameters=selected["parameters"],
        broker_mode=broker_mode,
        user_id=user_id,
    )

    try:
        bot = create_bot(request.bot_type, request.symbol, request.timeframe, request.parameters)
    except ValueError as e:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail=str(e))

    import uuid
    bot_id = str(uuid.uuid4())[:8]

    await set_bot_status(bot_id, "active")
    await store_bot_params(bot_id, bot.get_parameters())

    db = get_db()
    if db is not None:
        from app.models.bot_instance import create_bot_instance
        doc = create_bot_instance(
            bot_id=bot_id,
            user_id=user_id,
            strategy_type=request.bot_type,
            asset_pair=request.symbol,
            market=request.market,
            timeframe=request.timeframe,
            parameters=bot.get_parameters(),
        )
        await db.bot_instances.insert_one(doc)
        logger.info("bot auto-created from parse", bot_id=bot_id, strategy=request.bot_type)

    return BotResponse(
        id=bot_id,
        bot_type=request.bot_type,
        symbol=request.symbol,
        market=request.market,
        timeframe=request.timeframe,
        parameters=bot.get_parameters(),
        status="active",
    )


@router.get("/types")
async def get_bot_types():
    return {"bot_types": list_bot_types()}


@router.post("/", response_model=BotResponse)
async def create_new_bot(request: BotCreate):
    request.timeframe = normalize_timeframe_for_bot(
        request.bot_type,
        request.market,
        request.timeframe,
    )
    try:
        bot = create_bot(request.bot_type, request.symbol, request.timeframe, request.parameters)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    bot_id = str(uuid.uuid4())[:8]

    # Persist state in Redis
    await set_bot_status(bot_id, "active")
    await store_bot_params(bot_id, bot.get_parameters())

    # Persist bot instance in MongoDB
    db = get_db()
    if db is not None:
        doc = create_bot_instance(
            bot_id=bot_id,
            user_id=request.user_id,
            strategy_type=request.bot_type,
            asset_pair=request.symbol,
            market=request.market,
            timeframe=request.timeframe,
            parameters=bot.get_parameters(),
        )
        await db.bot_instances.insert_one(doc)
        logger.info("bot instance saved to mongodb", bot_id=bot_id, strategy=request.bot_type)

    return BotResponse(
        id=bot_id,
        bot_type=request.bot_type,
        symbol=request.symbol,
        market=request.market,
        timeframe=request.timeframe,
        parameters=bot.get_parameters(),
        status="active",
    )


@router.get("/")
async def list_bots(user_id: str = None):
    db = get_db()
    if db is None:
        raise HTTPException(status_code=503, detail="Database not connected")

    query = {}
    if user_id:
        query["userID"] = user_id

    cursor = db.bot_instances.find(query).sort("createdAt", -1)
    bots = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        bots.append(doc)

    return {"bots": bots, "count": len(bots)}


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

    db = get_db()
    if db is not None:
        await db.bot_instances.update_one(
            {"botID": bot_id},
            update_bot_status_doc(bot_id, update.status),
        )

    return {"bot_id": bot_id, "status": update.status}


@router.post("/{bot_id}/rollback")
async def rollback_bot_params(bot_id: str):
    backup = await get_backup_params(bot_id)

    if not backup:
        raise HTTPException(
            status_code=404,
            detail="No backup found. Bot has never been optimized or backup was cleared."
        )

    # Snapshot current (optimized) params before restoring
    await backup_bot_params(bot_id)
    await store_bot_params(bot_id, backup)

    db = get_db()
    if db is not None:
        await db.bot_instances.update_one(
            {"botID": bot_id},
            update_bot_parameters_doc(backup, 0),
        )

    logger.info("bot parameters rolled back", bot_id=bot_id, restored_params=backup)

    return {
        "bot_id": bot_id,
        "status": "rolled_back",
        "restored_parameters": backup,
    }


@router.delete("/{bot_id}")
async def delete_bot(bot_id: str, user_id: str | None = None):
    db = get_db()
    if db is None:
        raise HTTPException(status_code=503, detail="Database not connected")

    query = {"botID": bot_id}
    if user_id:
        query["userID"] = user_id

    bot = await db.bot_instances.find_one(query)
    if not bot:
        raise HTTPException(status_code=404, detail="Bot not found")

    await delete_bot_state(bot_id)
    await db.bot_instances.delete_one({"_id": bot["_id"]})

    logger.info("bot deleted", bot_id=bot_id, user_id=bot.get("userID"))

    return {"bot_id": bot_id, "status": "deleted"}
