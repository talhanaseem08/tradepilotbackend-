"""
Run medium_risk BOS backtest on EURUSD M5 for the last N calendar days.

Strategy: Bullish Break of Structure Retest (pivot-based, 5M candles).
SL: 0.04% of price; TP: **1.5R** (1.5× stop distance).
Sizing: notional $100,000 account, **1% risk** per trade ($1,000 at stop in linear backtest).

Requires OANDA credentials in .env:
  OANDA_API_KEY, OANDA_ACCOUNT_ID, OANDA_BASE_URL

Usage (from trading-service directory):
  python scripts/backtest_medium_risk_bos.py
  python scripts/backtest_medium_risk_bos.py --days 30
  python scripts/backtest_medium_risk_bos.py --json
"""
from __future__ import annotations

import argparse
import asyncio
import json
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.adapters.oanda_provider import OandaProvider
from app.config.backtest_defaults import BACKTEST_NOTIONAL_USD, BACKTEST_RISK_PCT
from app.config.settings import settings
from app.schemas.backtest import BacktestRequest
from app.services.backtesting import run_backtest


def _print_summary(d: dict, *, days: int, risk_usd: float) -> None:
    wins  = d["winning_trades"]
    total = d["total_trades"]
    losses = d["losing_trades"]

    avg_win  = (d["gross_profit_usd"] / wins)   if wins   else 0.0
    avg_loss = (d["gross_loss_usd"]   / losses)  if losses else 0.0
    net_r = d["total_pnl_usd"] / risk_usd if risk_usd else 0.0
    avg_win_r = avg_win / risk_usd if wins and risk_usd else 0.0
    avg_loss_r = avg_loss / risk_usd if losses and risk_usd else 0.0

    print()
    print("=" * 60)
    print(f"  MEDIUM RISK BOS — EURUSD M5  ({days}-day backtest)")
    print("=" * 60)
    print(f"  Total trades   : {total}")
    print(f"  Wins / Losses  : {wins} / {losses}")
    print(f"  Win rate       : {d['win_rate']}%")
    print(f"  Total P&L %    : {d['total_profit_pct']}%")
    print(f"  Max drawdown % : {d['max_drawdown_pct']}%")
    print(f"  Profit factor  : {d['profit_factor']}")
    print()
    print(f"  --- USD P&L (risk ${risk_usd:,.0f}/trade at stop, TP = 1.5R = ${risk_usd * 1.5:,.0f}) ---")
    print(f"  Total P&L      : ${d['total_pnl_usd']:,.2f}")
    print(f"  Net R (total)  : {net_r:+.2f}R  (sum of per-trade R at ${risk_usd:,.0f} risk)")
    print(f"  Gross profit   : ${d['gross_profit_usd']:,.2f}")
    print(f"  Gross loss     : -${d['gross_loss_usd']:,.2f}")
    print(f"  Max drawdown   : -${d['max_drawdown_usd']:,.2f}")
    print(f"  Profit factor  : {d['profit_factor_usd']}")
    print(f"  Avg win        : ${avg_win:,.2f}  (~{avg_win_r:.2f}R)")
    print(f"  Avg loss       : -${avg_loss:,.2f}  (~{avg_loss_r:.2f}R)")
    print("=" * 60)


def _print_trades(d: dict, *, risk_usd: float) -> None:
    trades = d.get("trades", [])
    if not trades:
        print("  No trades.")
        return

    print()
    print(f"  {'#':>4}  {'SIDE':<5}  {'EX':<3}  {'RESULT':<5}  "
          f"{'R':>5}  {'PNL%':>7}  {'PNL_USD':>9}  "
          f"{'ENTRY':>8}  {'EXIT':>8}  "
          f"{'SL':>8}  {'TP':>8}  "
          f"{'ENTRY TIME':<22}  {'EXIT TIME':<22}")
    print("  " + "-" * 148)

    for t in trades:
        pnl_usd = t["pnl_usd"]
        usd_str = f"+${abs(pnl_usd):>8,.2f}" if pnl_usd >= 0 else f"-${abs(pnl_usd):>8,.2f}"
        r_label = "W" if t["result"] == "WIN" else "L"
        r_mult = pnl_usd / risk_usd if risk_usd else 0.0
        exit_px = t["exit_price"]
        ex = "SL" if abs(exit_px - t["stop_loss"]) < 1e-4 else "TP"
        print(
            f"  {t['trade_no']:>4}  {t['side']:<5}  {ex:<3}  {r_label:<5}  "
            f"{r_mult:>+5.2f}  {t['pnl_pct']:>+7.4f}  {usd_str}  "
            f"{t['entry_price']:>8.5f}  {t['exit_price']:>8.5f}  "
            f"{t['stop_loss']:>8.5f}  {t['take_profit']:>8.5f}  "
            f"{t['entry_time']:<22}  {t['exit_time']:<22}"
        )


async def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--days", type=int, default=30, help="Calendar days of M5 history")
    parser.add_argument("--json", action="store_true", help="Print raw JSON result")
    args = parser.parse_args()

    if not (settings.oanda_api_key or "").strip():
        print(
            "OANDA_API_KEY is not set. Add it to trading-service/.env and retry.",
            file=sys.stderr,
        )
        sys.exit(1)

    end   = datetime.now(timezone.utc).date()
    start = end - timedelta(days=args.days)

    print(f"Fetching EURUSD M5 candles from {start} to {end} UTC …")
    provider = OandaProvider()
    candles  = await provider.fetch_candles_range(
        "EURUSD", "5m", start.isoformat(), end.isoformat()
    )
    print(f"Fetched {len(candles)} M5 candles")

    if len(candles) < 31:
        print("Not enough candles (need at least 31).", file=sys.stderr)
        sys.exit(2)

    risk_usd = BACKTEST_NOTIONAL_USD * (BACKTEST_RISK_PCT / 100.0)
    print(
        f"Sizing: account_balance ${BACKTEST_NOTIONAL_USD:,.0f}, "
        f"{BACKTEST_RISK_PCT}% risk = ${risk_usd:,.0f}/trade at stop"
    )

    req = BacktestRequest(
        bot_type="medium_risk",
        symbol="EURUSD",
        market="forex",
        timeframe="5m",
        parameters={
            "account_balance": BACKTEST_NOTIONAL_USD,
            "risk_per_trade_pct": BACKTEST_RISK_PCT,
        },
        candles=candles,
    )
    result = await run_backtest(req)

    if args.json:
        print(json.dumps(result.model_dump(), indent=2))
        return

    d = result.model_dump()
    _print_summary(d, days=args.days, risk_usd=risk_usd)
    _print_trades(d, risk_usd=risk_usd)


if __name__ == "__main__":
    asyncio.run(main())
