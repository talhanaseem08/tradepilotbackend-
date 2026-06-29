"""
Maps NLP parse result → bot type + parameters for automatic bot creation.

Parse result fields used:
  risk_level    : "low" | "medium" | "high"
  market        : ["forex"] | ["crypto"]  (crypto → crypto_low / crypto_medium / crypto_high)
  symbol        : if omitted, defaults per bot (forex: low_risk→USDCHF, medium→EURUSD, high→USDCHF)
  timeframe     : "1h" | "4h" etc.
  stop_loss_pips  : int (optional)
  take_profit_pips: int (optional)

Forex symbols are normalized to what each bot supports (e.g. low_risk ORB only USDCHF; medium BOS only EURUSD).
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
        "position_pct_of_available_balance": 10.0,
        "risk_per_trade_pct": 10.0,
        "risk_per_trade_usd": 1000.0,
        "atr_stop_mult": 1.5,
        "atr_tp_mult": 3.0,
    },
}

DEFAULT_TIMEFRAME: dict[str, str] = {
    "forex": "1h",
    "crypto": "4h",
}

FOREX_DEFAULT_TIMEFRAME_BY_STRATEGY: dict[str, str] = {
    "medium_risk": "5m",
}

CRYPTO_DEFAULT_TIMEFRAME: dict[str, str] = {
    "crypto_low": "1d",
    "crypto_medium": "4h",
    "crypto_high": "1h",
}

# Each bot class only accepts certain symbols (see ALLOWED_SYMBOLS on bot classes).
_FOREX_SYMBOL_DEFAULTS: dict[str, str] = {
    "low_risk": "USDCHF",  # LowRiskOrbBot — ORB engine tuned for USDCHF
    "medium_risk": "EURUSD",  # MediumRiskBosBot — BOS on EURUSD
    "high_risk": "USDCHF",  # HighRiskOrbBot — USDCHF or UK100; default USDCHF
}


def _normalize_forex_symbol(bot_type: str, symbol: str) -> str:
    """
    Map NLP symbol to one the selected bot actually supports.
    Avoids ValueError e.g. LowRiskOrbBot only trades {USDCHF}, got EURUSD.
    """
    s = symbol.upper()
    if bot_type == "low_risk":
        if s not in {"USDCHF"}:
            logger.info(
                "forex symbol not supported by low_risk ORB; using USDCHF",
                requested=s,
            )
            return "USDCHF"
        return s
    if bot_type == "medium_risk":
        if s not in {"EURUSD"}:
            logger.info(
                "forex symbol not supported by medium_risk BOS; using EURUSD",
                requested=s,
            )
            return "EURUSD"
        return s
    if bot_type == "high_risk":
        if s not in {"USDCHF", "UK100"}:
            logger.info(
                "forex symbol not supported by high_risk ORB; using USDCHF",
                requested=s,
            )
            return "USDCHF"
        return s
    return s


def default_timeframe_for_bot(bot_type: str, market: str) -> str:
    if market == "crypto":
        return CRYPTO_DEFAULT_TIMEFRAME.get(bot_type, DEFAULT_TIMEFRAME["crypto"])
    return FOREX_DEFAULT_TIMEFRAME_BY_STRATEGY.get(
        bot_type,
        DEFAULT_TIMEFRAME.get(market, "1h"),
    )


def normalize_timeframe_for_bot(bot_type: str, market: str, timeframe: str | None) -> str:
    if market != "crypto" and bot_type in FOREX_DEFAULT_TIMEFRAME_BY_STRATEGY:
        return FOREX_DEFAULT_TIMEFRAME_BY_STRATEGY[bot_type]
    return timeframe or default_timeframe_for_bot(bot_type, market)


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

    if market == "crypto":
        default_symbol = "BTCUSDT"
    else:
        default_symbol = _FOREX_SYMBOL_DEFAULTS.get(bot_type, "EURUSD")
    symbol = (parse_result.get("symbol") or default_symbol).upper()
    if market != "crypto":
        symbol = _normalize_forex_symbol(bot_type, symbol)
    timeframe = parse_result.get("timeframe")
    if not timeframe:
        timeframe = default_timeframe_for_bot(bot_type, market)
    timeframe = normalize_timeframe_for_bot(bot_type, market, timeframe)

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
