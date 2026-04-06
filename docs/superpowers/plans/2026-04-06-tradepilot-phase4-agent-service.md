# TradePilot Phase 4: Agent Service + Redis Streams Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the agent service (DeepSeek R1 reasoning + PPO optimization), wire Redis Streams across all services for the async pipeline (trade.requests, trade.results, agent.trigger, bot.update), and connect the full end-to-end flow.

**Architecture:** Agent service (FastAPI, port 8003) consumes `agent.trigger` Redis Stream, calls DeepSeek R1 via remote Ollama, publishes new parameters to `bot.update` stream. Trading service publishes triggers when 3 consecutive losses detected. Gateway publishes trade requests and subscribes to results.

**Tech Stack:** FastAPI, redis (streams), httpx, stable-baselines3 (PPO, optional)

---

### Task 1: Update Agent Service Dependencies + Config

**Files:**
- Modify: `e:\fyp\agent-service\requirements.txt`
- Modify: `e:\fyp\agent-service\app\config\settings.py`
- Modify: `e:\fyp\agent-service\.env.example`

- [ ] **Step 1: Update requirements.txt** — replace entirely:
```
fastapi==0.115.0
uvicorn[standard]==0.32.0
redis[hiredis]==5.2.0
pydantic-settings==2.6.0
httpx==0.27.0
structlog==24.4.0
```

- [ ] **Step 2: Update config/settings.py** — replace entirely:
```python
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    agent_service_port: int = 8003
    redis_host: str = "localhost"
    redis_port: int = 6379
    ollama_remote_url: str = "http://localhost:11434"
    deepseek_model: str = "deepseek-r1:14b"
    agent_consumer_group: str = "agent-workers"
    agent_consumer_name: str = "agent-1"

    class Config:
        env_file = ".env"


settings = Settings()
```

- [ ] **Step 3: Update .env.example** — replace entirely:
```env
AGENT_SERVICE_PORT=8003
REDIS_HOST=localhost
REDIS_PORT=6379
OLLAMA_REMOTE_URL=http://REPLACE_WITH_VM_IP:11434
DEEPSEEK_MODEL=deepseek-r1:14b
AGENT_CONSUMER_GROUP=agent-workers
AGENT_CONSUMER_NAME=agent-1
```

- [ ] **Step 4: Commit**

---

### Task 2: Ollama Client + DeepSeek Service

**Files:**
- Create: `e:\fyp\agent-service\app\core\ollama_client.py`
- Create: `e:\fyp\agent-service\app\services\__init__.py`
- Create: `e:\fyp\agent-service\app\services\deepseek_service.py`
- Create: `e:\fyp\agent-service\app\schemas\__init__.py`
- Create: `e:\fyp\agent-service\app\schemas\reason.py`

- [ ] **Step 1: Create core/ollama_client.py**
```python
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
```

- [ ] **Step 2: Create schemas/reason.py**
```python
from pydantic import BaseModel


class ReasonRequest(BaseModel):
    bot_id: str
    bot_type: str
    symbol: str
    market: str = "forex"
    timeframe: str = "1h"
    current_parameters: dict = {}
    consecutive_losses: int = 3
    recent_trades: list[dict] = []
    market_summary: str = ""


class ReasonResponse(BaseModel):
    bot_id: str
    new_parameters: dict = {}
    reasoning: str = ""
    success: bool = False
```

