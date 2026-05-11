from __future__ import annotations

from datetime import date, datetime, time, timedelta
import re

import httpx

from app.config.settings import settings
from app.schemas.guard import ForexGuardRequest, ForexGuardResponse
from app.services.forex_guard_ai_service import build_forex_guard_ai_advisory
from app.utils.logger import get_logger

logger = get_logger()

_HOLIDAY_KEYWORDS = (
    "holiday",
    "bank holiday",
    "market closed",
    "market holiday",
    "public holiday",
    "observed",
)
_FOREX_NEWS_CLIENT = httpx.AsyncClient(base_url=settings.nlp_service_url, timeout=30.0)

_calendar_cache: dict[str, object] = {
    "fetched_at": None,
    "items": [],
}


def _extract_event_currency(title: str) -> str | None:
    match = re.match(r"\[(?P<currency>[A-Z]{3})\]\s+", title or "")
    if match:
        return match.group("currency")
    return None


def _symbol_relevant_codes(symbol: str) -> set[str]:
    normalized = (symbol or "").upper()
    if normalized == "UK100":
        return {"GBP"}
    if len(normalized) == 6 and normalized.isalpha():
        return {normalized[:3], normalized[3:]}
    return set()


def _parse_event_datetime(value: str | None) -> datetime | None:
    if not value:
        return None
    raw = value.strip()
    if not raw:
        return None
    try:
        parsed = datetime.fromisoformat(raw)
        return parsed if parsed.tzinfo is None else parsed.astimezone().replace(tzinfo=None)
    except ValueError:
        pass
    for fmt in ("%d/%m/%Y", "%Y-%m-%d"):
        try:
            return datetime.strptime(raw, fmt)
        except ValueError:
            continue
    return None


def _event_date(dt: datetime | None) -> date | None:
    if dt is None:
        return None
    return dt.date()


def _is_holiday_event(title: str) -> bool:
    lowered = (title or "").lower()
    return any(keyword in lowered for keyword in _HOLIDAY_KEYWORDS)


def _serialize_event(item: dict, event_dt: datetime | None) -> dict:
    return {
        "title": str(item.get("title", "") or ""),
        "impact": str(item.get("impact", "") or "").lower(),
        "currency": _extract_event_currency(str(item.get("title", "") or "")),
        "published_at": event_dt.isoformat() if event_dt else None,
    }


async def _fetch_forex_calendar_items() -> list[dict]:
    fetched_at = _calendar_cache.get("fetched_at")
    if isinstance(fetched_at, datetime):
        age = datetime.utcnow() - fetched_at
        if age.total_seconds() < settings.forex_guard_cache_seconds:
            cached_items = _calendar_cache.get("items")
            if isinstance(cached_items, list):
                return cached_items

    response = await _FOREX_NEWS_CLIENT.get("/news/forex-calendar")
    response.raise_for_status()
    payload = response.json()
    items = payload.get("items", []) if isinstance(payload, dict) else []
    _calendar_cache["fetched_at"] = datetime.utcnow()
    _calendar_cache["items"] = items
    return items


async def evaluate_forex_guard(request: ForexGuardRequest) -> ForexGuardResponse:
    if request.market.lower() != "forex":
        return ForexGuardResponse(allowed=True)

    now = _parse_event_datetime(request.current_time) if request.current_time else datetime.utcnow()
    if now is None:
        now = datetime.utcnow()

    try:
        items = await _fetch_forex_calendar_items()
    except Exception as exc:
        logger.error(
            "forex guard calendar fetch failed",
            symbol=request.symbol,
            error=str(exc),
        )
        # Fail open so bots are not deadlocked by the guard service.
        return ForexGuardResponse(allowed=True)

    relevant_codes = _symbol_relevant_codes(request.symbol)
    matched_news: list[str] = []
    matched_holidays: list[str] = []
    nearby_events: list[dict] = []

    for item in items:
        title = str(item.get("title", "") or "")
        if not title:
            continue

        currency = _extract_event_currency(title)
        if currency is None:
            continue

        event_dt = _parse_event_datetime(item.get("published_at"))
        impact = str(item.get("impact", "") or "").lower()
        if currency in relevant_codes and event_dt is not None:
            if now - timedelta(hours=6) <= event_dt <= now + timedelta(hours=12):
                nearby_events.append(_serialize_event(item, event_dt))

        if impact == "red" and event_dt is not None:
            block_from = event_dt - timedelta(minutes=settings.forex_news_pause_before_minutes)
            block_until = event_dt + timedelta(minutes=settings.forex_news_pause_after_minutes)
            if block_from <= now <= block_until:
                matched_news.append(title)

        if currency in relevant_codes and _is_holiday_event(title):
            holiday_date = _event_date(event_dt)
            if holiday_date == now.date():
                matched_holidays.append(title)

    if matched_news:
        latest_news_dt = max(
            (
                _parse_event_datetime(item.get("published_at"))
                for item in items
                if str(item.get("impact", "") or "").lower() == "red"
                and _parse_event_datetime(item.get("published_at")) is not None
                and str(item.get("title", "") or "") in matched_news
            ),
            default=None,
        )
        blocked_until = (
            latest_news_dt + timedelta(minutes=settings.forex_news_pause_after_minutes)
            if latest_news_dt is not None
            else None
        )
        response = ForexGuardResponse(
            allowed=False,
            reason="high-impact forex news pause",
            blocked_until=blocked_until.isoformat() if blocked_until else None,
            matched_events=matched_news,
        )
        if request.include_ai:
            response.assistant = await build_forex_guard_ai_advisory(
                symbol=request.symbol,
                current_time=now,
                hard_allowed=False,
                hard_reason=response.reason,
                hard_blocked_until=response.blocked_until,
                matched_events=response.matched_events,
                nearby_events=nearby_events,
            )
        return response

    if matched_holidays:
        blocked_until_dt = datetime.combine(now.date() + timedelta(days=1), time.min)
        response = ForexGuardResponse(
            allowed=False,
            reason="holiday trading pause",
            blocked_until=blocked_until_dt.isoformat(),
            matched_events=matched_holidays,
        )
        if request.include_ai:
            response.assistant = await build_forex_guard_ai_advisory(
                symbol=request.symbol,
                current_time=now,
                hard_allowed=False,
                hard_reason=response.reason,
                hard_blocked_until=response.blocked_until,
                matched_events=response.matched_events,
                nearby_events=nearby_events,
            )
        return response

    response = ForexGuardResponse(allowed=True)
    if request.include_ai:
        response.assistant = await build_forex_guard_ai_advisory(
            symbol=request.symbol,
            current_time=now,
            hard_allowed=True,
            hard_reason=None,
            hard_blocked_until=None,
            matched_events=[],
            nearby_events=nearby_events,
        )
    return response


async def close_forex_news_client():
    await _FOREX_NEWS_CLIENT.aclose()
