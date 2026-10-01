@echo off
title Layla Launcher

echo =========================
echo   Stopping old processes
echo =========================

taskkill /F /IM ollama.exe > nul 2>&1
taskkill /F /IM python.exe > nul 2>&1
taskkill /F /IM node.exe > nul 2>&1

timeout /t 2 /nobreak > nul

echo.
echo =========================
echo   Starting Ollama
echo =========================

start "Ollama" cmd /k "ollama serve"

timeout /t 3 /nobreak > nul

echo.
echo =========================
echo   Starting Layla API
echo =========================

start "Layla API" cmd /k "cd /d C:\yourfolder\yourfolder\yourfolder\folder\folder\Layla\layla-api && .venv\Scripts\activate && uvicorn main:app --reload"

echo.
echo =========================
echo   Starting Layla UI
echo =========================

start "Layla UI" cmd /k "cd /d C:\yourfolder\yourfolder\yourfolder\folder\folder\Layla\layla-ui && npm run dev"

timeout /t 5 /nobreak > nul

echo.
echo =========================
echo   Opening Layla
echo =========================

start http://localhost:5173

echo.
echo Layla is starting...
