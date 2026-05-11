"""Low-risk bot CLI."""
from __future__ import annotations

import argparse
import time
from pathlib import Path

from common.config import YAHOO_PAIR_TO_CCXT
from common.data.data_fetch import fetch_ohlcv, to_legacy_ohlc_columns
from common.trading.clients import build_binance_trading_client, build_bybit_client
from common.trading.execution import place_long_market, place_short_market
from common.trading.open_orders import count_open_orders
from common.trading.prices import get_last_price
from low_risk.backtesting.runner import run_full_backtest
from low_risk.config import (
    CANDLE_LIMIT,
    DEFAULT_LONG_ONLY,
    DEFAULT_RSI_HIGH,
    DEFAULT_RSI_LOW,
    DEFAULT_STOP_ATR,
    DEFAULT_TP_ATR,
    DRY_RUN_DEFAULT,
    EXCEL_LOG_PATH,
    OUTPUT_PDF,
    PAIRS,
    TIMEFRAME,
)
from low_risk.reporting.trade_logger import append_signal_rows
from low_risk.strategy.strategy import detect_latest_intent


def run_live(
    pair_label: str,
    dry_run: bool = DRY_RUN_DEFAULT,
    place_order: bool = False,
    testnet: bool = True,
    long_only: bool = DEFAULT_LONG_ONLY,
    rsi_low: float = DEFAULT_RSI_LOW,
    rsi_high: float = DEFAULT_RSI_HIGH,
    stop_atr: float = DEFAULT_STOP_ATR,
    tp_atr: float = DEFAULT_TP_ATR,
) -> None:
    sym = YAHOO_PAIR_TO_CCXT[pair_label]
    raw = fetch_ohlcv(sym, timeframe=TIMEFRAME, limit=CANDLE_LIMIT)
    legacy = to_legacy_ohlc_columns(raw)
    intent = detect_latest_intent(legacy, long_only, rsi_low, rsi_high, stop_atr, tp_atr)
    if not intent:
        print("No entry signal on latest daily bar.")
        return

    print(f"Signal: {intent}")
    if not place_order or dry_run:
        print("Dry run: no order sent.")
        append_signal_rows(
            [
                {
                    "pair": pair_label,
                    "side": intent["side"],
                    "entry": intent["entry"],
                    "stop": intent["stop"],
                    "take_profit": intent["take_profit"],
                    "units": intent["units"],
                    "dry_run": True,
                }
            ]
        )
        print(f"Logged to {Path(EXCEL_LOG_PATH).resolve()}")
        return

    client = build_bybit_client(testnet=testnet)
    if intent["side"] == "LONG":
        order = place_long_market(client, sym, intent["units"])
    else:
        order = place_short_market(client, sym, intent["units"])
    print(f"Order placed: {order}")
    append_signal_rows(
        [
            {
                "pair": pair_label,
                "side": intent["side"],
                "entry": intent["entry"],
                "stop": intent["stop"],
                "take_profit": intent["take_profit"],
                "units": intent["units"],
                "dry_run": False,
            }
        ]
    )
    print(f"Logged to {Path(EXCEL_LOG_PATH).resolve()}")


def parse_args():
    p = argparse.ArgumentParser(description="Low-risk crypto bot (SMA/RSI/ATR)")
    sub = p.add_subparsers(dest="cmd", required=True)

    bt = sub.add_parser("backtest", help="Run full historical backtest + PDF")
    bt.add_argument(
        "--output",
        default=None,
        help=f"PDF report path (default: {OUTPUT_PDF})",
    )

    lv = sub.add_parser("live", help="Evaluate latest daily bar and optionally trade (Bybit)")
    lv.add_argument("--pair", default=PAIRS[0], choices=PAIRS, help="Pair label e.g. BTC-USD")
    lv.add_argument("--place-order", action="store_true")
    lv.add_argument("--no-dry-run", action="store_true")
    lv.add_argument("--mainnet", action="store_true")
    lv.add_argument(
        "--allow-short",
        action="store_true",
        help="Allow short signals (default: long-only, matching DEFAULT_LONG_ONLY)",
    )
    lv.add_argument("--rsi-low", type=float, default=DEFAULT_RSI_LOW)
    lv.add_argument("--rsi-high", type=float, default=DEFAULT_RSI_HIGH)
    lv.add_argument("--stop-atr", type=float, default=DEFAULT_STOP_ATR)
    lv.add_argument("--tp-atr", type=float, default=DEFAULT_TP_ATR)
    lv.add_argument("--loop", action="store_true")
    lv.add_argument("--interval-seconds", type=int, default=86_400)

    bal = sub.add_parser("balance", help="Binance USDT balance")
    bal.add_argument("--asset", default="USDT")
    bal.add_argument("--mainnet", action="store_true")

    pr = sub.add_parser("price", help="Last price (Binance public)")
    pr.add_argument("--symbol", default="BTC/USDT")

    oo = sub.add_parser("open-orders", help="Open order counts (Binance)")
    oo.add_argument("--symbols", nargs="*", default=["BTC/USDT", "ETH/USDT", "SOL/USDT", "BNB/USDT"])
    oo.add_argument("--mainnet", action="store_true")

    return p.parse_args()


def main():
    args = parse_args()
    if args.cmd == "backtest":
        run_full_backtest(output_pdf=getattr(args, "output", None))
    elif args.cmd == "live":
        dry_run = not args.no_dry_run
        testnet = not args.mainnet
        long_only = not getattr(args, "allow_short", False)
        if args.loop:
            while True:
                run_live(
                    pair_label=args.pair,
                    dry_run=dry_run,
                    place_order=args.place_order,
                    testnet=testnet,
                    long_only=long_only,
                    rsi_low=args.rsi_low,
                    rsi_high=args.rsi_high,
                    stop_atr=args.stop_atr,
                    tp_atr=args.tp_atr,
                )
                time.sleep(max(60, args.interval_seconds))
        else:
            run_live(
                pair_label=args.pair,
                dry_run=dry_run,
                place_order=args.place_order,
                testnet=testnet,
                long_only=long_only,
                rsi_low=args.rsi_low,
                rsi_high=args.rsi_high,
                stop_atr=args.stop_atr,
                tp_atr=args.tp_atr,
            )
    elif args.cmd == "balance":
        from common.trading.balance import fetch_balance_usdt

        client = build_binance_trading_client(testnet=not args.mainnet)
        free, used, total = fetch_balance_usdt(client, args.asset.upper())
        print(f"Environment: {'mainnet' if args.mainnet else 'testnet'}")
        print(f"{args.asset.upper()} -> free: {free}, used: {used}, total: {total}")
    elif args.cmd == "price":
        print(f"{args.symbol} last: {get_last_price(args.symbol)}")
    elif args.cmd == "open-orders":
        client = build_binance_trading_client(testnet=not args.mainnet)
        count_open_orders(client, list(args.symbols))


if __name__ == "__main__":
    main()
