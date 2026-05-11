"""Medium-risk (OB) bot — config layered on common."""

from pathlib import Path

from common.config import (
    BINANCE_TESTNET_CREDS_FILE,
    BYBIT_CREDS_FILE,
    DRY_RUN_DEFAULT,
    MEDIUM_RISK_REPORT_PDF,
)

PACKAGE_ROOT = Path(__file__).resolve().parent.parent
STRATEGY_DIR = PACKAGE_ROOT / "strategy"
LOG_DIR = PACKAGE_ROOT / "logs"
BACKTEST_STATS_PDF = MEDIUM_RISK_REPORT_PDF

# Binance market data settings
SYMBOLS = ["BTC/USDT", "ETH/USDT", "SOL/USDT", "BNB/USDT"]
TIMEFRAME = "4h"
CANDLE_LIMIT = 500
BACKTEST_CANDLE_LIMIT = 1500

# Backtest and live defaults
INITIAL_BALANCE = 100_000.0
FIXED_RISK = 1_000.0
MAX_OB_PCT = 4.0
PIVOT_LEN = 5
USE_BREAKEVEN = True
USE_TRAILING = True
TRAIL_PERC = 2.0

# File paths
PINESCRIPT_FILE = STRATEGY_DIR / "strategy_pinescript.txt"
EXCEL_LOG_PATH = LOG_DIR / "trade_log.xlsx"
