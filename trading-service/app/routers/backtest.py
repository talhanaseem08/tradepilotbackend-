from fastapi import APIRouter, HTTPException
from app.schemas.backtest import BacktestRequest, BacktestResult
from app.services.backtesting import run_backtest

router = APIRouter(tags=["backtest"])


@router.post("/backtest", response_model=BacktestResult)
async def backtest(request: BacktestRequest):
    try:
        result = await run_backtest(request)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Backtest failed: {str(e)}")
