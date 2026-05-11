"""Excel logging for trades and wallet state."""
from __future__ import annotations

from pathlib import Path
from typing import Iterable

import pandas as pd

from medium_risk.config import EXCEL_LOG_PATH
from medium_risk.strategy.strategy import TradeResult


def trades_to_df(trades: Iterable[TradeResult]) -> pd.DataFrame:
    rows = []
    for t in trades:
        rows.append(
            {
                "symbol": t.symbol,
                "entry_time": t.entry_time,
                "exit_time": t.exit_time,
                "entry_price": t.entry_price,
                "exit_price": t.exit_price,
                "stop_price": t.stop_price,
                "target_price": t.target_price,
                "position_size": t.position_size,
                "pnl": t.pnl,
                "wallet_before": t.wallet_before,
                "wallet_after": t.wallet_after,
                "reason": t.reason,
            }
        )
    return pd.DataFrame(rows)


def append_trades_to_excel(trades: Iterable[TradeResult], path: str | Path = EXCEL_LOG_PATH) -> None:
    """Append trades to an Excel workbook, creating it if missing."""
    trades = list(trades)  # ensure reusable
    df_new = trades_to_df(trades)
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.exists():
        df_existing = pd.read_excel(path)
        df_all = pd.concat([df_existing, df_new], ignore_index=True)
    else:
        df_all = df_new
    df_all.to_excel(path, index=False)

