import asyncio
from app.utils.logger import get_logger

logger = get_logger()


async def with_retry(coro_fn, retries: int = 3, delay: float = 1.0, label: str = ""):
    """
    Retry an async callable up to `retries` times with exponential backoff.
    Returns the result or raises the last exception.
    """
    last_err = None
    for attempt in range(1, retries + 1):
        try:
            return await coro_fn()
        except Exception as e:
            last_err = e
            if attempt < retries:
                wait = delay * (2 ** (attempt - 1))
                logger.warning(
                    "retrying after failure",
                    label=label,
                    attempt=attempt,
                    wait=wait,
                    error=str(e),
                )
                await asyncio.sleep(wait)
            else:
                logger.error(
                    "all retries exhausted",
                    label=label,
                    attempts=retries,
                    error=str(e),
                )
    raise last_err
