import ccxt.async_support as ccxt
import hashlib
import hmac
from decimal import Decimal, ROUND_DOWN
from urllib.parse import urlencode

import httpx


BINANCE_SPOT_DEMO_BASE_URL = "https://demo-api.binance.com"
BINANCE_FUTURES_DEMO_BASE_URL = "https://demo-fapi.binance.com"
BINANCE_SPOT_LIVE_BASE_URL = "https://api.binance.com"


def create_binance_exchange(
    api_key: str | None = None,
    secret_key: str | None = None,
    demo_mode: bool = False,
    default_type: str = "spot",
):
    exchange = ccxt.binance(
        {
            "apiKey": api_key,
            "secret": secret_key,
            "enableRateLimit": True,
            "options": {"defaultType": default_type},
        }
    )

    if demo_mode:
        api_urls = exchange.urls.setdefault("api", {})
        api_urls.update(
            {
                "sapi": f"{BINANCE_SPOT_DEMO_BASE_URL}/sapi/v1",
                "sapiV2": f"{BINANCE_SPOT_DEMO_BASE_URL}/sapi/v2",
                "sapiV3": f"{BINANCE_SPOT_DEMO_BASE_URL}/sapi/v3",
                "sapiV4": f"{BINANCE_SPOT_DEMO_BASE_URL}/sapi/v4",
                "public": f"{BINANCE_SPOT_DEMO_BASE_URL}/api/v3",
                "private": f"{BINANCE_SPOT_DEMO_BASE_URL}/api/v3",
                "v1": f"{BINANCE_SPOT_DEMO_BASE_URL}/api/v1",
                "fapiPublic": f"{BINANCE_FUTURES_DEMO_BASE_URL}/fapi/v1",
                "fapiPublicV2": f"{BINANCE_FUTURES_DEMO_BASE_URL}/fapi/v2",
                "fapiPublicV3": f"{BINANCE_FUTURES_DEMO_BASE_URL}/fapi/v3",
                "fapiPrivate": f"{BINANCE_FUTURES_DEMO_BASE_URL}/fapi/v1",
                "fapiPrivateV2": f"{BINANCE_FUTURES_DEMO_BASE_URL}/fapi/v2",
                "fapiPrivateV3": f"{BINANCE_FUTURES_DEMO_BASE_URL}/fapi/v3",
            }
        )

    return exchange


