# TradePilot Phase 2: NLP Service Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the NLP service endpoints: Mistral prompt parsing via Ollama, FinBERT sentiment analysis via ModernFinBERT, news scrapers (ForexFactory + X + CoinTelegraph), and news caching.

**Architecture:** NLP service (FastAPI, port 8001) calls local Ollama for Mistral inference, loads ModernFinBERT from HuggingFace Hub for sentiment, runs background news collectors that cache into Redis, and exposes REST endpoints consumed by the gateway and trading service.

**Tech Stack:** FastAPI, Ollama HTTP API, transformers (ModernFinBERT), httpx, beautifulsoup4, feedparser, redis, structlog

---

## File Structure (new/modified files only)

```
nlp-service/
├── requirements.txt                    # MODIFY: add transformers, torch, bs4, feedparser, tweepy
├── app/
│   ├── config/
│   │   └── settings.py                 # MODIFY: add model names, scraper intervals
│   ├── routers/
│   │   ├── parse.py                    # CREATE: POST /parse
│   │   ├── sentiment.py                # CREATE: POST /sentiment
│   │   └── news.py                     # CREATE: GET /news/{symbol}
│   ├── services/
│   │   ├── mistral_service.py          # CREATE: Ollama client for Mistral
│   │   ├── finbert_service.py          # CREATE: ModernFinBERT loader + inference
│   │   └── news_service.py             # CREATE: news orchestrator + caching
│   ├── scrapers/
│   │   ├── base_scraper.py             # CREATE: abstract scraper interface
│   │   ├── forexfactory.py             # CREATE: ForexFactory scraper
│   │   ├── x_scraper.py               # CREATE: X/Twitter scraper
│   │   └── cointelegraph.py           # CREATE: CoinTelegraph RSS parser
│   ├── schemas/
│   │   ├── parse.py                    # CREATE: ParseRequest, ParseResponse
│   │   ├── sentiment.py                # CREATE: SentimentRequest, SentimentResponse
│   │   └── news.py                     # CREATE: NewsItem, NewsResponse
│   ├── core/
│   │   ├── ollama_client.py            # CREATE: HTTP client to local Ollama
│   │   ├── model_loader.py             # CREATE: loads FinBERT at startup
│   │   └── lifespan.py                 # MODIFY: add model loading + news collector startup
│   └── workers/
│       └── news_collector.py           # CREATE: background scheduled collection
└── models/                             # directory for HF cache (auto-created)
```

---

### Task 1: Update Dependencies and Config

**Files:**
- Modify: `e:\fyp\nlp-service\requirements.txt`
- Modify: `e:\fyp\nlp-service\app\config\settings.py`

- [ ] **Step 1: Update requirements.txt**

Replace the entire file with:

```
fastapi==0.115.0
uvicorn[standard]==0.32.0
redis[hiredis]==5.2.0
pydantic-settings==2.6.0
httpx==0.27.0
structlog==24.4.0
transformers>=4.44.0
torch>=2.4.0
beautifulsoup4>=4.12.0
feedparser>=6.0.0
lxml>=5.0.0
```

- [ ] **Step 2: Update config/settings.py**

Replace the entire file with:

```python
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    nlp_service_port: int = 8001
    ollama_local_url: str = "http://localhost:11434"
    mistral_model_name: str = "tradepilot-mistral"
    finbert_model_name: str = "tabularisai/ModernFinBERT"
    redis_host: str = "localhost"
    redis_port: int = 6379
    news_fetch_interval_minutes: int = 15
    news_max_age_hours: int = 4

    class Config:
        env_file = ".env"


settings = Settings()
```

- [ ] **Step 3: Commit**

```bash
git add nlp-service/requirements.txt nlp-service/app/config/settings.py
git commit -m "feat(nlp): update dependencies and config for Mistral, FinBERT, scrapers"
```

---

### Task 2: Pydantic Schemas

**Files:**
- Create: `e:\fyp\nlp-service\app\schemas\__init__.py`
- Create: `e:\fyp\nlp-service\app\schemas\parse.py`
- Create: `e:\fyp\nlp-service\app\schemas\sentiment.py`
- Create: `e:\fyp\nlp-service\app\schemas\news.py`

- [ ] **Step 1: Create empty __init__.py**

Create `e:\fyp\nlp-service\app\schemas\__init__.py` as an empty file.

