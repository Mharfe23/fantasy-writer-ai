@echo off
echo ========================================
echo    Fantasy Writer AI - Quick Start
echo ========================================
echo.

:: Start Docker services
echo Starting Docker services...
cd backend
docker-compose up -d
cd ..

:: Start Spring Boot Backend
echo Starting Spring Boot Backend...
cd backend\CoreService
start "Spring Boot Backend" cmd /k "mvnw spring-boot:run"
cd ..\..

:: Start Flask Audio Service
echo Starting Flask Audio Service...
cd audio-service
if exist "venv" (
    start "Flask Audio Service" cmd /k "call venv\Scripts\activate.bat && python audio_service.py"
) else (
    echo WARNING: Virtual environment not found. Run run-project.bat first for full setup.
    start "Flask Audio Service" cmd /k "python audio_service.py"
)
cd ..

:: Start React Frontend
echo Starting React Frontend...
cd Frontend
if exist "node_modules" (
    start "React Frontend" cmd /k "npm run dev"
) else (
    echo WARNING: Node modules not found. Run run-project.bat first for full setup.
)
cd ..

echo.
echo ✓ Services started!
echo.
echo Frontend: http://localhost:5173
echo Spring Boot Backend: http://localhost:8080
echo Audio Service: http://localhost:5000
echo.
pause
