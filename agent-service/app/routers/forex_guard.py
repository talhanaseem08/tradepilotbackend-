from fastapi import APIRouter, HTTPException

from app.schemas.guard import ForexGuardRequest, ForexGuardResponse
from app.services.forex_guard_service import evaluate_forex_guard

router = APIRouter(prefix="/guard", tags=["guard"])


@router.post("/forex", response_model=ForexGuardResponse)
async def forex_guard(request: ForexGuardRequest):
    try:
        return await evaluate_forex_guard(request)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Forex guard failed: {str(exc)}")
