@echo off
title Building NotebookGLM...
echo ==========================================
echo      NotebookGLM Build Script
echo ==========================================
echo.

echo [Step 1/3] Cleaning previous installations (Nuclear Option)...
if exist node_modules (
    echo Deleting node_modules...
    rmdir /s /q node_modules
)
if exist package-lock.json (
    echo Deleting package-lock.json...
    del package-lock.json
)
if exist dist (
    echo Cleaning dist folder...
    rmdir /s /q dist
)
if exist setup (
    echo Cleaning setup folder...
    rmdir /s /q setup
)

echo [Step 1a/3] Clearing Electron Builder Cache (Fixes binary errors)...
if exist "%LOCALAPPDATA%\electron-builder\Cache" (
    echo Clearing build tools cache...
    rmdir /s /q "%LOCALAPPDATA%\electron-builder\Cache"
)

echo.
echo [Step 2/3] Installing dependencies (Fresh Install)...
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
echo Success! Portable app is in the 'setup' folder.
echo You can run NotebookGLM.exe directly.
echo ==========================================
pause
exit
