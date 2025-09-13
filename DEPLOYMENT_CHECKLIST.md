# 🚀 Deployment Checklist

## Pre-Deployment Setup

### ✅ GitHub Repository
- [ ] Initialize git repository: `git init`
- [ ] Add all files: `git add .`
- [ ] Create initial commit: `git commit -m "Initial commit"`
- [ ] Create GitHub repository
- [ ] Add remote origin: `git remote add origin <your-repo-url>`
- [ ] Push to GitHub: `git push -u origin main`

### ✅ Vercel Account Setup
- [ ] Create Vercel account at [vercel.com](https://vercel.com)
- [ ] Connect GitHub account to Vercel
- [ ] Install Vercel CLI: `npm install -g vercel`
- [ ] Login to Vercel: `vercel login`

## 🎯 Deployment Steps

### Step 1: Deploy User Service
- [ ] Go to Vercel Dashboard
- [ ] Click "New Project"
- [ ] Import your GitHub repository
- [ ] Configure:
  - **Project Name**: `user-service`
  - **Root Directory**: `user-service`
  - **Framework**: Other
  - **Build Command**: `npm install`
  - **Output Directory**: (leave empty)
- [ ] Add Environment Variables:
  ```
  NODE_ENV=production
  PORT=3001
  ```
- [ ] Deploy
- [ ] Note the deployment URL: `https://user-service.vercel.app`

### Step 2: Deploy Product Service
- [ ] Create new Vercel project
- [ ] Import same GitHub repository
- [ ] Configure:
  - **Project Name**: `product-service`
  - **Root Directory**: `product-service`
  - **Framework**: Other
  - **Build Command**: `npm install`
  - **Output Directory**: (leave empty)
- [ ] Add Environment Variables:
  ```
  NODE_ENV=production
  PORT=3002
  ```
- [ ] Deploy
- [ ] Note the deployment URL: `https://product-service.vercel.app`

### Step 3: Deploy API Gateway
- [ ] Create new Vercel project
- [ ] Import same GitHub repository
- [ ] Configure:
  - **Project Name**: `api-gateway`
  - **Root Directory**: `gateway`
  - **Framework**: Other
  - **Build Command**: `npm install`
  - **Output Directory**: (leave empty)
- [ ] Add Environment Variables:
  ```
  USER_SERVICE_URL=https://user-service.vercel.app
  PRODUCT_SERVICE_URL=https://product-service.vercel.app
  NODE_ENV=production
  ```
- [ ] Deploy
- [ ] Note the deployment URL: `https://api-gateway.vercel.app`

## 🧪 Testing Deployment

### Test Individual Services
- [ ] Test User Service: `curl https://user-service.vercel.app/health`
- [ ] Test Product Service: `curl https://product-service.vercel.app/health`

### Test API Gateway
- [ ] Test Gateway Health: `curl https://api-gateway.vercel.app/health`
- [ ] Test Users API: `curl https://api-gateway.vercel.app/api/users`
- [ ] Test Products API: `curl https://api-gateway.vercel.app/api/products`

### Test Full Workflow
- [ ] Create a user: `curl -X POST https://api-gateway.vercel.app/api/users -H "Content-Type: application/json" -d '{"name":"Test User","email":"test@example.com"}'`
- [ ] Create a product: `curl -X POST https://api-gateway.vercel.app/api/products -H "Content-Type: application/json" -d '{"name":"Test Product","price":99.99,"category":"Test"}'`
- [ ] Verify data retrieval

## 🔧 Alternative: CLI Deployment

### Using Vercel CLI
```bash
# Deploy all services
npm run deploy

# Or deploy individually
npm run deploy:gateway
npm run deploy:user
npm run deploy:product
```

### Manual CLI Deployment
```bash
# Deploy API Gateway
cd gateway
vercel --prod
cd ..

# Deploy User Service
cd user-service
vercel --prod
cd ..

# Deploy Product Service
cd product-service
vercel --prod
cd ..
```

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
- **Cold Starts**: First request might be slower
- **Timeout**: 30-second function timeout (configurable)
- **Memory**: Limited memory per function

### Best Practices
- [ ] Use environment variables for all configuration
- [ ] Test thoroughly before production deployment
- [ ] Monitor Vercel function logs
- [ ] Set up proper CORS configuration
- [ ] Implement proper error handling

## 🔍 Troubleshooting

### Common Issues
- [ ] **Service Not Found**: Check environment variables and URLs
- [ ] **CORS Errors**: Update CORS configuration
- [ ] **Timeout Errors**: Increase function timeout
- [ ] **Build Failures**: Check dependencies and build commands

### Debug Commands
```bash
# Check Vercel CLI
vercel --version

# Check deployment status
vercel ls

# View logs
vercel logs
```

## 🎉 Success Criteria

Your deployment is successful when:
- [ ] All three services are deployed and accessible
- [ ] API Gateway can communicate with both microservices
- [ ] Health checks return 200 status
- [ ] CRUD operations work through the API Gateway
- [ ] CORS is properly configured
- [ ] Environment variables are set correctly

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test individual services
4. Check CORS configuration
5. Review Vercel documentation

Your distributed microservices architecture is now live! 🚀
