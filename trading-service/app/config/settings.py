from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    trading_service_port: int = 8002
    redis_host: str = "localhost"
    redis_port: int = 6379
    mongo_uri: str = "mongodb://localhost:27017/tradepilot"
    mongo_db_name: str = "tradepilot"
    nlp_service_url: str = "http://localhost:8001"
    agent_service_url: str = "http://localhost:8003"
    broker_mode: str = "broker"
    execution_interval_seconds: int = 300   # how often the loop runs (5 min)
    max_open_trades_per_user: int = 3       # cross-bot risk guard
    paper_initial_balance: float = 10000.0  # starting balance for paper broker
    encryption_key: str = ""

    # OANDA
    oanda_api_key: str = ""
    oanda_account_id: str = ""
    oanda_base_url: str = "https://api-fxpractice.oanda.com"

    # Binance via CCXT
    binance_api_key: str = ""
    binance_api_secret: str = ""
    binance_sandbox: bool = True

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
