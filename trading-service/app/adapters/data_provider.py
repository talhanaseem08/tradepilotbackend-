from abc import ABC, abstractmethod


class DataProvider(ABC):
    @abstractmethod
    async def fetch_candles(self, symbol: str, timeframe: str, count: int = 100) -> list[dict]:
        """Returns list of OHLCV dicts: {open, high, low, close, volume, timestamp}"""
        pass

    @abstractmethod
    async def fetch_tick(self, symbol: str) -> dict:
        """Returns {bid, ask, timestamp}"""
        pass
