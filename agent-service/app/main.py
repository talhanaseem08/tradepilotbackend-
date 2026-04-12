from fastapi import FastAPI
from app.core.lifespan import lifespan
from app.routers import health, reason
from app.routers.optimization_logs import router as optimization_logs_router
from app.routers.ppo import router as ppo_router

app = FastAPI(title="TradePilot Agent Service", lifespan=lifespan)

app.include_router(health.router)
app.include_router(reason.router)
app.include_router(optimization_logs_router)
app.include_router(ppo_router)
