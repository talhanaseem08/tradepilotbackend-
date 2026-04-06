from fastapi import FastAPI
from app.core.lifespan import lifespan
from app.routers import health, bots, backtest

app = FastAPI(title="TradePilot Trading Service", lifespan=lifespan)

app.include_router(health.router)
app.include_router(bots.router)
app.include_router(backtest.router)
