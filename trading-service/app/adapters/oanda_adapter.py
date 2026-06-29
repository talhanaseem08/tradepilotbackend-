"""
OANDA Broker Adapter — trade execution via OANDA REST API v20.

Used for live forex trading.
"""
import httpx
from app.adapters.broker_adapter import BrokerAdapter
from app.config.settings import settings
from app.core.circuit_breaker import oanda_breaker
from app.services.broker_credentials import UserBrokerCredentials
from app.utils.logger import get_logger

logger = get_logger()


def _format_instrument(symbol: str) -> str:
    """Convert EURUSD → EUR_USD for OANDA."""
    s = symbol.upper().replace("/", "").replace("_", "")
    if len(s) == 6:
        return f"{s[:3]}_{s[3:]}"
    return s


class OandaBrokerAdapter(BrokerAdapter):
    def __init__(self, credentials: UserBrokerCredentials | None = None):
        self.api_key = credentials.api_key if credentials else settings.oanda_api_key
        self.base_url = (
            credentials.oanda_base_url if credentials else settings.oanda_base_url
        )
        self.account_id = credentials.account_id if credentials else settings.oanda_account_id
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

    async def place_order(
        self,
        symbol: str,
        side: str,
        quantity: float,
        order_type: str = "market",
        price: float | None = None,
        stop_loss: float | None = None,
        take_profit: float | None = None,
    ) -> dict:
        instrument = _format_instrument(symbol)
        # OANDA: positive units = buy, negative = sell
        units = str(quantity) if side == "buy" else str(-quantity)

        order_body: dict = {
            "type": "MARKET" if order_type == "market" else "LIMIT",
            "instrument": instrument,
            "units": units,
            "timeInForce": "FOK",
        }

        if order_type != "market" and price:
            order_body["price"] = f"{price:.5f}"

        if stop_loss:
            order_body["stopLossOnFill"] = {"price": f"{stop_loss:.5f}"}

        if take_profit:
            order_body["takeProfitOnFill"] = {"price": f"{take_profit:.5f}"}

        async def _call():
            async with httpx.AsyncClient(timeout=15.0) as client:
                resp = await client.post(
                    f"{self.base_url}/v3/accounts/{self.account_id}/orders",
                    headers=self.headers,
                    json={"order": order_body},
                )
                resp.raise_for_status()
                return resp.json()

        try:
            data = await oanda_breaker.call(_call)
        except Exception as e:
            logger.error("oanda place_order failed", error=str(e), symbol=symbol)
            return {"error": str(e), "status": "failed"}

        filled = data.get("orderFillTransaction", {})
        trade_id = filled.get("tradeOpened", {}).get("tradeID") or filled.get("id")
        entry_price = filled.get("price", 0)

        logger.info("oanda order placed", trade_id=trade_id,
                    instrument=instrument, side=side, units=units)

        return {
            "order_id": str(trade_id),
            "symbol": symbol,
            "side": side,
            "quantity": quantity,
            "entry_price": float(entry_price) if entry_price else 0.0,
            "status": "open",
        }

    async def close_order(self, order_id: str) -> dict:
        async def _call():
            async with httpx.AsyncClient(timeout=15.0) as client:
                resp = await client.put(
                    f"{self.base_url}/v3/accounts/{self.account_id}/trades/{order_id}/close",
                    headers=self.headers,
                )
                resp.raise_for_status()
                return resp.json()

        try:
            data = await oanda_breaker.call(_call)
        except Exception as e:
            logger.error("oanda close_order failed", error=str(e), order_id=order_id)
            return {"error": str(e), "status": "failed"}

        tx = data.get("orderFillTransaction", {})
        close_price = tx.get("price", 0)

        logger.info("oanda trade closed", order_id=order_id, price=close_price)
        return {
            "order_id": order_id,
            "status": "closed",
            "close_price": float(close_price) if close_price else 0.0,
        }

    async def get_position(self, symbol: str) -> dict | None:
        instrument = _format_instrument(symbol)

        async def _call():
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.get(
                    f"{self.base_url}/v3/accounts/{self.account_id}/positions/{instrument}",
                    headers=self.headers,
                )
                resp.raise_for_status()
                return resp.json()

        try:
            data = await oanda_breaker.call(_call)
        except Exception as e:
            logger.error("oanda get_position failed", error=str(e), symbol=symbol)
            return None

        pos = data.get("position", {})
        long_units = float(pos.get("long", {}).get("units", 0))
        short_units = float(pos.get("short", {}).get("units", 0))

        if long_units == 0 and short_units == 0:
            return None

        side = "buy" if long_units > 0 else "sell"
        units = long_units if side == "buy" else abs(short_units)
        avg_price = float(
            pos.get("long", {}).get("averagePrice", 0)
            if side == "buy"
            else pos.get("short", {}).get("averagePrice", 0)
        )
        pnl = float(pos.get("unrealizedPL", 0))

        return {
            "symbol": symbol,
            "side": side,
            "volume": units,
            "entry_price": avg_price,
            "current_pnl": pnl,
        }

    async def get_account_balance(self) -> dict:
        async def _call():
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.get(
                    f"{self.base_url}/v3/accounts/{self.account_id}/summary",
                    headers=self.headers,
                )
                resp.raise_for_status()
                return resp.json()

        try:
            data = await oanda_breaker.call(_call)
        except Exception as e:
            logger.error("oanda get_account_balance failed", error=str(e))
            return {"balance": 0, "equity": 0}

        acct = data.get("account", {})
        return {
            "balance": float(acct.get("balance", 0)),
            "equity": float(acct.get("NAV", 0)),
            "unrealized_pnl": float(acct.get("unrealizedPL", 0)),
            "margin_used": float(acct.get("marginUsed", 0)),
        }
