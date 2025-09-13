#!/bin/bash

# Start all microservices for local development
echo "🚀 Starting microservices architecture..."

# Check if we should use Docker or Node.js
if command -v docker &> /dev/null && docker info > /dev/null 2>&1; then
    echo "🐳 Docker detected. Starting with Docker Compose..."
    
    # Build and start services
    echo "📦 Building and starting services..."
    docker-compose up --build -d
    
    # Wait for services to be ready
    echo "⏳ Waiting for services to be ready..."
    sleep 10
    
    # Check service health
    echo "🔍 Checking service health..."
    curl -s http://localhost:3000/health | jq '.' || echo "API Gateway health check failed"
    
    echo ""
    echo "✅ Services are running with Docker!"
    echo "📱 API Gateway: http://localhost:3000"
    echo "👥 User Service: http://localhost:3001"
    echo "📦 Product Service: http://localhost:3002"
    echo ""
    echo "💡 To stop services: docker-compose down"
    echo "💡 To view logs: docker-compose logs -f"
    
else
    echo "📦 Docker not available. Starting with Node.js..."
    echo "💡 Make sure you have Node.js installed and dependencies installed"
    echo ""
    
    # Check if Node.js is available
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    
    # Check if npm is available
    if ! command -v npm &> /dev/null; then
        echo "❌ npm is not installed. Please install npm first."
        exit 1
    fi
    
    echo "🔍 Checking service directories..."
    
    # Check if service directories exist
    if [ ! -d "user-service" ]; then
        echo "❌ user-service directory not found"
        echo "💡 Make sure you have cloned the user-service repository"
        exit 1
    fi
    
    if [ ! -d "product-service" ]; then
        echo "❌ product-service directory not found"
        echo "💡 Make sure you have cloned the product-service repository"
        exit 1
    fi
    
    echo "✅ All service directories found"
    echo ""
    echo "🚀 Starting services with Node.js..."
    echo "💡 Use 'npm run start:all' for a better experience with colored output"
    echo ""
    
    # Start services in background
    echo "📡 Starting User Service..."
    cd user-service && npm start &
    USER_PID=$!
    cd ..
    
    sleep 2
    
    echo "📡 Starting Product Service..."
    cd product-service && npm start &
    PRODUCT_PID=$!
    cd ..
    
    sleep 2
    
    echo "📡 Starting API Gateway..."
    npm start &
    GATEWAY_PID=$!
    
    echo ""
    echo "✅ All services started!"
    echo "📱 API Gateway: http://localhost:3000"
    echo "👥 User Service: http://localhost:3001"
    echo "📦 Product Service: http://localhost:3002"
    echo ""
    echo "💡 Press Ctrl+C to stop all services"
    
    # Function to cleanup on exit
    cleanup() {
        echo ""
        echo "🛑 Stopping all services..."
        kill $USER_PID $PRODUCT_PID $GATEWAY_PID 2>/dev/null
        echo "✅ All services stopped"
        exit 0
    }
    
    # Set trap to cleanup on script exit
    trap cleanup SIGINT SIGTERM
    
    # Wait for user to stop
    wait
fi
