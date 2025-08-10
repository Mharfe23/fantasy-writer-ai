@echo off
echo ========================================
echo    Fantasy Writer AI - Project Runner
echo ========================================
echo.

:: Check if Docker is running
echo [1/6] Checking Docker status...
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not running!
    echo Please start Docker Desktop and try again.
    pause
    exit /b 1
)
echo ✓ Docker is running

:: Check if required directories exist
echo [2/6] Checking project structure...
if not exist "backend" (
    echo ERROR: Backend directory not found!
    pause
    exit /b 1
)
if not exist "audio-service" (
    echo ERROR: Audio service directory not found!
    pause
    exit /b 1
)
if not exist "Frontend" (
    echo ERROR: Frontend directory not found!
    pause
    exit /b 1
)
echo ✓ Project structure verified

:: Start Docker services
echo [3/6] Starting Docker services...
cd backend
echo Starting PostgreSQL, Redis, MinIO, and MongoDB...
docker-compose up -d
if %errorlevel% neq 0 (
    echo ERROR: Failed to start Docker services!
    pause
    exit /b 1
)
echo ✓ Docker services started successfully

:: Wait for services to be ready
echo [4/6] Waiting for services to be ready...
echo Waiting for PostgreSQL...
timeout /t 10 /nobreak >nul
echo Waiting for Redis...
timeout /t 5 /nobreak >nul
echo Waiting for MinIO...
timeout /t 5 /nobreak >nul
echo ✓ Services should be ready

:: Start Spring Boot Backend
echo [5/7] Starting Spring Boot Backend...
cd ..\backend\CoreService
echo Checking Java installation...
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Java is not installed or not in PATH!
    echo Please install Java 21+ and try again.
    pause
    exit /b 1
)

echo Starting Spring Boot Backend on port 8080...
echo Using Maven wrapper (mvnw)...
start "Spring Boot Backend" cmd /k "mvnw spring-boot:run"
echo ✓ Spring Boot Backend started in new window

:: Start Flask Audio Service
echo [6/7] Starting Flask Audio Service...
cd ..\..\audio-service
echo Installing Python dependencies...
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)
call venv\Scripts\activate.bat
echo Installing requirements...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo WARNING: Failed to install some dependencies, continuing anyway...
)

echo Starting Flask Audio Service on port 5000...
start "Flask Audio Service" cmd /k "call venv\Scripts\activate.bat && python audio_service.py"
echo ✓ Flask Audio Service started in new window

:: Start React Frontend
echo [7/7] Starting React Frontend...
cd ..\Frontend
echo Installing Node.js dependencies...
if not exist "node_modules" (
    echo Installing npm packages...
    npm install
    if %errorlevel% neq 0 (
        echo WARNING: Failed to install npm packages, continuing anyway...
    )
)

echo Starting React development server on port 5173...
start "React Frontend" cmd /k "npm run dev"
echo ✓ React Frontend started in new window

:: Return to root directory
cd ..

echo.
echo ========================================
echo    Project Started Successfully!
echo ========================================
echo.
echo Services running:
echo • PostgreSQL: localhost:5432
echo • Redis: localhost:6379
echo • MinIO: localhost:9000 (API), localhost:9001 (Console)
echo • MongoDB: localhost:27017
echo • MongoDB Express: localhost:8081
echo • Spring Boot Backend: localhost:8080
echo • Flask Audio Service: localhost:5000
echo • React Frontend: localhost:5173
echo.
echo MinIO Console: http://localhost:9001
echo   Username: username
echo   Password: password
echo.
echo MongoDB Express: http://localhost:8081
echo   Username: username
echo   Password: password
echo.
echo Press any key to open the frontend in your browser...
pause >nul
start http://localhost:5173

echo.
echo To stop all services, run: stop-project.bat
echo.
pause
