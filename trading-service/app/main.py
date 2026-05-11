from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.lifespan import lifespan
from app.routers import health, bots, backtest, data, broker, trades, debug, finetuned

app = FastAPI(title="TradePilot Trading Service", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(bots.router)
app.include_router(trades.router)
app.include_router(backtest.router)
app.include_router(data.router)
app.include_router(broker.router)
app.include_router(debug.router)
app.include_router(finetuned.router)
