import time
import httpx
from app.config.settings import settings
from app.utils.logger import get_logger

logger = get_logger()


class _SimpleBreaker:
    """Lightweight circuit breaker for Ollama remote calls."""

    def __init__(self, threshold: int = 3, timeout: float = 120.0):
        self._failures = 0
        self._threshold = threshold
        self._timeout = timeout
        self._opened_at: float | None = None

    def _is_open(self) -> bool:
        if self._opened_at is None:
            return False
        if time.monotonic() - self._opened_at >= self._timeout:
            self._opened_at = None
            self._failures = 0
            logger.info("ollama circuit breaker HALF_OPEN — probing")
            return False
        return True

    async def call(self, coro_func, *args, **kwargs):
        if self._is_open():
            raise RuntimeError("Ollama circuit breaker OPEN — remote unreachable")
        try:
            result = await coro_func(*args, **kwargs)
            self._failures = 0
            return result
        except Exception as exc:
            self._failures += 1
            if self._failures >= self._threshold:
                self._opened_at = time.monotonic()
                logger.error("ollama circuit breaker OPEN",
                             failures=self._failures, error=str(exc))
            raise


_breaker = _SimpleBreaker(threshold=3, timeout=120.0)


class OllamaClient:
    def __init__(self):
        self.base_url = settings.ollama_remote_url
        self.client = httpx.AsyncClient(base_url=self.base_url, timeout=300.0)

    async def generate(self, model: str, prompt: str, stream: bool = False) -> dict:
        async def _call():
            response = await self.client.post(
                "/api/generate",
                json={"model": model, "prompt": prompt, "stream": stream},
            )
            response.raise_for_status()
            return response.json()

        return await _breaker.call(_call)

    async def is_healthy(self) -> bool:
        try:
            response = await self.client.get("/api/tags")
            return response.status_code == 200
        except Exception:
            return False

    async def close(self):
        await self.client.aclose()


ollama_client = OllamaClient()
