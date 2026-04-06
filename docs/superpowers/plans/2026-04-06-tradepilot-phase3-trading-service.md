# TradePilot Phase 3: Trading Service Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the trading service: bot system (BaseBot + sample LowRiskBot), backtesting engine, data provider and broker adapter abstractions, trade executor with mandatory sentiment gate, and Redis state tracking for bot status and consecutive losses.

**Architecture:** Trading service (FastAPI, port 8002) manages bot lifecycles, runs backtesting against cached data, executes trades through BrokerAdapter abstraction (Paper/MT5/CCXT), enforces sentiment gate by calling NLP service before every trade, and tracks bot state + consecutive losses in Redis.

**Tech Stack:** FastAPI, motor (MongoDB), redis, httpx, pandas, numpy, ccxt, MetaTrader5 (Windows-only)

---

### Task 1: Update Dependencies + Schemas

**Files:**
- Modify: `e:\fyp\trading-service\requirements.txt`
- Create: `e:\fyp\trading-service\app\schemas\__init__.py`
- Create: `e:\fyp\trading-service\app\schemas\bot.py`
- Create: `e:\fyp\trading-service\app\schemas\backtest.py`
- Create: `e:\fyp\trading-service\app\schemas\trade.py`

- [ ] **Step 1: Update requirements.txt**

Replace entirely with:
```
fastapi==0.115.0
uvicorn[standard]==0.32.0
redis[hiredis]==5.2.0
motor==3.7.1
pydantic-settings==2.6.0
httpx==0.27.0
structlog==24.4.0
pandas>=2.2.0
numpy>=1.26.0
ccxt>=4.4.0
```

- [ ] **Step 2: Create schemas**

`schemas/__init__.py` — empty

`schemas/bot.py`:
```python
from pydantic import BaseModel


class BotCreate(BaseModel):
    bot_type: str
    symbol: str
    market: str = "forex"
    timeframe: str = "1h"
    parameters: dict = {}
    broker_mode: str = "paper"


class BotResponse(BaseModel):
    id: str
    bot_type: str
    symbol: str
    market: str
    timeframe: str
    parameters: dict
    status: str
    consecutive_losses: int = 0


class BotStatusUpdate(BaseModel):
    status: str
```

`schemas/backtest.py`:
```python
from pydantic import BaseModel


class BacktestRequest(BaseModel):
    bot_type: str
    symbol: str
    market: str = "forex"
    timeframe: str = "1h"
    parameters: dict = {}
    candles: list[dict] = []


class BacktestResult(BaseModel):
    total_trades: int = 0
    winning_trades: int = 0
    losing_trades: int = 0
    win_rate: float = 0.0
    total_profit_pct: float = 0.0
    max_drawdown_pct: float = 0.0
    sharpe_ratio: float = 0.0
    profit_factor: float = 0.0
```

`schemas/trade.py`:
```python
from pydantic import BaseModel


class TradeSignal(BaseModel):
    action: str
    symbol: str
    price: float = 0.0
    stop_loss: float = 0.0
    take_profit: float = 0.0
    quantity: float = 0.0


class TradeResult(BaseModel):
    order_id: str | None = None
    symbol: str
    side: str
    entry_price: float
    quantity: float
    status: str
    sentiment_score: float | None = None
    sentiment_label: str | None = None
```

- [ ] **Step 3: Commit**

```bash
git add trading-service/requirements.txt trading-service/app/schemas/
git commit -m "feat(trading): update deps and add bot, backtest, trade schemas"
```

---

### Task 2: Bot System (BaseBot + LowRiskBot + Registry)

**Files:**
- Create: `e:\fyp\trading-service\app\bots\__init__.py`
- Create: `e:\fyp\trading-service\app\bots\base_bot.py`
- Create: `e:\fyp\trading-service\app\bots\low_risk_bot.py`
- Create: `e:\fyp\trading-service\app\bots\registry.py`

- [ ] **Step 1: Create bots**

`bots/__init__.py` — empty

`bots/base_bot.py`:
```python
from abc import ABC, abstractmethod


class BaseBot(ABC):
    def __init__(self, symbol: str, timeframe: str, parameters: dict):
        self.symbol = symbol
        self.timeframe = timeframe
        self.parameters = parameters

    @abstractmethod
    def analyze(self, candles: list[dict]) -> str:
        """Returns 'buy', 'sell', or 'hold'."""
        pass

    @abstractmethod
    def calculate_stop_loss(self, entry_price: float, side: str) -> float:
        pass

    @abstractmethod
    def calculate_take_profit(self, entry_price: float, side: str) -> float:
        pass

    def calculate_position_size(self, balance: float, risk_pct: float = 1.0) -> float:
        return round(balance * (risk_pct / 100), 2)

    def get_parameters(self) -> dict:
        return self.parameters.copy()

    def update_parameters(self, new_params: dict):
        self.parameters.update(new_params)
```

