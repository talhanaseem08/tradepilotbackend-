from fastapi import APIRouter, HTTPException, Query
from app.adapters.factory import create_data_provider

router = APIRouter(prefix="/data", tags=["data"])


@router.get("/candles/{symbol}")
async def get_candles(
    symbol: str,
    market: str = Query("forex", description="forex or crypto"),
    timeframe: str = Query("1h", description="1m, 5m, 15m, 30m, 1h, 4h, 1d"),
    count: int = Query(100, ge=1, le=1000),
):
    provider = create_data_provider(market)
    candles = await provider.fetch_candles(symbol, timeframe, count)

    if not candles:
        raise HTTPException(status_code=404, detail=f"No candle data for {symbol}")

    if hasattr(provider, "close"):
        await provider.close()

    return {"symbol": symbol, "timeframe": timeframe, "count": len(candles), "candles": candles}


@router.get("/tick/{symbol}")
async def get_tick(
    symbol: str,
    market: str = Query("forex", description="forex or crypto"),
):
    provider = create_data_provider(market)
    tick = await provider.fetch_tick(symbol)

    if not tick:
        raise HTTPException(status_code=404, detail=f"No tick data for {symbol}")

    if hasattr(provider, "close"):
        await provider.close()

    return {"symbol": symbol, "tick": tick}
