from fastapi import APIRouter, HTTPException
from app.config.database import get_db
from app.utils.logger import get_logger

logger = get_logger()
router = APIRouter(prefix="/optimization-logs", tags=["optimization-logs"])


@router.get("/")
async def get_optimization_logs(
    bot_id: str = None,
    limit: int = 20,
    page: int = 1,
):
    db = get_db()
    if db is None:
        raise HTTPException(status_code=503, detail="Database not connected")

    query = {}
    if bot_id:
        query["botID"] = bot_id

    skip = (page - 1) * limit
    total = await db.optimization_logs.count_documents(query)
    cursor = db.optimization_logs.find(query).sort("timestamp", -1).skip(skip).limit(limit)

    logs = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        if doc.get("timestamp"):
            doc["timestamp"] = doc["timestamp"].isoformat()
        logs.append(doc)

    return {
        "logs": logs,
        "total": total,
        "page": page,
        "limit": limit,
        "pages": (total + limit - 1) // limit,
    }
