import httpx
from app.schemas.broker import VerifyResponse
from app.services.binance_client import (
    estimate_binance_wallet_total,
    fetch_binance_spot_account_info,
    fetch_binance_spot_prices,
    test_binance_spot_order_permission,
)
from app.utils.logger import get_logger

logger = get_logger()


async def verify_oanda_connection(api_key: str, account_id: str, environment: str) -> VerifyResponse:
    """
    Verify OANDA connection by checking account info.
    """
    try:
        base_url = "https://api-fxtrade.oanda.com" if environment == "live" else "https://api-fxpractice.oanda.com"
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        async with httpx.AsyncClient(timeout=15.0) as client:
            # Test connection by fetching account info
            response = await client.get(
                f"{base_url}/v3/accounts/{account_id}",
                headers=headers
            )
            
            if response.status_code != 200:
                return VerifyResponse(
                    success=False,
                    error=f"OANDA API error: {response.status_code} - {response.text}"
                )
            
            account_data = response.json()
            account = account_data.get("account", {})
            
            balance = float(account.get("balance", 0))
            currency = account.get("currency", "USD")
            
            logger.info("OANDA connection verified", account_id=account_id, balance=balance)
            
            return VerifyResponse(
                success=True,
                balance=balance,
                equity=balance,  # OANDA doesn't have separate equity
                currency=currency
            )
            
    except httpx.TimeoutException:
        return VerifyResponse(
            success=False,
            error="OANDA API timeout - please check your connection"
        )
    except Exception as e:
        logger.error("OANDA verification error", error=str(e))
        return VerifyResponse(
            success=False,
            error=f"OANDA verification failed: {str(e)}"
        )


async def verify_binance_connection(
    api_key: str,
    secret_key: str,
    is_testnet: bool,
) -> VerifyResponse:
    try:
        account_info = await fetch_binance_spot_account_info(
            api_key=api_key,
            secret_key=secret_key,
            demo_mode=is_testnet,
        )
        await test_binance_spot_order_permission(
            api_key=api_key,
            secret_key=secret_key,
            demo_mode=is_testnet,
        )
        prices = await fetch_binance_spot_prices(demo_mode=is_testnet)
        wallet_totals = estimate_binance_wallet_total(
            account_info=account_info,
            prices=prices,
            quote_currency="USDT",
        )
        total = wallet_totals["balance"]

        logger.info("Binance connection verified", is_testnet=is_testnet, balance=total)

        return VerifyResponse(
            success=True,
            balance=total,
            equity=total,
            currency="USDT",
        )
    except Exception as e:
        error_message = str(e)
        if is_testnet and '"code":-2008' in error_message:
            error_message = (
                "Binance Demo Spot could not recognize this API key. "
                "TradePilot currently connects crypto bots through Binance Spot. "
                "Create the API key from the Spot tab in demo.binance.com, not Futures Demo, then try again."
            )
        elif is_testnet and '"code":-2015' in error_message:
            error_message = (
                "Binance Demo Spot rejected this key for trading. The key can be wrong, lack Spot trading permission, "
                "have an IP restriction, or be a mismatched key/secret pair. Use a Spot Demo key from demo.binance.com "
                "with trading permission enabled and no blocking IP restriction."
            )

        logger.error("Binance verification error", error=error_message)
        return VerifyResponse(
            success=False,
            error=f"Binance verification failed: {error_message}",
        )
