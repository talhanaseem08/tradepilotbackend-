from typing import Literal

from pydantic import BaseModel, StrictBool, field_validator


MAX_CREDENTIAL_LENGTH = 512


def _clean_required_string(value: str, field_name: str, max_length: int = MAX_CREDENTIAL_LENGTH) -> str:
    if not isinstance(value, str):
        raise ValueError(f"{field_name} is required")

    normalized = value.strip()
    if not normalized:
        raise ValueError(f"{field_name} is required")

    if len(normalized) > max_length:
        raise ValueError(f"{field_name} is too long")

    if any(ord(char) < 32 or ord(char) == 127 for char in normalized):
        raise ValueError(f"{field_name} contains invalid characters")

    return normalized


class OandaVerifyRequest(BaseModel):
    apiKey: str
    accountId: str
    environment: Literal["practice", "live"] = "practice"

    @field_validator("apiKey")
    @classmethod
    def validate_api_key(cls, value: str) -> str:
        return _clean_required_string(value, "OANDA API key")

    @field_validator("accountId")
    @classmethod
    def validate_account_id(cls, value: str) -> str:
        return _clean_required_string(value, "OANDA account ID", 128)


class BinanceVerifyRequest(BaseModel):
    apiKey: str
    secretKey: str
    isTestnet: StrictBool = True

    @field_validator("apiKey")
    @classmethod
    def validate_api_key(cls, value: str) -> str:
        return _clean_required_string(value, "Binance API key")

    @field_validator("secretKey")
    @classmethod
    def validate_secret_key(cls, value: str) -> str:
        return _clean_required_string(value, "Binance secret key")


class VerifyResponse(BaseModel):
    success: bool
    error: str = None
    balance: float = None
    equity: float = None
    currency: str = None
