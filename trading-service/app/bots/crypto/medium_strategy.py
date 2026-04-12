"""
Crypto medium risk — logic aligned with E:\\crypto bots\\cryptobots\\medium_risk\\strategy\\strategy.py
(compute_pivot_high, run_backtest_for_symbol loop). Intent = last-bar entry still open before EOD block.
"""
from __future__ import annotations

from typing import Any, Optional

import numpy as np
import pandas as pd


def compute_pivot_high(high_series: pd.Series, left: int, right: int) -> pd.Series:
    """Compute pivot highs similar to TradingView's ta.pivothigh (same as original)."""
    pivots = []
    length = len(high_series)
    for i in range(length):
        if i < left or i + right >= length:
            pivots.append(np.nan)
            continue
        window = high_series.iloc[i - left : i + right + 1]
        pivots.append(high_series.iloc[i] if high_series.iloc[i] == window.max() else np.nan)
    return pd.Series(pivots, index=high_series.index)


def _to_medium_df(df: pd.DataFrame) -> pd.DataFrame:
    """OHLC (Open/High/Low/Close index) → datetime + open/high/low/close like common.data fetch."""
    d = df.reset_index()
    first = d.columns[0]
    d = d.rename(columns={first: "datetime", "Open": "open", "High": "high", "Low": "low", "Close": "close"})
    return d


def analyze_crypto_medium_intent(df: pd.DataFrame, params: dict) -> Optional[dict[str, Any]]:
    """
    Runs the same bar loop as run_backtest_for_symbol in the original strategy (wallet + exits).
    Returns an entry intent only if a long opens on the **last** bar and TP/SL does not close it
    in that same iteration (mirrors open position before the original EOD close block).
    """
    if len(df) < 8:
        return None

    initial_balance = float(params.get("initial_balance", 100_000.0))
    position_pct = float(params.get("position_pct", 0.10))
    max_ob_pct = float(params.get("max_ob_pct", 4.0))
    pivot_len = int(params.get("pivot_len", 5))

    df = _to_medium_df(df)
    wallet = initial_balance

    ob_high: Optional[float] = None
    ob_low: Optional[float] = None
    ob_used = False

    pivot_high = compute_pivot_high(df["high"], pivot_len, pivot_len)

    position_open = False
    entry_price = 0.0
    position_size = 0.0
    stop_price = 0.0
    entry_time: Optional[pd.Timestamp] = None
    target_price: Optional[float] = None

    last_i = len(df) - 1

    for i in range(6, len(df)):
        row = df.iloc[i]
        ob_range_pct = abs(df["high"].iloc[i - 3] - df["low"].iloc[i - 3]) / df["low"].iloc[i - 3] * 100
        bull_ob = (
            df["close"].iloc[i - 3] < df["open"].iloc[i - 3]
            and ob_range_pct <= max_ob_pct
            and df["close"].iloc[i - 5] > df["open"].iloc[i - 5]
            and df["close"].iloc[i - 4] > df["open"].iloc[i - 4]
            and df["close"].iloc[i - 2] > df["open"].iloc[i - 2]
            and df["close"].iloc[i - 1] > df["open"].iloc[i - 1]
        )

        if bull_ob:
            ob_high = df["high"].iloc[i - 3]
            ob_low = df["low"].iloc[i - 3]
            ob_used = False

        if not position_open and not ob_used and ob_high is not None and ob_low is not None:
            long_touch = row["low"] <= ob_high and row["high"] >= ob_low
            if long_touch:
                position_size = (wallet * position_pct) / row["close"]
                entry_price = row["close"]
                stop_price = ob_low
                position_open = True
                entry_time = row["datetime"]
                ob_used = True
                target_price = None

        if position_open:
            if not np.isnan(pivot_high.iloc[i]) and pivot_high.iloc[i] > entry_price:
                target_price = pivot_high.iloc[i]
                if row["high"] >= target_price:
                    exit_price = target_price
                    pnl = (exit_price - entry_price) * position_size
                    wallet += pnl
                    position_open = False
                    continue

            if row["close"] < stop_price:
                exit_price = stop_price
                pnl = (exit_price - entry_price) * position_size
                wallet += pnl
                position_open = False
                continue

    # Original would close remaining position at last close here; we only expose intent if still open
    # from an entry on the final bar (same as prior TradePilot behavior).
    if position_open and entry_time is not None:
        last_dt = df.iloc[last_i]["datetime"]
        if entry_time == last_dt:
            risk = entry_price - stop_price if stop_price else 0
            if target_price is not None and target_price > entry_price:
                tp = float(target_price)
            else:
                tp = float(entry_price + 2 * risk) if risk > 0 else float(entry_price)
            return {
                "side": "LONG",
                "entry": float(entry_price),
                "stop": float(stop_price),
                "take_profit": tp,
                "units": float(position_size),
            }
    return None
