from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.config.redis import get_redis, close_redis
from app.utils.logger import get_logger

logger = get_logger()


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("agent-service starting up")
    await get_redis()
    logger.info("redis connected")
    yield
    await close_redis()
    logger.info("agent-service shut down")
