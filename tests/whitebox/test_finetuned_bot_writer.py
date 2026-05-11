"""
White-box unit tests — finetuned_bot_writer.py

Covers:
- File is written to finetuned/ directory
- Generated Python is syntactically valid
- Generated class inherits from the correct base bot
- Tuned parameters are present in the file and take effect at runtime
- Unknown bot_type raises ValueError
- Multiple calls produce unique filenames
- Original bot files are NOT modified
"""
import ast
import importlib.util
import os
import sys
import time
from pathlib import Path

import pytest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "trading-service"))

from app.services.finetuned_bot_writer import write_finetuned_bot, FINETUNED_DIR, _BOT_TYPE_MAP

SAMPLE_PARAMS = {
    "account_balance": 12000.0,
    "risk_per_trade_pct": 0.75,
    "max_wait_hours": 2.0,
}
REASONING = "Wider wait window helps avoid false breakouts in slow sessions."


@pytest.fixture(autouse=True)
def cleanup_generated(tmp_path, monkeypatch):
    """Redirect FINETUNED_DIR to a tmp dir so tests stay isolated."""
    import app.services.finetuned_bot_writer as mod
    monkeypatch.setattr(mod, "FINETUNED_DIR", tmp_path)
    yield tmp_path


# ── File generation ───────────────────────────────────────────────────────────

def test_file_is_created(cleanup_generated):
    path = write_finetuned_bot("low_risk", "bot_001", SAMPLE_PARAMS, REASONING, 3)
    assert Path(path).exists()


def test_file_name_contains_bot_type_and_finetuned(cleanup_generated):
    path = write_finetuned_bot("low_risk", "bot_001", SAMPLE_PARAMS, REASONING, 3)
    name = Path(path).name
    assert "low_risk" in name
    assert "finetuned" in name


def test_file_name_contains_timestamp(cleanup_generated):
    path = write_finetuned_bot("medium_risk", "bot_002", SAMPLE_PARAMS, REASONING, 3)
    name = Path(path).stem  # e.g. medium_risk_finetuned_20260413093418
    parts = name.split("_")
    timestamp = parts[-1]
    assert len(timestamp) == 14  # YYYYMMDDHHmmss
    assert timestamp.isdigit()


def test_multiple_calls_produce_unique_files(cleanup_generated):
    p1 = write_finetuned_bot("low_risk", "bot_001", SAMPLE_PARAMS, REASONING, 3)
    time.sleep(1)  # ensure different timestamp
    p2 = write_finetuned_bot("low_risk", "bot_001", SAMPLE_PARAMS, REASONING, 3)
    assert p1 != p2


def test_unknown_bot_type_raises_value_error(cleanup_generated):
    with pytest.raises(ValueError, match="Unknown bot_type"):
        write_finetuned_bot("ghost_bot", "bot_xxx", {}, "test", 3)


# ── Source code validity ──────────────────────────────────────────────────────

@pytest.mark.parametrize("bot_type", list(_BOT_TYPE_MAP))
def test_generated_file_is_valid_python(cleanup_generated, bot_type):
    path = write_finetuned_bot(bot_type, "bot_test", SAMPLE_PARAMS, REASONING, 3)
    source = Path(path).read_text(encoding="utf-8")
    try:
        ast.parse(source)
    except SyntaxError as exc:
        pytest.fail(f"Generated file for {bot_type} has syntax error: {exc}")


@pytest.mark.parametrize("bot_type", list(_BOT_TYPE_MAP))
def test_generated_file_contains_finetuned_marker(cleanup_generated, bot_type):
    path = write_finetuned_bot(bot_type, "bot_test", SAMPLE_PARAMS, REASONING, 3)
    source = Path(path).read_text(encoding="utf-8")
    assert "FINETUNED: bool = True" in source
    assert "AUTO-GENERATED" in source
    assert "DO NOT EDIT" in source


@pytest.mark.parametrize("bot_type", list(_BOT_TYPE_MAP))
def test_generated_file_contains_bot_id(cleanup_generated, bot_type):
    path = write_finetuned_bot(bot_type, "my_unique_bot_id", SAMPLE_PARAMS, REASONING, 3)
    source = Path(path).read_text(encoding="utf-8")
    assert "my_unique_bot_id" in source


