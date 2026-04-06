from fastapi import APIRouter, HTTPException
from app.schemas.parse import ParseRequest, ParseResponse
from app.services.mistral_service import parse_trading_prompt
from app.utils.logger import get_logger

logger = get_logger()
router = APIRouter()


@router.post("/parse", response_model=ParseResponse)
async def parse_prompt(request: ParseRequest):
    if not request.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt cannot be empty")

    try:
        result = await parse_trading_prompt(request.prompt)
        return result
    except Exception as e:
        logger.error("parse failed", error=str(e))
        raise HTTPException(status_code=502, detail="Mistral inference failed")
