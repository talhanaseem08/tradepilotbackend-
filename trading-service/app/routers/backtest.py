from fastapi import APIRouter, HTTPException
from app.schemas.backtest import BacktestRequest, BacktestResult
from app.services.backtesting import run_backtest
from app.models.backtest_report import create_backtest_report
from app.config.database import get_db
from app.utils.logger import get_logger

logger = get_logger()
router = APIRouter(tags=["backtest"])


@router.post("/backtest", response_model=BacktestResult)
async def backtest(request: BacktestRequest):
    try:
        result = await run_backtest(request)

        db = get_db()
        if db is not None:
            report = create_backtest_report(
                bot_type=request.bot_type,
                symbol=request.symbol,
                market=request.market,
                timeframe=request.timeframe,
                parameters=request.parameters,
                result=result.model_dump(),
                candle_count=len(request.candles),
            )
            await db.backtest_reports.insert_one(report)
            logger.info("backtest report saved", symbol=request.symbol,
                        trades=result.total_trades)

        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Backtest failed: {str(e)}")


@router.get("/backtest/reports")
async def get_reports(symbol: str = None, limit: int = 20):
    db = get_db()
    if db is None:
        raise HTTPException(status_code=503, detail="Database not connected")

    query = {}
    if symbol:
        query["symbol"] = symbol.upper()

    cursor = db.backtest_reports.find(query).sort("created_at", -1).limit(limit)
    reports = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        doc["created_at"] = doc["created_at"].isoformat() if doc.get("created_at") else None
        reports.append(doc)

    return {"reports": reports, "count": len(reports)}


@router.get("/backtest/reports/{report_id}")
async def get_report(report_id: str):
    from bson import ObjectId
    db = get_db()
    if db is None:
        raise HTTPException(status_code=503, detail="Database not connected")

    try:
        doc = await db.backtest_reports.find_one({"_id": ObjectId(report_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid report ID")

    if not doc:
        raise HTTPException(status_code=404, detail="Report not found")

    doc["_id"] = str(doc["_id"])
    doc["created_at"] = doc["created_at"].isoformat() if doc.get("created_at") else None
    return doc
