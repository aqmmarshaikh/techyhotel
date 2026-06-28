@echo off
echo.
echo   Starting Grand Mehta Palace Dev Server...
echo   Opening http://localhost:8080
echo.
powershell.exe -ExecutionPolicy Bypass -File "%~dp0server.ps1"
pause
