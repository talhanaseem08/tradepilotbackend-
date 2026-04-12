from fastapi import APIRouter, HTTPException
from app.config.database import get_db
from app.utils.logger import get_logger

logger = get_logger()
router = APIRouter(prefix="/trades", tags=["trades"])


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
        doc["_id"] = str(doc["_id"])
        if doc.get("timestamp"):
            doc["timestamp"] = doc["timestamp"].isoformat()
        trades.append(doc)

    return {
        "trades": trades,
        "total": total,
        "page": page,
        "limit": limit,
        "pages": (total + limit - 1) // limit,
    }
