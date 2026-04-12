"""Test the ForexFactory scraper."""
import asyncio
from app.scrapers.forexfactory import ForexFactoryScraper

async def main():
    print("Starting ForexFactory scraper test...")
    print("This will scrape current month news if CSV doesn't exist.\n")
    
    scraper = ForexFactoryScraper()
    
    # Test with EURUSD (filters for EUR and USD news)
    try:
        news = await scraper.fetch_news("EURUSD")
        
        print(f"\n✅ Fetched {len(news)} news items for EURUSD")
        if news:
            print("\nFirst 5 items:")
            for i, item in enumerate(news[:5], 1):
                print(f"  {i}. {item.title} | {item.source} | {item.published_at}")
    except Exception as e:
        print(f"\n❌ Error during scraping: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main())
