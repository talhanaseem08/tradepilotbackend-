from app.adapters.broker_adapter import BrokerAdapter
from app.adapters.ccxt_adapter import CCXTBrokerAdapter
from app.config.database import get_db
from app.core.agent_client import agent_client
from app.core.nlp_client import nlp_client
from app.models.trade_record import create_trade_record
from app.schemas.trade import TradeResult, TradeSignal
from app.utils.logger import get_logger

logger = get_logger()

_SPOT_QUOTES = ("USDT", "USDC", "BUSD", "BTC", "ETH", "USD")


def _trade_signal_copy(signal: TradeSignal, **updates) -> TradeSignal:
    if hasattr(signal, "model_copy"):
        return signal.model_copy(update=updates)
    return signal.copy(update=updates)


def _split_spot_symbol(symbol: str) -> tuple[str, str]:
    normalized = symbol.upper().replace("/", "")
    for quote in _SPOT_QUOTES:
        if normalized.endswith(quote):
            return normalized[: -len(quote)], quote
    raise ValueError(f"Unsupported spot symbol format: {symbol}")


async def _prepare_crypto_spot_signal(
    *,
    signal: TradeSignal,
    broker: BrokerAdapter,
    bot_id: str | None,
    user_id: str | None,
    market: str,
) -> TradeSignal | None:
    if market != "crypto" or not isinstance(broker, CCXTBrokerAdapter):
        return signal

    try:
        base_asset, quote_asset = _split_spot_symbol(signal.symbol)
        balances = await broker.get_spot_balances()
    except Exception as exc:
        logger.error(
            "spot balance pre-check failed",
            bot_id=bot_id,
            user_id=user_id,
            market=market,
            symbol=signal.symbol,
            action=signal.action,
            error=str(exc),
        )
        return None

    action = signal.action.lower()
    requested_qty = float(signal.quantity or 0)
    if requested_qty <= 0:
        logger.warning(
            "trade skipped - non-positive quantity",
            bot_id=bot_id,
            user_id=user_id,
            market=market,
            symbol=signal.symbol,
            action=signal.action,
            quantity=requested_qty,
        )
        return None

    if action == "sell":
        free_base = float(balances.get(base_asset, {}).get("free", 0) or 0)
        adjusted_qty = min(requested_qty, free_base)
        if adjusted_qty <= 0:
            logger.warning(
                "trade skipped - no spot inventory to sell",
                bot_id=bot_id,
                user_id=user_id,
                market=market,
                symbol=signal.symbol,
                action=signal.action,
                base_asset=base_asset,
                free_balance=free_base,
            )
            return None
        if adjusted_qty < requested_qty:
            logger.info(
                "spot sell quantity adjusted to available inventory",
                bot_id=bot_id,
                user_id=user_id,
                market=market,
                symbol=signal.symbol,
                requested_quantity=requested_qty,
                adjusted_quantity=adjusted_qty,
                base_asset=base_asset,
                free_balance=free_base,
            )
        return _trade_signal_copy(signal, quantity=adjusted_qty)

    if action == "buy":
        price = float(signal.price or 0)
        if price <= 0:
            logger.warning(
                "trade skipped - invalid buy price",
                bot_id=bot_id,
                user_id=user_id,
                market=market,
                symbol=signal.symbol,
                action=signal.action,
                price=price,
            )
            return None

        free_quote = float(balances.get(quote_asset, {}).get("free", 0) or 0)
        affordable_qty = (free_quote * 0.995) / price
        adjusted_qty = min(requested_qty, affordable_qty)
        if adjusted_qty <= 0:
            logger.warning(
                "trade skipped - insufficient quote balance for spot buy",
                bot_id=bot_id,
                user_id=user_id,
                market=market,
                symbol=signal.symbol,
                action=signal.action,
                quote_asset=quote_asset,
                free_balance=free_quote,
                requested_quantity=requested_qty,
                price=price,
            )
            return None
        if adjusted_qty < requested_qty:
            logger.info(
                "spot buy quantity adjusted to affordable amount",
                bot_id=bot_id,
                user_id=user_id,
                market=market,
                symbol=signal.symbol,
                requested_quantity=requested_qty,
                adjusted_quantity=adjusted_qty,
                quote_asset=quote_asset,
                free_balance=free_quote,
                price=price,
            )
        return _trade_signal_copy(signal, quantity=adjusted_qty)

    return signal


