@echo off
title Portfolio Website Launcher

powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\start-portfolio.ps1"

if errorlevel 1 (
  echo.
  echo Website startup failed. Please keep this window open and review the message above.
  pause
)
