import httpx
from datetime import datetime, timedelta, timezone
from fastapi import HTTPException
from app.adapters.data_provider import DataProvider
from app.config.settings import settings
from app.core.circuit_breaker import oanda_breaker
from app.services.broker_credentials import UserBrokerCredentials
from app.utils.retry import with_retry
from app.utils.logger import get_logger

logger = get_logger()

TIMEFRAME_MAP = {
    "1m": "M1", "5m": "M5", "15m": "M15", "30m": "M30",
    "1h": "H1", "4h": "H4", "1d": "D", "1w": "W",
}

# OANDA returns at most 5000 candles per request — chunk long ranges.
_GRANULARITY_MINUTES = {
    "M1": 1,
    "M5": 5,
    "M15": 15,
    "M30": 30,
    "H1": 60,
    "H4": 240,
    "D": 1440,
    "W": 10080,
}


def _parse_rfc3339_utc(s: str) -> datetime:
    t = s.replace("Z", "+00:00")
    return datetime.fromisoformat(t).astimezone(timezone.utc)


def _fmt_rfc3339(dt: datetime) -> str:
    return dt.astimezone(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


class OandaProvider(DataProvider):
    def __init__(self, credentials: UserBrokerCredentials | None = None):
        self.api_key = credentials.api_key if credentials else settings.oanda_api_key
        self.base_url = (
            credentials.oanda_base_url if credentials else settings.oanda_base_url
        )
        self.account_id = credentials.account_id if credentials else settings.oanda_account_id
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

    async def fetch_candles(self, symbol: str, timeframe: str, count: int = 100) -> list[dict]:
        if not (self.api_key or "").strip():
            raise HTTPException(
                status_code=503,
                detail=(
                    "OANDA credentials are not available. Connect your OANDA broker account "
                    "from the frontend or configure fallback service credentials."
                ),
            )

        instrument = self._format_symbol(symbol)
        granularity = TIMEFRAME_MAP.get(timeframe, "H1")

        url = f"{self.base_url}/v3/instruments/{instrument}/candles"
        params = {
            "granularity": granularity,
            "count": count,
            "price": "MBA",
        }

        async def _fetch():
            async with httpx.AsyncClient(timeout=15.0) as client:
                resp = await client.get(url, headers=self.headers, params=params)
                resp.raise_for_status()
                return resp.json()

        try:
            data = await oanda_breaker.call(with_retry, _fetch, retries=3, delay=1.0, label=f"oanda_candles:{instrument}")

            candles = []
            for c in data.get("candles", []):
                if not c.get("complete", False):
                    continue
                mid = c.get("mid", {})
                candles.append({
                    "open": float(mid.get("o", 0)),
                    "high": float(mid.get("h", 0)),
                    "low": float(mid.get("l", 0)),
                    "close": float(mid.get("c", 0)),
                    "volume": int(c.get("volume", 0)),
                    "timestamp": c.get("time", ""),
                })

            logger.info("oanda candles fetched", symbol=instrument,
                        timeframe=granularity, count=len(candles))
            return candles

        except HTTPException:
            raise
        except Exception as e:
            logger.error("oanda fetch failed after retries", error=str(e), symbol=symbol)
            hint = (
                " Check OANDA_API_KEY (practice token needs OANDA_BASE_URL=api-fxpractice.oanda.com), "
                "OANDA_ACCOUNT_ID, and that the instrument exists on OANDA."
            )
            raise HTTPException(
                status_code=502,
                detail=f"OANDA request failed: {e!s}.{hint}",
            ) from e

    def _candles_from_response(self, data: dict) -> list[dict]:
        candles = []
        for c in data.get("candles", []):
            if not c.get("complete", False):
                continue
            mid = c.get("mid", {})
            candles.append({
                "open":      float(mid.get("o", 0)),
                "high":      float(mid.get("h", 0)),
                "low":       float(mid.get("l", 0)),
                "close":     float(mid.get("c", 0)),
                "volume":    int(c.get("volume", 0)),
                "timestamp": c.get("time", ""),
            })
        return candles

    async def fetch_candles_range(
        self, symbol: str, timeframe: str, date_from: str, date_to: str
    ) -> list[dict]:
        """Fetch candles between two ISO date strings for backtesting."""
        if not (self.api_key or "").strip():
            raise HTTPException(status_code=503, detail="OANDA credentials are not set.")

        instrument = self._format_symbol(symbol)
        granularity = TIMEFRAME_MAP.get(timeframe, "H1")
        url = f"{self.base_url}/v3/instruments/{instrument}/candles"

        # OANDA requires RFC3339 — append time if only a date was given
        # Cap `to` at current UTC time so OANDA doesn't reject future timestamps
        from_dt = date_from if "T" in date_from else f"{date_from}T00:00:00Z"
        now_utc = datetime.now(timezone.utc)
        now_str = now_utc.strftime("%Y-%m-%dT%H:%M:%SZ")
        if "T" in date_to:
            to_dt = date_to
        else:
            candidate = f"{date_to}T23:59:59Z"
            to_dt = now_str if candidate > now_str else candidate

        start = _parse_rfc3339_utc(from_dt)
        end = _parse_rfc3339_utc(to_dt)
        if start >= end:
            return []

        g_min = _GRANULARITY_MINUTES.get(granularity, 60)
        span_min = (end - start).total_seconds() / 60.0
        est_bars = span_min / g_min

        # Single request if safely under OANDA 5000 cap
        if est_bars <= 4500:
            return await self._fetch_candles_range_once(
                url, instrument, granularity, from_=from_dt, to_=to_dt,
            )

        # Chunked: ~2.5 days of M1 ≈ 3600 bars per chunk
        chunk = timedelta(days=2, hours=12)
        if granularity == "M5":
            chunk = timedelta(days=12)
        elif granularity not in ("M1", "M5"):
            chunk = timedelta(days=365)

        merged: dict[str, dict] = {}
        cursor = start
        while cursor < end:
            chunk_end = min(cursor + chunk, end)
            part = await self._fetch_candles_range_once(
                url, instrument, granularity,
                from_=_fmt_rfc3339(cursor),
                to_=_fmt_rfc3339(chunk_end),
            )
            for c in part:
                ts = c.get("timestamp")
                if ts:
                    merged[ts] = c
            cursor = chunk_end

        out = sorted(merged.values(), key=lambda x: x["timestamp"])
        logger.info(
            "oanda range candles fetched (chunked)",
            symbol=instrument,
            count=len(out),
            from_=date_from,
            to=date_to,
        )
        return out

    async def _fetch_candles_range_once(
        self,
        url: str,
        instrument: str,
        granularity: str,
        *,
        from_: str,
        to_: str,
    ) -> list[dict]:
        params = {
            "granularity": granularity,
            "from": from_,
            "to": to_,
            "price": "MBA",
        }

        async def _fetch():
            async with httpx.AsyncClient(timeout=60.0) as client:
                resp = await client.get(url, headers=self.headers, params=params)
                resp.raise_for_status()
                return resp.json()

        try:
            data = await oanda_breaker.call(
                with_retry, _fetch, retries=3, delay=1.0, label=f"oanda_range:{instrument}"
            )
            candles = self._candles_from_response(data)
            logger.info(
                "oanda range chunk",
                symbol=instrument,
                count=len(candles),
                from_=from_,
                to=to_,
            )
            return candles
        except HTTPException:
            raise
        except Exception as e:
            logger.error("oanda range fetch failed", error=str(e), symbol=instrument)
            raise HTTPException(status_code=502, detail=f"OANDA range fetch failed: {e!s}") from e

    async def fetch_account_summary(self) -> dict:
        """Fetch OANDA account summary (balance, equity, margin, open trades)."""
        if not (self.api_key or "").strip():
            raise HTTPException(status_code=503, detail="OANDA credentials are not set.")

        url = f"{self.base_url}/v3/accounts/{self.account_id}/summary"

        async def _fetch():
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.get(url, headers=self.headers)
                resp.raise_for_status()
                return resp.json()

        try:
            data = await oanda_breaker.call(with_retry, _fetch, retries=3, delay=0.5, label="oanda_account_summary")
            acct = data.get("account", {})
            return {
                "currency": acct.get("currency", "USD"),
                "balance": float(acct.get("balance", 0)),
                "nav": float(acct.get("NAV", 0)),
                "unrealized_pl": float(acct.get("unrealizedPL", 0)),
                "realized_pl": float(acct.get("pl", 0)),
                "margin_used": float(acct.get("marginUsed", 0)),
                "margin_available": float(acct.get("marginAvailable", 0)),
                "open_trade_count": int(acct.get("openTradeCount", 0)),
                "open_position_count": int(acct.get("openPositionCount", 0)),
                "pending_order_count": int(acct.get("pendingOrderCount", 0)),
            }
        except HTTPException:
            raise
        except Exception as e:
            logger.error("oanda account summary failed", error=str(e))
            raise HTTPException(status_code=502, detail=f"OANDA account summary failed: {e!s}") from e

    async def fetch_open_positions(self) -> list[dict]:
        """Fetch open trades from OANDA account."""
        if not (self.api_key or "").strip():
            raise HTTPException(status_code=503, detail="OANDA credentials are not set.")

        url = f"{self.base_url}/v3/accounts/{self.account_id}/openTrades"

        async def _fetch():
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.get(url, headers=self.headers)
                resp.raise_for_status()
                return resp.json()

        try:
            data = await oanda_breaker.call(with_retry, _fetch, retries=3, delay=0.5, label="oanda_open_trades")
            trades = []
            for t in data.get("trades", []):
                trades.append({
                    "id": t.get("id", ""),
                    "instrument": t.get("instrument", ""),
                    "price": float(t.get("price", 0)),
                    "open_time": t.get("openTime", ""),
                    "current_units": float(t.get("currentUnits", 0)),
                    "initial_units": float(t.get("initialUnits", 0)),
                    "realized_pl": float(t.get("realizedPL", 0)),
                    "unrealized_pl": float(t.get("unrealizedPL", 0)),
                    "margin_used": float(t.get("marginUsed", 0)),
                    "financing": float(t.get("financing", 0)),
                    "state": t.get("state", "OPEN"),
                })
            return trades
        except HTTPException:
            raise
        except Exception as e:
            logger.error("oanda open trades failed", error=str(e))
            raise HTTPException(status_code=502, detail=f"OANDA open trades failed: {e!s}") from e

    async def fetch_trades(self, state: str = "ALL", count: int = 200) -> list[dict]:
        """Fetch OANDA trades by state for syncing into internal trade records."""
        if not (self.api_key or "").strip():
            raise HTTPException(status_code=503, detail="OANDA credentials are not set.")

        url = f"{self.base_url}/v3/accounts/{self.account_id}/trades"
        params = {
            "state": state.upper(),
            "count": count,
        }

        async def _fetch():
            async with httpx.AsyncClient(timeout=15.0) as client:
                resp = await client.get(url, headers=self.headers, params=params)
                resp.raise_for_status()
                return resp.json()

        try:
            data = await oanda_breaker.call(with_retry, _fetch, retries=3, delay=0.5, label=f"oanda_trades:{state}")
            trades = []
            for t in data.get("trades", []):
                trades.append({
                    "id": t.get("id", ""),
                    "instrument": t.get("instrument", ""),
                    "price": float(t.get("price", 0) or 0),
                    "average_close_price": float(t.get("averageClosePrice", 0) or 0),
                    "open_time": t.get("openTime", ""),
                    "close_time": t.get("closeTime", ""),
                    "current_units": float(t.get("currentUnits", 0) or 0),
                    "initial_units": float(t.get("initialUnits", 0) or 0),
                    "realized_pl": float(t.get("realizedPL", 0) or 0),
                    "unrealized_pl": float(t.get("unrealizedPL", 0) or 0),
                    "financing": float(t.get("financing", 0) or 0),
                    "state": t.get("state", state.upper()),
                })
            return trades
        except HTTPException:
            raise
        except Exception as e:
            logger.error("oanda trades fetch failed", error=str(e), state=state)
            raise HTTPException(status_code=502, detail=f"OANDA trades fetch failed: {e!s}") from e

    async def fetch_tick(self, symbol: str) -> dict:
        if not (self.api_key or "").strip():
            raise HTTPException(
                status_code=503,
                detail="OANDA credentials are not set — cannot fetch forex ticks.",
            )

        instrument = self._format_symbol(symbol)
        url = f"{self.base_url}/v3/accounts/{self.account_id}/pricing"
        params = {"instruments": instrument}

        async def _fetch():
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.get(url, headers=self.headers, params=params)
                resp.raise_for_status()
                return resp.json()

        try:
            data = await oanda_breaker.call(with_retry, _fetch, retries=3, delay=0.5, label=f"oanda_tick:{instrument}")

            prices = data.get("prices", [])
            if not prices:
                return {}

            price = prices[0]
            bids = price.get("bids", [{}])
            asks = price.get("asks", [{}])

            return {
                "bid": float(bids[0].get("price", 0)) if bids else 0,
                "ask": float(asks[0].get("price", 0)) if asks else 0,
                "timestamp": price.get("time", datetime.now(timezone.utc).isoformat()),
            }

        except HTTPException:
            raise
        except Exception as e:
            logger.error("oanda tick failed after retries", error=str(e), symbol=symbol)
            raise HTTPException(
                status_code=502,
                detail=f"OANDA tick request failed: {e!s}",
            ) from e

    # User-friendly name → OANDA instrument name
    _SYMBOL_ALIASES: dict[str, str] = {
        "UK100":  "UK100_GBP",
        "US500":  "SPX500_USD",
        "US30":   "US30_USD",
        "NAS100": "NAS100_USD",
        "DE40":   "DE30_EUR",
        "XAUUSD": "XAU_USD",
        "XAGUSD": "XAG_USD",
    }

    def _format_symbol(self, symbol: str) -> str:
        """Convert user symbol to OANDA instrument name.
        EURUSD → EUR_USD, UK100 → UK100_GBP, etc.
        """
        upper = symbol.upper()
        if upper in self._SYMBOL_ALIASES:
            return self._SYMBOL_ALIASES[upper]
        clean = upper.replace("_", "")
        if len(clean) == 6 and clean.isalpha():
            return f"{clean[:3]}_{clean[3:]}"
        return upper
