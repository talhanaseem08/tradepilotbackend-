"""
Monitor Worker — checks open trades against live prices.
Closes trades when stop-loss or take-profit price is hit.
Handles paper trades (in-memory PnL) and updates MongoDB records.

OANDA and Binance live trades manage SL/TP at the broker level, so this
worker only needs to act on paper-mode open positions.
"""
import asyncio
from datetime import datetime, timezone

from app.config.database import get_db
from app.config.settings import settings
from app.adapters.factory import create_data_provider
from app.services.performance_monitor import record_trade_result
from app.utils.logger import get_logger

logger = get_logger()

_monitor_task: asyncio.Task | None = None
MONITOR_INTERVAL_SECONDS = 30


def _hit_reason(trade: dict, price: float) -> str | None:
    """Return 'sl', 'tp', or None based on current price vs trade SL/TP."""
    side = trade.get("action", "buy")
    sl = trade.get("stopLoss")
    tp = trade.get("takeProfit")

    if sl is None and tp is None:
        return None

    if side == "buy":
        if sl and price <= float(sl):
            return "sl"
        if tp and price >= float(tp):
            return "tp"
    else:
        if sl and price >= float(sl):
            return "sl"
        if tp and price <= float(tp):
            return "tp"

    return None


async def _close_trade(db, trade: dict, exit_price: float, reason: str):
    entry = float(trade.get("entryPrice", 0))
    volume = float(trade.get("volume", 0))
    side = trade.get("action", "buy")

    pnl = (exit_price - entry) * volume if side == "buy" else (entry - exit_price) * volume
    pnl = round(pnl, 4)

    await db.trade_records.update_one(
        {"_id": trade["_id"]},
        {
            "$set": {
                "status": "closed",
                "exitPrice": exit_price,
                "pnl": pnl,
                "closedAt": datetime.now(timezone.utc),
                "closeReason": reason,
            }
        },
    )

    logger.info(
        "trade closed by monitor",
        trade_id=str(trade["_id"]),
        bot_id=trade.get("botID", ""),
        reason=reason,
        exit_price=exit_price,
        pnl=pnl,
    )

    await record_trade_result(
        bot_id=trade.get("botID", ""),
        pnl=pnl,
        symbol=trade.get("symbol", ""),
        market=trade.get("market", "forex"),
    )


async def _process_market(trades: list[dict], market: str):
    if not trades:
        return

    provider = create_data_provider(market)
    symbols = list({t["symbol"] for t in trades})

    price_map: dict[str, float] = {}
    for symbol in symbols:
        try:
            tick = await provider.fetch_tick(symbol)
            if tick:
                bid = float(tick.get("bid", 0))
                ask = float(tick.get("ask", 0))
                price_map[symbol] = (bid + ask) / 2 if bid and ask else bid or ask
        except Exception as e:
            logger.warning("tick fetch failed", symbol=symbol, market=market, error=str(e))

    if hasattr(provider, "close"):
        await provider.close()

    db = get_db()
    for trade in trades:
        price = price_map.get(trade["symbol"])
        if price is None:
            continue
        reason = _hit_reason(trade, price)
        if reason:
            await _close_trade(db, trade, price, reason)


async def _monitor_cycle():
    # Only monitor paper-mode open trades — live broker SL/TP is managed by OANDA/Binance.
    if settings.broker_mode != "paper":
        return

    db = get_db()
    if db is None:
        return

    open_trades = await db.trade_records.find({"status": "open"}).to_list(None)
    if not open_trades:
        return

    forex = [t for t in open_trades if t.get("market", "forex") == "forex"]
    crypto = [t for t in open_trades if t.get("market", "forex") == "crypto"]

    logger.debug("monitor cycle", open_trades=len(open_trades))

    await asyncio.gather(
        _process_market(forex, "forex"),
        _process_market(crypto, "crypto"),
        return_exceptions=True,
    )


async def _monitor_loop():
    while True:
        try:
            await _monitor_cycle()
        except asyncio.CancelledError:
            break
        except Exception as e:
            logger.error("monitor cycle crashed", error=str(e))
        await asyncio.sleep(MONITOR_INTERVAL_SECONDS)


def start_monitor_worker():
    global _monitor_task
    _monitor_task = asyncio.create_task(_monitor_loop())
    logger.info("monitor worker started", interval=MONITOR_INTERVAL_SECONDS)


def stop_monitor_worker():
    global _monitor_task
    if _monitor_task:
        _monitor_task.cancel()
        _monitor_task = None
        logger.info("monitor worker stopped")
