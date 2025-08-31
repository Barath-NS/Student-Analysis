@echo off
echo Starting Student Performance AI Server...
echo.
echo Dependencies check...
python -m pip install fastapi uvicorn pandas numpy scikit-learn matplotlib openpyxl PyJWT pydantic python-multipart --quiet
echo.
echo Starting server on http://localhost:8000
echo Press Ctrl+C to stop the server
echo.
python test_server.py
pause
