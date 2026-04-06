import httpx
from datetime import datetime, timezone
from app.adapters.data_provider import DataProvider
from app.config.settings import settings
from app.utils.logger import get_logger

logger = get_logger()

TIMEFRAME_MAP = {
    "1m": "M1", "5m": "M5", "15m": "M15", "30m": "M30",
    "1h": "H1", "4h": "H4", "1d": "D", "1w": "W",
}


class OandaProvider(DataProvider):
    def __init__(self):
        self.base_url = settings.oanda_base_url
        self.account_id = settings.oanda_account_id
        self.headers = {
            "Authorization": f"Bearer {settings.oanda_api_key}",
            "Content-Type": "application/json",
        }

    async def fetch_candles(self, symbol: str, timeframe: str, count: int = 100) -> list[dict]:
        instrument = self._format_symbol(symbol)
        granularity = TIMEFRAME_MAP.get(timeframe, "H1")

        url = f"{self.base_url}/v3/instruments/{instrument}/candles"
        params = {
            "granularity": granularity,
            "count": count,
            "price": "MBA",
        }

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                resp = await client.get(url, headers=self.headers, params=params)
                resp.raise_for_status()
                data = resp.json()

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

        except Exception as e:
            logger.error("oanda fetch failed", error=str(e), symbol=symbol)
            return []

    async def fetch_tick(self, symbol: str) -> dict:
        instrument = self._format_symbol(symbol)
        url = f"{self.base_url}/v3/accounts/{self.account_id}/pricing"
        params = {"instruments": instrument}

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.get(url, headers=self.headers, params=params)
                resp.raise_for_status()
                data = resp.json()

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

        except Exception as e:
            logger.error("oanda tick failed", error=str(e), symbol=symbol)
            return {}

    def _format_symbol(self, symbol: str) -> str:
        """Convert EURUSD → EUR_USD for OANDA API."""
        symbol = symbol.upper().replace("_", "")
        if len(symbol) == 6 and symbol.isalpha():
            return f"{symbol[:3]}_{symbol[3:]}"
        return symbol
