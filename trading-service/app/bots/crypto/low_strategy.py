"""
Crypto low risk — logic aligned with E:\\crypto bots\\cryptobots\\low_risk\\strategy\\strategy.py
(calculate_indicators, generate_signals, detect_latest_intent).
"""
from __future__ import annotations

from typing import Any, Optional

import numpy as np
import pandas as pd

# Defaults match low_risk/config.py: RISK_PER_TRADE, STOP_ATR_MULT, TP_ATR_MULT, etc.
_DEFAULT_RISK_PER_TRADE = 10_000.0


def calculate_indicators(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df["SMA50"] = df["Close"].rolling(50).mean()
    df["SMA200"] = df["Close"].rolling(200).mean()
    delta = df["Close"].diff()
    gain = delta.clip(lower=0)
    loss = -delta.clip(upper=0)
    avg_gain = gain.rolling(14).mean()
    avg_loss = loss.rolling(14).mean()
    rs = avg_gain / avg_loss.replace(0, np.nan)
    df["RSI"] = 100 - (100 / (1 + rs))

    tr1 = df["High"] - df["Low"]
    tr2 = (df["High"] - df["Close"].shift()).abs()
    tr3 = (df["Low"] - df["Close"].shift()).abs()
    tr = pd.concat([tr1, tr2, tr3], axis=1).max(axis=1)
    df["ATR"] = tr.rolling(14).mean()
    return df.dropna().copy()


def generate_signals(row: pd.Series, long_only: bool, rsi_low: float, rsi_high: float) -> int:
    bull_trend = row["SMA50"] > row["SMA200"]
    bear_trend = row["SMA50"] < row["SMA200"]

    if bull_trend and row["Close"] > row["SMA50"] and rsi_low <= row["RSI"] <= rsi_high:
        return 1
    if not long_only and bear_trend and row["Close"] < row["SMA50"] and (100 - rsi_high) <= row["RSI"] <= (100 - rsi_low):
        return -1
    return 0


def analyze_crypto_low_intent(df: pd.DataFrame, params: dict) -> Optional[dict[str, Any]]:
    """
    Same as detect_latest_intent() in original; risk/stop/tp from params
    (maps risk_per_trade_usd → RISK_PER_TRADE).
    """
    long_only = params.get("long_only", True)
    rsi_low = float(params.get("rsi_low", 48))
    rsi_high = float(params.get("rsi_high", 68))
    stop_atr_mult = float(params.get("stop_atr_mult", 2.0))
    tp_atr_mult = float(params.get("tp_atr_mult", 5.0))
    risk_per_trade = float(params.get("risk_per_trade_usd", _DEFAULT_RISK_PER_TRADE))

    if len(df) < 2:
        return None
    data = calculate_indicators(df)
    if len(data) < 2:
        return None
    i = len(data) - 1
    prev = data.iloc[i - 1]
    row = data.iloc[i]
    sig = generate_signals(prev, long_only, rsi_low, rsi_high)
    if sig == 0:
        return None
    atr = row["ATR"]
    if pd.isna(atr) or atr <= 0:
        return None
    entry = row["Open"]
    stop_distance = stop_atr_mult * atr
    if stop_distance <= 0:
        return None
    units = risk_per_trade / stop_distance
    if units <= 0:
        return None
    if sig == 1:
        stop_price = entry - stop_distance
        take_profit = entry + ((tp_atr_mult / stop_atr_mult) * stop_distance)
        side = "LONG"
    else:
        stop_price = entry + stop_distance
        take_profit = entry - ((tp_atr_mult / stop_atr_mult) * stop_distance)
        side = "SHORT"
    return {
        "side": side,
        "entry": float(entry),
        "stop": float(stop_price),
        "take_profit": float(take_profit),
        "units": float(units),
    }
