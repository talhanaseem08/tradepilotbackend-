from __future__ import annotations

import hashlib
from dataclasses import dataclass

from bson import ObjectId
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

from app.config.database import get_db
from app.config.settings import settings


@dataclass
class UserBrokerCredentials:
    broker_name: str
    api_key: str
    secret_key: str | None = None
    account_id: str | None = None
    environment: str | None = None
    is_testnet: bool | None = None

    @property
    def oanda_base_url(self) -> str:
        return (
            "https://api-fxtrade.oanda.com"
            if self.environment == "live"
            else "https://api-fxpractice.oanda.com"
        )


def _decrypt(stored: str | None) -> str | None:
    if not stored or not settings.encryption_key:
        return None

    try:
        iv_hex, tag_hex, ciphertext_hex = stored.split(":")
        key = hashlib.sha256(settings.encryption_key.encode("utf-8")).digest()
        aesgcm = AESGCM(key)
        iv = bytes.fromhex(iv_hex)
        tag = bytes.fromhex(tag_hex)
        ciphertext = bytes.fromhex(ciphertext_hex)
        decrypted = aesgcm.decrypt(iv, ciphertext + tag, None)
        return decrypted.decode("utf-8")
    except Exception:
        return None


def _user_variants(user_id: str) -> list[object]:
    variants: list[object] = [user_id]
    try:
        variants.insert(0, ObjectId(user_id))
    except Exception:
        pass
    return variants


async def get_user_broker_credentials(
    user_id: str | None,
    market: str = "forex",
) -> UserBrokerCredentials | None:
    if not user_id:
        return None

    db = get_db()
    if db is None:
        return None

    broker_name = "binance" if market == "crypto" else "oanda"
    account = await db.get_collection("brokeraccounts").find_one(
        {
            "userID": {"$in": _user_variants(user_id)},
            "brokerName": broker_name,
            "isVerified": True,
        }
    )
    if not account:
        return None

    api_key = _decrypt(account.get("apiKey"))
    if not api_key:
        return None

    if broker_name == "oanda":
        return UserBrokerCredentials(
            broker_name="oanda",
            api_key=api_key,
            account_id=account.get("accountId"),
            environment=account.get("environment", "practice"),
        )

    secret_key = _decrypt(account.get("secretKey"))
    if not secret_key:
        return None

    return UserBrokerCredentials(
        broker_name="binance",
        api_key=api_key,
        secret_key=secret_key,
        is_testnet=bool(account.get("isTestnet", True)),
    )
