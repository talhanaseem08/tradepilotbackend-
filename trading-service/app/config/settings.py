from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    trading_service_port: int = 8002
    redis_host: str = "localhost"
    redis_port: int = 6379
    mongo_uri: str = "mongodb://localhost:27017/tradepilot"
    mongo_db_name: str = "tradepilot"
    nlp_service_url: str = "http://localhost:8001"
    broker_mode: str = "paper"
    execution_interval_seconds: int = 300   # how often the loop runs (5 min)
    max_open_trades_per_user: int = 3       # cross-bot risk guard
    paper_initial_balance: float = 10000.0  # starting balance for paper broker

    # OANDA
    oanda_api_key: str = ""
    oanda_account_id: str = ""
    oanda_base_url: str = "https://api-fxpractice.oanda.com"

    # Binance via CCXT
    binance_api_key: str = ""
    binance_api_secret: str = ""
    binance_sandbox: bool = True

    # MetaTrader 5
    mt5_login: int = 0
    mt5_password: str = ""
    mt5_server: str = ""
    mt5_path: str = ""

    class Config:
        env_file = ".env"


settings = Settings()
