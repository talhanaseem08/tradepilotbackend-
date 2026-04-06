from fastapi import FastAPI
from app.core.lifespan import lifespan
from app.routers import health, parse, sentiment, news

app = FastAPI(title="TradePilot NLP Service", lifespan=lifespan)

app.include_router(health.router)
app.include_router(parse.router)
app.include_router(sentiment.router)
app.include_router(news.router)
