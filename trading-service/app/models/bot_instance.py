from datetime import datetime, timezone


def create_bot_instance(
    bot_id: str,
    user_id: str | None,
    strategy_type: str,
    asset_pair: str,
    market: str,
    timeframe: str,
    parameters: dict,
    current_balance: float = 0.0,
) -> dict:
    return {
        "botID": bot_id,
        "userID": user_id,
        "strategyType": strategy_type,
        "assetPair": asset_pair,
        "market": market,
        "timeframe": timeframe,
        "parameters": parameters,
        "status": "active",
        "currentBalance": current_balance,
        "consecutiveLosses": 0,
        "createdAt": datetime.now(timezone.utc),
        "updatedAt": datetime.now(timezone.utc),
    }


def update_bot_status_doc(bot_id: str, status: str) -> dict:
    return {
        "$set": {
            "status": status,
            "updatedAt": datetime.now(timezone.utc),
        }
    }


def update_bot_parameters_doc(parameters: dict, consecutive_losses: int) -> dict:
    return {
        "$set": {
            "parameters": parameters,
            "consecutiveLosses": consecutive_losses,
            "updatedAt": datetime.now(timezone.utc),
        }
    }
