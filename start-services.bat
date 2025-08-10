@echo off
echo Starting Fantasy Writer AI Services...
echo.

echo Starting Spring Boot Backend...
start "Spring Boot Backend" cmd /k "cd /d %~dp0backend\CoreService && mvnw spring-boot:run"

echo Starting Flask Audio Service...
start "Flask Audio Service" cmd /k "cd /d %~dp0audio-service && call venv\Scripts\activate.bat && python audio_service.py"

echo Starting React Frontend...
start "React Frontend" cmd /k "cd /d %~dp0Frontend && npm run dev"

echo.
echo All services started in separate windows!
echo.
echo Service URLs:
echo - Frontend: http://localhost:5173
echo - Spring Boot Backend: http://localhost:8080
echo - Audio Service: http://localhost:5000
echo.
pause
