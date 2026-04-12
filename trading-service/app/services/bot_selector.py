"""
Maps NLP parse result → bot type + parameters for automatic bot creation.

Parse result fields used:
  risk_level    : "low" | "medium" | "high"
  market        : ["forex"] | ["crypto"]  (crypto → crypto_low / crypto_medium / crypto_high)
  symbol        : defaults EURUSD (forex) or BTCUSDT (crypto) if omitted
  timeframe     : "1h" | "4h" etc.
  stop_loss_pips  : int (optional)
  take_profit_pips: int (optional)
"""
from app.utils.logger import get_logger

logger = get_logger()

FOREX_RISK_MAP: dict[str, str] = {
    "low": "low_risk",
    "conservative": "low_risk",
    "medium": "medium_risk",
    "moderate": "medium_risk",
    "high": "high_risk",
    "aggressive": "high_risk",
}

CRYPTO_RISK_MAP: dict[str, str] = {
    "low": "crypto_low",
    "conservative": "crypto_low",
    "medium": "crypto_medium",
    "moderate": "crypto_medium",
    "high": "crypto_high",
    "aggressive": "crypto_high",
}

DEFAULT_PARAMS: dict[str, dict] = {
    "low_risk": {
        "account_balance": 10000.0,
        "risk_per_trade_pct": 1.0,
        "max_wait_hours": 1.5,
    },
    "medium_risk": {
        "account_balance": 100_000.0,
        "risk_per_trade_pct": 1.0,
    },
    "high_risk": {
        "risk_pct": 2.0,
        "reward_ratio": 3.0,
        "max_wait_hours": 1.5,
    },
    "crypto_low": {
        "long_only": True,
        "rsi_low": 48,
        "rsi_high": 68,
        "stop_atr_mult": 2.0,
        "tp_atr_mult": 5.0,
        "risk_per_trade_usd": 10_000.0,
    },
    "crypto_medium": {
        "initial_balance": 100_000.0,
        "position_pct": 0.10,
        "max_ob_pct": 4.0,
        "pivot_len": 5,
    },
    "crypto_high": {
        "risk_per_trade_usd": 1000.0,
        "atr_stop_mult": 1.5,
        "atr_tp_mult": 3.0,
    },
}

DEFAULT_TIMEFRAME: dict[str, str] = {
    "forex": "1h",
    "crypto": "4h",
}


def select_bot(parse_result: dict) -> dict:
    """
    Convert NLP parse result to a BotCreate-compatible dict.

    Returns:
        { bot_type, symbol, market, timeframe, parameters }
    """
    risk_raw = (parse_result.get("risk_level") or "low").lower()

    markets = parse_result.get("market") or []
    if isinstance(markets, list):
        market = (markets[0] if markets else "forex").lower()
    else:
        market = str(markets or "forex").lower()

    if market == "crypto":
        bot_type = CRYPTO_RISK_MAP.get(risk_raw, "crypto_low")
    else:
        bot_type = FOREX_RISK_MAP.get(risk_raw, "low_risk")

    default_symbol = "BTCUSDT" if market == "crypto" else "EURUSD"
    symbol = (parse_result.get("symbol") or default_symbol).upper()
    timeframe = parse_result.get("timeframe") or DEFAULT_TIMEFRAME.get(market, "1h")

    params = dict(DEFAULT_PARAMS[bot_type])

    sl_pips = parse_result.get("stop_loss_pips")
    tp_pips = parse_result.get("take_profit_pips")
    if sl_pips and tp_pips and sl_pips > 0:
        params["reward_ratio"] = round(tp_pips / sl_pips, 2)

    logger.info(
        "bot selected from parse",
        risk_level=risk_raw,
        bot_type=bot_type,
        symbol=symbol,
        market=market,
        timeframe=timeframe,
    )

    return {
        "bot_type": bot_type,
        "symbol": symbol,
        "market": market,
        "timeframe": timeframe,
        "parameters": params,
    }
