@echo off
echo Stopping any running processes...
taskkill /f /im node.exe 2>nul
taskkill /f /im electron.exe 2>nul

echo Starting NetFast Backend...
start "NetFast Backend" cmd /k "cd /d %~dp0backend && npm run dev"

echo Starting NetFast Frontend...
start "NetFast Frontend" cmd /k "cd /d %~dp0 && npm run dev"

echo NetFast app restarting...
echo Backend: http://localhost:3001
echo Frontend: http://localhost:8080
pause 