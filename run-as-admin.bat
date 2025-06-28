@echo off
echo Starting NetFast as Administrator...
echo.

REM Check if running as admin
net session >nul 2>&1
if %errorLevel% == 0 (
    echo Already running as administrator.
) else (
    echo Requesting administrator privileges...
    powershell -Command "Start-Process '%~dpnx0' -Verb RunAs"
    exit /b
)

echo.
echo Starting NetFast Electron App...
echo.

REM Navigate to project directory
cd /d "%~dp0"

REM Start the app
npm run electron

pause 