from datetime import datetime

from fastapi import APIRouter, HTTPException
from app.config.database import get_db
from app.services.binance_trade_sync import sync_binance_trade_records_for_user
from app.services.oanda_trade_sync import sync_oanda_trade_records_for_user
from app.utils.logger import get_logger

logger = get_logger()
router = APIRouter(prefix="/trades", tags=["trades"])


def _json_safe_doc(doc: dict) -> dict:
    """Ensure Mongo datetimes and ObjectId serialize cleanly for the dashboard."""
    out = dict(doc)
    out["_id"] = str(out["_id"])
    for key in ("timestamp", "closedAt", "openedAt"):
        v = out.get(key)
        if isinstance(v, datetime):
            out[key] = v.isoformat()
    return out


@router.get("/")
async def get_trades(
    bot_id: str = None,
    user_id: str = None,
    symbol: str = None,
    status: str = None,
    limit: int = 50,
    page: int = 1,
):
    db = get_db()
    if db is None:
        raise HTTPException(status_code=503, detail="Database not connected")

    if user_id:
        try:
            await sync_oanda_trade_records_for_user(user_id)
        except Exception as exc:
            logger.warning("trade sync warning", user_id=user_id, error=str(exc))
        try:
            await sync_binance_trade_records_for_user(user_id)
        except Exception as exc:
            logger.warning("binance trade sync warning", user_id=user_id, error=str(exc))

    query = {}
    if bot_id:
        query["botID"] = bot_id
    if user_id:
        query["userID"] = user_id
    if symbol:
        query["symbol"] = symbol.upper()
    if status:
        query["status"] = status

    skip = (page - 1) * limit
    total = await db.trade_records.count_documents(query)
    cursor = db.trade_records.find(query).sort("timestamp", -1).skip(skip).limit(limit)

    trades = []
    async for doc in cursor:
        trades.append(_json_safe_doc(doc))

    return {
        "trades": trades,
        "total": total,
        "page": page,
        "limit": limit,
        "pages": (total + limit - 1) // limit,
    }
