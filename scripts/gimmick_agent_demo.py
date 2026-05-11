#!/usr/bin/env python3
"""
Gimmick AI agent demo (TradePilot) — FOR DEMONSTRATION ONLY.

What it does (terminal output):
  - Pretends to monitor "bots" and "fine-tune" hooks (no real connection).
  - Simulates reading trade logs and scanning for **three consecutive losses**.
  - Calls **Ollama** over HTTP for real when a condition would trigger OR for a short
    "fine-tune acknowledgement" line (optional).

Default test behaviour: mock trades are built so **3 consecutive losses never occur**,
so the "market analysis" branch does **not** run — you only see the agent "checking"
messages. Use `--demo-trigger` to inject 3 consecutive losses once and see the Ollama line.

Requirements: Python 3.10+, Ollama running locally (or set OLLAMA_URL).

Usage:
  python scripts/gimmick_agent_demo.py
  python scripts/gimmick_agent_demo.py --demo-trigger
  set OLLAMA_URL=http://127.0.0.1:11434
  set OLLAMA_MODEL=mistral
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.error
import urllib.request
from dataclasses import dataclass
from typing import Any


# ---------------------------------------------------------------------------
# Config (no link to trading-service / bots — all cosmetic)
# ---------------------------------------------------------------------------

DEFAULT_OLLAMA_URL = os.environ.get("OLLAMA_URL", "http://127.0.0.1:11434").rstrip("/")
DEFAULT_MODEL = os.environ.get("OLLAMA_MODEL", "llama3.2")

BANNER = """
======================================================================
  GIMMICK AGENT DEMO - NOT CONNECTED TO LIVE BOTS OR BROKERS
  Ollama calls are real HTTP; bot IDs and trade logs are simulated.
