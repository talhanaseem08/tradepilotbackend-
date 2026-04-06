from fastapi import APIRouter, HTTPException
from app.schemas.sentiment import SentimentRequest, SentimentResponse
from app.services.news_service import get_headlines_and_sources
from app.services.finbert_service import analyze_sentiment
from app.core.model_loader import get_finbert
from app.utils.logger import get_logger

logger = get_logger()
router = APIRouter()


@router.post("/sentiment", response_model=SentimentResponse)
async def get_sentiment(request: SentimentRequest):
    model, tokenizer = get_finbert()
    if model is None or tokenizer is None:
        raise HTTPException(status_code=503, detail="FinBERT model not loaded")

    try:
        headlines, sources = await get_headlines_and_sources(request.symbol)
        result = await analyze_sentiment(request.symbol, headlines, sources)
        return result
    except Exception as e:
        logger.error("sentiment analysis failed", error=str(e), symbol=request.symbol)
        raise HTTPException(status_code=500, detail="Sentiment analysis failed")
