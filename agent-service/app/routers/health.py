from datetime import datetime, timezone
from fastapi import APIRouter
from app.config.database import get_db
from app.config.redis import get_redis

router = APIRouter()


@router.get("/health")
async def health_check():
    redis_ok = True
    mongo_ok = get_db() is not None
    try:
        redis = await get_redis()
        await redis.ping()
    except Exception:
        redis_ok = False

    status = "ok" if redis_ok and mongo_ok else "degraded"

    return {
        "status": status,
        "service": "agent-service",
        "redis_reachable": redis_ok,
        "mongo_connected": mongo_ok,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
