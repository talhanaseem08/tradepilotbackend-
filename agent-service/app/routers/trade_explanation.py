from fastapi import APIRouter, HTTPException

from app.schemas.trade_explanation import (
    TradeExplanationRequest,
    TradeExplanationResponse,
)
from app.services.trade_explanation_service import explain_trade
from app.utils.logger import get_logger

router = APIRouter(prefix="/explain", tags=["explain"])
logger = get_logger()


@router.post("/trade", response_model=TradeExplanationResponse)
async def explain_trade_route(request: TradeExplanationRequest):
    try:
        return await explain_trade(request)
    except Exception as exc:
        logger.error(
            "trade explanation request failed",
            trade_id=request.trade.trade_id,
            error=str(exc),
        )
        raise HTTPException(
            status_code=502,
            detail="Trade explanation is temporarily unavailable.",
        )
