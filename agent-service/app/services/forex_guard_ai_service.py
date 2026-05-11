from __future__ import annotations

import json
from datetime import datetime, timedelta
from typing import Any

from app.config.settings import settings
from app.core.ollama_client import ollama_client
from app.schemas.guard import ForexGuardAssistantResponse
from app.utils.logger import get_logger

logger = get_logger()

_ai_cache: dict[str, tuple[datetime, ForexGuardAssistantResponse]] = {}

_PROMPT_TEMPLATE = """You are TradePilot's forex risk assistant.
You do NOT override hard blocking rules. You only provide advisory analysis.

Return valid JSON only with this exact shape:
{{
  "summary": "<one short paragraph>",
  "pause_explanation": "<explain why the bot is paused or why trading is allowed>",
  "ambiguous_events": ["<titles of borderline events that may deserve monitoring>"],
  "suggested_action": "none|monitor|wider_pause",
  "suggested_pause_minutes": <integer>,
  "confidence": <float between 0 and 1>
}}

Guidelines:
- Keep "ambiguous_events" empty when nothing borderline stands out.
- Use "wider_pause" only when volatility or clustered events justify extra caution.
- If the hard guard already blocked trading, you may suggest a wider pause, but never claim the hard rule is wrong.
- Keep the output concise and operational.

Context:
symbol={symbol}
current_time={current_time}
hard_allowed={hard_allowed}
hard_reason={hard_reason}
hard_blocked_until={hard_blocked_until}
matched_events={matched_events}
nearby_events={nearby_events}
"""


def _extract_json(text: str) -> dict[str, Any]:
    try:
        start = text.index("{")
        end = text.rindex("}") + 1
        parsed = json.loads(text[start:end])
        return parsed if isinstance(parsed, dict) else {}
    except Exception:
        logger.warning("forex guard ai returned non-json", preview=text[:200])
        return {}


def _normalize_suggested_action(value: Any) -> str:
    normalized = str(value or "none").strip().lower()
    if normalized in {"none", "monitor", "wider_pause"}:
        return normalized
    return "none"


def _build_cache_key(
    symbol: str,
    current_time: datetime,
    hard_allowed: bool,
    hard_reason: str | None,
    matched_events: list[str],
    nearby_events: list[dict[str, Any]],
) -> str:
    bucket = current_time.replace(minute=(current_time.minute // 15) * 15, second=0, microsecond=0)
    nearby_titles = [str(item.get("title", "")) for item in nearby_events[:8]]
    return json.dumps(
        {
            "symbol": symbol,
            "bucket": bucket.isoformat(),
            "hard_allowed": hard_allowed,
            "hard_reason": hard_reason,
            "matched_events": matched_events[:8],
            "nearby_titles": nearby_titles,
        },
        sort_keys=True,
    )


async def build_forex_guard_ai_advisory(
    *,
    symbol: str,
    current_time: datetime,
    hard_allowed: bool,
    hard_reason: str | None,
    hard_blocked_until: str | None,
    matched_events: list[str],
    nearby_events: list[dict[str, Any]],
) -> ForexGuardAssistantResponse | None:
    cache_key = _build_cache_key(
        symbol=symbol,
        current_time=current_time,
        hard_allowed=hard_allowed,
        hard_reason=hard_reason,
        matched_events=matched_events,
        nearby_events=nearby_events,
    )
    cached = _ai_cache.get(cache_key)
    if cached:
        cached_at, cached_value = cached
        if datetime.utcnow() - cached_at < timedelta(seconds=settings.forex_guard_ai_cache_seconds):
            return cached_value

    prompt = _PROMPT_TEMPLATE.format(
        symbol=symbol,
        current_time=current_time.isoformat(),
        hard_allowed=hard_allowed,
        hard_reason=hard_reason or "none",
        hard_blocked_until=hard_blocked_until or "none",
        matched_events=json.dumps(matched_events[:10]),
        nearby_events=json.dumps(nearby_events[:12]),
    )

    try:
        logger.info("calling forex guard ai assistant", symbol=symbol, model=settings.deepseek_model)
        result = await ollama_client.generate(
            model=settings.deepseek_model,
            prompt=prompt,
            stream=False,
        )
        raw_text = result.get("response", "")
        parsed = _extract_json(raw_text)
        if not parsed:
            return None

        suggested_action = _normalize_suggested_action(parsed.get("suggested_action"))
        suggested_pause_minutes = max(0, int(parsed.get("suggested_pause_minutes") or 0))
        confidence = float(parsed.get("confidence") or 0.0)
        confidence = max(0.0, min(confidence, 1.0))

        suggested_block_until = None
        if suggested_action == "wider_pause" and suggested_pause_minutes > 0:
            suggested_block_until = (current_time + timedelta(minutes=suggested_pause_minutes)).isoformat()

        if hard_blocked_until and suggested_block_until:
            try:
                hard_dt = datetime.fromisoformat(hard_blocked_until)
                suggested_dt = datetime.fromisoformat(suggested_block_until)
                if suggested_dt <= hard_dt:
                    suggested_action = "none"
                    suggested_pause_minutes = 0
                    suggested_block_until = None
            except ValueError:
                pass

        advisory = ForexGuardAssistantResponse(
            summary=str(parsed.get("summary") or "No additional AI summary available."),
            pause_explanation=str(
                parsed.get("pause_explanation")
                or ("Hard pause is active." if not hard_allowed else "Trading is allowed under hard rules.")
            ),
            ambiguous_events=[
                str(item).strip()
                for item in (parsed.get("ambiguous_events") or [])
                if str(item).strip()
            ],
            suggested_action=suggested_action,
            suggested_pause_minutes=suggested_pause_minutes,
            suggested_block_until=suggested_block_until,
            confidence=confidence,
        )
        _ai_cache[cache_key] = (datetime.utcnow(), advisory)
        return advisory
    except Exception as exc:
        logger.error("forex guard ai assistant failed", symbol=symbol, error=str(exc))
        return None
