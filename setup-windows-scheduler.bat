@echo off
REM Setup script for Windows Task Scheduler automation
REM This creates a scheduled task to generate 15 articles daily at 2:00 AM

echo.
echo ================================================
echo InfoDaily - Daily Article Auto-Generation Setup
echo ================================================
echo.

REM Check if running as admin
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: This script must be run as Administrator
    echo.
    echo Right-click this file and select "Run as Administrator"
    pause
    exit /b 1
)

REM Get the current directory
set PROJECT_DIR=%~dp0
set NODE_PATH=%ProgramFiles%\nodejs\node.exe

echo Checking Node.js installation...
if not exist "%NODE_PATH%" (
    set NODE_PATH=node.exe
)

echo.
echo Creating scheduled task...
echo Project directory: %PROJECT_DIR%
echo Node executable: %NODE_PATH%
echo.

REM Get user to set API key
echo.
echo IMPORTANT: Before the task can run, you must set your ANTHROPIC_API_KEY
echo in your Windows environment variables.
echo.
echo Steps:
echo 1. Go to Settings ^> System ^> Environment Variables
echo 2. Click "Environment variables" at the bottom
echo 3. Click "New" under "User variables"
echo 4. Variable name: ANTHROPIC_API_KEY
echo 5. Variable value: your-api-key-here
echo 6. Click OK and restart your computer
echo.
pause

REM Create the task
schtasks /create ^
  /tn "InfoDaily Auto-Generate Articles" ^
  /tr "cmd /c cd /d \"%PROJECT_DIR%\" && %NODE_PATH% automate-daily-articles.js" ^
  /sc daily ^
  /st 02:00:00 ^
  /ru "%USERNAME%" ^
  /f

if %errorlevel% equ 0 (
    echo.
    echo ✓ Task created successfully!
    echo.
    echo Task Details:
    echo - Name: InfoDaily Auto-Generate Articles
    echo - Schedule: Daily at 2:00 AM
    echo - Action: Generate 15 articles with relevant images
    echo - Logs: %PROJECT_DIR%logs\articles-YYYY-MM-DD.log
    echo.
    echo To view/manage the task:
    echo 1. Open Task Scheduler (search in Start menu)
    echo 2. Look for "InfoDaily Auto-Generate Articles"
    echo 3. Right-click to Edit, Run, or Delete
    echo.
) else (
    echo.
    echo ERROR: Failed to create scheduled task
    echo Please run this script as Administrator
    echo.
)

pause
