# TradePilot Phase 1: Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold all 4 microservices with working inter-service communication, auth, database connections, and Docker orchestration.

**Architecture:** 4 services (Node.js gateway + 3 FastAPI Python services) connected via REST, sharing MongoDB and Redis. Gateway handles auth and routing; downstream services expose health endpoints. Docker Compose orchestrates everything except Ollama (host-native) and trading-service (native Windows for MT5).

**Tech Stack:** Node.js 20, Express 4, Python 3.11, FastAPI, MongoDB 7 (Mongoose), Redis 7 (ioredis/aioredis), Docker Compose, JWT (jsonwebtoken), bcrypt, Winston logger, structlog

---

## File Structure

```
e:\fyp\
├── docker-compose.yml
├── .env
├── .gitignore
├── gateway-service/
│   ├── package.json
│   ├── Dockerfile
│   ├── .env.example
│   └── src/
│       ├── app.js
│       ├── config/
│       │   ├── index.js
│       │   ├── database.js
│       │   └── redis.js
│       ├── middleware/
│       │   ├── auth.js
│       │   ├── errorHandler.js
│       │   └── correlationId.js
│       ├── routes/
│       │   ├── authRoutes.js
│       │   └── proxyRoutes.js
│       ├── controllers/
│       │   └── authController.js
│       ├── services/
│       │   └── serviceProxy.js
│       ├── models/
│       │   └── User.js
│       └── utils/
│           ├── logger.js
│           ├── errors.js
│           └── jwt.js
├── nlp-service/
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── .env.example
│   └── app/
│       ├── main.py
│       ├── config/
│       │   ├── settings.py
│       │   └── redis.py
│       ├── routers/
│       │   └── health.py
│       ├── core/
│       │   └── lifespan.py
│       └── utils/
│           └── logger.py
├── trading-service/
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── .env.example
│   └── app/
│       ├── main.py
│       ├── config/
│       │   ├── settings.py
│       │   ├── redis.py
│       │   └── database.py
│       ├── routers/
│       │   └── health.py
│       ├── core/
│       │   └── lifespan.py
│       └── utils/
│           └── logger.py
└── agent-service/
    ├── requirements.txt
    ├── Dockerfile
    ├── .env.example
    └── app/
        ├── main.py
        ├── config/
        │   ├── settings.py
        │   └── redis.py
        ├── routers/
        │   └── health.py
        ├── core/
        │   └── lifespan.py
        └── utils/
            └── logger.py
```

---

### Task 1: Project Root Scaffolding

**Files:**
- Create: `e:\fyp\.gitignore`
- Create: `e:\fyp\.env`
- Create: `e:\fyp\docker-compose.yml`

- [ ] **Step 1: Create .gitignore**

```gitignore
node_modules/
__pycache__/
*.pyc
.env
*.egg-info/
dist/
build/
.venv/
venv/
*.log
.DS_Store
models/finbert/
*.gguf
```

- [ ] **Step 2: Create root .env file**

```env
# MongoDB
MONGO_URI=mongodb://mongodb:27017/tradepilot
MONGO_DB_NAME=tradepilot

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# JWT
JWT_SECRET=changeme-generate-a-real-secret-in-production
JWT_EXPIRES_IN=24h

# Service URLs (internal Docker network)
NLP_SERVICE_URL=http://nlp-service:8001
TRADING_SERVICE_URL=http://trading-service:8002
AGENT_SERVICE_URL=http://agent-service:8003

# Ollama (local on host for Mistral)
OLLAMA_LOCAL_URL=http://host.docker.internal:11434

# Ollama (remote AMD Developer Cloud for DeepSeek)
OLLAMA_REMOTE_URL=http://REPLACE_WITH_VM_IP:11434

# Gateway
GATEWAY_PORT=3000
```

- [ ] **Step 3: Create docker-compose.yml**

```yaml
version: "3.8"

services:
  mongodb:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    healthcheck:
      test: echo 'db.runCommand("ping").ok' | mongosh --quiet
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  gateway:
    build: ./gateway-service
    ports:
      - "3000:3000"
    env_file:
      - .env
      - ./gateway-service/.env.example
    depends_on:
      mongodb:
        condition: service_healthy
      redis:
        condition: service_healthy
    extra_hosts:
      - "host.docker.internal:host-gateway"

  nlp-service:
    build: ./nlp-service
    ports:
      - "8001:8001"
    env_file:
      - .env
      - ./nlp-service/.env.example
    depends_on:
      redis:
        condition: service_healthy
    extra_hosts:
      - "host.docker.internal:host-gateway"

  agent-service:
    build: ./agent-service
    ports:
      - "8003:8003"
    env_file:
      - .env
      - ./agent-service/.env.example
    depends_on:
      redis:
        condition: service_healthy

volumes:
  mongo_data:
```

