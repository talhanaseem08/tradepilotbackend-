"""
USDCHF London 1m — Opening Range + Fib (ORB engine).

**Sessions use Pakistan time (Asia/Karachi, UTC+5).** Around late March the **local**
open time shifts (DST abroad); we model that with a Pakistan-calendar cutoff:

- **Before 2026-03-29:** ORB **1:00–1:05 PM**, trade **1:05–5:00 PM**
- **On/after 2026-03-29:** ORB **12:00–12:05 PM**, trade **12:05–4:00 PM** (same 4h length)

One trade per **Pakistan calendar day**.

Logic: breakout → retest → entry with stop at range mid. Risk R = |entry − range_mid|.
Take-profit is **2R**. State: Wait → Long_Break/Short_Break → Long_Retest/Short_Retest → Done.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date, datetime, timezone
from typing import Literal
from zoneinfo import ZoneInfo

Stage = Literal["Wait", "Long_Break", "Short_Break", "Long_Retest", "Short_Retest", "Done"]

# TP distance = TP_R_MULTIPLE × R, where R = |entry − stop| (stop = range mid). Fixed at 2R.
TP_R_MULTIPLE: float = 2.0

TZ_PK = ZoneInfo("Asia/Karachi")

# Pakistan date → session set: before = 1 PM open; on/after = 12 PM open (post ~29 Mar 2026).
SESSION_CUTOFF_PK_DATE = date(2026, 3, 29)
SessionProfile = Literal["before_cutoff", "after_cutoff"]


def session_profile_pk(dt: datetime) -> SessionProfile:
    """Which session schedule applies on this instant's Pakistan calendar date."""
    pk = dt.astimezone(TZ_PK).date()
    if pk < SESSION_CUTOFF_PK_DATE:
        return "before_cutoff"
    return "after_cutoff"


def _minutes_from_midnight_pk(dt: datetime) -> int:
    """Minutes from midnight on the Asia/Karachi clock (UTC+5)."""
    local = dt.astimezone(TZ_PK)
    return local.hour * 60 + local.minute


def in_range_session(dt: datetime) -> bool:
    """5m ORB: 1:00–1:05 PM before cutoff; 12:00–12:05 PM on/after cutoff (Pakistan)."""
    m = _minutes_from_midnight_pk(dt)
    if session_profile_pk(dt) == "before_cutoff":
        return 13 * 60 <= m < 13 * 60 + 5
    return 12 * 60 <= m < 12 * 60 + 5


def in_trade_session(dt: datetime) -> bool:
    """Trade window: 1:05–5:00 PM before cutoff; 12:05–4:00 PM after (Pakistan)."""
    m = _minutes_from_midnight_pk(dt)
    if session_profile_pk(dt) == "before_cutoff":
        return 13 * 60 + 5 <= m < 17 * 60
    return 12 * 60 + 5 <= m < 16 * 60


@dataclass
class RangeDayState:
    """State carried across 1m bars for one strategy day (Pakistan calendar)."""
    can_trade_today: bool = False
    stage: Stage = "Wait"
    range_high: float | None = None
    range_low: float | None = None
    range_mid: float | None = None
    breakout_bar: int = 0
    range_end_bar: int = 0
    range_end_time: datetime | None = None
    day_key: str | None = None


@dataclass
class StrategyConfig:
    risk_per_trade_usd: float = 1000.0
    reward_ratio: float = 2.0  # mirrors TP_R_MULTIPLE for callers; TP uses TP_R_MULTIPLE in process_bar
    max_wait_hours: float = 1.5


@dataclass
class Signal:
    side: Literal["long", "short"]
    entry: float
    stop: float
    take_profit: float
    units: int


@dataclass
class EngineState:
    bar_index: int = -1
    prev_in_range: bool = False
    day: RangeDayState = field(default_factory=RangeDayState)


def _day_key_pk(dt: datetime) -> str:
    """Pakistan calendar date — daily reset aligned with 1 PM ORB session."""
    return dt.astimezone(TZ_PK).date().isoformat()


def _minutes_since_range_end(now: datetime, range_end: datetime | None) -> float:
    if range_end is None:
        return float("inf")
    return (now - range_end).total_seconds() / 60.0


def _usd_risk_per_unit_usdchf(stop_distance: float, mid_price: float) -> float:
    """Approximate USD P/L per 1 unit USD_CHF for a stop-distance move (OANDA-style)."""
    if mid_price <= 0:
        return 0.0
    return abs(stop_distance) / mid_price