- [ ] **Step 2: Create schemas/parse.py**

```python
from pydantic import BaseModel


class ParseRequest(BaseModel):
    prompt: str


class ParseResponse(BaseModel):
    intent: str | None = None
    risk_level: str | None = None
    market: list[str] = []
    strategy_type: str | None = None
    analysis_mode: str | None = None
    symbol: str | None = None
    timeframe: str | None = None
    stop_loss_pips: float | None = None
    take_profit_pips: float | None = None
    confidence: float | None = None
    raw_output: str | None = None
```

- [ ] **Step 3: Create schemas/sentiment.py**

```python
from pydantic import BaseModel


class SentimentRequest(BaseModel):
    symbol: str
    market: str = "forex"


class SentimentResponse(BaseModel):
    symbol: str
    sentiment_score: float
    sentiment_label: str
    news_count: int
    top_headlines: list[str] = []
    source_breakdown: dict[str, int] = {}
    timestamp: str
```

- [ ] **Step 4: Create schemas/news.py**

```python
from pydantic import BaseModel


class NewsItem(BaseModel):
    title: str
    source: str
    symbol: str | None = None
    published_at: str | None = None
    url: str | None = None
    impact: str | None = None


class NewsResponse(BaseModel):
    symbol: str
    news: list[NewsItem] = []
    count: int = 0
```

- [ ] **Step 5: Commit**

```bash
git add nlp-service/app/schemas/
git commit -m "feat(nlp): add pydantic schemas for parse, sentiment, and news endpoints"
```

---

### Task 3: Ollama Client + Mistral Service

**Files:**
- Create: `e:\fyp\nlp-service\app\core\ollama_client.py`
- Create: `e:\fyp\nlp-service\app\services\__init__.py`
- Create: `e:\fyp\nlp-service\app\services\mistral_service.py`

- [ ] **Step 1: Create core/ollama_client.py**

```python
import httpx
from app.config.settings import settings
from app.utils.logger import get_logger

logger = get_logger()


class OllamaClient:
    def __init__(self):
        self.base_url = settings.ollama_local_url
        self.client = httpx.AsyncClient(base_url=self.base_url, timeout=120.0)

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

- [ ] **Step 2: Create empty services/__init__.py**

Create `e:\fyp\nlp-service\app\services\__init__.py` as an empty file.

- [ ] **Step 3: Create services/mistral_service.py**

```python
import json
from app.core.ollama_client import ollama_client
from app.config.settings import settings
from app.schemas.parse import ParseResponse
from app.utils.logger import get_logger

logger = get_logger()

SYSTEM_PROMPT = (
    "Extract the bot configuration from the user prompt into JSON. "
    "Return ONLY valid JSON with these fields: "
    "intent, risk_level, market, strategy_type, analysis_mode, symbol, "
    "timeframe, stop_loss_pips, take_profit_pips."
)


async def parse_trading_prompt(prompt: str) -> ParseResponse:
    full_prompt = f"[INST] {SYSTEM_PROMPT}\n\nUser input: {prompt} [/INST]"

    logger.info("calling mistral", prompt=prompt[:100])
    result = await ollama_client.generate(
        model=settings.mistral_model_name,
        prompt=full_prompt,
        stream=False,
    )

    raw_text = result.get("response", "")
    logger.info("mistral response received", length=len(raw_text))

    parsed = _extract_json(raw_text)
    parsed["raw_output"] = raw_text
    return ParseResponse(**parsed)


def _extract_json(text: str) -> dict:
    try:
        start = text.index("{")
        end = text.rindex("}") + 1
        return json.loads(text[start:end])
    except (ValueError, json.JSONDecodeError):
        logger.warning("failed to parse JSON from mistral output", text=text[:200])
        return {}
```

- [ ] **Step 4: Commit**

```bash
git add nlp-service/app/core/ollama_client.py nlp-service/app/services/
git commit -m "feat(nlp): add Ollama client and Mistral prompt parsing service"
```

---

### Task 4: FinBERT Sentiment Service

**Files:**
- Create: `e:\fyp\nlp-service\app\core\model_loader.py`
- Create: `e:\fyp\nlp-service\app\services\finbert_service.py`

- [ ] **Step 1: Create core/model_loader.py**

```python
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
from app.config.settings import settings
from app.utils.logger import get_logger

logger = get_logger()

