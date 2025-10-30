#!/bin/bash

# Railway Deployment Script for Dutch Cheese Shop
# This script helps you deploy your application to Railway

echo "🚀 Dutch Cheese Shop - Railway Deployment"
echo "=========================================="
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI is not installed."
    echo "Installing Railway CLI..."
    npm install -g @railway/cli
    echo "✅ Railway CLI installed!"
    echo ""
fi

# Login to Railway
echo "🔐 Logging in to Railway..."
railway login
echo ""

# Initialize project
echo "📦 Initializing Railway project..."
railway init
echo ""

# Set environment variables
echo "⚙️  Setting environment variables..."
railway variables set WORLDPAY_API_URL=https://try.access.worldpay.com/payment_pages
railway variables set WORLDPAY_MERCHANT_ENTITY=default
railway variables set WORLDPAY_USERNAME=70XVdjjWOsSd5XMp
railway variables set WORLDPAY_PASSWORD=NH0LtDvz8wBgJZCIBy1nBuXxmC5XprGfV9q5TwCugm1BpqRkkOV4z1bo0hLcntYu
railway variables set SESSION_SECRET=dutch-cheese-production-secret-2025
railway variables set NODE_ENV=production
railway variables set PORT=3000
echo "✅ Environment variables set!"
echo ""

# Deploy
echo "🚀 Deploying to Railway..."
railway up
echo ""

# Get domain
echo "🌐 Getting your deployment URL..."
railway domain
echo ""

echo "=========================================="
echo "✅ Deployment initiated!"
echo ""
echo "Next steps:"
echo "1. Get your Railway URL from above"
echo "2. Update the BASE_URL and other URL variables:"
echo "   railway variables set BASE_URL=https://your-url.railway.app"
echo "   railway variables set SUCCESS_URL=https://your-url.railway.app/order-confirmation"
echo "   railway variables set CANCEL_URL=https://your-url.railway.app/checkout"
echo "   railway variables set ERROR_URL=https://your-url.railway.app/checkout?error=payment"
echo "   railway variables set FAILURE_URL=https://your-url.railway.app/checkout?error=payment"
echo "3. Run: railway up (to redeploy with new URLs)"
echo "4. Update Worldpay Dashboard with your new URLs"
echo ""
echo "View logs: railway logs"
echo "Open app: railway open"
echo ""