def compute_units_usd_risk(
    risk_usd: float,
    entry: float,
    stop: float,
    mid_for_conversion: float,
    min_units: int = 1000,
) -> int:
    """Position size from USD risk: qty ≈ risk / (rps * value_per_unit), Pine-compatible."""
    rps = abs(entry - stop)
    if rps <= 0:
        return 0
    per_unit = _usd_risk_per_unit_usdchf(rps, mid_for_conversion)
    if per_unit <= 0:
        return 0
    u = int(risk_usd / per_unit)
    u = max(u, min_units)
    return u


def process_bar(
    *,
    state: EngineState,
    candle_time: datetime,
    open_: float,
    high: float,
    low: float,
    close: float,
    mid_price_for_sizing: float,
    cfg: StrategyConfig,
    min_units: int = 1000,
) -> tuple[EngineState, Signal | None]:
    """
    Advance one 1m bar. Returns (new_state, signal_or_none).
    Candle time must be timezone-aware (UTC recommended).
    """
    ct = candle_time.astimezone(timezone.utc)
    dk = _day_key_pk(candle_time)

    if state.day.day_key != dk:
        state.day = RangeDayState()
        state.day.day_key = dk
        state.bar_index = -1
        state.prev_in_range = False

    state.bar_index += 1
    bi = state.bar_index
    d = state.day

    in_range = in_range_session(ct)
    in_trade = in_trade_session(ct)

    is_first_candle = in_range and not state.prev_in_range
    is_end_of_range = not in_range and state.prev_in_range

    if is_first_candle:
        d.can_trade_today = True
        d.stage = "Wait"
        d.range_high = high
        d.range_low = low
        d.breakout_bar = 0

    if in_range and d.range_high is not None and d.range_low is not None:
        d.range_high = max(d.range_high, high)
        d.range_low = min(d.range_low, low)
        d.range_mid = (d.range_high + d.range_low) / 2.0

    if is_end_of_range:
        d.range_end_bar = bi
        d.range_end_time = ct

    state.prev_in_range = in_range

    signal: Signal | None = None

    if not (in_trade and d.can_trade_today and d.range_high is not None and d.range_low is not None):
        return state, None

    rh, rl = d.range_high, d.range_low
    rm = d.range_mid
    assert rh is not None and rl is not None and rm is not None

    minutes_since_open = _minutes_since_range_end(ct, d.range_end_time)
    is_valid_entry_time = minutes_since_open <= (cfg.max_wait_hours * 60.0)

    if d.stage == "Wait":
        if close > rh:
            d.stage = "Long_Break"
            d.breakout_bar = bi
        elif close < rl:
            d.stage = "Short_Break"
            d.breakout_bar = bi

    if bi > d.breakout_bar:
        if d.stage == "Long_Break" and low <= rh:
            d.stage = "Long_Retest"
        if d.stage == "Short_Break" and high >= rl:
            d.stage = "Short_Retest"

    if d.stage == "Short_Retest" and close < rl:
        if is_valid_entry_time:
            rps = rm - close
            if rps > 0:
                tp = close - (rps * TP_R_MULTIPLE)
                units = compute_units_usd_risk(
                    cfg.risk_per_trade_usd, close, rm, mid_price_for_sizing, min_units
                )
                if units > 0:
                    signal = Signal(
                        side="short",
                        entry=close,
                        stop=rm,
                        take_profit=tp,
                        units=-abs(units),
                    )
        d.can_trade_today = False
        d.stage = "Done"

    elif d.stage == "Long_Retest" and close > rh:
        if is_valid_entry_time:
            rps = close - rm
            if rps > 0:
                tp = close + (rps * TP_R_MULTIPLE)
                units = compute_units_usd_risk(
                    cfg.risk_per_trade_usd, close, rm, mid_price_for_sizing, min_units
                )
                if units > 0:
                    signal = Signal(
                        side="long",
                        entry=close,
                        stop=rm,
                        take_profit=tp,
                        units=abs(units),
                    )
        d.can_trade_today = False
        d.stage = "Done"

    return state, signal


def candles_to_bars(candles: list[dict]) -> list[tuple[datetime, float, float, float, float]]:
    """Parse OANDA candle list to (time, O, H, L, C)."""
    out: list[tuple[datetime, float, float, float, float]] = []
    for c in candles:
        if c.get("complete") is False:
            continue
        t = candle_time_from_dict(c)
        if t is None:
            continue
        mid = c["mid"]
        o, h, low, cl = float(mid["o"]), float(mid["h"]), float(mid["l"]), float(mid["c"])
        out.append((t, o, h, low, cl))
    return out


def candle_time_from_dict(c: dict) -> datetime | None:
    """Parse OANDA `time` string to UTC datetime."""
    raw = c.get("time")
    if not raw:
        return None
    s = str(raw).replace("Z", "+00:00")
    try:
        return datetime.fromisoformat(s).astimezone(timezone.utc)
    except ValueError:
        return None
