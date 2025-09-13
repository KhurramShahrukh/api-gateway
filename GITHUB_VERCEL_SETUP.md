# 🚀 GitHub + Vercel Setup Guide

## Quick Start Commands

### 1. Push to GitHub
```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Distributed microservices architecture"

# Create GitHub repository and add remote
git remote add origin https://github.com/YOUR_USERNAME/api-gateway.git

# Push to GitHub
git push -u origin main
```

### 2. Deploy to Vercel

#### Option A: Using Vercel Dashboard (Recommended)
1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "New Project"
3. Import your GitHub repository
4. Deploy each service separately (see detailed steps below)

#### Option B: Using Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy all services
npm run deploy
```

## 📋 Detailed Deployment Steps

### Step 1: Deploy User Service
1. **Vercel Dashboard** → "New Project"
2. **Import** your GitHub repository
3. **Configure**:
   - Project Name: `user-service`
   - Root Directory: `user-service`
   - Framework: Other
   - Build Command: `npm install`
4. **Environment Variables**:
   ```
   NODE_ENV=production
   PORT=3001
   ```
5. **Deploy** and note the URL: `https://user-service.vercel.app`

### Step 2: Deploy Product Service
1. **Vercel Dashboard** → "New Project"
2. **Import** your GitHub repository
3. **Configure**:
   - Project Name: `product-service`
   - Root Directory: `product-service`
   - Framework: Other
   - Build Command: `npm install`
4. **Environment Variables**:
   ```
   NODE_ENV=production
   PORT=3002
   ```
5. **Deploy** and note the URL: `https://product-service.vercel.app`

### Step 3: Deploy API Gateway
1. **Vercel Dashboard** → "New Project"
2. **Import** your GitHub repository
3. **Configure**:
   - Project Name: `api-gateway`
   - Root Directory: `gateway`
   - Framework: Other
   - Build Command: `npm install`
4. **Environment Variables**:
   ```
   USER_SERVICE_URL=https://user-service.vercel.app
   PRODUCT_SERVICE_URL=https://product-service.vercel.app
   NODE_ENV=production
   ```
5. **Deploy** and note the URL: `https://api-gateway.vercel.app`

## 🧪 Test Your Deployment

### Test Individual Services
```bash
# Test User Service
curl https://user-service.vercel.app/health

# Test Product Service
curl https://product-service.vercel.app/health
```

### Test API Gateway
```bash
# Test Gateway Health
curl https://api-gateway.vercel.app/health

# Test Users API
curl https://api-gateway.vercel.app/api/users

# Test Products API
curl https://api-gateway.vercel.app/api/products
```

### Test Full Workflow
```bash
# Create a user
curl -X POST https://api-gateway.vercel.app/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com"}'

# Create a product
curl -X POST https://api-gateway.vercel.app/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Product","price":99.99,"category":"Electronics"}'
```

## 🔧 Available Scripts

```bash
# Local development
npm run start:all          # Start all services locally
npm run install:all        # Install all dependencies

# Deployment
npm run deploy             # Deploy all services to Vercel
npm run deploy:gateway     # Deploy API Gateway only
npm run deploy:user        # Deploy User Service only
npm run deploy:product     # Deploy Product Service only

# Docker (alternative)
npm run docker:up          # Start with Docker Compose
npm run docker:down        # Stop Docker services
```

## 📁 Project Structure

```
api-gateway/
├── gateway/                 # API Gateway service
│   ├── server.js
│   ├── package.json
│   ├── vercel.json
│   └── .gitignore
├── user-service/            # User microservice
│   ├── server.js
│   ├── package.json
│   ├── vercel.json
│   └── .gitignore
├── product-service/         # Product microservice
│   ├── server.js
│   ├── package.json
│   ├── vercel.json
│   └── .gitignore
├── scripts/                 # Deployment scripts
│   ├── start-all-services.js
│   ├── deploy-to-vercel.sh
│   └── start-services.sh
├── .github/workflows/       # GitHub Actions
│   └── deploy.yml
├── vercel.json              # Root Vercel config
├── docker-compose.yml       # Docker configuration
└── package.json             # Root package.json
```

## 🚨 Important Notes

### Vercel Considerations
- **Serverless Functions**: Each service runs as a serverless function
- **Cold Starts**: First request might be slower
- **Timeout**: 30-second function timeout
- **Memory**: Limited memory per function

### Environment Variables
Make sure to set these in Vercel dashboard:
- **API Gateway**: `USER_SERVICE_URL`, `PRODUCT_SERVICE_URL`
- **User Service**: `NODE_ENV=production`
- **Product Service**: `NODE_ENV=production`

## 🎉 Success!

Once deployed, you'll have:
- **API Gateway**: `https://api-gateway.vercel.app`
- **User Service**: `https://user-service.vercel.app`
- **Product Service**: `https://product-service.vercel.app`

Your distributed microservices architecture is now live on Vercel! 🚀

## 📞 Need Help?

1. **Check Vercel logs** in the dashboard
2. **Verify environment variables** are set correctly
3. **Test individual services** first
4. **Check CORS configuration** if you get CORS errors
5. **Review the deployment checklist** in `DEPLOYMENT_CHECKLIST.md`
