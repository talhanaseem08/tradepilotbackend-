from fastapi import FastAPI
from app.core.lifespan import lifespan
from app.routers import health
from app.routers.forex_guard import router as forex_guard_router

app = FastAPI(title="TradePilot Agent Service", lifespan=lifespan)

app.include_router(health.router)
app.include_router(forex_guard_router)
