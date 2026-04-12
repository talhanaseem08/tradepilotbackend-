from app.config.database import get_db
from app.utils.logger import get_logger

logger = get_logger()


async def create_indexes():
    db = get_db()
    if db is None:
        return

    # bot_instances
    await db.bot_instances.create_index([("botID", 1)], unique=True)
    await db.bot_instances.create_index([("userID", 1)])
    await db.bot_instances.create_index([("status", 1)])

    # trade_records
    await db.trade_records.create_index([("botID", 1)])
    await db.trade_records.create_index([("userID", 1)])
    await db.trade_records.create_index([("symbol", 1)])
    await db.trade_records.create_index([("timestamp", -1)])
    await db.trade_records.create_index([("userID", 1), ("timestamp", -1)])

    # backtest_reports
    await db.backtest_reports.create_index([("symbol", 1)])
    await db.backtest_reports.create_index([("created_at", -1)])

    logger.info("mongodb indexes created")
