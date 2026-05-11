"""POST /bots/finetune — called by agent-service after parameter blending."""
from __future__ import annotations

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.config.database import get_db
from app.models.finetuned_bot import create_finetuned_bot_record
from app.services.finetuned_bot_writer import write_finetuned_bot
from app.utils.logger import get_logger

router = APIRouter(prefix="/bots", tags=["finetuned"])
logger = get_logger()


class FinetuneRequest(BaseModel):
    bot_id: str
    bot_type: str
    old_parameters: dict
    new_parameters: dict
    reasoning: str
    consecutive_losses: int = 3


class FinetuneResponse(BaseModel):
    bot_id: str
    file_path: str
    message: str


@router.post("/finetune", response_model=FinetuneResponse)
async def create_finetuned_bot(req: FinetuneRequest) -> FinetuneResponse:
    try:
        file_path = write_finetuned_bot(
            bot_type=req.bot_type,
            bot_id=req.bot_id,
            final_params=req.new_parameters,
            reasoning=req.reasoning,
            consecutive_losses=req.consecutive_losses,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    except Exception as exc:
        logger.error("finetuned bot write failed", bot_id=req.bot_id, error=str(exc))
        raise HTTPException(status_code=500, detail="Failed to write finetuned bot file")

    db = get_db()
    if db is not None:
        record = create_finetuned_bot_record(
            bot_id=req.bot_id,
            bot_type=req.bot_type,
            file_path=file_path,
            old_parameters=req.old_parameters,
            new_parameters=req.new_parameters,
            reasoning=req.reasoning,
            consecutive_losses=req.consecutive_losses,
        )
        await db.finetuned_bots.insert_one(record)
        logger.info("finetuned bot record saved", bot_id=req.bot_id)

    return FinetuneResponse(
        bot_id=req.bot_id,
        file_path=file_path,
        message=f"Finetuned bot created: {file_path}",
    )


@router.get("/finetune/{bot_id}")
async def list_finetuned_bots(bot_id: str) -> list[dict]:
    """Return all finetuned variants for a given bot_id."""
    db = get_db()
    if db is None:
        return []
    cursor = db.finetuned_bots.find(
        {"bot_id": bot_id},
        {"_id": 0, "bot_id": 1, "bot_type": 1, "file_path": 1,
         "reasoning": 1, "consecutive_losses": 1, "created_at": 1},
    ).sort("created_at", -1)
    return [doc async for doc in cursor]
