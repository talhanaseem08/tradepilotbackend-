from __future__ import annotations

from datetime import datetime, timezone

from app.adapters.oanda_provider import OandaProvider
from app.config.database import get_db
from app.services.broker_credentials import get_user_broker_credentials
from app.utils.logger import get_logger

logger = get_logger()


def _parse_oanda_time(value: str | None) -> datetime:
    if not value:
        return datetime.now(timezone.utc)
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00")).astimezone(timezone.utc)
    except Exception:
        return datetime.now(timezone.utc)


def _trade_symbol(instrument: str) -> str:
    return instrument.replace("_", "").upper()


def _trade_side(initial_units: float) -> str:
    return "buy" if initial_units >= 0 else "sell"


async def sync_oanda_trade_records_for_user(
    user_id: str,
    *,
    closed_count: int = 250,
    open_count: int = 100,
) -> dict[str, int]:
    credentials = await get_user_broker_credentials(user_id, "forex")
    if not credentials:
        return {"inserted": 0, "updated": 0}

    db = get_db()
    if db is None:
        return {"inserted": 0, "updated": 0}

    provider = OandaProvider(credentials)

    try:
        closed_trades = await provider.fetch_trades("CLOSED", count=closed_count)
        open_trades = await provider.fetch_trades("OPEN", count=open_count)
    except Exception as exc:
        logger.warning("oanda trade sync skipped", user_id=user_id, error=str(exc))
        return {"inserted": 0, "updated": 0}

    inserted = 0
    updated = 0

    for trade in [*closed_trades, *open_trades]:
        external_trade_id = str(trade.get("id") or "").strip()
        instrument = str(trade.get("instrument") or "").strip()
        if not external_trade_id or not instrument:
            continue

        initial_units = float(trade.get("initial_units", 0) or 0)
        state = str(trade.get("state") or "OPEN").upper()
        open_time = _parse_oanda_time(trade.get("open_time"))
        close_time_raw = trade.get("close_time")
        close_time = _parse_oanda_time(close_time_raw) if close_time_raw else None

        update_fields = {
            "userID": user_id,
            "orderID": external_trade_id,
            "externalTradeID": external_trade_id,
            "source": "oanda_sync",
            "brokerName": "oanda",
            "market": "forex",
            "symbol": _trade_symbol(instrument),
            "action": _trade_side(initial_units),
            "entryPrice": float(trade.get("price", 0) or 0),
            "volume": abs(initial_units),
            "status": "closed" if state == "CLOSED" else "open",
            "openedAt": open_time,
            "timestamp": close_time if state == "CLOSED" and close_time else open_time,
            "financing": float(trade.get("financing", 0) or 0),
        }

        if state == "CLOSED":
            update_fields["exitPrice"] = float(trade.get("average_close_price", 0) or 0)
            update_fields["pnl"] = float(trade.get("realized_pl", 0) or 0)
            if close_time:
                update_fields["closedAt"] = close_time
        else:
            update_fields["pnl"] = float(trade.get("unrealized_pl", 0) or 0)

        existing = await db.trade_records.find_one(
            {
                "userID": user_id,
                "market": "forex",
                "$or": [
                    {"externalTradeID": external_trade_id},
                    {"orderID": external_trade_id},
                ],
            }
        )

        if existing:
            await db.trade_records.update_one(
                {"_id": existing["_id"]},
                {"$set": update_fields},
            )
            updated += 1
        else:
            await db.trade_records.insert_one(update_fields)
            inserted += 1

    if inserted or updated:
        logger.info(
            "oanda trades synced",
            user_id=user_id,
            inserted=inserted,
            updated=updated,
        )

    return {"inserted": inserted, "updated": updated}
