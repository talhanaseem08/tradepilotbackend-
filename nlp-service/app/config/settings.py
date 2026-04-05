from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    nlp_service_port: int = 8001
    ollama_local_url: str = "http://localhost:11434"
    redis_host: str = "localhost"
    redis_port: int = 6379
    finbert_model_path: str = "./models/finbert"

    class Config:
        env_file = ".env"


settings = Settings()
