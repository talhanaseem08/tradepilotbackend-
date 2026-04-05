from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    trading_service_port: int = 8002
    redis_host: str = "localhost"
    redis_port: int = 6379
    mongo_uri: str = "mongodb://localhost:27017/tradepilot"
    mongo_db_name: str = "tradepilot"
    nlp_service_url: str = "http://localhost:8001"
    broker_mode: str = "paper"

    class Config:
        env_file = ".env"


settings = Settings()
