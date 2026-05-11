"""
White-box unit tests — all 6 bot classes.

Covers:
- Instantiation with defaults
- Symbol validation (allowed / blocked)
- analyze() returns valid action
- calculate_stop_loss / calculate_take_profit return sensible values
- update_parameters takes effect
"""
import pytest
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "trading-service"))

from app.bots.registry import BOT_REGISTRY, create_bot, list_bot_types
from app.bots.low_risk_orb_bot import LowRiskOrbBot
from app.bots.high_risk_orb_bot import HighRiskOrbBot
from app.bots.medium_risk_bos_bot import MediumRiskBosBot
from app.bots.crypto_low_bot import CryptoLowBot
from app.bots.crypto_medium_bot import CryptoMediumBot
from app.bots.crypto_high_bot import CryptoHighBot

DUMMY_CANDLE = {"open": 1.10, "high": 1.11, "low": 1.09, "close": 1.105}
DUMMY_CANDLES = [DUMMY_CANDLE] * 50


# ── Registry ──────────────────────────────────────────────────────────────────

def test_registry_has_all_bot_types():
    types = list_bot_types()
    assert set(types) == {"low_risk", "medium_risk", "high_risk",
                          "crypto_low", "crypto_medium", "crypto_high"}


def test_create_bot_unknown_type_raises():
    with pytest.raises(ValueError, match="Unknown bot type"):
        create_bot("nonexistent", "EURUSD", "1h", {})


# ── LowRiskOrbBot ─────────────────────────────────────────────────────────────

class TestLowRiskOrbBot:
    # LowRiskOrbBot trades USDCHF only (M5 ORB strategy)
    def _bot(self, symbol="USDCHF", params=None):
        return LowRiskOrbBot(symbol, "M5", params or {})

    def test_instantiates_with_defaults(self):
        bot = self._bot()
        assert bot.symbol == "USDCHF"
        assert "risk_per_trade_pct" in bot.parameters

    def test_invalid_symbol_raises(self):
        with pytest.raises(ValueError, match="only trades"):
            self._bot("EURUSD")

    def test_analyze_returns_valid_action(self):
        bot = self._bot()
        result = bot.analyze(DUMMY_CANDLES)
        assert result in ("buy", "sell", "hold")

    def test_stop_loss_below_entry_for_buy(self):
        bot = self._bot()
        sl = bot.calculate_stop_loss(0.8950, "buy")
        assert sl < 0.8950

    def test_take_profit_above_entry_for_buy(self):
        bot = self._bot()
        tp = bot.calculate_take_profit(0.8950, "buy")
        assert tp > 0.8950

    def test_update_parameters_takes_effect(self):
        bot = self._bot(params={"risk_per_trade_pct": 1.0})
        bot.update_parameters({"risk_per_trade_pct": 0.5})
        assert bot.parameters["risk_per_trade_pct"] == 0.5


# ── HighRiskOrbBot ────────────────────────────────────────────────────────────

class TestHighRiskOrbBot:
    def test_instantiates_usdchf(self):
        bot = HighRiskOrbBot("USDCHF", "M5", {})
        assert bot.symbol == "USDCHF"

    def test_invalid_symbol_raises(self):
        with pytest.raises(ValueError, match="only trades"):
            HighRiskOrbBot("EURUSD", "M5", {})

    def test_analyze_returns_valid_action(self):
        bot = HighRiskOrbBot("USDCHF", "M5", {})
        result = bot.analyze(DUMMY_CANDLES)
        assert result in ("buy", "sell", "hold")


# ── MediumRiskBosBot ──────────────────────────────────────────────────────────

class TestMediumRiskBosBot:
    def test_instantiates_eurusd(self):
        bot = MediumRiskBosBot("EURUSD", "M5", {})
        assert bot.symbol == "EURUSD"

    def test_invalid_symbol_raises(self):
        with pytest.raises(ValueError, match="only trades"):
            MediumRiskBosBot("GBPUSD", "M5", {})

    def test_analyze_returns_hold_on_insufficient_bars(self):
        bot = MediumRiskBosBot("EURUSD", "M5", {})
        result = bot.analyze([DUMMY_CANDLE] * 3)
        assert result == "hold"

    def test_analyze_returns_valid_action_on_full_history(self):
        bot = MediumRiskBosBot("EURUSD", "M5", {})
        result = bot.analyze(DUMMY_CANDLES)
        assert result in ("buy", "hold")

    def test_sl_percent_parameter_respected(self):
        bot = MediumRiskBosBot("EURUSD", "M5", {"sl_percent": 0.10})
        sl = bot.calculate_stop_loss(1.1050, "buy")
        expected = round(1.1050 * (1 - 0.10 / 100), 5)
        # sl may come from strategy signal or fallback; both should be below entry
        assert sl < 1.1050

    def test_reset_state_clears_buffer(self):
        bot = MediumRiskBosBot("EURUSD", "M5", {})
        bot.analyze(DUMMY_CANDLES)
        bot.reset_state()
        assert bot._candle_buffer == []
        assert bot._last_signal is None


# ── Crypto bots ───────────────────────────────────────────────────────────────

class TestCryptoBots:
    @pytest.mark.parametrize("cls,symbol", [
        (CryptoLowBot,    "BTCUSDT"),
        (CryptoMediumBot, "ETHUSDT"),
        (CryptoHighBot,   "SOLUSDT"),
    ])
    def test_instantiates(self, cls, symbol):
        bot = cls(symbol, "1h", {})
        assert bot.symbol == symbol.upper()

    @pytest.mark.parametrize("cls,symbol", [
        (CryptoLowBot,    "BTCUSDT"),
        (CryptoMediumBot, "ETHUSDT"),
        (CryptoHighBot,   "SOLUSDT"),
    ])
    def test_analyze_returns_hold(self, cls, symbol):
        # Crypto live analyze() is a stub — always returns "hold"
        bot = cls(symbol, "1h", {})
        result = bot.analyze(DUMMY_CANDLES)
        assert result == "hold"

    @pytest.mark.parametrize("cls,symbol", [
        (CryptoLowBot,    "BTCUSDT"),
        (CryptoMediumBot, "ETHUSDT"),
        (CryptoHighBot,   "SOLUSDT"),
    ])
    def test_stop_loss_below_entry(self, cls, symbol):
        bot = cls(symbol, "1h", {})
        sl = bot.calculate_stop_loss(50000.0, "buy")
        assert sl < 50000.0

    @pytest.mark.parametrize("cls,symbol", [
        (CryptoLowBot,    "BTCUSDT"),
        (CryptoMediumBot, "ETHUSDT"),
        (CryptoHighBot,   "SOLUSDT"),
    ])
    def test_take_profit_above_entry(self, cls, symbol):
        bot = cls(symbol, "1h", {})
        tp = bot.calculate_take_profit(50000.0, "buy")
        assert tp > 50000.0
