"""MongoDB document factory for finetuned bot metadata."""
from __future__ import annotations

from datetime import datetime, timezone


def create_finetuned_bot_record(
    bot_id: str,
    bot_type: str,
    file_path: str,
    old_parameters: dict,
    new_parameters: dict,
    reasoning: str,
    consecutive_losses: int,
) -> dict:
    return {
        "bot_id": bot_id,
        "bot_type": bot_type,
        "file_path": file_path,
        "old_parameters": old_parameters,
        "new_parameters": new_parameters,
        "reasoning": reasoning,
        "consecutive_losses": consecutive_losses,
        "created_at": datetime.now(timezone.utc),
    }
