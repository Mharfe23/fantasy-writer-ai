#!/bin/bash

echo "========================================"
echo "   Fantasy Writer AI - Stop Services (Git Bash)"
echo "========================================"
echo

echo "Stopping Spring Boot Backend..."
pkill -f "spring-boot:run"
echo "✓ Spring Boot Backend stopped"

echo "Stopping Flask Audio Service..."
pkill -f "python audio_service.py"
echo "✓ Flask Audio Service stopped"

echo "Stopping React Frontend..."
pkill -f "npm run dev"
echo "✓ React Frontend stopped"

echo "Closing Windows Command Prompt windows..."
# Close windows with specific titles
taskkill /f /im cmd.exe /fi "WINDOWTITLE eq Spring Boot Backend*" > /dev/null 2>&1
taskkill /f /im cmd.exe /fi "WINDOWTITLE eq Flask Audio Service*" > /dev/null 2>&1
taskkill /f /im cmd.exe /fi "WINDOWTITLE eq React Frontend*" > /dev/null 2>&1
echo "✓ Windows Command Prompt windows closed"

echo "Stopping Docker services..."
cd backend
docker-compose down
if [ $? -ne 0 ]; then
    echo "WARNING: Failed to stop some Docker services"
else
    echo "✓ Docker services stopped"
fi
cd ..

echo "Cleaning up..."
echo "✓ Cleanup complete"

echo
echo "========================================"
echo "    All Services Stopped Successfully!"
echo "========================================"
echo
echo "Services stopped:"
echo "• Spring Boot Backend"
echo "• Flask Audio Service"
echo "• React Frontend"
echo "• Windows Command Prompt windows"
echo "• PostgreSQL"
echo "• Redis"
echo "• MinIO"
echo "• MongoDB"
echo "• MongoDB Express"
echo
echo "To restart the project, run:"
echo "• ./quick-start.sh (Git Bash - opens Windows windows)"
echo "• ./quick-start-bash.sh (Git Bash - runs in background)"
echo "• quick-start.bat (Windows Command Prompt)"
echo
read -p "Press Enter to continue..."
