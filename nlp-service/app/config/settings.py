from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    nlp_service_port: int = 8001
    ollama_local_url: str = "http://localhost:11434"
    mistral_model_name: str = "tradepilot-mistral"
    finbert_model_name: str = "tabularisai/ModernFinBERT"
    redis_host: str = "localhost"
    redis_port: int = 6379
    news_fetch_interval_minutes: int = 15
    news_max_age_hours: int = 4
    jblanked_api_key: str = ""

    class Config:
        env_file = ".env"


settings = Settings()
