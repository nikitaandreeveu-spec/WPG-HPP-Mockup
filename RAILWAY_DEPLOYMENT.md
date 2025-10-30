# Railway Deployment Guide for Dutch Cheese Shop

## Prerequisites
- Railway account (sign up at https://railway.app)
- Railway CLI installed

## Step-by-Step Deployment

### 1. Install Railway CLI

```bash
npm install -g @railway/cli
```

### 2. Login to Railway

```bash
railway login
```

This will open a browser window to authenticate.

### 3. Initialize Railway Project

```bash
cd "/Users/niki/hpp mockup access"
railway init
```

Follow the prompts:
- Create a new project or select existing
- Name your project (e.g., "dutch-cheese-shop")

### 4. Set Environment Variables

Run these commands to set all required environment variables:

```bash
railway variables set WORLDPAY_API_URL=https://try.access.worldpay.com/payment_pages
railway variables set WORLDPAY_MERCHANT_ENTITY=default
railway variables set WORLDPAY_USERNAME=70XVdjjWOsSd5XMp
railway variables set WORLDPAY_PASSWORD=NH0LtDvz8wBgJZCIBy1nBuXxmC5XprGfV9q5TwCugm1BpqRkkOV4z1bo0hLcntYu
railway variables set SESSION_SECRET=dutch-cheese-production-secret-2025
railway variables set NODE_ENV=production
railway variables set PORT=3000
```

### 5. Deploy to Railway

```bash
railway up
```

This will:
- Upload your code to Railway
- Install dependencies
- Start your application
- Provide you with a public URL

### 6. Get Your Deployment URL

```bash
railway domain
```

Or visit your Railway dashboard at https://railway.app/dashboard

Your app will be available at something like: `https://dutch-cheese-shop-production.up.railway.app`

### 7. Update Environment Variables with Production URLs

Once you have your deployment URL, update these variables:

```bash
# Replace YOUR_RAILWAY_URL with your actual Railway URL
railway variables set BASE_URL=https://YOUR_RAILWAY_URL
railway variables set SUCCESS_URL=https://YOUR_RAILWAY_URL/order-confirmation
railway variables set CANCEL_URL=https://YOUR_RAILWAY_URL/checkout
railway variables set ERROR_URL=https://YOUR_RAILWAY_URL/checkout?error=payment
railway variables set FAILURE_URL=https://YOUR_RAILWAY_URL/checkout?error=payment
```

### 8. Redeploy with Updated URLs

```bash
railway up
```

## Alternative: Deploy via GitHub

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/dutch-cheese-shop.git
   git push -u origin main
   ```

2. **Connect Railway to GitHub:**
   - Go to https://railway.app/dashboard
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Railway will auto-deploy

3. **Set Environment Variables in Railway Dashboard:**
   - Go to your project
   - Click "Variables" tab
   - Add all the environment variables listed above

## Post-Deployment

### Update Worldpay Dashboard
1. Login to https://dashboard.worldpay.com/
2. Update your callback URLs to your new Railway domain
3. Update success/failure URLs

### Test Your Deployment
1. Visit your Railway URL
2. Add items to cart
3. Complete checkout
4. Test payment with Worldpay test cards

## Useful Railway Commands

```bash
# View logs
railway logs

# Open your app in browser
railway open

# View current variables
railway variables

# Link to existing project
railway link

# Check service status
railway status
```

## Troubleshooting

### If deployment fails:
```bash
railway logs
```

### If session issues occur:
- Make sure SESSION_SECRET is set
- Verify NODE_ENV=production
- Check that trust proxy is enabled in server.js

### If Worldpay errors occur:
- Verify all WORLDPAY_* environment variables are set
- Check that URLs are updated to your Railway domain
- Test with Worldpay test environment first

## Monitoring

View your application in Railway dashboard:
- Real-time logs
- Metrics (CPU, Memory, Network)
- Deployment history
- Environment variables

## Cost

Railway provides:
- $5 free credit per month
- Pay-as-you-go after that
- Typically $5-10/month for small apps like this

## Need Help?

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Worldpay Developer: https://developer.worldpay.com
