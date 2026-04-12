"""
PPO Parameter Optimization Service
------------------------------------
train_ppo()             : trains/continues training a PPO model for a bot type
suggest_parameters()    : runs inference and returns suggested param adjustments
*_async variants        : run the above in a thread executor (non-blocking)

Models are saved to  agent-service/models/ppo_{bot_type}.zip
"""
from __future__ import annotations

import asyncio
import os
from typing import Any

import numpy as np

from app.services.ppo_env import PARAM_BOUNDS, TradingParamEnv
from app.utils.logger import get_logger

logger = get_logger()

MODELS_DIR       = "models"
TOTAL_TIMESTEPS  = 10_000   # training steps per call


# ── Path helpers ───────────────────────────────────────────────────────────────

def model_path(bot_type: str) -> str:
    os.makedirs(MODELS_DIR, exist_ok=True)
    return os.path.join(MODELS_DIR, f"ppo_{bot_type}.zip")


# ── Stats builder ──────────────────────────────────────────────────────────────

def build_trade_stats(trades: list[dict]) -> dict:
    """Compute win_rate, avg_pnl, consecutive_losses from closed trade records."""
    if not trades:
        return {"win_rate": 0.5, "avg_pnl": 0.0, "consecutive_losses": 0}

    pnls     = [float(t.get("pnl", 0.0)) for t in trades]
    wins     = sum(1 for p in pnls if p > 0)
    win_rate = wins / len(pnls)
    avg_pnl  = float(np.mean(pnls))

    consec = 0
    for p in reversed(pnls):
        if p < 0:
            consec += 1
        else:
            break

    return {"win_rate": win_rate, "avg_pnl": avg_pnl, "consecutive_losses": consec}


# ── Synchronous training ───────────────────────────────────────────────────────

def train_ppo(bot_type: str, trades: list[dict]) -> dict:
    """
    Train (or continue training) a PPO model.
    Returns {"success": bool, "timesteps": int, "model_path": str}.
    Blocking — call via train_ppo_async() from async code.
    """
    try:
        from stable_baselines3 import PPO  # lazy import — not installed in base image

        stats = build_trade_stats(trades)
        env   = TradingParamEnv(bot_type=bot_type, trade_stats=stats)
        path  = model_path(bot_type)

        if os.path.exists(path):
            model = PPO.load(path, env=env)
            logger.info("ppo model loaded for continued training", bot_type=bot_type)
        else:
            model = PPO(
                "MlpPolicy", env,
                verbose=0,
                n_steps=256,
                batch_size=64,
                learning_rate=3e-4,
            )
            logger.info("ppo model created fresh", bot_type=bot_type)

        model.learn(total_timesteps=TOTAL_TIMESTEPS, reset_num_timesteps=False)
        model.save(path)

        logger.info("ppo training complete",
                    bot_type=bot_type, timesteps=TOTAL_TIMESTEPS, path=path)
        return {"success": True, "timesteps": TOTAL_TIMESTEPS, "model_path": path}

    except ImportError:
        msg = "stable-baselines3 not installed — run: pip install stable-baselines3 gymnasium"
        logger.error(msg)
        return {"success": False, "timesteps": 0, "model_path": "", "error": msg}
    except Exception as e:
        logger.error("ppo training failed", bot_type=bot_type, error=str(e))
        return {"success": False, "timesteps": 0, "model_path": "", "error": str(e)}


# ── Synchronous inference ──────────────────────────────────────────────────────

def suggest_parameters(
    bot_type: str,
    current_params: dict[str, Any],
    trade_stats: dict,
) -> dict[str, Any]:
    """
    Run PPO inference and return suggested values for the 3 managed parameters.
    Returns {} if no model exists yet (caller should treat as no suggestion).
    Blocking — call via suggest_parameters_async() from async code.
    """
    path = model_path(bot_type)
    if not os.path.exists(path):
        logger.warning("ppo model not found — skipping inference", bot_type=bot_type)
        return {}

    try:
        from stable_baselines3 import PPO

        env   = TradingParamEnv(bot_type=bot_type, trade_stats=trade_stats)
        model = PPO.load(path)

        # Restrict current_params to the keys this env manages
        bounds       = PARAM_BOUNDS.get(bot_type, {})
        managed_init = {
            k: float(current_params.get(k, (lo + hi) / 2.0))
            for k, (lo, hi) in bounds.items()
        }

        obs, _ = env.reset(options={
            "trade_stats":    trade_stats,
            "current_params": managed_init,
        })

        # 5 deterministic inference steps
        for _ in range(5):
            action, _ = model.predict(obs, deterministic=True)
            obs, _, terminated, _, _ = env.step(action)
            if terminated:
                break

        result = dict(env._current_params)
        logger.info("ppo suggestion ready", bot_type=bot_type, suggestion=result)
        return result

    except Exception as e:
        logger.error("ppo inference failed", bot_type=bot_type, error=str(e))
        return {}


# ── Async wrappers ─────────────────────────────────────────────────────────────

async def train_ppo_async(bot_type: str, trades: list[dict]) -> dict:
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, train_ppo, bot_type, trades)


async def suggest_parameters_async(
    bot_type: str,
    current_params: dict,
    trade_stats: dict,
) -> dict:
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(
        None, suggest_parameters, bot_type, current_params, trade_stats
    )
