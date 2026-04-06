from datetime import datetime, timezone
from fastapi import APIRouter
from app.core.nlp_client import nlp_client

router = APIRouter()


@router.get("/health")
async def health_check():
    nlp_ok = await nlp_client.is_healthy()
    status = "ok" if nlp_ok else "degraded"

    return {
        "status": status,
        "service": "trading-service",
        "nlp_reachable": nlp_ok,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
