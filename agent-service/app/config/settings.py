from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    agent_service_port: int = 8003
    redis_host: str = "localhost"
    redis_port: int = 6379
    mongo_uri: str = "mongodb://localhost:27017/tradepilot"
    mongo_db_name: str = "tradepilot"
    ollama_remote_url: str = "http://localhost:11434"
    deepseek_model: str = "deepseek-r1:70b"
    nlp_service_url: str = "http://localhost:8001"
    trading_service_url: str = "http://localhost:8002"
    forex_news_pause_before_minutes: int = 30
    forex_news_pause_after_minutes: int = 30
    forex_guard_cache_seconds: int = 300
    forex_guard_ai_cache_seconds: int = 600

    class Config:
        env_file = ".env"


settings = Settings()