- [ ] **Step 3: Create services/deepseek_service.py**
```python
import json
from app.core.ollama_client import ollama_client
from app.config.settings import settings
from app.schemas.reason import ReasonRequest, ReasonResponse
from app.utils.logger import get_logger

logger = get_logger()

DEEPSEEK_PROMPT_TEMPLATE = """You are a trading strategy analyst. A trading bot has experienced {losses} consecutive losses and needs parameter adjustment.

Bot type: {bot_type}
Symbol: {symbol} ({market}), Timeframe: {timeframe}
Current parameters: {params}
Recent trades: {trades}
Market conditions: {market_summary}

Analyze what went wrong and suggest specific parameter adjustments.
Return your response as valid JSON only, no other text:
{{"rsi_period": <int>, "ema_fast": <int>, "ema_slow": <int>, "rsi_oversold": <int>, "rsi_overbought": <int>, "stop_loss_pips": <int>, "take_profit_pips": <int>, "reasoning": "<explanation>"}}"""


async def analyze_and_suggest(request: ReasonRequest) -> ReasonResponse:
    prompt = DEEPSEEK_PROMPT_TEMPLATE.format(
        losses=request.consecutive_losses,
        bot_type=request.bot_type,
        symbol=request.symbol,
        market=request.market,
        timeframe=request.timeframe,
        params=json.dumps(request.current_parameters),
        trades=json.dumps(request.recent_trades[-10:]),
        market_summary=request.market_summary or "No data available",
    )

    try:
        logger.info("calling deepseek", bot_id=request.bot_id, model=settings.deepseek_model)
        result = await ollama_client.generate(
            model=settings.deepseek_model,
            prompt=prompt,
            stream=False,
        )

        raw_text = result.get("response", "")
        logger.info("deepseek response received", length=len(raw_text))

        parsed = _extract_json(raw_text)
        reasoning = parsed.pop("reasoning", "")

        if not parsed:
            return ReasonResponse(
                bot_id=request.bot_id,
                reasoning=raw_text[:500],
                success=False,
            )

        return ReasonResponse(
            bot_id=request.bot_id,
            new_parameters=parsed,
            reasoning=reasoning,
            success=True,
        )

    except Exception as e:
        logger.error("deepseek analysis failed", error=str(e), bot_id=request.bot_id)
        return ReasonResponse(
            bot_id=request.bot_id,
            reasoning=f"DeepSeek call failed: {str(e)}",
            success=False,
        )


def _extract_json(text: str) -> dict:
    try:
        start = text.index("{")
        end = text.rindex("}") + 1
        return json.loads(text[start:end])
    except (ValueError, json.JSONDecodeError):
        logger.warning("failed to parse JSON from deepseek", text=text[:200])
        return {}
```

- [ ] **Step 4: Commit**

---

### Task 3: Redis Streams - Agent Worker

**Files:**
- Create: `e:\fyp\agent-service\app\workers\__init__.py`
- Create: `e:\fyp\agent-service\app\workers\agent_worker.py`

- [ ] **Step 1: Create workers/agent_worker.py**
```python
import asyncio
import json
from app.config.redis import get_redis
from app.config.settings import settings
from app.services.deepseek_service import analyze_and_suggest
from app.schemas.reason import ReasonRequest
from app.utils.logger import get_logger

logger = get_logger()

TRIGGER_STREAM = "agent.trigger"
UPDATE_STREAM = "bot.update"

_worker_task: asyncio.Task | None = None


async def _ensure_stream_group():
    redis = await get_redis()
    try:
        await redis.xgroup_create(
            TRIGGER_STREAM,
            settings.agent_consumer_group,
            id="0",
            mkstream=True,
        )
    except Exception:
        pass


async def _process_trigger(data: dict):
    bot_id = data.get("bot_id", "")
    logger.info("agent trigger received", bot_id=bot_id)

    redis = await get_redis()
    await redis.set(f"bot:{bot_id}:status", "paused")

    request = ReasonRequest(
        bot_id=bot_id,
        bot_type=data.get("bot_type", "low_risk"),
        symbol=data.get("symbol", ""),
        market=data.get("market", "forex"),
        timeframe=data.get("timeframe", "1h"),
        current_parameters=json.loads(data.get("parameters", "{}")),
        consecutive_losses=int(data.get("consecutive_losses", 3)),
        recent_trades=json.loads(data.get("recent_trades", "[]")),
        market_summary=data.get("market_summary", ""),
    )

    response = await analyze_and_suggest(request)

    if response.success:
        await redis.xadd(UPDATE_STREAM, {
            "bot_id": bot_id,
            "new_parameters": json.dumps(response.new_parameters),
            "reasoning": response.reasoning,
        })
        logger.info("bot update published", bot_id=bot_id,
                     params=response.new_parameters)
    else:
        logger.error("agent failed - bot stays paused", bot_id=bot_id,
                      reason=response.reasoning)


async def _worker_loop():
    await _ensure_stream_group()
    redis = await get_redis()

    while True:
        try:
            messages = await redis.xreadgroup(
                groupname=settings.agent_consumer_group,
                consumername=settings.agent_consumer_name,
                streams={TRIGGER_STREAM: ">"},
                count=1,
                block=5000,
            )

            if not messages:
                continue

            for stream_name, stream_messages in messages:
                for msg_id, data in stream_messages:
                    try:
                        await _process_trigger(data)
                        await redis.xack(TRIGGER_STREAM,
                                         settings.agent_consumer_group, msg_id)
                    except Exception as e:
                        logger.error("trigger processing failed",
                                     msg_id=msg_id, error=str(e))

        except asyncio.CancelledError:
            break
        except Exception as e:
            logger.error("agent worker error", error=str(e))
            await asyncio.sleep(5)


def start_agent_worker():
    global _worker_task
    _worker_task = asyncio.create_task(_worker_loop())
    logger.info("agent worker started")


def stop_agent_worker():
    global _worker_task
    if _worker_task:
        _worker_task.cancel()
        _worker_task = None
        logger.info("agent worker stopped")
```

