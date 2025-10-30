# 🚀 Quick Start: Deploy to Railway

## You're Ready to Deploy! 

Your Dutch Cheese Shop is now production-ready with:
- ✅ Worldpay HPP integration
- ✅ Production session handling
- ✅ HTTPS support
- ✅ Environment variable configuration

## 🎯 Deploy Now (Choose One Method)

### Method 1: Automated Script (Easiest)

```bash
# Make script executable
chmod +x "/Users/niki/hpp mockup access/deploy-railway.sh"

# Run deployment
"/Users/niki/hpp mockup access/deploy-railway.sh"
```

### Method 2: Manual Steps

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Initialize project
cd "/Users/niki/hpp mockup access"
railway init

# 4. Set environment variables
railway variables set WORLDPAY_API_URL=https://try.access.worldpay.com/payment_pages
railway variables set WORLDPAY_MERCHANT_ENTITY=default
railway variables set WORLDPAY_USERNAME=70XVdjjWOsSd5XMp
railway variables set WORLDPAY_PASSWORD=NH0LtDvz8wBgJZCIBy1nBuXxmC5XprGfV9q5TwCugm1BpqRkkOV4z1bo0hLcntYu
railway variables set SESSION_SECRET=dutch-cheese-production-secret-2025
railway variables set NODE_ENV=production

# 5. Deploy!
railway up

# 6. Get your URL
railway domain
```

### Method 3: Deploy via GitHub

```bash
# 1. Create GitHub repository at github.com

# 2. Push your code
git init
git add .
git commit -m "Deploy Dutch Cheese Shop"
git remote add origin https://github.com/YOUR_USERNAME/dutch-cheese-shop.git
git push -u origin main

# 3. Go to railway.app/dashboard
# 4. Click "New Project" → "Deploy from GitHub"
# 5. Select your repository
# 6. Add environment variables in Railway dashboard
```

## 📝 After Deployment

Once deployed, you'll get a URL like: `https://your-app.up.railway.app`

**Update these environment variables with your Railway URL:**

```bash
railway variables set BASE_URL=https://your-app.up.railway.app
railway variables set SUCCESS_URL=https://your-app.up.railway.app/order-confirmation
railway variables set CANCEL_URL=https://your-app.up.railway.app/checkout
railway variables set ERROR_URL=https://your-app.up.railway.app/checkout?error=payment
railway variables set FAILURE_URL=https://your-app.up.railway.app/checkout?error=payment

# Redeploy
railway up
```

## 🔧 Update Worldpay Dashboard

1. Login to https://dashboard.worldpay.com/
2. Go to Settings → Webhooks/Callbacks
3. Update URLs to your Railway domain
4. Update success/failure URLs

## 📊 Monitor Your App

```bash
# View real-time logs
railway logs

# Open your app in browser
railway open

# Check status
railway status

# View all variables
railway variables
```

## 💰 Cost

- Railway provides $5 free credit/month
- Typical usage: $5-10/month
- Only pay for what you use

## 🆘 Need Help?

1. **Detailed Guide**: See `RAILWAY_DEPLOYMENT.md`
2. **README**: See `README.md`
3. **Railway Docs**: https://docs.railway.app
4. **Railway Support**: https://discord.gg/railway

## ✅ You're All Set!

Your application is ready for production deployment. Just run the deployment command and follow the post-deployment steps above.

Happy deploying! 🧀🚀