`bots/low_risk_bot.py` (sample strategy — RSI + EMA crossover):
```python
from app.bots.base_bot import BaseBot
from app.utils.indicators import calculate_rsi, calculate_ema


class LowRiskBot(BaseBot):
    """Sample bot using RSI + EMA crossover. Will be replaced with real strategy."""

    def __init__(self, symbol: str, timeframe: str, parameters: dict):
        defaults = {
            "rsi_period": 14,
            "ema_fast": 9,
            "ema_slow": 21,
            "rsi_oversold": 30,
            "rsi_overbought": 70,
            "stop_loss_pips": 30,
            "take_profit_pips": 60,
        }
        defaults.update(parameters)
        super().__init__(symbol, timeframe, defaults)

    def analyze(self, candles: list[dict]) -> str:
        if len(candles) < self.parameters["ema_slow"] + 5:
            return "hold"

        closes = [c["close"] for c in candles]
        rsi = calculate_rsi(closes, self.parameters["rsi_period"])
        ema_fast = calculate_ema(closes, self.parameters["ema_fast"])
        ema_slow = calculate_ema(closes, self.parameters["ema_slow"])

        if rsi is None or ema_fast is None or ema_slow is None:
            return "hold"

        if rsi < self.parameters["rsi_oversold"] and ema_fast > ema_slow:
            return "buy"
        elif rsi > self.parameters["rsi_overbought"] and ema_fast < ema_slow:
            return "sell"

        return "hold"

    def calculate_stop_loss(self, entry_price: float, side: str) -> float:
        pips = self.parameters["stop_loss_pips"] * 0.0001
        if side == "buy":
            return round(entry_price - pips, 5)
        return round(entry_price + pips, 5)

    def calculate_take_profit(self, entry_price: float, side: str) -> float:
        pips = self.parameters["take_profit_pips"] * 0.0001
        if side == "buy":
            return round(entry_price + pips, 5)
        return round(entry_price - pips, 5)
```

`bots/registry.py`:
```python
from app.bots.base_bot import BaseBot
from app.bots.low_risk_bot import LowRiskBot

BOT_REGISTRY: dict[str, type[BaseBot]] = {
    "low_risk": LowRiskBot,
}


def create_bot(bot_type: str, symbol: str, timeframe: str, parameters: dict) -> BaseBot:
    bot_class = BOT_REGISTRY.get(bot_type)
    if not bot_class:
        raise ValueError(f"Unknown bot type: {bot_type}. Available: {list(BOT_REGISTRY.keys())}")
    return bot_class(symbol=symbol, timeframe=timeframe, parameters=parameters)


def list_bot_types() -> list[str]:
    return list(BOT_REGISTRY.keys())
```

- [ ] **Step 2: Create utils/indicators.py**

Create `e:\fyp\trading-service\app\utils\indicators.py`:
```python
def calculate_rsi(closes: list[float], period: int = 14) -> float | None:
    if len(closes) < period + 1:
        return None

    deltas = [closes[i] - closes[i - 1] for i in range(1, len(closes))]
    recent = deltas[-(period):]

    gains = [d for d in recent if d > 0]
    losses = [-d for d in recent if d < 0]

    avg_gain = sum(gains) / period if gains else 0
    avg_loss = sum(losses) / period if losses else 0

    if avg_loss == 0:
        return 100.0

    rs = avg_gain / avg_loss
    return round(100 - (100 / (1 + rs)), 2)


def calculate_ema(closes: list[float], period: int) -> float | None:
    if len(closes) < period:
        return None

    multiplier = 2 / (period + 1)
    ema = sum(closes[:period]) / period

    for price in closes[period:]:
        ema = (price - ema) * multiplier + ema

    return round(ema, 5)
```

- [ ] **Step 3: Commit**

```bash
git add trading-service/app/bots/ trading-service/app/utils/indicators.py
git commit -m "feat(trading): add bot system with BaseBot, sample LowRiskBot, registry, and indicators"
```

---

### Task 3: Broker Adapters (Paper + Abstract)

