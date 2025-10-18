# Vercel Deployment Guide

This guide will help you deploy the **Everyone Is Your MOM** application to Vercel.

## 📋 Prerequisites

1. A [Vercel account](https://vercel.com/signup)
2. Your repository pushed to GitHub, GitLab, or Bitbucket
3. All required API keys (ElevenLabs, Convex, Gemini, etc.)

## 🚀 Deployment Options

This project has two parts:
- **Frontend**: React + Vite application
- **Backend**: Express.js API server

### Option 1: Deploy Frontend Only (Recommended to Start)

Deploy the frontend to Vercel and keep the backend on another platform (Railway, Render, Fly.io, etc.)

### Option 2: Full Deployment with Serverless Functions

Convert the backend to Vercel Serverless Functions (requires more setup)

---

## 📦 Option 1: Deploy Frontend to Vercel

### Step 1: Deploy via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Import your GitHub/GitLab/Bitbucket repository
4. Vercel will auto-detect it as a Vite project

### Step 2: Configure Project Settings

In the Vercel project configuration:

**Build & Development Settings:**
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 3: Set Environment Variables

Add the following environment variables in Vercel Dashboard → Settings → Environment Variables:

```
VITE_ELEVENLABS_AGENT_ID=agent_7101k7v2614becv82e9npajj02f7
VITE_API_URL=https://your-backend-url.com/api
VITE_CONVEX_URL=https://giddy-cassowary-400.convex.cloud
```

**Important:** Replace `your-backend-url.com` with your actual backend URL.

### Step 4: Deploy

Click **"Deploy"** and wait for the build to complete.

---

## 🔧 Deploy Backend Separately

Your backend needs to be deployed separately. Here are recommended options:

### Railway (Recommended)

1. Go to [Railway](https://railway.app/)
2. Create a new project
3. Connect your repository
4. Set root directory to `backend`
5. Add environment variables from `backend/env.example`
6. Deploy

### Render

1. Go to [Render](https://render.com/)
2. Create new Web Service
3. Connect repository
4. Set root directory to `backend`
5. Build Command: `npm install`
6. Start Command: `npm start`
7. Add environment variables
8. Deploy

### Fly.io

```bash
cd backend
fly launch
fly secrets set CONVEX_URL=your_convex_url
fly secrets set GEMINI_API_KEY=your_key
# ... add all other env vars
fly deploy
```

---

## 🌐 Option 2: Full Vercel Deployment (Advanced)

To deploy both frontend and backend on Vercel, you'll need to convert your backend to serverless functions.

### Backend Structure for Vercel

Create an `api` folder in the root with serverless functions:

```
/api
  /auth.js
  /food.js
  /exchange.js
  /cleaning.js
  /voice.js
```

Each file exports a handler:

```javascript
// api/food.js
export default async function handler(req, res) {
  // Your Express route logic here
  if (req.method === 'GET') {
    // Handle GET
  }
  // ...
}
```

### Update vercel.json

```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## ✅ Post-Deployment Checklist

### 1. Update CORS Settings

If your backend is on a different domain, update `backend/src/middleware/cors.js`:

```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'https://your-vercel-app.vercel.app',
  'https://your-custom-domain.com'
];
```

### 2. Update API URL

Make sure your frontend's `VITE_API_URL` points to your deployed backend:

```
VITE_API_URL=https://your-backend-url.com/api
```

### 3. Configure Custom Domain (Optional)

In Vercel Dashboard:
1. Go to Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### 4. Enable HTTPS

Vercel automatically provides HTTPS. Ensure your backend also uses HTTPS.

### 5. Test All Features

- ✅ User authentication
- ✅ Food browsing and search
- ✅ Exchange items
- ✅ Cleaning slots
- ✅ Voice assistant
- ✅ Image upload
- ✅ Memory/personalization

---

## 🔍 Troubleshooting

### Build Fails

**Error: Cannot find module**
- Solution: Make sure all dependencies are in `package.json` (not just `devDependencies`)

**Environment variables not working**
- Solution: Variables must start with `VITE_` for Vite to include them
- Solution: Rebuild after adding new env vars

### CORS Errors

**Error: CORS policy blocked**
- Solution: Add your Vercel domain to backend's `ALLOWED_ORIGINS`
- Solution: Check backend CORS middleware configuration

### API Routes 404

**Frontend can't reach backend**
- Solution: Verify `VITE_API_URL` is correct
- Solution: Check backend is deployed and running
- Solution: Test backend URL directly in browser

### Blank Page After Deploy

**White screen / blank page**
- Solution: Check browser console for errors
- Solution: Verify `index.html` exists in `dist` folder
- Solution: Check build logs for errors

---

## 📊 Monitoring & Performance

### Enable Analytics

1. Go to Vercel Dashboard → Analytics
2. Enable Web Analytics
3. Monitor page views, performance, and errors

### Enable Speed Insights

1. Go to Vercel Dashboard → Speed Insights
2. Install `@vercel/analytics` package
3. Add to your app:

```javascript
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <>
      <YourApp />
      <Analytics />
    </>
  );
}
```

---

## 🔐 Security Best Practices

1. **Never commit `.env` files** - Already in `.gitignore`
2. **Rotate API keys** regularly
3. **Use environment variables** for all secrets
4. **Enable Vercel Password Protection** for staging deployments
5. **Set up proper CORS** restrictions

---

## 🚀 Deployment Commands

### Manual Deploy via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Automatic Deploys

Vercel automatically deploys:
- **Every push to main branch** → Production
- **Every push to other branches** → Preview

---

## 📝 Quick Reference

### Frontend URLs
- **Development**: http://localhost:5173
- **Production**: https://your-app.vercel.app

### Backend URLs
- **Development**: http://localhost:3001
- **Production**: https://your-backend.com

### Important Files
- `vercel.json` - Vercel configuration
- `.vercelignore` - Files to ignore during deployment
- `package.json` - Dependencies and scripts
- `vite.config.js` - Vite configuration

---

## 🆘 Need Help?

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#vercel)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

---

## 🎉 You're All Set!

Your application should now be live on Vercel. Share your URL and enjoy your AI Mom assistant! 🤖👩‍👧

**Frontend URL**: https://your-app.vercel.app

