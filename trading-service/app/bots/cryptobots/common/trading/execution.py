"""Order placement (Bybit — matches existing medium-risk live path)."""
from __future__ import annotations

import ccxt

from common.trading.clients import build_bybit_client


def place_long_market(client: ccxt.Exchange, symbol: str, size: float) -> dict:
    return client.create_market_buy_order(symbol, size)


def place_short_market(client: ccxt.Exchange, symbol: str, size: float) -> dict:
    return client.create_market_sell_order(symbol, size)
