# TradePilot — System Design Specification

## Overview

TradePilot is an AI-powered automated trading platform that accepts natural language trading prompts, converts them into structured trading instructions using a fine-tuned Mistral 7B model, selects and configures rule-based trading bots, and executes trades on forex (MetaTrader 5) and crypto (Binance via CCXT) markets.

The system enforces a mandatory news sentiment gate (FinBERT) before every trade execution, monitors performance in real-time, and triggers an AI reasoning agent (DeepSeek R1) after consecutive losses to adjust bot parameters.

---

## Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Architecture | Hybrid microservices (4 services) | Isolates GPU-heavy inference from trade execution without over-fragmenting |
| Authentication | JWT + API Keys | JWT for user sessions, API keys for programmatic/service access |
| Local GPU | AMD Radeon RX 6500 XT (4 GB VRAM) | Consumer AMD card — no CUDA, no bitsandbytes, limited ROCm. All local inference runs on CPU. |
| Remote GPU | AMD Developer Cloud (DigitalOcean) — AMD Instinct MI210/MI250 (64-128 GB HBM) | $100 credit, used for DeepSeek R1 inference only |
| Mistral 7B hosting | Ollama on local machine (CPU) as `tradepilot-mistral` | Unsloth-trained, merged, converted to GGUF Q4_K_M (~4.1 GB). Imported into Ollama. CPU inference ~7 tok/s, ~15s per request. GGUF source: `E:\fyp with claude\tradepilot_mistral_FINAL\tradepilot-mistral-Q4_K_M.gguf` |
| FinBERT hosting | transformers on local CPU using `tabularisai/ModernFinBERT` from HuggingFace Hub | ~110M params, fast on CPU (<1s per request). Downloaded from Hub on first startup, cached locally. |
| DeepSeek R1 hosting | Ollama on remote AMD GPU VM (AMD Developer Cloud) | `deepseek-r1:14b` on AMD Instinct GPU via ROCm. Agent service connects via `http://<vm-ip>:11434`. VM spun up only when needed to conserve credit. |
| Inter-service sync | REST (request/response operations) | Prompt parsing, sentiment checks, health monitoring |
| Inter-service async | Redis Streams (pipeline operations) | Trade execution, bot monitoring, agent triggering |
| Forex data source | OANDA API | Candles, ticks, historical data |
| Forex execution | MetaTrader 5 Python library | Windows-only, direct broker execution |
| Crypto data + execution | CCXT (Binance) | Data and execution from single library |
| News sources | ForexFactory (forex, scraping) + X (forex + crypto, API + scraper fallback) + CoinTelegraph RSS (crypto) | Feed FinBERT sentiment analysis per asset class |
| Sentiment policy | Hard gate — no trade executes without sentiment check | Risk management: never trade blind into news |
| DeepSeek degradation | Graceful — if agent triggered and remote Ollama unreachable, bot stays paused until recovery or manual intervention. Remote being down does NOT affect bots that haven't triggered the agent. | Agent is enhancement; its unavailability only matters when 3+ losses trigger it |
| Backtesting data | Pre-ingested from OANDA/Binance into local cache | Avoids API rate limits, reduces latency |
| Paper trading | PaperBrokerAdapter behind same interface | Required for testing before live trading |
| Database | MongoDB (persistence) + Redis (state + streams) | MongoDB for trades/users/configs, Redis for real-time |
| Dashboard sync | Firebase Firestore | Real-time dashboard state for frontend |
| Containerization | Docker Compose | All services + MongoDB + Redis orchestrated together |

---

## Model Preparation (Pre-requisites)

Before the system runs, these one-time steps must be completed:

**Mistral 7B (LoRA → GGUF conversion):**
1. Load base Mistral 7B + your LoRA adapter in Python (on Colab or any machine with enough RAM)
2. Merge adapter: `model = model.merge_and_unload()`
3. Save merged model to disk
4. Convert to GGUF using `llama.cpp/convert_hf_to_gguf.py`
5. Quantize: `llama-quantize model.gguf model-Q4_K_M.gguf Q4_K_M`
6. Import into local Ollama: create `Modelfile` → `ollama create tradepilot-mistral -f Modelfile`

