import torch
from datetime import datetime, timezone
from app.core.model_loader import get_finbert
from app.schemas.sentiment import SentimentResponse
from app.utils.logger import get_logger

logger = get_logger()

LABEL_MAP = {0: "negative", 1: "neutral", 2: "positive"}


async def analyze_sentiment(
    symbol: str,
    headlines: list[str],
    source_breakdown: dict[str, int],
) -> SentimentResponse:
    model, tokenizer = get_finbert()

    if not headlines:
        return SentimentResponse(
            symbol=symbol,
            sentiment_score=0.0,
            sentiment_label="neutral",
            news_count=0,
            top_headlines=[],
            source_breakdown=source_breakdown,
            timestamp=datetime.now(timezone.utc).isoformat(),
        )

    scores = []
    for headline in headlines:
        inputs = tokenizer(
            headline, return_tensors="pt", truncation=True, max_length=512
        )
        with torch.no_grad():
            outputs = model(**inputs)
        probs = torch.softmax(outputs.logits, dim=-1).squeeze()
        sentiment_score = probs[2].item() - probs[0].item()
        scores.append(sentiment_score)

    avg_score = sum(scores) / len(scores)

    if avg_score > 0.15:
        label = "positive"
    elif avg_score < -0.15:
        label = "negative"
    else:
        label = "neutral"

    return SentimentResponse(
        symbol=symbol,
        sentiment_score=round(avg_score, 4),
        sentiment_label=label,
        news_count=len(headlines),
        top_headlines=headlines[:5],
        source_breakdown=source_breakdown,
        timestamp=datetime.now(timezone.utc).isoformat(),
    )
