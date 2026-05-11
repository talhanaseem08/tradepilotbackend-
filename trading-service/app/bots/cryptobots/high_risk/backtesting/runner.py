"""Historical backtest using Binance OHLCV (strategy math unchanged)."""
from __future__ import annotations

from pathlib import Path
from typing import Any, Dict

import pandas as pd

from common.config import HIGH_RISK_REPORT_PDF, PAIR_LABEL_TO_CCXT
from common.data.data_fetch import fetch_legacy_ohlc_range
from high_risk.reporting.pdf_report import (
    as_trade_frame,
    build_pdf_report,
    pair_summary,
    performance_windows,
)
from high_risk.strategy.strategy import Trade, backtest_pair, indicators


def download_data(start_date: str, end_date: str, interval: str) -> Dict[str, pd.DataFrame]:
    datasets: Dict[str, pd.DataFrame] = {}
    for pair_label, sym in PAIR_LABEL_TO_CCXT.items():
        raw = fetch_legacy_ohlc_range(sym, interval, start_date, end_date)
        datasets[pair_label] = indicators(raw[["Open", "High", "Low", "Close", "Volume"]])
    return datasets


def run_backtest(
    start_date: str,
    end_date: str,
    interval: str,
    output_pdf: str | None = None,
    *,
    write_pdf: bool = True,
) -> Dict[str, Any]:
    initial_wallet = 100000.0
    risk_per_trade = 1000.0
    all_trades: list[Trade] = []

    out_pdf = str(output_pdf or HIGH_RISK_REPORT_PDF)

    datasets = download_data(start_date, end_date, interval)
    for pair in ["BTC", "ETH", "BNB", "SOL"]:
        pair_trades = backtest_pair(pair, datasets[pair], risk_per_trade=risk_per_trade)
        all_trades.extend(pair_trades)

    if write_pdf:
        Path(out_pdf).parent.mkdir(parents=True, exist_ok=True)
        trade_df = as_trade_frame(all_trades)
        summary_df = pair_summary(trade_df if not trade_df.empty else pd.DataFrame(columns=["Pair", "PnL USD"]))
        window_perf_df = performance_windows(trade_df, end_date=end_date, initial_wallet=initial_wallet)

        if not trade_df.empty:
            csv_path = out_pdf.replace(".pdf", "_trades.csv")
            trade_df.to_csv(csv_path, index=False)
            print(f"Detailed trade log saved to: {csv_path}")

        build_pdf_report(
            output_path=out_pdf,
            trade_df=trade_df,
            summary_df=summary_df,
            window_perf_df=window_perf_df,
            start_date=start_date,
            end_date=end_date,
            initial_wallet=initial_wallet,
            risk_per_trade=risk_per_trade,
        )
        print(f"Backtesting PDF report generated: {out_pdf}")

    net = sum(t.pnl_usd for t in all_trades)
    wins = sum(1 for t in all_trades if t.pnl_usd > 0)
    gross_profit = sum(t.pnl_usd for t in all_trades if t.pnl_usd > 0)
    gross_loss = sum(t.pnl_usd for t in all_trades if t.pnl_usd < 0)
    return {
        "total_trades": len(all_trades),
        "winning_trades": wins,
        "losing_trades": len(all_trades) - wins,
        "win_rate": round((wins / len(all_trades) * 100), 2) if all_trades else 0.0,
        "total_pnl_usd": round(net, 4),
        "gross_profit_usd": round(gross_profit, 4),
        "gross_loss_usd": round(gross_loss, 4),
        "total_profit_pct": round((net / initial_wallet * 100), 4) if initial_wallet else 0.0,
        "report_pdf": str(Path(out_pdf).resolve()),
        "start_date": start_date,
        "end_date": end_date,
        "interval": interval,
        "trades": all_trades,
    }
