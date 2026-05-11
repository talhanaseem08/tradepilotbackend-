"""Backtesting harness for the OB strategy with ~6 months of 4H data and PDF report."""
from __future__ import annotations

import datetime as dt
from pathlib import Path
from typing import Dict, List

import pandas as pd
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle

from common.data.data_fetch import fetch_ohlcv
from medium_risk.config import (
    BACKTEST_CANDLE_LIMIT,
    BACKTEST_STATS_PDF,
    INITIAL_BALANCE,
    SYMBOLS,
    TIMEFRAME,
)
from medium_risk.strategy.strategy import TradeResult, run_backtest_for_symbol
from medium_risk.reporting.trade_logger import append_trades_to_excel


def backtest_all(
    initial_balance: float = INITIAL_BALANCE,
    symbols: list[str] | None = None,
    *,
    write_excel: bool = True,
) -> tuple[dict[str, float], list[TradeResult]]:
    """Backtest across symbols sequentially (shared wallet); optionally append trades to Excel."""
    symbols = symbols or SYMBOLS
    six_months_ago_ms = int((dt.datetime.utcnow() - dt.timedelta(days=180)).timestamp() * 1000)

    equity: Dict[str, float] = {}
    all_trades: List[TradeResult] = []
    wallet = initial_balance

    for symbol in symbols:
        df = fetch_ohlcv(symbol, timeframe=TIMEFRAME, limit=BACKTEST_CANDLE_LIMIT, since=six_months_ago_ms)
        final_wallet, trades = run_backtest_for_symbol(symbol, df.copy(), wallet, position_pct=0.10)
        wallet = final_wallet  # shared wallet across symbols
        equity[symbol] = final_wallet
        all_trades.extend(trades)

    if all_trades and write_excel:
        append_trades_to_excel(all_trades)
    return equity, all_trades


def summarize_trades(initial_balance: float, trades: list[TradeResult]) -> dict:
    total_trades = len(trades)
    tp_hits = sum(1 for t in trades if "TP" in (t.reason or "").upper())
    sl_hits = sum(1 for t in trades if "SL" in (t.reason or "").upper())
    wins = sum(1 for t in trades if t.pnl > 0)
    net_profit = sum(t.pnl for t in trades)
    final_balance = initial_balance + net_profit
    win_pct = (wins / total_trades * 100) if total_trades else 0.0
    profit_pct = (net_profit / initial_balance * 100) if initial_balance else 0.0
    return {
        "initial_balance": initial_balance,
        "total_trades": total_trades,
        "tp_hits": tp_hits,
        "sl_hits": sl_hits,
        "win_pct": win_pct,
        "profit_pct": profit_pct,
        "net_profit": net_profit,
        "final_balance": final_balance,
    }


def generate_pdf_report(
    trades: list[TradeResult],
    stats: dict,
    path: str | Path | None = None,
):
    path = Path(path or BACKTEST_STATS_PDF)
    path.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(str(path), pagesize=A4)
    styles = getSampleStyleSheet()
    story = []

    story.append(Paragraph("Medium Risk Bot - Backtest Stats", styles["Title"]))
    story.append(Spacer(1, 12))

    table_data = [
        ["Initial Balance", f"{stats['initial_balance']:.2f}"],
        ["Total Trades", stats["total_trades"]],
        ["TP Hits", stats["tp_hits"]],
        ["SL Hits", stats["sl_hits"]],
        ["Win %", f"{stats['win_pct']:.2f}%"],
        ["Profit %", f"{stats['profit_pct']:.2f}%"],
        ["Net Profit", f"{stats['net_profit']:.2f}"],
        ["Balance After 6 Month", f"{stats['final_balance']:.2f}"],
    ]
    tbl = Table(table_data, hAlign="LEFT")
    tbl.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.lightgrey),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.black),
            ]
        )
    )
    story.append(tbl)
    story.append(Spacer(1, 18))
    story.append(Paragraph("Trade Log", styles["Heading2"]))
    story.append(Spacer(1, 12))

    # Sort trades by entry time
    trades_sorted = sorted(trades, key=lambda t: t.entry_time)
    log_data = [
        [
            "Symbol",
            "Entry Time",
            "Exit Time",
            "Entry",
            "TP",
            "SL",
            "Pos Size",
            "Exit",
            "PnL",
            "PnL %",
        ]
    ]
    for t in trades_sorted:
        pnl_pct = (t.pnl / t.wallet_before * 100) if t.wallet_before else 0.0
        log_data.append(
            [
                t.symbol,
                t.entry_time.strftime("%Y-%m-%d %H:%M"),
                t.exit_time.strftime("%Y-%m-%d %H:%M"),
                f"{t.entry_price:.2f}",
                f"{(t.target_price or 0):.2f}" if t.target_price is not None else "NA",
                f"{t.stop_price:.2f}",
                f"{t.position_size:.6f}",
                f"{t.exit_price:.2f}",
                f"{t.pnl:.2f}",
                f"{pnl_pct:.2f}%",
            ]
        )

    log_table = Table(log_data, hAlign="LEFT")
    log_table.setStyle(
        TableStyle(
            [
                ("GRID", (0, 0), (-1, -1), 0.25, colors.grey),
                ("BACKGROUND", (0, 0), (-1, 0), colors.lightgrey),
            ]
        )
    )
    story.append(log_table)

    doc.build(story)


if __name__ == "__main__":
    equity, trades = backtest_all()
    stats = summarize_trades(INITIAL_BALANCE, trades)
    generate_pdf_report(trades, stats, path=BACKTEST_STATS_PDF)
    print(f"PDF report: {BACKTEST_STATS_PDF.resolve()}")

