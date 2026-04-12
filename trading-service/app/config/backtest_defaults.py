"""
Standard notional account for backtests (CLI scripts and shared sizing).

Use $100,000 balance with 1% risk per trade → $1,000 at stop for linear P&L in `run_backtest`.
"""
BACKTEST_NOTIONAL_USD = 100_000.0
BACKTEST_RISK_PCT = 1.0
