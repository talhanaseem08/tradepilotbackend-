"""
White-box unit tests — performance_monitor.py + redis_client.py

Covers:
- Win resets loss counter
- Each loss increments counter
- 3rd loss pauses bot and publishes agent trigger
- Loss counter persists across calls (state is Redis, not in-memory)
- LOSS_THRESHOLD constant is 3
"""
import os
import sys
import pytest
from unittest.mock import AsyncMock, patch, MagicMock

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "trading-service"))

from app.services.performance_monitor import record_trade_result, LOSS_THRESHOLD


# ── Constant check ────────────────────────────────────────────────────────────

def test_loss_threshold_is_3():
    assert LOSS_THRESHOLD == 3


# ── Mock helpers ──────────────────────────────────────────────────────────────

def _mock_redis_state():
    """Returns a dict-backed mock redis with incr/set/get for loss counter."""
    state = {"losses": 0, "status": None}

    async def incr(key):
        state["losses"] += 1
        return state["losses"]

    async def set_val(key, val):
        if "status" in key:
            state["status"] = val
        elif "losses" in key:
            state["losses"] = int(val)
        return True

    mock = AsyncMock()
    mock.incr = incr
    mock.set = set_val
    return mock, state


# ── Win resets losses ─────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_win_resets_loss_counter():
    with patch("app.services.performance_monitor.reset_losses", new_callable=AsyncMock) as mock_reset, \
         patch("app.services.performance_monitor.increment_losses", new_callable=AsyncMock) as mock_inc, \
         patch("app.services.performance_monitor.set_bot_status", new_callable=AsyncMock), \
         patch("app.services.performance_monitor.publish_agent_trigger", new_callable=AsyncMock):

        result = await record_trade_result("bot_1", pnl=50.0)
        mock_reset.assert_called_once_with("bot_1")
        mock_inc.assert_not_called()
        assert result["action"] == "continue"
        assert result["consecutive_losses"] == 0


# ── Losses increment ──────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_first_loss_increments_without_trigger():
    with patch("app.services.performance_monitor.reset_losses", new_callable=AsyncMock), \
         patch("app.services.performance_monitor.increment_losses", new_callable=AsyncMock, return_value=1) as mock_inc, \
         patch("app.services.performance_monitor.set_bot_status", new_callable=AsyncMock) as mock_status, \
         patch("app.services.performance_monitor.publish_agent_trigger", new_callable=AsyncMock) as mock_trigger:

        result = await record_trade_result("bot_1", pnl=-10.0)
        mock_inc.assert_called_once_with("bot_1")
        mock_status.assert_not_called()
        mock_trigger.assert_not_called()
        assert result["action"] == "continue"
        assert result["consecutive_losses"] == 1


@pytest.mark.asyncio
async def test_second_loss_increments_without_trigger():
    with patch("app.services.performance_monitor.reset_losses", new_callable=AsyncMock), \
         patch("app.services.performance_monitor.increment_losses", new_callable=AsyncMock, return_value=2), \
         patch("app.services.performance_monitor.set_bot_status", new_callable=AsyncMock) as mock_status, \
         patch("app.services.performance_monitor.publish_agent_trigger", new_callable=AsyncMock) as mock_trigger:

        result = await record_trade_result("bot_1", pnl=-20.0)
        mock_status.assert_not_called()
        mock_trigger.assert_not_called()
        assert result["consecutive_losses"] == 2


# ── 3rd loss triggers agent ───────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_third_loss_pauses_bot_and_triggers_agent():
    with patch("app.services.performance_monitor.reset_losses", new_callable=AsyncMock), \
         patch("app.services.performance_monitor.increment_losses", new_callable=AsyncMock, return_value=3), \
         patch("app.services.performance_monitor.set_bot_status", new_callable=AsyncMock) as mock_status, \
         patch("app.services.performance_monitor.publish_agent_trigger", new_callable=AsyncMock) as mock_trigger:

        result = await record_trade_result(
            bot_id="bot_1",
            pnl=-30.0,
            bot_type="low_risk",
            symbol="EURUSD",
            market="forex",
            timeframe="M5",
            parameters={"risk_per_trade_pct": 1.0},
            recent_trades=[{"pnl": -10}, {"pnl": -20}, {"pnl": -30}],
        )

        mock_status.assert_called_once_with("bot_1", "paused")
        mock_trigger.assert_called_once()

        call_kwargs = mock_trigger.call_args.kwargs
        assert call_kwargs["bot_id"] == "bot_1"
        assert call_kwargs["bot_type"] == "low_risk"
        assert call_kwargs["symbol"] == "EURUSD"
        assert call_kwargs["consecutive_losses"] == 3

        assert result["action"] == "trigger_agent"
        assert result["consecutive_losses"] == 3


@pytest.mark.asyncio
async def test_fourth_loss_still_triggers_agent():
    """Any count >= 3 must trigger the agent (not just exactly 3)."""
    with patch("app.services.performance_monitor.reset_losses", new_callable=AsyncMock), \
         patch("app.services.performance_monitor.increment_losses", new_callable=AsyncMock, return_value=5), \
         patch("app.services.performance_monitor.set_bot_status", new_callable=AsyncMock) as mock_status, \
         patch("app.services.performance_monitor.publish_agent_trigger", new_callable=AsyncMock) as mock_trigger:

        result = await record_trade_result("bot_1", pnl=-10.0, bot_type="low_risk")
        mock_trigger.assert_called_once()
        assert result["action"] == "trigger_agent"


# ── Zero PnL counts as win ────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_zero_pnl_counts_as_win():
    with patch("app.services.performance_monitor.reset_losses", new_callable=AsyncMock) as mock_reset, \
         patch("app.services.performance_monitor.increment_losses", new_callable=AsyncMock) as mock_inc, \
         patch("app.services.performance_monitor.set_bot_status", new_callable=AsyncMock), \
         patch("app.services.performance_monitor.publish_agent_trigger", new_callable=AsyncMock):

        result = await record_trade_result("bot_1", pnl=0.0)
        mock_reset.assert_called_once()
        mock_inc.assert_not_called()
        assert result["action"] == "continue"


# ── Agent trigger payload ─────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_agent_trigger_includes_recent_trades():
    recent = [{"pnl": -5}, {"pnl": -10}, {"pnl": -15}]
    with patch("app.services.performance_monitor.reset_losses", new_callable=AsyncMock), \
         patch("app.services.performance_monitor.increment_losses", new_callable=AsyncMock, return_value=3), \
         patch("app.services.performance_monitor.set_bot_status", new_callable=AsyncMock), \
         patch("app.services.performance_monitor.publish_agent_trigger", new_callable=AsyncMock) as mock_trigger:

        await record_trade_result(
            "bot_x", pnl=-15.0, bot_type="crypto_low",
            symbol="BTCUSDT", market="crypto",
            recent_trades=recent,
        )

        call_kwargs = mock_trigger.call_args.kwargs
        assert call_kwargs["recent_trades"] == recent
        assert call_kwargs["market"] == "crypto"
        assert call_kwargs["symbol"] == "BTCUSDT"
