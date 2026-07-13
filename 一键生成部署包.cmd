@echo off
title Portfolio Website Production Build
cd /d "%~dp0"

where node.exe >nul 2>nul
if errorlevel 1 (
  echo Node.js was not found. Please install Node.js LTS first.
  pause
  exit /b 1
)

if not exist "node_modules" call npm.cmd install
if errorlevel 1 goto :failed

call npm.cmd run build
if errorlevel 1 goto :failed

echo.
echo Production package created: %~dp0dist
start "" "%~dp0dist"
pause
exit /b 0

:failed
echo.
echo Production build failed. Please review the message above.
pause
exit /b 1
