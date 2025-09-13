# Quick Start Guide

## 🚀 Start All Services with One Command

### Option 1: NPM Script (Recommended)
```bash
# Install all dependencies first
npm run install:all

# Start all services
npm run start:all
```

### Option 2: Platform Scripts
```bash
# Linux/Mac
./scripts/start-services.sh

# Windows
scripts\start-services.bat
```

### Option 3: Docker (if available)
```bash
docker-compose up --build
```

## 📱 What You'll See

When you run `npm run start:all`, you'll see:

```
🚀 Starting Distributed Microservices Architecture...

🔍 Checking prerequisites...
✅ All service directories found

📡 Starting User Service...
✅ User Service started on port 3001

📡 Starting Product Service...
✅ Product Service started on port 3002

📡 Starting API Gateway...
✅ API Gateway started on port 3000

🎉 All services started successfully!

📱 Service URLs:
   🚀 API Gateway:    http://localhost:3000
   👥 User Service:   http://localhost:3001
   📦 Product Service: http://localhost:3002

🔗 Test endpoints:
   • Gateway Health:  http://localhost:3000/health
   • Users API:       http://localhost:3000/api/users
   • Products API:    http://localhost:3000/api/products

💡 Press Ctrl+C to stop all services
```

## 🧪 Test Your Services

1. **Check Gateway Health:**
   ```bash
   curl http://localhost:3000/health
   ```

2. **Get All Users:**
   ```bash
   curl http://localhost:3000/api/users
   ```

3. **Get All Products:**
   ```bash
   curl http://localhost:3000/api/products
   ```

4. **Create a User:**
   ```bash
   curl -X POST http://localhost:3000/api/users \
     -H "Content-Type: application/json" \
     -d '{"name": "John Doe", "email": "john@example.com"}'
   ```

## 🛑 Stop All Services

Press `Ctrl+C` in the terminal where you started the services, or:

```bash
# If using Docker
docker-compose down

# If using individual processes, close the terminal windows
```

## 🔧 Troubleshooting

### Port Already in Use
If you get "address already in use" errors:
```bash
# Kill processes on specific ports
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Service Not Found
Make sure you have the service directories:
```bash
ls -la
# Should show: user-service/ and product-service/
```

### Dependencies Not Installed
```bash
npm run install:all
```

## 🎯 Next Steps

1. **Test the APIs** using the curl commands above
2. **Check the health endpoints** to ensure all services are running
3. **Create some test data** using POST requests
4. **Explore the individual service endpoints** directly

Your distributed microservices architecture is now running! 🎉
