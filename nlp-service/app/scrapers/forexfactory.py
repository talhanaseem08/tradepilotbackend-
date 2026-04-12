"""
Forex Factory Calendar Scraper with Monthly CSV Caching.
Integrated from: E:\forex factory scrapper\forex_factory_calendar_news_scraper

Logic:
1. Check if current month's CSV exists
2. If exists, read from CSV (no scraping needed)
3. If not exists, scrape ForexFactory and save to CSV
"""
import os
import time
import re
import json
import pytz
import pandas as pd
from pathlib import Path
from datetime import datetime
from urllib.request import urlopen

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

from app.scrapers.base_scraper import BaseScraper
from app.schemas.news import NewsItem
from app.utils.logger import get_logger

logger = get_logger()

# ============================================================================
# CONFIG (from your config.py)
# ============================================================================

ALLOWED_ELEMENT_TYPES = {
    "calendar__cell": "date",
    "calendar__cell calendar__date": "date",
    "calendar__cell calendar__time": "time",
    "calendar__cell calendar__currency": "currency",
    "calendar__cell calendar__impact": "impact",
    "calendar__cell calendar__detail": "detail",
    "calendar__cell calendar__event event": "event",
    "calendar__cell calendar__actual": "actual",
    "calendar__cell calendar__forecast": "forecast",
    "calendar__cell calendar__previous": "previous",
}

EXCLUDED_ELEMENT_TYPES = [
    "calendar__cell calendar__graph",
]

ICON_COLOR_MAP = {
    "icon icon--ff-impact-yel": "yellow",
    "icon icon--ff-impact-ora": "orange",
    "icon icon--ff-impact-red": "red",
    "icon icon--ff-impact-gra": "gray"
}

ALLOWED_CURRENCY_CODES = ['CAD', 'EUR', 'GBP', 'USD']
ALLOWED_IMPACT_COLORS = ['red', 'orange', 'gray']
TARGET_TIMEZONE = "Asia/Karachi"
SCRAPER_TIMEZONE = None

# News data directory
NEWS_DATA_DIR = Path(__file__).parent.parent.parent / "data" / "news"

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

# ============================================================================
# UTILS (from your utils.py)
# ============================================================================

def read_json(path):
    with open(path, 'r') as f:
        data = json.load(f)
    return data


def extract_date_parts(text, year):
    pattern = r'\b(?P<day>Mon|Tue|Wed|Thu|Fri|Sat|Sun)\b\s+' \
              r'(?P<month>Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b\s+' \
              r'(?P<date>\d{1,2})\b'

    match = re.search(pattern, text)
    if match:
        month_abbr = match.group("month")
        day = int(match.group("date"))
        month_number = datetime.strptime(month_abbr, "%b").month
        formatted_date = f"{day:02d}/{month_number:02d}/{year}"
        return {
            "day": match.group("day"),
            "date": formatted_date
        }
    else:
        return None


def reformat_data(data: list, year: str) -> list:
    current_date = ''
    current_time = ''
    current_day = ''
    structured_rows = []

    for row in data:
        new_row = row.copy()

        if "date" in new_row and new_row['date'] != "empty":
            date_parts = extract_date_parts(new_row["date"], year)
            if date_parts:
                current_date = date_parts["date"]
                current_day = date_parts["day"]

        if "time" in new_row:
            if new_row["time"] != "empty":
                current_time = new_row["time"].strip()
            else:
                new_row["time"] = current_time

        if len(row) == 1:
            continue

        new_row["day"] = current_day
        new_row["date"] = current_date

        scraper_timezone = find_location_timezone()
        if scraper_timezone and TARGET_TIMEZONE:
            new_row["time"] = convert_time_zone(current_date, current_time, scraper_timezone, TARGET_TIMEZONE)
        else:
            new_row["time"] = current_time

        new_row["currency"] = row.get("currency", "")
        new_row["impact"] = row.get("impact", "")
        new_row["event"] = row.get("event", "")
        new_row["detail"] = row.get("detail", "")
        new_row["actual"] = row.get("actual", "")
        new_row["forecast"] = row.get("forecast", "")
        new_row["previous"] = row.get("previous", "")

        for key, value in new_row.items():
            if value == "empty":
                new_row[key] = ""

        row = filter_row(new_row)
        if row:
            structured_rows.append(new_row)

    return structured_rows


def filter_row(row):
    if row['currency'] not in ALLOWED_CURRENCY_CODES:
        return False
    if row['impact'].lower() not in ALLOWED_IMPACT_COLORS:
        return False
    return row


