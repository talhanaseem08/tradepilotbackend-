import feedparser
from datetime import datetime, timezone
from app.scrapers.base_scraper import BaseScraper
from app.schemas.news import NewsItem
from app.utils.logger import get_logger

logger = get_logger()

COINTELEGRAPH_RSS = "https://cointelegraph.com/rss"

CRYPTO_KEYWORDS = {
    "BTCUSDT": ["bitcoin", "btc"],
    "ETHUSDT": ["ethereum", "eth"],
    "BNBUSDT": ["binance coin", "bnb"],
    "SOLUSDT": ["solana", "sol"],
    "XRPUSDT": ["ripple", "xrp"],
}


class CoinTelegraphScraper(BaseScraper):
    @property
    def source_name(self) -> str:
        return "cointelegraph"

    async def fetch_news(self, symbol: str | None = None) -> list[NewsItem]:
        try:
            feed = feedparser.parse(COINTELEGRAPH_RSS)
            items = []

            for entry in feed.entries[:30]:
                title = entry.get("title", "")
                link = entry.get("link", "")
                published = entry.get("published", "")

                if symbol:
                    keywords = CRYPTO_KEYWORDS.get(symbol.upper(), [])
                    if keywords and not any(kw in title.lower() for kw in keywords):
                        continue

                items.append(
                    NewsItem(
                        title=title,
                        source=self.source_name,
                        symbol=symbol,
                        published_at=published or datetime.now(timezone.utc).isoformat(),
                        url=link,
                    )
                )

            logger.info("cointelegraph scraped", count=len(items))
            return items

        except Exception as e:
            logger.error("cointelegraph scrape failed", error=str(e))
            return []
