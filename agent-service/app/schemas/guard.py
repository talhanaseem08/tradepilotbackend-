from pydantic import BaseModel, Field


class ForexGuardRequest(BaseModel):
    symbol: str = Field(..., min_length=3)
    market: str = "forex"
    current_time: str | None = None
    include_ai: bool = False


class ForexGuardAssistantResponse(BaseModel):
    summary: str
    pause_explanation: str
    ambiguous_events: list[str] = []
    suggested_action: str = "none"
    suggested_pause_minutes: int = 0
    suggested_block_until: str | None = None
    confidence: float = 0.0


class ForexGuardResponse(BaseModel):
    allowed: bool
    reason: str | None = None
    blocked_until: str | None = None
    matched_events: list[str] = []
    assistant: ForexGuardAssistantResponse | None = None
