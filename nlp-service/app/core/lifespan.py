from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.config.redis import get_redis, close_redis
from app.core.model_loader import load_finbert
from app.core.ollama_client import ollama_client
from app.workers.news_collector import start_news_collector, stop_news_collector
from app.utils.logger import get_logger

logger = get_logger()


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("nlp-service starting up")
    await get_redis()
    logger.info("redis connected")
    await load_finbert()
    ollama_ok = await ollama_client.is_healthy()
    logger.info("ollama status", healthy=ollama_ok)
    start_news_collector()
    yield
    stop_news_collector()
    await ollama_client.close()
    await close_redis()
    logger.info("nlp-service shut down")
