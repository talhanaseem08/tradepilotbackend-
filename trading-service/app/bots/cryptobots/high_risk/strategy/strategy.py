"""High-risk strategy logic only (unchanged from original)."""
from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, List, Optional

import numpy as np
import pandas as pd


@dataclass
class Trade:
    pair: str
    side: str
    entry_time: pd.Timestamp
    exit_time: pd.Timestamp
    entry_price: float
    exit_price: float
    stop_price: float
    target_price: float
    quantity: float
    pnl_usd: float
    return_pct: float
    result: str
    reason: str


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


def backtest_pair(
    pair_label: str,
    df: pd.DataFrame,
    risk_per_trade: float = 1000.0,
) -> List[Trade]:
    trades: List[Trade] = []
    in_pos = False
    state: Dict[str, float] = {}
    entry_time = None
    side = None

    for i in range(1, len(df)):
        prev_row = df.iloc[i - 1]
        row = df.iloc[i]
        idx = df.index[i]

        if not in_pos:
            sig = signal(prev_row)
            if sig is None:
                continue

            entry = row["Open"]
            atr = prev_row["atr"]
            if np.isnan(atr) or atr <= 0:
                continue

            if sig == "LONG":
                stop = entry - 1.5 * atr
                target = entry + 3.0 * atr
                risk_per_unit = entry - stop
            else:
                stop = entry + 1.5 * atr
                target = entry - 3.0 * atr
                risk_per_unit = stop - entry

            if risk_per_unit <= 0:
                continue

            quantity = risk_per_trade / risk_per_unit
            state = {
                "entry": float(entry),
                "stop": float(stop),
                "target": float(target),
                "quantity": float(quantity),
            }
            entry_time = idx
            side = sig
            in_pos = True
            continue

        high = row["High"]
        low = row["Low"]
        close = row["Close"]
        exit_price = None
        reason = None

        if side == "LONG":
            hit_stop = low <= state["stop"]
            hit_target = high >= state["target"]
            if hit_stop and hit_target:
                exit_price = state["stop"]
                reason = "stop_and_target_same_candle"
            elif hit_stop:
                exit_price = state["stop"]
                reason = "stop_hit"
            elif hit_target:
                exit_price = state["target"]
                reason = "target_hit"
            elif signal(row) == "SHORT":
                exit_price = close
                reason = "signal_flip"
        else:
            hit_stop = high >= state["stop"]
            hit_target = low <= state["target"]
            if hit_stop and hit_target:
                exit_price = state["stop"]
                reason = "stop_and_target_same_candle"
            elif hit_stop:
                exit_price = state["stop"]
                reason = "stop_hit"
            elif hit_target:
                exit_price = state["target"]
                reason = "target_hit"
            elif signal(row) == "LONG":
                exit_price = close
                reason = "signal_flip"

        if exit_price is not None:
            if side == "LONG":
                pnl = (exit_price - state["entry"]) * state["quantity"]
                ret = (exit_price - state["entry"]) / state["entry"] * 100
            else:
                pnl = (state["entry"] - exit_price) * state["quantity"]
                ret = (state["entry"] - exit_price) / state["entry"] * 100

            trades.append(
                Trade(
                    pair=pair_label,
                    side=side,
                    entry_time=entry_time,
                    exit_time=idx,
                    entry_price=state["entry"],
                    exit_price=float(exit_price),
                    stop_price=state["stop"],
                    target_price=state["target"],
                    quantity=state["quantity"],
                    pnl_usd=float(pnl),
                    return_pct=float(ret),
                    result="PROFIT" if pnl > 0 else "LOSS",
                    reason=reason or "unknown",
                )
            )
            in_pos = False
            state = {}
            side = None
            entry_time = None

    return trades


def detect_latest_intent(df: pd.DataFrame, risk_per_trade: float = 1000.0) -> Optional[dict]:
    """Opening logic on the last bar (mirrors backtest_pair entry branch)."""
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
        stop = entry - 1.5 * atr
        target = entry + 3.0 * atr
        risk_per_unit = entry - stop
    else:
        stop = entry + 1.5 * atr
        target = entry - 3.0 * atr
        risk_per_unit = stop - entry
    if risk_per_unit <= 0:
        return None
    quantity = risk_per_trade / risk_per_unit
    return {
        "side": sig,
        "entry": float(entry),
        "stop": float(stop),
        "target": float(target),
        "quantity": float(quantity),
    }
