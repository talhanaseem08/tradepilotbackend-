"""
Debug / test utilities — NOT for production use.
"""

import asyncio
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException

from app.adapters.factory import create_broker, create_data_provider
from app.config.database import get_db
from app.models.trade_record import create_trade_record
from app.services.binance_client import (
    fetch_binance_spot_account_info,
    fetch_binance_spot_exchange_info,
    fetch_binance_spot_prices,
    get_binance_lot_size_filters,
    place_binance_spot_market_order,
    quantize_binance_quantity,
)
from app.services.broker_credentials import get_user_broker_credentials
from app.services.performance_monitor import record_trade_result
from app.workers.execution_worker import _run_cycle

router = APIRouter(prefix="/debug", tags=["debug"])

TEST_CLOSE_DELAY_SECONDS = 180
TEST_BINANCE_NOTIONAL_USDT = 20.0


async def _auto_close_test_trade(
    *,
    order_id: str,
    user_id: str,
    bot_id: str,
    symbol: str,
    volume: float,
):
    await asyncio.sleep(TEST_CLOSE_DELAY_SECONDS)

    db = get_db()
    if db is None:
        return

    credentials = await get_user_broker_credentials(user_id, "forex")
    if not credentials:
        return

    broker = create_broker("forex", credentials)
    close_result = await broker.close_order(order_id)
    if close_result.get("status") != "closed":
        return

    exit_price = float(close_result.get("close_price", 0) or 0)
    trade = await db.trade_records.find_one({"orderID": order_id})
    if not trade:
        return

    entry_price = float(trade.get("entryPrice", 0) or 0)
    pnl = round((exit_price - entry_price) * float(volume), 4)

    await db.trade_records.update_one(
        {"_id": trade["_id"]},
        {
            "$set": {
                "status": "closed",
                "exitPrice": exit_price,
                "pnl": pnl,
                "closedAt": datetime.now(timezone.utc),
                "closeReason": "manual_test_timeout",
            }
        },
    )

    await record_trade_result(
        bot_id=bot_id,
        pnl=pnl,
        symbol=symbol,
        market="forex",
    )


async def _auto_close_test_trade_binance(
    *,
    user_id: str,
    bot_id: str,
    symbol: str,
    quantity: float,
    buy_order_id: str,
):
    await asyncio.sleep(TEST_CLOSE_DELAY_SECONDS)

    db = get_db()
    if db is None:
        return

    credentials = await get_user_broker_credentials(user_id, "crypto")
    if not credentials:
        return

    account_info = await fetch_binance_spot_account_info(
        api_key=credentials.api_key,
        secret_key=credentials.secret_key or "",
        demo_mode=bool(credentials.is_testnet),
    )

    base_asset = symbol[:-4] if symbol.endswith("USDT") else symbol
    free_quantity = 0.0
    for item in account_info.get("balances", []):
        if item.get("asset") == base_asset:
            free_quantity = float(item.get("free", 0) or 0)
            break

    symbol_info_payload = await fetch_binance_spot_exchange_info(
        symbol=symbol,
        demo_mode=bool(credentials.is_testnet),
    )
    symbol_infos = symbol_info_payload.get("symbols", [])
    symbol_info = symbol_infos[0] if symbol_infos else {}
    min_qty, step_size = get_binance_lot_size_filters(symbol_info)

    sell_quantity = quantize_binance_quantity(
        min(quantity, free_quantity),
        min_qty=min_qty,
        step_size=step_size,
    )
    if sell_quantity <= 0:
        return

    close_order = await place_binance_spot_market_order(
        api_key=credentials.api_key,
        secret_key=credentials.secret_key or "",
        symbol=symbol,
        side="sell",
        quantity=sell_quantity,
        demo_mode=bool(credentials.is_testnet),
    )

    if not close_order or close_order.get("status") == "failed" or close_order.get("error"):
        return

    trade = await db.trade_records.find_one({"orderID": buy_order_id})
    if not trade:
        return

    entry_price = float(trade.get("entryPrice", 0) or 0)
    executed_qty = float(close_order.get("executedQty", 0) or 0)
    cumulative_quote = float(close_order.get("cummulativeQuoteQty", 0) or 0)
    exit_price = cumulative_quote / executed_qty if executed_qty > 0 else 0.0
    pnl = round((exit_price - entry_price) * float(sell_quantity), 4)

    await db.trade_records.update_one(
        {"_id": trade["_id"]},
        {
            "$set": {
                "status": "closed",
                "exitPrice": exit_price,
                "pnl": pnl,
                "closedAt": datetime.now(timezone.utc),
                "closeReason": "manual_test_timeout",
            }
        },
    )

    await record_trade_result(
        bot_id=bot_id,
        pnl=pnl,
        symbol=symbol,
        market="crypto",
    )


@router.post("/execute")
async def trigger_execution_cycle():
    """Manually trigger one bot execution cycle (for testing)."""
    await _run_cycle()
    return {"status": "cycle complete"}


