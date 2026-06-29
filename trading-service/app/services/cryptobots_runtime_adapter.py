"""
Runtime adapter for live crypto bot execution using `app/bots/cryptobots`.

This keeps the existing trading-service execution loop and broker plumbing, but
reuses the real crypto strategy code from the `cryptobots` package instead of
the lightweight wrapper bot classes.
"""
from __future__ import annotations

import sys
from pathlib import Path
from typing import Any

import pandas as pd

from app.config.settings import settings
from app.schemas.trade import TradeSignal

CRYPTOBOT_TYPES = {"crypto_low", "crypto_medium", "crypto_high"}
CRYPTO_HIGH_POSITION_PCT = 10.0
_OLD_CRYPTO_HIGH_POSITION_PCT = 2.0
CRYPTOBOT_CANDLE_COUNT = 500


def _cryptobots_root() -> Path:
    return Path(__file__).resolve().parent.parent / "bots" / "cryptobots"


def _ensure_cryptobots_path() -> None:
    root = str(_cryptobots_root())
    if root not in sys.path:
        sys.path.insert(0, root)


def is_cryptobot_type(bot_type: str) -> bool:
    return bot_type in CRYPTOBOT_TYPES


def required_cryptobot_candle_count(bot_type: str) -> int:
    if bot_type in CRYPTOBOT_TYPES:
        return CRYPTOBOT_CANDLE_COUNT
    return 100


def supported_cryptobot_symbols(bot_type: str) -> list[str]:
    _ensure_cryptobots_path()
    if bot_type == "crypto_low":
        from common.config import YAHOO_PAIR_TO_CCXT
        from low_risk.config import PAIRS

        return [str(YAHOO_PAIR_TO_CCXT[pair]).replace("/", "") for pair in PAIRS]

    if bot_type == "crypto_medium":
        from medium_risk.config import SYMBOLS

        return [str(symbol).replace("/", "") for symbol in SYMBOLS]

    if bot_type == "crypto_high":
        from common.config import PAIR_LABEL_TO_CCXT

        return [str(symbol).replace("/", "") for symbol in PAIR_LABEL_TO_CCXT.values()]

    return []


def _to_runtime_frame(candles: list[dict[str, Any]]) -> pd.DataFrame:
    rows: list[dict[str, Any]] = []
    for candle in candles:
        ts = candle.get("timestamp")
        dt = pd.to_datetime(ts, utc=True) if ts else None
        rows.append(
            {
                "datetime": dt,
                "open": float(candle.get("open", 0) or 0),
                "high": float(candle.get("high", 0) or 0),
                "low": float(candle.get("low", 0) or 0),
                "close": float(candle.get("close", 0) or 0),
                "volume": float(candle.get("volume", 0) or 0),
            }
        )
    return pd.DataFrame(rows)


def _to_legacy_frame(candles: list[dict[str, Any]]) -> pd.DataFrame:
    frame = _to_runtime_frame(candles)
    frame = frame.rename(
        columns={
            "open": "Open",
            "high": "High",
            "low": "Low",
            "close": "Close",
            "volume": "Volume",
        }
    )
    if "datetime" in frame.columns:
        frame = frame.set_index("datetime")
    return frame


def _to_trade_signal(symbol: str, side: str, entry: float, stop: float, take_profit: float, quantity: float) -> TradeSignal:
    action = "buy" if side.upper() == "LONG" else "sell"
    return TradeSignal(
        action=action,
        symbol=symbol,
        price=float(entry),
        stop_loss=float(stop),
        take_profit=float(take_profit),
        quantity=float(quantity),
    )


def _build_low_signal(symbol: str, parameters: dict[str, Any], candles: list[dict[str, Any]]) -> TradeSignal | None:
    _ensure_cryptobots_path()
    from low_risk.strategy.strategy import detect_latest_intent

    frame = _to_legacy_frame(candles)
    intent = detect_latest_intent(
        frame,
        bool(parameters.get("long_only", True)),
        float(parameters.get("rsi_low", 48)),
        float(parameters.get("rsi_high", 68)),
        float(parameters.get("stop_atr_mult", 2.0)),
        float(parameters.get("tp_atr_mult", 5.0)),
    )
    if not intent:
        return None
    return _to_trade_signal(
        symbol=symbol,
        side=str(intent["side"]),
        entry=float(intent["entry"]),
        stop=float(intent["stop"]),
        take_profit=float(intent["take_profit"]),
        quantity=float(intent["units"]),
    )


