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

from app.schemas.trade import TradeSignal

CRYPTOBOT_TYPES = {"crypto_low", "crypto_medium", "crypto_high"}
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
    _ensure_cryptobots_path()
    from medium_risk.cli.main import detect_latest_entry

    frame = _to_runtime_frame(candles)
    fixed_risk = float(parameters.get("fixed_risk", 1000.0))
    signal = detect_latest_entry(frame, fixed_risk=fixed_risk)
    if not signal:
        return None
    entry_price, stop_price, position_size = signal
    return TradeSignal(
        action="buy",
        symbol=symbol,
        price=float(entry_price),
        stop_loss=float(stop_price),
        take_profit=0.0,
        quantity=float(position_size),
    )


def _build_high_signal(symbol: str, parameters: dict[str, Any], candles: list[dict[str, Any]]) -> TradeSignal | None:
    _ensure_cryptobots_path()
    from high_risk.strategy.strategy import detect_latest_intent

    frame = _to_legacy_frame(candles)
    intent = detect_latest_intent(
        frame,
        risk_per_trade=float(parameters.get("risk_per_trade_usd", 1000.0)),
    )
    if not intent:
        return None
    return _to_trade_signal(
        symbol=symbol,
        side=str(intent["side"]),
        entry=float(intent["entry"]),
        stop=float(intent["stop"]),
        take_profit=float(intent["target"]),
        quantity=float(intent["quantity"]),
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