**FinBERT:**
1. Fine-tune on Colab (financial news dataset)
2. Save model weights + tokenizer to disk
3. Copy to local machine, place in `nlp-service/models/finbert/`
4. Loaded by NLP service at startup via `transformers.AutoModelForSequenceClassification`

**DeepSeek R1 (remote):**
1. Provision AMD GPU VM on AMD Developer Cloud
2. Install Ollama (ROCm build): `curl -fsSL https://ollama.com/install.sh | sh`
3. Pull model: `olla ma pull deepseek-r1:14b`
4. Configure firewall to allow port 11434 from your IP only
5. Note the VM's public IP for agent service config

---

## Service Map

```
                    CLIENTS (Web Dashboard / API)
                           │
                           ▼  HTTP / WebSocket
              ┌─────────────────────────┐
              │   GATEWAY SERVICE       │
              │   (Node.js / Express)   │
              └────┬───────┬───────┬────┘
                   │       │       │
          REST     │  REST │  REST │
                   ▼       ▼       ▼
           ┌──────────┐ ┌──────────────┐ ┌──────────────┐
           │ NLP SVC  │ │ TRADING SVC  │ │ AGENT SVC    │
           │ (FastAPI) │ │ (FastAPI)    │ │ (FastAPI)    │
           └──────────┘ └──────────────┘ └──────────────┘
                              │
                   ┌──────────┼──────────┐
                   ▼          ▼          ▼
              MongoDB      Redis     External APIs
                                    (OANDA, MT5, Binance, X)
```

---

## Service 1: Gateway Service (Node.js / Express)

**Port:** 3000

**Responsibilities:**
- JWT + API Key authentication and authorization
- Request validation and rate limiting
- Route orchestration to downstream services
- WebSocket hub for real-time client updates
- Firebase Firestore sync for dashboard state
- Publishes trade requests to Redis Stream `trade.requests`
- Subscribes to Redis Stream `trade.results` to push updates to clients
- Structured JSON logging with correlation IDs

**Folder structure:**
```
gateway-service/
├── src/
│   ├── config/
│   │   ├── index.js              # env vars, service URLs
│   │   ├── database.js           # MongoDB connection
│   │   ├── redis.js              # Redis connection
│   │   └── firebase.js           # Firebase Admin SDK init
│   ├── middleware/
│   │   ├── auth.js               # JWT verification + API key validation
│   │   ├── rateLimiter.js        # per-user rate limiting
│   │   ├── errorHandler.js       # centralized error handling
│   │   ├── correlationId.js      # generates/propagates correlation IDs
│   │   └── validator.js          # request schema validation
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth (login, register, refresh)
│   │   ├── tradeRoutes.js        # /api/trades (proxy to trading service)
│   │   ├── botRoutes.js          # /api/bots (proxy to trading service)
│   │   ├── nlpRoutes.js          # /api/parse, /api/sentiment (proxy to NLP)
│   │   └── agentRoutes.js        # /api/agent (proxy to agent service)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── tradeController.js
│   │   ├── botController.js
│   │   └── nlpController.js
│   ├── services/
│   │   ├── firebaseSync.js       # syncs bot state to Firestore
│   │   ├── websocketManager.js   # WebSocket connection management
│   │   ├── redisStreams.js        # Redis Stream publish/subscribe
│   │   └── serviceProxy.js       # HTTP client to downstream services
│   ├── models/
│   │   ├── User.js               # MongoDB user schema
│   │   ├── Trade.js              # MongoDB trade record schema
│   │   └── BotConfig.js          # MongoDB bot configuration schema
│   ├── utils/
│   │   ├── logger.js             # structured JSON logger
│   │   ├── errors.js             # custom error classes
│   │   └── jwt.js                # JWT sign/verify helpers
│   └── app.js                    # Express app setup
├── package.json
├── Dockerfile
└── .env.example
```

**MongoDB schemas:**

**User:**
- `_id`, `email`, `passwordHash`, `apiKey`, `role`, `createdAt`, `updatedAt`

**Trade:**
- `_id`, `userId`, `botId`, `symbol`, `side` (buy/sell), `entryPrice`, `exitPrice`, `quantity`, `pnl`, `status` (pending/open/closed/cancelled), `sentimentScore`, `sentimentLabel`, `executedAt`, `closedAt`, `metadata`

