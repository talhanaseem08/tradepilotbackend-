"""
Crypto high risk — logic aligned with E:\\crypto bots\\cryptobots\\high_risk\\strategy\\strategy.py
(indicators, signal, detect_latest_intent).
"""
from __future__ import annotations

from typing import Any, Optional

import numpy as np
import pandas as pd


def indicators(df: pd.DataFrame) -> pd.DataFrame:
    out = df.copy()
    out["ema_fast"] = out["Close"].ewm(span=9, adjust=False).mean()
    out["ema_slow"] = out["Close"].ewm(span=21, adjust=False).mean()

    delta = out["Close"].diff()
    gain = np.where(delta > 0, delta, 0.0)
    loss = np.where(delta < 0, -delta, 0.0)
    gain_sma = pd.Series(gain, index=out.index).rolling(14).mean()
    loss_sma = pd.Series(loss, index=out.index).rolling(14).mean()
    rs = gain_sma / loss_sma.replace(0, np.nan)
    out["rsi"] = 100 - (100 / (1 + rs))

    hl = out["High"] - out["Low"]
    hc = (out["High"] - out["Close"].shift()).abs()
    lc = (out["Low"] - out["Close"].shift()).abs()
    tr = pd.concat([hl, hc, lc], axis=1).max(axis=1)
    out["atr"] = tr.rolling(14).mean()
    return out.dropna().copy()


def signal(row: pd.Series) -> Optional[str]:
    if row["ema_fast"] > row["ema_slow"] and row["rsi"] > 55:
        return "LONG"
    if row["ema_fast"] < row["ema_slow"] and row["rsi"] < 45:
        return "SHORT"
    return None


def analyze_crypto_high_intent(df: pd.DataFrame, params: dict) -> Optional[dict[str, Any]]:
    """
    Same as detect_latest_intent() in original; atr_stop_mult / atr_tp_mult default to 1.5 / 3.0
    like backtest_pair / detect_latest_intent hardcoded values.
    Output uses take_profit + units for the trading-service bot layer.
    """
    risk_per_trade = float(params.get("risk_per_trade_usd", 1000.0))
    atr_sl = float(params.get("atr_stop_mult", 1.5))
    atr_tp = float(params.get("atr_tp_mult", 3.0))

    data = indicators(df)
    if len(data) < 2:
        return None
    i = len(data) - 1
    prev_row = data.iloc[i - 1]
    row = data.iloc[i]
    sig = signal(prev_row)
    if sig is None:
        return None
    entry = row["Open"]
    atr = prev_row["atr"]
    if np.isnan(atr) or atr <= 0:
        return None
    if sig == "LONG":
        stop = entry - atr_sl * atr
        target = entry + atr_tp * atr
        risk_per_unit = entry - stop
    else:
        stop = entry + atr_sl * atr
        target = entry - atr_tp * atr
        risk_per_unit = stop - entry
    if risk_per_unit <= 0:
        return None
    quantity = risk_per_trade / risk_per_unit
    return {
        "side": sig,
        "entry": float(entry),
        "stop": float(stop),
        "take_profit": float(target),
        "units": float(quantity),
    }