**Files:**
- Create: `e:\fyp\trading-service\app\adapters\__init__.py`
- Create: `e:\fyp\trading-service\app\adapters\broker_adapter.py`
- Create: `e:\fyp\trading-service\app\adapters\paper_adapter.py`
- Create: `e:\fyp\trading-service\app\adapters\data_provider.py`

- [ ] **Step 1: Create adapters**

`adapters/__init__.py` — empty

`adapters/broker_adapter.py`:
```python
from abc import ABC, abstractmethod


class BrokerAdapter(ABC):
    @abstractmethod
    async def place_order(self, symbol: str, side: str, quantity: float,
                          order_type: str = "market", price: float | None = None,
                          stop_loss: float | None = None,
                          take_profit: float | None = None) -> dict:
        pass

    @abstractmethod
    async def close_order(self, order_id: str) -> dict:
        pass

    @abstractmethod
    async def get_position(self, symbol: str) -> dict | None:
        pass

    @abstractmethod
    async def get_account_balance(self) -> dict:
        pass
```

`adapters/paper_adapter.py`:
```python
import uuid
from datetime import datetime, timezone
from app.adapters.broker_adapter import BrokerAdapter
from app.utils.logger import get_logger

logger = get_logger()


class PaperBrokerAdapter(BrokerAdapter):
    def __init__(self, initial_balance: float = 10000.0, slippage_pct: float = 0.01):
        self.balance = initial_balance
        self.initial_balance = initial_balance
        self.slippage_pct = slippage_pct
        self.positions: dict[str, dict] = {}
        self.orders: dict[str, dict] = {}

    async def place_order(self, symbol: str, side: str, quantity: float,
                          order_type: str = "market", price: float | None = None,
                          stop_loss: float | None = None,
                          take_profit: float | None = None) -> dict:
        order_id = str(uuid.uuid4())[:8]
        fill_price = price or 0.0

        slippage = fill_price * (self.slippage_pct / 100)
        if side == "buy":
            fill_price += slippage
        else:
            fill_price -= slippage

        order = {
            "order_id": order_id,
            "symbol": symbol,
            "side": side,
            "quantity": quantity,
            "entry_price": round(fill_price, 5),
            "stop_loss": stop_loss,
            "take_profit": take_profit,
            "status": "open",
            "opened_at": datetime.now(timezone.utc).isoformat(),
        }

        self.orders[order_id] = order
        self.positions[symbol] = order

        logger.info("paper order placed", order_id=order_id, symbol=symbol,
                     side=side, price=fill_price)
        return order

    async def close_order(self, order_id: str) -> dict:
        order = self.orders.get(order_id)
        if not order:
            return {"error": "Order not found"}

        order["status"] = "closed"
        order["closed_at"] = datetime.now(timezone.utc).isoformat()

        symbol = order["symbol"]
        if symbol in self.positions:
            del self.positions[symbol]

        logger.info("paper order closed", order_id=order_id)
        return order

    async def get_position(self, symbol: str) -> dict | None:
        return self.positions.get(symbol)

    async def get_account_balance(self) -> dict:
        return {
            "balance": self.balance,
            "initial_balance": self.initial_balance,
            "pnl": round(self.balance - self.initial_balance, 2),
        }
```

`adapters/data_provider.py`:
```python
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
```

- [ ] **Step 2: Commit**

```bash
git add trading-service/app/adapters/
git commit -m "feat(trading): add broker adapter abstraction and paper trading adapter"
```

---

### Task 4: NLP Client + Trade Executor (Sentiment Gate)

**Files:**
- Create: `e:\fyp\trading-service\app\core\nlp_client.py`
- Create: `e:\fyp\trading-service\app\services\__init__.py`
- Create: `e:\fyp\trading-service\app\services\trade_executor.py`

- [ ] **Step 1: Create core/nlp_client.py**

```python
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
```

- [ ] **Step 2: Create services/trade_executor.py**

`services/__init__.py` — empty