def save_csv(data, month, year):
    structured_rows = reformat_data(data, year)
    if not structured_rows:
        logger.warning("No data to save after filtering")
        return False
    header = list(structured_rows[0].keys())
    df = pd.DataFrame(structured_rows, columns=header)
    NEWS_DATA_DIR.mkdir(parents=True, exist_ok=True)
    csv_path = NEWS_DATA_DIR / f"{month}_{year}_news.csv"
    df.to_csv(csv_path, index=False)
    logger.info(f"Saved {len(structured_rows)} news items to {csv_path}")
    return True


def convert_time_zone(date_str, time_str, from_zone_str, to_zone_str):
    if not time_str or not date_str:
        return time_str

    if time_str.lower() in ["all day", "tentative"]:
        return time_str

    try:
        from_zone = pytz.timezone(from_zone_str)
        to_zone = pytz.timezone(to_zone_str)
        naive_dt = datetime.strptime(f"{date_str} {time_str}", "%d/%m/%Y %I:%M%p")
        localized_dt = from_zone.localize(naive_dt)
        converted_dt = localized_dt.astimezone(to_zone)
        return converted_dt.strftime("%H:%M")
    except Exception as e:
        logger.warning(f"Failed to convert '{time_str}' on {date_str}: {e}")
        return time_str


def find_location_timezone():
    try:
        url = 'http://ipinfo.io/json'
        response = urlopen(url)
        data = json.load(response)
        return data['timezone']
    except Exception:
        return 'UTC'


# ============================================================================
# SCRAPER (from your scraper.py)
# ============================================================================

def init_driver(headless=True) -> webdriver.Chrome:
    options = webdriver.ChromeOptions()
    if headless:
        options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-gpu")
    options.add_argument("window-size=1920x1080")
    options.add_argument(
        "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    )

    logger.info("Attempting to initialize WebDriver with ChromeDriverManager...")
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)
    logger.info("WebDriver initialized successfully using ChromeDriverManager.")
    return driver


def scroll_to_end(driver):
    previous_position = None
    while True:
        current_position = driver.execute_script("return window.pageYOffset;")
        driver.execute_script("window.scrollTo(0, window.pageYOffset + 500);")
        time.sleep(2)
        if current_position == previous_position:
            break
        previous_position = current_position


def parse_table(driver, month, year):
    global SCRAPER_TIMEZONE
    data = []
    table = driver.find_element(By.CLASS_NAME, "calendar__table")

    for row in table.find_elements(By.TAG_NAME, "tr"):
        row_data = {}
        event_id = row.get_attribute("data-event-id")

        for element in row.find_elements(By.TAG_NAME, "td"):
            class_name = element.get_attribute('class')

            if class_name in ALLOWED_ELEMENT_TYPES:
                class_name_key = ALLOWED_ELEMENT_TYPES.get(f"{class_name}", "cell")

                if "calendar__impact" in class_name:
                    impact_elements = element.find_elements(By.TAG_NAME, "span")
                    color = None
                    for impact in impact_elements:
                        impact_class = impact.get_attribute("class")
                        color = ICON_COLOR_MAP.get(impact_class)
                    row_data[f"{class_name_key}"] = color if color else "impact"

                elif "calendar__detail" in class_name and event_id:
                    detail_url = f"https://www.forexfactory.com/calendar?month={month}#detail={event_id}"
                    row_data[f"{class_name_key}"] = detail_url

                elif element.text:
                    row_data[f"{class_name_key}"] = element.text
                else:
                    row_data[f"{class_name_key}"] = "empty"

        if row_data:
            data.append(row_data)

    save_csv(data, month, year)
    return data, month


def get_target_month(arg_month=None):
    now = datetime.now()
    month = arg_month if arg_month else now.strftime("%B")
    year = now.strftime("%Y")
    return month, year


def scrape_month(month_param="this"):
    """Scrape ForexFactory for a specific month."""
    global SCRAPER_TIMEZONE
    
    param = month_param.lower()
    url = f"https://www.forexfactory.com/calendar?month={param}"
    logger.info(f"Navigating to {url}")

    driver = init_driver()
    try:
        driver.get(url)
        detected_tz = driver.execute_script("return Intl.DateTimeFormat().resolvedOptions().timeZone")
        logger.info(f"Browser timezone: {detected_tz}")
        SCRAPER_TIMEZONE = detected_tz
        scroll_to_end(driver)

        if param == "this":
            now = datetime.now()
            month = now.strftime("%B")
            year = now.year
        elif param == "next":
            now = datetime.now()
            next_month = (now.month % 12) + 1
            year = now.year if now.month < 12 else now.year + 1
            month = datetime(year, next_month, 1).strftime("%B")
        else:
            month = param.capitalize()
            year = datetime.now().year

        logger.info(f"Scraping data for {month} {year}")
        parse_table(driver, month, str(year))
        return month, year
        
    except Exception as e:
        logger.error(f"Failed to scrape {param}: {e}")
        raise
    finally:
        driver.quit()
        time.sleep(3)


