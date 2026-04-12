from pydantic import BaseModel
from typing import Optional


class BacktestRequest(BaseModel):
    bot_type: str
    symbol: str
    market: str = "forex"
    timeframe: str = "1h"
    parameters: dict = {}
    candles: list[dict] = []
    date_from: Optional[str] = None  # ISO date e.g. "2026-01-12"
    date_to: Optional[str] = None    # ISO date e.g. "2026-04-12"


class TradeRecord(BaseModel):
    trade_no: int
    side: str
    entry_time: str
    exit_time: str
    entry_price: float
    exit_price: float
    stop_loss: float
    take_profit: float
    pnl_pct: float
    pnl_usd: float = 0.0  # $ P&L assuming linear sizing: -risk at SL, +risk×(TPdist/Rdist) at TP
    result: str  # "WIN" or "LOSS"


class BacktestResult(BaseModel):
    total_trades: int = 0
    winning_trades: int = 0
    losing_trades: int = 0
    win_rate: float = 0.0
    total_profit_pct: float = 0.0
    total_pnl_usd: float = 0.0
    gross_profit_usd: float = 0.0
    gross_loss_usd: float = 0.0
    max_drawdown_pct: float = 0.0
    max_drawdown_usd: float = 0.0
    sharpe_ratio: float = 0.0
    profit_factor: float = 0.0
    profit_factor_usd: float = 0.0
    trades: list[TradeRecord] = []
