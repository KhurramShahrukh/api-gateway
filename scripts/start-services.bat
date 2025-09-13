@echo off
setlocal enabledelayedexpansion

echo 🚀 Starting microservices architecture...

REM Check if Docker is available
docker info >nul 2>&1
if %errorlevel% equ 0 (
    echo 🐳 Docker detected. Starting with Docker Compose...
    echo.
    echo 📦 Building and starting services...
    docker-compose up --build -d
    
    echo.
    echo ⏳ Waiting for services to be ready...
    timeout /t 10 /nobreak >nul
    
    echo.
    echo 🔍 Checking service health...
    curl -s http://localhost:3000/health >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ API Gateway health check passed
    ) else (
        echo ❌ API Gateway health check failed
    )
    
    echo.
    echo ✅ Services are running with Docker!
    echo 📱 API Gateway: http://localhost:3000
    echo 👥 User Service: http://localhost:3001
    echo 📦 Product Service: http://localhost:3002
    echo.
    echo 💡 To stop services: docker-compose down
    echo 💡 To view logs: docker-compose logs -f
    goto :eof
)

echo 📦 Docker not available. Starting with Node.js...
echo 💡 Make sure you have Node.js installed and dependencies installed
echo.

REM Check if Node.js is available
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is available
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo 🔍 Checking service directories...

REM Check if service directories exist
if not exist "user-service" (
    echo ❌ user-service directory not found
    echo 💡 Make sure you have cloned the user-service repository
    pause
    exit /b 1
)

if not exist "product-service" (
    echo ❌ product-service directory not found
    echo 💡 Make sure you have cloned the product-service repository
    pause
    exit /b 1
)

echo ✅ All service directories found
echo.
echo 🚀 Starting services with Node.js...
echo 💡 Use 'npm run start:all' for a better experience with colored output
echo.

REM Start User Service
echo 📡 Starting User Service...
start "User Service" cmd /k "cd user-service && npm start"

REM Wait a bit
timeout /t 3 /nobreak >nul

REM Start Product Service
echo 📡 Starting Product Service...
start "Product Service" cmd /k "cd product-service && npm start"

REM Wait a bit
timeout /t 3 /nobreak >nul

REM Start API Gateway
echo 📡 Starting API Gateway...
start "API Gateway" cmd /k "npm start"

echo.
echo ✅ All services started!
echo 📱 API Gateway: http://localhost:3000
echo 👥 User Service: http://localhost:3001
echo 📦 Product Service: http://localhost:3002
echo.
echo 💡 Close the command windows to stop individual services
echo 💡 Or use 'npm run start:all' for a better experience

pause