async def fetch_binance_spot_account_info(
    api_key: str,
    secret_key: str,
    demo_mode: bool = False,
):
    base_url = BINANCE_SPOT_DEMO_BASE_URL if demo_mode else BINANCE_SPOT_LIVE_BASE_URL
    params = {
        "timestamp": int(__import__("time").time() * 1000),
        "recvWindow": 10000,
    }
    query = urlencode(params)
    signature = hmac.new(
        secret_key.encode("utf-8"),
        query.encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()
    url = f"{base_url}/api/v3/account?{query}&signature={signature}"
    headers = {"X-MBX-APIKEY": api_key}

    async with httpx.AsyncClient(timeout=20.0) as client:
        response = await client.get(url, headers=headers)
        response.raise_for_status()
        return response.json()


async def fetch_binance_spot_prices(demo_mode: bool = False) -> dict[str, float]:
    base_url = BINANCE_SPOT_DEMO_BASE_URL if demo_mode else BINANCE_SPOT_LIVE_BASE_URL
    async with httpx.AsyncClient(timeout=20.0) as client:
        response = await client.get(f"{base_url}/api/v3/ticker/price")
        response.raise_for_status()
        payload = response.json()

    prices: dict[str, float] = {}
    if isinstance(payload, list):
        for item in payload:
            symbol = item.get("symbol")
            price = item.get("price")
            if not symbol or price is None:
                continue
            try:
                prices[str(symbol)] = float(price)
            except (TypeError, ValueError):
                continue
    return prices


async def fetch_binance_spot_exchange_info(
    *,
    symbol: str | None = None,
    demo_mode: bool = False,
) -> dict:
    base_url = BINANCE_SPOT_DEMO_BASE_URL if demo_mode else BINANCE_SPOT_LIVE_BASE_URL
    params = {"symbol": symbol} if symbol else None
    async with httpx.AsyncClient(timeout=20.0) as client:
        response = await client.get(f"{base_url}/api/v3/exchangeInfo", params=params)
        response.raise_for_status()
        return response.json()


def get_binance_lot_size_filters(symbol_info: dict) -> tuple[float | None, float | None]:
    for flt in symbol_info.get("filters", []):
        if flt.get("filterType") == "LOT_SIZE":
            min_qty = float(flt.get("minQty", 0) or 0)
            step_size = float(flt.get("stepSize", 0) or 0)
            return min_qty, step_size
    return None, None


def quantize_binance_quantity(
    quantity: float,
    *,
    min_qty: float | None,
    step_size: float | None,
) -> float:
    if quantity <= 0:
        return 0.0
    if not step_size or step_size <= 0:
        return quantity

    quantity_dec = Decimal(str(quantity))
    step_dec = Decimal(str(step_size))
    snapped = (quantity_dec / step_dec).to_integral_value(rounding=ROUND_DOWN) * step_dec
    snapped_float = float(snapped)

    if min_qty and snapped_float < min_qty:
        return 0.0
    return snapped_float


async def place_binance_spot_market_order(
    *,
    api_key: str,
    secret_key: str,
    symbol: str,
    side: str,
    demo_mode: bool = False,
    quantity: float | None = None,
    quote_order_qty: float | None = None,
) -> dict:
    if quantity is None and quote_order_qty is None:
        raise ValueError("quantity or quote_order_qty is required")

    base_url = BINANCE_SPOT_DEMO_BASE_URL if demo_mode else BINANCE_SPOT_LIVE_BASE_URL
    params: dict[str, str | int | float] = {
        "symbol": symbol,
        "side": side.upper(),
        "type": "MARKET",
        "timestamp": int(__import__("time").time() * 1000),
        "recvWindow": 10000,
    }
    if quantity is not None:
        params["quantity"] = quantity
    if quote_order_qty is not None:
        params["quoteOrderQty"] = quote_order_qty

    query = urlencode(params)
    signature = hmac.new(
        secret_key.encode("utf-8"),
        query.encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()
    signed_params = {**params, "signature": signature}
    headers = {
        "X-MBX-APIKEY": api_key,
        "Content-Type": "application/x-www-form-urlencoded",
    }

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            f"{base_url}/api/v3/order",
            headers=headers,
            content=urlencode(signed_params),
        )
        try:
            response.raise_for_status()
        except httpx.HTTPStatusError as exc:
            body = response.text.strip()
            if body:
                raise httpx.HTTPStatusError(
                    f"{exc}. Response body: {body}",
                    request=exc.request,
                    response=exc.response,
                ) from exc
            raise
        return response.json()


async def test_binance_spot_order_permission(
    *,
    api_key: str,
    secret_key: str,
    demo_mode: bool = False,
    symbol: str = "BTCUSDT",
    quote_order_qty: float = 20.0,
) -> None:
    base_url = BINANCE_SPOT_DEMO_BASE_URL if demo_mode else BINANCE_SPOT_LIVE_BASE_URL
    params: dict[str, str | int | float] = {
        "symbol": symbol,
        "side": "BUY",
        "type": "MARKET",
        "quoteOrderQty": quote_order_qty,
        "timestamp": int(__import__("time").time() * 1000),
        "recvWindow": 10000,
    }
    query = urlencode(params)
    signature = hmac.new(
        secret_key.encode("utf-8"),
        query.encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()
    signed_params = {**params, "signature": signature}
    headers = {
        "X-MBX-APIKEY": api_key,
        "Content-Type": "application/x-www-form-urlencoded",
    }

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            f"{base_url}/api/v3/order/test",
            headers=headers,
            content=urlencode(signed_params),
        )
        try:
            response.raise_for_status()
        except httpx.HTTPStatusError as exc:
            body = response.text.strip()
            if body:
                raise httpx.HTTPStatusError(
                    f"{exc}. Response body: {body}",
                    request=exc.request,
                    response=exc.response,
                ) from exc
            raise


def estimate_binance_wallet_total(
    account_info: dict,
    prices: dict[str, float],
    quote_currency: str = "USDT",
) -> dict[str, float]:
    total_value = 0.0
    free_value = 0.0
    used_value = 0.0

    for item in account_info.get("balances", []):
        asset = item.get("asset")
        if not asset:
            continue

        free = float(item.get("free", 0) or 0)
        locked = float(item.get("locked", 0) or 0)
        amount = free + locked
        if amount <= 0:
            continue

        if asset == quote_currency:
            multiplier = 1.0
        else:
            direct_symbol = f"{asset}{quote_currency}"
            inverse_symbol = f"{quote_currency}{asset}"

            if direct_symbol in prices:
                multiplier = prices[direct_symbol]
            elif inverse_symbol in prices and prices[inverse_symbol] > 0:
                multiplier = 1.0 / prices[inverse_symbol]
            else:
                continue

        total_value += amount * multiplier
        free_value += free * multiplier
        used_value += locked * multiplier

    return {
        "balance": total_value,
        "free": free_value,
        "used": used_value,
    }
