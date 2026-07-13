@echo off
where npx >nul 2>nul
if %errorlevel% neq 0 (
  echo Node.js is not installed. Install it from https://nodejs.org/
  pause
  exit /b 1
)
npx serve .
pause
