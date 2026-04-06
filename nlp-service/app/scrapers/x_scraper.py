import httpx
from datetime import datetime, timezone
from app.scrapers.base_scraper import BaseScraper
from app.schemas.news import NewsItem
from app.utils.logger import get_logger

logger = get_logger()

NITTER_INSTANCES = [
    "https://nitter.net",
    "https://nitter.privacydev.net",
]

FINANCE_ACCOUNTS = [
    "ForexLive",
    "ReutersBiz",
    "markets",
    "Faborotno",
]


class XScraper(BaseScraper):
    @property
    def source_name(self) -> str:
        return "x"

    async def fetch_news(self, symbol: str | None = None) -> list[NewsItem]:
        items = []
        search_term = f"${symbol}" if symbol else "forex trading"

        for instance in NITTER_INSTANCES:
            try:
                items = await self._scrape_nitter(instance, search_term, symbol)
                if items:
                    break
            except Exception as e:
                logger.warning("nitter instance failed", instance=instance, error=str(e))
                continue

        if not items:
            items = await self._fetch_from_accounts(symbol)

        logger.info("x scraper result", count=len(items))
        return items

    async def _scrape_nitter(self, base_url: str, query: str, symbol: str | None) -> list[NewsItem]:
        async with httpx.AsyncClient(timeout=10.0) as client:
            headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
            resp = await client.get(f"{base_url}/search", params={"q": query}, headers=headers)
            if resp.status_code != 200:
                return []

        from bs4 import BeautifulSoup
        soup = BeautifulSoup(resp.text, "lxml")
        tweets = soup.select(".timeline-item .tweet-content")

        items = []
        for tweet in tweets[:15]:
            text = tweet.get_text(strip=True)
            if len(text) < 10:
                continue
            items.append(
                NewsItem(
                    title=text[:280],
                    source=self.source_name,
                    symbol=symbol,
                    published_at=datetime.now(timezone.utc).isoformat(),
                )
            )
        return items

    async def _fetch_from_accounts(self, symbol: str | None) -> list[NewsItem]:
        items = []
        for account in FINANCE_ACCOUNTS[:2]:
            for instance in NITTER_INSTANCES:
                try:
                    async with httpx.AsyncClient(timeout=10.0) as client:
                        headers = {"User-Agent": "Mozilla/5.0"}
                        resp = await client.get(f"{instance}/{account}", headers=headers)
                        if resp.status_code != 200:
                            continue

                    from bs4 import BeautifulSoup
                    soup = BeautifulSoup(resp.text, "lxml")
                    tweets = soup.select(".timeline-item .tweet-content")
                    for tweet in tweets[:5]:
                        text = tweet.get_text(strip=True)
                        if symbol and symbol.lower() not in text.lower():
                            continue
                        items.append(
                            NewsItem(
                                title=text[:280],
                                source=self.source_name,
                                symbol=symbol,
                                published_at=datetime.now(timezone.utc).isoformat(),
                            )
                        )
                    if items:
                        break
                except Exception:
                    continue
        return items