- [ ] **Step 2: Commit**

---

### Task 4: Agent API Routers + Lifespan Wiring

**Files:**
- Create: `e:\fyp\agent-service\app\routers\reason.py`
- Modify: `e:\fyp\agent-service\app\routers\health.py`
- Modify: `e:\fyp\agent-service\app\core\lifespan.py`
- Modify: `e:\fyp\agent-service\app\main.py`

- [ ] **Step 1: Create routers/reason.py**
```python
from fastapi import APIRouter, HTTPException
from app.schemas.reason import ReasonRequest, ReasonResponse
from app.services.deepseek_service import analyze_and_suggest

router = APIRouter(tags=["agent"])


@router.post("/reason", response_model=ReasonResponse)
async def reason(request: ReasonRequest):
    try:
        result = await analyze_and_suggest(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Agent reasoning failed: {str(e)}")
```

- [ ] **Step 2: Update routers/health.py** — replace entirely:
```python
from datetime import datetime, timezone
from fastapi import APIRouter
from app.core.ollama_client import ollama_client

router = APIRouter()


@router.get("/health")
async def health_check():
    ollama_ok = await ollama_client.is_healthy()
    status = "ok" if ollama_ok else "degraded"

    return {
        "status": status,
        "service": "agent-service",
        "ollama_reachable": ollama_ok,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
```

- [ ] **Step 3: Update core/lifespan.py** — replace entirely:
```python
from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.config.redis import get_redis, close_redis
from app.core.ollama_client import ollama_client
from app.workers.agent_worker import start_agent_worker, stop_agent_worker
from app.utils.logger import get_logger

logger = get_logger()


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("agent-service starting up")
    await get_redis()
    logger.info("redis connected")
    ollama_ok = await ollama_client.is_healthy()
    logger.info("ollama remote status", healthy=ollama_ok)
    start_agent_worker()
    yield
    stop_agent_worker()
    await ollama_client.close()
    await close_redis()
    logger.info("agent-service shut down")
```

- [ ] **Step 4: Update main.py** — replace entirely:
```python
from fastapi import FastAPI
from app.core.lifespan import lifespan
from app.routers import health, reason

app = FastAPI(title="TradePilot Agent Service", lifespan=lifespan)

app.include_router(health.router)
app.include_router(reason.router)
```

- [ ] **Step 5: Commit**

---

### Task 5: Trading Service - Redis Stream Publisher (Agent Trigger)

**Files:**
- Create: `e:\fyp\trading-service\app\services\agent_trigger.py`
- Modify: `e:\fyp\trading-service\app\services\performance_monitor.py`

- [ ] **Step 1: Create services/agent_trigger.py**
```python
import json
from app.config.redis import get_redis
from app.utils.logger import get_logger

logger = get_logger()

TRIGGER_STREAM = "agent.trigger"
UPDATE_STREAM = "bot.update"


async def publish_agent_trigger(
    bot_id: str,
    bot_type: str,
    symbol: str,
    market: str,
    timeframe: str,
    parameters: dict,
    consecutive_losses: int,
    recent_trades: list[dict],
) -> str:
    redis = await get_redis()

    msg_id = await redis.xadd(TRIGGER_STREAM, {
        "bot_id": bot_id,
        "bot_type": bot_type,
        "symbol": symbol,
        "market": market,
        "timeframe": timeframe,
        "parameters": json.dumps(parameters),
        "consecutive_losses": str(consecutive_losses),
        "recent_trades": json.dumps(recent_trades[-10:]),
    })

    logger.info("agent trigger published", bot_id=bot_id,
                 consecutive_losses=consecutive_losses, msg_id=msg_id)
    return msg_id
```

