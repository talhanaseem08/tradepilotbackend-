from pydantic import BaseModel


class BacktestRequest(BaseModel):
    bot_type: str
    symbol: str
    market: str = "forex"
    timeframe: str = "1h"
    parameters: dict = {}
    candles: list[dict] = []


class BacktestResult(BaseModel):
    total_trades: int = 0
    winning_trades: int = 0
    losing_trades: int = 0
    win_rate: float = 0.0
    total_profit_pct: float = 0.0
    max_drawdown_pct: float = 0.0
    sharpe_ratio: float = 0.0
    profit_factor: float = 0.0
