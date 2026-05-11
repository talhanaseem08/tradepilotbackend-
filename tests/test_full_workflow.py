"""
test_full_workflow.py — End-to-end integration tests
=====================================================

Tests the complete TradePilot pipeline:
  1. OANDA candle fetch (real API)
  2. Prompt parsing via NLP service
  3. Bot creation and analysis
  4. Sentiment gate (mock NLP → allow trade)
  5. Trade execution via paper broker
  6. 3-loss → agent trigger chain
  7. Finetuned bot file generation via trading-service API

Run against the live stack:
  docker compose up
  cd E:/fyp
  python -m pytest tests/test_full_workflow.py -v --tb=short

Environment:
  OANDA_API_KEY, OANDA_ACCOUNT_ID in .env (already set)
  OLLAMA_REMOTE_URL=http://129.212.178.8:11434 (DeepSeek cloud)
"""
import asyncio
import os
import sys
import time
from pathlib import Path
from unittest.mock import AsyncMock, patch

import httpx
import pytest
from dotenv import load_dotenv

# ── Path setup ────────────────────────────────────────────────────────────────
ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(ROOT / "trading-service"))
sys.path.insert(0, str(ROOT / "agent-service"))

load_dotenv(ROOT / ".env")

os.environ.setdefault("REDIS_HOST", "localhost")
os.environ.setdefault("REDIS_PORT", "6379")
os.environ.setdefault("MONGO_URI", "mongodb://localhost:27017/tradepilot")
os.environ.setdefault("OANDA_BASE_URL", "https://api-fxpractice.oanda.com")
os.environ.setdefault("TRADING_SERVICE_URL", "http://localhost:8002")
os.environ.setdefault("NLP_SERVICE_URL", "http://localhost:8001")
os.environ.setdefault("OLLAMA_REMOTE_URL", "http://129.212.178.8:11434")

OANDA_KEY = os.getenv("OANDA_API_KEY", "")
OANDA_ACCOUNT = os.getenv("OANDA_ACCOUNT_ID", "")
OANDA_URL = os.getenv("OANDA_BASE_URL", "https://api-fxpractice.oanda.com")
OANDA_HEADERS = {
    "Authorization": f"Bearer {OANDA_KEY}",
    "Content-Type": "application/json",
}

requires_oanda = pytest.mark.skipif(not OANDA_KEY, reason="No OANDA_API_KEY")
requires_stack = pytest.mark.skipif(
    os.getenv("SKIP_STACK_TESTS") == "1",
    reason="Full stack not running"
)


# ═══════════════════════════════════════════════════════════════════════════════
# 1. OANDA API connectivity
# ═══════════════════════════════════════════════════════════════════════════════

class TestOandaConnectivity:
    @requires_oanda
    def test_account_reachable(self):
        url = f"{OANDA_URL}/v3/accounts/{OANDA_ACCOUNT}/summary"
        resp = httpx.get(url, headers=OANDA_HEADERS, timeout=15)
        assert resp.status_code == 200
        assert "account" in resp.json()

    @requires_oanda
    def test_eurusd_candles_fetch(self):
        url = f"{OANDA_URL}/v3/instruments/EUR_USD/candles"
        resp = httpx.get(url, headers=OANDA_HEADERS,
                         params={"granularity": "M5", "count": 50, "price": "MBA"},
                         timeout=15)
        assert resp.status_code == 200
        candles = resp.json().get("candles", [])
        assert len(candles) >= 10

    @requires_oanda
    def test_usdchf_candles_fetch(self):
        url = f"{OANDA_URL}/v3/instruments/USD_CHF/candles"
        resp = httpx.get(url, headers=OANDA_HEADERS,
                         params={"granularity": "M5", "count": 50, "price": "MBA"},
                         timeout=15)
        assert resp.status_code == 200

    @requires_oanda
    @pytest.mark.asyncio
    async def test_oanda_provider_returns_candles(self):
        from app.adapters.oanda_provider import OandaProvider
        provider = OandaProvider()
        candles = await provider.fetch_candles("EURUSD", "M5", count=30)
        assert len(candles) > 0
        assert "close" in candles[0] or "c" in candles[0]


# ═══════════════════════════════════════════════════════════════════════════════
# 2. Bot creation from parsed prompt
# ═══════════════════════════════════════════════════════════════════════════════

class TestBotCreationFromPrompt:
    """Simulate what happens after NLP parses 'create a low risk forex bot for EURUSD'."""

    def test_low_risk_bot_created_from_registry(self):
        from app.bots.registry import create_bot
        bot = create_bot("low_risk", "USDCHF", "M5", {})
        assert bot.symbol == "USDCHF"
        assert bot.__class__.__name__ == "LowRiskOrbBot"

    def test_medium_risk_bot_created(self):
        from app.bots.registry import create_bot
        bot = create_bot("medium_risk", "EURUSD", "M5", {})
        assert bot.symbol == "EURUSD"

    def test_high_risk_bot_created(self):
        from app.bots.registry import create_bot
        bot = create_bot("high_risk", "USDCHF", "M5", {})
        assert bot.symbol == "USDCHF"

    def test_crypto_bot_created(self):
        from app.bots.registry import create_bot
        bot = create_bot("crypto_low", "BTCUSDT", "1h", {})
        assert bot.symbol == "BTCUSDT"