Note: `trading-service` is excluded from Docker Compose because it runs natively on Windows for MT5 compatibility.

- [ ] **Step 4: Verify files created**

Run: `dir e:\fyp\.gitignore && dir e:\fyp\.env && dir e:\fyp\docker-compose.yml`
Expected: All three files exist.

- [ ] **Step 5: Initialize git repo and commit**

```bash
cd e:\fyp
git init
git add .gitignore .env docker-compose.yml
git commit -m "chore: project root scaffolding with docker-compose"
```

---

### Task 2: Gateway Service Scaffolding

**Files:**
- Create: `e:\fyp\gateway-service\package.json`
- Create: `e:\fyp\gateway-service\.env.example`
- Create: `e:\fyp\gateway-service\Dockerfile`
- Create: `e:\fyp\gateway-service\src\config\index.js`
- Create: `e:\fyp\gateway-service\src\utils\logger.js`
- Create: `e:\fyp\gateway-service\src\utils\errors.js`
- Create: `e:\fyp\gateway-service\src\middleware\errorHandler.js`
- Create: `e:\fyp\gateway-service\src\middleware\correlationId.js`
- Create: `e:\fyp\gateway-service\src\app.js`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "tradepilot-gateway",
  "version": "1.0.0",
  "description": "TradePilot API Gateway - auth, routing, orchestration",
  "main": "src/app.js",
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js"
  },
  "dependencies": {
    "express": "^4.21.0",
    "mongoose": "^8.8.0",
    "ioredis": "^5.4.0",
    "jsonwebtoken": "^9.0.0",
    "bcryptjs": "^2.4.3",
    "axios": "^1.7.0",
    "cors": "^2.8.5",
    "helmet": "^8.0.0",
    "express-rate-limit": "^7.4.0",
    "uuid": "^10.0.0",
    "winston": "^3.15.0",
    "dotenv": "^16.4.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.0"
  }
}
```

- [ ] **Step 2: Create .env.example**

```env
GATEWAY_PORT=3000
NODE_ENV=development
```

- [ ] **Step 3: Create Dockerfile**

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "src/app.js"]
```

- [ ] **Step 4: Create config/index.js**

```javascript
require("dotenv").config();

const config = {
  port: parseInt(process.env.GATEWAY_PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  mongo: {
    uri: process.env.MONGO_URI || "mongodb://localhost:27017/tradepilot",
  },
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  },
  jwt: {
    secret: process.env.JWT_SECRET || "dev-secret-change-me",
    expiresIn: process.env.JWT_EXPIRES_IN || "24h",
  },
  services: {
    nlp: process.env.NLP_SERVICE_URL || "http://localhost:8001",
    trading: process.env.TRADING_SERVICE_URL || "http://localhost:8002",
    agent: process.env.AGENT_SERVICE_URL || "http://localhost:8003",
  },
};

module.exports = config;
```

- [ ] **Step 5: Create utils/logger.js**

```javascript
const winston = require("winston");
const config = require("../config");

const logger = winston.createLogger({
  level: config.nodeEnv === "production" ? "info" : "debug",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: "gateway" },
  transports: [new winston.transports.Console()],
});

module.exports = logger;
```

- [ ] **Step 6: Create utils/errors.js**

```javascript
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

class ValidationError extends AppError {
  constructor(message = "Validation failed") {
    super(message, 400);
  }
}

module.exports = { AppError, NotFoundError, UnauthorizedError, ValidationError };
```

- [ ] **Step 7: Create middleware/errorHandler.js**

```javascript
const logger = require("../utils/logger");

function errorHandler(err, req, res, _next) {
  const correlationId = req.correlationId || "unknown";
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : "Internal server error";

  logger.error({
    message: err.message,
    statusCode,
    correlationId,
    stack: err.stack,
  });

  res.status(statusCode).json({
    error: {
      message,
      correlationId,
    },
  });
}

module.exports = errorHandler;
```

- [ ] **Step 8: Create middleware/correlationId.js**

```javascript
const { v4: uuidv4 } = require("uuid");

function correlationId(req, _res, next) {
  req.correlationId = req.headers["x-correlation-id"] || uuidv4();
  next();
}

module.exports = correlationId;
```

- [ ] **Step 9: Create app.js**