finbert_model = None
finbert_tokenizer = None


async def load_finbert():
    global finbert_model, finbert_tokenizer
    logger.info("loading ModernFinBERT", model=settings.finbert_model_name)
    finbert_tokenizer = AutoTokenizer.from_pretrained(settings.finbert_model_name)
    finbert_model = AutoModelForSequenceClassification.from_pretrained(
        settings.finbert_model_name
    )
    finbert_model.eval()
    logger.info("ModernFinBERT loaded successfully")


def get_finbert():
    return finbert_model, finbert_tokenizer
```

- [ ] **Step 2: Create services/finbert_service.py**

```python
import torch
from datetime import datetime, timezone
from app.core.model_loader import get_finbert
from app.schemas.sentiment import SentimentResponse
from app.utils.logger import get_logger

logger = get_logger()

LABEL_MAP = {0: "negative", 1: "neutral", 2: "positive"}


async def analyze_sentiment(
    symbol: str,
    headlines: list[str],
    source_breakdown: dict[str, int],
) -> SentimentResponse:
    model, tokenizer = get_finbert()

    if not headlines:
        return SentimentResponse(
            symbol=symbol,
            sentiment_score=0.0,
            sentiment_label="neutral",
            news_count=0,
            top_headlines=[],
            source_breakdown=source_breakdown,
            timestamp=datetime.now(timezone.utc).isoformat(),
        )

    scores = []
    for headline in headlines:
        inputs = tokenizer(
            headline, return_tensors="pt", truncation=True, max_length=512
        )
        with torch.no_grad():
            outputs = model(**inputs)
        probs = torch.softmax(outputs.logits, dim=-1).squeeze()
        sentiment_score = probs[2].item() - probs[0].item()
        scores.append(sentiment_score)

    avg_score = sum(scores) / len(scores)

    if avg_score > 0.15:
        label = "positive"
    elif avg_score < -0.15:
        label = "negative"
    else:
        label = "neutral"

    return SentimentResponse(
        symbol=symbol,
        sentiment_score=round(avg_score, 4),
        sentiment_label=label,
        news_count=len(headlines),
        top_headlines=headlines[:5],
        source_breakdown=source_breakdown,
        timestamp=datetime.now(timezone.utc).isoformat(),
    )
```

- [ ] **Step 3: Commit**

```bash
git add nlp-service/app/core/model_loader.py nlp-service/app/services/finbert_service.py
git commit -m "feat(nlp): add ModernFinBERT model loader and sentiment analysis service"
```

---

### Task 5: News Scrapers

**Files:**
- Create: `e:\fyp\nlp-service\app\scrapers\__init__.py`
- Create: `e:\fyp\nlp-service\app\scrapers\base_scraper.py`
- Create: `e:\fyp\nlp-service\app\scrapers\forexfactory.py`
- Create: `e:\fyp\nlp-service\app\scrapers\cointelegraph.py`
- Create: `e:\fyp\nlp-service\app\scrapers\x_scraper.py`

- [ ] **Step 1: Create empty scrapers/__init__.py**

- [ ] **Step 2: Create scrapers/base_scraper.py**

```python
from abc import ABC, abstractmethod
from app.schemas.news import NewsItem


class BaseScraper(ABC):
    @property
    @abstractmethod
    def source_name(self) -> str:
        pass

    @abstractmethod
    async def fetch_news(self, symbol: str | None = None) -> list[NewsItem]:
        pass
```

- [ ] **Step 3: Create scrapers/forexfactory.py**

```python
import httpx
from bs4 import BeautifulSoup
from datetime import datetime, timezone
from app.scrapers.base_scraper import BaseScraper
from app.schemas.news import NewsItem
from app.utils.logger import get_logger

logger = get_logger()

FOREX_FACTORY_URL = "https://www.forexfactory.com/calendar"

CURRENCY_MAP = {
    "USD": ["EURUSD", "GBPUSD", "USDJPY", "USDCHF", "USDCAD", "AUDUSD", "NZDUSD"],
    "EUR": ["EURUSD", "EURGBP", "EURJPY", "EURCHF"],
    "GBP": ["GBPUSD", "EURGBP", "GBPJPY"],
    "JPY": ["USDJPY", "EURJPY", "GBPJPY"],
    "AUD": ["AUDUSD", "AUDCAD", "AUDJPY"],
    "CAD": ["USDCAD", "AUDCAD"],
    "CHF": ["USDCHF", "EURCHF"],
    "NZD": ["NZDUSD"],
}


