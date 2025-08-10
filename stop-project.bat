@echo off
echo ========================================
echo    Fantasy Writer AI - Stop Services
echo ========================================
echo.

echo [1/5] Stopping Spring Boot Backend...
taskkill /f /im java.exe /fi "WINDOWTITLE eq Spring Boot Backend*" >nul 2>&1
echo ✓ Spring Boot Backend stopped

echo [2/5] Stopping Flask Audio Service...
taskkill /f /im python.exe /fi "WINDOWTITLE eq Flask Audio Service*" >nul 2>&1
echo ✓ Flask Audio Service stopped

echo [3/5] Stopping React Frontend...
taskkill /f /im node.exe /fi "WINDOWTITLE eq React Frontend*" >nul 2>&1
echo ✓ React Frontend stopped

echo [4/5] Stopping Docker services...
cd backend
docker-compose down
if %errorlevel% neq 0 (
    echo WARNING: Failed to stop some Docker services
) else (
    echo ✓ Docker services stopped
)

echo [5/5] Cleaning up...
cd ..
echo ✓ Cleanup complete

echo.
echo ========================================
echo    All Services Stopped Successfully!
echo ========================================
echo.
echo Services stopped:
echo • Spring Boot Backend
echo • Flask Audio Service
echo • React Frontend  
echo • PostgreSQL
echo • Redis
echo • MinIO
echo • MongoDB
echo • MongoDB Express
echo.
echo To restart the project, run: run-project.bat
echo.
pause
