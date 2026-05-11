from fastapi import APIRouter, HTTPException, Query
from app.adapters.ccxt_adapter import CCXTBrokerAdapter
from app.adapters.factory import create_broker
from app.adapters.factory import create_data_provider
from app.adapters.oanda_provider import OandaProvider
from app.services.broker_credentials import get_user_broker_credentials

router = APIRouter(prefix="/data", tags=["data"])


@router.get("/candles/{symbol}")
async def get_candles(
    symbol: str,
    market: str = Query("forex", description="forex or crypto"),
    timeframe: str = Query("1h", description="1m, 5m, 15m, 30m, 1h, 4h, 1d"),
    count: int = Query(100, ge=1, le=1000),
    user_id: str | None = Query(None),
):
    credentials = await get_user_broker_credentials(user_id, market) if user_id else None
    provider = create_data_provider(market, credentials)
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
    user_id: str | None = Query(None),
):
    credentials = await get_user_broker_credentials(user_id, market) if user_id else None
    provider = create_data_provider(market, credentials)
    tick = await provider.fetch_tick(symbol)

    if not tick:
        raise HTTPException(status_code=404, detail=f"No tick data for {symbol}")

    if hasattr(provider, "close"):
        await provider.close()

    return {"symbol": symbol, "tick": tick}


@router.get("/account")
async def get_account_summary(
    market: str = Query("forex", description="forex or crypto"),
    user_id: str | None = Query(None),
):
    credentials = await get_user_broker_credentials(user_id, market) if user_id else None
    if market == "crypto":
        # Dashboard account summaries should reflect the connected Binance account
        # even when the execution layer is configured for paper trading.
        broker = CCXTBrokerAdapter(credentials)
        try:
            balance = await broker.get_account_balance()
            total_balance = float(balance.get("balance", 0) or 0)
            free_balance = float(balance.get("free", 0) or 0)
            used_balance = float(balance.get("used", 0) or 0)
            return {
                "currency": "USDT",
                "balance": total_balance,
                "nav": total_balance,
                "unrealized_pl": 0.0,
                "realized_pl": 0.0,
                "margin_used": used_balance,
                "margin_available": free_balance,
                "open_trade_count": 0,
                "open_position_count": 0,
                "pending_order_count": 0,
            }
        finally:
            if hasattr(broker, "close"):
                await broker.close()

    provider = OandaProvider(credentials)
    return await provider.fetch_account_summary()


@router.get("/open-positions")
async def get_open_positions(
    market: str = Query("forex", description="forex or crypto"),
    user_id: str | None = Query(None),
):
    if market == "crypto":
        return {"positions": [], "count": 0}

    credentials = await get_user_broker_credentials(user_id, "forex") if user_id else None
    provider = OandaProvider(credentials)
    positions = await provider.fetch_open_positions()
    return {"positions": positions, "count": len(positions)}