@pytest.mark.parametrize("bot_type", list(_BOT_TYPE_MAP))
def test_generated_file_contains_params(cleanup_generated, bot_type):
    path = write_finetuned_bot(bot_type, "bot_test", SAMPLE_PARAMS, REASONING, 3)
    source = Path(path).read_text(encoding="utf-8")
    assert "risk_per_trade_pct" in source
    assert "0.75" in source


def test_reasoning_truncated_to_500_chars(cleanup_generated):
    long_reasoning = "x" * 1000
    path = write_finetuned_bot("low_risk", "bot_001", SAMPLE_PARAMS, long_reasoning, 3)
    source = Path(path).read_text(encoding="utf-8")
    # Reasoning is embedded in a comment — check it's capped
    reasoning_line = next(l for l in source.splitlines() if "Reasoning" in l)
    assert len(reasoning_line) <= 600  # 500 chars + comment prefix


# ── Runtime behavior ──────────────────────────────────────────────────────────

def test_generated_low_risk_bot_instantiates(cleanup_generated):
    path = write_finetuned_bot("low_risk", "bot_001", SAMPLE_PARAMS, REASONING, 3)
    spec = importlib.util.spec_from_file_location("gen_bot", path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)

    cls = next(v for k, v in vars(mod).items() if "Finetuned" in k and isinstance(v, type))
    bot = cls("USDCHF", "M5", {})  # LowRiskOrbBot only trades USDCHF
    assert bot.parameters["risk_per_trade_pct"] == 0.75
    assert bot.parameters["account_balance"] == 12000.0


def test_generated_medium_risk_bot_instantiates(cleanup_generated):
    params = {"sl_percent": 0.06, "tp_r_multiple": 2.0, "risk_per_trade_pct": 0.8}
    path = write_finetuned_bot("medium_risk", "bot_002", params, REASONING, 3)
    spec = importlib.util.spec_from_file_location("gen_bot_med", path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)

    cls = next(v for k, v in vars(mod).items() if "Finetuned" in k and isinstance(v, type))
    bot = cls("EURUSD", "M5", {})
    assert bot.parameters["sl_percent"] == 0.06
    assert bot.parameters["tp_r_multiple"] == 2.0


def test_caller_params_override_tuned_defaults(cleanup_generated):
    """parameters dict passed at runtime should win over baked-in tuned defaults."""
    path = write_finetuned_bot("low_risk", "bot_001", SAMPLE_PARAMS, REASONING, 3)
    spec = importlib.util.spec_from_file_location("gen_bot_override", path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)

    cls = next(v for k, v in vars(mod).items() if "Finetuned" in k and isinstance(v, type))
    bot = cls("USDCHF", "M5", {"risk_per_trade_pct": 2.0})  # LowRiskOrbBot: USDCHF only
    assert bot.parameters["risk_per_trade_pct"] == 2.0


# ── Original files untouched ──────────────────────────────────────────────────

@pytest.mark.parametrize("original", [
    "app/bots/low_risk_orb_bot.py",
    "app/bots/medium_risk_bos_bot.py",
    "app/bots/high_risk_orb_bot.py",
    "app/bots/crypto_low_bot.py",
    "app/bots/crypto_medium_bot.py",
    "app/bots/crypto_high_bot.py",
])
def test_original_bot_file_not_modified(original, cleanup_generated):
    root = Path(__file__).parent.parent.parent / "trading-service"
    original_path = root / original
    mtime_before = original_path.stat().st_mtime

    bot_type = original.split("/")[-1].replace("_bot.py", "").replace("_orb", "").replace("_bos", "")
    # Map file stem to registry key
    stem_to_type = {
        "low_risk": "low_risk",
        "medium_risk": "medium_risk",
        "high_risk": "high_risk",
        "crypto_low": "crypto_low",
        "crypto_medium": "crypto_medium",
        "crypto_high": "crypto_high",
    }
    for key in stem_to_type:
        if key in original:
            bot_type = key
            break

    write_finetuned_bot(bot_type, "bot_test", SAMPLE_PARAMS, REASONING, 3)

    mtime_after = original_path.stat().st_mtime
    assert mtime_before == mtime_after, f"{original} was modified!"
