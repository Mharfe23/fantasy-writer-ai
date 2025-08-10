#!/bin/bash

echo "========================================"
echo "   Fantasy Writer AI - Quick Start"
echo "========================================"
echo

# Start Docker services
echo "Starting Docker services..."
cd backend
docker-compose up -d
cd ..

# Start all services using Windows batch file
echo "Starting services in Windows windows..."
echo "This will open separate Command Prompt windows for each service."
echo

# Use the Windows batch file to start services
./start-services.bat

echo
echo "✓ Services started in Windows windows!"
echo
echo "Service URLs:"
echo "• Frontend: http://localhost:5173"
echo "• Spring Boot Backend: http://localhost:8080"
echo "• Audio Service: http://localhost:5000"
echo
echo "Each service is running in its own Command Prompt window."
echo "Keep those windows open while working."
echo
read -p "Press Enter to continue..."