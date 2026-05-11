# TradePilot — Deployment Diagram

```mermaid
graph TB
    %% ── Developer / User machine ─────────────────────────────────────────────
    subgraph HOST["Host Machine  (Windows 11 / Linux)"]
        subgraph DOCKER["Docker Compose  —  bridge network: tradepilot_net"]

            subgraph FE_CTR["container: frontend"]
                FE_APP["React + TypeScript + shadcn\nVite dev server\nPort 5173→5173"]
            end

            subgraph GW_CTR["container: gateway-service"]
                GW_APP["Node.js / Express\nSocket.IO\nPort 3001→3001"]
                GW_ENV["ENV:\nJWT_SECRET\nGOOGLE_CLIENT_ID\nGOOGLE_CLIENT_SECRET\nMONGO_URI\nREDIS_HOST\nNLP_SERVICE_URL\nTRADING_SERVICE_URL\nAGENT_SERVICE_URL"]
            end

            subgraph NLP_CTR["container: nlp-service"]
                NLP_APP["Python / FastAPI\nPort 8001→8001"]
                NLP_ENV["ENV:\nOLLAMA_REMOTE_URL\nREDIS_HOST\nNEWS_MAX_AGE_HOURS"]
            end

            subgraph TR_CTR["container: trading-service"]
                TR_APP["Python / FastAPI\nPort 8002→8002"]
                TR_ENV["ENV:\nBROKER_MODE\nOANDA_API_KEY\nOANDA_ACCOUNT_ID\nOANDA_BASE_URL\nBINANCE_API_KEY\nMONGO_URI\nREDIS_HOST\nNLP_SERVICE_URL"]
                TR_VOL[("volume: finetuned_bots\n/app/app/bots/finetuned")]
            end

            subgraph AG_CTR["container: agent-service"]
                AG_APP["Python / FastAPI\nPort 8003→8003"]
                AG_ENV["ENV:\nREDIS_HOST\nMONGO_URI\nOLLAMA_REMOTE_URL\nTRADING_SERVICE_URL\nPPO_MODEL_PATH"]
                AG_VOL[("volume: ppo_models\n/app/models")]
                AG_FVOL[("volume: finetuned_bots\n/app/bots/finetuned (read)")]
            end

            subgraph MONGO_CTR["container: mongodb"]
                MONGO_DB[("MongoDB 7\nPort 27017→27017\nDB: tradepilot")]
                MONGO_VOL[("volume: mongo_data\n/data/db")]
                MONGO_COLS["Collections:\ntrade_records\nbot_instances\nbacktest_reports\nfinetuned_bots\noptimization_logs\nusers"]
            end

            subgraph REDIS_CTR["container: redis"]
                REDIS_DB[("Redis 7\nPort 6379→6379")]
                REDIS_KEYS["Keys / Streams:\nbot:{id}:status\nbot:{id}:losses\nbot:{id}:open_trades\nagent.trigger (stream)\nbot.update (stream)\nnews:{symbol}:latest"]
            end
        end

        subgraph OLLAMA_LOCAL["Ollama  (local process, host network)"]
            OL_APP["Ollama Server\nPort 11434"]
            OL_MISTRAL["Model: mistral\n(NLP parse)"]
            OL_FINBERT["Model: FinBERT\n(sentiment)"]
        end

        BROWSER["Browser\nlocalhost:5173"]
    end

    %% ── External services ────────────────────────────────────────────────────
    subgraph CLOUD["External / Cloud Services"]
        OANDA_EXT["OANDA Practice API\napi-fxpractice.oanda.com\nHTTPS :443"]
        DS_EXT["DeepSeek Cloud VM\n129.212.178.8:11434\nModel: deepseek-r1:70b\n(Ollama API)"]
        GOOGLE_EXT["Google OAuth 2.0\naccounts.google.com"]
    end

    %% ── Network connections ──────────────────────────────────────────────────
    BROWSER -->|"HTTP :5173"| FE_CTR
    BROWSER -->|"WS / HTTP :3001"| GW_CTR

    FE_CTR -->|"HTTP REST :3001"| GW_CTR

    GW_CTR -->|"proxy /nlp  :8001"| NLP_CTR
    GW_CTR -->|"proxy /trading  :8002"| TR_CTR
    GW_CTR -->|"proxy /agent  :8003"| AG_CTR
    GW_CTR -->|"MongoDB driver  :27017"| MONGO_CTR

    NLP_CTR -->|"HTTP :11434\nhost.docker.internal"| OLLAMA_LOCAL
    NLP_CTR -->|"Redis client  :6379"| REDIS_CTR

    TR_CTR -->|"MongoDB driver  :27017"| MONGO_CTR
    TR_CTR -->|"Redis client  :6379"| REDIS_CTR
    TR_CTR -->|"HTTP /nlp  :8001"| NLP_CTR
    TR_CTR -->|"HTTPS REST"| OANDA_EXT
    TR_CTR --- TR_VOL

    AG_CTR -->|"Redis client  :6379"| REDIS_CTR
    AG_CTR -->|"MongoDB driver  :27017"| MONGO_CTR
    AG_CTR -->|"HTTP POST /bots/finetune  :8002"| TR_CTR
    AG_CTR -->|"HTTP :11434 (Ollama API)"| DS_EXT
    AG_CTR --- AG_VOL
    AG_CTR --- AG_FVOL

    MONGO_CTR --- MONGO_VOL
    GW_CTR -->|"OAuth redirect"| GOOGLE_EXT

    %% ── Startup dependency order ─────────────────────────────────────────────
    note1["Start order:\n1. mongodb\n2. redis\n3. nlp-service\n4. trading-service\n5. agent-service\n6. gateway-service\n7. frontend"]

    %% ── Port summary ─────────────────────────────────────────────────────────
    note2["Exposed ports (host→container):\n5173 → frontend\n3001 → gateway\n8001 → nlp-service\n8002 → trading-service\n8003 → agent-service\n27017 → mongodb\n6379 → redis"]
```

## Volume Summary

| Volume | Mounted In | Path | Purpose |
|--------|-----------|------|---------|
| `mongo_data` | mongodb | `/data/db` | Persistent trade & bot data |
| `ppo_models` | agent-service | `/app/models` | Trained PPO model weights |
| `finetuned_bots` | trading-service | `/app/app/bots/finetuned` | Agent-generated bot files (write) |
| `finetuned_bots` | agent-service | `/app/bots/finetuned` | Same volume, read access |

## Network Summary

| Network | Type | Members |
|---------|------|---------|
| `tradepilot_net` | Docker bridge | All 7 containers |
| Host loopback | host process | Ollama (Mistral + FinBERT) |
| Internet | HTTPS/443 | OANDA Practice API, Google OAuth |
| Internet | HTTP/11434 | DeepSeek Cloud VM (129.212.178.8) |
