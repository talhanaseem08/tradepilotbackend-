from app.adapters.data_provider import DataProvider
from app.config.settings import settings
from app.core.circuit_breaker import binance_breaker
from app.services.binance_client import create_binance_exchange
from app.services.broker_credentials import UserBrokerCredentials
from app.utils.retry import with_retry
from app.utils.logger import get_logger

logger = get_logger()

TIMEFRAME_MAP = {
    "1m": "1m", "5m": "5m", "15m": "15m", "30m": "30m",
    "1h": "1h", "4h": "4h", "1d": "1d", "1w": "1w",
}


class CCXTProvider(DataProvider):
    def __init__(self, credentials: UserBrokerCredentials | None = None):
        sandbox = (
            credentials.is_testnet
            if credentials and credentials.is_testnet is not None
            else settings.binance_sandbox
        )
        # Public market-data requests do not need API keys. Using an
        # unauthenticated exchange avoids CCXT touching unsupported demo-mode
        # private SAPI endpoints while loading markets/currencies.
        self.exchange = create_binance_exchange(
            api_key=None,
            secret_key=None,
            demo_mode=sandbox,
        )

    async def fetch_candles(self, symbol: str, timeframe: str, count: int = 100) -> list[dict]:
        tf = TIMEFRAME_MAP.get(timeframe, "1h")
        formatted_symbol = self._format_symbol(symbol)

        async def _fetch():
            return await self.exchange.fetch_ohlcv(formatted_symbol, timeframe=tf, limit=count)

        try:
            ohlcv = await binance_breaker.call(with_retry, _fetch, retries=3, delay=1.0, label=f"ccxt_candles:{formatted_symbol}")

            candles = [
                {
                    "open": row[1], "high": row[2], "low": row[3],
                    "close": row[4], "volume": row[5],
                    "timestamp": self.exchange.iso8601(row[0]),
                }
                for row in ohlcv
            ]
            logger.info("ccxt candles fetched", symbol=formatted_symbol,
                        timeframe=tf, count=len(candles))
            return candles

        except Exception as e:
            logger.error("ccxt candle fetch failed after retries", error=str(e), symbol=symbol)
            return []

    async def fetch_tick(self, symbol: str) -> dict:
        formatted_symbol = self._format_symbol(symbol)

        async def _fetch():
            return await self.exchange.fetch_ticker(formatted_symbol)

        try:
            ticker = await binance_breaker.call(with_retry, _fetch, retries=3, delay=0.5, label=f"ccxt_tick:{formatted_symbol}")
            bid = ticker.get("bid", 0) or 0
            ask = ticker.get("ask", 0) or 0
            last = ticker.get("last", 0) or 0
            if not bid and last:
                bid = last
            if not ask and last:
                ask = last
            return {
                "bid": bid,
                "ask": ask,
                "last": last,
                "timestamp": ticker.get("datetime", ""),
            }
        except Exception as e:
            logger.error("ccxt tick fetch failed after retries", error=str(e), symbol=symbol)
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
