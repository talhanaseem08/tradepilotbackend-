from abc import ABC, abstractmethod


class BrokerAdapter(ABC):
    @abstractmethod
    async def place_order(self, symbol: str, side: str, quantity: float,
                          order_type: str = "market", price: float | None = None,
                          stop_loss: float | None = None,
                          take_profit: float | None = None) -> dict:
        pass

    @abstractmethod
    async def close_order(self, order_id: str) -> dict:
        pass

    @abstractmethod
    async def get_position(self, symbol: str) -> dict | None:
        pass

    @abstractmethod
    async def get_account_balance(self) -> dict:
        pass
