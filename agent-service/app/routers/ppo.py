"""
PPO Training Endpoints
-----------------------
POST /ppo/train          : trigger background training for a bot type
GET  /ppo/status         : check training status + model existence per bot type
"""
from __future__ import annotations

import os

from fastapi import APIRouter, BackgroundTasks, HTTPException
from pydantic import BaseModel

from app.config.database import get_db
from app.services.ppo_service import model_path, train_ppo_async
from app.utils.logger import get_logger

logger = get_logger()
router = APIRouter(prefix="/ppo", tags=["ppo"])

VALID_BOT_TYPES = ("low_risk", "medium_risk", "high_risk")

# In-process training status — lightweight; resets on restart (acceptable for FYP)
_status: dict[str, str] = {}  # bot_type → "idle" | "training" | "done" | "failed"


class TrainRequest(BaseModel):
    bot_type: str
    limit: int = 500  # number of recent closed trades to train on


@router.post("/train")
async def trigger_training(req: TrainRequest, background_tasks: BackgroundTasks):
    if req.bot_type not in VALID_BOT_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid bot_type. Must be one of {VALID_BOT_TYPES}",
        )

    if _status.get(req.bot_type) == "training":
        return {"status": "already_training", "bot_type": req.bot_type}

    _status[req.bot_type] = "training"

    async def _run_training() -> None:
        db     = get_db()
        trades = []

        if db is not None:
            cursor = (
                db.trade_records
                .find({"botType": req.bot_type, "status": "closed"})
                .sort("timestamp", -1)
                .limit(req.limit)
            )
            async for doc in cursor:
                trades.append(doc)

        logger.info("ppo training starting",
                    bot_type=req.bot_type, trade_count=len(trades))

        result = await train_ppo_async(req.bot_type, trades)
        _status[req.bot_type] = "done" if result["success"] else "failed"

        if not result["success"]:
            logger.error("ppo training failed in background",
                         bot_type=req.bot_type, error=result.get("error"))

    background_tasks.add_task(_run_training)
    return {"status": "training_started", "bot_type": req.bot_type}


@router.get("/status")
async def get_ppo_status():
    statuses = {}
    for bot_type in VALID_BOT_TYPES:
        path = model_path(bot_type)
        statuses[bot_type] = {
            "training_status": _status.get(bot_type, "idle"),
            "model_exists":    os.path.exists(path),
            "model_path":      path if os.path.exists(path) else None,
        }
    return {"ppo_status": statuses}
