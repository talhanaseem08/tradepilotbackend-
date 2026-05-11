import httpx

from app.config.settings import settings
from app.utils.logger import get_logger

logger = get_logger()


class AgentClient:
    def __init__(self):
        self.base_url = settings.agent_service_url
        self.client = httpx.AsyncClient(base_url=self.base_url, timeout=15.0)

    async def check_forex_trading_allowed(self, symbol: str) -> dict | None:
        try:
            response = await self.client.post(
                "/guard/forex",
                json={"symbol": symbol, "market": "forex"},
            )
            response.raise_for_status()
            return response.json()
        except Exception as exc:
            logger.error("agent forex guard request failed", symbol=symbol, error=str(exc))
            return None

    async def close(self):
        await self.client.aclose()


agent_client = AgentClient()