```javascript
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const config = require("./config");
const logger = require("./utils/logger");
const errorHandler = require("./middleware/errorHandler");
const correlationId = require("./middleware/correlationId");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(correlationId);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "gateway", timestamp: new Date().toISOString() });
});

app.use(errorHandler);

app.listen(config.port, () => {
  logger.info(`Gateway service running on port ${config.port}`);
});

module.exports = app;
```

- [ ] **Step 10: Install dependencies and verify server starts**

```bash
cd e:\fyp\gateway-service
npm install
npm start
```

Expected: `Gateway service running on port 3000` in console. Hit `http://localhost:3000/health` and get `{"status":"ok","service":"gateway",...}`. Then stop the server (Ctrl+C).

- [ ] **Step 11: Commit**

```bash
cd e:\fyp
git add gateway-service/
git commit -m "feat(gateway): scaffold Express server with health endpoint, logger, error handling"
```

---

### Task 3: NLP Service Scaffolding

**Files:**
- Create: `e:\fyp\nlp-service\requirements.txt`
- Create: `e:\fyp\nlp-service\.env.example`
- Create: `e:\fyp\nlp-service\Dockerfile`
- Create: `e:\fyp\nlp-service\app\config\settings.py`
- Create: `e:\fyp\nlp-service\app\config\redis.py`
- Create: `e:\fyp\nlp-service\app\utils\logger.py`
- Create: `e:\fyp\nlp-service\app\core\lifespan.py`
- Create: `e:\fyp\nlp-service\app\routers\health.py`
- Create: `e:\fyp\nlp-service\app\main.py`

- [ ] **Step 1: Create requirements.txt**

```
fastapi==0.115.0
uvicorn[standard]==0.32.0
redis[hiredis]==5.2.0
pydantic-settings==2.6.0
httpx==0.27.0
structlog==24.4.0
```

- [ ] **Step 2: Create .env.example**

```env
NLP_SERVICE_PORT=8001
OLLAMA_LOCAL_URL=http://localhost:11434
REDIS_HOST=localhost
REDIS_PORT=6379
FINBERT_MODEL_PATH=./models/finbert
```

- [ ] **Step 3: Create Dockerfile**

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8001
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001"]
```

- [ ] **Step 4: Create config/settings.py**

```python
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    nlp_service_port: int = 8001
    ollama_local_url: str = "http://localhost:11434"
    redis_host: str = "localhost"
    redis_port: int = 6379
    finbert_model_path: str = "./models/finbert"

    class Config:
        env_file = ".env"


settings = Settings()
```

- [ ] **Step 5: Create config/redis.py**

```python
import redis.asyncio as aioredis
from app.config.settings import settings

redis_client: aioredis.Redis | None = None


async def get_redis() -> aioredis.Redis:
    global redis_client
    if redis_client is None:
        redis_client = aioredis.Redis(
            host=settings.redis_host,
            port=settings.redis_port,
            decode_responses=True,
        )
    return redis_client


async def close_redis():
    global redis_client
    if redis_client:
        await redis_client.close()
        redis_client = None
```

- [ ] **Step 6: Create utils/logger.py**

```python
import structlog

structlog.configure(
    processors=[
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.add_log_level,
        structlog.processors.JSONRenderer(),
    ],
)


def get_logger(service: str = "nlp-service"):
    return structlog.get_logger(service=service)
```

- [ ] **Step 7: Create core/lifespan.py**

```python
from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.config.redis import get_redis, close_redis
from app.utils.logger import get_logger

logger = get_logger()


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("nlp-service starting up")
    await get_redis()
    logger.info("redis connected")
    yield
    await close_redis()
    logger.info("nlp-service shut down")
