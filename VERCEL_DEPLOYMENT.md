# Vercel Deployment Guide

This guide will help you deploy your distributed microservices architecture to Vercel.

## 🚀 Deployment Strategy

Since Vercel is designed for serverless functions, we'll deploy each service as a separate Vercel project:

1. **API Gateway** - Main entry point
2. **User Service** - Separate Vercel project
3. **Product Service** - Separate Vercel project

## 📋 Prerequisites

- GitHub account
- Vercel account
- Git installed locally

## 🔧 Step 1: Prepare for GitHub

### 1.1 Initialize Git Repository
```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Distributed microservices architecture"
```

### 1.2 Create GitHub Repository
1. Go to [GitHub](https://github.com) and create a new repository
2. Name it `api-gateway` (or your preferred name)
3. Don't initialize with README (we already have one)

### 1.3 Push to GitHub
```bash
# Add remote origin (replace with your GitHub URL)
git remote add origin https://github.com/YOUR_USERNAME/api-gateway.git

# Push to GitHub
git push -u origin main
```

## 🎯 Step 2: Deploy to Vercel

### 2.1 Deploy API Gateway
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure project:
   - **Project Name**: `api-gateway`
   - **Root Directory**: `gateway`
   - **Framework Preset**: Other
   - **Build Command**: `npm install`
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

5. Add Environment Variables:
   ```
   USER_SERVICE_URL=https://user-service.vercel.app
   PRODUCT_SERVICE_URL=https://product-service.vercel.app
   NODE_ENV=production
   ```

6. Click "Deploy"

### 2.2 Deploy User Service
1. Create a new Vercel project
2. Import the same GitHub repository
3. Configure project:
   - **Project Name**: `user-service`
   - **Root Directory**: `user-service`
   - **Framework Preset**: Other
   - **Build Command**: `npm install`
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

4. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=3001
   ```

5. Click "Deploy"

### 2.3 Deploy Product Service
1. Create a new Vercel project
2. Import the same GitHub repository
3. Configure project:
   - **Project Name**: `product-service`
   - **Root Directory**: `product-service`
   - **Framework Preset**: Other
   - **Build Command**: `npm install`
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

4. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=3002
   ```

5. Click "Deploy"

## 🔄 Step 3: Update Service URLs

After all services are deployed, update the API Gateway environment variables:

1. Go to your API Gateway project in Vercel
2. Go to Settings → Environment Variables
3. Update the URLs:
   ```
   USER_SERVICE_URL=https://user-service.vercel.app
   PRODUCT_SERVICE_URL=https://product-service.vercel.app
   ```
4. Redeploy the API Gateway

## 🧪 Step 4: Test Your Deployment

### 4.1 Test Individual Services
```bash
# Test User Service
curl https://user-service.vercel.app/health

# Test Product Service
curl https://product-service.vercel.app/health
```

### 4.2 Test API Gateway
```bash
# Test Gateway Health
curl https://api-gateway.vercel.app/health

# Test Users API
curl https://api-gateway.vercel.app/api/users

# Test Products API
curl https://api-gateway.vercel.app/api/products
```

## 🔧 Alternative: Single Repository Deployment

If you prefer to deploy everything from one repository:

### Option 1: Deploy API Gateway Only
- Deploy only the `gateway` directory
- Use external services for User and Product services
- Update environment variables to point to external services

### Option 2: Monorepo Deployment
- Use Vercel's monorepo support
- Configure multiple projects from one repository
- Each service gets its own deployment

## 📝 Environment Variables Reference

### API Gateway
```
USER_SERVICE_URL=https://user-service.vercel.app
PRODUCT_SERVICE_URL=https://product-service.vercel.app
NODE_ENV=production
```

### User Service
```
NODE_ENV=production
PORT=3001
```

### Product Service
```
NODE_ENV=production
PORT=3002
```

## 🚨 Important Notes

### Vercel Limitations
- **Serverless Functions**: Each service runs as a serverless function
- **Cold Starts**: First request might be slower due to cold starts
- **Timeout**: Functions have a 30-second timeout (configurable)
- **Memory**: Limited memory per function

### Best Practices
1. **Environment Variables**: Store all sensitive data in Vercel environment variables
2. **CORS**: Ensure CORS is properly configured for cross-origin requests
3. **Error Handling**: Implement proper error handling for serverless environment
4. **Logging**: Use Vercel's logging features for debugging

## 🔍 Troubleshooting

### Common Issues

1. **Service Not Found**
   - Check environment variables
   - Verify service URLs are correct
   - Ensure all services are deployed

2. **CORS Errors**
   - Update CORS configuration in gateway
   - Check Vercel domain settings

3. **Timeout Errors**
   - Increase function timeout in vercel.json
   - Optimize service response times

4. **Build Failures**
   - Check package.json dependencies
   - Verify build commands
   - Check Vercel build logs

### Debug Commands
```bash
# Check Vercel CLI (if installed)
vercel --version

# Deploy with Vercel CLI
vercel --prod

# Check logs
vercel logs
```

## 🎉 Success!

Once deployed, you'll have:
- **API Gateway**: `https://api-gateway.vercel.app`
- **User Service**: `https://user-service.vercel.app`
- **Product Service**: `https://product-service.vercel.app`

Your distributed microservices architecture is now live on Vercel! 🚀
