import httpx
from app.config.settings import settings
from app.utils.logger import get_logger

logger = get_logger()


class NLPClient:
    def __init__(self):
        self.base_url = settings.nlp_service_url
        self.client = httpx.AsyncClient(base_url=self.base_url, timeout=30.0)

    async def get_sentiment(self, symbol: str, market: str = "forex") -> dict | None:
        try:
            resp = await self.client.post(
                "/sentiment",
                json={"symbol": symbol, "market": market},
            )
            resp.raise_for_status()
            return resp.json()
        except Exception as e:
            logger.error("nlp sentiment request failed", error=str(e), symbol=symbol)
            return None

    async def is_healthy(self) -> bool:
        try:
            resp = await self.client.get("/health")
            data = resp.json()
            return data.get("status") == "ok"
        except Exception:
            return False

    async def close(self):
        await self.client.aclose()


nlp_client = NLPClient()
