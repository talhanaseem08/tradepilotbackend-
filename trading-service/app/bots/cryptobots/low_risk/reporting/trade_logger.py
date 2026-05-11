"""Append live signal rows to Excel."""
from __future__ import annotations

from pathlib import Path
from typing import Any, Dict, List

import pandas as pd

from low_risk.config import EXCEL_LOG_PATH


def append_signal_rows(rows: List[Dict[str, Any]], path: Path | str = EXCEL_LOG_PATH) -> None:
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    df_new = pd.DataFrame(rows)
    if path.exists():
        df_old = pd.read_excel(path)
        df_all = pd.concat([df_old, df_new], ignore_index=True)
    else:
        df_all = df_new
    df_all.to_excel(path, index=False)
