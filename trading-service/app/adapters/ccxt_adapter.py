import ccxt.async_support as ccxt
from app.adapters.broker_adapter import BrokerAdapter
from app.config.settings import settings
from app.utils.logger import get_logger

logger = get_logger()


class CCXTBrokerAdapter(BrokerAdapter):
    def __init__(self):
        self.exchange = ccxt.binance({
            "apiKey": settings.binance_api_key,
            "secret": settings.binance_api_secret,
            "sandbox": settings.binance_sandbox,
            "enableRateLimit": True,
            "options": {"defaultType": "spot"},
        })

    async def place_order(self, symbol: str, side: str, quantity: float,
                          order_type: str = "market", price: float | None = None,
                          stop_loss: float | None = None,
                          take_profit: float | None = None) -> dict:
        formatted = self._format_symbol(symbol)

        try:
            if order_type == "market":
                order = await self.exchange.create_order(
                    formatted, "market", side, quantity
                )
            else:
                order = await self.exchange.create_order(
                    formatted, "limit", side, quantity, price
                )

            result = {
                "order_id": order.get("id"),
                "symbol": symbol,
                "side": side,
                "quantity": quantity,
                "entry_price": order.get("average") or order.get("price", 0),
                "status": order.get("status", "open"),
            }

            logger.info("ccxt order placed", order_id=result["order_id"],
                        symbol=formatted, side=side)
            return result

        except Exception as e:
            logger.error("ccxt order failed", error=str(e), symbol=symbol, side=side)
            return {"error": str(e), "status": "failed"}

    async def close_order(self, order_id: str) -> dict:
        try:
            order = await self.exchange.cancel_order(order_id)
            logger.info("ccxt order cancelled", order_id=order_id)
            return {"order_id": order_id, "status": "cancelled"}
        except Exception as e:
            logger.error("ccxt cancel failed", error=str(e), order_id=order_id)
            return {"error": str(e), "status": "failed"}

    async def get_position(self, symbol: str) -> dict | None:
        formatted = self._format_symbol(symbol)
        try:
            balance = await self.exchange.fetch_balance()
            base = formatted.split("/")[0]
            amount = balance.get(base, {}).get("total", 0)
            if amount and float(amount) > 0:
                return {"symbol": symbol, "amount": float(amount)}
            return None
        except Exception as e:
            logger.error("ccxt position fetch failed", error=str(e))
            return None

    async def get_account_balance(self) -> dict:
        try:
            balance = await self.exchange.fetch_balance()
            usdt = balance.get("USDT", {})
            return {
                "balance": usdt.get("total", 0),
                "free": usdt.get("free", 0),
                "used": usdt.get("used", 0),
            }
        except Exception as e:
            logger.error("ccxt balance fetch failed", error=str(e))
            return {"balance": 0, "free": 0, "used": 0}

    async def close(self):
        await self.exchange.close()

    def _format_symbol(self, symbol: str) -> str:
        symbol = symbol.upper()
        if "/" in symbol:
            return symbol
        for quote in ["USDT", "BUSD", "BTC", "ETH", "USD"]:
            if symbol.endswith(quote):
                base = symbol[: -len(quote)]
                return f"{base}/{quote}"
        return symbol
