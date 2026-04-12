from datetime import datetime, timezone


def create_optimization_log(
    bot_id: str,
    trigger_event: str,
    old_parameters: dict,
    new_parameters: dict,
    reasoning: str = "",
    consecutive_losses: int = 0,
) -> dict:
    return {
        "botID": bot_id,
        "triggerEvent": trigger_event,
        "oldParameters": old_parameters,
        "newParameters": new_parameters,
        "reasoning": reasoning,
        "consecutiveLosses": consecutive_losses,
        "timestamp": datetime.now(timezone.utc),
    }
