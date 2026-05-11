"""OHLCV fetching (Binance public API through ccxt)."""
from __future__ import annotations

import ccxt
import pandas as pd

from common.config import BINANCE_ID, CANDLE_LIMIT


def build_binance_client() -> ccxt.Exchange:
    return getattr(ccxt, BINANCE_ID)({"enableRateLimit": True})


def ohlcv_rows_to_dataframe(raw: list) -> pd.DataFrame:
    df = pd.DataFrame(raw, columns=["timestamp", "open", "high", "low", "close", "volume"])
    df["datetime"] = pd.to_datetime(df["timestamp"], unit="ms")
    return df[["datetime", "open", "high", "low", "close", "volume"]]


def fetch_ohlcv(
    symbol: str,
    timeframe: str,
    limit: int = CANDLE_LIMIT,
    since: int | None = None,
) -> pd.DataFrame:
    """Fetch OHLCV; columns: datetime, open, high, low, close, volume (lowercase)."""
    client = build_binance_client()
    raw = client.fetch_ohlcv(symbol, timeframe=timeframe, since=since, limit=limit)
    return ohlcv_rows_to_dataframe(raw)


def fetch_ohlcv_historical_ms(
    symbol: str,
    timeframe: str,
    since_ms: int,
    until_ms: int,
) -> pd.DataFrame:
    """Paginate OHLCV; candle open times in [since_ms, until_ms)."""
    client = build_binance_client()
    all_rows: list = []
    since = since_ms
    while since < until_ms:
        batch = client.fetch_ohlcv(symbol, timeframe=timeframe, since=since, limit=1000)
        if not batch:
            break
        all_rows.extend(batch)
        last_ts = batch[-1][0]
        if last_ts >= until_ms - 1:
            break
        if len(batch) < 1000:
            break
        since = last_ts + 1

    if not all_rows:
        return pd.DataFrame(columns=["datetime", "open", "high", "low", "close", "volume"])
    df = ohlcv_rows_to_dataframe(all_rows)
    t_lo = pd.to_datetime(since_ms, unit="ms")
    t_hi = pd.to_datetime(until_ms, unit="ms")
    df = df[(df["datetime"] >= t_lo) & (df["datetime"] < t_hi)]
    return df.drop_duplicates(subset=["datetime"]).sort_values("datetime").reset_index(drop=True)


def to_legacy_ohlc_columns(df: pd.DataFrame) -> pd.DataFrame:
    """Rename to Open/High/Low/Close/Volume with DatetimeIndex (strategy-compatible)."""
    out = df.set_index("datetime")
    out = out.rename(
        columns={
            "open": "Open",
            "high": "High",
            "low": "Low",
            "close": "Close",
            "volume": "Volume",
        }
    )
    return out[["Open", "High", "Low", "Close", "Volume"]].copy()


def fetch_legacy_ohlc_range(
    symbol_ccxt: str,
    timeframe: str,
    start: str,
    end: str,
) -> pd.DataFrame:
    """
    Load OHLC for [start, end) as yfinance-shaped DataFrame (capital OHLC + Volume).
    start/end: 'YYYY-MM-DD'.
    """
    t0 = pd.Timestamp(start)
    t1 = pd.Timestamp(end)
    since_ms = int(t0.timestamp() * 1000)
    until_ms = int(t1.timestamp() * 1000)
    df = fetch_ohlcv_historical_ms(symbol_ccxt, timeframe, since_ms, until_ms)
    if df.empty:
        raise ValueError(f"No OHLCV data for {symbol_ccxt} {timeframe} {start}..{end}")
    legacy = to_legacy_ohlc_columns(df)
    legacy.index = pd.to_datetime(legacy.index)
    return legacy.dropna()