**BotConfig:**
- `_id`, `userId`, `botType`, `symbol`, `market` (forex/crypto), `parameters` (JSON), `status` (active/paused/stopped), `consecutiveLosses`, `createdAt`, `updatedAt`

---

## Service 2: NLP Service (FastAPI)

**Port:** 8001

**Responsibilities:**
- `/parse` — Mistral 7B via local Ollama (GGUF on CPU): natural language → structured JSON
- `/sentiment` — FinBERT via transformers (CPU): news → sentiment score + label
- `/news` — returns latest cached news for a symbol
- `/health` — reports model loaded status (trading service monitors this)
- Background news collector: scrapes ForexFactory + X + CoinTelegraph on schedule
- FinBERT loaded once at startup, held in CPU memory. Mistral served by local Ollama (always running).

**Folder structure:**
```
nlp-service/
├── app/
│   ├── config/
│   │   ├── settings.py           # env vars, model paths, intervals
│   │   └── redis.py              # Redis connection
│   ├── routers/
│   │   ├── parse.py              # POST /parse
│   │   ├── sentiment.py          # POST /sentiment
│   │   ├── news.py               # GET /news/{symbol}
│   │   └── health.py             # GET /health
│   ├── services/
│   │   ├── mistral_service.py    # calls local Ollama (tradepilot-mistral GGUF model)
│   │   ├── finbert_service.py    # loads FinBERT via transformers (CPU), runs sentiment
│   │   └── news_service.py       # orchestrates scrapers, caches results
│   ├── scrapers/
│   │   ├── base_scraper.py       # abstract scraper interface
│   │   ├── forexfactory.py       # ForexFactory calendar/news scraper
│   │   ├── x_scraper.py          # X API + Nitter fallback scraper
│   │   └── cointelegraph.py      # CoinTelegraph RSS feed parser (crypto news)
│   ├── schemas/
│   │   ├── parse.py              # ParseRequest, ParseResponse
│   │   ├── sentiment.py          # SentimentRequest, SentimentResponse
│   │   └── news.py               # NewsItem, NewsResponse
│   ├── core/
│   │   ├── ollama_client.py      # HTTP client to local Ollama for Mistral
│   │   ├── model_loader.py       # loads FinBERT at startup (CPU)
│   │   └── lifespan.py           # FastAPI lifespan (startup/shutdown)
│   ├── workers/
│   │   └── news_collector.py     # background scheduled news collection
│   └── utils/
│       ├── logger.py             # structured JSON logger
│       └── preprocessing.py      # text cleaning, tokenization helpers
├── models/                       # LOCAL directory: FinBERT weights stored here (Mistral served by Ollama separately)
├── requirements.txt
├── Dockerfile
└── .env.example
```

**Mistral parse output schema (example):**
```json
{
  "action": "buy",
  "symbol": "EURUSD",
  "market": "forex",
  "risk_level": "low",
  "strategy_hint": "trend_following",
  "stop_loss_pips": 30,
  "take_profit_pips": 60,
  "timeframe": "1h",
  "amount": null,
  "confidence": 0.87
}
```

**Sentiment endpoint contract:**

The `/sentiment` endpoint accepts a **symbol** (not raw text). The NLP service internally:
1. Looks up cached news for that symbol from its news store (Redis + MongoDB)
2. Maps symbol to relevant news sources: forex symbols → ForexFactory + X, crypto symbols → CoinTelegraph + X
3. Filters news by recency (configurable window, default 4 hours)
4. Runs FinBERT on aggregated headlines/text
5. Returns composite sentiment

**News-to-symbol mapping:**
- ForexFactory: events tagged by currency (EUR, USD, GBP) → mapped to pairs containing that currency
- X: filtered by cashtag (`$EURUSD`, `$BTC`, `$ETH`) and keyword matching
- CoinTelegraph RSS: filtered by coin name / ticker in title and body

**Request:** `POST /sentiment { "symbol": "EURUSD", "market": "forex" }`

**Response:**
```json
{
  "symbol": "EURUSD",
  "sentiment_score": -0.42,
  "sentiment_label": "negative",
  "news_count": 12,
  "top_headlines": ["ECB signals rate pause...", "..."],
  "source_breakdown": {"forexfactory": 5, "x": 7},
  "timestamp": "2026-04-05T16:00:00Z"
}
```

---

## Service 3: Trading Service (FastAPI)

**Port:** 8002

