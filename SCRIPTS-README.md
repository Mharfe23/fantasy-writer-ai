# Fantasy Writer AI - Scripts Guide

This project includes scripts to easily run and manage the entire system.

## 📁 Available Scripts

### **Windows Command Prompt (.bat files):**
- **`run-project.bat`** - Full project setup & start (first time)
- **`quick-start.bat`** - Fast daily start
- **`stop-project.bat`** - Stop all services

### **Git Bash (.sh files):**
- **`quick-start.sh`** - Fast daily start (opens Windows windows)
- **`stop-project.sh`** - Stop all services & close windows

### **Supporting Files:**
- **`start-services.bat`** - Called by quick-start.sh to open Windows windows

## 🚀 Quick Start

### **From Windows Command Prompt:**
1. **First time**: Double-click `run-project.bat`
2. **Daily use**: Double-click `quick-start.bat`
3. **Stop**: Double-click `stop-project.bat`

### **From Git Bash:**
1. **Daily use**: `./quick-start.sh`
2. **Stop**: `./stop-project.sh`

## 📊 Service Ports

| Service | Port | URL |
|---------|------|-----|
| React Frontend | 3030 | http://localhost:3030 |
| Spring Boot Backend | 8080 | http://localhost:8080 |
| Audio Service | 5000 | http://localhost:5000 |

## 🔧 Prerequisites

- Docker Desktop running
- Java 21+ installed
- Python 3.8+ installed  
- Node.js 16+ installed

## 📝 Notes

- **Windows users**: Use `.bat` files
- **Git Bash users**: Use `.sh` files
- All scripts open services in separate Windows windows
- Keep windows open while working
- Use stop scripts before shutting down
