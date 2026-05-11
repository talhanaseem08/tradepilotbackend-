"""Low-risk strategy logic only (unchanged formulas)."""
from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from typing import Dict, List, Optional, Tuple

import numpy as np
import pandas as pd

from low_risk.config import (
    LONG_ONLY_OPTIONS,
    RSI_ENTRY_HIGH_OPTIONS,
    RSI_ENTRY_LOW_OPTIONS,
    RISK_PER_TRADE,
    STOP_ATR_MULT,
    STOP_ATR_OPTIONS,
    TP_ATR_MULT,
    TP_ATR_OPTIONS,
)


@dataclass
class Trade:
    pair: str
    side: str
    entry_datetime: datetime
    exit_datetime: datetime
    entry_price: float
    exit_price: float
    units: float
    pnl: float
    return_pct: float
    wallet_after: float


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


def backtest_pair(
    df: pd.DataFrame,
    pair: str,
    wallet: float,
    long_only: bool,
    rsi_low: float,
    rsi_high: float,
    stop_atr_mult: float,
    tp_atr_mult: float,
) -> Tuple[List[Trade], float]:
    trades: List[Trade] = []
    position: Optional[Dict] = None

    for i in range(1, len(df)):
        row = df.iloc[i]
        prev = df.iloc[i - 1]
        current_date = df.index[i].to_pydatetime()

        if position is not None:
            stop_hit = False
            tp_hit = False

            if position["side"] == "LONG":
                if row["Low"] <= position["stop"]:
                    exit_price = position["stop"]
                    stop_hit = True
                elif row["High"] >= position["take_profit"]:
                    exit_price = position["take_profit"]
                    tp_hit = True
                else:
                    exit_price = None
            else:
                if row["High"] >= position["stop"]:
                    exit_price = position["stop"]
                    stop_hit = True
                elif row["Low"] <= position["take_profit"]:
                    exit_price = position["take_profit"]
                    tp_hit = True
                else:
                    exit_price = None

            if stop_hit or tp_hit:
                if position["side"] == "LONG":
                    pnl = (exit_price - position["entry"]) * position["units"]
                    ret_pct = ((exit_price / position["entry"]) - 1) * 100
                else:
                    pnl = (position["entry"] - exit_price) * position["units"]
                    ret_pct = ((position["entry"] / exit_price) - 1) * 100

                wallet += pnl
                trades.append(
                    Trade(
                        pair=pair,
                        side=position["side"],
                        entry_datetime=position["entry_dt"],
                        exit_datetime=current_date,
                        entry_price=position["entry"],
                        exit_price=exit_price,
                        units=position["units"],
                        pnl=pnl,
                        return_pct=ret_pct,
                        wallet_after=wallet,
                    )
                )
                position = None
            continue

        signal = generate_signals(prev, long_only, rsi_low, rsi_high)
        if signal == 0:
            continue

        atr = row["ATR"]
        if pd.isna(atr) or atr <= 0:
            continue

        entry = row["Open"]
        stop_distance = stop_atr_mult * atr
        if stop_distance <= 0:
            continue

        units = RISK_PER_TRADE / stop_distance
        if units <= 0:
            continue

        if signal == 1:
            stop_price = entry - stop_distance
            take_profit = entry + ((tp_atr_mult / stop_atr_mult) * stop_distance)
            side = "LONG"
        else:
            stop_price = entry + stop_distance
            take_profit = entry - ((tp_atr_mult / stop_atr_mult) * stop_distance)
            side = "SHORT"

        position = {
            "side": side,
            "entry": entry,
            "entry_dt": current_date,
            "stop": stop_price,
            "take_profit": take_profit,
            "units": units,
        }

    if position is not None:
        last_row = df.iloc[-1]
        exit_price = float(last_row["Close"])
        current_date = df.index[-1].to_pydatetime()
        if position["side"] == "LONG":
            pnl = (exit_price - position["entry"]) * position["units"]
            ret_pct = ((exit_price / position["entry"]) - 1) * 100
        else:
            pnl = (position["entry"] - exit_price) * position["units"]
            ret_pct = ((position["entry"] / exit_price) - 1) * 100
        wallet += pnl
        trades.append(
            Trade(
                pair=pair,
                side=position["side"],
                entry_datetime=position["entry_dt"],
                exit_datetime=current_date,
                entry_price=position["entry"],
                exit_price=exit_price,
                units=position["units"],
                pnl=pnl,
                return_pct=ret_pct,
                wallet_after=wallet,
            )
        )
    return trades, wallet


def optimize_pair_params(df: pd.DataFrame, pair: str, wallet: float) -> Dict:
    best = {
        "long_only": True,
        "rsi_low": 48,
        "rsi_high": 68,
        "stop_atr_mult": STOP_ATR_MULT,
        "tp_atr_mult": TP_ATR_MULT,
        "profit": -float("inf"),
    }

    for long_only in LONG_ONLY_OPTIONS:
        for rsi_low in RSI_ENTRY_LOW_OPTIONS:
            for rsi_high in RSI_ENTRY_HIGH_OPTIONS:
                if rsi_low >= rsi_high:
                    continue
                for stop_mult in STOP_ATR_OPTIONS:
                    for tp_mult in TP_ATR_OPTIONS:
                        if tp_mult <= stop_mult:
                            continue
                        _, test_wallet = backtest_pair(
                            df=df,
                            pair=pair,
                            wallet=wallet,
                            long_only=long_only,
                            rsi_low=rsi_low,
                            rsi_high=rsi_high,
                            stop_atr_mult=stop_mult,
                            tp_atr_mult=tp_mult,
                        )
                        profit = test_wallet - wallet
                        if profit > best["profit"]:
                            best = {
                                "long_only": long_only,
                                "rsi_low": rsi_low,
                                "rsi_high": rsi_high,
                                "stop_atr_mult": stop_mult,
                                "tp_atr_mult": tp_mult,
                                "profit": profit,
                            }
    return best


def detect_latest_intent(
    df: pd.DataFrame,
    long_only: bool,
    rsi_low: float,
    rsi_high: float,
    stop_atr_mult: float,
    tp_atr_mult: float,
) -> Optional[dict]:
    """
    Evaluate latest bar for a new entry (mirrors backtest_pair signal path).
    Returns dict with side, entry, stop, take_profit, units or None.
    """
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
    units = RISK_PER_TRADE / stop_distance
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
