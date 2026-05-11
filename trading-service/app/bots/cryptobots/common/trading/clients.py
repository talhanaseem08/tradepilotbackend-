"""Authenticated ccxt clients (Binance spot, Bybit)."""
from __future__ import annotations

import ccxt

from common.config import BINANCE_ID, BYBIT_ID
from common.creds.binance import load_binance_creds
from common.creds.bybit import load_bybit_creds


def build_binance_trading_client(testnet: bool = True) -> ccxt.Exchange:
    creds = load_binance_creds()
    client = getattr(ccxt, BINANCE_ID)(
        {
            "apiKey": creds["API_KEY"],
            "secret": creds["API_SECRET_KEY"],
            "enableRateLimit": True,
        }
    )
    client.set_sandbox_mode(testnet)
    return client


def build_bybit_client(testnet: bool = True) -> ccxt.Exchange:
    creds = load_bybit_creds()
    client = getattr(ccxt, BYBIT_ID)(
        {
            "apiKey": creds["API_KEY"],
            "secret": creds["API_SECRET_KEY"],
            "enableRateLimit": True,
        }
    )
    client.set_sandbox_mode(testnet)
    return client