# ═══════════════════════════════════════════════════════════════════════════════
# 3. Bot analysis on real OANDA candles
# ═══════════════════════════════════════════════════════════════════════════════

class TestBotAnalysisOnLiveCandles:
    @requires_oanda
    @pytest.mark.asyncio
    async def test_low_risk_bot_analyzes_live_eurusd(self):
        from app.adapters.oanda_provider import OandaProvider
        from app.bots.registry import create_bot

        provider = OandaProvider()
        candles = await provider.fetch_candles("EURUSD", "M5", count=100)
        assert len(candles) >= 50

        bot = create_bot("low_risk", "EURUSD", "M5", {})
        signal = bot.analyze(candles)
        assert signal in ("buy", "sell", "hold")
        print(f"\nLowRiskOrb on live EURUSD M5: signal={signal}")

    @requires_oanda
    @pytest.mark.asyncio
    async def test_medium_risk_bot_analyzes_live_eurusd(self):
        from app.adapters.oanda_provider import OandaProvider
        from app.bots.registry import create_bot

        provider = OandaProvider()
        candles = await provider.fetch_candles("EURUSD", "M5", count=100)

        bot = create_bot("medium_risk", "EURUSD", "M5", {})
        signal = bot.analyze(candles)
        assert signal in ("buy", "hold")
        print(f"\nMediumRiskBos on live EURUSD M5: signal={signal}")


# ═══════════════════════════════════════════════════════════════════════════════
# 4. Sentiment gate with mocked NLP
# ═══════════════════════════════════════════════════════════════════════════════

class TestSentimentGate:
    @pytest.mark.asyncio
    async def test_negative_blocks_buy(self):
        from app.schemas.trade import TradeSignal
        from app.services.trade_executor import execute_with_sentiment_gate
        from app.adapters.paper_adapter import PaperBrokerAdapter

        signal = TradeSignal(action="buy", symbol="EURUSD", price=1.105,
                             stop_loss=1.100, take_profit=1.115, quantity=1000.0)
        broker = PaperBrokerAdapter(initial_balance=10000.0)
        sentiment = {"sentiment_score": -0.9, "sentiment_label": "negative"}

        with patch("app.services.trade_executor.nlp_client.get_sentiment",
                   new_callable=AsyncMock, return_value=sentiment), \
             patch("app.services.trade_executor.get_db", return_value=None):
            result = await execute_with_sentiment_gate(signal, broker, "forex")

        assert result is None

    @pytest.mark.asyncio
    async def test_neutral_allows_buy(self):
        from app.schemas.trade import TradeSignal
        from app.services.trade_executor import execute_with_sentiment_gate
        from app.adapters.paper_adapter import PaperBrokerAdapter

        signal = TradeSignal(action="buy", symbol="EURUSD", price=1.105,
                             stop_loss=1.100, take_profit=1.115, quantity=1000.0)
        broker = PaperBrokerAdapter(initial_balance=10000.0)
        sentiment = {"sentiment_score": 0.1, "sentiment_label": "neutral"}

        with patch("app.services.trade_executor.nlp_client.get_sentiment",
                   new_callable=AsyncMock, return_value=sentiment), \
             patch("app.services.trade_executor.get_db", return_value=None):
            result = await execute_with_sentiment_gate(signal, broker, "forex")

        assert result is not None
        assert result.side == "buy"
        assert result.order_id is not None


# ═══════════════════════════════════════════════════════════════════════════════
# 5. Paper trade execution end-to-end
# ═══════════════════════════════════════════════════════════════════════════════

class TestPaperTradeExecution:
    @requires_oanda
    @pytest.mark.asyncio
    async def test_full_paper_trade_on_live_price(self):
        """Fetch live EURUSD price, run sentiment gate, place paper order."""
        from app.adapters.oanda_provider import OandaProvider
        from app.adapters.paper_adapter import PaperBrokerAdapter
        from app.bots.registry import create_bot
        from app.schemas.trade import TradeSignal
        from app.services.trade_executor import execute_with_sentiment_gate

        provider = OandaProvider()
        candles = await provider.fetch_candles("EURUSD", "M5", count=100)
        price = float(candles[-1].get("close", 1.1050))

        bot = create_bot("low_risk", "EURUSD", "M5", {})
        sl = bot.calculate_stop_loss(price, "buy")
        tp = bot.calculate_take_profit(price, "buy")

        signal = TradeSignal(action="buy", symbol="EURUSD",
                             price=price, stop_loss=sl, take_profit=tp, quantity=1000.0)
        broker = PaperBrokerAdapter(initial_balance=10000.0)
        sentiment = {"sentiment_score": 0.2, "sentiment_label": "neutral"}

        with patch("app.services.trade_executor.nlp_client.get_sentiment",
                   new_callable=AsyncMock, return_value=sentiment), \
             patch("app.services.trade_executor.get_db", return_value=None):
            result = await execute_with_sentiment_gate(signal, broker, "forex")

        assert result is not None
        assert result.symbol == "EURUSD"
        assert result.entry_price > 0
        print(f"\nPaper trade: entry={result.entry_price}, sl={sl:.5f}, tp={tp:.5f}")


