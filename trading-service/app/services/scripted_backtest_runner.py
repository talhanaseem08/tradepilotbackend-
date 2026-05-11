"""
HTTP entrypoint for the same logic as scripts/backtest_low_risk_usdchf.py,
backtest_medium_risk_bos.py, and backtest_high_risk_orb.py (OANDA range + run_backtest).
"""
from __future__ import annotations

import asyncio
from datetime import datetime, timedelta, timezone

from fastapi import HTTPException

from app.adapters.oanda_provider import OandaProvider
from app.config.backtest_defaults import BACKTEST_NOTIONAL_USD, BACKTEST_RISK_PCT
from app.config.settings import settings
from app.schemas.backtest import BacktestRequest, BacktestResult
from app.services.backtesting import run_backtest
from app.services.broker_credentials import get_user_broker_credentials
from app.services.cryptobots_backtest_adapter import run_cryptobots_script_backtest
from app.utils.logger import get_logger

logger = get_logger()

FOREX_SCRIPT_TYPES = frozenset({"low_risk", "medium_risk", "high_risk"})
CRYPTO_SCRIPT_TYPES = frozenset({"crypto_low", "crypto_medium", "crypto_high"})
SCRIPT_ALLOWED = FOREX_SCRIPT_TYPES | CRYPTO_SCRIPT_TYPES


def _merge_results(a: BacktestResult, b: BacktestResult) -> BacktestResult:
    """Combine two BacktestResult objects from different symbols into one."""
    total = a.total_trades + b.total_trades
    winning = a.winning_trades + b.winning_trades
    losing = a.losing_trades + b.losing_trades
    win_rate = round((winning / total * 100) if total > 0 else 0.0, 2)

    gross_profit = a.gross_profit_usd + b.gross_profit_usd
    gross_loss = a.gross_loss_usd + b.gross_loss_usd  # both already negative
    total_pnl = a.total_pnl_usd + b.total_pnl_usd

    abs_loss = abs(gross_loss)
    profit_factor = round(gross_profit / abs_loss, 4) if abs_loss > 0 else (999.0 if gross_profit > 0 else 0.0)

    # Re-number combined trade list by time order
    combined_trades = sorted(
        a.trades + b.trades,
        key=lambda t: t.entry_time,
    )
    for i, t in enumerate(combined_trades, start=1):
        t.trade_no = i

    return BacktestResult(
        total_trades=total,
        winning_trades=winning,
        losing_trades=losing,
        win_rate=win_rate,
        total_profit_pct=round(a.total_profit_pct + b.total_profit_pct, 4),
        total_pnl_usd=round(total_pnl, 4),
        gross_profit_usd=round(gross_profit, 4),
        gross_loss_usd=round(gross_loss, 4),
        max_drawdown_pct=round(max(a.max_drawdown_pct, b.max_drawdown_pct), 4),
        max_drawdown_usd=round(max(a.max_drawdown_usd, b.max_drawdown_usd), 4),
        sharpe_ratio=round((a.sharpe_ratio + b.sharpe_ratio) / 2, 4),
        profit_factor=profit_factor,
        profit_factor_usd=profit_factor,
        trades=combined_trades,
    )