class ForexFactoryScraper(BaseScraper):
    @property
    def source_name(self) -> str:
        return "forexfactory"

    async def fetch_news(self, symbol: str | None = None) -> list[NewsItem]:
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                headers = {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
                }
                resp = await client.get(FOREX_FACTORY_URL, headers=headers)
                resp.raise_for_status()

            soup = BeautifulSoup(resp.text, "lxml")
            rows = soup.select("tr.calendar__row")

            items = []
            for row in rows[:30]:
                currency_el = row.select_one("td.calendar__currency")
                title_el = row.select_one("td.calendar__event span")
                impact_el = row.select_one("td.calendar__impact span")

                if not currency_el or not title_el:
                    continue

                currency = currency_el.get_text(strip=True).upper()
                title = title_el.get_text(strip=True)
                impact = ""
                if impact_el:
                    impact_classes = impact_el.get("class", [])
                    if any("high" in c for c in impact_classes):
                        impact = "high"
                    elif any("medium" in c for c in impact_classes):
                        impact = "medium"
                    else:
                        impact = "low"

                relevant_symbols = CURRENCY_MAP.get(currency, [])
                if symbol and symbol.upper() not in relevant_symbols:
                    continue

                items.append(
                    NewsItem(
                        title=f"[{currency}] {title}",
                        source=self.source_name,
                        symbol=symbol or currency,
                        published_at=datetime.now(timezone.utc).isoformat(),
                        impact=impact,
                    )
                )

            logger.info("forexfactory scraped", count=len(items))
            return items

        except Exception as e:
            logger.error("forexfactory scrape failed", error=str(e))
            return []
```

- [ ] **Step 4: Create scrapers/cointelegraph.py**

```python
import feedparser
from datetime import datetime, timezone
from app.scrapers.base_scraper import BaseScraper
from app.schemas.news import NewsItem
from app.utils.logger import get_logger

logger = get_logger()

COINTELEGRAPH_RSS = "https://cointelegraph.com/rss"

CRYPTO_KEYWORDS = {
    "BTCUSDT": ["bitcoin", "btc"],
    "ETHUSDT": ["ethereum", "eth"],
    "BNBUSDT": ["binance coin", "bnb"],
    "SOLUSDT": ["solana", "sol"],
    "XRPUSDT": ["ripple", "xrp"],
}


class CoinTelegraphScraper(BaseScraper):
    @property
    def source_name(self) -> str:
        return "cointelegraph"

    async def fetch_news(self, symbol: str | None = None) -> list[NewsItem]:
        try:
            feed = feedparser.parse(COINTELEGRAPH_RSS)
            items = []

            for entry in feed.entries[:30]:
                title = entry.get("title", "")
                link = entry.get("link", "")
                published = entry.get("published", "")

                if symbol:
                    keywords = CRYPTO_KEYWORDS.get(symbol.upper(), [])
                    if keywords and not any(
                        kw in title.lower() for kw in keywords
                    ):
                        continue

                items.append(
                    NewsItem(
                        title=title,
                        source=self.source_name,
                        symbol=symbol,
                        published_at=published or datetime.now(timezone.utc).isoformat(),
                        url=link,
                    )
                )

            logger.info("cointelegraph scraped", count=len(items))
            return items

        except Exception as e:
            logger.error("cointelegraph scrape failed", error=str(e))
            return []
```

- [ ] **Step 5: Create scrapers/x_scraper.py**

```python
import httpx
from datetime import datetime, timezone
from app.scrapers.base_scraper import BaseScraper
from app.schemas.news import NewsItem
from app.utils.logger import get_logger

logger = get_logger()

NITTER_INSTANCES = [
    "https://nitter.net",
    "https://nitter.privacydev.net",
]

FINANCE_ACCOUNTS = [
    "ForexLive",
    "ReutersBiz",
    "markets",
    "Faborotno",
]