# ═══════════════════════════════════════════════════════════════════════════════
# 6. 3-loss → agent trigger chain (in-process, mocked Redis)
# ═══════════════════════════════════════════════════════════════════════════════

class TestThreeLossChain:
    @pytest.mark.asyncio
    async def test_three_losses_trigger_agent(self):
        from app.services.performance_monitor import record_trade_result

        bot_id = "workflow_test_bot"
        call_count = {"n": 0}

        async def mock_increment(bid):
            call_count["n"] += 1
            return call_count["n"]

        with patch("app.services.performance_monitor.increment_losses",
                   side_effect=mock_increment), \
             patch("app.services.performance_monitor.reset_losses", new_callable=AsyncMock), \
             patch("app.services.performance_monitor.set_bot_status", new_callable=AsyncMock), \
             patch("app.services.performance_monitor.publish_agent_trigger",
                   new_callable=AsyncMock) as mock_pub:

            r1 = await record_trade_result(bot_id, pnl=-10.0, bot_type="low_risk")
            r2 = await record_trade_result(bot_id, pnl=-20.0, bot_type="low_risk")
            r3 = await record_trade_result(bot_id, pnl=-30.0, bot_type="low_risk")

        assert r1["action"] == "continue"
        assert r2["action"] == "continue"
        assert r3["action"] == "trigger_agent"
        assert r3["consecutive_losses"] == 3
        mock_pub.assert_called_once()


# ═══════════════════════════════════════════════════════════════════════════════
# 7. Finetuned bot file API (requires trading-service running on :8002)
# ═══════════════════════════════════════════════════════════════════════════════

class TestFinetuneEndpoint:
    @requires_stack
    def test_finetune_endpoint_creates_file(self):
        payload = {
            "bot_id": "workflow_test_bot",
            "bot_type": "low_risk",
            "old_parameters": {"risk_per_trade_pct": 1.0},
            "new_parameters": {"risk_per_trade_pct": 0.7, "max_wait_hours": 2.0},
            "reasoning": "Integration test - reducing risk after losses",
            "consecutive_losses": 3,
        }
        resp = httpx.post("http://localhost:8002/bots/finetune",
                          json=payload, timeout=15)
        assert resp.status_code == 200, f"Got {resp.status_code}: {resp.text}"
        data = resp.json()
        assert "file_path" in data
        file_path = Path(data["file_path"])
        assert file_path.exists()
        assert "low_risk" in file_path.name
        assert "finetuned" in file_path.name
        print(f"\nFinetuned file: {file_path}")
        # Cleanup
        file_path.unlink(missing_ok=True)

    @requires_stack
    def test_finetune_unknown_bot_type_returns_400(self):
        payload = {
            "bot_id": "test", "bot_type": "ghost_bot",
            "old_parameters": {}, "new_parameters": {},
            "reasoning": "test", "consecutive_losses": 3,
        }
        resp = httpx.post("http://localhost:8002/bots/finetune", json=payload, timeout=10)
        assert resp.status_code == 400


# ═══════════════════════════════════════════════════════════════════════════════
# 8. DeepSeek cloud connectivity
# ═══════════════════════════════════════════════════════════════════════════════

class TestDeepSeekCloud:
    DEEPSEEK_URL = "http://129.212.178.8:11434"

    def test_ollama_health_check(self):
        """Check Ollama API is reachable on the cloud server."""
        try:
            resp = httpx.get(f"{self.DEEPSEEK_URL}/api/tags", timeout=10)
            assert resp.status_code == 200, f"Ollama returned {resp.status_code}"
            models = resp.json().get("models", [])
            print(f"\nOllama models available: {[m.get('name') for m in models]}")
        except httpx.ConnectError:
            pytest.skip("DeepSeek cloud server not reachable (129.212.178.8:11434)")

    def test_deepseek_model_listed(self):
        """Verify deepseek-r1:70b or similar is available."""
        try:
            resp = httpx.get(f"{self.DEEPSEEK_URL}/api/tags", timeout=10)
            if resp.status_code != 200:
                pytest.skip("Ollama not reachable")
            models = resp.json().get("models", [])
            names = [m.get("name", "") for m in models]
            deepseek_models = [n for n in names if "deepseek" in n.lower()]
            assert len(deepseek_models) > 0, f"No deepseek model found. Available: {names}"
            print(f"\nDeepSeek models: {deepseek_models}")
        except httpx.ConnectError:
            pytest.skip("DeepSeek cloud server not reachable")
