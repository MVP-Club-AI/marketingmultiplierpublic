@echo off
cd /d "%~dp0"
echo Starting Marketing UI...
echo.
echo Installing dependencies if needed...
call npm install --silent 2>nul
echo.
echo Starting server...
start /b npm run dev
timeout /t 3 /nobreak >nul
echo Opening browser...
start http://localhost:3000
echo.
echo UI is running at http://localhost:3000
echo Press Ctrl+C to stop.
pause >nul
