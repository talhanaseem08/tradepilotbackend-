from transformers import AutoTokenizer, AutoModelForSequenceClassification
from app.config.settings import settings
from app.utils.logger import get_logger

logger = get_logger()

finbert_model = None
finbert_tokenizer = None


async def load_finbert():
    global finbert_model, finbert_tokenizer
    logger.info("loading ModernFinBERT", model=settings.finbert_model_name)
    finbert_tokenizer = AutoTokenizer.from_pretrained(settings.finbert_model_name)
    finbert_model = AutoModelForSequenceClassification.from_pretrained(
        settings.finbert_model_name
    )
    finbert_model.eval()
    logger.info("ModernFinBERT loaded successfully")


def get_finbert():
    return finbert_model, finbert_tokenizer
