from pydantic import BaseModel, Field

from fastapi import APIRouter, HTTPException
from app.schemas.backtest import BacktestRequest, BacktestResult
from app.services.backtesting import run_backtest
from app.services.scripted_backtest_runner import run_script_style_backtest
from app.models.backtest_report import create_backtest_report
from app.config.database import get_db
from app.utils.logger import get_logger

logger = get_logger()
router = APIRouter(tags=["backtest"])


@router.post("/backtest", response_model=BacktestResult)
async def backtest(request: BacktestRequest):
    try:
        # Auto-fetch candles from OANDA when date range given but no candles supplied
        if not request.candles and request.date_from and request.date_to:
            from app.adapters.oanda_provider import OandaProvider
            provider = OandaProvider()
            candles = await provider.fetch_candles_range(
                symbol=request.symbol,
                timeframe=request.timeframe,
                date_from=request.date_from,
                date_to=request.date_to,
            )
            request = request.model_copy(update={"candles": candles})
            logger.info("auto-fetched candles for backtest",
                        symbol=request.symbol, count=len(candles))

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


class ScriptBacktestRunRequest(BaseModel):
    """Same behaviour as scripts/backtest_*_*.py (OANDA range + run_backtest)."""

    bot_type: str = Field(
        ...,
        description="Forex: low_risk | medium_risk | high_risk. Crypto: crypto_low | crypto_medium | crypto_high.",
    )
    days: int = Field(30, ge=1, le=365)
    symbol: str | None = Field(
        None,
        description="Optional; high_risk only: USDCHF or UK100 (default USDCHF).",
    )
    user_id: str | None = Field(
        None,
        description="Authenticated user id for connected broker credential lookup.",
    )


@router.post("/backtest/script-run", response_model=BacktestResult)
async def backtest_script_run(body: ScriptBacktestRunRequest):
    """
    Run the long-range script backtest for the selected bot (matches CLI scripts).
    """
    try:
        return await run_script_style_backtest(
            body.bot_type,
            days=body.days,
            symbol=body.symbol,
            user_id=body.user_id,
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error("script-run backtest failed", error=str(e))
        raise HTTPException(status_code=500, detail=f"Script backtest failed: {e!s}") from e


@router.get("/backtest/reports")
async def get_reports(symbol: str = None, bot_type: str = None, limit: int = 20, page: int = 1):
    db = get_db()
    if db is None:
        raise HTTPException(status_code=503, detail="Database not connected")

    query = {}
    if symbol:
        query["symbol"] = symbol.upper()
    if bot_type:
        query["bot_type"] = bot_type

    skip = (page - 1) * limit
    total = await db.backtest_reports.count_documents(query)
    cursor = db.backtest_reports.find(query).sort("created_at", -1).skip(skip).limit(limit)

    reports = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        doc["created_at"] = doc["created_at"].isoformat() if doc.get("created_at") else None
        reports.append(doc)

    return {
        "reports": reports,
        "total": total,
        "page": page,
        "limit": limit,
        "pages": (total + limit - 1) // limit,
    }


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
