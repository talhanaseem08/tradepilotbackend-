"""
Run backtests from `app/bots/cryptobots/{low,medium,high}_risk` (same code as local CLI).

Adds `app/bots/cryptobots` to sys.path so `common`, `low_risk`, etc. resolve.

API/script-run path: no PDF (and no medium Excel append); returns per-trade rows for the UI.
"""
from __future__ import annotations

import asyncio
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any, List

from app.schemas.backtest import BacktestResult, TradeRecord
from app.utils.logger import get_logger

logger = get_logger()


def _cryptobots_root() -> Path:
    return Path(__file__).resolve().parent.parent / "bots" / "cryptobots"


def _ensure_cryptobots_path() -> Path:
    root = _cryptobots_root()
    s = str(root)
    if s not in sys.path:
        sys.path.insert(0, s)
    return root


def _iso_any(t: Any) -> str:
    if t is None:
        return ""
    if isinstance(t, datetime):
        return t.isoformat()
    if hasattr(t, "isoformat"):
        try:
            return t.isoformat()  # pandas.Timestamp
        except Exception:
            pass
    return str(t)


def _low_trades_to_records(trades: List[Any]) -> List[TradeRecord]:
    out: List[TradeRecord] = []
    for i, t in enumerate(trades, start=1):
        side_raw = (getattr(t, "side", "") or "").upper()
        side = "buy" if side_raw == "LONG" else "sell"
        pnl = float(getattr(t, "pnl", 0.0))
        pnl_pct = float(getattr(t, "return_pct", 0.0))
        out.append(
            TradeRecord(
                trade_no=i,
                side=side,
                entry_time=_iso_any(getattr(t, "entry_datetime", None)),
                exit_time=_iso_any(getattr(t, "exit_datetime", None)),
                entry_price=float(getattr(t, "entry_price", 0.0)),
                exit_price=float(getattr(t, "exit_price", 0.0)),
                stop_loss=0.0,
                take_profit=0.0,
                pnl_pct=pnl_pct,
                pnl_usd=pnl,
                result="WIN" if pnl > 0 else ("LOSS" if pnl < 0 else "FLAT"),
            )
        )
    return out


def _medium_trades_to_records(trades: List[Any]) -> List[TradeRecord]:
    out: List[TradeRecord] = []
    for i, t in enumerate(trades, start=1):
        wb = float(getattr(t, "wallet_before", 0.0) or 0.0)
        pnl = float(getattr(t, "pnl", 0.0))
        pnl_pct = (pnl / wb * 100.0) if wb else 0.0
        tp = getattr(t, "target_price", None)
        out.append(
            TradeRecord(
                trade_no=i,
                side="buy",
                entry_time=_iso_any(getattr(t, "entry_time", None)),
                exit_time=_iso_any(getattr(t, "exit_time", None)),
                entry_price=float(getattr(t, "entry_price", 0.0)),
                exit_price=float(getattr(t, "exit_price", 0.0)),
                stop_loss=float(getattr(t, "stop_price", 0.0)),
                take_profit=float(tp if tp is not None else 0.0),
                pnl_pct=round(pnl_pct, 4),
                pnl_usd=pnl,
                result="WIN" if pnl > 0 else ("LOSS" if pnl < 0 else "FLAT"),
            )
        )
    return out


def _high_trades_to_records(trades: List[Any]) -> List[TradeRecord]:
    out: List[TradeRecord] = []
    for i, t in enumerate(trades, start=1):
        side_raw = (getattr(t, "side", "") or "").upper()
        side = "buy" if side_raw == "LONG" else "sell"
        pnl = float(getattr(t, "pnl_usd", 0.0))
        pnl_pct = float(getattr(t, "return_pct", 0.0))
        raw_res = (getattr(t, "result", None) or "").strip().upper()
        if raw_res in ("PROFIT", "WIN") or pnl > 0:
            res = "WIN"
        elif raw_res == "LOSS" or pnl < 0:
            res = "LOSS"
        else:
            res = "FLAT"
        out.append(
            TradeRecord(
                trade_no=i,
                side=side,
                entry_time=_iso_any(getattr(t, "entry_time", None)),
                exit_time=_iso_any(getattr(t, "exit_time", None)),
                entry_price=float(getattr(t, "entry_price", 0.0)),
                exit_price=float(getattr(t, "exit_price", 0.0)),
                stop_loss=float(getattr(t, "stop_price", 0.0)),
                take_profit=float(getattr(t, "target_price", 0.0)),
                pnl_pct=pnl_pct,
                pnl_usd=pnl,
                result=res,
            )
        )
    return out


