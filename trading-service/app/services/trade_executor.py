from app.core.nlp_client import nlp_client
from app.adapters.broker_adapter import BrokerAdapter
from app.schemas.trade import TradeSignal, TradeResult
from app.utils.logger import get_logger

logger = get_logger()


async def execute_with_sentiment_gate(
    signal: TradeSignal,
    broker: BrokerAdapter,
    market: str = "forex",
) -> TradeResult | None:
    """Mandatory sentiment gate: no trade executes without sentiment check."""

    logger.info("sentiment gate check", symbol=signal.symbol, action=signal.action)

    sentiment = await nlp_client.get_sentiment(signal.symbol, market)

    if sentiment is None:
        logger.error("nlp service unreachable - BLOCKING trade", symbol=signal.symbol)
        return None

    score = sentiment.get("sentiment_score", 0)
    label = sentiment.get("sentiment_label", "neutral")

    if signal.action == "buy" and label == "negative" and score < -0.3:
        logger.warning("trade SKIPPED: buy signal but negative sentiment",
                       symbol=signal.symbol, score=score)
        return None

    if signal.action == "sell" and label == "positive" and score > 0.3:
        logger.warning("trade SKIPPED: sell signal but positive sentiment",
                       symbol=signal.symbol, score=score)
        return None

    logger.info("sentiment gate PASSED", label=label, score=score)

    order = await broker.place_order(
        symbol=signal.symbol,
        side=signal.action,
        quantity=signal.quantity,
        price=signal.price,
        stop_loss=signal.stop_loss,
        take_profit=signal.take_profit,
    )

    return TradeResult(
        order_id=order.get("order_id"),
        symbol=signal.symbol,
        side=signal.action,
        entry_price=order.get("entry_price", signal.price),
        quantity=signal.quantity,
        status=order.get("status", "open"),
        sentiment_score=score,
        sentiment_label=label,
    )