```python
from app.core.nlp_client import nlp_client
from app.adapters.broker_adapter import BrokerAdapter
from app.schemas.trade import TradeSignal, TradeResult
from app.utils.logger import get_logger

logger = get_logger()


async def execute_with_sentiment_gate(
    signal: TradeSignal,
    broker: BrokerAdapter,
    market: str = "forex",
) -> TradeResult | None:
    """Mandatory sentiment gate: no trade executes without sentiment check."""

    logger.info("sentiment gate check", symbol=signal.symbol, action=signal.action)

    sentiment = await nlp_client.get_sentiment(signal.symbol, market)

    if sentiment is None:
        logger.error("nlp service unreachable - BLOCKING trade", symbol=signal.symbol)
        return None

    score = sentiment.get("sentiment_score", 0)
    label = sentiment.get("sentiment_label", "neutral")

    if signal.action == "buy" and label == "negative" and score < -0.3:
        logger.warning("trade SKIPPED: buy signal but negative sentiment",
                       symbol=signal.symbol, score=score)
        return None

    if signal.action == "sell" and label == "positive" and score > 0.3:
        logger.warning("trade SKIPPED: sell signal but positive sentiment",
                       symbol=signal.symbol, score=score)
        return None

    logger.info("sentiment gate PASSED", label=label, score=score)

    order = await broker.place_order(
        symbol=signal.symbol,
        side=signal.action,
        quantity=signal.quantity,
        price=signal.price,
        stop_loss=signal.stop_loss,
        take_profit=signal.take_profit,
    )

    return TradeResult(
        order_id=order.get("order_id"),
        symbol=signal.symbol,
        side=signal.action,
        entry_price=order.get("entry_price", signal.price),
        quantity=signal.quantity,
        status=order.get("status", "open"),
        sentiment_score=score,
        sentiment_label=label,
    )
```

- [ ] **Step 3: Commit**

```bash
git add trading-service/app/core/nlp_client.py trading-service/app/services/
git commit -m "feat(trading): add NLP client and trade executor with mandatory sentiment gate"
```

---

### Task 5: Backtesting Engine

**Files:**
- Create: `e:\fyp\trading-service\app\services\backtesting.py`

- [ ] **Step 1: Create services/backtesting.py**

```python
from app.bots.registry import create_bot
from app.schemas.backtest import BacktestRequest, BacktestResult
from app.utils.logger import get_logger

logger = get_logger()


async def run_backtest(request: BacktestRequest) -> BacktestResult:
    bot = create_bot(
        bot_type=request.bot_type,
        symbol=request.symbol,
        timeframe=request.timeframe,
        parameters=request.parameters,
    )

    if not request.candles or len(request.candles) < 30:
        return BacktestResult()

    trades = []
    position = None

    for i in range(30, len(request.candles)):
        window = request.candles[:i + 1]
        signal = bot.analyze(window)
        current_price = window[-1]["close"]

        if position is None and signal in ("buy", "sell"):
            sl = bot.calculate_stop_loss(current_price, signal)
            tp = bot.calculate_take_profit(current_price, signal)
            position = {
                "side": signal,
                "entry": current_price,
                "stop_loss": sl,
                "take_profit": tp,
            }

        elif position is not None:
            hit_sl = False
            hit_tp = False
            candle = window[-1]

            if position["side"] == "buy":
                if candle["low"] <= position["stop_loss"]:
                    hit_sl = True
                elif candle["high"] >= position["take_profit"]:
                    hit_tp = True
            else:
                if candle["high"] >= position["stop_loss"]:
                    hit_sl = True
                elif candle["low"] <= position["take_profit"]:
                    hit_tp = True

            if hit_sl or hit_tp:
                exit_price = position["stop_loss"] if hit_sl else position["take_profit"]
                if position["side"] == "buy":
                    pnl_pct = ((exit_price - position["entry"]) / position["entry"]) * 100
                else:
                    pnl_pct = ((position["entry"] - exit_price) / position["entry"]) * 100

                trades.append({"pnl_pct": round(pnl_pct, 4), "win": pnl_pct > 0})
                position = None

    if not trades:
        return BacktestResult()

    wins = [t for t in trades if t["win"]]
    losses = [t for t in trades if not t["win"]]
    total_pnl = sum(t["pnl_pct"] for t in trades)
    gross_profit = sum(t["pnl_pct"] for t in wins) if wins else 0
    gross_loss = abs(sum(t["pnl_pct"] for t in losses)) if losses else 0

    running_pnl = 0.0
    peak = 0.0
    max_dd = 0.0
    for t in trades:
        running_pnl += t["pnl_pct"]
        if running_pnl > peak:
            peak = running_pnl
        dd = peak - running_pnl
        if dd > max_dd:
            max_dd = dd

    return BacktestResult(
        total_trades=len(trades),
        winning_trades=len(wins),
        losing_trades=len(losses),
        win_rate=round(len(wins) / len(trades) * 100, 2),
        total_profit_pct=round(total_pnl, 2),
        max_drawdown_pct=round(max_dd, 2),
        sharpe_ratio=0.0,
        profit_factor=round(gross_profit / gross_loss, 2) if gross_loss > 0 else 0.0,
    )
```

