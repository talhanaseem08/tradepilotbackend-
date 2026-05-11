"""Full backtest using Binance OHLCV (same strategy code paths as yfinance version)."""
from __future__ import annotations

from pathlib import Path
from typing import Any, Dict, List

import pandas as pd

from common.config import YAHOO_PAIR_TO_CCXT
from common.data.data_fetch import fetch_legacy_ohlc_range

from low_risk.config import (
    END_DATE,
    INITIAL_WALLET,
    OUTPUT_PDF,
    PAIRS,
    START_DATE,
)
from low_risk.reporting.pdf import generate_pdf
from low_risk.strategy.strategy import Trade, backtest_pair, calculate_indicators, optimize_pair_params


def download_data(pair: str, start: str, end: str) -> pd.DataFrame:
    sym = YAHOO_PAIR_TO_CCXT[pair]
    return fetch_legacy_ohlc_range(sym, "1d", start, end)


def run_full_backtest(
    output_pdf: str | Path | None = None,
    *,
    write_pdf: bool = True,
) -> Dict[str, Any]:
    pdf_out = Path(output_pdf) if output_pdf else OUTPUT_PDF
    wallet = INITIAL_WALLET
    all_trades: List[Trade] = []
    pair_profits: Dict[str, float] = {pair: 0.0 for pair in PAIRS}

    for pair in PAIRS:
        print(f"Backtesting {pair}...")
        raw = download_data(pair, START_DATE, END_DATE)
        data = calculate_indicators(raw)
        best = optimize_pair_params(data, pair, wallet)
        print(
            f"{pair} best params -> long_only={best['long_only']}, "
            f"rsi=({best['rsi_low']},{best['rsi_high']}), "
            f"stop_atr={best['stop_atr_mult']}, tp_atr={best['tp_atr_mult']}"
        )
        start_wallet = wallet
        trades, wallet = backtest_pair(
            df=data,
            pair=pair,
            wallet=wallet,
            long_only=best["long_only"],
            rsi_low=best["rsi_low"],
            rsi_high=best["rsi_high"],
            stop_atr_mult=best["stop_atr_mult"],
            tp_atr_mult=best["tp_atr_mult"],
        )
        pair_profits[pair] = wallet - start_wallet
        all_trades.extend(trades)
        print(
            f"{pair}: trades={len(trades)}, pair_profit=${pair_profits[pair]:,.2f}, wallet=${wallet:,.2f}"
        )

    all_trades.sort(key=lambda x: x.entry_datetime)
    if write_pdf:
        generate_pdf(
            trades=all_trades,
            pair_profits=pair_profits,
            start_date=START_DATE,
            end_date=END_DATE,
            initial_wallet=INITIAL_WALLET,
            final_wallet=wallet,
            output_file=pdf_out,
        )
        print("\nBacktest completed.")
        print(f"Final wallet: ${wallet:,.2f}")
        print(f"Report generated: {pdf_out.resolve()}")
    else:
        print("\nBacktest completed (PDF skipped).")
        print(f"Final wallet: ${wallet:,.2f}")

    net = wallet - INITIAL_WALLET
    wins = sum(1 for t in all_trades if t.pnl > 0)
    gross_profit = sum(t.pnl for t in all_trades if t.pnl > 0)
    gross_loss = sum(t.pnl for t in all_trades if t.pnl < 0)
    return {
        "total_trades": len(all_trades),
        "winning_trades": wins,
        "losing_trades": len(all_trades) - wins,
        "win_rate": round((wins / len(all_trades) * 100), 2) if all_trades else 0.0,
        "total_pnl_usd": round(net, 4),
        "gross_profit_usd": round(gross_profit, 4),
        "gross_loss_usd": round(gross_loss, 4),
        "total_profit_pct": round((net / INITIAL_WALLET * 100), 4) if INITIAL_WALLET else 0.0,
        "report_pdf": str(pdf_out.resolve()),
        "start_date": START_DATE,
        "end_date": END_DATE,
        "trades": all_trades,
    }
