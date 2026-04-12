from datetime import datetime, timezone, timedelta

from app.bots.registry import create_bot
from app.config.backtest_defaults import BACKTEST_NOTIONAL_USD, BACKTEST_RISK_PCT
from app.schemas.backtest import BacktestRequest, BacktestResult, TradeRecord
from app.utils.logger import get_logger

logger = get_logger()

UTC5 = timezone(timedelta(hours=5))


def _fmt(ts: str) -> str:
    """Parse ISO timestamp → 12h UTC+5 string e.g. 'Mar 15, 2026 02:00 PM'."""
    if not ts:
        return ""
    try:
        dt = datetime.fromisoformat(ts.replace("Z", "+00:00")).astimezone(UTC5)
        return dt.strftime("%b %d, %Y %I:%M %p")
    except Exception:
        return ts


def _risk_usd_for_bot(bot) -> float:
    """Dollar risk at stop: bot `_risk_usd()`, OR balance × risk %, OR legacy `fixed_dollar_risk`."""
    fn = getattr(bot, "_risk_usd", None)
    if callable(fn):
        return max(0.0, float(fn()))
    p = bot.parameters
    if p.get("account_balance") is not None and p.get("risk_per_trade_pct") is not None:
        return float(p["account_balance"]) * float(p["risk_per_trade_pct"]) / 100.0
    if p.get("fixed_dollar_risk") is not None:
        return float(p["fixed_dollar_risk"])
    return float(p.get("risk_per_trade_usd", 1000.0))


def _pnl_usd_linear(position: dict, hit_tp: bool, risk_usd: float) -> float:
    """
    $ P&L if `risk_usd` is lost when price reaches stop, and scaled for TP distance at take-profit.
    Uses entry / SL / TP so reward:risk matches the strategy (e.g. 1.5R → +1.5 × risk_usd at TP).
    """
    if not hit_tp:
        return -round(risk_usd, 2)

    e = float(position["entry"])
    sl = float(position["stop_loss"])
    tp = float(position["take_profit"])
    side = position["side"]

    if side == "buy":
        r_dist = abs(e - sl)
        reward_dist = abs(tp - e)
    else:
        r_dist = abs(sl - e)
        reward_dist = abs(e - tp)

    if r_dist <= 1e-12:
        return 0.0
    return round(risk_usd * (reward_dist / r_dist), 2)


def _position_from_signal(
    bot, signal: str, current_price: float, current_ts: str
) -> dict:
    """
    Prefer bot signal prices (entry open + SL/TP) so R-multiples and USD P&L match the strategy.
    Falls back to close + calculate_* when no details (e.g. ORB bots).
    """
    details_fn = getattr(bot, "get_signal_details", None)
    if callable(details_fn):
        d = details_fn()
        if d:
            ent = d.get("entry_price")
            if ent is None:
                ent = d.get("entry")
            sl = d.get("stop_loss")
            if sl is None:
                sl = d.get("stop")
            tp = d.get("take_profit")
            if ent is not None and sl is not None and tp is not None:
                return {
                    "side": signal,
                    "entry": float(ent),
                    "entry_ts": current_ts,
                    "stop_loss": float(sl),
                    "take_profit": float(tp),
                }
    sl = bot.calculate_stop_loss(current_price, signal)
    tp = bot.calculate_take_profit(current_price, signal)
    return {
        "side": signal,
        "entry": current_price,
        "entry_ts": current_ts,
        "stop_loss": sl,
        "take_profit": tp,
    }