- [ ] **Step 2: Commit**

```bash
git add trading-service/app/services/backtesting.py
git commit -m "feat(trading): add backtesting engine with win rate, PnL, drawdown, profit factor"
```

---

### Task 6: Redis Bot State Tracking

**Files:**
- Create: `e:\fyp\trading-service\app\core\redis_client.py`

- [ ] **Step 1: Create core/redis_client.py**

```python
from app.config.redis import get_redis
from app.utils.logger import get_logger

logger = get_logger()


async def set_bot_status(bot_id: str, status: str):
    redis = await get_redis()
    await redis.set(f"bot:{bot_id}:status", status)


async def get_bot_status(bot_id: str) -> str:
    redis = await get_redis()
    status = await redis.get(f"bot:{bot_id}:status")
    return status or "stopped"


async def increment_losses(bot_id: str) -> int:
    redis = await get_redis()
    count = await redis.incr(f"bot:{bot_id}:losses")
    return count


async def reset_losses(bot_id: str):
    redis = await get_redis()
    await redis.set(f"bot:{bot_id}:losses", 0)


async def get_losses(bot_id: str) -> int:
    redis = await get_redis()
    val = await redis.get(f"bot:{bot_id}:losses")
    return int(val) if val else 0


async def store_bot_params(bot_id: str, params: dict):
    redis = await get_redis()
    await redis.hset(f"bot:{bot_id}:params", mapping={k: str(v) for k, v in params.items()})


async def get_bot_params(bot_id: str) -> dict:
    redis = await get_redis()
    raw = await redis.hgetall(f"bot:{bot_id}:params")
    return dict(raw) if raw else {}
```

- [ ] **Step 2: Commit**

```bash
git add trading-service/app/core/redis_client.py
git commit -m "feat(trading): add Redis bot state tracking (status, losses, params)"
```

---

### Task 7: Performance Monitor

**Files:**
- Create: `e:\fyp\trading-service\app\services\performance_monitor.py`

- [ ] **Step 1: Create services/performance_monitor.py**

```python
from app.core.redis_client import increment_losses, reset_losses, get_losses, set_bot_status
from app.utils.logger import get_logger

logger = get_logger()

LOSS_THRESHOLD = 3


async def record_trade_result(bot_id: str, pnl: float) -> dict:
    """Records trade result and returns action needed."""
    if pnl >= 0:
        await reset_losses(bot_id)
        logger.info("winning trade recorded", bot_id=bot_id, pnl=pnl)
        return {"action": "continue", "consecutive_losses": 0}

    loss_count = await increment_losses(bot_id)
    logger.warning("losing trade recorded", bot_id=bot_id, pnl=pnl,
                    consecutive_losses=loss_count)

    if loss_count >= LOSS_THRESHOLD:
        await set_bot_status(bot_id, "paused")
        logger.error("LOSS THRESHOLD reached - bot paused, agent trigger needed",
                      bot_id=bot_id, consecutive_losses=loss_count)
        return {
            "action": "trigger_agent",
            "consecutive_losses": loss_count,
        }

    return {"action": "continue", "consecutive_losses": loss_count}
```

- [ ] **Step 2: Commit**

```bash
git add trading-service/app/services/performance_monitor.py
git commit -m "feat(trading): add performance monitor with consecutive loss tracking and agent trigger"
```

---

### Task 8: API Routers + Lifespan Wiring

**Files:**
- Create: `e:\fyp\trading-service\app\routers\bots.py`
- Create: `e:\fyp\trading-service\app\routers\backtest.py`
- Modify: `e:\fyp\trading-service\app\routers\health.py`
- Modify: `e:\fyp\trading-service\app\core\lifespan.py`
- Modify: `e:\fyp\trading-service\app\main.py`

- [ ] **Step 1: Create routers/bots.py**

