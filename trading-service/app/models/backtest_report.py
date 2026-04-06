from datetime import datetime, timezone


def create_backtest_report(
    bot_type: str,
    symbol: str,
    market: str,
    timeframe: str,
    parameters: dict,
    result: dict,
    candle_count: int,
) -> dict:
    return {
        "bot_type": bot_type,
        "symbol": symbol,
        "market": market,
        "timeframe": timeframe,
        "parameters": parameters,
        "result": result,
        "candle_count": candle_count,
        "created_at": datetime.now(timezone.utc),
    }
