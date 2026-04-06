from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.config.redis import get_redis, close_redis
from app.core.ollama_client import ollama_client
from app.workers.agent_worker import start_agent_worker, stop_agent_worker
from app.utils.logger import get_logger

logger = get_logger()


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("agent-service starting up")
    await get_redis()
    logger.info("redis connected")
    ollama_ok = await ollama_client.is_healthy()
    logger.info("ollama remote status", healthy=ollama_ok)
    start_agent_worker()
    yield
    stop_agent_worker()
    await ollama_client.close()
    await close_redis()
    logger.info("agent-service shut down")
