"""
Shared pytest fixtures for TradePilot tests.

Environment:
  - Set REDIS_HOST=localhost REDIS_PORT=6379 MONGO_URI=... when running outside Docker.
  - Tests that hit real OANDA require OANDA_API_KEY and OANDA_ACCOUNT_ID in env/.env.
  - Tests that hit DeepSeek require OLLAMA_REMOTE_URL=http://129.212.178.8:11434.
"""
import os
import sys

# Allow importing trading-service and agent-service packages directly
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "trading-service"))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "agent-service"))

import pytest

# Override service URLs for local runs (override before any app import)
os.environ.setdefault("REDIS_HOST", "localhost")
os.environ.setdefault("REDIS_PORT", "6379")
os.environ.setdefault("MONGO_URI", "mongodb://localhost:27017/tradepilot")
os.environ.setdefault("OANDA_BASE_URL", "https://api-fxpractice.oanda.com")
os.environ.setdefault("OLLAMA_REMOTE_URL", "http://129.212.178.8:11434")
os.environ.setdefault("TRADING_SERVICE_URL", "http://localhost:8002")
os.environ.setdefault("NLP_SERVICE_URL", "http://localhost:8001")