class XScraper(BaseScraper):
    @property
    def source_name(self) -> str:
        return "x"

    async def fetch_news(self, symbol: str | None = None) -> list[NewsItem]:
        items = []
        search_term = f"${symbol}" if symbol else "forex trading"

        for instance in NITTER_INSTANCES:
            try:
                items = await self._scrape_nitter(instance, search_term, symbol)
                if items:
                    break
            except Exception as e:
                logger.warning("nitter instance failed", instance=instance, error=str(e))
                continue

        if not items:
            items = await self._fetch_from_accounts(symbol)

        logger.info("x scraper result", count=len(items))
        return items

    async def _scrape_nitter(
        self, base_url: str, query: str, symbol: str | None
    ) -> list[NewsItem]:
        async with httpx.AsyncClient(timeout=10.0) as client:
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            }
            resp = await client.get(f"{base_url}/search", params={"q": query}, headers=headers)
            if resp.status_code != 200:
                return []

        from bs4 import BeautifulSoup

        soup = BeautifulSoup(resp.text, "lxml")
        tweets = soup.select(".timeline-item .tweet-content")

        items = []
        for tweet in tweets[:15]:
            text = tweet.get_text(strip=True)
            if len(text) < 10:
                continue
            items.append(
                NewsItem(
                    title=text[:280],
                    source=self.source_name,
                    symbol=symbol,
                    published_at=datetime.now(timezone.utc).isoformat(),
                )
            )
        return items

    async def _fetch_from_accounts(self, symbol: str | None) -> list[NewsItem]:
        items = []
        for account in FINANCE_ACCOUNTS[:2]:
            for instance in NITTER_INSTANCES:
                try:
                    async with httpx.AsyncClient(timeout=10.0) as client:
                        headers = {"User-Agent": "Mozilla/5.0"}
                        resp = await client.get(f"{instance}/{account}", headers=headers)
                        if resp.status_code != 200:
                            continue

                    from bs4 import BeautifulSoup

                    soup = BeautifulSoup(resp.text, "lxml")
                    tweets = soup.select(".timeline-item .tweet-content")
                    for tweet in tweets[:5]:
                        text = tweet.get_text(strip=True)
                        if symbol and symbol.lower() not in text.lower():
                            continue
                        items.append(
                            NewsItem(
                                title=text[:280],
                                source=self.source_name,
                                symbol=symbol,
                                published_at=datetime.now(timezone.utc).isoformat(),
                            )
                        )
                    if items:
                        break
                except Exception:
                    continue
        return items
```

- [ ] **Step 6: Commit**

```bash
git add nlp-service/app/scrapers/
git commit -m "feat(nlp): add news scrapers for ForexFactory, CoinTelegraph, and X/Nitter"
```

---

### Task 6: News Service + News Collector Worker

**Files:**
- Create: `e:\fyp\nlp-service\app\services\news_service.py`
- Create: `e:\fyp\nlp-service\app\workers\__init__.py`
- Create: `e:\fyp\nlp-service\app\workers\news_collector.py`

- [ ] **Step 1: Create services/news_service.py**

```python
import json
from datetime import datetime, timezone, timedelta
from app.config.redis import get_redis
from app.config.settings import settings
from app.schemas.news import NewsItem, NewsResponse
from app.scrapers.forexfactory import ForexFactoryScraper
from app.scrapers.cointelegraph import CoinTelegraphScraper
from app.scrapers.x_scraper import XScraper
from app.utils.logger import get_logger

logger = get_logger()

forexfactory = ForexFactoryScraper()
cointelegraph = CoinTelegraphScraper()
x_scraper = XScraper()

FOREX_SYMBOLS = ["EURUSD", "GBPUSD", "USDJPY", "USDCHF", "AUDUSD", "USDCAD", "NZDUSD"]
CRYPTO_SYMBOLS = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT", "XRPUSDT"]


def _is_forex(symbol: str) -> bool:
    return symbol.upper() in FOREX_SYMBOLS or len(symbol) == 6 and symbol.isalpha()


async def get_cached_news(symbol: str) -> list[NewsItem]:
    redis = await get_redis()
    key = f"news:{symbol.upper()}:latest"
    raw_items = await redis.lrange(key, 0, 49)
    items = []
    for raw in raw_items:
        try:
            items.append(NewsItem(**json.loads(raw)))
        except Exception:
            continue
    return items


async def cache_news(symbol: str, items: list[NewsItem]):
    if not items:
        return
    redis = await get_redis()
    key = f"news:{symbol.upper()}:latest"
    pipe = redis.pipeline()
    pipe.delete(key)
    for item in items[:50]:
        pipe.rpush(key, item.model_dump_json())
    pipe.expire(key, settings.news_max_age_hours * 3600)
    await pipe.execute()


