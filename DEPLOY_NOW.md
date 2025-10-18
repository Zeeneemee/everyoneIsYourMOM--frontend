# 🚀 Deploy to Vercel NOW - Quick Start

Follow these simple steps to deploy your app in under 5 minutes!

## Step 1: Push to GitHub (if not already done)

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

## Step 2: Deploy to Vercel

### Option A: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Zeeneemee/everyoneIsYourMOM--frontend)

### Option B: Import from Dashboard

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your repository
4. Click "Import"

## Step 3: Configure During Import

Vercel will detect your Vite project automatically. Just click "Deploy"!

## Step 4: Add Environment Variables (After First Deploy)

1. Go to your project in Vercel Dashboard
2. Click "Settings" → "Environment Variables"
3. Add these variables:

```
VITE_ELEVENLABS_AGENT_ID = agent_7101k7v2614becv82e9npajj02f7
VITE_API_URL = https://your-backend-url.com/api
VITE_CONVEX_URL = https://giddy-cassowary-400.convex.cloud
```

4. Click "Save"
5. Go to "Deployments" → Click "..." → "Redeploy"

## Step 5: Deploy Backend Separately

Your backend needs to run separately. Quick options:

### Railway (Easiest)
1. Go to https://railway.app/
2. Click "Start a New Project" → "Deploy from GitHub repo"
3. Select your repo
4. Set **Root Directory**: `backend`
5. Add all environment variables from `backend/env.example`
6. Copy your Railway URL
7. Update `VITE_API_URL` in Vercel to: `https://your-railway-url/api`

### Render (Free Tier Available)
1. Go to https://render.com/
2. Click "New +" → "Web Service"
3. Connect your repo
4. Set **Root Directory**: `backend`
5. Set **Build Command**: `npm install`
6. Set **Start Command**: `npm start`
7. Add environment variables
8. Copy your Render URL
9. Update `VITE_API_URL` in Vercel

## Step 6: Update CORS in Backend

Once deployed, update your backend's CORS settings:

In `backend/server.js` or `backend/src/middleware/cors.js`, add your Vercel URL:

```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'https://your-app.vercel.app',  // Add this
  'https://your-custom-domain.com'  // Add custom domain if you have one
];
```

Commit and push this change to redeploy your backend.

## ✅ That's It!

Your app is now live! 🎉

- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-backend.railway.app or https://your-backend.render.com

## 🧪 Test Your Deployment

1. Open your Vercel URL
2. Try logging in
3. Browse food items
4. Test the voice assistant
5. Check exchange and cleaning features

## 🐛 Common Issues

### "API not reachable"
→ Check `VITE_API_URL` is correct in Vercel environment variables

### "CORS Error"
→ Add your Vercel URL to backend's allowed origins

### "Blank page"
→ Check browser console for errors
→ Verify all environment variables are set

## 📚 For More Details

See the full [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md) for advanced configuration, troubleshooting, and monitoring.

---

**Need help?** Check the troubleshooting section in the full guide or open an issue on GitHub.

