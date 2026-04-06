import httpx
from datetime import datetime, timezone
from app.scrapers.base_scraper import BaseScraper
from app.schemas.news import NewsItem
from app.config.settings import settings
from app.utils.logger import get_logger

logger = get_logger()

JBLANKED_TODAY_URL = "https://www.jblanked.com/news/api/forex-factory/calendar/today/"
JBLANKED_WEEK_URL = "https://www.jblanked.com/news/api/forex-factory/calendar/week/"

CURRENCY_MAP = {
    "USD": ["EURUSD", "GBPUSD", "USDJPY", "USDCHF", "USDCAD", "AUDUSD", "NZDUSD"],
    "EUR": ["EURUSD", "EURGBP", "EURJPY", "EURCHF"],
    "GBP": ["GBPUSD", "EURGBP", "GBPJPY"],
    "JPY": ["USDJPY", "EURJPY", "GBPJPY"],
    "AUD": ["AUDUSD", "AUDCAD", "AUDJPY"],
    "CAD": ["USDCAD", "AUDCAD"],
    "CHF": ["USDCHF", "EURCHF"],
    "NZD": ["NZDUSD"],
}


class ForexFactoryScraper(BaseScraper):
    @property
    def source_name(self) -> str:
        return "forexfactory"

    async def fetch_news(self, symbol: str | None = None) -> list[NewsItem]:
        if not settings.jblanked_api_key:
            logger.warning("jblanked API key not set, skipping forex factory news")
            return []

        try:
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Api-Key {settings.jblanked_api_key}",
            }

            async with httpx.AsyncClient(timeout=15.0) as client:
                resp = await client.get(JBLANKED_TODAY_URL, headers=headers)
                resp.raise_for_status()
                events = resp.json()

            if not isinstance(events, list):
                logger.warning("jblanked returned non-list response")
                return []

            items = []
            for event in events:
                currency = event.get("Currency", "").upper()
                name = event.get("Name", "")
                impact = event.get("Impact", "").lower()
                date = event.get("Date", "")
                actual = event.get("Actual", "")
                forecast = event.get("Forecast", "")
                previous = event.get("Previous", "")
                outcome = event.get("Outcome", "")

                relevant_symbols = CURRENCY_MAP.get(currency, [])
                if symbol and symbol.upper() not in relevant_symbols:
                    continue

                title_parts = [f"[{currency}] {name}"]
                if impact:
                    title_parts.append(f"({impact} impact)")
                if actual:
                    title_parts.append(f"Actual: {actual}")
                if forecast:
                    title_parts.append(f"Forecast: {forecast}")
                if outcome:
                    title_parts.append(f"- {outcome}")

                items.append(
                    NewsItem(
                        title=" ".join(title_parts),
                        source=self.source_name,
                        symbol=symbol or currency,
                        published_at=date or datetime.now(timezone.utc).isoformat(),
                        impact=impact if impact else None,
                    )
                )

            logger.info("forexfactory news fetched via jblanked", count=len(items))
            return items

        except httpx.HTTPStatusError as e:
            if e.response.status_code == 429:
                logger.warning("jblanked rate limit reached (1 req/day free tier)")
            else:
                logger.error("jblanked API error", status=e.response.status_code)
            return []
        except Exception as e:
            logger.error("forexfactory fetch failed", error=str(e))
            return []
