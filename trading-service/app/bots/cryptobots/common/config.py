"""Central paths and exchange defaults for all cryptobots."""

from pathlib import Path

CRYPTOBOTS_ROOT = Path(__file__).resolve().parent.parent
CREDS_DIR = CRYPTOBOTS_ROOT / "creds"
LOGS_DIR = CRYPTOBOTS_ROOT / "logs"

# Shared backtest PDF output (all bots write here)
SHARED_REPORTS_DIR = CRYPTOBOTS_ROOT / "reports"
MEDIUM_RISK_REPORT_PDF = SHARED_REPORTS_DIR / "medium_risk_report.pdf"
LOW_RISK_REPORT_PDF = SHARED_REPORTS_DIR / "low_risk_report.pdf"
HIGH_RISK_REPORT_PDF = SHARED_REPORTS_DIR / "high_risk_report.pdf"

BINANCE_ID = "binance"
BYBIT_ID = "bybit"

BINANCE_TESTNET_CREDS_FILE = CREDS_DIR / "binancetestnet_creds.txt"
BYBIT_CREDS_FILE = CREDS_DIR / "bybit_creds.txt"

# Default ccxt spot universe
SYMBOLS = ["BTC/USDT", "ETH/USDT", "SOL/USDT", "BNB/USDT"]

CANDLE_LIMIT = 500
DRY_RUN_DEFAULT = True

# Map yfinance-style tickers to ccxt symbols (Binance spot)
YAHOO_PAIR_TO_CCXT = {
    "BTC-USD": "BTC/USDT",
    "ETH-USD": "ETH/USDT",
    "BNB-USD": "BNB/USDT",
    "SOL-USD": "SOL/USDT",
}

# High-risk backtest labels -> ccxt
PAIR_LABEL_TO_CCXT = {
    "BTC": "BTC/USDT",
    "ETH": "ETH/USDT",
    "BNB": "BNB/USDT",
    "SOL": "SOL/USDT",
}