async def fetch_and_cache_news(symbol: str) -> list[NewsItem]:
    all_items = []

    if _is_forex(symbol):
        ff_items = await forexfactory.fetch_news(symbol)
        x_items = await x_scraper.fetch_news(symbol)
        all_items = ff_items + x_items
    else:
        ct_items = await cointelegraph.fetch_news(symbol)
        x_items = await x_scraper.fetch_news(symbol)
        all_items = ct_items + x_items

    await cache_news(symbol, all_items)
    logger.info("news fetched and cached", symbol=symbol, count=len(all_items))
    return all_items


async def get_news_for_symbol(symbol: str) -> NewsResponse:
    items = await get_cached_news(symbol)
    if not items:
        items = await fetch_and_cache_news(symbol)
    return NewsResponse(symbol=symbol, news=items, count=len(items))


async def get_headlines_and_sources(symbol: str) -> tuple[list[str], dict[str, int]]:
    items = await get_cached_news(symbol)
    if not items:
        items = await fetch_and_cache_news(symbol)

    headlines = [item.title for item in items]
    sources: dict[str, int] = {}
    for item in items:
        sources[item.source] = sources.get(item.source, 0) + 1

    return headlines, sources
```

- [ ] **Step 2: Create empty workers/__init__.py**

- [ ] **Step 3: Create workers/news_collector.py**

```python
import asyncio
from app.config.settings import settings
from app.services.news_service import fetch_and_cache_news, FOREX_SYMBOLS, CRYPTO_SYMBOLS
from app.utils.logger import get_logger

logger = get_logger()

_collector_task: asyncio.Task | None = None


async def _collection_loop():
    while True:
        try:
            logger.info("news collection cycle starting")
            all_symbols = FOREX_SYMBOLS + CRYPTO_SYMBOLS
            for symbol in all_symbols:
                try:
                    await fetch_and_cache_news(symbol)
                    await asyncio.sleep(2)
                except Exception as e:
                    logger.error("failed to fetch news", symbol=symbol, error=str(e))
            logger.info("news collection cycle complete")
        except Exception as e:
            logger.error("news collection cycle failed", error=str(e))

        await asyncio.sleep(settings.news_fetch_interval_minutes * 60)


def start_news_collector():
    global _collector_task
    _collector_task = asyncio.create_task(_collection_loop())
    logger.info("news collector started", interval_min=settings.news_fetch_interval_minutes)


def stop_news_collector():
    global _collector_task
    if _collector_task:
        _collector_task.cancel()
        _collector_task = None
        logger.info("news collector stopped")
```

- [ ] **Step 4: Commit**

```bash
git add nlp-service/app/services/news_service.py nlp-service/app/workers/
git commit -m "feat(nlp): add news service with caching and background collector worker"
```

---

### Task 7: API Routers (parse, sentiment, news)

**Files:**
- Create: `e:\fyp\nlp-service\app\routers\parse.py`
- Create: `e:\fyp\nlp-service\app\routers\sentiment.py`
- Create: `e:\fyp\nlp-service\app\routers\news.py`

- [ ] **Step 1: Create routers/parse.py**

```python
from fastapi import APIRouter, HTTPException
from app.schemas.parse import ParseRequest, ParseResponse
from app.services.mistral_service import parse_trading_prompt
from app.utils.logger import get_logger

logger = get_logger()
router = APIRouter()


@router.post("/parse", response_model=ParseResponse)
async def parse_prompt(request: ParseRequest):
    if not request.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt cannot be empty")

    try:
        result = await parse_trading_prompt(request.prompt)
        return result
    except Exception as e:
        logger.error("parse failed", error=str(e))
        raise HTTPException(status_code=502, detail="Mistral inference failed")
```

- [ ] **Step 2: Create routers/sentiment.py**

```python
from fastapi import APIRouter, HTTPException
from app.schemas.sentiment import SentimentRequest, SentimentResponse
from app.services.news_service import get_headlines_and_sources
from app.services.finbert_service import analyze_sentiment
from app.core.model_loader import get_finbert
from app.utils.logger import get_logger

logger = get_logger()
router = APIRouter()


