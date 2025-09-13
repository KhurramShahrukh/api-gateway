const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting Distributed Microservices Architecture...\n');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Service configurations
const services = [
  {
    name: 'User Service',
    path: path.join(process.cwd(), 'user-service'),
    port: 3001,
    color: colors.cyan,
    command: 'npm',
    args: ['start']
  },
  {
    name: 'Product Service', 
    path: path.join(process.cwd(), 'product-service'),
    port: 3002,
    color: colors.magenta,
    command: 'npm',
    args: ['start']
  },
  {
    name: 'API Gateway',
    path: process.cwd(),
    port: 3000,
    color: colors.green,
    command: 'npm',
    args: ['start']
  }
];

// Store running processes
const processes = [];
let servicesStarted = 0;

// Function to check if a port is available
function checkPort(port) {
  return new Promise((resolve) => {
    const net = require('net');
    const server = net.createServer();
    
    server.listen(port, () => {
      server.once('close', () => {
        resolve(true);
      });
      server.close();
    });
    
    server.on('error', () => {
      resolve(false);
    });
  });
}

// Function to start a service
function startService(service) {
  return new Promise((resolve, reject) => {
    console.log(`${service.color}📡 Starting ${service.name}...${colors.reset}`);
    
    // Check if service directory exists
    if (!fs.existsSync(service.path)) {
      console.log(`${colors.red}❌ ${service.name} directory not found at ${service.path}${colors.reset}`);
      reject(new Error(`Service directory not found: ${service.path}`));
      return;
    }
    
    // Check if package.json exists
    const packageJsonPath = path.join(service.path, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      console.log(`${colors.red}❌ package.json not found for ${service.name}${colors.reset}`);
      reject(new Error(`package.json not found for ${service.name}`));
      return;
    }
    
    const child = spawn(service.command, service.args, {
      cwd: service.path,
      stdio: 'pipe',
      shell: true
    });
    
    child.stdout.on('data', (data) => {
      const output = data.toString().trim();
      if (output) {
        console.log(`${service.color}[${service.name}]${colors.reset} ${output}`);
      }
    });
    
    child.stderr.on('data', (data) => {
      const output = data.toString().trim();
      if (output && !output.includes('DeprecationWarning')) {
        console.log(`${colors.red}[${service.name} ERROR]${colors.reset} ${output}`);
      }
    });
    
    child.on('close', (code) => {
      console.log(`${colors.yellow}[${service.name}]${colors.reset} Process exited with code ${code}`);
    });
    
    child.on('error', (error) => {
      console.log(`${colors.red}[${service.name} ERROR]${colors.reset} ${error.message}`);
      reject(error);
    });
    
    // Store the process
    processes.push({
      name: service.name,
      process: child,
      port: service.port
    });
    
    // Wait a bit for the service to start
    setTimeout(() => {
      servicesStarted++;
      console.log(`${colors.green}✅ ${service.name} started on port ${service.port}${colors.reset}\n`);
      resolve();
    }, 2000);
  });
}

// Function to check service health
async function checkServiceHealth(port, serviceName) {
  const axios = require('axios');
  try {
    const response = await axios.get(`http://localhost:${port}/health`, {
      timeout: 5000
    });
    return response.status === 200;
  } catch (error) {
    return false;
  }
}

// Function to wait for service to be ready
async function waitForService(port, serviceName, maxAttempts = 10) {
  for (let i = 0; i < maxAttempts; i++) {
    const isHealthy = await checkServiceHealth(port, serviceName);
    if (isHealthy) {
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  return false;
}

// Main function to start all services
async function startAllServices() {
  try {
    console.log(`${colors.bright}🔍 Checking prerequisites...${colors.reset}`);
    
    // Check if all service directories exist
    for (const service of services) {
      if (!fs.existsSync(service.path)) {
        console.log(`${colors.red}❌ Service directory not found: ${service.path}${colors.reset}`);
        console.log(`${colors.yellow}💡 Make sure you have cloned the user-service and product-service repositories${colors.reset}`);
        process.exit(1);
      }
    }
    
    console.log(`${colors.green}✅ All service directories found${colors.reset}\n`);
    
    // Start services in sequence
    for (const service of services) {
      await startService(service);
    }
    
    console.log(`${colors.bright}⏳ Waiting for services to be ready...${colors.reset}`);
    
    // Wait for all services to be healthy
    const healthChecks = await Promise.allSettled(
      services.map(service => waitForService(service.port, service.name))
    );
    
    console.log(`\n${colors.bright}🎉 All services started successfully!${colors.reset}\n`);
    
    // Display service information
    console.log(`${colors.bright}📱 Service URLs:${colors.reset}`);
    console.log(`${colors.green}   🚀 API Gateway:    http://localhost:3000${colors.reset}`);
    console.log(`${colors.cyan}   👥 User Service:   http://localhost:3001${colors.reset}`);
    console.log(`${colors.magenta}   📦 Product Service: http://localhost:3002${colors.reset}\n`);
    
    console.log(`${colors.bright}🔗 Test endpoints:${colors.reset}`);
    console.log(`${colors.blue}   • Gateway Health:  http://localhost:3000/health${colors.reset}`);
    console.log(`${colors.blue}   • Users API:       http://localhost:3000/api/users${colors.reset}`);
    console.log(`${colors.blue}   • Products API:    http://localhost:3000/api/products${colors.reset}\n`);
    
    console.log(`${colors.yellow}💡 Press Ctrl+C to stop all services${colors.reset}`);
    
  } catch (error) {
    console.log(`${colors.red}❌ Error starting services: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

// Handle process termination
process.on('SIGINT', () => {
  console.log(`\n${colors.yellow}🛑 Shutting down all services...${colors.reset}`);
  
  processes.forEach(({ name, process: proc }) => {
    if (proc && !proc.killed) {
      console.log(`${colors.yellow}   Stopping ${name}...${colors.reset}`);
      proc.kill('SIGINT');
    }
  });
  
  setTimeout(() => {
    console.log(`${colors.green}✅ All services stopped${colors.reset}`);
    process.exit(0);
  }, 2000);
});

process.on('SIGTERM', () => {
  console.log(`\n${colors.yellow}🛑 Shutting down all services...${colors.reset}`);
  
  processes.forEach(({ name, process: proc }) => {
    if (proc && !proc.killed) {
      proc.kill('SIGTERM');
    }
  });
  
  process.exit(0);
});

// Start all services
startAllServices();
