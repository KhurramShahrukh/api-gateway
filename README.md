# Distributed Microservices Architecture

A distributed microservices architecture with API Gateway as the main entry point and separate service repositories.

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   API Gateway   │    │  User Service   │    │ Product Service │
│   (Port 3000)   │◄──►│   (Port 3001)   │    │   (Port 3002)   │
│                 │    │                 │    │                 │
│ - Request Router│    │ - User CRUD     │    │ - Product CRUD  │
│ - Load Balancer │    │ - Authentication│    │ - Inventory     │
│ - Health Check  │    │ - Authorization │    │ - Categories    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Repository Structure

This repository contains the **API Gateway** as the main entry point. The microservices are separate repositories:

- **API Gateway** (this repo) - Main entry point and request router
- **User Service** - Separate repository for user management
- **Product Service** - Separate repository for product management

## Features

### API Gateway
- Request routing and load balancing
- Service health monitoring
- Retry logic with exponential backoff
- Request/response logging
- CORS and security middleware
- Environment-based service configuration

### Microservices
- Independent deployment
- Health check endpoints
- Input validation
- Error handling
- Docker containerization

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- Git

### Option 1: Docker Compose (Recommended)

1. **Clone the API Gateway repository:**
   ```bash
   git clone <api-gateway-repo-url>
   cd api-gateway
   ```

2. **Clone the microservice repositories:**
   ```bash
   # Clone user service
   git clone <user-service-repo-url> user-service
   
   # Clone product service
   git clone <product-service-repo-url> product-service
   ```

3. **Start all services:**
   ```bash
   docker-compose up --build
   ```

4. **Access the services:**
   - API Gateway: http://localhost:3000
   - User Service: http://localhost:3001
   - Product Service: http://localhost:3002

### Option 2: Local Development

#### Quick Start (Recommended)
```bash
# Install all dependencies
npm run install:all

# Start all services with one command
npm run start:all
```

#### Manual Start (Alternative)
1. **Start the microservices individually:**
   ```bash
   # Terminal 1 - User Service
   cd user-service
   npm install && npm start
   
   # Terminal 2 - Product Service
   cd product-service
   npm install && npm start
   ```

2. **Start the API Gateway:**
   ```bash
   # Terminal 3 - API Gateway
   npm install && npm start
   ```

#### Platform-Specific Scripts
```bash
# Linux/Mac
./scripts/start-services.sh

# Windows
scripts\start-services.bat
```

## Environment Configuration

Copy `env.example` to `.env` and configure:

```bash
cp env.example .env
```

Key environment variables:
- `USER_SERVICE_URL` - User service endpoint
- `PRODUCT_SERVICE_URL` - Product service endpoint
- `USER_SERVICE_TIMEOUT` - Request timeout for user service
- `PRODUCT_SERVICE_TIMEOUT` - Request timeout for product service

## API Documentation

### API Gateway Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Gateway information and service status |
| GET | `/health` | Health check with service status |
| ALL | `/api/users/*` | Routes to User Service |
| ALL | `/api/products/*` | Routes to Product Service |

### Service Health Monitoring

The API Gateway continuously monitors service health:

```bash
curl http://localhost:3000/health
```

Response includes:
- Overall gateway status
- Individual service health
- Last health check timestamps

## Development

### Available Scripts

#### NPM Scripts
```bash
# Install all dependencies (gateway + services)
npm run install:all

# Start all services with one command (recommended)
npm run start:all

# Start individual services
npm run start:user      # User Service only
npm run start:product   # Product Service only
npm start               # API Gateway only

# Development mode
npm run dev             # API Gateway with hot reload

# Docker commands
npm run docker:build    # Build Docker images
npm run docker:up       # Start with Docker Compose
npm run docker:down     # Stop Docker services
npm run docker:dev      # Development mode with Docker
```

#### Platform Scripts
```bash
# Linux/Mac
./scripts/start-services.sh    # Start all services
./scripts/stop-services.sh     # Stop all services

# Windows
scripts\start-services.bat     # Start all services
```

#### Docker Commands
```bash
# Start all services with Docker
docker-compose up --build

# Development mode with hot reload
docker-compose -f docker-compose.dev.yml up

# Stop all services
docker-compose down
```

### Adding New Services

1. Create a new service repository
2. Add service configuration to `gateway/server.js`
3. Update `docker-compose.yml`
4. Add environment variables

## Deployment

### Production Deployment

1. **Build service images:**
   ```bash
   docker build -t user-service ./user-service
   docker build -t product-service ./product-service
   docker build -t api-gateway ./gateway
   ```

2. **Deploy with orchestration:**
   - Kubernetes
   - Docker Swarm
   - Cloud platforms (AWS ECS, Google Cloud Run, etc.)

### Environment Variables for Production

```bash
# Production service URLs
USER_SERVICE_URL=https://user-service.yourdomain.com
PRODUCT_SERVICE_URL=https://product-service.yourdomain.com

# Increased timeouts for production
USER_SERVICE_TIMEOUT=10000
PRODUCT_SERVICE_TIMEOUT=10000
```

## Monitoring and Logging

- Health checks every 30 seconds
- Request/response logging with Morgan
- Service status tracking
- Error handling with retry logic

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with Docker Compose
5. Submit a pull request

## License

MIT License - see LICENSE file for details