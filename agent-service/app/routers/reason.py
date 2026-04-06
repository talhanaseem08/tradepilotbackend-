from fastapi import APIRouter, HTTPException
from app.schemas.reason import ReasonRequest, ReasonResponse
from app.services.deepseek_service import analyze_and_suggest

router = APIRouter(tags=["agent"])


@router.post("/reason", response_model=ReasonResponse)
async def reason(request: ReasonRequest):
    try:
        result = await analyze_and_suggest(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Agent reasoning failed: {str(e)}")
