from motor.motor_asyncio import AsyncIOMotorClient
from app.config.settings import settings

mongo_client: AsyncIOMotorClient | None = None
db = None


async def connect_mongo():
    global mongo_client, db
    mongo_client = AsyncIOMotorClient(settings.mongo_uri)
    db = mongo_client[settings.mongo_db_name]
    return db


async def close_mongo():
    global mongo_client
    if mongo_client:
        mongo_client.close()
        mongo_client = None


def get_db():
    return db
