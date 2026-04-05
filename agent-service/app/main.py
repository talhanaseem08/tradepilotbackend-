from fastapi import FastAPI
from app.core.lifespan import lifespan
from app.routers import health

app = FastAPI(title="TradePilot Agent Service", lifespan=lifespan)

app.include_router(health.router)
