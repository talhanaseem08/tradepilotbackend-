from fastapi import APIRouter
from app.schemas.news import NewsResponse
from app.services.news_service import get_news_for_symbol

router = APIRouter()


@router.get("/news/{symbol}", response_model=NewsResponse)
async def get_news(symbol: str):
    return await get_news_for_symbol(symbol.upper())
