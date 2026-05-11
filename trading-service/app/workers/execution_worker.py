"""
Bot Execution Loop
------------------
Runs every N seconds (default 5 min).
For each active bot:
  1. Load latest params from Redis
  2. Fetch candles from data provider
  3. Call bot.analyze() → buy / sell / hold
  4. Cross-bot risk guard (max open trades, no duplicate symbol)
  5. Sentiment gate → trade execution
  6. Save TradeRecord, update consecutive-loss counter
"""

import asyncio
from app.config.database import get_db
from app.config.settings import settings
from app.core.redis_client import get_bot_params
from app.bots.registry import create_bot
from app.adapters.factory import create_broker, create_data_provider
from app.services.data_ingestion import get_cached_candles
from app.services.broker_credentials import get_user_broker_credentials
from app.services.cryptobots_runtime_adapter import (
    build_cryptobot_trade_signal,
    is_cryptobot_type,
    required_cryptobot_candle_count,
    supported_cryptobot_symbols,
)
from app.adapters.paper_adapter import PaperBrokerAdapter
from app.schemas.trade import TradeSignal
from app.services.trade_executor import execute_with_sentiment_gate
from app.utils.logger import get_logger

logger = get_logger()

# One paper broker instance per user — keeps balance state across cycles
_paper_brokers: dict[str, PaperBrokerAdapter] = {}
_worker_task: asyncio.Task | None = None


# ── Helpers ───────────────────────────────────────────────────────────────────

def _get_paper_broker(user_id: str) -> PaperBrokerAdapter:
    if user_id not in _paper_brokers:
        _paper_brokers[user_id] = PaperBrokerAdapter(
            initial_balance=settings.paper_initial_balance
        )
    return _paper_brokers[user_id]


def _cast(v: str):
    """Redis stores everything as strings — convert back to int/float."""
    try:
        return int(v) if "." not in v else float(v)
    except (ValueError, TypeError):
        return v


async def _cross_bot_risk_check(user_id: str | None, symbol: str) -> tuple[bool, str]:
    """
    Returns (allowed, reason).
    Blocks a new trade if:
      - user already has max open trades
      - user already has an open position on this exact symbol
    """
    if not user_id:
        return True, ""

    db = get_db()
    if db is None:
        return True, ""

    open_count = await db.trade_records.count_documents(
        {"userID": user_id, "status": "open"}
    )
    if open_count >= settings.max_open_trades_per_user:
        return False, f"max open trades ({settings.max_open_trades_per_user}) reached"

    duplicate = await db.trade_records.find_one(
        {"userID": user_id, "symbol": symbol.upper(), "status": "open"}
    )
    if duplicate:
        return False, f"open position already exists for {symbol}"

    return True, ""


# ── Single-bot execution ──────────────────────────────────────────────────────

