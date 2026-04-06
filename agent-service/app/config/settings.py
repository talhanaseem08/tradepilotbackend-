from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    agent_service_port: int = 8003
    redis_host: str = "localhost"
    redis_port: int = 6379
    ollama_remote_url: str = "http://localhost:11434"
    deepseek_model: str = "deepseek-r1:14b"
    agent_consumer_group: str = "agent-workers"
    agent_consumer_name: str = "agent-1"

    class Config:
        env_file = ".env"


settings = Settings()
