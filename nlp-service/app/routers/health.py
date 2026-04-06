from datetime import datetime, timezone
from fastapi import APIRouter
from app.core.model_loader import get_finbert
from app.core.ollama_client import ollama_client

router = APIRouter()


@router.get("/health")
async def health_check():
    model, tokenizer = get_finbert()
    finbert_loaded = model is not None and tokenizer is not None
    ollama_ok = await ollama_client.is_healthy()

    status = "ok" if finbert_loaded and ollama_ok else "degraded"

    return {
        "status": status,
        "service": "nlp-service",
        "finbert_loaded": finbert_loaded,
        "ollama_reachable": ollama_ok,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