@router.post("/sentiment", response_model=SentimentResponse)
async def get_sentiment(request: SentimentRequest):
    model, tokenizer = get_finbert()
    if model is None or tokenizer is None:
        raise HTTPException(status_code=503, detail="FinBERT model not loaded")

    try:
        headlines, sources = await get_headlines_and_sources(request.symbol)
        result = await analyze_sentiment(request.symbol, headlines, sources)
        return result
    except Exception as e:
        logger.error("sentiment analysis failed", error=str(e), symbol=request.symbol)
        raise HTTPException(status_code=500, detail="Sentiment analysis failed")
```

- [ ] **Step 3: Create routers/news.py**

```python
from fastapi import APIRouter
from app.schemas.news import NewsResponse
from app.services.news_service import get_news_for_symbol

router = APIRouter()


@router.get("/news/{symbol}", response_model=NewsResponse)
async def get_news(symbol: str):
    return await get_news_for_symbol(symbol.upper())
```

- [ ] **Step 4: Commit**

```bash
git add nlp-service/app/routers/
git commit -m "feat(nlp): add parse, sentiment, and news API routers"
```

---

### Task 8: Update Lifespan + Main App Wiring

**Files:**
- Modify: `e:\fyp\nlp-service\app\core\lifespan.py`
- Modify: `e:\fyp\nlp-service\app\routers\health.py`
- Modify: `e:\fyp\nlp-service\app\main.py`

- [ ] **Step 1: Update core/lifespan.py**

Replace the entire file with:

```python
from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.config.redis import get_redis, close_redis
from app.core.model_loader import load_finbert
from app.core.ollama_client import ollama_client
from app.workers.news_collector import start_news_collector, stop_news_collector
from app.utils.logger import get_logger

logger = get_logger()


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("nlp-service starting up")
    await get_redis()
    logger.info("redis connected")
    await load_finbert()
    ollama_ok = await ollama_client.is_healthy()
    logger.info("ollama status", healthy=ollama_ok)
    start_news_collector()
    yield
    stop_news_collector()
    await ollama_client.close()
    await close_redis()
    logger.info("nlp-service shut down")
```

- [ ] **Step 2: Update routers/health.py**

Replace the entire file with:

```python
from datetime import datetime, timezone
from fastapi import APIRouter
from app.core.model_loader import get_finbert
from app.core.ollama_client import ollama_client

router = APIRouter()


@router.get("/health")
async def health_check():
    model, tokenizer = get_finbert()
    finbert_loaded = model is not None and tokenizer is not None
    ollama_ok = await ollama_client.is_healthy()

    status = "ok" if finbert_loaded and ollama_ok else "degraded"

    return {
        "status": status,
        "service": "nlp-service",
        "finbert_loaded": finbert_loaded,
        "ollama_reachable": ollama_ok,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
```

- [ ] **Step 3: Update main.py**

Replace the entire file with:

```python
from fastapi import FastAPI
from app.core.lifespan import lifespan
from app.routers import health, parse, sentiment, news

app = FastAPI(title="TradePilot NLP Service", lifespan=lifespan)

app.include_router(health.router)
app.include_router(parse.router)
app.include_router(sentiment.router)
app.include_router(news.router)
```

- [ ] **Step 4: Commit**

```bash
git add nlp-service/
git commit -m "feat(nlp): wire up lifespan, health reporting, and all routers"
```

---

## Plan Self-Review

**Spec coverage:**
- ✅ POST /parse — Mistral via Ollama, returns structured JSON
- ✅ POST /sentiment — ModernFinBERT, accepts symbol, returns score + label
- ✅ GET /news/{symbol} — returns cached news
- ✅ GET /health — reports FinBERT loaded + Ollama reachable
- ✅ ForexFactory scraper with currency-to-symbol mapping
- ✅ CoinTelegraph RSS parser with crypto keyword filtering
- ✅ X/Nitter scraper with fallback across instances
- ✅ Background news collector on configurable interval
- ✅ News cached in Redis with expiry
- ✅ Symbol-to-source mapping (forex→FF+X, crypto→CT+X)

**Not in scope (later phases):**
- Trading service calling /sentiment as pre-trade gate
- WebSocket updates
- Gateway proxy routes for /parse and /sentiment (already wired in Phase 1)

**Placeholder scan:** None — all code is complete.

**Type consistency:** Schema field names (`sentiment_score`, `sentiment_label`, etc.) match across schemas, services, and routers.