async def run_script_style_backtest(
    bot_type: str,
    *,
    days: int = 30,
    symbol: str | None = None,
    user_id: str | None = None,
) -> BacktestResult:
    """
    Forex: fetch OANDA range candles, then `run_backtest` (same as `scripts/backtest_*`).

    Crypto: run packaged backtests under `app/bots/cryptobots/` (Binance OHLCV via ccxt).
    """
    if bot_type not in SCRIPT_ALLOWED:
        raise HTTPException(
            status_code=400,
            detail=f"bot_type must be one of {sorted(SCRIPT_ALLOWED)}",
        )
    if days < 1 or days > 365:
        raise HTTPException(status_code=400, detail="days must be 1–365")

    if bot_type in CRYPTO_SCRIPT_TYPES:
        result = await run_cryptobots_script_backtest(bot_type, days=days)
        logger.info(
            "cryptobots script backtest done",
            bot_type=bot_type,
            days=days,
            trades=result.total_trades,
        )
        return result

    credentials = await get_user_broker_credentials(user_id, "forex")
    has_fallback_oanda_key = bool((settings.oanda_api_key or "").strip())
    if credentials is None and not has_fallback_oanda_key:
        raise HTTPException(
            status_code=503,
            detail=(
                "No connected OANDA account found for this user, and OANDA_API_KEY is not set "
                "for script backtest fallback."
            ),
        )

    end = datetime.now(timezone.utc).date()
    start = end - timedelta(days=days)
    date_from = start.isoformat()
    date_to = end.isoformat()

    provider = OandaProvider(credentials)
    try:
        if bot_type == "low_risk":
            candles = await provider.fetch_candles_range(
                "USDCHF", "1m", date_from, date_to
            )
            if len(candles) < 31:
                raise HTTPException(
                    status_code=400,
                    detail=f"Not enough M1 candles for low_risk (got {len(candles)}, need ≥31).",
                )
            req = BacktestRequest(
                bot_type="low_risk",
                symbol="USDCHF",
                market="forex",
                timeframe="1m",
                parameters={
                    "account_balance": BACKTEST_NOTIONAL_USD,
                    "risk_per_trade_pct": BACKTEST_RISK_PCT,
                },
                candles=candles,
            )
        elif bot_type == "medium_risk":
            candles = await provider.fetch_candles_range(
                "EURUSD", "5m", date_from, date_to
            )
            if len(candles) < 31:
                raise HTTPException(
                    status_code=400,
                    detail=f"Not enough M5 candles for medium_risk (got {len(candles)}, need ≥31).",
                )
            req = BacktestRequest(
                bot_type="medium_risk",
                symbol="EURUSD",
                market="forex",
                timeframe="5m",
                parameters={
                    "account_balance": BACKTEST_NOTIONAL_USD,
                    "risk_per_trade_pct": BACKTEST_RISK_PCT,
                },
                candles=candles,
            )
        else:  # high_risk — always runs BOTH USDCHF and UK100, then merges
            candles_usdchf, candles_uk100 = await asyncio.gather(
                provider.fetch_candles_range("USDCHF", "1m", date_from, date_to),
                provider.fetch_candles_range("UK100",  "1m", date_from, date_to),
            )
            if len(candles_usdchf) < 31:
                raise HTTPException(
                    status_code=400,
                    detail=f"Not enough M1 candles for high_risk USDCHF (got {len(candles_usdchf)}, need ≥31).",
                )
            if len(candles_uk100) < 31:
                raise HTTPException(
                    status_code=400,
                    detail=f"Not enough M1 candles for high_risk UK100 (got {len(candles_uk100)}, need ≥31).",
                )

            params = {
                "account_balance": BACKTEST_NOTIONAL_USD,
                "risk_per_trade_pct": BACKTEST_RISK_PCT,
            }
            req_usdchf = BacktestRequest(
                bot_type="high_risk", symbol="USDCHF", market="forex",
                timeframe="1m", parameters=params, candles=candles_usdchf,
            )
            req_uk100 = BacktestRequest(
                bot_type="high_risk", symbol="UK100", market="indices",
                timeframe="1m", parameters=params, candles=candles_uk100,
            )
            result_usdchf, result_uk100 = await asyncio.gather(
                run_backtest(req_usdchf),
                run_backtest(req_uk100),
            )
            result = _merge_results(result_usdchf, result_uk100)
            logger.info(
                "script-style backtest done (high_risk dual-symbol)",
                bot_type="high_risk",
                days=days,
                usdchf_trades=result_usdchf.total_trades,
                uk100_trades=result_uk100.total_trades,
                total_trades=result.total_trades,
            )
            return result

        result = await run_backtest(req)
        logger.info(
            "script-style backtest done",
            bot_type=bot_type,
            days=days,
            trades=result.total_trades,
        )
        return result
    finally:
        if hasattr(provider, "close"):
            await provider.close()
