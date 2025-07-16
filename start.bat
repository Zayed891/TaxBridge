@echo off
echo ================================
echo      TaxBridge Startup Script
echo ================================
echo.

echo Starting MongoDB (if not already running)...
echo Please make sure MongoDB is running on your system.
echo.

echo Starting Backend Server...
start "TaxBridge Backend" cmd /k "cd /d %~dp0 && npm run dev"

echo.
echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo Starting Frontend Server...
start "TaxBridge Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ================================
echo    TaxBridge is starting up!
echo ================================
echo.
echo Backend:  http://localhost:3000
echo Frontend: http://localhost:3001
echo Demo:     http://localhost:3001/demo
echo.
echo Press any key to close this window...
pause > nul