async def execute_with_sentiment_gate(
    signal: TradeSignal,
    broker: BrokerAdapter,
    market: str = "forex",
    bot_id: str | None = None,
    user_id: str | None = None,
) -> TradeResult | None:
    """Mandatory sentiment gate: no trade executes without sentiment check."""
    if market == "forex":
        guard = await agent_client.check_forex_trading_allowed(signal.symbol)
        if guard and not guard.get("allowed", True):
            logger.warning(
                "trade blocked by forex guard",
                bot_id=bot_id,
                user_id=user_id,
                market=market,
                symbol=signal.symbol,
                action=signal.action,
                reason=guard.get("reason"),
                blocked_until=guard.get("blocked_until"),
                matched_events=guard.get("matched_events", []),
            )
            return None

    logger.info(
        "sentiment gate check",
        bot_id=bot_id,
        user_id=user_id,
        market=market,
        symbol=signal.symbol,
        action=signal.action,
    )

    sentiment = await nlp_client.get_sentiment(signal.symbol, market)

    if sentiment is None:
        logger.error(
            "nlp service unreachable - BLOCKING trade",
            bot_id=bot_id,
            user_id=user_id,
            market=market,
            symbol=signal.symbol,
        )
        return None

    score = sentiment.get("sentiment_score", 0)
    label = sentiment.get("sentiment_label", "neutral")

    if signal.action == "buy" and label == "negative" and score < -0.3:
        logger.warning(
            "trade SKIPPED: buy signal but negative sentiment",
            bot_id=bot_id,
            user_id=user_id,
            market=market,
            symbol=signal.symbol,
            score=score,
        )
        return None

    if signal.action == "sell" and label == "positive" and score > 0.3:
        logger.warning(
            "trade SKIPPED: sell signal but positive sentiment",
            bot_id=bot_id,
            user_id=user_id,
            market=market,
            symbol=signal.symbol,
            score=score,
        )
        return None

    logger.info(
        "sentiment gate PASSED",
        bot_id=bot_id,
        user_id=user_id,
        market=market,
        symbol=signal.symbol,
        label=label,
        score=score,
    )

    signal = await _prepare_crypto_spot_signal(
        signal=signal,
        broker=broker,
        bot_id=bot_id,
        user_id=user_id,
        market=market,
    )
    if signal is None:
        return None

    order = await broker.place_order(
        symbol=signal.symbol,
        side=signal.action,
        quantity=signal.quantity,
        price=signal.price,
        stop_loss=signal.stop_loss,
        take_profit=signal.take_profit,
    )

    status = str(order.get("status", "") or "").lower()
    if (
        not order
        or order.get("error")
        or not order.get("order_id")
        or status in {"failed", "rejected", "canceled", "cancelled", "error"}
    ):
        logger.error(
            "broker order rejected - trade record not saved",
            bot_id=bot_id,
            user_id=user_id,
            market=market,
            symbol=signal.symbol,
            side=signal.action,
            status=status or "unknown",
            error=order.get("error"),
        )
        return None

    result = TradeResult(
        order_id=order.get("order_id"),
        symbol=signal.symbol,
        side=signal.action,
        entry_price=order.get("entry_price", signal.price),
        quantity=float(order.get("quantity", signal.quantity) or signal.quantity),
        status=order.get("status", "open"),
        sentiment_score=score,
        sentiment_label=label,
    )

    db = get_db()
    if db is not None and bot_id:
        record = create_trade_record(
            bot_id=bot_id,
            user_id=user_id,
            symbol=result.symbol,
            action=result.side,
            entry_price=result.entry_price,
            quantity=result.quantity,
            order_id=result.order_id,
            status=result.status,
            sentiment_score=result.sentiment_score,
            sentiment_label=result.sentiment_label,
            stop_loss=signal.stop_loss,
            take_profit=signal.take_profit,
            market=market,
        )
        await db.trade_records.insert_one(record)
        logger.info(
            "trade record saved",
            bot_id=bot_id,
            user_id=user_id,
            market=market,
            symbol=result.symbol,
            action=result.side,
            price=result.entry_price,
        )

    return result
