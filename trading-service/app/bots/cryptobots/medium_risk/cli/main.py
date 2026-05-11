"""Entry point for backtesting or live signal execution."""
from __future__ import annotations

import argparse
import time
from pathlib import Path
from typing import Optional

from common.data.data_fetch import fetch_ohlcv
from common.trading.clients import build_bybit_client
from common.trading.execution import place_long_market
from medium_risk.backtesting.backtest import backtest_all, generate_pdf_report, summarize_trades
from medium_risk.config import (
    BACKTEST_STATS_PDF,
    CANDLE_LIMIT,
    DRY_RUN_DEFAULT,
    EXCEL_LOG_PATH,
    FIXED_RISK,
    INITIAL_BALANCE,
    MAX_OB_PCT,
    SYMBOLS,
    TIMEFRAME,
)
from medium_risk.reporting.trade_logger import append_trades_to_excel
from medium_risk.strategy.strategy import TradeResult


def detect_latest_entry(df, fixed_risk: float = FIXED_RISK):
    """
    Lightweight detector that mirrors the strategy on the most recent bars.
    Returns (entry_price, stop_price, position_size) or None.
    """
    if len(df) < 25:  # need room for volume SMA(20) and lookbacks
        return None

    i = len(df) - 1
    ob_range_pct = abs(df["high"].iloc[i - 3] - df["low"].iloc[i - 3]) / df["low"].iloc[i - 3] * 100
    vol_confirm = df["volume"].iloc[i - 3] > df["volume"].rolling(20).mean().iloc[i - 3]
    bull_ob = (
        df["close"].iloc[i - 3] < df["open"].iloc[i - 3]
        and ob_range_pct <= MAX_OB_PCT
        and df["close"].iloc[i - 5] > df["open"].iloc[i - 5]
        and df["close"].iloc[i - 4] > df["open"].iloc[i - 4]
        and df["close"].iloc[i - 2] > df["open"].iloc[i - 2]
        and df["close"].iloc[i - 1] > df["open"].iloc[i - 1]
        and vol_confirm
    )
    if not bull_ob:
        return None

    ob_high = df["high"].iloc[i - 3]
    ob_low = df["low"].iloc[i - 3]
    long_touch = df["low"].iloc[i] <= ob_high and df["high"].iloc[i] >= ob_low
    if not long_touch:
        return None

    risk_per_unit = df["close"].iloc[i] - ob_low
    if risk_per_unit <= 0:
        return None
    pos_size = fixed_risk / risk_per_unit
    entry_price = df["close"].iloc[i]
    stop_price = ob_low
    return entry_price, stop_price, pos_size


def run_live(symbol: str, dry_run: bool = DRY_RUN_DEFAULT, place_order: bool = False, testnet: bool = True):
    """Fetch latest data, check for an entry, optionally place an order, and log."""
    df = fetch_ohlcv(symbol, timeframe=TIMEFRAME, limit=CANDLE_LIMIT)
    signal = detect_latest_entry(df)
    if not signal:
        return

    entry_price, stop_price, pos_size = signal

    wallet_before = 0.0
    if place_order and not dry_run:
        client = build_bybit_client(testnet=testnet)
        order = place_long_market(client, symbol, pos_size)
        print(f"Order placed: {order}")
    else:
        print("Dry run enabled; no order sent.")

    trade = TradeResult(
        symbol=symbol,
        entry_time=df.iloc[-1]["datetime"],
        exit_time=df.iloc[-1]["datetime"],
        entry_price=entry_price,
        exit_price=entry_price,
        stop_price=stop_price,
        target_price=None,
        position_size=pos_size,
        pnl=0.0,
        reason="Signal (live)",
        wallet_before=wallet_before,
        wallet_after=wallet_before,
    )
    append_trades_to_excel([trade])
    print(f"Logged signal to {Path(EXCEL_LOG_PATH).resolve()}")


def parse_args():
    parser = argparse.ArgumentParser(description="OB Retest bot")
    sub = parser.add_subparsers(dest="cmd", required=True)

    bt = sub.add_parser("backtest", help="Run backtest on configured symbols")
    bt.add_argument(
        "--output",
        type=str,
        default=None,
        help=f"PDF report path (default: {BACKTEST_STATS_PDF})",
    )

    live_p = sub.add_parser("live", help="Check latest signal and optionally trade")
    live_p.add_argument("--symbol", default=SYMBOLS[0], help="Symbol, e.g. BTC/USDT")
    live_p.add_argument("--place-order", action="store_true", help="Actually place a market buy on Bybit")
    live_p.add_argument("--no-dry-run", action="store_true", help="Disable dry-run safety")
    live_p.add_argument("--mainnet", action="store_true", help="Use mainnet instead of testnet")
    live_p.add_argument(
        "--loop",
        action="store_true",
        help="Repeat live check every --interval-seconds until Ctrl+C",
    )
    live_p.add_argument(
        "--interval-seconds",
        type=int,
        default=300,
        help="Seconds between loop iterations (default: 300)",
    )

    bal = sub.add_parser("balance", help="Show Binance USDT balance (uses common creds)")
    bal.add_argument("--asset", default="USDT")
    bal.add_argument("--mainnet", action="store_true")

    pr = sub.add_parser("price", help="Show last price for a symbol (Binance public)")
    pr.add_argument("--symbol", default=SYMBOLS[0])

    oo = sub.add_parser("open-orders", help="Count open orders per symbol (Binance)")
    oo.add_argument("--symbols", nargs="*", default=SYMBOLS)
    oo.add_argument("--mainnet", action="store_true")

    return parser.parse_args()


def main():
    args = parse_args()
    if args.cmd == "backtest":
        equity, trades = backtest_all()
        print("Backtest complete. Final wallets by symbol:")
        for sym, bal in equity.items():
            print(f"{sym}: {bal:.2f}")
        print(f"Trades logged to {Path(EXCEL_LOG_PATH).resolve()}")
        stats = summarize_trades(INITIAL_BALANCE, trades)
        pdf_path = args.output or str(BACKTEST_STATS_PDF)
        generate_pdf_report(trades, stats, path=pdf_path)
        print(f"PDF report saved to {Path(pdf_path).resolve()}")
    elif args.cmd == "live":
        dry_run = not args.no_dry_run
        testnet = not args.mainnet
        if getattr(args, "loop", False):
            while True:
                run_live(
                    symbol=args.symbol,
                    dry_run=dry_run,
                    place_order=args.place_order,
                    testnet=testnet,
                )
                time.sleep(max(10, int(args.interval_seconds)))
        else:
            run_live(
                symbol=args.symbol,
                dry_run=dry_run,
                place_order=args.place_order,
                testnet=testnet,
            )
    elif args.cmd == "balance":
        from common.trading.balance import fetch_balance_usdt
        from common.trading.clients import build_binance_trading_client

        client = build_binance_trading_client(testnet=not args.mainnet)
        free, used, total = fetch_balance_usdt(client, args.asset.upper())
        print(f"Environment: {'mainnet' if args.mainnet else 'testnet'}")
        print(f"{args.asset.upper()} -> free: {free}, used: {used}, total: {total}")
    elif args.cmd == "price":
        from common.trading.prices import get_last_price

        print(f"{args.symbol} last: {get_last_price(args.symbol)}")
    elif args.cmd == "open-orders":
        from common.trading.clients import build_binance_trading_client
        from common.trading.open_orders import count_open_orders

        client = build_binance_trading_client(testnet=not args.mainnet)
        count_open_orders(client, list(args.symbols))


if __name__ == "__main__":
    main()
