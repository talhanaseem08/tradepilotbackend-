from app.bots.registry import create_bot
from app.schemas.backtest import BacktestRequest, BacktestResult
from app.utils.logger import get_logger

logger = get_logger()


async def run_backtest(request: BacktestRequest) -> BacktestResult:
    bot = create_bot(
        bot_type=request.bot_type,
        symbol=request.symbol,
        timeframe=request.timeframe,
        parameters=request.parameters,
    )

    if not request.candles or len(request.candles) < 30:
        return BacktestResult()

    trades = []
    position = None

    for i in range(30, len(request.candles)):
        window = request.candles[:i + 1]
        signal = bot.analyze(window)
        current_price = window[-1]["close"]

        if position is None and signal in ("buy", "sell"):
            sl = bot.calculate_stop_loss(current_price, signal)
            tp = bot.calculate_take_profit(current_price, signal)
            position = {
                "side": signal,
                "entry": current_price,
                "stop_loss": sl,
                "take_profit": tp,
            }

        elif position is not None:
            hit_sl = False
            hit_tp = False
            candle = window[-1]

            if position["side"] == "buy":
                if candle["low"] <= position["stop_loss"]:
                    hit_sl = True
                elif candle["high"] >= position["take_profit"]:
                    hit_tp = True
            else:
                if candle["high"] >= position["stop_loss"]:
                    hit_sl = True
                elif candle["low"] <= position["take_profit"]:
                    hit_tp = True

            if hit_sl or hit_tp:
                exit_price = position["stop_loss"] if hit_sl else position["take_profit"]
                if position["side"] == "buy":
                    pnl_pct = ((exit_price - position["entry"]) / position["entry"]) * 100
                else:
                    pnl_pct = ((position["entry"] - exit_price) / position["entry"]) * 100

                trades.append({"pnl_pct": round(pnl_pct, 4), "win": pnl_pct > 0})
                position = None

    if not trades:
        return BacktestResult()

    wins = [t for t in trades if t["win"]]
    losses = [t for t in trades if not t["win"]]
    total_pnl = sum(t["pnl_pct"] for t in trades)
    gross_profit = sum(t["pnl_pct"] for t in wins) if wins else 0
    gross_loss = abs(sum(t["pnl_pct"] for t in losses)) if losses else 0

    running_pnl = 0.0
    peak = 0.0
    max_dd = 0.0
    for t in trades:
        running_pnl += t["pnl_pct"]
        if running_pnl > peak:
            peak = running_pnl
        dd = peak - running_pnl
        if dd > max_dd:
            max_dd = dd

    return BacktestResult(
        total_trades=len(trades),
        winning_trades=len(wins),
        losing_trades=len(losses),
        win_rate=round(len(wins) / len(trades) * 100, 2),
        total_profit_pct=round(total_pnl, 2),
        max_drawdown_pct=round(max_dd, 2),
        sharpe_ratio=0.0,
        profit_factor=round(gross_profit / gross_loss, 2) if gross_loss > 0 else 0.0,
    )
