#!/usr/bin/env python3
"""
Insert synthetic **closed** trades into MongoDB `trade_records` so the frontend
(`/api/trades`, dashboard charts) has data to display.

For **real** execution (strategy + NLP + broker), use `trigger_execution_cycle.py`
or the dashboard **Run execution now** button / `POST /api/trading/debug/execute`.

These seed rows match the shape produced by paper execution + monitor close:
`status=closed`, `pnl`, `entryPrice`, `exitPrice`, `closedAt`, `closeReason=test_seed`.

Prerequisites
-------------
- MongoDB reachable (same `MONGO_URI` / `mongo_db_name` as trading-service `.env`).
- A real **gateway user id** (the `id` in your JWT, i.e. Mongo `users._id` as string).

Usage (from `trading-service` directory)
----------------------------------------
  # Resolve user id by email (same DB as gateway `users` collection):
  python scripts/seed_test_trades.py --email you@example.com

  # Or pass the id explicitly (from JWT payload or Mongo):
  python scripts/seed_test_trades.py --user-id 507f1f77bcf86cd799439011

  # More trades, replace previous test_seed rows for this user first:
  python scripts/seed_test_trades.py --email you@example.com --count 20 --replace

  # Preview documents only:
  python scripts/seed_test_trades.py --email you@example.com --dry-run

After running, refresh the TradePilot dashboard / trade journal while logged in
as that user.
"""
from __future__ import annotations

import argparse
import random
import string
import sys
import uuid
from datetime import datetime, timedelta, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from pymongo import MongoClient

from app.config.settings import settings

# Same tag as monitor_worker uses for real closes; we use a distinct reason for cleanup.
SEED_REASON = "test_seed"


def _rnd_bot_id() -> str:
    return "".join(random.choices(string.ascii_lowercase + string.digits, k=8))


def _pnl_buy(entry: float, exit_px: float, volume: float) -> float:
    return round((exit_px - entry) * volume, 4)


def _pnl_sell(entry: float, exit_px: float, volume: float) -> float:
    return round((entry - exit_px) * volume, 4)


def build_closed_trade(
    *,
    user_id: str,
    bot_id: str,
    base_time: datetime,
    symbol: str,
    action: str,
    entry: float,
    exit_px: float,
    volume: float,
) -> dict:
    if action == "buy":
        pnl = _pnl_buy(entry, exit_px, volume)
    else:
        pnl = _pnl_sell(entry, exit_px, volume)

    opened = base_time - timedelta(seconds=random.randint(2, 120))
    closed = base_time

    return {
        "botID": bot_id,
        "userID": user_id,
        "orderID": f"seed_{uuid.uuid4().hex[:12]}",
        "symbol": symbol,
        "action": action,
        "entryPrice": entry,
        "exitPrice": exit_px,
        "volume": volume,
        "pnl": pnl,
        "status": "closed",
        "sentimentScore": round(random.uniform(-0.2, 0.2), 4),
        "sentimentLabel": "neutral",
        "stopLoss": None,
        "takeProfit": None,
        "market": "forex",
        "timestamp": opened,
        "closedAt": closed,
        "closeReason": SEED_REASON,
    }


def resolve_user_id(client: MongoClient, db_name: str, email: str | None, user_id: str | None) -> str:
    if user_id:
        return user_id.strip()
    if not email:
        raise ValueError("Provide --user-id or --email")

    db = client[db_name]
    doc = db["users"].find_one({"email": email.strip().lower()})
    if not doc:
        raise ValueError(f"No user found with email: {email}")
    return str(doc["_id"])


def main() -> None:
    parser = argparse.ArgumentParser(description="Seed closed test trades for frontend QA")
    parser.add_argument("--user-id", help="Gateway user id (Mongo users._id string)")
    parser.add_argument("--email", help="Look up user id from users collection by email")
    parser.add_argument("--count", type=int, default=12, help="Number of closed trades to insert")
    parser.add_argument(
        "--replace",
        action="store_true",
        help=f"Delete existing seeded rows (closeReason={SEED_REASON!r}) for this user first",
    )
    parser.add_argument("--dry-run", action="store_true", help="Print documents; do not write")
    args = parser.parse_args()

    uri = settings.mongo_uri
    db_name = settings.mongo_db_name

    client = MongoClient(uri)
    try:
        try:
            uid = resolve_user_id(client, db_name, args.email, args.user_id)
        except ValueError as e:
            print(e, file=sys.stderr)
            raise SystemExit(1) from e

        coll = client[db_name]["trade_records"]

        if args.replace and not args.dry_run:
            deleted = coll.delete_many({"userID": uid, "closeReason": SEED_REASON})
            print(f"Removed {deleted.deleted_count} prior test trades for user {uid}")

        # Alternate wins / losses on EUR_USD; mix buy/sell. Stagger times backward so recent first.
        now = datetime.now(timezone.utc)
        rows: list[dict] = []
        bot = _rnd_bot_id()
        volume = 10_000.0
        base_entry = 1.0850

        for i in range(args.count):
            t = now - timedelta(hours=i * 3 + random.random())
            win = i % 2 == 0
            use_buy = i % 3 != 0

            if use_buy:
                action = "buy"
                if win:
                    exit_px = base_entry + 0.0008 + random.random() * 0.0004
                else:
                    exit_px = base_entry - 0.0006 - random.random() * 0.0004
            else:
                action = "sell"
                if win:
                    exit_px = base_entry - 0.0008 - random.random() * 0.0004
                else:
                    exit_px = base_entry + 0.0006 + random.random() * 0.0004

            rows.append(
                build_closed_trade(
                    user_id=uid,
                    bot_id=bot,
                    base_time=t,
                    symbol="EUR_USD",
                    action=action,
                    entry=round(base_entry, 5),
                    exit_px=round(exit_px, 5),
                    volume=volume,
                )
            )

        if args.dry_run:
            for i, r in enumerate(rows):
                print(f"--- {i + 1} ---")
                print(f"  pnl={r['pnl']} action={r['action']} closedAt={r['closedAt']}")
            print(f"\nDry run: would insert {len(rows)} documents for userID={uid}")
            return

        result = coll.insert_many(rows)
        print(f"Inserted {len(result.inserted_ids)} closed trades for userID={uid}")
        print(f"  botID={bot}  closeReason={SEED_REASON!r}")
        print("Refresh the TradePilot dashboard while logged in as this user.")
    finally:
        client.close()


if __name__ == "__main__":
    main()
