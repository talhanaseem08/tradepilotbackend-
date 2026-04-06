import uuid
from datetime import datetime, timezone
from app.adapters.broker_adapter import BrokerAdapter
from app.utils.logger import get_logger

logger = get_logger()


class PaperBrokerAdapter(BrokerAdapter):
    def __init__(self, initial_balance: float = 10000.0, slippage_pct: float = 0.01):
        self.balance = initial_balance
        self.initial_balance = initial_balance
        self.slippage_pct = slippage_pct
        self.positions: dict[str, dict] = {}
        self.orders: dict[str, dict] = {}

    async def place_order(self, symbol: str, side: str, quantity: float,
                          order_type: str = "market", price: float | None = None,
                          stop_loss: float | None = None,
                          take_profit: float | None = None) -> dict:
        order_id = str(uuid.uuid4())[:8]
        fill_price = price or 0.0

        slippage = fill_price * (self.slippage_pct / 100)
        if side == "buy":
            fill_price += slippage
        else:
            fill_price -= slippage

        order = {
            "order_id": order_id,
            "symbol": symbol,
            "side": side,
            "quantity": quantity,
            "entry_price": round(fill_price, 5),
            "stop_loss": stop_loss,
            "take_profit": take_profit,
            "status": "open",
            "opened_at": datetime.now(timezone.utc).isoformat(),
        }

        self.orders[order_id] = order
        self.positions[symbol] = order

        logger.info("paper order placed", order_id=order_id, symbol=symbol,
                     side=side, price=fill_price)
        return order

    async def close_order(self, order_id: str) -> dict:
        order = self.orders.get(order_id)
        if not order:
            return {"error": "Order not found"}

        order["status"] = "closed"
        order["closed_at"] = datetime.now(timezone.utc).isoformat()

        symbol = order["symbol"]
        if symbol in self.positions:
            del self.positions[symbol]

        logger.info("paper order closed", order_id=order_id)
        return order

    async def get_position(self, symbol: str) -> dict | None:
        return self.positions.get(symbol)

    async def get_account_balance(self) -> dict:
        return {
            "balance": self.balance,
            "initial_balance": self.initial_balance,
            "pnl": round(self.balance - self.initial_balance, 2),
        }
