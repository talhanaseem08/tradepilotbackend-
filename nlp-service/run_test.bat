@echo off
cd /d E:\fyp\nlp-service
echo Installing dependencies...
python -m pip install -q selenium webdriver-manager pytz pandas
echo Dependencies installed.
echo.
echo Running test_scraper.py...
python test_scraper.py
pause
