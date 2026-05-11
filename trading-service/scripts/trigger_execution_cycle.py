#!/usr/bin/env python3
"""
Trigger **one real execution cycle** on the trading service (same path as the
background worker: load active bots → candles → strategy → sentiment gate →
paper or live broker → Mongo trade_records).

This does **not** insert fake rows. It calls:

  POST {TRADING_SERVICE_URL}/debug/execute

Prerequisites
-------------
- `trading-service` running (default http://localhost:8002).
- MongoDB + Redis; NLP service reachable (sentiment gate).
- At least one **active** bot in `bot_instances` for your account.
- Strategy must signal buy/sell (not hold) for a trade to open; sentiment may
  block or allow; paper trades close via monitor when SL/TP hit.

Usage
-----
  cd trading-service
  python scripts/trigger_execution_cycle.py

  # Custom URL
  set TRADING_SERVICE_URL=http://localhost:8002
  python scripts/trigger_execution_cycle.py

  # Via gateway (JWT) — get token from login response
  python scripts/trigger_execution_cycle.py --gateway http://localhost:3001 --token YOUR_JWT
"""
from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.error
import urllib.request


def main() -> None:
    p = argparse.ArgumentParser(description="POST trading-service /debug/execute")
    p.add_argument(
        "--trading-url",
        default=os.environ.get("TRADING_SERVICE_URL", "http://localhost:8002").rstrip("/"),
        help="Trading service base URL (default TRADING_SERVICE_URL or localhost:8002)",
    )
    p.add_argument(
        "--gateway",
        default="",
        help="If set, POST to {gateway}/api/trading/debug/execute with Bearer token",
    )
    p.add_argument("--token", default="", help="JWT for --gateway (Bearer)")
    args = p.parse_args()

    if args.gateway:
        if not args.token:
            print("Error: --token required with --gateway", file=sys.stderr)
            raise SystemExit(1)
        url = f"{args.gateway.rstrip('/')}/api/trading/debug/execute"
        req = urllib.request.Request(
            url,
            data=b"{}",
            method="POST",
            headers={
                "Authorization": f"Bearer {args.token}",
                "Content-Type": "application/json",
            },
        )
    else:
        url = f"{args.trading_url}/debug/execute"
        req = urllib.request.Request(
            url,
            data=b"{}",
            method="POST",
            headers={"Content-Type": "application/json"},
        )

    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            body = resp.read().decode()
            try:
                print(json.dumps(json.loads(body), indent=2))
            except json.JSONDecodeError:
                print(body)
    except urllib.error.HTTPError as e:
        print(e.code, e.read().decode(), file=sys.stderr)
        raise SystemExit(1) from e
    except urllib.error.URLError as e:
        print(e, file=sys.stderr)
        raise SystemExit(1) from e


if __name__ == "__main__":
    main()
