# API Gateway - Microservices Architecture

A robust API Gateway for managing microservices communication with advanced features like health monitoring, retry logic, and request routing.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment is already configured:**
   ```bash
   # .env file is already created with default values
   # Edit .env file if you need to change any configuration
   ```

3. **Start the gateway:**
   ```bash
   npm start
   ```

4. **For development with auto-reload:**
   ```bash
   npm run dev
   ```

## 📡 API Endpoints

### Gateway Information
- `GET /` - Gateway status and available endpoints

### Health Monitoring
- `GET /health` - Comprehensive health check for gateway and all services

### Service Routing
- `GET|POST|PUT|DELETE /api/users/*` - Routes to User Service
- `GET|POST|PUT|DELETE /api/products/*` - Routes to Product Service

## 🧪 Testing

The gateway will be available at `http://localhost:3000`

### Test Commands

```bash
# Gateway info
curl http://localhost:3000

# Health check
curl http://localhost:3000/health

# Test user service routing
curl http://localhost:3000/api/users
curl http://localhost:3000/api/users/1

# Test product service routing
curl http://localhost:3000/api/products
curl http://localhost:3000/api/products/1
```

## ⚙️ Configuration

Edit `.env` file to configure:

### Core Settings
- **PORT**: Gateway port (default: 3000)
- **NODE_ENV**: Environment (development/production)

### Service URLs
- **USER_SERVICE_URL**: User service URL (default: http://localhost:3001)
- **PRODUCT_SERVICE_URL**: Product service URL (default: http://localhost:3002)

### Service Communication
- **USER_SERVICE_TIMEOUT**: Timeout for user service requests (default: 5000ms)
- **PRODUCT_SERVICE_TIMEOUT**: Timeout for product service requests (default: 5000ms)
- **USER_SERVICE_RETRIES**: Retry attempts for user service (default: 3)
- **PRODUCT_SERVICE_RETRIES**: Retry attempts for product service (default: 3)

### Security & CORS
- **CORS_ORIGIN**: CORS origin (default: *)
- **HELMET_ENABLED**: Enable security headers (default: true)

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   API Gateway   │    │  User Service   │    │ Product Service │
│   (Port 3000)   │◄──►│   (Port 3001)   │    │   (Port 3002)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Request Flow
1. Client sends request to API Gateway
2. Gateway validates and routes request to appropriate service
3. Service processes request and returns response
4. Gateway forwards response to client

### Routing Rules
- `/api/users/*` → User Service (Port 3001)
- `/api/products/*` → Product Service (Port 3002)
- `/health` → Gateway health check
- `/` → Gateway information

## ✨ Features

### Core Functionality
- **Request Routing**: Intelligent routing to microservices
- **Load Balancing**: Ready for multiple service instances
- **Health Monitoring**: Real-time service health tracking
- **Request Logging**: Comprehensive request/response logging

### Reliability
- **Retry Logic**: Exponential backoff retry mechanism
- **Circuit Breaker**: Prevents cascade failures
- **Timeout Handling**: Configurable request timeouts
- **Error Handling**: Graceful error responses

### Security
- **CORS Support**: Configurable cross-origin requests
- **Helmet Integration**: Security headers
- **Request Validation**: Input sanitization
- **Rate Limiting**: Ready for rate limiting implementation

### Monitoring
- **Health Checks**: Service availability monitoring
- **Request Tracking**: Unique request IDs
- **Performance Metrics**: Response time tracking
- **Error Reporting**: Detailed error logging

## 🔧 Development

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Running microservices (User Service & Product Service)

### Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload

### Dependencies
- **express**: Web framework
- **axios**: HTTP client for service communication
- **cors**: Cross-origin resource sharing
- **helmet**: Security middleware
- **morgan**: HTTP request logger
- **dotenv**: Environment variable management

## 🚀 Production Deployment

### Environment Setup
1. Set `NODE_ENV=production`
2. Configure production service URLs
3. Set appropriate timeouts and retry limits
4. Configure CORS origins for production domains

### Docker Support
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### Health Monitoring
- Monitor `/health` endpoint for service status
- Set up alerts for service degradation
- Track response times and error rates

## 📝 API Documentation

### Health Check Response
```json
{
  "status": "OK|DEGRADED",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "gateway": "Running",
  "services": ["userService", "productService"],
  "serviceHealth": {
    "userService": {
      "status": "healthy|unhealthy",
      "lastCheck": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### Error Response Format
```json
{
  "error": "Error communicating with User Service",
  "message": "Service unavailable",
  "service": "User Service",
  "retries": 2
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details