- [ ] **Step 2: Update performance_monitor.py** — replace entirely:
```python
from app.core.redis_client import increment_losses, reset_losses, set_bot_status
from app.services.agent_trigger import publish_agent_trigger
from app.utils.logger import get_logger

logger = get_logger()

LOSS_THRESHOLD = 3


async def record_trade_result(
    bot_id: str,
    pnl: float,
    bot_type: str = "",
    symbol: str = "",
    market: str = "forex",
    timeframe: str = "1h",
    parameters: dict | None = None,
    recent_trades: list[dict] | None = None,
) -> dict:
    if pnl >= 0:
        await reset_losses(bot_id)
        logger.info("winning trade recorded", bot_id=bot_id, pnl=pnl)
        return {"action": "continue", "consecutive_losses": 0}

    loss_count = await increment_losses(bot_id)
    logger.warning("losing trade recorded", bot_id=bot_id, pnl=pnl,
                    consecutive_losses=loss_count)

    if loss_count >= LOSS_THRESHOLD:
        await set_bot_status(bot_id, "paused")
        logger.error("LOSS THRESHOLD reached - bot paused, triggering agent",
                      bot_id=bot_id, consecutive_losses=loss_count)

        await publish_agent_trigger(
            bot_id=bot_id,
            bot_type=bot_type,
            symbol=symbol,
            market=market,
            timeframe=timeframe,
            parameters=parameters or {},
            consecutive_losses=loss_count,
            recent_trades=recent_trades or [],
        )

        return {"action": "trigger_agent", "consecutive_losses": loss_count}

    return {"action": "continue", "consecutive_losses": loss_count}
```

- [ ] **Step 3: Commit**

---

### Task 6: Trading Service - Bot Update Consumer

**Files:**
- Create: `e:\fyp\trading-service\app\workers\__init__.py`
- Create: `e:\fyp\trading-service\app\workers\update_worker.py`
- Modify: `e:\fyp\trading-service\app\core\lifespan.py`

- [ ] **Step 1: Create workers/update_worker.py**
```python
import asyncio
import json
from app.config.redis import get_redis
from app.core.redis_client import set_bot_status, store_bot_params
from app.utils.logger import get_logger

logger = get_logger()

UPDATE_STREAM = "bot.update"
CONSUMER_GROUP = "trading-workers"
CONSUMER_NAME = "trading-1"

_worker_task: asyncio.Task | None = None


async def _ensure_stream_group():
    redis = await get_redis()
    try:
        await redis.xgroup_create(UPDATE_STREAM, CONSUMER_GROUP, id="0", mkstream=True)
    except Exception:
        pass


async def _process_update(data: dict):
    bot_id = data.get("bot_id", "")
    new_params = json.loads(data.get("new_parameters", "{}"))
    reasoning = data.get("reasoning", "")

    logger.info("bot update received", bot_id=bot_id, reasoning=reasoning[:100])

    await store_bot_params(bot_id, new_params)
    await set_bot_status(bot_id, "active")

    logger.info("bot resumed with new parameters", bot_id=bot_id, params=new_params)


async def _worker_loop():
    await _ensure_stream_group()
    redis = await get_redis()

    while True:
        try:
            messages = await redis.xreadgroup(
                groupname=CONSUMER_GROUP,
                consumername=CONSUMER_NAME,
                streams={UPDATE_STREAM: ">"},
                count=1,
                block=5000,
            )

            if not messages:
                continue

            for stream_name, stream_messages in messages:
                for msg_id, data in stream_messages:
                    try:
                        await _process_update(data)
                        await redis.xack(UPDATE_STREAM, CONSUMER_GROUP, msg_id)
                    except Exception as e:
                        logger.error("update processing failed",
                                     msg_id=msg_id, error=str(e))

        except asyncio.CancelledError:
            break
        except Exception as e:
            logger.error("update worker error", error=str(e))
            await asyncio.sleep(5)


def start_update_worker():
    global _worker_task
    _worker_task = asyncio.create_task(_worker_loop())
    logger.info("bot update worker started")


def stop_update_worker():
    global _worker_task
    if _worker_task:
        _worker_task.cancel()
        _worker_task = None
        logger.info("bot update worker stopped")
```

- [ ] **Step 2: Update trading-service lifespan.py** — replace entirely:
```python
from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.config.redis import get_redis, close_redis
from app.config.database import connect_mongo, close_mongo
from app.core.nlp_client import nlp_client
from app.workers.update_worker import start_update_worker, stop_update_worker
from app.utils.logger import get_logger

logger = get_logger()


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("trading-service starting up")
    await get_redis()
    logger.info("redis connected")
    await connect_mongo()
    logger.info("mongodb connected")
    nlp_ok = await nlp_client.is_healthy()
    logger.info("nlp service status", healthy=nlp_ok)
    start_update_worker()
    yield
    stop_update_worker()
    await nlp_client.close()
    await close_redis()
    await close_mongo()
    logger.info("trading-service shut down")
```

- [ ] **Step 3: Commit**