**Responsibilities:**
- Bot lifecycle management (start, pause, resume, stop)
- Bot selection based on parsed JSON from NLP
- Backtesting engine (win rate, profit %, drawdown)
- Background data ingestion from OANDA + Binance
- **Mandatory pre-trade sentiment gate** — calls NLP service before every execution
- Trade execution via BrokerAdapter (MT5 / CCXT / Paper)
- P&L monitoring, consecutive loss tracking in Redis
- Publishes to `agent.trigger` Redis Stream when losses >= 3
- Consumes `bot.update` Redis Stream for parameter changes from agent

**Folder structure:**
```
trading-service/
├── app/
│   ├── config/
│   │   ├── settings.py           # env vars, broker configs
│   │   ├── redis.py              # Redis connection
│   │   └── database.py           # MongoDB connection
│   ├── routers/
│   │   ├── bots.py               # /bots CRUD + lifecycle
│   │   ├── backtest.py           # POST /backtest
│   │   ├── trades.py             # /trades history + status
│   │   └── health.py             # GET /health
│   ├── services/
│   │   ├── bot_manager.py        # bot lifecycle (start/pause/resume/stop)
│   │   ├── bot_selector.py       # maps parsed JSON → bot type + params
│   │   ├── backtesting.py        # backtesting engine
│   │   ├── data_ingestion.py     # background OANDA/Binance data collector
│   │   ├── trade_executor.py     # sentiment gate + broker execution
│   │   └── performance_monitor.py # P&L tracking, loss counting
│   ├── bots/
│   │   ├── base_bot.py           # abstract BaseBot class
│   │   ├── low_risk_bot.py       # RSI + EMA strategy
│   │   └── registry.py           # bot type registry
│   ├── adapters/
│   │   ├── broker_adapter.py     # abstract BrokerAdapter interface
│   │   ├── mt5_adapter.py        # MetaTrader 5 execution
│   │   ├── ccxt_adapter.py       # Binance via CCXT execution
│   │   ├── paper_adapter.py      # simulated paper trading
│   │   ├── data_provider.py      # abstract DataProvider interface
│   │   ├── oanda_provider.py     # OANDA candle/tick fetching
│   │   └── ccxt_provider.py      # Binance candle/tick fetching
│   ├── schemas/
│   │   ├── bot.py                # BotCreate, BotResponse, BotStatus
│   │   ├── backtest.py           # BacktestRequest, BacktestResult
│   │   └── trade.py              # TradeSignal, TradeResult
│   ├── core/
│   │   ├── redis_client.py       # Redis operations + stream helpers
│   │   ├── circuit_breaker.py    # circuit breaker for external APIs
│   │   ├── lifespan.py           # FastAPI lifespan
│   │   └── nlp_client.py         # HTTP client to NLP service (sentiment gate)
│   ├── workers/
│   │   ├── trade_worker.py       # consumes trade.requests stream
│   │   ├── update_worker.py      # consumes bot.update stream
│   │   └── monitor_worker.py     # background P&L monitor
│   └── utils/
│       ├── logger.py
│       ├── indicators.py         # RSI, EMA, technical indicator calculations
│       └── errors.py
├── requirements.txt
├── Dockerfile
└── .env.example
```

**Abstract interfaces:**

**DataProvider:**
- `fetch_candles(symbol, timeframe, count)` → list of OHLCV candles
- `fetch_tick(symbol)` → latest bid/ask
- `stream_candles(symbol, timeframe, callback)` → real-time candle stream

**BrokerAdapter:**
- `place_order(symbol, side, quantity, order_type, price?)` → order ID
- `close_order(order_id)` → result
- `get_position(symbol)` → current position
- `get_account_balance()` → balance info

**BaseBot:**
- `analyze(candles)` → signal (buy/sell/hold)
- `calculate_position_size(balance, risk_pct)` → quantity
- `get_parameters()` → dict
- `update_parameters(new_params)` → void

**Backtesting output:**
```json
{
  "total_trades": 48,
  "winning_trades": 31,
  "losing_trades": 17,
  "win_rate": 64.58,
  "total_profit_pct": 12.4,
  "max_drawdown_pct": 3.2,
  "sharpe_ratio": 1.8,
  "profit_factor": 2.1,
  "avg_trade_duration": "2h 15m"
}
```

