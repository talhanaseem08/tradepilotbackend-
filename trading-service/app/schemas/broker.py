from pydantic import BaseModel


class MT5VerifyRequest(BaseModel):
    login: int
    password: str
    server: str


class OandaVerifyRequest(BaseModel):
    apiKey: str
    accountId: str
    environment: str = "practice"


class VerifyResponse(BaseModel):
    success: bool
    error: str = None
    balance: float = None
    equity: float = None
    currency: str = None