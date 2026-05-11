"""High-risk bot CLI."""
from __future__ import annotations

import argparse
import time
from pathlib import Path

from common.config import PAIR_LABEL_TO_CCXT, DRY_RUN_DEFAULT
from common.data.data_fetch import fetch_ohlcv, to_legacy_ohlc_columns
from common.trading.clients import build_binance_trading_client, build_bybit_client
from common.trading.execution import place_long_market, place_short_market
from common.trading.open_orders import count_open_orders
from common.trading.prices import get_last_price
from high_risk.backtesting.runner import run_backtest
from high_risk.config import CANDLE_LIMIT, EXCEL_LOG_PATH, HIGH_RISK_REPORT_PDF
from high_risk.reporting.trade_logger import append_signal_rows
from high_risk.strategy.strategy import detect_latest_intent


def run_live(
    pair_label: str,
    interval: str,
    dry_run: bool = DRY_RUN_DEFAULT,
    place_order: bool = False,
    testnet: bool = True,
    risk_per_trade: float = 1000.0,
) -> None:
    sym = PAIR_LABEL_TO_CCXT[pair_label]
    raw = fetch_ohlcv(sym, timeframe=interval, limit=CANDLE_LIMIT)
    legacy = to_legacy_ohlc_columns(raw)
    intent = detect_latest_intent(legacy, risk_per_trade=risk_per_trade)
    if not intent:
        print("No entry signal on latest bar.")
        return
    print(f"Signal: {intent}")
    row = {
        "pair": pair_label,
        "side": intent["side"],
        "entry": intent["entry"],
        "stop": intent["stop"],
        "target": intent["target"],
        "quantity": intent["quantity"],
        "dry_run": dry_run or not place_order,
    }
    if not place_order or dry_run:
        print("Dry run: no order sent.")
        append_signal_rows([row])
        print(f"Logged to {Path(EXCEL_LOG_PATH).resolve()}")
        return
    client = build_bybit_client(testnet=testnet)
    if intent["side"] == "LONG":
        order = place_long_market(client, sym, intent["quantity"])
    else:
        order = place_short_market(client, sym, intent["quantity"])
    print(f"Order placed: {order}")
    row["dry_run"] = False
    append_signal_rows([row])
    print(f"Logged to {Path(EXCEL_LOG_PATH).resolve()}")


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="High-risk crypto bot (EMA/RSI/ATR)")
    sub = p.add_subparsers(dest="cmd", required=True)

    bt = sub.add_parser("backtest", help="Run PDF backtest")
    bt.add_argument("--start", required=True)
    bt.add_argument("--end", required=True)
    bt.add_argument("--interval", default="1h")
    bt.add_argument(
        "--output",
        default=None,
        help=f"PDF path (default: {HIGH_RISK_REPORT_PDF})",
    )

    lv = sub.add_parser("live", help="Latest-bar signal + optional Bybit order")
    lv.add_argument("--pair", default="BTC", choices=list(PAIR_LABEL_TO_CCXT.keys()))
    lv.add_argument("--interval", default="1h")
    lv.add_argument("--risk-per-trade", type=float, default=1000.0)
    lv.add_argument("--place-order", action="store_true")
    lv.add_argument("--no-dry-run", action="store_true")
    lv.add_argument("--mainnet", action="store_true")
    lv.add_argument("--loop", action="store_true")
    lv.add_argument("--interval-seconds", type=int, default=3600)

    bal = sub.add_parser("balance", help="Binance USDT balance")
    bal.add_argument("--asset", default="USDT")
    bal.add_argument("--mainnet", action="store_true")

    pr = sub.add_parser("price", help="Last price (Binance public)")
    pr.add_argument("--symbol", default="BTC/USDT")

    oo = sub.add_parser("open-orders", help="Open orders (Binance)")
    oo.add_argument("--symbols", nargs="*", default=["BTC/USDT", "ETH/USDT", "SOL/USDT", "BNB/USDT"])
    oo.add_argument("--mainnet", action="store_true")

    return p.parse_args()


def main() -> None:
    args = parse_args()
    if args.cmd == "backtest":
        out = args.output or str(HIGH_RISK_REPORT_PDF)
        run_backtest(start_date=args.start, end_date=args.end, interval=args.interval, output_pdf=out)
    elif args.cmd == "live":
        dry_run = not args.no_dry_run
        testnet = not args.mainnet
        if args.loop:
            while True:
                run_live(
                    pair_label=args.pair,
                    interval=args.interval,
                    dry_run=dry_run,
                    place_order=args.place_order,
                    testnet=testnet,
                    risk_per_trade=args.risk_per_trade,
                )
                time.sleep(max(60, args.interval_seconds))
        else:
            run_live(
                pair_label=args.pair,
                interval=args.interval,
                dry_run=dry_run,
                place_order=args.place_order,
                testnet=testnet,
                risk_per_trade=args.risk_per_trade,
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
