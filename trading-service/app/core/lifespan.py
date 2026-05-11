from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.config.redis import get_redis, close_redis
from app.config.database import connect_mongo, close_mongo
from app.config.indexes import create_indexes
from app.core.agent_client import agent_client
from app.core.nlp_client import nlp_client
from app.workers.update_worker import start_update_worker, stop_update_worker
from app.workers.execution_worker import start_execution_worker, stop_execution_worker
from app.workers.monitor_worker import start_monitor_worker, stop_monitor_worker
from app.services.data_ingestion import start_ingestion_worker, stop_ingestion_worker
from app.utils.logger import get_logger

logger = get_logger()


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("trading-service starting up")
    await get_redis()
    logger.info("redis connected")
    await connect_mongo()
    logger.info("mongodb connected")
    await create_indexes()
    nlp_ok = await nlp_client.is_healthy()
    logger.info("nlp service status", healthy=nlp_ok)
    start_update_worker()
    start_execution_worker()
    start_ingestion_worker()
    start_monitor_worker()
    yield
    stop_monitor_worker()
    stop_ingestion_worker()
    stop_execution_worker()
    stop_update_worker()
    await agent_client.close()
    await nlp_client.close()
    await close_redis()
    await close_mongo()
    logger.info("trading-service shut down")
