from __future__ import annotations

from datetime import datetime, timezone

from app.config.database import get_db
from app.services.binance_client import fetch_binance_spot_my_trades
from app.services.broker_credentials import get_user_broker_credentials
from app.utils.logger import get_logger

logger = get_logger()

_ACTIVE_TRADE_STATUSES = {"open", "filled", "active", "pending", "partially_filled"}
_QTY_MATCH_TOLERANCE = 0.001


def _parse_dt(value) -> datetime:
    if isinstance(value, datetime):
        if value.tzinfo is None:
            return value.replace(tzinfo=timezone.utc)
        return value.astimezone(timezone.utc)
    if isinstance(value, str):
        try:
            return datetime.fromisoformat(value.replace("Z", "+00:00")).astimezone(timezone.utc)
        except Exception:
            return datetime.now(timezone.utc)
    return datetime.now(timezone.utc)


async def sync_binance_trade_records_for_user(
    user_id: str,
    *,
    recent_limit: int = 100,
) -> dict[str, int]:
    credentials = await get_user_broker_credentials(user_id, "crypto")
    if not credentials or credentials.broker_name != "binance":
        return {"updated": 0}

    db = get_db()
    if db is None:
        return {"updated": 0}

    open_records = await db.trade_records.find(
        {
            "userID": user_id,
            "market": "crypto",
            "status": {"$in": list(_ACTIVE_TRADE_STATUSES)},
        }
    ).to_list(None)
    if not open_records:
        return {"updated": 0}

    updated = 0
    records_by_symbol: dict[str, list[dict]] = {}
    for record in open_records:
        symbol = str(record.get("symbol") or "").upper()
        if symbol:
            records_by_symbol.setdefault(symbol, []).append(record)

    for symbol, symbol_records in records_by_symbol.items():
        earliest_open = min(
            _parse_dt(record.get("openedAt") or record.get("timestamp"))
            for record in symbol_records
        )
        since_ms = max(int(earliest_open.timestamp() * 1000) - 60_000, 0)
        try:
            trades = await fetch_binance_spot_my_trades(
                api_key=credentials.api_key,
                secret_key=credentials.secret_key or "",
                symbol=symbol,
                demo_mode=bool(credentials.is_testnet),
                limit=recent_limit,
                start_time=since_ms,
            )
        except Exception as exc:
            logger.warning(
                "binance trade sync skipped for symbol",
                user_id=user_id,
                symbol=symbol,
                error=str(exc),
            )
            continue

        if not trades:
            continue

        close_orders: dict[tuple[str, str], dict] = {}
        for trade in sorted(trades, key=lambda item: int(item.get("time", 0) or 0)):
            inferred_side = "buy" if str(trade.get("isBuyer", False)).lower() == "true" else "sell"
            order_id = str(trade.get("orderId") or "")
            if not order_id:
                continue
            amount = float(trade.get("qty", 0) or 0)
            price = float(trade.get("price", 0) or 0)
            trade_dt = _parse_dt(trade.get("time"))
            if amount <= 0 or price <= 0:
                continue

            key = (inferred_side, order_id)
            group = close_orders.setdefault(
                key,
                {
                    "side": inferred_side,
                    "order_id": order_id,
                    "quantity": 0.0,
                    "value": 0.0,
                    "time": trade_dt,
                    "used": False,
                },
            )
            group["quantity"] += amount
            group["value"] += amount * price
            if trade_dt > group["time"]:
                group["time"] = trade_dt

        close_groups = sorted(
            close_orders.values(),
            key=lambda item: item["time"],
        )

        for record in sorted(
            symbol_records,
            key=lambda item: _parse_dt(item.get("openedAt") or item.get("timestamp")),
        ):
            action = str(record.get("action") or "buy").lower()
            entry_price = float(record.get("entryPrice", 0) or 0)
            volume = float(record.get("volume", 0) or 0)
            if volume <= 0:
                continue

            opened_at = _parse_dt(record.get("openedAt") or record.get("timestamp"))
            closing_side = "sell" if action == "buy" else "buy"
            matched_group = None
            tolerance = max(volume * _QTY_MATCH_TOLERANCE, 1e-8)

            for group in close_groups:
                if group["used"] or group["side"] != closing_side:
                    continue
                if group["time"] < opened_at:
                    continue
                if abs(float(group["quantity"]) - volume) > tolerance:
                    continue
                matched_group = group
                break

            if matched_group is None:
                continue

            matched_group["used"] = True
            exit_price = matched_group["value"] / matched_group["quantity"]
            pnl = (
                (exit_price - entry_price) * volume
                if action == "buy"
                else (entry_price - exit_price) * volume
            )

            await db.trade_records.update_one(
                {"_id": record["_id"]},
                {
                    "$set": {
                        "status": "closed",
                        "exitPrice": round(exit_price, 8),
                        "pnl": round(pnl, 8),
                        "closedAt": matched_group["time"],
                        "closeReason": "binance_sync",
                        "closeOrderID": matched_group["order_id"],
                    }
                },
            )
            updated += 1

    if updated:
        logger.info("binance trades synced", user_id=user_id, updated=updated)

    return {"updated": updated}
