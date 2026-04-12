from app.config.settings import settings
from app.adapters.broker_adapter import BrokerAdapter
from app.adapters.data_provider import DataProvider
from app.adapters.paper_adapter import PaperBrokerAdapter
from app.utils.logger import get_logger

logger = get_logger()


def create_broker(market: str = "forex") -> BrokerAdapter:
    if settings.broker_mode == "paper":
        logger.info("using paper broker", market=market)
        return PaperBrokerAdapter()

    if market == "crypto":
        from app.adapters.ccxt_adapter import CCXTBrokerAdapter
        logger.info("using CCXT/Binance broker")
        return CCXTBrokerAdapter()

    # MT5 requires Windows terminal — use OANDA REST for forex execution instead
    from app.adapters.oanda_adapter import OandaBrokerAdapter
    logger.info("using OANDA broker")
    return OandaBrokerAdapter()


def create_data_provider(market: str = "forex") -> DataProvider:
    if market == "crypto":
        from app.adapters.ccxt_provider import CCXTProvider
        logger.info("using CCXT/Binance data provider")
        return CCXTProvider()

    from app.adapters.oanda_provider import OandaProvider
    logger.info("using OANDA data provider")
    return OandaProvider()