async def _execute_bot(bot_doc: dict):
    bot_id      = bot_doc["botID"]
    user_id     = bot_doc.get("userID")
    symbol      = bot_doc["assetPair"]
    market      = bot_doc.get("market", "forex")
    timeframe   = bot_doc.get("timeframe", "1h")
    strategy    = bot_doc["strategyType"]

    # Always use latest params from Redis (agent may have optimized them)
    redis_raw = await get_bot_params(bot_id)
    parameters = (
        {k: _cast(v) for k, v in redis_raw.items()}
        if redis_raw
        else bot_doc.get("parameters", {})
    )

    broker_credentials = await get_user_broker_credentials(user_id, market)
    broker_mode = (settings.broker_mode or "broker").lower()

    if is_cryptobot_type(strategy):
        target_symbols = supported_cryptobot_symbols(strategy) or [symbol]
    else:
        target_symbols = [symbol]

    broker = None
    provider = None
    try:
        if broker_mode == "paper":
            broker = _get_paper_broker(user_id or bot_id)
        else:
            if not broker_credentials:
                logger.warning(
                    "trade skipped - no verified broker connected",
                    bot_id=bot_id,
                    user_id=user_id,
                    market=market,
                    broker_mode=broker_mode,
                )
                return
            broker = create_broker(market, broker_credentials)

        if is_cryptobot_type(strategy):
            provider = create_data_provider(market, broker_credentials)
            for target_symbol in target_symbols:
                candle_count = required_cryptobot_candle_count(strategy)
                candles = await get_cached_candles(target_symbol, timeframe, market)
                if not candles or len(candles) < candle_count:
                    candles = await provider.fetch_candles(target_symbol, timeframe, count=candle_count)
                if not candles:
                    logger.warning(
                        "no candles received",
                        bot_id=bot_id,
                        user_id=user_id,
                        strategy=strategy,
                        market=market,
                        symbol=target_symbol,
                    )
                    continue

                try:
                    signal = build_cryptobot_trade_signal(
                        bot_type=strategy,
                        symbol=target_symbol,
                        parameters=parameters,
                        candles=candles,
                    )
                except Exception as e:
                    logger.error(
                        "cryptobot runtime signal build failed",
                        bot_id=bot_id,
                        user_id=user_id,
                        strategy=strategy,
                        market=market,
                        symbol=target_symbol,
                        error=str(e),
                    )
                    continue
                if signal is None:
                    logger.info(
                        "cryptobot produced no trade signal",
                        bot_id=bot_id,
                        user_id=user_id,
                        strategy=strategy,
                        market=market,
                        symbol=target_symbol,
                    )
                    continue

                logger.info(
                    "cryptobot trade signal built",
                    bot_id=bot_id,
                    user_id=user_id,
                    strategy=strategy,
                    market=market,
                    symbol=target_symbol,
                    action=signal.action,
                    price=signal.price,
                    quantity=signal.quantity,
                    stop_loss=signal.stop_loss,
                    take_profit=signal.take_profit,
                )

                allowed, reason = await _cross_bot_risk_check(user_id, target_symbol)
                if not allowed:
                    logger.warning(
                        "trade blocked by risk guard",
                        bot_id=bot_id,
                        user_id=user_id,
                        strategy=strategy,
                        market=market,
                        symbol=target_symbol,
                        reason=reason,
                    )
                    continue

                result = await execute_with_sentiment_gate(
                    signal=signal,
                    broker=broker,
                    market=market,
                    bot_id=bot_id,
                    user_id=user_id,
                )
                if result is None:
                    logger.info(
                        "trade skipped (sentiment gate or broker error)",
                        bot_id=bot_id,
                        user_id=user_id,
                        strategy=strategy,
                        market=market,
                        symbol=target_symbol,
                    )
                    continue

                logger.info(
                    "trade executed",
                    bot_id=bot_id,
                    user_id=user_id,
                    strategy=strategy,
                    market=market,
                    symbol=target_symbol,
                    direction=signal.action,
                    price=signal.price,
                )
            return

        # Reconstruct non-crypto bot with latest parameters
        try:
            bot = create_bot(strategy, symbol, timeframe, parameters)
        except ValueError as e:
            logger.error("bot creation failed", bot_id=bot_id, error=str(e))
            return

        # Fetch latest candles — try cache first, fall back to live API
        candles = await get_cached_candles(symbol, timeframe, market)
        if not candles or len(candles) < 100:
            provider = create_data_provider(market, broker_credentials)
            candles = await provider.fetch_candles(symbol, timeframe, count=100)
        if not candles:
            logger.warning(
                "no candles received",
                bot_id=bot_id,
                user_id=user_id,
                strategy=strategy,
                market=market,
                symbol=symbol,
            )
            return

        # Re-run strategy analysis now that candles are loaded
        direction = bot.analyze(candles)
        if direction == "hold":
            return

        current_price = float(candles[-1].get("close", 0))
        signal = TradeSignal(
            action=direction,
            symbol=symbol,
            price=current_price,
            stop_loss=bot.calculate_stop_loss(current_price, direction),
            take_profit=bot.calculate_take_profit(current_price, direction),
            quantity=bot.calculate_position_size(balance=settings.paper_initial_balance),
        )

        allowed, reason = await _cross_bot_risk_check(user_id, symbol)
        if not allowed:
            logger.warning(
                "trade blocked by risk guard",
                bot_id=bot_id,
                user_id=user_id,
                strategy=strategy,
                market=market,
                symbol=symbol,
                reason=reason,
            )
            return

        result = await execute_with_sentiment_gate(
            signal=signal,
            broker=broker,
            market=market,
            bot_id=bot_id,
            user_id=user_id,
        )

        if result is None:
            logger.info(
                "trade skipped (sentiment gate or broker error)",
                bot_id=bot_id,
                user_id=user_id,
                strategy=strategy,
                market=market,
                symbol=symbol,
            )
            return

        logger.info(
            "trade executed",
            bot_id=bot_id,
            user_id=user_id,
            strategy=strategy,
            market=market,
            symbol=symbol,
            direction=signal.action,
            price=signal.price,
        )
    finally:
        if provider and hasattr(provider, "close"):
            await provider.close()
        if broker and hasattr(broker, "close"):
            await broker.close()


# ── Cycle + worker loop ───────────────────────────────────────────────────────

async def _run_cycle():
    db = get_db()
    if db is None:
        logger.warning("execution cycle skipped — db not connected")
        return

    active_bots = await db.bot_instances.find({"status": "active"}).to_list(None)

    if not active_bots:
        return

    logger.info("execution cycle started", active_bots=len(active_bots))

    # All bots run concurrently — no bot blocks another
    results = await asyncio.gather(
        *[_execute_bot(bot) for bot in active_bots],
        return_exceptions=True,
    )

    errors = [r for r in results if isinstance(r, Exception)]
    for e in errors:
        logger.error("bot execution error", error=str(e))

    logger.info("execution cycle complete",
                total=len(active_bots), errors=len(errors))


async def _worker_loop():
    while True:
        try:
            await _run_cycle()
        except asyncio.CancelledError:
            break
        except Exception as e:
            logger.error("execution cycle crashed", error=str(e))
        await asyncio.sleep(settings.execution_interval_seconds)


def start_execution_worker():
    global _worker_task
    _worker_task = asyncio.create_task(_worker_loop())
    logger.info("execution worker started",
                interval=settings.execution_interval_seconds)


def stop_execution_worker():
    global _worker_task
    if _worker_task:
        _worker_task.cancel()
        _worker_task = None
        logger.info("execution worker stopped")
