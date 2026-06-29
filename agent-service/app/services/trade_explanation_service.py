from __future__ import annotations

import json
import asyncio
from datetime import datetime, timedelta
from typing import Any

from app.config.settings import settings
from app.core.ollama_client import ollama_client
from app.schemas.trade_explanation import (
    TradeExplanationRequest,
    TradeExplanationResponse,
)
from app.utils.logger import get_logger

logger = get_logger()

_explanation_cache: dict[str, tuple[datetime, TradeExplanationResponse]] = {}

_PROMPT_TEMPLATE = """You are TradePilot's crypto trade explanation assistant.
Explain one completed crypto spot trade for a beginner.

Rules:
- Use simple, professional language.
- Do not promise future profit.
- Do not say the bot is guaranteed to be correct.
- Explain the trade using only the provided facts.
- If some data is missing, say what can be understood from the available data.
- Return valid JSON only with this exact shape:
{{
  "summary": "<one short sentence>",
  "why_it_happened": "<2-4 short sentences explaining why the trade won or lost>",
  "lesson": "<one useful beginner-friendly takeaway>",
  "risk_note": "<one short risk note>",
  "confidence": <float between 0 and 1>
}}

Trade facts:
{trade_json}
"""


def _extract_json(text: str) -> dict[str, Any]:
    try:
        start = text.index("{")
        end = text.rindex("}") + 1
        parsed = json.loads(text[start:end])
        return parsed if isinstance(parsed, dict) else {}
    except Exception:
        logger.warning("trade explanation ai returned non-json", preview=text[:200])
        return {}


def _cache_key(request: TradeExplanationRequest) -> str:
    trade = request.trade
    return json.dumps(
        {
            "trade_id": trade.trade_id,
            "symbol": trade.symbol,
            "pnl": trade.pnl,
            "entry_price": trade.entry_price,
            "exit_price": trade.exit_price,
            "closed_at": trade.closed_at,
        },
        sort_keys=True,
    )


def _fallback_response(request: TradeExplanationRequest) -> TradeExplanationResponse:
    trade = request.trade
    pnl = trade.pnl or 0
    outcome = "profit" if pnl > 0 else "loss" if pnl < 0 else "flat result"
    direction = (trade.side or "trade").upper()
    return TradeExplanationResponse(
        summary=f"{trade.symbol} closed with a {outcome}.",
        why_it_happened=(
            f"The bot opened a {direction} trade and the final result was {pnl:.2f} USDT. "
            "The detailed AI explanation is not available right now, but the recorded entry, exit, "
            "and profit/loss show how the trade ended."
        ),
        lesson="Review individual trades as part of the full strategy performance, not as a single final judgment.",
        risk_note="Every bot can have winning and losing trades, so controlled risk matters more than one result.",
        confidence=0.45,
        generated_by="fallback",
    )


async def explain_trade(request: TradeExplanationRequest) -> TradeExplanationResponse:
    cache_key = _cache_key(request)
    cached = _explanation_cache.get(cache_key)
    if cached:
        cached_at, cached_value = cached
        if datetime.utcnow() - cached_at < timedelta(hours=6):
            return cached_value

    try:
        trade_payload = request.trade.model_dump(exclude_none=True)
    except AttributeError:
        trade_payload = request.trade.dict(exclude_none=True)
    trade_json = json.dumps(trade_payload, sort_keys=True)
    prompt = _PROMPT_TEMPLATE.format(trade_json=trade_json)

    try:
        logger.info(
            "calling trade explanation ai",
            symbol=request.trade.symbol,
            trade_id=request.trade.trade_id,
            model=settings.deepseek_model,
        )
        result = await asyncio.wait_for(
            ollama_client.generate(
                model=settings.deepseek_model,
                prompt=prompt,
                stream=False,
            ),
            timeout=25.0,
        )
        parsed = _extract_json(result.get("response", ""))
        if not parsed:
            return _fallback_response(request)

        confidence = float(parsed.get("confidence") or 0.0)
        confidence = max(0.0, min(confidence, 1.0))
        explanation = TradeExplanationResponse(
            summary=str(parsed.get("summary") or "This trade has been reviewed."),
            why_it_happened=str(parsed.get("why_it_happened") or "The available trade data was reviewed."),
            lesson=str(parsed.get("lesson") or "Review trades as part of the full strategy, not one result alone."),
            risk_note=str(parsed.get("risk_note") or "Trading results can vary, even when a bot follows its rules."),
            confidence=confidence,
        )
        _explanation_cache[cache_key] = (datetime.utcnow(), explanation)
        return explanation
    except Exception as exc:
        logger.error(
            "trade explanation ai failed",
            symbol=request.trade.symbol,
            trade_id=request.trade.trade_id,
            error=str(exc),
        )
        return _fallback_response(request)
