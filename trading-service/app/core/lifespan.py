from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.config.redis import get_redis, close_redis
from app.config.database import connect_mongo, close_mongo
from app.core.nlp_client import nlp_client
from app.utils.logger import get_logger

logger = get_logger()


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("trading-service starting up")
    await get_redis()
    logger.info("redis connected")
    await connect_mongo()
    logger.info("mongodb connected")
    nlp_ok = await nlp_client.is_healthy()
    logger.info("nlp service status", healthy=nlp_ok)
    yield
    await nlp_client.close()
    await close_redis()
    await close_mongo()
    logger.info("trading-service shut down")
