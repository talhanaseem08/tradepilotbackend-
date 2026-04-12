from app.config.database import get_db
from app.utils.logger import get_logger

logger = get_logger()


async def create_indexes():
    db = get_db()
    if db is None:
        return

    # optimization_logs
    await db.optimization_logs.create_index([("botID", 1)])
    await db.optimization_logs.create_index([("timestamp", -1)])

    logger.info("mongodb indexes created")
