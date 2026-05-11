"""Interactive 1.5R trade tester on Binance spot (testnet by default).

Loop:
1) Show balance + active trades (open orders)
2) Ask for symbol (BTC/ETH/SOL/BNB) or Z to cancel all trades and exit
3) Fetch latest candle, size 1.5R trade, place it (with TP/SL), then show updated active trades
"""
from __future__ import annotations

import argparse
import ccxt

from common.data.data_fetch import fetch_ohlcv
from common.trading.clients import build_binance_trading_client
from medium_risk.config import CANDLE_LIMIT, DRY_RUN_DEFAULT, TIMEFRAME


def compute_risk_sizing(df, position_notional: float = 1000.0):
    """Use latest close as entry and previous candle low as stop; size to $notional."""
    if len(df) < 2:
        raise ValueError("Not enough candles to size a trade.")
    entry = df.iloc[-1]["close"]
    stop = min(df.iloc[-2]["low"], df.iloc[-1]["low"])
    risk_per_unit = entry - stop
    if risk_per_unit <= 0:
        raise ValueError("Stop is not below entry; cannot size trade.")
    size = position_notional / entry
    target = entry + 1.5 * (entry - stop)
    return entry, stop, target, size


def place_trade(symbol: str, entry: float, stop: float, target: float, size: float, dry_run: bool, testnet: bool):
    if dry_run:
        print("Dry run: no orders sent.")
        return

    client = build_binance_trading_client(testnet=testnet)
    order = client.create_market_buy_order(symbol, size)
    print(f"Market buy placed: {order}")

    try:
        tp_order = client.create_limit_sell_order(symbol, size, target)
        print(f"Take-profit (1.5R) placed: {tp_order}")
    except Exception as exc:
        print(f"Could not place TP order: {exc}")

    try:
        sl_order = client.create_order(
            symbol,
            type="STOP_LOSS_LIMIT",
            side="sell",
            amount=size,
            price=stop,
            params={"stopPrice": stop, "timeInForce": "GTC"},
        )
        print(f"Stop-loss placed: {sl_order}")
    except Exception as exc:
        print(f"Could not place SL order: {exc}")


def prompt_yes_no(message: str) -> bool:
    resp = input(f"{message} [y/N]: ").strip().lower()
    return resp == "y"


def get_balance_and_orders(client: ccxt.Exchange, asset: str = "USDT", symbols: list[str] | None = None) -> tuple[float, float, float, int]:
    bal = client.fetch_balance()
    info = bal.get(asset, {})
    free = info.get("free", 0.0)
    used = info.get("used", 0.0)
    total = info.get("total", 0.0)
    open_count = 0
    if symbols:
        for sym in symbols:
            try:
                open_orders = client.fetch_open_orders(sym)
                open_count += len(open_orders)
            except Exception:
                pass
    else:
        try:
            open_orders = client.fetch_open_orders()
            open_count = len(open_orders)
        except Exception:
            open_count = 0
    return free, used, total, open_count


def cancel_all_orders(client: ccxt.Exchange, symbols: list[str]) -> None:
    for sym in symbols:
        try:
            client.cancel_all_orders(sym)
        except Exception:
            pass


def main():
    parser = argparse.ArgumentParser(description="Interactive 1.5R trade tester (Binance)")
    parser.add_argument("--no-dry-run", action="store_true", help="Actually send orders")
    parser.add_argument("--mainnet", action="store_true", help="Use Binance mainnet instead of testnet")
    args = parser.parse_args()

    dry_run = DRY_RUN_DEFAULT if not args.no_dry_run else False
    testnet = not args.mainnet

    client = build_binance_trading_client(testnet=testnet)
    allowed = {
        "BTC": "BTC/USDT",
        "ETH": "ETH/USDT",
        "SOL": "SOL/USDT",
        "BNB": "BNB/USDT",
    }

    while True:
        free, used, total, open_count = get_balance_and_orders(client, asset="USDT", symbols=list(allowed.values()))
        print(f"\nEnvironment: {'mainnet' if args.mainnet else 'testnet'} | Dry run: {dry_run}")
        print(f"USDT balance -> free: {free}, used: {used}, total: {total}")
        print(f"Active trades (open orders): {open_count}")
        choice = input("Enter symbol to trade (BTC/ETH/SOL/BNB) or Z to cancel all and exit: ").strip().upper()

        if choice == "Z":
            print("Cancelling all open orders...")
            cancel_all_orders(client, list(allowed.values()))
            _, _, _, open_after = get_balance_and_orders(client, asset="USDT")
            print(f"Active trades after cancel: {open_after}")
            print("Exiting.")
            break

        if choice not in allowed:
            print("Invalid choice. Please enter BTC, ETH, SOL, BNB or Z.")
            continue

        symbol = allowed[choice]
        df = fetch_ohlcv(symbol, timeframe=TIMEFRAME, limit=CANDLE_LIMIT)
        entry, stop, target, size = compute_risk_sizing(df, position_notional=1000.0)

        print(f"\nSymbol: {symbol}")
        print(f"Entry (market): {entry:.2f}")
        print(f"Stop: {stop:.2f}")
        print(f"Target (1.5R): {target:.2f}")
        print(f"Size: {size:.6f}")
        print(f"Dry run: {dry_run} | Testnet: {testnet}")

        if prompt_yes_no("Place trade?"):
            place_trade(symbol, entry, stop, target, size, dry_run=dry_run, testnet=testnet)
        else:
            print("Trade skipped.")

        _, _, _, open_after = get_balance_and_orders(client, asset="USDT")
        print(f"Active trades (open orders) now: {open_after}")


if __name__ == "__main__":
    main()
