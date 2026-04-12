"""
Run 30-day (default) backtests for low_risk, medium_risk, high_risk.

Includes **high_risk on USDCHF** and **high_risk on UK100** (both allowed by
`HighRiskOrbBot`). USDCHF high uses the same M1 candles as low_risk; with the
same balance/risk params the ORB signals match low_risk on that series.

Usage:
  python scripts/run_three_risk_backtests.py
  python scripts/run_three_risk_backtests.py --days 14
"""
from __future__ import annotations

import argparse
import asyncio
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.adapters.oanda_provider import OandaProvider
from app.config.backtest_defaults import BACKTEST_NOTIONAL_USD, BACKTEST_RISK_PCT
from app.config.settings import settings
from app.schemas.backtest import BacktestRequest
from app.services.backtesting import run_backtest


def print_trade_block(title: str, symbol: str, tf: str, d: dict, days: int, risk: float) -> None:
    print()
    print("=" * 72)
    print(title)
    print("=" * 72)
    print(f"  Instrument: {symbol}  |  Timeframe: {tf}  |  Last {days} calendar days")
    print(
        f"  Sizing: ${BACKTEST_NOTIONAL_USD:,.0f} balance, {BACKTEST_RISK_PCT}% risk "
        f"= ${risk:,.0f}/trade at stop"
    )
    t = d["total_trades"]
    if t == 0:
        print("  No trades in window.")
        print("=" * 72)
        return
    w, losses = d["winning_trades"], d["losing_trades"]
    net_r = d["total_pnl_usd"] / risk if risk else 0.0
    print(
        f"  Total trades: {t}  |  Wins: {w}  |  Losses: {losses}  |  Win rate: {d['win_rate']}%"
    )
    print(
        f"  Total P&L %: {d['total_profit_pct']}%  |  Max DD %: {d['max_drawdown_pct']}%  "
        f"|  PF: {d['profit_factor']}"
    )
    print(f"  Total P&L USD: ${d['total_pnl_usd']:,.2f}  |  Net R: {net_r:+.2f}R")
    print(
        f"  Gross profit USD: ${d['gross_profit_usd']:,.2f}  |  "
        f"Gross loss: -${d['gross_loss_usd']:,.2f}"
    )
    print(
        f"  Max DD USD: -${d['max_drawdown_usd']:,.2f}  |  PF USD: {d['profit_factor_usd']}"
    )
    if w:
        print(f"  Avg win USD: ${d['gross_profit_usd'] / w:,.2f}")
    if losses:
        print(f"  Avg loss USD: -${d['gross_loss_usd'] / losses:,.2f}")
    print()
    hdr = (
        f"  {'#':>4} {'SIDE':<5} {'EX':<3} {'RES':<5} {'R':>6} {'PNL%':>8} {'PNL_USD':>11} "
        f"{'ENTRY':>9} {'EXIT':>9}  {'ENTRY_TIME_UTC+5':<24} {'EXIT_TIME_UTC+5':<24}"
    )
    print(hdr)
    print("  " + "-" * 130)
    for tr in d.get("trades", []):
        ex = "SL" if abs(tr["exit_price"] - tr["stop_loss"]) < 1e-4 else "TP"
        r_mult = tr["pnl_usd"] / risk if risk else 0.0
        print(
            f"  {tr['trade_no']:>4} {tr['side']:<5} {ex:<3} {tr['result']:<5} {r_mult:>+6.2f} "
            f"{tr['pnl_pct']:>+8.4f} ${tr['pnl_usd']:>10,.2f} {tr['entry_price']:>9.5f} "
            f"{tr['exit_price']:>9.5f}  {tr['entry_time']:<24} {tr['exit_time']:<24}"
        )
    print("=" * 72)


async def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--days", type=int, default=30, help="Calendar days of history")
    args = parser.parse_args()

    if not (settings.oanda_api_key or "").strip():
        print("OANDA_API_KEY is not set in .env", file=sys.stderr)
        sys.exit(1)

    days = args.days
    end = datetime.now(timezone.utc).date()
    start = end - timedelta(days=days)
    risk_usd = BACKTEST_NOTIONAL_USD * (BACKTEST_RISK_PCT / 100.0)
    params = {
        "account_balance": BACKTEST_NOTIONAL_USD,
        "risk_per_trade_pct": BACKTEST_RISK_PCT,
    }

    provider = OandaProvider()

    c_low = await provider.fetch_candles_range("USDCHF", "1m", start.isoformat(), end.isoformat())
    r_low = await run_backtest(
        BacktestRequest(
            bot_type="low_risk",
            symbol="USDCHF",
            market="forex",
            timeframe="1m",
            parameters=params,
            candles=c_low,
        )
    )
    print_trade_block(
        "LOW RISK — ORB (LowRiskOrbBot)",
        "USDCHF",
        "M1",
        r_low.model_dump(),
        days,
        risk_usd,
    )

    c_med = await provider.fetch_candles_range("EURUSD", "5m", start.isoformat(), end.isoformat())
    r_med = await run_backtest(
        BacktestRequest(
            bot_type="medium_risk",
            symbol="EURUSD",
            market="forex",
            timeframe="5m",
            parameters=params,
            candles=c_med,
        )
    )
    print_trade_block(
        "MEDIUM RISK — BOS Retest (MediumRiskBosBot)",
        "EURUSD",
        "M5",
        r_med.model_dump(),
        days,
        risk_usd,
    )

    # High risk USDCHF: same M1 data as low_risk; same ORB + same $100k/1% → same trades as low
    r_high_chf = await run_backtest(
        BacktestRequest(
            bot_type="high_risk",
            symbol="USDCHF",
            market="forex",
            timeframe="1m",
            parameters=params,
            candles=c_low,
        )
    )
    print_trade_block(
        "HIGH RISK — ORB (HighRiskOrbBot) — USDCHF",
        "USDCHF",
        "M1",
        r_high_chf.model_dump(),
        days,
        risk_usd,
    )

    c_high_uk = await provider.fetch_candles_range("UK100", "1m", start.isoformat(), end.isoformat())
    r_high_uk = await run_backtest(
        BacktestRequest(
            bot_type="high_risk",
            symbol="UK100",
            market="indices",
            timeframe="1m",
            parameters=params,
            candles=c_high_uk,
        )
    )
    print_trade_block(
        "HIGH RISK — ORB (HighRiskOrbBot) — UK100",
        "UK100",
        "M1",
        r_high_uk.model_dump(),
        days,
        risk_usd,
    )


if __name__ == "__main__":
    asyncio.run(main())
