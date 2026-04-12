from datetime import datetime, timezone


def create_trade_record(
    bot_id: str,
    user_id: str | None,
    symbol: str,
    action: str,
    entry_price: float,
    quantity: float,
    order_id: str | None = None,
    exit_price: float = 0.0,
    pnl: float = 0.0,
    status: str = "open",
    sentiment_score: float | None = None,
    sentiment_label: str | None = None,
    stop_loss: float | None = None,
    take_profit: float | None = None,
    market: str = "forex",
) -> dict:
    return {
        "botID": bot_id,
        "userID": user_id,
        "orderID": order_id,
        "symbol": symbol,
        "action": action,
        "entryPrice": entry_price,
        "exitPrice": exit_price,
        "volume": quantity,
        "pnl": pnl,
        "status": status,
        "sentimentScore": sentiment_score,
        "sentimentLabel": sentiment_label,
        "stopLoss": stop_loss,
        "takeProfit": take_profit,
        "market": market,
        "timestamp": datetime.now(timezone.utc),
    }
