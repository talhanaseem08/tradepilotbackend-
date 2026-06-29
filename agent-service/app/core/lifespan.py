from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.config.redis import get_redis, close_redis
from app.config.database import connect_mongo, close_mongo
from app.core.ollama_client import ollama_client
from app.services.forex_guard_service import close_forex_news_client
from app.utils.logger import get_logger

logger = get_logger()


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("agent-service starting up")
    await get_redis()
    logger.info("redis connected")
    await connect_mongo()
    logger.info("mongodb connected")
    yield
    await close_forex_news_client()
    await ollama_client.close()
    await close_redis()
    await close_mongo()
    logger.info("agent-service shut down")