```python
from fastapi import APIRouter, HTTPException
from app.schemas.bot import BotCreate, BotResponse, BotStatusUpdate
from app.bots.registry import create_bot, list_bot_types
from app.core.redis_client import set_bot_status, get_bot_status, store_bot_params, get_losses
from app.utils.logger import get_logger
import uuid

logger = get_logger()
router = APIRouter(prefix="/bots", tags=["bots"])


@router.get("/types")
async def get_bot_types():
    return {"bot_types": list_bot_types()}


@router.post("/", response_model=BotResponse)
async def create_new_bot(request: BotCreate):
    try:
        bot = create_bot(request.bot_type, request.symbol, request.timeframe, request.parameters)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    bot_id = str(uuid.uuid4())[:8]
    await set_bot_status(bot_id, "active")
    await store_bot_params(bot_id, bot.get_parameters())

    return BotResponse(
        id=bot_id,
        bot_type=request.bot_type,
        symbol=request.symbol,
        market=request.market,
        timeframe=request.timeframe,
        parameters=bot.get_parameters(),
        status="active",
    )


@router.get("/{bot_id}", response_model=BotResponse)
async def get_bot(bot_id: str):
    status = await get_bot_status(bot_id)
    if status == "stopped":
        raise HTTPException(status_code=404, detail="Bot not found")

    from app.core.redis_client import get_bot_params
    params = await get_bot_params(bot_id)
    losses = await get_losses(bot_id)

    return BotResponse(
        id=bot_id,
        bot_type=params.get("bot_type", "unknown"),
        symbol=params.get("symbol", ""),
        market=params.get("market", "forex"),
        timeframe=params.get("timeframe", "1h"),
        parameters=params,
        status=status,
        consecutive_losses=losses,
    )


@router.patch("/{bot_id}/status")
async def update_bot_status(bot_id: str, update: BotStatusUpdate):
    if update.status not in ("active", "paused", "stopped"):
        raise HTTPException(status_code=400, detail="Invalid status")
    await set_bot_status(bot_id, update.status)
    return {"bot_id": bot_id, "status": update.status}
```

- [ ] **Step 2: Create routers/backtest.py**

```python
from fastapi import APIRouter, HTTPException
from app.schemas.backtest import BacktestRequest, BacktestResult
from app.services.backtesting import run_backtest

router = APIRouter(tags=["backtest"])


@router.post("/backtest", response_model=BacktestResult)
async def backtest(request: BacktestRequest):
    try:
        result = await run_backtest(request)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Backtest failed: {str(e)}")
```

- [ ] **Step 3: Update routers/health.py**

Replace entirely with:
```python
from datetime import datetime, timezone
from fastapi import APIRouter
from app.core.nlp_client import nlp_client

router = APIRouter()


@router.get("/health")
async def health_check():
    nlp_ok = await nlp_client.is_healthy()
    status = "ok" if nlp_ok else "degraded"

    return {
        "status": status,
        "service": "trading-service",
        "nlp_reachable": nlp_ok,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
```

- [ ] **Step 4: Update core/lifespan.py**

Replace entirely with:
```python
from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.config.redis import get_redis, close_redis
from app.config.database import connect_mongo, close_mongo
from app.core.nlp_client import nlp_client
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
    yield
    await nlp_client.close()
    await close_redis()
    await close_mongo()
    logger.info("trading-service shut down")
```

- [ ] **Step 5: Update main.py**

Replace entirely with:
```python
from fastapi import FastAPI
from app.core.lifespan import lifespan
from app.routers import health, bots, backtest

app = FastAPI(title="TradePilot Trading Service", lifespan=lifespan)

app.include_router(health.router)
app.include_router(bots.router)
app.include_router(backtest.router)
```

- [ ] **Step 6: Commit**

```bash
git add trading-service/
git commit -m "feat(trading): add bot and backtest routers, update health with NLP check, wire lifespan"
```

---

## Plan Self-Review

**Spec coverage:**
- ✅ BaseBot abstract class with analyze, stop_loss, take_profit, position_size, get/update params
- ✅ LowRiskBot sample (RSI + EMA crossover) — placeholder for real strategy
- ✅ Bot registry with create_bot factory
- ✅ Technical indicators (RSI, EMA)
- ✅ BrokerAdapter abstract interface
- ✅ PaperBrokerAdapter with slippage simulation
- ✅ DataProvider abstract interface
- ✅ NLP client for sentiment gate
- ✅ Trade executor with mandatory sentiment check (blocks on NLP unavailable)
- ✅ Backtesting engine (win rate, PnL, drawdown, profit factor)
- ✅ Redis bot state (status, consecutive losses, params)
- ✅ Performance monitor with 3-loss threshold → agent trigger
- ✅ Bot CRUD routes + backtest route
- ✅ Health check reports NLP reachability

**Not in scope (Phase 4):**
- MT5 adapter, CCXT adapter (just abstractions created)
- OANDA/Binance data providers (just abstract interface)
- Redis Streams for agent trigger communication
- DeepSeek agent integration
- WebSocket / Firebase sync