```

- [ ] **Step 8: Create routers/health.py**

```python
from datetime import datetime, timezone
from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
async def health_check():
    return {
        "status": "ok",
        "service": "nlp-service",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
```

- [ ] **Step 9: Create main.py**

```python
from fastapi import FastAPI
from app.core.lifespan import lifespan
from app.routers import health

app = FastAPI(title="TradePilot NLP Service", lifespan=lifespan)

app.include_router(health.router)
```

- [ ] **Step 10: Create Python venv, install, and verify**

```bash
cd e:\fyp\nlp-service
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8001
```

Expected: Server starts. Hit `http://localhost:8001/health` → `{"status":"ok","service":"nlp-service",...}`. Stop server.

- [ ] **Step 11: Commit**

```bash
cd e:\fyp
git add nlp-service/
git commit -m "feat(nlp): scaffold FastAPI server with health endpoint, redis, structured logging"
```

---

### Task 4: Trading Service Scaffolding

**Files:**
- Create: `e:\fyp\trading-service\requirements.txt`
- Create: `e:\fyp\trading-service\.env.example`
- Create: `e:\fyp\trading-service\Dockerfile`
- Create: `e:\fyp\trading-service\app\config\settings.py`
- Create: `e:\fyp\trading-service\app\config\redis.py`
- Create: `e:\fyp\trading-service\app\config\database.py`
- Create: `e:\fyp\trading-service\app\utils\logger.py`
- Create: `e:\fyp\trading-service\app\core\lifespan.py`
- Create: `e:\fyp\trading-service\app\routers\health.py`
- Create: `e:\fyp\trading-service\app\main.py`

- [ ] **Step 1: Create requirements.txt**

```
fastapi==0.115.0
uvicorn[standard]==0.32.0
redis[hiredis]==5.2.0
motor==3.6.0
pydantic-settings==2.6.0
httpx==0.27.0
structlog==24.4.0
```

- [ ] **Step 2: Create .env.example**

```env
TRADING_SERVICE_PORT=8002
REDIS_HOST=localhost
REDIS_PORT=6379
MONGO_URI=mongodb://localhost:27017/tradepilot
MONGO_DB_NAME=tradepilot
NLP_SERVICE_URL=http://localhost:8001
BROKER_MODE=paper
```

- [ ] **Step 3: Create Dockerfile**

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8002
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8002"]
```

- [ ] **Step 4: Create config/settings.py**

```python
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    trading_service_port: int = 8002
    redis_host: str = "localhost"
    redis_port: int = 6379
    mongo_uri: str = "mongodb://localhost:27017/tradepilot"
    mongo_db_name: str = "tradepilot"
    nlp_service_url: str = "http://localhost:8001"
    broker_mode: str = "paper"

    class Config:
        env_file = ".env"


settings = Settings()
```

- [ ] **Step 5: Create config/redis.py**

```python
import redis.asyncio as aioredis
from app.config.settings import settings

redis_client: aioredis.Redis | None = None


async def get_redis() -> aioredis.Redis:
    global redis_client
    if redis_client is None:
        redis_client = aioredis.Redis(
            host=settings.redis_host,
            port=settings.redis_port,
            decode_responses=True,
        )
    return redis_client


async def close_redis():
    global redis_client
    if redis_client:
        await redis_client.close()
        redis_client = None
```

- [ ] **Step 6: Create config/database.py**

```python
from motor.motor_asyncio import AsyncIOMotorClient
from app.config.settings import settings

mongo_client: AsyncIOMotorClient | None = None
db = None


async def connect_mongo():
    global mongo_client, db
    mongo_client = AsyncIOMotorClient(settings.mongo_uri)
    db = mongo_client[settings.mongo_db_name]
    return db


async def close_mongo():
    global mongo_client
    if mongo_client:
        mongo_client.close()
        mongo_client = None


def get_db():
    return db
```

- [ ] **Step 7: Create utils/logger.py**

```python
import structlog

structlog.configure(
    processors=[
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.add_log_level,
        structlog.processors.JSONRenderer(),
    ],
)


def get_logger(service: str = "trading-service"):
    return structlog.get_logger(service=service)
```

- [ ] **Step 8: Create core/lifespan.py**

```python
from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.config.redis import get_redis, close_redis
from app.config.database import connect_mongo, close_mongo
from app.utils.logger import get_logger

logger = get_logger()


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("trading-service starting up")
    await get_redis()
    logger.info("redis connected")
    await connect_mongo()
    logger.info("mongodb connected")
    yield
    await close_redis()
    await close_mongo()
    logger.info("trading-service shut down")
```

- [ ] **Step 9: Create routers/health.py**

```python
from datetime import datetime, timezone
from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
async def health_check():
    return {
        "status": "ok",
        "service": "trading-service",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
```

- [ ] **Step 10: Create main.py**

```python
from fastapi import FastAPI
from app.core.lifespan import lifespan
from app.routers import health

app = FastAPI(title="TradePilot Trading Service", lifespan=lifespan)

app.include_router(health.router)
```

- [ ] **Step 11: Create Python venv, install, and verify**

```bash
cd e:\fyp\trading-service
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8002
```

Expected: Server starts. Hit `http://localhost:8002/health` → `{"status":"ok","service":"trading-service",...}`. Stop server.

- [ ] **Step 12: Commit**

```bash
cd e:\fyp
git add trading-service/
git commit -m "feat(trading): scaffold FastAPI server with health, redis, mongodb connections"
```

---

### Task 5: Agent Service Scaffolding

**Files:**
- Create: `e:\fyp\agent-service\requirements.txt`
- Create: `e:\fyp\agent-service\.env.example`
- Create: `e:\fyp\agent-service\Dockerfile`
- Create: `e:\fyp\agent-service\app\config\settings.py`
- Create: `e:\fyp\agent-service\app\config\redis.py`
- Create: `e:\fyp\agent-service\app\utils\logger.py`
- Create: `e:\fyp\agent-service\app\core\lifespan.py`
- Create: `e:\fyp\agent-service\app\routers\health.py`
- Create: `e:\fyp\agent-service\app\main.py`

- [ ] **Step 1: Create requirements.txt**

```
fastapi==0.115.0
uvicorn[standard]==0.32.0
redis[hiredis]==5.2.0
pydantic-settings==2.6.0
httpx==0.27.0
structlog==24.4.0
```

- [ ] **Step 2: Create .env.example**

```env
AGENT_SERVICE_PORT=8003
REDIS_HOST=localhost
REDIS_PORT=6379
OLLAMA_REMOTE_URL=http://REPLACE_WITH_VM_IP:11434
DEEPSEEK_MODEL=deepseek-r1:14b
```

- [ ] **Step 3: Create Dockerfile**

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8003
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8003"]
```

- [ ] **Step 4: Create config/settings.py**

```python
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    agent_service_port: int = 8003
    redis_host: str = "localhost"
    redis_port: int = 6379
    ollama_remote_url: str = "http://localhost:11434"
    deepseek_model: str = "deepseek-r1:14b"

    class Config:
        env_file = ".env"


settings = Settings()
```

- [ ] **Step 5: Create config/redis.py**

```python
import redis.asyncio as aioredis
from app.config.settings import settings

redis_client: aioredis.Redis | None = None


async def get_redis() -> aioredis.Redis:
    global redis_client
    if redis_client is None:
        redis_client = aioredis.Redis(
            host=settings.redis_host,
            port=settings.redis_port,
            decode_responses=True,
        )
    return redis_client


async def close_redis():
    global redis_client
    if redis_client:
        await redis_client.close()
        redis_client = None
```

- [ ] **Step 6: Create utils/logger.py**

```python
import structlog

structlog.configure(
    processors=[
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.add_log_level,
        structlog.processors.JSONRenderer(),
    ],
)


def get_logger(service: str = "agent-service"):
    return structlog.get_logger(service=service)
```

- [ ] **Step 7: Create core/lifespan.py**

```python
from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.config.redis import get_redis, close_redis
from app.utils.logger import get_logger

logger = get_logger()


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("agent-service starting up")
    await get_redis()
    logger.info("redis connected")
    yield
    await close_redis()
    logger.info("agent-service shut down")
```

- [ ] **Step 8: Create routers/health.py**

```python
from datetime import datetime, timezone
from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
async def health_check():
    return {
        "status": "ok",
        "service": "agent-service",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
```

- [ ] **Step 9: Create main.py**

```python
from fastapi import FastAPI
from app.core.lifespan import lifespan
from app.routers import health

app = FastAPI(title="TradePilot Agent Service", lifespan=lifespan)

app.include_router(health.router)
```

- [ ] **Step 10: Create Python venv, install, and verify**

```bash
cd e:\fyp\agent-service
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8003
```

Expected: Server starts. Hit `http://localhost:8003/health` → `{"status":"ok","service":"agent-service",...}`. Stop server.

- [ ] **Step 11: Commit**

```bash
cd e:\fyp
git add agent-service/
git commit -m "feat(agent): scaffold FastAPI server with health endpoint, redis, structured logging"
```

---

### Task 6: Gateway MongoDB Connection + User Model

**Files:**
- Create: `e:\fyp\gateway-service\src\config\database.js`
- Create: `e:\fyp\gateway-service\src\config\redis.js`
- Create: `e:\fyp\gateway-service\src\models\User.js`
- Modify: `e:\fyp\gateway-service\src\app.js`

- [ ] **Step 1: Create config/database.js**

```javascript
const mongoose = require("mongoose");
const config = require("./index");
const logger = require("../utils/logger");

async function connectDB() {
  try {
    await mongoose.connect(config.mongo.uri);
    logger.info("MongoDB connected");
  } catch (err) {
    logger.error({ message: "MongoDB connection failed", error: err.message });
    process.exit(1);
  }
}

module.exports = connectDB;
```

- [ ] **Step 2: Create config/redis.js**

```javascript
const Redis = require("ioredis");
const config = require("./index");
const logger = require("../utils/logger");

const redis = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redis.on("connect", () => logger.info("Redis connected"));
redis.on("error", (err) => logger.error({ message: "Redis error", error: err.message }));

module.exports = redis;
```

- [ ] **Step 3: Create models/User.js**

```javascript
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    apiKey: {
      type: String,
      unique: true,
      sparse: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 });
userSchema.index({ apiKey: 1 });

module.exports = mongoose.model("User", userSchema);
```

- [ ] **Step 4: Update app.js to connect DB and Redis on startup**

Replace the entire `app.js` with:

```javascript
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const config = require("./config");
const connectDB = require("./config/database");
const redis = require("./config/redis");
const logger = require("./utils/logger");
const errorHandler = require("./middleware/errorHandler");
const correlationId = require("./middleware/correlationId");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(correlationId);

app.get("/health", async (_req, res) => {
  const redisOk = redis.status === "ready";
  const status = redisOk ? "ok" : "degraded";
  res.status(redisOk ? 200 : 503).json({
    status,
    service: "gateway",
    redis: redisOk ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

app.use(errorHandler);

async function start() {
  await connectDB();
  app.listen(config.port, () => {
    logger.info(`Gateway service running on port ${config.port}`);
  });
}

start();

module.exports = app;
```

- [ ] **Step 5: Verify gateway starts with DB and Redis**

Ensure MongoDB and Redis are running locally (or via `docker compose up mongodb redis -d`), then:

```bash
cd e:\fyp\gateway-service
npm start
```

Expected: Logs show `MongoDB connected`, `Redis connected`, `Gateway service running on port 3000`. Health endpoint returns `{"status":"ok","redis":"connected",...}`.

- [ ] **Step 6: Commit**

```bash
cd e:\fyp
git add gateway-service/
git commit -m "feat(gateway): add MongoDB, Redis connections and User model"
```

---

### Task 7: Gateway JWT Authentication

**Files:**
- Create: `e:\fyp\gateway-service\src\utils\jwt.js`
- Create: `e:\fyp\gateway-service\src\middleware\auth.js`
- Create: `e:\fyp\gateway-service\src\controllers\authController.js`
- Create: `e:\fyp\gateway-service\src\routes\authRoutes.js`
- Modify: `e:\fyp\gateway-service\src\app.js`

- [ ] **Step 1: Create utils/jwt.js**

```javascript
const jwt = require("jsonwebtoken");
const config = require("../config");

function signToken(payload) {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
}

function verifyToken(token) {
  return jwt.verify(token, config.jwt.secret);
}

module.exports = { signToken, verifyToken };
```

- [ ] **Step 2: Create middleware/auth.js**

```javascript
const { verifyToken } = require("../utils/jwt");
const User = require("../models/User");
const { UnauthorizedError } = require("../utils/errors");

async function authenticate(req, _res, next) {
  try {
    const apiKey = req.headers["x-api-key"];
    if (apiKey) {
      const user = await User.findOne({ apiKey });
      if (!user) throw new UnauthorizedError("Invalid API key");
      req.user = { id: user._id, email: user.email, role: user.role };
      return next();
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("No token provided");
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return next(new UnauthorizedError("Invalid or expired token"));
    }
    next(err);
  }
}

module.exports = { authenticate };
```

- [ ] **Step 3: Create controllers/authController.js**

```javascript
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/User");
const { signToken } = require("../utils/jwt");
const { ValidationError, UnauthorizedError } = require("../utils/errors");
const logger = require("../utils/logger");

async function register(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new ValidationError("Email and password are required");
    }

    const existing = await User.findOne({ email });
    if (existing) {
      throw new ValidationError("Email already registered");
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const apiKey = `tp_${uuidv4().replace(/-/g, "")}`;

    const user = await User.create({ email, passwordHash, apiKey });
    const token = signToken({ id: user._id, email: user.email, role: user.role });

    logger.info({ message: "User registered", email, correlationId: req.correlationId });

    res.status(201).json({
      token,
      apiKey,
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new ValidationError("Email and password are required");
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const token = signToken({ id: user._id, email: user.email, role: user.role });

    logger.info({ message: "User logged in", email, correlationId: req.correlationId });

    res.json({
      token,
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login };
```

- [ ] **Step 4: Create routes/authRoutes.js**

```javascript
const { Router } = require("express");
const { register, login } = require("../controllers/authController");

const router = Router();

router.post("/register", register);
router.post("/login", login);

module.exports = router;
```

- [ ] **Step 5: Update app.js to mount auth routes**

Replace the entire `app.js` with:

```javascript
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const config = require("./config");
const connectDB = require("./config/database");
const redis = require("./config/redis");
const logger = require("./utils/logger");
const errorHandler = require("./middleware/errorHandler");
const correlationId = require("./middleware/correlationId");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(correlationId);

app.get("/health", async (_req, res) => {
  const redisOk = redis.status === "ready";
  const status = redisOk ? "ok" : "degraded";
  res.status(redisOk ? 200 : 503).json({
    status,
    service: "gateway",
    redis: redisOk ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);

app.use(errorHandler);

async function start() {
  await connectDB();
  app.listen(config.port, () => {
    logger.info(`Gateway service running on port ${config.port}`);
  });
}

start();

module.exports = app;
```

- [ ] **Step 6: Test auth endpoints manually**

Start the server, then test with curl or Postman:

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register -H "Content-Type: application/json" -d "{\"email\":\"test@test.com\",\"password\":\"password123\"}"
```

Expected: `201` with `{token, apiKey, user}`.

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"test@test.com\",\"password\":\"password123\"}"
```

Expected: `200` with `{token, user}`.

- [ ] **Step 7: Commit**

```bash
cd e:\fyp
git add gateway-service/
git commit -m "feat(gateway): add JWT auth with register/login endpoints and API key support"
```

---

### Task 8: Gateway Service Proxy (Inter-service Communication)

**Files:**
- Create: `e:\fyp\gateway-service\src\services\serviceProxy.js`
- Create: `e:\fyp\gateway-service\src\routes\proxyRoutes.js`
- Modify: `e:\fyp\gateway-service\src\app.js`

- [ ] **Step 1: Create services/serviceProxy.js**

```javascript
const axios = require("axios");
const config = require("../config");
const logger = require("../utils/logger");

const serviceClients = {
  nlp: axios.create({ baseURL: config.services.nlp, timeout: 30000 }),
  trading: axios.create({ baseURL: config.services.trading, timeout: 30000 }),
  agent: axios.create({ baseURL: config.services.agent, timeout: 30000 }),
};

async function proxyRequest(serviceName, method, path, data, correlationId) {
  const client = serviceClients[serviceName];
  if (!client) {
    throw new Error(`Unknown service: ${serviceName}`);
  }

  const headers = {};
  if (correlationId) {
    headers["X-Correlation-ID"] = correlationId;
  }

  try {
    const response = await client.request({ method, url: path, data, headers });
    return response.data;
  } catch (err) {
    const status = err.response?.status || 502;
    const message = err.response?.data?.error?.message || `${serviceName} service unavailable`;
    logger.error({
      message: "Service proxy error",
      serviceName,
      path,
      status,
      error: err.message,
      correlationId,
    });
    const proxyError = new Error(message);
    proxyError.statusCode = status;
    proxyError.isOperational = true;
    throw proxyError;
  }
}

async function checkServiceHealth(serviceName) {
  try {
    const result = await proxyRequest(serviceName, "GET", "/health", null, null);
    return { service: serviceName, status: result.status };
  } catch {
    return { service: serviceName, status: "unreachable" };
  }
}

module.exports = { proxyRequest, checkServiceHealth };
```

- [ ] **Step 2: Create routes/proxyRoutes.js**

```javascript
const { Router } = require("express");
const { authenticate } = require("../middleware/auth");
const { proxyRequest, checkServiceHealth } = require("../services/serviceProxy");

const router = Router();

router.post("/parse", authenticate, async (req, res, next) => {
  try {
    const result = await proxyRequest("nlp", "POST", "/parse", req.body, req.correlationId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.post("/sentiment", authenticate, async (req, res, next) => {
  try {
    const result = await proxyRequest("nlp", "POST", "/sentiment", req.body, req.correlationId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get("/services/health", authenticate, async (_req, res) => {
  const [nlp, trading, agent] = await Promise.all([
    checkServiceHealth("nlp"),
    checkServiceHealth("trading"),
    checkServiceHealth("agent"),
  ]);
  res.json({ services: [nlp, trading, agent] });
});

module.exports = router;
```

- [ ] **Step 3: Update app.js to mount proxy routes**

Replace the entire `app.js` with:

```javascript
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const config = require("./config");
const connectDB = require("./config/database");
const redis = require("./config/redis");
const logger = require("./utils/logger");
const errorHandler = require("./middleware/errorHandler");
const correlationId = require("./middleware/correlationId");
const authRoutes = require("./routes/authRoutes");
const proxyRoutes = require("./routes/proxyRoutes");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(correlationId);

app.get("/health", async (_req, res) => {
  const redisOk = redis.status === "ready";
  const status = redisOk ? "ok" : "degraded";
  res.status(redisOk ? 200 : 503).json({
    status,
    service: "gateway",
    redis: redisOk ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api", proxyRoutes);

app.use(errorHandler);

async function start() {
  await connectDB();
  app.listen(config.port, () => {
    logger.info(`Gateway service running on port ${config.port}`);
  });
}

start();

module.exports = app;
```

- [ ] **Step 4: Test inter-service health check**

Start all 4 services (gateway + 3 FastAPI services), then:

```bash
# First register and get a token
curl -X POST http://localhost:3000/api/auth/register -H "Content-Type: application/json" -d "{\"email\":\"proxy-test@test.com\",\"password\":\"password123\"}"

# Use the returned token to check service health
curl http://localhost:3000/api/services/health -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Expected: `{"services":[{"service":"nlp","status":"ok"},{"service":"trading","status":"ok"},{"service":"agent","status":"ok"}]}`

- [ ] **Step 5: Commit**

```bash
cd e:\fyp
git add gateway-service/
git commit -m "feat(gateway): add service proxy with health aggregation and authenticated routes"
```

---

### Task 9: Docker Compose Full Integration Test

**Files:**
- Modify: `e:\fyp\docker-compose.yml` (already created in Task 1)

- [ ] **Step 1: Ensure all Dockerfiles exist**

Verify: `gateway-service/Dockerfile`, `nlp-service/Dockerfile`, `agent-service/Dockerfile` all exist (created in Tasks 2-5).

- [ ] **Step 2: Build and start all containers**

```bash
cd e:\fyp
docker compose up --build -d
```

Expected: All containers start. Check with `docker compose ps` — gateway, nlp-service, agent-service, mongodb, redis should all show "running".

- [ ] **Step 3: Start trading-service natively (Windows)**

In a separate terminal:

```bash
cd e:\fyp\trading-service
venv\Scripts\activate
uvicorn app.main:app --host 0.0.0.0 --port 8002
```

- [ ] **Step 4: Test end-to-end health**

```bash
# Gateway health
curl http://localhost:3000/health

# NLP health (direct)
curl http://localhost:8001/health

# Trading health (direct)
curl http://localhost:8002/health

# Agent health (direct)
curl http://localhost:8003/health

# Aggregated service health via gateway (requires auth token)
curl -X POST http://localhost:3000/api/auth/register -H "Content-Type: application/json" -d "{\"email\":\"docker-test@test.com\",\"password\":\"pass123\"}"
# Use returned token:
curl http://localhost:3000/api/services/health -H "Authorization: Bearer TOKEN"
```

Expected: All services return `{"status":"ok",...}`. Aggregated health shows all three downstream services as "ok".

- [ ] **Step 5: Tear down**

```bash
docker compose down
```

- [ ] **Step 6: Commit**

```bash
cd e:\fyp
git add -A
git commit -m "feat: Phase 1 complete - all 4 services scaffolded with Docker Compose orchestration"
```

---

## Plan Self-Review

**Spec coverage:**
- ✅ Gateway service scaffolded with Express, health, config
- ✅ NLP service scaffolded with FastAPI, health, Redis
- ✅ Trading service scaffolded with FastAPI, health, Redis, MongoDB
- ✅ Agent service scaffolded with FastAPI, health, Redis
- ✅ JWT + API Key authentication
- ✅ Inter-service REST proxy with correlation IDs
- ✅ MongoDB connection + User model
- ✅ Redis connections (all services)
- ✅ Docker Compose (MongoDB, Redis, gateway, nlp, agent)
- ✅ Structured logging (Winston for Node.js, structlog for Python)
- ✅ Centralized error handling
- ✅ Trading service runs natively (not in Docker)

**Not in scope for Phase 1 (covered in later plans):**
- WebSocket hub
- Firebase Firestore sync
- Redis Streams (trade.requests, etc.)
- Rate limiting middleware
- Trade and BotConfig MongoDB models
- Mistral / FinBERT / DeepSeek integration
- Bot system, backtesting, execution
- News scrapers

**Placeholder scan:** None found — all steps contain complete code.

**Type consistency:** Config property names (`config.services.nlp`, `settings.redis_host`, etc.) are consistent across all files.
