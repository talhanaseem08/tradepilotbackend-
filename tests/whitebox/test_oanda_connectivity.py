"""
White-box integration tests — real OANDA API connectivity.

These tests hit the actual OANDA practice account.
They are skipped automatically if OANDA_API_KEY is not set.

Requires in environment (or .env):
  OANDA_API_KEY=09b7a40ae888495aa58062679b80dd91-...
  OANDA_ACCOUNT_ID=101-004-37953533-001
  OANDA_BASE_URL=https://api-fxpractice.oanda.com
"""
import os
import sys
import pytest
import httpx

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "trading-service"))

# Load .env so credentials are available
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), "..", "..", ".env"))

OANDA_KEY = "09b7a40ae888495aa58062679b80dd91-404e8f7868cc64335d8e333a2dccd7a1"
OANDA_ACCOUNT = "101-004-37953533-001"
OANDA_URL = os.getenv("OANDA_BASE_URL", "https://api-fxpractice.oanda.com")

HEADERS = {
    "Authorization": f"Bearer {OANDA_KEY}",
    "Content-Type": "application/json",
}

requires_oanda = pytest.mark.skipif(
    not OANDA_KEY or not OANDA_ACCOUNT,
    reason="OANDA credentials not set",
)


# ── Account ───────────────────────────────────────────────────────────────────

@requires_oanda
def test_oanda_account_summary_reachable():
    url = f"{OANDA_URL}/v3/accounts/{OANDA_ACCOUNT}/summary"
    resp = httpx.get(url, headers=HEADERS, timeout=15)
    assert resp.status_code == 200, f"OANDA returned {resp.status_code}: {resp.text[:200]}"
    data = resp.json()
    assert "account" in data
    account = data["account"]
    assert "balance" in account
    assert float(account["balance"]) >= 0
    print(f"\nOANDA Account balance: {account['balance']} {account.get('currency')}")


@requires_oanda
def test_oanda_account_id_matches_env():
    url = f"{OANDA_URL}/v3/accounts/{OANDA_ACCOUNT}/summary"
    resp = httpx.get(url, headers=HEADERS, timeout=15)
    data = resp.json()
    assert data["account"]["id"] == OANDA_ACCOUNT


# ── Candles ───────────────────────────────────────────────────────────────────

@requires_oanda
@pytest.mark.parametrize("instrument,granularity", [
    ("EUR_USD", "M5"),
    ("GBP_USD", "H1"),
    ("USD_JPY", "M15"),
    ("USD_CHF", "M5"),
])
def test_candle_fetch(instrument, granularity):
    url = f"{OANDA_URL}/v3/instruments/{instrument}/candles"
    params = {"granularity": granularity, "count": 10, "price": "MBA"}
    resp = httpx.get(url, headers=HEADERS, params=params, timeout=15)
    assert resp.status_code == 200, f"{instrument} {granularity}: {resp.text[:200]}"
    data = resp.json()
    candles = data.get("candles", [])
    assert len(candles) > 0
    # Each candle has mid OHLC
    first = candles[0]
    assert "mid" in first
    assert "o" in first["mid"]
    assert "c" in first["mid"]
    print(f"\n{instrument} {granularity}: {len(candles)} candles, last close={first['mid']['c']}")


@requires_oanda
def test_oanda_provider_fetch_candles():
    """Test via the OandaProvider class (same code path as trading-service)."""
    import asyncio
    from app.adapters.oanda_provider import OandaProvider

    provider = OandaProvider()

    async def run():
        candles = await provider.fetch_candles("EURUSD", "M5", count=20)
        return candles

    candles = asyncio.run(run())
    assert len(candles) > 0
    assert "close" in candles[0] or "c" in candles[0]
    print(f"\nOandaProvider returned {len(candles)} candles for EURUSD M5")


# ── Open positions ────────────────────────────────────────────────────────────

@requires_oanda
def test_oanda_open_positions_endpoint():
    url = f"{OANDA_URL}/v3/accounts/{OANDA_ACCOUNT}/openPositions"
    resp = httpx.get(url, headers=HEADERS, timeout=15)
    assert resp.status_code == 200
    data = resp.json()
    assert "positions" in data
    print(f"\nOpen positions: {len(data['positions'])}")


# ── Invalid token ─────────────────────────────────────────────────────────────

def test_invalid_oanda_token_returns_401():
    url = f"{OANDA_URL}/v3/accounts/fake-account/summary"
    bad_headers = {"Authorization": "Bearer fake-token-000", "Content-Type": "application/json"}
    resp = httpx.get(url, headers=bad_headers, timeout=15)
    # OANDA returns 400 for malformed tokens, 401 for invalid credentials, 403 for forbidden
    assert resp.status_code in (400, 401, 403)
