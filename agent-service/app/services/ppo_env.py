"""
PPO Trading Parameter Environment
----------------------------------
Gymnasium environment for optimizing bot parameters via Proximal Policy Optimization.

State  (6-dim): [win_rate, avg_pnl_norm, consec_losses_norm, p1_norm, p2_norm, p3_norm]
Action (3-dim): continuous in [-1, 1] — adjustment delta per managed parameter
Reward         : Kelly-like expected-value proxy minus loss/regularization penalties

Each episode = up to 10 adjustment steps given the current performance context.
"""
from __future__ import annotations

import numpy as np
import gymnasium as gym
from gymnasium import spaces

# Tunable parameter bounds per bot type.
# Only 3 key params per type so the action space stays fixed at dim=3.
PARAM_BOUNDS: dict[str, dict[str, tuple[float, float]]] = {
    "low_risk": {
        "risk_per_trade_usd": (100.0, 2000.0),
        "reward_ratio":       (1.0,   4.0),
        "max_wait_hours":     (0.5,   3.0),
    },
    "medium_risk": {
        "sl_percent":         (0.01,   0.10),
        "tp_percent":         (0.02,   0.15),
        "risk_per_trade_pct": (0.5,    5.0),
    },
    "high_risk": {
        "risk_per_trade_pct": (0.5,  5.0),
        "reward_ratio":       (1.0,  5.0),
        "max_wait_hours":     (0.5,  3.0),
    },
}

NUM_PARAMS = 3    # fixed for all bot types
MAX_STEPS  = 10   # steps per episode


class TradingParamEnv(gym.Env):
    """
    Single-context episodic env.

    reset() accepts optional `options` dict:
        trade_stats    : {win_rate, avg_pnl, consecutive_losses}
        current_params : {param_key: float, ...}
    """

    metadata = {"render_modes": []}

    def __init__(self, bot_type: str, trade_stats: dict | None = None):
        super().__init__()

        if bot_type not in PARAM_BOUNDS:
            raise ValueError(
                f"Unknown bot_type '{bot_type}'. Must be one of {list(PARAM_BOUNDS)}"
            )

        self.bot_type     = bot_type
        self.param_keys   = list(PARAM_BOUNDS[bot_type].keys())
        self.param_bounds = PARAM_BOUNDS[bot_type]

        # [win_rate, avg_pnl_norm, consec_norm, p1, p2, p3]
        self.observation_space = spaces.Box(
            low=0.0, high=1.0, shape=(6,), dtype=np.float32
        )
        # delta in [-1, 1] per param
        self.action_space = spaces.Box(
            low=-1.0, high=1.0, shape=(NUM_PARAMS,), dtype=np.float32
        )

        self._trade_stats: dict    = trade_stats or self._synthetic_stats()
        self._current_params: dict = {}
        self._step_count: int      = 0

    # ── Private helpers ────────────────────────────────────────────────────────

    def _synthetic_stats(self) -> dict:
        """Random training stats when real data is sparse."""
        return {
            "win_rate":           float(np.random.uniform(0.3, 0.7)),
            "avg_pnl":            float(np.random.uniform(-50.0, 100.0)),
            "consecutive_losses": int(np.random.randint(0, 5)),
        }

    def _normalize(self, key: str, value: float) -> float:
        lo, hi = self.param_bounds[key]
        return float(np.clip((value - lo) / (hi - lo), 0.0, 1.0))

    def _denormalize(self, key: str, norm: float) -> float:
        lo, hi = self.param_bounds[key]
        return float(np.clip(lo + norm * (hi - lo), lo, hi))

    def _default_params(self) -> dict:
        return {k: (lo + hi) / 2.0 for k, (lo, hi) in self.param_bounds.items()}

    def _build_obs(self) -> np.ndarray:
        s          = self._trade_stats
        win_rate   = float(np.clip(s.get("win_rate", 0.5), 0.0, 1.0))
        pnl_norm   = float(np.clip((s.get("avg_pnl", 0.0) + 200.0) / 400.0, 0.0, 1.0))
        consec_n   = float(np.clip(s.get("consecutive_losses", 0) / 10.0, 0.0, 1.0))
        param_norms = np.array(
            [self._normalize(k, self._current_params[k]) for k in self.param_keys],
            dtype=np.float32,
        )
        return np.concatenate(
            [[win_rate, pnl_norm, consec_n], param_norms], dtype=np.float32
        )

    def _compute_reward(self, new_params: dict) -> float:
        """
        Proxy reward:
          ev         = win_rate * rr - (1 - win_rate)
          loss_pen   = 0.1 per consecutive loss above 2
          reg_pen    = 0.05 for each param far from its midpoint
        """
        s        = self._trade_stats
        win_rate = s.get("win_rate", 0.5)
        consec   = s.get("consecutive_losses", 0)

        if "reward_ratio" in new_params:
            rr = new_params["reward_ratio"]
        elif "tp_percent" in new_params and "sl_percent" in new_params:
            rr = new_params["tp_percent"] / max(new_params["sl_percent"], 1e-6)
        else:
            rr = 2.0

        ev         = win_rate * rr - (1.0 - win_rate)
        loss_pen   = 0.1 * max(0, consec - 2)
        reg_pen    = sum(
            abs(new_params[k] - (lo + hi) / 2.0) / (hi - lo) * 0.05
            for k, (lo, hi) in self.param_bounds.items()
        )
        return float(ev - loss_pen - reg_pen)

    # ── Gym API ────────────────────────────────────────────────────────────────

    def reset(
        self,
        seed: int | None = None,
        options: dict | None = None,
    ) -> tuple[np.ndarray, dict]:
        super().reset(seed=seed)

        if options:
            if "trade_stats" in options:
                self._trade_stats = options["trade_stats"]
            if "current_params" in options:
                self._current_params = dict(options["current_params"])
            else:
                self._current_params = self._default_params()
        else:
            self._current_params = self._default_params()

        self._step_count = 0
        return self._build_obs(), {}

    def step(self, action: np.ndarray) -> tuple[np.ndarray, float, bool, bool, dict]:
        new_params: dict[str, float] = {}

        for i, key in enumerate(self.param_keys):
            current_norm = self._normalize(key, self._current_params[key])
            # Each action unit moves the param by up to ±20% of its range
            new_norm     = float(np.clip(current_norm + float(action[i]) * 0.2, 0.0, 1.0))
            new_params[key] = self._denormalize(key, new_norm)

        self._current_params = new_params
        reward = self._compute_reward(new_params)

        self._step_count += 1
        terminated = self._step_count >= MAX_STEPS

        return self._build_obs(), reward, terminated, False, {}
