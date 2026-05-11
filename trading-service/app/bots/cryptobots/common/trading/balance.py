"""Account balance (Binance)."""
from __future__ import annotations

import argparse

from common.trading.clients import build_binance_trading_client


def fetch_balance_usdt(client, asset: str = "USDT") -> tuple[float, float, float]:
    bal = client.fetch_balance()
    info = bal.get(asset, {})
    free = float(info.get("free") or 0.0)
    used = float(info.get("used") or 0.0)
    total = float(info.get("total") or 0.0)
    return free, used, total


def main() -> None:
    parser = argparse.ArgumentParser(description="Check Binance balance (testnet by default)")
    parser.add_argument("--asset", default="USDT", help="Asset symbol to display")
    parser.add_argument("--mainnet", action="store_true", help="Use mainnet instead of testnet")
    args = parser.parse_args()

    client = build_binance_trading_client(testnet=not args.mainnet)
    free, used, total = fetch_balance_usdt(client, args.asset.upper())

    print(f"Environment: {'mainnet' if args.mainnet else 'testnet'}")
    print(f"{args.asset.upper()} balance -> free: {free}, used: {used}, total: {total}")


if __name__ == "__main__":
    main()
