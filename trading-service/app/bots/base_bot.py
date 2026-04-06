from abc import ABC, abstractmethod


class BaseBot(ABC):
    def __init__(self, symbol: str, timeframe: str, parameters: dict):
        self.symbol = symbol
        self.timeframe = timeframe
        self.parameters = parameters

    @abstractmethod
    def analyze(self, candles: list[dict]) -> str:
        """Returns 'buy', 'sell', or 'hold'."""
        pass

    @abstractmethod
    def calculate_stop_loss(self, entry_price: float, side: str) -> float:
        pass

    @abstractmethod
    def calculate_take_profit(self, entry_price: float, side: str) -> float:
        pass

    def calculate_position_size(self, balance: float, risk_pct: float = 1.0) -> float:
        return round(balance * (risk_pct / 100), 2)

    def get_parameters(self) -> dict:
        return self.parameters.copy()

    def update_parameters(self, new_params: dict):
        self.parameters.update(new_params)
