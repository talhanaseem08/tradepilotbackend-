from app.adapters.broker_adapter import BrokerAdapter
from app.config.settings import settings
from app.services.binance_client import (
    create_binance_exchange,
    estimate_binance_wallet_total,
    fetch_binance_spot_account_info,
    fetch_binance_spot_exchange_info,
    fetch_binance_spot_prices,
    get_binance_lot_size_filters,
    place_binance_spot_market_order,
    quantize_binance_quantity,
)
from app.services.broker_credentials import UserBrokerCredentials
from app.utils.logger import get_logger

logger = get_logger()


class CCXTBrokerAdapter(BrokerAdapter):
    def __init__(self, credentials: UserBrokerCredentials | None = None):
        api_key = credentials.api_key if credentials else settings.binance_api_key
        secret_key = credentials.secret_key if credentials else settings.binance_api_secret
        sandbox = (
            credentials.is_testnet
            if credentials and credentials.is_testnet is not None
            else settings.binance_sandbox
        )
        self.exchange = create_binance_exchange(
            api_key=api_key,
            secret_key=secret_key,
            demo_mode=sandbox,
            default_type="spot",
        )
        self.api_key = api_key
        self.secret_key = secret_key
        self.demo_mode = sandbox

    async def place_order(self, symbol: str, side: str, quantity: float,
                          order_type: str = "market", price: float | None = None,
                          stop_loss: float | None = None,
                          take_profit: float | None = None) -> dict:
        formatted = self._format_symbol(symbol)
        rest_symbol = formatted.replace("/", "")
        normalized_quantity = quantity

        try:
            if order_type == "market":
                symbol_info_payload = await fetch_binance_spot_exchange_info(
                    symbol=rest_symbol,
                    demo_mode=self.demo_mode,
                )
                symbol_infos = symbol_info_payload.get("symbols", [])
                symbol_info = symbol_infos[0] if symbol_infos else {}
                min_qty, step_size = get_binance_lot_size_filters(symbol_info)
                normalized_quantity = quantize_binance_quantity(
                    quantity,
                    min_qty=min_qty,
                    step_size=step_size,
                )
                if normalized_quantity <= 0:
                    return {
                        "error": f"Quantity {quantity} is below Binance minimum or step size for {rest_symbol}",
                        "status": "failed",
                    }

                order = await place_binance_spot_market_order(
                    api_key=self.api_key or "",
                    secret_key=self.secret_key or "",
                    symbol=rest_symbol,
                    side=side,
                    quantity=normalized_quantity,
                    demo_mode=self.demo_mode,
                )
            else:
                order = await self.exchange.create_order(
                    formatted, "limit", side, quantity, price
                )

            executed_qty = float(order.get("executedQty", 0) or 0)
            cumulative_quote = float(order.get("cummulativeQuoteQty", 0) or 0)
            fill_price = (
                cumulative_quote / executed_qty
                if executed_qty > 0
                else order.get("average") or order.get("price", 0)
            )
            order_id = order.get("orderId") or order.get("id")

            result = {
                "order_id": order_id,
                "symbol": symbol,
                "side": side,
                "quantity": float(
                    order.get("executedQty", 0) or (
                        normalized_quantity if order_type == "market" else quantity
                    )
                ),
                "entry_price": fill_price,
                "status": str(order.get("status", "open") or "open").lower(),
            }

            logger.info("ccxt order placed", order_id=order_id, symbol=formatted, side=side)

            # Place OCO (stop-loss + take-profit) on the closing side
            if stop_loss and take_profit and fill_price:
                close_side = "sell" if side == "buy" else "buy"
                try:
                    oco = await self.exchange.privatePostOrderOco({
                        "symbol": rest_symbol,
                        "side": close_side.upper(),
                        "quantity": str(result["quantity"]),
                        "price": str(take_profit),
                        "stopPrice": str(stop_loss),
                        "stopLimitPrice": str(stop_loss),
                        "stopLimitTimeInForce": "GTC",
                    })
                    result["oco_order_id"] = oco.get("orderListId")
                    logger.info("ccxt OCO placed", oco_id=result["oco_order_id"],
                                sl=stop_loss, tp=take_profit)
                except Exception as oco_err:
                    logger.warning("ccxt OCO failed (main order still placed)",
                                   error=str(oco_err), symbol=symbol)

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
            balance = await self._fetch_spot_balances()
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
            account_info = await fetch_binance_spot_account_info(
                api_key=self.api_key,
                secret_key=self.secret_key,
                demo_mode=self.demo_mode,
            )
            prices = await fetch_binance_spot_prices(demo_mode=self.demo_mode)
            totals = estimate_binance_wallet_total(
                account_info=account_info,
                prices=prices,
                quote_currency="USDT",
            )
            return {
                "balance": totals["balance"],
                "free": totals["free"],
                "used": totals["used"],
            }
        except Exception as e:
            logger.error("ccxt balance fetch failed", error=str(e))
            return {"balance": 0, "free": 0, "used": 0}

    async def _fetch_spot_balances(self) -> dict:
        account_info = await fetch_binance_spot_account_info(
            api_key=self.api_key,
            secret_key=self.secret_key,
            demo_mode=self.demo_mode,
        )
        result: dict[str, dict[str, float]] = {}
        for item in account_info.get("balances", []):
            asset = item.get("asset")
            if not asset:
                continue
            free = float(item.get("free", 0) or 0)
            locked = float(item.get("locked", 0) or 0)
            result[asset] = {
                "free": free,
                "used": locked,
                "total": free + locked,
            }
        return result

    async def get_spot_balances(self) -> dict:
        return await self._fetch_spot_balances()

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
