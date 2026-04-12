# TradePilot Component Diagram

This component view is based on the current implementation in:
- `gateway-service/src/routes/proxyRoutes.js`
- `gateway-service/src/services/serviceProxy.js`
- `trading-service/app/core/lifespan.py`
- `trading-service/app/services/agent_trigger.py`
- `agent-service/app/workers/agent_worker.py`
- `nlp-service/app/core/lifespan.py`

## UML Component View (Mermaid)

```mermaid
classDiagram
    direction LR

    class Frontend <<component>>
    class GatewayService <<component>>
    class TradingService <<component>>
    class NLPService <<component>>
    class AgentService <<component>>
    class MongoDB <<component>>
    class Redis <<component>>
    class OandaAPI <<component>>
    class BinanceCCXT <<component>>
    class NewsSources <<component>>
    class Ollama <<component>>

    Frontend ..> GatewayService : HTTP /api

    GatewayService ..> TradingService : REST proxy
    GatewayService ..> NLPService : REST proxy
    GatewayService ..> AgentService : REST proxy
    GatewayService ..> MongoDB : users/brokers
    GatewayService ..> Redis : pub/sub + cache

    TradingService ..> MongoDB : bots/trades/reports
    TradingService ..> Redis : workers + stream publish
    TradingService ..> NLPService : /sentiment
    TradingService ..> OandaAPI : forex data/orders
    TradingService ..> BinanceCCXT : crypto data/orders

    AgentService ..> MongoDB : optimization_logs
    AgentService ..> Redis : stream consume/publish
    AgentService ..> Ollama : reasoning/LLM

    NLPService ..> Redis : cache + worker state
    NLPService ..> NewsSources : scrape news
    NLPService ..> Ollama : model health/checks
```

## Provided and Required Interfaces

| Component | Provides | Requires |
|---|---|---|
| Frontend | `IUserDashboard` | `IWebFrontDoor` |
| Gateway Service | `IWebFrontDoor` (`/api/*`, auth, WS health) | `ITradingApi`, `INlpApi`, `IAgentApi`, `IMongoStore`, `IRedisBus` |
| Trading Service | `ITradingApi` (bots, trades, backtest, data, broker) | `INlpApi`, `IMongoStore`, `IRedisBus`, `IForexMarket`, `ICryptoMarket` |
| NLP Service | `INlpApi` (parse, sentiment, news) | `IRedisBus`, `INewsFeeds`, `IOllamaInference` |
| Agent Service | `IAgentApi` (reasoning, PPO, optimization logs) | `IMongoStore`, `IRedisBus`, `IOllamaInference` |
| MongoDB | `IMongoStore` | - |
| Redis | `IRedisBus` (cache, pub/sub, streams) | - |
| OANDA API | `IForexMarket` | credentials/network |
| Binance via CCXT | `ICryptoMarket` | credentials/network |
| News Sources | `INewsFeeds` | internet access |
| Ollama | `IOllamaInference` | model runtime/network |

## Notes

- `Gateway -> Trading/NLP/Agent` is synchronous HTTP proxying.
- `Trading -> Agent` behavior is asynchronous in practice via Redis stream (`agent.trigger` / `bot.update`), not direct REST.
- If you need strict UML ball-and-socket notation for grading, use this interface table directly in EdrawMax/StarUML and wire the same dependencies.
