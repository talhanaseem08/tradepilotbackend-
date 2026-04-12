"""
Circuit breaker for external API calls.

States:
  CLOSED    — normal, requests pass through
  OPEN      — failing, requests fast-fail immediately
  HALF_OPEN — recovery probe, one request let through
"""
import time
from enum import Enum
from app.utils.logger import get_logger

logger = get_logger()


class CircuitState(Enum):
    CLOSED = "closed"
    OPEN = "open"
    HALF_OPEN = "half_open"


class CircuitBreaker:
    def __init__(
        self,
        name: str,
        failure_threshold: int = 5,
        recovery_timeout: float = 60.0,
        half_open_max_calls: int = 1,
    ):
        self.name = name
        self.failure_threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
        self.half_open_max_calls = half_open_max_calls

        self._state = CircuitState.CLOSED
        self._failure_count = 0
        self._last_failure_time: float | None = None
        self._half_open_calls = 0

    @property
    def state(self) -> str:
        return self._state.value

    def is_open(self) -> bool:
        if self._state == CircuitState.OPEN:
            if (
                self._last_failure_time is not None
                and time.monotonic() - self._last_failure_time >= self.recovery_timeout
            ):
                self._state = CircuitState.HALF_OPEN
                self._half_open_calls = 0
                logger.info("circuit breaker HALF_OPEN", name=self.name)
                return False
            return True
        return False

    def _on_success(self):
        if self._state != CircuitState.CLOSED:
            logger.info("circuit breaker CLOSED (recovered)", name=self.name)
        self._state = CircuitState.CLOSED
        self._failure_count = 0
        self._half_open_calls = 0

    def _on_failure(self, error: Exception):
        self._failure_count += 1
        self._last_failure_time = time.monotonic()

        if self._state == CircuitState.HALF_OPEN:
            logger.warning("circuit breaker probe failed — back to OPEN", name=self.name)
            self._state = CircuitState.OPEN
            return

        if self._failure_count >= self.failure_threshold:
            if self._state != CircuitState.OPEN:
                logger.error(
                    "circuit breaker OPEN",
                    name=self.name,
                    failures=self._failure_count,
                    error=str(error),
                )
            self._state = CircuitState.OPEN

    async def call(self, coro_func, *args, **kwargs):
        """Wrap an async callable with circuit breaker protection."""
        if self.is_open():
            raise RuntimeError(f"Circuit breaker OPEN for '{self.name}' — call rejected")

        if self._state == CircuitState.HALF_OPEN:
            if self._half_open_calls >= self.half_open_max_calls:
                raise RuntimeError(
                    f"Circuit breaker HALF_OPEN for '{self.name}' — max probe calls reached"
                )
            self._half_open_calls += 1

        try:
            result = await coro_func(*args, **kwargs)
            self._on_success()
            return result
        except Exception as exc:
            self._on_failure(exc)
            raise


# Shared breaker instances — imported by adapters
oanda_breaker = CircuitBreaker("oanda", failure_threshold=5, recovery_timeout=60.0)
binance_breaker = CircuitBreaker("binance", failure_threshold=5, recovery_timeout=60.0)
mt5_breaker = CircuitBreaker("mt5", failure_threshold=3, recovery_timeout=30.0)
ollama_breaker = CircuitBreaker("ollama", failure_threshold=3, recovery_timeout=120.0)
nlp_breaker = CircuitBreaker("nlp", failure_threshold=5, recovery_timeout=60.0)
