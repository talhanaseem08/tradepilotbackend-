from app.config.settings import settings
from app.adapters.broker_adapter import BrokerAdapter
from app.adapters.data_provider import DataProvider
from app.adapters.paper_adapter import PaperBrokerAdapter
from app.services.broker_credentials import UserBrokerCredentials
from app.utils.logger import get_logger

logger = get_logger()


def create_broker(
    market: str = "forex",
    credentials: UserBrokerCredentials | None = None,
) -> BrokerAdapter:
    broker_mode = (settings.broker_mode or "broker").lower()

    if broker_mode == "paper":
        logger.info("using paper broker", market=market)
        return PaperBrokerAdapter()

    if market == "crypto":
        from app.adapters.ccxt_adapter import CCXTBrokerAdapter
        logger.info("using CCXT/Binance broker", mode=broker_mode)
        return CCXTBrokerAdapter(credentials)

    # MT5 requires Windows terminal — use OANDA REST for forex execution instead
    from app.adapters.oanda_adapter import OandaBrokerAdapter
    logger.info("using OANDA broker", mode=broker_mode)
    return OandaBrokerAdapter(credentials)


def create_data_provider(
    market: str = "forex",
    credentials: UserBrokerCredentials | None = None,
) -> DataProvider:
    if market == "crypto":
        from app.adapters.ccxt_provider import CCXTProvider
        logger.info("using CCXT/Binance data provider")
        return CCXTProvider(credentials)

    from app.adapters.oanda_provider import OandaProvider
    logger.info("using OANDA data provider")
    return OandaProvider(credentials)
