import httpx
from app.config.settings import settings
from app.utils.logger import get_logger

logger = get_logger()


class OllamaClient:
    def __init__(self):
        self.base_url = settings.ollama_remote_url
        self.client = httpx.AsyncClient(base_url=self.base_url, timeout=300.0)

    async def generate(self, model: str, prompt: str, stream: bool = False) -> dict:
        response = await self.client.post(
            "/api/generate",
            json={"model": model, "prompt": prompt, "stream": stream},
        )
        response.raise_for_status()
        return response.json()

    async def is_healthy(self) -> bool:
        try:
            response = await self.client.get("/api/tags")
            return response.status_code == 200
        except Exception:
            return False

    async def close(self):
        await self.client.aclose()


ollama_client = OllamaClient()
