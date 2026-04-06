from datetime import datetime, timezone
from fastapi import APIRouter
from app.core.ollama_client import ollama_client

router = APIRouter()


@router.get("/health")
async def health_check():
    ollama_ok = await ollama_client.is_healthy()
    status = "ok" if ollama_ok else "degraded"

    return {
        "status": status,
        "service": "agent-service",
        "ollama_reachable": ollama_ok,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
