"""Count open orders (Binance)."""
from __future__ import annotations

import argparse

from common.trading.clients import build_binance_trading_client


def count_open_orders(client, symbols: list[str]) -> int:
    total_open = 0
    for sym in symbols:
        try:
            opens = client.fetch_open_orders(sym)
            total_open += len(opens)
            print(f"{sym}: {len(opens)} open orders")
        except Exception as exc:
            print(f"{sym}: error fetching orders ({exc})")
    return total_open


def main() -> None:
    parser = argparse.ArgumentParser(description="Show count of open orders (Binance)")
    parser.add_argument(
        "--symbols",
        nargs="*",
        default=["BTC/USDT", "ETH/USDT", "SOL/USDT", "BNB/USDT"],
        help="Symbols to check",
    )
    parser.add_argument("--mainnet", action="store_true", help="Use Binance mainnet instead of testnet")
    args = parser.parse_args()

    client = build_binance_trading_client(testnet=not args.mainnet)
    total = count_open_orders(client, args.symbols)
    print(f"Total open orders: {total} (env: {'mainnet' if args.mainnet else 'testnet'})")


if __name__ == "__main__":
    main()