async def run_backtest(request: BacktestRequest) -> BacktestResult:
    params = dict(request.parameters or {})
    if request.bot_type in ("low_risk", "medium_risk", "high_risk"):
        params.setdefault("account_balance", BACKTEST_NOTIONAL_USD)
        params.setdefault("risk_per_trade_pct", BACKTEST_RISK_PCT)
    bot = create_bot(
        bot_type=request.bot_type,
        symbol=request.symbol,
        timeframe=request.timeframe,
        parameters=params,
    )

    if not request.candles or len(request.candles) < 30:
        return BacktestResult()

    risk_usd = _risk_usd_for_bot(bot)

    trade_records: list[TradeRecord] = []
    position = None
    trade_no = 0

    step_fn = getattr(bot, "step", None)
    if callable(step_fn):
        bot.reset_state()
        for j in range(30):
            step_fn(request.candles[j])

    for i in range(30, len(request.candles)):
        if callable(step_fn):
            signal = step_fn(request.candles[i])
            candle = request.candles[i]
        else:
            window = request.candles[: i + 1]
            signal = bot.analyze(window)
            candle = window[-1]
        current_price = float(candle["close"])
        current_ts = candle.get("timestamp", "")

        if position is None and signal in ("buy", "sell"):
            position = _position_from_signal(bot, signal, current_price, current_ts)

        elif position is not None:
            hit_sl = False
            hit_tp = False

            if position["side"] == "buy":
                if float(candle["low"]) <= position["stop_loss"]:
                    hit_sl = True
                elif float(candle["high"]) >= position["take_profit"]:
                    hit_tp = True
            else:
                if float(candle["high"]) >= position["stop_loss"]:
                    hit_sl = True
                elif float(candle["low"]) <= position["take_profit"]:
                    hit_tp = True

            if hit_sl or hit_tp:
                exit_price = position["stop_loss"] if hit_sl else position["take_profit"]
                if position["side"] == "buy":
                    pnl_pct = ((exit_price - position["entry"]) / position["entry"]) * 100
                else:
                    pnl_pct = ((position["entry"] - exit_price) / position["entry"]) * 100

                pnl_usd = _pnl_usd_linear(position, hit_tp=not hit_sl, risk_usd=risk_usd)

                trade_no += 1
                trade_records.append(TradeRecord(
                    trade_no=trade_no,
                    side=position["side"].upper(),
                    entry_time=_fmt(position["entry_ts"]),
                    exit_time=_fmt(current_ts),
                    entry_price=round(position["entry"], 5),
                    exit_price=round(exit_price, 5),
                    stop_loss=round(position["stop_loss"], 5),
                    take_profit=round(position["take_profit"], 5),
                    pnl_pct=round(pnl_pct, 4),
                    pnl_usd=pnl_usd,
                    result="WIN" if hit_tp else "LOSS",
                ))
                position = None

    if not trade_records:
        return BacktestResult()

    wins   = [t for t in trade_records if t.result == "WIN"]
    losses = [t for t in trade_records if t.result == "LOSS"]
    total_pnl    = sum(t.pnl_pct for t in trade_records)
    gross_profit = sum(t.pnl_pct for t in wins)
    gross_loss   = abs(sum(t.pnl_pct for t in losses))

    total_pnl_usd = sum(t.pnl_usd for t in trade_records)
    gross_profit_usd = sum(t.pnl_usd for t in wins)
    gross_loss_usd = abs(sum(t.pnl_usd for t in losses))

    running = 0.0
    peak    = 0.0
    max_dd  = 0.0
    for t in trade_records:
        running += t.pnl_pct
        if running > peak:
            peak = running
        dd = peak - running
        if dd > max_dd:
            max_dd = dd

    run_usd = 0.0
    peak_usd = 0.0
    max_dd_usd = 0.0
    for t in trade_records:
        run_usd += t.pnl_usd
        if run_usd > peak_usd:
            peak_usd = run_usd
        dd_u = peak_usd - run_usd
        if dd_u > max_dd_usd:
            max_dd_usd = dd_u

    return BacktestResult(
        total_trades=len(trade_records),
        winning_trades=len(wins),
        losing_trades=len(losses),
        win_rate=round(len(wins) / len(trade_records) * 100, 2),
        total_profit_pct=round(total_pnl, 2),
        total_pnl_usd=round(total_pnl_usd, 2),
        gross_profit_usd=round(gross_profit_usd, 2),
        gross_loss_usd=round(gross_loss_usd, 2),
        max_drawdown_pct=round(max_dd, 2),
        max_drawdown_usd=round(max_dd_usd, 2),
        sharpe_ratio=0.0,
        profit_factor=round(gross_profit / gross_loss, 2) if gross_loss > 0 else 0.0,
        profit_factor_usd=round(gross_profit_usd / gross_loss_usd, 2) if gross_loss_usd > 0 else 0.0,
        trades=trade_records,
    )