**Bot analysis loop (what triggers signal generation):**

Each active bot runs a periodic analysis loop driven by its configured timeframe:
1. Bot registers with `bot_manager` with a timeframe (e.g. `1h`, `15m`, `4h`)
2. `monitor_worker` runs a scheduler that fires each bot's `analyze()` at every candle close for its timeframe
3. The scheduler uses locally-cached candle data (from `data_ingestion` background worker)
4. When `analyze()` returns `buy` or `sell`, the signal enters the pre-trade sentiment gate
5. When `analyze()` returns `hold`, no action — wait for next candle

**Pre-trade sentiment gate flow:**
1. Bot generates a trade signal (buy/sell)
2. `trade_executor` calls NLP service `POST /sentiment` with the symbol
3. If NLP service unreachable → PAUSE bot, alert dashboard via WebSocket, do NOT execute
4. If sentiment is strongly negative and signal is buy → SKIP trade, log reason
5. If sentiment is strongly positive and signal is sell → SKIP trade, log reason
6. If sentiment passes → execute via BrokerAdapter
7. Record trade in MongoDB with sentiment metadata

**Paper trading adapter:**

`PaperBrokerAdapter` implements the same `BrokerAdapter` interface but simulates execution:
- Uses real-time price data from DataProvider (OANDA/CCXT) for realistic fills
- Tracks a virtual balance, open positions, and P&L in Redis
- Simulates slippage (configurable, default 0.5 pips forex, 0.1% crypto)
- No real orders placed — all state is in-memory + Redis
- Selected via config: `BROKER_MODE=paper|live` in trading-service `.env`

---

## Service 4: Agent Service (FastAPI)

**Port:** 8003

**Responsibilities:**
- Consumes `agent.trigger` Redis Stream
- Calls DeepSeek R1 via Ollama for reasoning about consecutive losses
- Optionally runs PPO optimization (Stable-Baselines3) for parameter tuning
- Publishes optimized parameters to `bot.update` Redis Stream
- If Ollama unreachable → logs warning, bot stays paused until manual intervention or recovery

**Folder structure:**
```
agent-service/
├── app/
│   ├── config/
│   │   ├── settings.py           # env vars, remote Ollama URL (AMD Developer Cloud VM)
│   │   └── redis.py              # Redis connection
│   ├── routers/
│   │   ├── reason.py             # POST /reason (manual trigger)
│   │   ├── optimize.py           # POST /optimize (PPO)
│   │   └── health.py             # GET /health
│   ├── services/
│   │   ├── deepseek_service.py   # DeepSeek R1 via remote Ollama (AMD Developer Cloud)
│   │   └── ppo_optimizer.py      # PPO via Stable-Baselines3
│   ├── schemas/
│   │   ├── reason.py             # ReasonRequest, ReasonResponse
│   │   └── optimize.py           # OptimizeRequest, OptimizeResponse
│   ├── core/
│   │   ├── ollama_client.py      # HTTP client to remote Ollama (AMD Developer Cloud VM)
│   │   └── lifespan.py           # FastAPI lifespan
│   ├── workers/
│   │   └── agent_worker.py       # consumes agent.trigger stream
│   └── utils/
│       └── logger.py
├── requirements.txt
├── Dockerfile
└── .env.example
```

**Agent trigger flow:**
1. Trading service detects `consecutive_losses >= 3`
2. Publishes to `agent.trigger` stream with context: bot config, last N trades, market data
3. Agent service pauses bot via Redis (`bot_status: paused`)
4. Builds prompt for DeepSeek R1 with full trade context
5. DeepSeek reasons: what went wrong, what to adjust
6. Agent extracts new parameters from DeepSeek response
7. (Optional) PPO refines parameters using historical data
8. Publishes to `bot.update` stream with new parameters
9. Trading service updates bot, resumes with new params

**DeepSeek prompt template (example):**
```
You are a trading strategy analyst. A trading bot has experienced 3 consecutive losses.

Bot type: LowRiskBot (RSI + EMA crossover)
Current parameters: RSI period=14, EMA fast=9, EMA slow=21, stop_loss=30 pips
Market: EURUSD, 1H timeframe
Recent trades: [last 10 trades with entry/exit/pnl]
Current market conditions: [latest candles summary]

Analyze what went wrong and suggest specific parameter adjustments.
Return your response as JSON: {"rsi_period": ..., "ema_fast": ..., "ema_slow": ..., "stop_loss_pips": ..., "reasoning": "..."}
```

