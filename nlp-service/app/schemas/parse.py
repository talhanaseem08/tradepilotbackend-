from pydantic import BaseModel


class ParseRequest(BaseModel):
    prompt: str


class ParseResponse(BaseModel):
    intent: str | None = None
    risk_level: str | None = None
    market: list[str] = []
    strategy_type: str | None = None
    analysis_mode: str | None = None
    symbol: str | None = None
    timeframe: str | None = None
    stop_loss_pips: float | None = None
    take_profit_pips: float | None = None
    confidence: float | None = None
    raw_output: str | None = None
