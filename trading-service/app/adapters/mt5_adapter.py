import asyncio
from app.adapters.broker_adapter import BrokerAdapter
from app.config.settings import settings
from app.utils.logger import get_logger

logger = get_logger()


class MT5BrokerAdapter(BrokerAdapter):
    """MetaTrader 5 broker adapter. Requires MT5 terminal running on Windows."""

    def __init__(self):
        self._initialized = False

    async def _ensure_connected(self):
        if self._initialized:
            return True

        try:
            import MetaTrader5 as mt5
        except ImportError:
            logger.error("MetaTrader5 package not installed. Run: pip install MetaTrader5")
            return False

        init_args = {}
        if settings.mt5_path:
            init_args["path"] = settings.mt5_path
        if settings.mt5_login:
            init_args["login"] = settings.mt5_login
            init_args["password"] = settings.mt5_password
            init_args["server"] = settings.mt5_server

        ok = await asyncio.to_thread(mt5.initialize, **init_args)
        if not ok:
            error = mt5.last_error()
            logger.error("mt5 init failed", error=str(error))
            return False

        self._initialized = True
        logger.info("mt5 connected", login=settings.mt5_login, server=settings.mt5_server)
        return True

    async def place_order(self, symbol: str, side: str, quantity: float,
                          order_type: str = "market", price: float | None = None,
                          stop_loss: float | None = None,
                          take_profit: float | None = None) -> dict:
        if not await self._ensure_connected():
            return {"error": "MT5 not connected", "status": "failed"}

        import MetaTrader5 as mt5

        action = mt5.TRADE_ACTION_DEAL
        order_type_mt5 = mt5.ORDER_TYPE_BUY if side == "buy" else mt5.ORDER_TYPE_SELL

        if price is None:
            tick = await asyncio.to_thread(mt5.symbol_info_tick, symbol)
            if tick is None:
                return {"error": f"No tick data for {symbol}", "status": "failed"}
            price = tick.ask if side == "buy" else tick.bid

        request = {
            "action": action,
            "symbol": symbol,
            "volume": quantity,
            "type": order_type_mt5,
            "price": price,
            "deviation": 20,
            "magic": 234000,
            "comment": "TradePilot",
            "type_time": mt5.ORDER_TIME_GTC,
            "type_filling": mt5.ORDER_FILLING_IOC,
        }

        if stop_loss:
            request["sl"] = stop_loss
        if take_profit:
            request["tp"] = take_profit

        result = await asyncio.to_thread(mt5.order_send, request)

        if result is None or result.retcode != mt5.TRADE_RETCODE_DONE:
            error_msg = result.comment if result else "Unknown error"
            logger.error("mt5 order failed", error=error_msg, symbol=symbol)
            return {"error": error_msg, "status": "failed"}

        logger.info("mt5 order placed", order_id=result.order,
                     symbol=symbol, side=side, price=result.price)
        return {
            "order_id": str(result.order),
            "symbol": symbol,
            "side": side,
            "quantity": quantity,
            "entry_price": result.price,
            "status": "open",
        }

    async def close_order(self, order_id: str) -> dict:
        if not await self._ensure_connected():
            return {"error": "MT5 not connected", "status": "failed"}

        import MetaTrader5 as mt5

        position_id = int(order_id)
        positions = await asyncio.to_thread(mt5.positions_get, ticket=position_id)

        if not positions:
            return {"error": "Position not found", "status": "failed"}

        pos = positions[0]
        close_type = mt5.ORDER_TYPE_SELL if pos.type == mt5.ORDER_TYPE_BUY else mt5.ORDER_TYPE_BUY
        tick = await asyncio.to_thread(mt5.symbol_info_tick, pos.symbol)
        close_price = tick.bid if pos.type == mt5.ORDER_TYPE_BUY else tick.ask

        request = {
            "action": mt5.TRADE_ACTION_DEAL,
            "symbol": pos.symbol,
            "volume": pos.volume,
            "type": close_type,
            "position": position_id,
            "price": close_price,
            "deviation": 20,
            "magic": 234000,
            "comment": "TradePilot close",
            "type_time": mt5.ORDER_TIME_GTC,
            "type_filling": mt5.ORDER_FILLING_IOC,
        }

        result = await asyncio.to_thread(mt5.order_send, request)

        if result is None or result.retcode != mt5.TRADE_RETCODE_DONE:
            error_msg = result.comment if result else "Unknown error"
            logger.error("mt5 close failed", error=error_msg)
            return {"error": error_msg, "status": "failed"}

        logger.info("mt5 position closed", order_id=order_id, price=result.price)
        return {"order_id": order_id, "status": "closed", "close_price": result.price}

    async def get_position(self, symbol: str) -> dict | None:
        if not await self._ensure_connected():
            return None

        import MetaTrader5 as mt5

        positions = await asyncio.to_thread(mt5.positions_get, symbol=symbol)
        if not positions:
            return None

        pos = positions[0]
        return {
            "symbol": pos.symbol,
            "side": "buy" if pos.type == 0 else "sell",
            "volume": pos.volume,
            "entry_price": pos.price_open,
            "current_pnl": pos.profit,
            "ticket": pos.ticket,
        }

    async def get_account_balance(self) -> dict:
        if not await self._ensure_connected():
            return {"balance": 0, "equity": 0, "margin": 0}

        import MetaTrader5 as mt5

        info = await asyncio.to_thread(mt5.account_info)
        if not info:
            return {"balance": 0, "equity": 0, "margin": 0}

        return {
            "balance": info.balance,
            "equity": info.equity,
            "margin": info.margin,
            "free_margin": info.margin_free,
            "profit": info.profit,
        }

    async def shutdown(self):
        if self._initialized:
            import MetaTrader5 as mt5
            await asyncio.to_thread(mt5.shutdown)
            self._initialized = False
            logger.info("mt5 disconnected")
