import json
from app.core.ollama_client import ollama_client
from app.config.settings import settings
from app.schemas.reason import ReasonRequest, ReasonResponse
from app.utils.logger import get_logger

logger = get_logger()

DEEPSEEK_PROMPT_TEMPLATE = """You are a trading strategy analyst. A trading bot has experienced {losses} consecutive losses and needs parameter adjustment.

Bot type: {bot_type}
Symbol: {symbol} ({market}), Timeframe: {timeframe}
Current parameters: {params}
Recent trades: {trades}
Market conditions: {market_summary}

Analyze what went wrong and suggest specific parameter adjustments.
Return your response as valid JSON only, no other text:
{{"rsi_period": <int>, "ema_fast": <int>, "ema_slow": <int>, "rsi_oversold": <int>, "rsi_overbought": <int>, "stop_loss_pips": <int>, "take_profit_pips": <int>, "reasoning": "<explanation>"}}"""


async def analyze_and_suggest(request: ReasonRequest) -> ReasonResponse:
    prompt = DEEPSEEK_PROMPT_TEMPLATE.format(
        losses=request.consecutive_losses,
        bot_type=request.bot_type,
        symbol=request.symbol,
        market=request.market,
        timeframe=request.timeframe,
        params=json.dumps(request.current_parameters),
        trades=json.dumps(request.recent_trades[-10:]),
        market_summary=request.market_summary or "No data available",
    )

    try:
        logger.info("calling deepseek", bot_id=request.bot_id, model=settings.deepseek_model)
        result = await ollama_client.generate(
            model=settings.deepseek_model,
            prompt=prompt,
            stream=False,
        )

        raw_text = result.get("response", "")
        logger.info("deepseek response received", length=len(raw_text))

        parsed = _extract_json(raw_text)
        reasoning = parsed.pop("reasoning", "")

        if not parsed:
            return ReasonResponse(
                bot_id=request.bot_id,
                reasoning=raw_text[:500],
                success=False,
            )

        return ReasonResponse(
            bot_id=request.bot_id,
            new_parameters=parsed,
            reasoning=reasoning,
            success=True,
        )

    except Exception as e:
        logger.error("deepseek analysis failed", error=str(e), bot_id=request.bot_id)
        return ReasonResponse(
            bot_id=request.bot_id,
            reasoning=f"DeepSeek call failed: {str(e)}",
            success=False,
        )


def _extract_json(text: str) -> dict:
    try:
        start = text.index("{")
        end = text.rindex("}") + 1
        return json.loads(text[start:end])
    except (ValueError, json.JSONDecodeError):
        logger.warning("failed to parse JSON from deepseek", text=text[:200])
        return {}
