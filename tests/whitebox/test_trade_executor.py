"""
White-box unit tests — trade_executor.py (sentiment gate)

Covers:
- NLP unreachable → trade blocked
- Negative sentiment + buy signal → trade skipped
- Positive sentiment + sell signal → trade skipped
- Neutral sentiment → trade executes
- Matching sentiment direction → trade executes
- Sentiment score details stored in TradeResult
"""
import os
import sys
import pytest
from unittest.mock import AsyncMock, patch, MagicMock

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "trading-service"))

from app.schemas.trade import TradeSignal
from app.services.trade_executor import execute_with_sentiment_gate

BUY_SIGNAL = TradeSignal(action="buy", symbol="EURUSD", price=1.1050,
                          stop_loss=1.1000, take_profit=1.1150, quantity=1000.0)
SELL_SIGNAL = TradeSignal(action="sell", symbol="EURUSD", price=1.1050,
                           stop_loss=1.1100, take_profit=1.0950, quantity=1000.0)


def _mock_broker(order_id="ord_001", entry_price=1.1050):
    broker = AsyncMock()
    broker.place_order = AsyncMock(return_value={
        "order_id": order_id,
        "entry_price": entry_price,
        "status": "open",
    })
    return broker


# ── NLP unreachable ───────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_nlp_unreachable_blocks_trade():
    broker = _mock_broker()
    with patch("app.services.trade_executor.nlp_client.get_sentiment",
               new_callable=AsyncMock, return_value=None), \
         patch("app.services.trade_executor.get_db", return_value=None):

        result = await execute_with_sentiment_gate(BUY_SIGNAL, broker, "forex")
        assert result is None
        broker.place_order.assert_not_called()


# ── Sentiment gate — buy blocked ──────────────────────────────────────────────

@pytest.mark.asyncio
async def test_negative_sentiment_blocks_buy():
    broker = _mock_broker()
    sentiment = {"sentiment_score": -0.8, "sentiment_label": "negative"}
    with patch("app.services.trade_executor.nlp_client.get_sentiment",
               new_callable=AsyncMock, return_value=sentiment), \
         patch("app.services.trade_executor.get_db", return_value=None):

        result = await execute_with_sentiment_gate(BUY_SIGNAL, broker, "forex")
        assert result is None
        broker.place_order.assert_not_called()


@pytest.mark.asyncio
async def test_mildly_negative_sentiment_allows_buy():
    """Score -0.2 is above the -0.3 threshold — trade should proceed."""
    broker = _mock_broker()
    sentiment = {"sentiment_score": -0.2, "sentiment_label": "negative"}
    with patch("app.services.trade_executor.nlp_client.get_sentiment",
               new_callable=AsyncMock, return_value=sentiment), \
         patch("app.services.trade_executor.get_db", return_value=None):

        result = await execute_with_sentiment_gate(BUY_SIGNAL, broker, "forex")
        assert result is not None
        broker.place_order.assert_called_once()


# ── Sentiment gate — sell blocked ─────────────────────────────────────────────

@pytest.mark.asyncio
async def test_positive_sentiment_blocks_sell():
    broker = _mock_broker()
    sentiment = {"sentiment_score": 0.9, "sentiment_label": "positive"}
    with patch("app.services.trade_executor.nlp_client.get_sentiment",
               new_callable=AsyncMock, return_value=sentiment), \
         patch("app.services.trade_executor.get_db", return_value=None):

        result = await execute_with_sentiment_gate(SELL_SIGNAL, broker, "forex")
        assert result is None
        broker.place_order.assert_not_called()


# ── Neutral sentiment allows trade ────────────────────────────────────────────

@pytest.mark.asyncio
async def test_neutral_sentiment_allows_buy():
    broker = _mock_broker()
    sentiment = {"sentiment_score": 0.05, "sentiment_label": "neutral"}
    with patch("app.services.trade_executor.nlp_client.get_sentiment",
               new_callable=AsyncMock, return_value=sentiment), \
         patch("app.services.trade_executor.get_db", return_value=None):

        result = await execute_with_sentiment_gate(BUY_SIGNAL, broker, "forex")
        assert result is not None
        assert result.side == "buy"


@pytest.mark.asyncio
async def test_neutral_sentiment_allows_sell():
    broker = _mock_broker()
    sentiment = {"sentiment_score": 0.0, "sentiment_label": "neutral"}
    with patch("app.services.trade_executor.nlp_client.get_sentiment",
               new_callable=AsyncMock, return_value=sentiment), \
         patch("app.services.trade_executor.get_db", return_value=None):

        result = await execute_with_sentiment_gate(SELL_SIGNAL, broker, "forex")
        assert result is not None
        assert result.side == "sell"


# ── Sentiment stored in result ────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_sentiment_score_stored_in_result():
    broker = _mock_broker()
    sentiment = {"sentiment_score": 0.65, "sentiment_label": "positive"}
    with patch("app.services.trade_executor.nlp_client.get_sentiment",
               new_callable=AsyncMock, return_value=sentiment), \
         patch("app.services.trade_executor.get_db", return_value=None):

        result = await execute_with_sentiment_gate(BUY_SIGNAL, broker, "forex")
        assert result.sentiment_score == 0.65
        assert result.sentiment_label == "positive"


# ── Broker order details propagated ──────────────────────────────────────────

@pytest.mark.asyncio
async def test_trade_result_has_correct_symbol_and_side():
    broker = _mock_broker(order_id="test_ord", entry_price=1.1055)
    sentiment = {"sentiment_score": 0.1, "sentiment_label": "neutral"}
    with patch("app.services.trade_executor.nlp_client.get_sentiment",
               new_callable=AsyncMock, return_value=sentiment), \
         patch("app.services.trade_executor.get_db", return_value=None):

        result = await execute_with_sentiment_gate(BUY_SIGNAL, broker, "forex")
        assert result.symbol == "EURUSD"
        assert result.side == "buy"
        assert result.order_id == "test_ord"
        assert result.entry_price == 1.1055
        assert result.quantity == 1000.0