# ============================================================================
# CSV CACHE HELPERS
# ============================================================================

def csv_exists_for_month(month: str, year: int) -> bool:
    """Check if CSV exists for a specific month."""
    csv_path = NEWS_DATA_DIR / f"{month}_{year}_news.csv"
    return csv_path.exists()


def read_csv(month: str, year: int) -> pd.DataFrame:
    """Read news data from CSV."""
    csv_path = NEWS_DATA_DIR / f"{month}_{year}_news.csv"
    if csv_path.exists():
        return pd.read_csv(csv_path)
    return pd.DataFrame()


# ============================================================================
# BASESCRAPER WRAPPER (integrates with TradePilot)
# ============================================================================

class ForexFactoryScraper(BaseScraper):
    """Forex Factory scraper with monthly CSV caching."""
    
    @property
    def source_name(self) -> str:
        return "forexfactory"
    
    async def fetch_news(self, symbol: str | None = None) -> list[NewsItem]:
        """
        Fetch news for a symbol.
        
        - If current month CSV exists → read from CSV
        - If not → scrape and save to CSV first
        """
        try:
            now = datetime.now()
            month = now.strftime("%B")
            year = now.year
            
            # Check if CSV exists for current month
            if not csv_exists_for_month(month, year):
                logger.info(f"No CSV for {month} {year}, scraping ForexFactory...")
                scrape_month("this")
            else:
                logger.info(f"Using cached CSV for {month} {year}")
            
            # Read from CSV
            df = read_csv(month, year)
            
            if df.empty:
                logger.warning("No news data available")
                return []
            
            items = []
            for _, row in df.iterrows():
                currency = str(row.get('currency', '')).upper()
                event = str(row.get('event', ''))
                impact = str(row.get('impact', '')).lower()
                date = str(row.get('date', ''))
                time_val = str(row.get('time', ''))
                actual = str(row.get('actual', ''))
                forecast = str(row.get('forecast', ''))
                
                # Filter by symbol if provided
                if symbol:
                    relevant_symbols = CURRENCY_MAP.get(currency, [])
                    if symbol.upper() not in relevant_symbols:
                        continue
                
                # Build title
                title_parts = [f"[{currency}] {event}"]
                if impact:
                    title_parts.append(f"({impact} impact)")
                if actual and actual != 'nan':
                    title_parts.append(f"Actual: {actual}")
                if forecast and forecast != 'nan':
                    title_parts.append(f"Forecast: {forecast}")
                
                # Parse date for published_at
                published_at = None
                if date and date != 'nan':
                    try:
                        dt = datetime.strptime(f"{date} {time_val}", "%d/%m/%Y %H:%M")
                        published_at = dt.isoformat()
                    except Exception:
                        published_at = date
                
                items.append(NewsItem(
                    title=" ".join(title_parts),
                    source=self.source_name,
                    symbol=symbol or currency,
                    published_at=published_at,
                    impact=impact if impact else None,
                ))
            
            logger.info(f"Loaded {len(items)} news items from CSV", symbol=symbol)
            return items
            
        except Exception as e:
            logger.error(f"ForexFactory fetch failed: {e}")
            return []
    
    def get_high_impact_news_today(self, currencies: list[str] = None) -> list[dict]:
        """
        Get high impact (red) news for today.
        Useful for bot to check if it should avoid trading during news.
        """
        now = datetime.now()
        month = now.strftime("%B")
        year = now.year
        
        if not csv_exists_for_month(month, year):
            logger.info("No CSV exists, scraping first...")
            scrape_month("this")
        
        df = read_csv(month, year)
        
        if df.empty:
            return []
        
        today = datetime.now().strftime("%d/%m/%Y")
        today_news = df[df['date'] == today]
        high_impact = today_news[today_news['impact'].str.lower() == 'red']
        
        if currencies:
            high_impact = high_impact[high_impact['currency'].isin(currencies)]
        
        return high_impact.to_dict('records')


