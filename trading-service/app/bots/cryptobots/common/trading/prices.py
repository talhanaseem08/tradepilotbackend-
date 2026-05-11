"""Latest prices from Binance public API."""
from __future__ import annotations

from common.data.data_fetch import build_binance_client


def get_last_price(symbol: str) -> float:
    client = build_binance_client()
    t = client.fetch_ticker(symbol)
    return float(t["last"])
