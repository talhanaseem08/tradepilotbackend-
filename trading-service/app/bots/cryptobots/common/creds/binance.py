"""Binance API credentials (testnet or mainnet file paths)."""
from __future__ import annotations

from pathlib import Path
from typing import Dict

from common.config import BINANCE_TESTNET_CREDS_FILE


def load_binance_creds(path: str | Path = BINANCE_TESTNET_CREDS_FILE) -> Dict[str, str]:
    creds: Dict[str, str] = {}
    path = Path(path)
    if not path.exists():
        raise FileNotFoundError(f"Credentials file not found: {path}")

    for line in path.read_text().splitlines():
        if ":" not in line:
            continue
        key, value = line.split(":", 1)
        creds[key.strip()] = value.strip()

    missing = [k for k in ("API_KEY", "API_SECRET_KEY") if k not in creds]
    if missing:
        raise ValueError(f"Missing keys in credentials file: {missing}")

    return creds