def _build_medium_signal(symbol: str, parameters: dict[str, Any], candles: list[dict[str, Any]]) -> TradeSignal | None:
    frame = _to_legacy_frame(candles)
    if len(frame) < 50:
        return None

    initial_balance = float(parameters.get("initial_balance", 100_000.0))
    position_pct = float(parameters.get("position_pct", 0.10))
    max_ob_pct = float(parameters.get("max_ob_pct", 4.0))
    pivot_len = int(parameters.get("pivot_len", 5))

    df = frame.reset_index().rename(
        columns={
            "datetime": "datetime",
            "Open": "open",
            "High": "high",
            "Low": "low",
            "Close": "close",
        }
    )

    if "datetime" not in df.columns:
        return None

    def compute_pivot_high(high_series: pd.Series, left: int, right: int) -> pd.Series:
        pivots: list[float] = []
        length = len(high_series)
        for i in range(length):
            if i < left or i + right >= length:
                pivots.append(float("nan"))
                continue
            window = high_series.iloc[i - left : i + right + 1]
            pivots.append(high_series.iloc[i] if high_series.iloc[i] == window.max() else float("nan"))
        return pd.Series(pivots, index=high_series.index)

    wallet = initial_balance
    ob_high: float | None = None
    ob_low: float | None = None
    ob_used = False
    pivot_high = compute_pivot_high(df["high"], pivot_len, pivot_len)

    position_open = False
    entry_price = 0.0
    position_size = 0.0
    stop_price = 0.0
    entry_time = None
    target_price: float | None = None
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
            ob_high = float(df["high"].iloc[i - 3])
            ob_low = float(df["low"].iloc[i - 3])
            ob_used = False

        if not position_open and not ob_used and ob_high is not None and ob_low is not None:
            long_touch = float(row["low"]) <= ob_high and float(row["high"]) >= ob_low
            if long_touch:
                position_size = (wallet * position_pct) / float(row["close"])
                entry_price = float(row["close"])
                stop_price = ob_low
                position_open = True
                entry_time = row["datetime"]
                ob_used = True
                target_price = None

        if position_open:
            if not pd.isna(pivot_high.iloc[i]) and float(pivot_high.iloc[i]) > entry_price:
                target_price = float(pivot_high.iloc[i])
                if float(row["high"]) >= target_price:
                    exit_price = target_price
                    pnl = (exit_price - entry_price) * position_size
                    wallet += pnl
                    position_open = False
                    continue

            if float(row["close"]) < stop_price:
                exit_price = stop_price
                pnl = (exit_price - entry_price) * position_size
                wallet += pnl
                position_open = False
                continue

    if not position_open or entry_time is None:
        return None

    last_dt = df.iloc[last_i]["datetime"]
    if entry_time != last_dt:
        return None

    risk = entry_price - stop_price if stop_price else 0.0
    take_profit = float(target_price) if target_price is not None and target_price > entry_price else float(entry_price + 2 * risk) if risk > 0 else entry_price

    return TradeSignal(
        action="buy",
        symbol=symbol,
        price=float(entry_price),
        stop_loss=float(stop_price),
        take_profit=float(take_profit),
        quantity=float(position_size),
    )


def _build_high_signal(symbol: str, parameters: dict[str, Any], candles: list[dict[str, Any]]) -> TradeSignal | None:
    _ensure_cryptobots_path()
    from high_risk.strategy.strategy import indicators, signal

    frame = _to_legacy_frame(candles)
    if len(frame) < 40:
        return None

    data = indicators(frame)
    if len(data) < 2:
        return None

    prev_row = data.iloc[-2]
    row = data.iloc[-1]
    side = signal(prev_row)
    if side is None:
        return None

    entry = float(row["Open"])
    atr = float(prev_row["atr"])
    if atr <= 0:
        return None

    if side == "LONG":
        stop = entry - 1.5 * atr
        target = entry + 3.0 * atr
    else:
        stop = entry + 1.5 * atr
        target = entry - 3.0 * atr

    position_pct = float(
        parameters.get("position_pct_of_available_balance")
        or parameters.get("position_pct_of_balance")
        or parameters.get("risk_per_trade_pct", CRYPTO_HIGH_POSITION_PCT)
    )
    if position_pct == _OLD_CRYPTO_HIGH_POSITION_PCT:
        position_pct = CRYPTO_HIGH_POSITION_PCT
    quote = float(parameters.get("quote_balance_usdt") or 0.0)
    equity = float(parameters.get("account_equity_usd") or 0.0)
    available = quote if quote > 0 else equity
    if available <= 0 or entry <= 0:
        return None

    capital_usd = available * (position_pct / 100.0)
    units = capital_usd / entry

    max_quote = quote if quote > 0 else equity
    if side == "LONG" and max_quote > 0:
        max_units = (max_quote * 0.995) / entry
        if units > max_units:
            units = max_units

    min_notional = float(getattr(settings, "crypto_min_notional_usdt", 6.0))
    if units <= 0 or units * entry < min_notional:
        return None

    action = "buy" if side == "LONG" else "sell"
    return TradeSignal(
        action=action,
        symbol=symbol,
        price=entry,
        stop_loss=float(stop),
        take_profit=float(target),
        quantity=float(units),
    )


def build_cryptobot_trade_signal(
    *,
    bot_type: str,
    symbol: str,
    parameters: dict[str, Any],
    candles: list[dict[str, Any]],
) -> TradeSignal | None:
    if bot_type == "crypto_low":
        return _build_low_signal(symbol, parameters, candles)
    if bot_type == "crypto_medium":
        return _build_medium_signal(symbol, parameters, candles)
    if bot_type == "crypto_high":
        return _build_high_signal(symbol, parameters, candles)
    raise ValueError(f"Unsupported cryptobot type: {bot_type}")
