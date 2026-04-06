import httpx
from bs4 import BeautifulSoup
from datetime import datetime, timezone
from app.scrapers.base_scraper import BaseScraper
from app.schemas.news import NewsItem
from app.utils.logger import get_logger

logger = get_logger()

FOREX_FACTORY_URL = "https://www.forexfactory.com/calendar"

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
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                headers = {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
                }
                resp = await client.get(FOREX_FACTORY_URL, headers=headers)
                resp.raise_for_status()

            soup = BeautifulSoup(resp.text, "lxml")
            rows = soup.select("tr.calendar__row")

            items = []
            for row in rows[:30]:
                currency_el = row.select_one("td.calendar__currency")
                title_el = row.select_one("td.calendar__event span")
                impact_el = row.select_one("td.calendar__impact span")

                if not currency_el or not title_el:
                    continue

                currency = currency_el.get_text(strip=True).upper()
                title = title_el.get_text(strip=True)
                impact = ""
                if impact_el:
                    impact_classes = impact_el.get("class", [])
                    if any("high" in c for c in impact_classes):
                        impact = "high"
                    elif any("medium" in c for c in impact_classes):
                        impact = "medium"
                    else:
                        impact = "low"

                relevant_symbols = CURRENCY_MAP.get(currency, [])
                if symbol and symbol.upper() not in relevant_symbols:
                    continue

                items.append(
                    NewsItem(
                        title=f"[{currency}] {title}",
                        source=self.source_name,
                        symbol=symbol or currency,
                        published_at=datetime.now(timezone.utc).isoformat(),
                        impact=impact,
                    )
                )

            logger.info("forexfactory scraped", count=len(items))
            return items

        except Exception as e:
            logger.error("forexfactory scrape failed", error=str(e))
            return []
