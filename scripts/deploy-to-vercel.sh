#!/bin/bash

echo "🚀 Deploying to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Installing..."
    npm install -g vercel
fi

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "❌ Not logged in to Vercel. Please login first:"
    echo "   vercel login"
    exit 1
fi

echo "✅ Vercel CLI is ready"

# Deploy API Gateway
echo "📡 Deploying API Gateway..."
cd gateway
vercel --prod
cd ..

# Deploy User Service
echo "📡 Deploying User Service..."
cd user-service
vercel --prod
cd ..

# Deploy Product Service
echo "📡 Deploying Product Service..."
cd product-service
vercel --prod
cd ..

echo "🎉 All services deployed to Vercel!"
echo ""
echo "💡 Don't forget to:"
echo "   1. Update environment variables in Vercel dashboard"
echo "   2. Update service URLs in API Gateway"
echo "   3. Test your deployed services"
