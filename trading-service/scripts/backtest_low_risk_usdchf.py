"""
Run low_risk ORB backtest on USDCHF M1 for the last N calendar days.

Backtest-only sizing: notional **$100,000** account, **1%** risk per trade ($1,000).
Live trading uses 1% of the actual account balance via `update_balance` / bot params.

Requires OANDA practice/live API credentials in `.env`:
  OANDA_API_KEY, OANDA_ACCOUNT_ID, OANDA_BASE_URL

Usage (from trading-service directory):
  python scripts/backtest_low_risk_usdchf.py
  python scripts/backtest_low_risk_usdchf.py --days 14
"""
from __future__ import annotations

import argparse
import asyncio
import json
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

# Allow running as `python scripts/backtest_low_risk_usdchf.py`
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.adapters.oanda_provider import OandaProvider
from app.config.backtest_defaults import BACKTEST_NOTIONAL_USD, BACKTEST_RISK_PCT
from app.config.settings import settings
from app.schemas.backtest import BacktestRequest
from app.services.backtesting import run_backtest


async def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--days", type=int, default=30, help="Calendar days of M1 history")
    parser.add_argument("--json", action="store_true", help="Print raw JSON result")
    args = parser.parse_args()

    if not (settings.oanda_api_key or "").strip():
        print(
            "OANDA_API_KEY is not set. Add it to trading-service/.env "
            "(see .env.example) and retry.",
            file=sys.stderr,
        )
        sys.exit(1)

    end = datetime.now(timezone.utc).date()
    start = end - timedelta(days=args.days)

    provider = OandaProvider()
    candles = await provider.fetch_candles_range(
        "USDCHF", "1m", start.isoformat(), end.isoformat()
    )
    print(f"Fetched {len(candles)} M1 candles from {start} to {end} UTC")

    if len(candles) < 31:
        print("Not enough candles for backtest (need at least 31).", file=sys.stderr)
        sys.exit(2)

    risk_usd = BACKTEST_NOTIONAL_USD * (BACKTEST_RISK_PCT / 100.0)
    print(
        f"Backtest sizing: notional ${BACKTEST_NOTIONAL_USD:,.0f}, "
        f"{BACKTEST_RISK_PCT}% risk = ${risk_usd:,.0f}/trade "
        "(live: 1% of actual account via update_balance)"
    )

    req = BacktestRequest(
        bot_type="low_risk",
        symbol="USDCHF",
        market="forex",
        timeframe="1m",
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
    print(f"total_trades:    {d['total_trades']}")
    print(f"win_rate:        {d['win_rate']}%")
    print(f"total_profit_%:  {d['total_profit_pct']}")
    print(f"max_drawdown_%:  {d['max_drawdown_pct']}")
    print(f"profit_factor:   {d['profit_factor']}")
    print()
    print("--- P&L (USD, linear sizing from $ risk at stop) ---")
    print(f"total_pnl_usd:     ${d['total_pnl_usd']:,.2f}")
    print(f"gross_profit_usd:  ${d['gross_profit_usd']:,.2f}")
    print(f"gross_loss_usd:    ${d['gross_loss_usd']:,.2f}")
    print(f"max_drawdown_usd:  ${d['max_drawdown_usd']:,.2f}")
    print(f"profit_factor_usd: {d['profit_factor_usd']}")
    print()
    for t in d.get("trades", []):
        pnl_usd = t.get("pnl_usd", 0)
        sign = "+" if pnl_usd >= 0 else ""
        print(
            f"  #{t['trade_no']} {t['side']} {t['result']} "
            f"pnl%={t['pnl_pct']} pnl_usd={sign}${pnl_usd:,.2f} "
            f"entry={t['entry_time']} exit={t['exit_time']}"
        )


if __name__ == "__main__":
    asyncio.run(main())
