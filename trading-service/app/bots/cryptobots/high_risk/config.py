"""High-risk bot constants."""

from pathlib import Path

from common.config import DRY_RUN_DEFAULT, HIGH_RISK_REPORT_PDF

PACKAGE_ROOT = Path(__file__).resolve().parent.parent
LOG_DIR = PACKAGE_ROOT / "logs"
EXCEL_LOG_PATH = LOG_DIR / "high_risk_signals.xlsx"
CANDLE_LIMIT = 500
