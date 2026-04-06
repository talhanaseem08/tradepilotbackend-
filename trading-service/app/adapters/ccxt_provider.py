import ccxt.async_support as ccxt
from app.adapters.data_provider import DataProvider
from app.config.settings import settings
from app.utils.logger import get_logger

logger = get_logger()

TIMEFRAME_MAP = {
    "1m": "1m", "5m": "5m", "15m": "15m", "30m": "30m",
    "1h": "1h", "4h": "4h", "1d": "1d", "1w": "1w",
}


class CCXTProvider(DataProvider):
    def __init__(self):
        self.exchange = ccxt.binance({
            "apiKey": settings.binance_api_key,
            "secret": settings.binance_api_secret,
            "sandbox": settings.binance_sandbox,
            "enableRateLimit": True,
        })

    async def fetch_candles(self, symbol: str, timeframe: str, count: int = 100) -> list[dict]:
        tf = TIMEFRAME_MAP.get(timeframe, "1h")
        formatted_symbol = self._format_symbol(symbol)

        try:
            ohlcv = await self.exchange.fetch_ohlcv(
                formatted_symbol, timeframe=tf, limit=count
            )

            candles = []
            for row in ohlcv:
                candles.append({
                    "open": row[1],
                    "high": row[2],
                    "low": row[3],
                    "close": row[4],
                    "volume": row[5],
                    "timestamp": self.exchange.iso8601(row[0]),
                })

            logger.info("ccxt candles fetched", symbol=formatted_symbol,
                        timeframe=tf, count=len(candles))
            return candles

        except Exception as e:
            logger.error("ccxt candle fetch failed", error=str(e), symbol=symbol)
            return []

    async def fetch_tick(self, symbol: str) -> dict:
        formatted_symbol = self._format_symbol(symbol)

        try:
            ticker = await self.exchange.fetch_ticker(formatted_symbol)
            return {
                "bid": ticker.get("bid", 0),
                "ask": ticker.get("ask", 0),
                "timestamp": ticker.get("datetime", ""),
            }
        except Exception as e:
            logger.error("ccxt tick fetch failed", error=str(e), symbol=symbol)
            return {}

    async def close(self):
        await self.exchange.close()

    def _format_symbol(self, symbol: str) -> str:
        """Convert BTCUSDT → BTC/USDT for CCXT."""
        symbol = symbol.upper()
        if "/" in symbol:
            return symbol
        for quote in ["USDT", "BUSD", "BTC", "ETH", "USD"]:
            if symbol.endswith(quote):
                base = symbol[: -len(quote)]
                return f"{base}/{quote}"
        return symbol
