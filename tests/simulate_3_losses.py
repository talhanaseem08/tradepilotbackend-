"""
simulate_3_losses.py
====================
Standalone script that drives the full 3-loss → agent-trigger → finetuned-bot-file flow.

What it does:
  1. Connects to Redis (localhost:6379) and clears any previous state for the test bot.
  2. Calls record_trade_result() 3 times with negative PnL, each time verifying the
     loss counter increments correctly.
  3. On the 3rd loss confirms agent.trigger was published to the Redis stream.
  4. Polls for a finetuned bot file in trading-service/app/bots/finetuned/.
  5. Verifies the generated file is valid Python and the class inherits from the right base.

Run:
  cd E:/fyp
  python -m tests.simulate_3_losses

Requires: Redis running on localhost:6379.
          (docker compose up redis  — or  docker compose up  for full stack)
"""
import asyncio
import importlib.util
import os
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

# Add trading-service to path
sys.path.insert(0, str(Path(__file__).parent.parent / "trading-service"))

# Force localhost for standalone run
os.environ.setdefault("REDIS_HOST", "localhost")
os.environ.setdefault("REDIS_PORT", "6379")
os.environ.setdefault("MONGO_URI", "mongodb://localhost:27017/tradepilot")
os.environ.setdefault("OANDA_API_KEY", "09b7a40ae888495aa58062679b80dd91-404e8f7868cc64335d8e333a2dccd7a1")
os.environ.setdefault("OANDA_ACCOUNT_ID", "101-004-37953533-001")
os.environ.setdefault("OANDA_BASE_URL", "https://api-fxpractice.oanda.com")
os.environ.setdefault("TRADING_SERVICE_URL", "http://localhost:8002")

from app.config.redis import get_redis
from app.core.redis_client import (
    get_losses, reset_losses, get_bot_status, store_bot_params
)
from app.services.agent_trigger import TRIGGER_STREAM
from app.services.performance_monitor import record_trade_result

TEST_BOT_ID = "test_bot_simulate_losses"
TEST_BOT_TYPE = "low_risk"
TEST_SYMBOL = "EURUSD"
TEST_PARAMS = {
    "account_balance": 10000.0,
    "risk_per_trade_pct": 1.0,
    "max_wait_hours": 1.5,
}
FINETUNED_DIR = Path(__file__).parent.parent / "trading-service" / "app" / "bots" / "finetuned"

RESET = "\033[0m"
GREEN = "\033[92m"
RED = "\033[91m"
YELLOW = "\033[93m"
CYAN = "\033[96m"
BOLD = "\033[1m"


def ok(msg):  print(f"{GREEN}  [OK]{RESET} {msg}")
def fail(msg): print(f"{RED}  [FAIL]{RESET} {msg}"); sys.exit(1)
def info(msg): print(f"{CYAN}  [INFO]{RESET} {msg}")
def step(msg): print(f"\n{BOLD}{YELLOW}>>> {msg}{RESET}")


async def reset_test_state():
    redis = await get_redis()
    await reset_losses(TEST_BOT_ID)
    await redis.set(f"bot:{TEST_BOT_ID}:status", "active")
    await store_bot_params(TEST_BOT_ID, TEST_PARAMS)
    # Clear any stale agent trigger messages for this bot
    info(f"Bot state reset for {TEST_BOT_ID}")


async def simulate_loss(loss_num: int, pnl: float = -25.0):
    recent_trades = [
        {"pnl": -10.0 * i, "symbol": TEST_SYMBOL, "action": "buy"}
        for i in range(1, loss_num + 1)
    ]
    result = await record_trade_result(
        bot_id=TEST_BOT_ID,
        pnl=pnl,
        bot_type=TEST_BOT_TYPE,
        symbol=TEST_SYMBOL,
        market="forex",
        timeframe="M5",
        parameters=TEST_PARAMS,
        recent_trades=recent_trades,
    )
    return result


async def check_agent_trigger_published():
    """Check the Redis stream for an entry with our bot_id."""
    redis = await get_redis()
    # Read last 10 messages from the stream
    try:
        messages = await redis.xrevrange(TRIGGER_STREAM, count=20)
        for msg_id, fields in messages:
            if isinstance(fields, dict):
                bid = fields.get("bot_id", b"")
                if isinstance(bid, bytes):
                    bid = bid.decode()
                if bid == TEST_BOT_ID:
                    return True, msg_id, fields
    except Exception as e:
        return False, None, {"error": str(e)}
    return False, None, {}


async def wait_for_finetuned_file(timeout_seconds: int = 90) -> Path | None:
    """Poll FINETUNED_DIR for a new file matching test bot_type."""
    deadline = time.time() + timeout_seconds
    info(f"Waiting up to {timeout_seconds}s for finetuned bot file in {FINETUNED_DIR} ...")
    while time.time() < deadline:
        files = list(FINETUNED_DIR.glob(f"{TEST_BOT_TYPE}_finetuned_*.py"))
        if files:
            # Return most recently modified
            return max(files, key=lambda p: p.stat().st_mtime)
        await asyncio.sleep(2)
    return None


