"""Gateway candle dicts → time-indexed OHLC DataFrame (pandas)."""
from __future__ import annotations

import pandas as pd


def candles_to_ohlc_df(candles: list[dict]) -> pd.DataFrame:
    """Normalize gateway candle dicts to a time-indexed OHLC DataFrame."""
    rows = []
    for c in candles:
        ts = c.get("timestamp") or c.get("time") or c.get("t")
        o = float(c.get("open", c.get("o", 0)))
        h = float(c.get("high", c.get("h", 0)))
        l = float(c.get("low", c.get("l", 0)))
        cl = float(c.get("close", c.get("c", 0)))
        rows.append({"ts": pd.Timestamp(ts), "Open": o, "High": h, "Low": l, "Close": cl})
    if not rows:
        return pd.DataFrame()
    df = pd.DataFrame(rows).set_index("ts").sort_index()
    return df
