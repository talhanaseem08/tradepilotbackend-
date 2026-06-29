import traceback
import uuid

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException
from app.core.lifespan import lifespan
from app.routers import health
from app.routers.forex_guard import router as forex_guard_router
from app.routers.trade_explanation import router as trade_explanation_router
from app.utils.logger import get_logger

app = FastAPI(title="TradePilot Agent Service", lifespan=lifespan)
logger = get_logger()


def _correlation_id(request: Request) -> str:
    return request.headers.get("x-correlation-id") or str(uuid.uuid4())


def _safe_message(status_code: int) -> str:
    if status_code in (400, 422):
        return "Some information is missing or invalid. Please check and try again."
    if status_code == 401:
        return "Please sign in again."
    if status_code == 403:
        return "You do not have permission to do that."
    if status_code == 404:
        return "We could not find the requested item."
    if status_code == 429:
        return "Too many requests. Please wait a moment and try again."
    if status_code >= 500:
        return "Safety check service is temporarily unavailable. Please try again in a moment."
    return "Something went wrong. Please try again."


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    correlation_id = _correlation_id(request)
    log_method = logger.error if exc.status_code >= 500 else logger.warning
    log_method(
        "http error response",
        status_code=exc.status_code,
        detail=str(exc.detail),
        path=request.url.path,
        correlation_id=correlation_id,
    )
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": {"message": _safe_message(exc.status_code), "correlationId": correlation_id}},
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    correlation_id = _correlation_id(request)
    logger.warning(
        "request validation failed",
        errors=exc.errors(),
        path=request.url.path,
        correlation_id=correlation_id,
    )
    return JSONResponse(
        status_code=422,
        content={"error": {"message": _safe_message(422), "correlationId": correlation_id}},
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    correlation_id = _correlation_id(request)
    logger.error(
        "unhandled exception",
        error=str(exc),
        stack=traceback.format_exc(),
        path=request.url.path,
        correlation_id=correlation_id,
    )
    return JSONResponse(
        status_code=500,
        content={"error": {"message": _safe_message(500), "correlationId": correlation_id}},
    )

app.include_router(health.router)
app.include_router(forex_guard_router)
app.include_router(trade_explanation_router)