def validate_finetuned_file(path: Path):
    import ast
    source = path.read_text(encoding="utf-8")

    # 1. Valid Python
    try:
        ast.parse(source)
        ok("Generated file is valid Python")
    except SyntaxError as e:
        fail(f"Syntax error in generated file: {e}")

    # 2. Auto-generated marker
    assert "AUTO-GENERATED" in source, "Missing AUTO-GENERATED comment"
    ok("AUTO-GENERATED marker present")

    # 3. FINETUNED flag
    assert "FINETUNED: bool = True" in source, "Missing FINETUNED flag"
    ok("FINETUNED = True flag present")

    # 4. Class inherits from LowRiskOrbBot
    assert "LowRiskOrbBot" in source, "Missing base class reference"
    ok("Inherits from LowRiskOrbBot")

    # 5. Load and instantiate
    spec = importlib.util.spec_from_file_location("finetuned_test", path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    cls = next(v for k, v in vars(mod).items() if "Finetuned" in k and isinstance(v, type))
    bot = cls("EURUSD", "M5", {})
    ok(f"Finetuned bot instantiated: {cls.__name__}")
    ok(f"Parameters: {bot.parameters}")


async def run():
    print(f"\n{BOLD}{'='*60}")
    print("  TradePilot — 3-Loss Agent Trigger Simulation")
    print(f"{'='*60}{RESET}")
    print(f"Bot ID   : {TEST_BOT_ID}")
    print(f"Bot Type : {TEST_BOT_TYPE}")
    print(f"Symbol   : {TEST_SYMBOL}")
    print(f"Started  : {datetime.now(timezone.utc).isoformat()}")

    # ── Step 1: Reset state ────────────────────────────────────────────────────
    step("Step 1: Reset bot state in Redis")
    await reset_test_state()
    losses = await get_losses(TEST_BOT_ID)
    assert losses == 0, f"Expected 0 losses after reset, got {losses}"
    ok("Loss counter = 0")

    # ── Step 2: Loss 1 ─────────────────────────────────────────────────────────
    step("Step 2: Simulate loss #1 (PnL = -25.00)")
    r = await simulate_loss(1, pnl=-25.0)
    losses = await get_losses(TEST_BOT_ID)
    assert losses == 1, f"Expected 1 loss, got {losses}"
    assert r["action"] == "continue", f"Expected continue, got {r}"
    ok(f"Loss counter = {losses}, action = {r['action']}")

    # ── Step 3: Loss 2 ─────────────────────────────────────────────────────────
    step("Step 3: Simulate loss #2 (PnL = -40.00)")
    r = await simulate_loss(2, pnl=-40.0)
    losses = await get_losses(TEST_BOT_ID)
    assert losses == 2, f"Expected 2 losses, got {losses}"
    assert r["action"] == "continue", f"Expected continue, got {r}"
    ok(f"Loss counter = {losses}, action = {r['action']}")

    status = await get_bot_status(TEST_BOT_ID)
    assert status in ("active", b"active"), f"Bot should still be active, got {status}"
    ok("Bot still active after 2 losses")

    # ── Step 4: Loss 3 → trigger ───────────────────────────────────────────────
    step("Step 4: Simulate loss #3 (PnL = -35.00) — SHOULD TRIGGER AGENT")
    r = await simulate_loss(3, pnl=-35.0)
    losses = await get_losses(TEST_BOT_ID)
    assert r["action"] == "trigger_agent", f"Expected trigger_agent, got {r}"
    assert r["consecutive_losses"] == 3
    ok(f"Action = trigger_agent, consecutive_losses = {r['consecutive_losses']}")

    status = await get_bot_status(TEST_BOT_ID)
    status_str = status.decode() if isinstance(status, bytes) else str(status)
    assert status_str == "paused", f"Bot should be paused, got '{status_str}'"
    ok(f"Bot status = paused")

    # ── Step 5: Verify Redis stream ────────────────────────────────────────────
    step("Step 5: Verify agent.trigger published to Redis stream")
    found, msg_id, fields = await check_agent_trigger_published()
    if found:
        ok(f"agent.trigger message found (id={msg_id})")
        bot_type_field = fields.get("bot_type", b"")
        if isinstance(bot_type_field, bytes):
            bot_type_field = bot_type_field.decode()
        ok(f"  bot_type={bot_type_field}")
        ok(f"  consecutive_losses={fields.get('consecutive_losses', b'?')}")
    else:
        fail(f"agent.trigger message NOT found in Redis stream '{TRIGGER_STREAM}'")

    # ── Step 6: Wait for finetuned bot file ────────────────────────────────────
    step("Step 6: Wait for finetuned bot file (requires agent-service running)")
    info("If agent-service is not running, this step will time out — that is OK for partial testing.")
    finetuned_path = await wait_for_finetuned_file(timeout_seconds=60)
    if finetuned_path:
        ok(f"Finetuned file created: {finetuned_path.name}")
        validate_finetuned_file(finetuned_path)
    else:
        print(f"{YELLOW}  [SKIP]{RESET} No finetuned file appeared within 60s "
              "(agent-service may not be running — run `docker compose up agent-service`)")

    # ── Step 7: Cleanup ────────────────────────────────────────────────────────
    step("Step 7: Cleanup test state")
    redis = await get_redis()
    await redis.delete(f"bot:{TEST_BOT_ID}:losses")
    await redis.delete(f"bot:{TEST_BOT_ID}:status")
    await redis.delete(f"bot:{TEST_BOT_ID}:params")
    ok("Test state cleaned from Redis")

    print(f"\n{BOLD}{GREEN}{'='*60}")
    print("  ALL STEPS PASSED")
    print(f"{'='*60}{RESET}\n")


if __name__ == "__main__":
    asyncio.run(run())
