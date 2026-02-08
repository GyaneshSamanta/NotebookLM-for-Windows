@echo off
title Building NotebookGLM...
echo ==========================================
echo      NotebookGLM Build Script
echo ==========================================
echo.

echo [Step 0/3] Closing any running instances of NotebookGLM...
taskkill /f /im NotebookGLM.exe >nul 2>&1
timeout /t 2 >nul

echo [Step 1/3] Cleaning previous builds...
if exist release (
    echo Cleaning release folder...
    rmdir /s /q release
)

echo.
echo [Step 2/3] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Failed to install dependencies.
    echo Please check your internet connection and try again.
    pause
    exit
)

echo.
echo [Step 3/3] Building Portable App...
call npm run pack
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Build failed.
    echo See the error message above for details.
    pause
    exit
)

echo.
echo ==========================================
echo Success! Portable app is in the 'release' folder.
echo You can run NotebookGLM.exe directly.
echo ==========================================
pause
exit
