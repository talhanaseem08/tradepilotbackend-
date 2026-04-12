"""
Debug / test utilities — NOT for production use.
"""

from fastapi import APIRouter
from app.workers.execution_worker import _run_cycle

router = APIRouter(prefix="/debug", tags=["debug"])


@router.post("/execute")
async def trigger_execution_cycle():
    """Manually trigger one bot execution cycle (for testing)."""
    await _run_cycle()
    return {"status": "cycle complete"}