---

## Redis Streams Architecture

| Stream | Producer | Consumer | Payload |
|--------|----------|----------|---------|
| `trade.requests` | Gateway Service | Trading Service | `{userId, parsedJson, botConfigId, correlationId}` |
| `trade.results` | Trading Service | Gateway Service | `{tradeId, status, pnl, sentimentScore, correlationId}` |
| `agent.trigger` | Trading Service | Agent Service | `{botConfigId, lastTrades[], marketData, consecutiveLosses}` |
| `bot.update` | Agent Service | Trading Service | `{botConfigId, newParameters, reasoning}` |

---

## Redis State Keys

| Key Pattern | Type | Purpose |
|-------------|------|---------|
| `bot:{botId}:status` | String | active / paused / stopped |
| `bot:{botId}:losses` | String (int) | consecutive loss counter |
| `bot:{botId}:params` | Hash | current bot parameters |
| `bot:{botId}:last_trade` | Hash | last trade result |
| `nlp:health` | String | healthy / unhealthy (monitored by trading service) |
| `news:{symbol}:latest` | List | cached news headlines per symbol |

---

## Docker Compose Topology

```yaml
services:
  gateway:        # Node.js, port 3000
  nlp-service:    # FastAPI, port 8001, FinBERT model volume mount
  trading-service: # FastAPI, port 8002
  agent-service:  # FastAPI, port 8003
  mongodb:        # MongoDB 7, port 27017
  redis:          # Redis 7, port 6379
```

**Ollama (local — Mistral):**
- Runs natively on Windows host (CPU inference)
- Serves `tradepilot-mistral` (GGUF Q4_K_M) for NLP prompt parsing
- NLP service accesses via `host.docker.internal:11434`

**Ollama (remote — DeepSeek):**
- Runs on AMD Developer Cloud VM (AMD Instinct GPU via ROCm)
- Serves `deepseek-r1:14b` for agent reasoning
- Agent service accesses via `http://<vm-ip>:11434`
- VM spun up/down as needed to conserve $100 credit

**MT5 constraint:** The MetaTrader 5 Python library requires the MT5 desktop terminal running on the same OS. It cannot run inside a standard Linux container. The trading-service runs **natively on Windows** (not in Docker) during development and for MT5 operations. For production, use Docker for all services except trading-service, which runs as a native Windows process. CCXT/Binance operations work in Docker regardless.

**Other notes:**
- FinBERT weights mounted as volume into nlp-service container at `/app/models/finbert/`
- All services share a Docker network for internal communication (trading-service connects via host network when running natively)
- Environment variables via `.env` files per service

---

## Cross-Cutting Concerns

**Structured Logging:**
- All services emit JSON logs with `timestamp`, `level`, `service`, `correlationId`, `message`, `data`
- Correlation ID generated at gateway, propagated to all downstream calls via header `X-Correlation-ID`

**Circuit Breakers:**
- Wrap OANDA, MT5, Binance, Ollama, and X API calls
- States: closed (normal) → open (failing, fast-fail) → half-open (test recovery)
- Configurable thresholds per external service

**Health Checks:**
- Every service exposes `GET /health`
- Gateway monitors downstream health and reports aggregate status
- Trading service specifically monitors NLP health for sentiment gate

**Error Handling:**
- Custom exception classes per service
- Centralized error middleware returns consistent error JSON
- External API failures never crash the service — caught, logged, circuit-broken

---

## Constraints

- No OpenAI, Anthropic, or paid APIs — all models are open-source (Mistral, FinBERT, DeepSeek)
- Local hardware: AMD Radeon RX 6500 XT (4 GB) — no CUDA, all local inference on CPU
- Remote hardware: AMD Developer Cloud ($100 credit) — DeepSeek R1 only
- MetaTrader 5 Python library is Windows-only — trading-service runs natively, not in Docker
- Bots are rule-based only — AI adjusts parameters externally, never inside bot logic
- FinBERT sentiment is a hard gate — no trade executes without it
- DeepSeek agent is enhancement only — system operates without it (bots pause, not crash)
- Mistral 7B must be converted from LoRA adapter → merged model → GGUF before deployment
