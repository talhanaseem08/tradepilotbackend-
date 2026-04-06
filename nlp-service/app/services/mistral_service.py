import json
from app.core.ollama_client import ollama_client
from app.config.settings import settings
from app.schemas.parse import ParseResponse
from app.utils.logger import get_logger

logger = get_logger()

SYSTEM_PROMPT = (
    "Extract the bot configuration from the user prompt into JSON. "
    "Return ONLY valid JSON with these fields: "
    "intent, risk_level, market, strategy_type, analysis_mode, symbol, "
    "timeframe, stop_loss_pips, take_profit_pips."
)


async def parse_trading_prompt(prompt: str) -> ParseResponse:
    full_prompt = f"[INST] {SYSTEM_PROMPT}\n\nUser input: {prompt} [/INST]"

    logger.info("calling mistral", prompt=prompt[:100])
    result = await ollama_client.generate(
        model=settings.mistral_model_name,
        prompt=full_prompt,
        stream=False,
    )

    raw_text = result.get("response", "")
    logger.info("mistral response received", length=len(raw_text))

    parsed = _extract_json(raw_text)
    parsed["raw_output"] = raw_text
    return ParseResponse(**parsed)


def _extract_json(text: str) -> dict:
    try:
        start = text.index("{")
        end = text.rindex("}") + 1
        return json.loads(text[start:end])
    except (ValueError, json.JSONDecodeError):
        logger.warning("failed to parse JSON from mistral output", text=text[:200])
        return {}
