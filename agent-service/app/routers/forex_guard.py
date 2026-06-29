from fastapi import APIRouter, HTTPException

from app.schemas.guard import ForexGuardRequest, ForexGuardResponse
from app.services.forex_guard_service import evaluate_forex_guard
from app.utils.logger import get_logger

router = APIRouter(prefix="/guard", tags=["guard"])
logger = get_logger()


@router.post("/forex", response_model=ForexGuardResponse)
async def forex_guard(request: ForexGuardRequest):
    try:
        return await evaluate_forex_guard(request)
    except Exception as exc:
        logger.error("forex guard request failed", symbol=request.symbol, error=str(exc))
        raise HTTPException(
            status_code=502,
            detail="Forex safety status is temporarily unavailable.",
        )