def _stats_to_result(
    *,
    total_trades: int,
    winning_trades: int,
    gross_profit_usd: float,
    gross_loss_usd: float,
    total_pnl_usd: float,
    initial_notional: float,
    total_profit_pct: float | None = None,
    trades: List[TradeRecord] | None = None,
) -> BacktestResult:
    losing_trades = max(0, total_trades - winning_trades)
    win_rate = round((winning_trades / total_trades * 100), 2) if total_trades else 0.0
    profit_pct = total_profit_pct
    if profit_pct is None and initial_notional:
        profit_pct = round((total_pnl_usd / initial_notional) * 100, 4)
    elif profit_pct is None:
        profit_pct = 0.0

    gp = max(0.0, gross_profit_usd)
    gl_neg = min(0.0, gross_loss_usd)
    abs_loss = abs(gl_neg)
    profit_factor = round(gp / abs_loss, 4) if abs_loss > 0 else (999.0 if gp > 0 else 0.0)

    row_trades = trades or []

    return BacktestResult(
        total_trades=total_trades,
        winning_trades=winning_trades,
        losing_trades=losing_trades,
        win_rate=win_rate,
        total_profit_pct=profit_pct,
        total_pnl_usd=round(total_pnl_usd, 4),
        gross_profit_usd=round(gp, 4),
        gross_loss_usd=round(gl_neg, 4),
        max_drawdown_pct=0.0,
        max_drawdown_usd=0.0,
        sharpe_ratio=0.0,
        profit_factor=profit_factor,
        profit_factor_usd=profit_factor,
        trades=row_trades,
    )


def _run_crypto_low_sync() -> BacktestResult:
    from low_risk.backtesting.runner import run_full_backtest
    from low_risk.config import INITIAL_WALLET

    stats = run_full_backtest(write_pdf=False)
    raw = stats.get("trades") or []
    trade_rows = _low_trades_to_records(list(raw))

    return _stats_to_result(
        total_trades=int(stats["total_trades"]),
        winning_trades=int(stats["winning_trades"]),
        gross_profit_usd=float(stats["gross_profit_usd"]),
        gross_loss_usd=float(stats["gross_loss_usd"]),
        total_pnl_usd=float(stats["total_pnl_usd"]),
        initial_notional=float(INITIAL_WALLET),
        total_profit_pct=float(stats.get("total_profit_pct", 0.0)),
        trades=trade_rows,
    )


def _run_crypto_medium_sync() -> BacktestResult:
    from medium_risk.backtesting.backtest import backtest_all, summarize_trades
    from medium_risk.config import INITIAL_BALANCE

    equity, trades = backtest_all(write_excel=False)
    stats = summarize_trades(INITIAL_BALANCE, trades)

    wins = sum(1 for t in trades if t.pnl > 0)
    gross_profit = sum(t.pnl for t in trades if t.pnl > 0)
    gross_loss = sum(t.pnl for t in trades if t.pnl < 0)
    trade_rows = _medium_trades_to_records(list(trades))

    return _stats_to_result(
        total_trades=int(stats["total_trades"]),
        winning_trades=wins,
        gross_profit_usd=float(gross_profit),
        gross_loss_usd=float(gross_loss),
        total_pnl_usd=float(stats["net_profit"]),
        initial_notional=float(stats["initial_balance"]),
        total_profit_pct=float(stats["profit_pct"]),
        trades=trade_rows,
    )


def _run_crypto_high_sync(days: int) -> BacktestResult:
    from high_risk.backtesting.runner import run_backtest

    end = datetime.now(timezone.utc).date()
    start = end - timedelta(days=days)
    stats = run_backtest(
        start_date=start.isoformat(),
        end_date=end.isoformat(),
        interval="1h",
        output_pdf=None,
        write_pdf=False,
    )
    initial_wallet = 100_000.0
    raw = stats.get("trades") or []
    trade_rows = _high_trades_to_records(list(raw))

    return _stats_to_result(
        total_trades=int(stats["total_trades"]),
        winning_trades=int(stats["winning_trades"]),
        gross_profit_usd=float(stats["gross_profit_usd"]),
        gross_loss_usd=float(stats["gross_loss_usd"]),
        total_pnl_usd=float(stats["total_pnl_usd"]),
        initial_notional=initial_wallet,
        total_profit_pct=float(stats.get("total_profit_pct", 0.0)),
        trades=trade_rows,
    )


async def run_cryptobots_script_backtest(bot_type: str, *, days: int) -> BacktestResult:
    """
    Dispatch to `cryptobots` package backtest runners.

    - crypto_low: `low_risk.backtesting.runner.run_full_backtest` (dates from low_risk.config).
    - crypto_medium: `medium_risk.backtesting.backtest.backtest_all` (~6 months of 4H data).
    - crypto_high: `high_risk.backtesting.runner.run_backtest` over `days` (1h candles).

    Does not write PDF/Excel (server API path); returns trades for the dashboard.
    """
    _ensure_cryptobots_path()

    if bot_type == "crypto_low":
        return await asyncio.to_thread(_run_crypto_low_sync)
    if bot_type == "crypto_medium":
        return await asyncio.to_thread(_run_crypto_medium_sync)
    if bot_type == "crypto_high":
        return await asyncio.to_thread(_run_crypto_high_sync, days)

    raise ValueError(f"Unknown cryptobots bot_type: {bot_type}")
