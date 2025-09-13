// Load environment variables
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Service configurations
const services = {
  userService: {
    url: process.env.USER_SERVICE_URL || 'http://localhost:3001',
    name: 'User Service',
    timeout: parseInt(process.env.USER_SERVICE_TIMEOUT) || 5000,
    retries: parseInt(process.env.USER_SERVICE_RETRIES) || 3
  },
  productService: {
    url: process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002',
    name: 'Product Service',
    timeout: parseInt(process.env.PRODUCT_SERVICE_TIMEOUT) || 5000,
    retries: parseInt(process.env.PRODUCT_SERVICE_RETRIES) || 3
  }
};

// Service health tracking
const serviceHealth = {
  userService: { status: 'unknown', lastCheck: null },
  productService: { status: 'unknown', lastCheck: null }
};

// Service health check function
async function checkServiceHealth(serviceName, serviceConfig) {
  try {
    const response = await axios.get(`${serviceConfig.url}/health`, {
      timeout: serviceConfig.timeout
    });
    serviceHealth[serviceName] = {
      status: response.status === 200 ? 'healthy' : 'unhealthy',
      lastCheck: new Date().toISOString()
    };
    return serviceHealth[serviceName].status === 'healthy';
  } catch (error) {
    serviceHealth[serviceName] = {
      status: 'unhealthy',
      lastCheck: new Date().toISOString()
    };
    return false;
  }
}

// Health check endpoint
app.get('/health', async (req, res) => {
  const healthChecks = await Promise.allSettled(
    Object.entries(services).map(([name, config]) => 
      checkServiceHealth(name, config)
    )
  );

  const overallStatus = healthChecks.every(check => 
    check.status === 'fulfilled' && check.value
  ) ? 'OK' : 'DEGRADED';

  res.json({
    status: overallStatus,
    timestamp: new Date().toISOString(),
    gateway: 'Running',
    services: Object.keys(services),
    serviceHealth: serviceHealth
  });
});

// Request forwarding function with retry logic
async function forwardRequest(serviceConfig, req, res, retryCount = 0) {
  try {
    const response = await axios({
      method: req.method,
      url: `${serviceConfig.url}${req.url}`,
      data: req.body,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': req.headers.authorization,
        'X-Request-ID': req.headers['x-request-id'] || `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      },
      timeout: serviceConfig.timeout
    });
    
    // Update service health on successful request
    serviceHealth[Object.keys(services).find(key => services[key] === serviceConfig)] = {
      status: 'healthy',
      lastCheck: new Date().toISOString()
    };
    
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(`Error forwarding to ${serviceConfig.name}:`, error.message);
    
    // Retry logic
    if (retryCount < serviceConfig.retries && error.code !== 'ECONNREFUSED') {
      console.log(`Retrying request to ${serviceConfig.name} (attempt ${retryCount + 1}/${serviceConfig.retries})`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1))); // Exponential backoff
      return forwardRequest(serviceConfig, req, res, retryCount + 1);
    }
    
    // Update service health on failure
    const serviceName = Object.keys(services).find(key => services[key] === serviceConfig);
    serviceHealth[serviceName] = {
      status: 'unhealthy',
      lastCheck: new Date().toISOString()
    };
    
    res.status(error.response?.status || 503).json({
      error: `Error communicating with ${serviceConfig.name}`,
      message: error.response?.data?.message || error.message,
      service: serviceConfig.name,
      retries: retryCount
    });
  }
}

// Route requests to User Service
app.use('/api/users', async (req, res) => {
  await forwardRequest(services.userService, req, res);
});

// Route requests to Product Service
app.use('/api/products', async (req, res) => {
  await forwardRequest(services.productService, req, res);
});

// Default route
app.get('/', (req, res) => {
  res.json({
    message: 'API Gateway is running!',
    endpoints: {
      health: '/health',
      users: '/api/users',
      products: '/api/products'
    },
    services: services
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The route ${req.originalUrl} does not exist`
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Gateway Error:', error);
  res.status(500).json({
    error: 'Internal Gateway Error',
    message: error.message
  });
});

app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
  console.log(`📡 Forwarding requests to:`);
  console.log(`   - User Service: ${services.userService.url}`);
  console.log(`   - Product Service: ${services.productService.url}`);
});
