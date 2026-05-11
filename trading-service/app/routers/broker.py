from fastapi import APIRouter, HTTPException
from app.schemas.broker import BinanceVerifyRequest, MT5VerifyRequest, OandaVerifyRequest, VerifyResponse
from app.services.broker_verification import (
    verify_binance_connection,
    verify_mt5_connection,
    verify_oanda_connection,
)
from app.utils.logger import get_logger

logger = get_logger()
router = APIRouter(prefix="/broker", tags=["broker"])


@router.post("/verify/mt5", response_model=VerifyResponse)
async def verify_mt5(request: MT5VerifyRequest):
    try:
        result = await verify_mt5_connection(
            login=request.login,
            password=request.password,
            server=request.server
        )
        return result
    except Exception as e:
        logger.error("MT5 verification failed", error=str(e))
        raise HTTPException(status_code=400, detail=f"MT5 verification failed: {str(e)}")


@router.post("/verify/oanda", response_model=VerifyResponse)
async def verify_oanda(request: OandaVerifyRequest):
    try:
        result = await verify_oanda_connection(
            api_key=request.apiKey,
            account_id=request.accountId,
            environment=request.environment
        )
        return result
    except Exception as e:
        logger.error("OANDA verification failed", error=str(e))
        raise HTTPException(status_code=400, detail=f"OANDA verification failed: {str(e)}")


@router.post("/verify/binance", response_model=VerifyResponse)
async def verify_binance(request: BinanceVerifyRequest):
    try:
        result = await verify_binance_connection(
            api_key=request.apiKey,
            secret_key=request.secretKey,
            is_testnet=request.isTestnet,
        )
        return result
    except Exception as e:
        logger.error("Binance verification failed", error=str(e))
        raise HTTPException(status_code=400, detail=f"Binance verification failed: {str(e)}")