@router.post("/test-oanda-execute")
async def trigger_test_oanda_execute(payload: dict):
    """
    Place one real OANDA practice-market BUY order for the user's active forex bot,
    then auto-close it after 3 minutes.
    """
    user_id = payload.get("user_id")
    if not user_id:
        raise HTTPException(status_code=400, detail="user_id is required")

    db = get_db()
    if db is None:
        raise HTTPException(status_code=503, detail="Database not connected")

    bot = await db.bot_instances.find_one(
        {
            "userID": user_id,
            "market": "forex",
            "status": "active",
            "strategyType": "medium_risk",
        }
    )
    if bot is None:
        bot = await db.bot_instances.find_one(
            {
                "userID": user_id,
                "market": "forex",
                "status": "active",
            }
        )

    if bot is None:
        raise HTTPException(
            status_code=404,
            detail="No active forex bot found for this user.",
        )

    credentials = await get_user_broker_credentials(user_id, "forex")
    if not credentials or credentials.broker_name != "oanda":
        raise HTTPException(
            status_code=400,
            detail="No verified OANDA account connected for this user.",
        )

    provider = create_data_provider("forex", credentials)
    tick = await provider.fetch_tick(bot["assetPair"])
    if hasattr(provider, "close"):
        await provider.close()

    entry_hint = float(tick.get("ask") or tick.get("bid") or 0) if tick else 0.0
    volume = 100.0

    broker = create_broker("forex", credentials)
    order = await broker.place_order(
        symbol=bot["assetPair"],
        side="buy",
        quantity=volume,
        order_type="market",
        price=entry_hint if entry_hint > 0 else None,
        stop_loss=None,
        take_profit=None,
    )

    if order.get("status") == "failed" or order.get("error"):
        raise HTTPException(
            status_code=502,
            detail=f"OANDA test execution failed: {order.get('error', 'unknown error')}",
        )

    record = create_trade_record(
        bot_id=bot["botID"],
        user_id=user_id,
        symbol=bot["assetPair"],
        action="buy",
        entry_price=float(order.get("entry_price", 0) or 0),
        quantity=volume,
        order_id=str(order.get("order_id")),
        status="open",
        stop_loss=None,
        take_profit=None,
        market="forex",
    )
    record["openedAt"] = datetime.now(timezone.utc)
    record["source"] = "manual_oanda_test"
    await db.trade_records.insert_one(record)

    asyncio.create_task(
        _auto_close_test_trade(
            order_id=str(order.get("order_id")),
            user_id=user_id,
            bot_id=bot["botID"],
            symbol=bot["assetPair"],
            volume=volume,
        )
    )

    return {
        "status": "test trade opened",
        "bot_id": bot["botID"],
        "symbol": bot["assetPair"],
        "order_id": str(order.get("order_id")),
        "close_in_seconds": TEST_CLOSE_DELAY_SECONDS,
        "volume": volume,
        "broker": "oanda",
        "environment": credentials.environment,
    }


@router.post("/test-binance-execute")
async def trigger_test_binance_execute(payload: dict):
    """
    Place one real Binance demo/live market BUY for the user's active crypto bot,
    then auto-close it after 3 minutes with a market SELL.
    """
    user_id = payload.get("user_id")
    if not user_id:
        raise HTTPException(status_code=400, detail="user_id is required")

    db = get_db()
    if db is None:
        raise HTTPException(status_code=503, detail="Database not connected")

    bot = await db.bot_instances.find_one(
        {
            "userID": user_id,
            "market": "crypto",
            "status": "active",
            "strategyType": "crypto_medium",
        }
    )
    if bot is None:
        bot = await db.bot_instances.find_one(
            {
                "userID": user_id,
                "market": "crypto",
                "status": "active",
            }
        )

    if bot is None:
        raise HTTPException(
            status_code=404,
            detail="No active crypto bot found for this user.",
        )

    credentials = await get_user_broker_credentials(user_id, "crypto")
    if not credentials or credentials.broker_name != "binance":
        raise HTTPException(
            status_code=400,
            detail="No verified Binance account connected for this user.",
        )

    prices = await fetch_binance_spot_prices(demo_mode=bool(credentials.is_testnet))
    ask_price = float(prices.get(bot["assetPair"], 0) or 0)
    if ask_price <= 0:
        raise HTTPException(
            status_code=502,
            detail="Could not fetch Binance price for the test trade.",
        )

    try:
        order = await place_binance_spot_market_order(
            api_key=credentials.api_key,
            secret_key=credentials.secret_key or "",
            symbol=bot["assetPair"],
            side="buy",
            quote_order_qty=TEST_BINANCE_NOTIONAL_USDT,
            demo_mode=bool(credentials.is_testnet),
        )
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Binance test execution failed: {exc}",
        ) from exc

    if not order or order.get("status") == "failed" or order.get("error"):
        raise HTTPException(
            status_code=502,
            detail=f"Binance test execution failed: {order.get('error', 'unknown error')}",
        )

    executed_qty = float(order.get("executedQty", 0) or 0)
    cumulative_quote = float(order.get("cummulativeQuoteQty", 0) or 0)
    entry_price = cumulative_quote / executed_qty if executed_qty > 0 else ask_price
    if executed_qty <= 0:
        raise HTTPException(
            status_code=502,
            detail="Binance test execution returned zero filled quantity.",
        )

    record = create_trade_record(
        bot_id=bot["botID"],
        user_id=user_id,
        symbol=bot["assetPair"],
        action="buy",
        entry_price=entry_price,
        quantity=executed_qty,
        order_id=str(order.get("orderId")),
        status="open",
        stop_loss=None,
        take_profit=None,
        market="crypto",
    )
    record["openedAt"] = datetime.now(timezone.utc)
    record["source"] = "manual_binance_test"
    await db.trade_records.insert_one(record)

    asyncio.create_task(
        _auto_close_test_trade_binance(
            user_id=user_id,
            bot_id=bot["botID"],
            symbol=bot["assetPair"],
            quantity=executed_qty,
            buy_order_id=str(order.get("orderId")),
        )
    )

    return {
        "status": "test trade opened",
        "bot_id": bot["botID"],
        "symbol": bot["assetPair"],
        "order_id": str(order.get("orderId")),
        "close_in_seconds": TEST_CLOSE_DELAY_SECONDS,
        "quantity": executed_qty,
        "notional_usdt": TEST_BINANCE_NOTIONAL_USDT,
        "broker": "binance",
        "environment": "demo" if credentials.is_testnet else "live",
    }