======================================================================
"""


@dataclass
class MockTrade:
    trade_id: str
    pnl_usd: float

    @property
    def is_loss(self) -> bool:
        return self.pnl_usd < 0


def ollama_generate(base_url: str, model: str, prompt: str, timeout: float = 120.0) -> str:
    """POST /api/generate — returns assistant text or raises."""
    url = f"{base_url}/api/generate"
    body = json.dumps(
        {"model": model, "prompt": prompt, "stream": False}
    ).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=body,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    return (data.get("response") or "").strip()


def ollama_tags(base_url: str, timeout: float = 5.0) -> bool:
    try:
        urllib.request.urlopen(f"{base_url}/api/tags", timeout=timeout)
        return True
    except (urllib.error.URLError, TimeoutError, OSError):
        return False


def three_consecutive_losses(trades: list[MockTrade]) -> bool:
    if len(trades) < 3:
        return False
    for i in range(len(trades) - 2):
        a, b, c = trades[i], trades[i + 1], trades[i + 2]
        if a.is_loss and b.is_loss and c.is_loss:
            return True
    return False


def mock_trades_no_trigger() -> list[MockTrade]:
    """Pattern avoids three losses in a row (testing: agent does not 'fire')."""
    return [
        MockTrade("t1", 120.0),
        MockTrade("t2", -40.0),
        MockTrade("t3", 55.0),
        MockTrade("t4", -30.0),
        MockTrade("t5", 200.0),
        MockTrade("t6", -25.0),
    ]


def mock_trades_demo_trigger() -> list[MockTrade]:
    """Explicit three consecutive losses at the end."""
    return [
        MockTrade("t1", 100.0),
        MockTrade("t2", -50.0),
        MockTrade("t3", -50.0),
        MockTrade("t4", -50.0),
    ]


def print_trade_table(bot_label: str, trades: list[MockTrade]) -> None:
    print(f"\n  [{bot_label}] simulated trade log (PnL USD):")
    print(f"  {'ID':<8} {'PnL':>12}  {'Result':<8}")
    for t in trades:
        res = "LOSS" if t.is_loss else "WIN"
        print(f"  {t.trade_id:<8} {t.pnl_usd:>12.2f}  {res:<8}")


def run_gimmick_cycle(
    *,
    base_url: str,
    model: str,
    demo_trigger: bool,
    skip_ollama: bool,
) -> None:
    if demo_trigger:
        fake_bots = [
            ("BOT-CRYPTO-ALPHA (simulated)", mock_trades_demo_trigger()),
            ("BOT-FOREX-BETA (simulated)", mock_trades_no_trigger()),
        ]
    else:
        fake_bots = [
            ("BOT-CRYPTO-ALPHA (simulated)", mock_trades_no_trigger()),
            ("BOT-FOREX-BETA (simulated)", mock_trades_no_trigger()),
        ]

    print(BANNER)
    if not skip_ollama:
        ok = ollama_tags(base_url)
        print(f"[agent] Ollama reachable at {base_url}: {'yes' if ok else 'NO — check server'}")
        print(f"[agent] Model for analysis/fine-tune lines: {model}\n")
    else:
        print("[agent] --skip-ollama: will not call Ollama.\n")

    print("[agent] Status: monitoring loop (gimmick) - NOT wired to Redis, Mongo, or live bots.")
    print("[agent] Fine-tune UI would POST here (simulated only).\n")

    # Fake fine-tune acknowledgement (short Ollama call)
    if not skip_ollama:
        try:
            ack_prompt = (
                "Reply in one short sentence: acknowledge receipt of a hypothetical "
                "'bot fine-tune' request for a trading demo, no financial advice."
            )
            ack = ollama_generate(base_url, model, ack_prompt, timeout=60.0)
            print(f"[fine-tune / simulated] Ollama says: {ack}\n")
        except Exception as exc:
            print(f"[fine-tune / simulated] Ollama call failed (ok for offline test): {exc}\n")

    for label, trades in fake_bots:
        print("-" * 70)
        print(f"[agent] Checking {label} ...")
        print_trade_table(label, trades)

        if three_consecutive_losses(trades):
            print("\n  >>> Condition: **3 consecutive losses** DETECTED (would arm analysis / Ollama).")
            if skip_ollama:
                print("  >>> [GIMMICK] Skipped Ollama (--skip-ollama).")
                continue
            analysis_prompt = (
                "You are a demo assistant. The user saw three simulated losing trades in a row. "
                "In 2-3 sentences, say you could review market context (trend, volatility) — "
                "no specific trade advice, demo only."
            )
            try:
                text = ollama_generate(base_url, model, analysis_prompt, timeout=120.0)
                print("\n  --- Simulated 'market context' line (Ollama) ---")
                print(f"  {text}")
                print("  --- end ---\n")
            except Exception as exc:
                print(f"  [GIMMICK] Analysis call failed: {exc}\n")
        else:
            print(
                "\n  [GIMMICK] No three consecutive losses - agent stays idle "
                "(testing default: bot did NOT hit 3 losses in a row)."
            )
            print(
                "  Agent would say something like: "
                "\"I can analyze what happened in the market\" - NOT triggered this run.\n"
            )


def main() -> int:
    p = argparse.ArgumentParser(description="Gimmick Ollama demo — mock bots, real Ollama optional.")
    p.add_argument(
        "--demo-trigger",
        action="store_true",
        help="Use mock data with 3 consecutive losses so the analysis branch runs.",
    )
    p.add_argument("--ollama-url", default=DEFAULT_OLLAMA_URL, help="Ollama base URL")
    p.add_argument("--model", default=DEFAULT_MODEL, help="Ollama model name")
    p.add_argument(
        "--skip-ollama",
        action="store_true",
        help="Do not call Ollama (print flow only).",
    )
    args = p.parse_args()

    try:
        run_gimmick_cycle(
            base_url=args.ollama_url.rstrip("/"),
            model=args.model,
            demo_trigger=args.demo_trigger,
            skip_ollama=args.skip_ollama,
        )
    except KeyboardInterrupt:
        print("\n[agent] Interrupted.")
        return 130
    return 0


if __name__ == "__main__":
    sys.exit(main())
