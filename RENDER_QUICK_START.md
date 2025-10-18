# 🚀 Render Quick Start Guide

Deploy your backend to Render in 5 minutes!

## Step 1: Push to Git

Make sure your code is pushed to GitHub/GitLab/Bitbucket:

```bash
cd /Users/tt/Documents/Coding/everyoneIsYourMOM--frontend
git add backend/render.yaml
git commit -m "Add Render configuration"
git push
```

## Step 2: Deploy to Render

### Option A: Blueprint (Automatic - Recommended)

1. Go to https://dashboard.render.com/
2. Click **"New +"** → **"Blueprint"**
3. Connect your Git repository
4. Render will detect `backend/render.yaml` and set everything up automatically
5. Click **"Apply"**

### Option B: Manual Web Service

1. Go to https://dashboard.render.com/
2. Click **"New +"** → **"Web Service"**
3. Connect your Git repository
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

## Step 3: Add Environment Variables

In Render Dashboard → Your Service → Environment:

```env
# Required
CONVEX_URL=https://giddy-cassowary-400.convex.cloud
GEMINI_API_KEY=your_gemini_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
ELEVENLABS_VOICE_ID=your_voice_id
ELEVENLABS_AGENT_ID=agent_7101k7v2614becv82e9npajj02f7
ALLOWED_ORIGINS=http://localhost:5173

# Optional
MEM0_API_KEY=your_mem0_api_key
OPENAI_API_KEY=your_openai_api_key
```

## Step 4: Update Frontend

Copy your Render URL (e.g., `https://everyoneisyourmom-backend.onrender.com`)

Update your local `.env` file:

```env
VITE_API_URL=https://your-backend-name.onrender.com/api
VITE_BACKEND_URL=https://your-backend-name.onrender.com
```

## Step 5: Test

```bash
# Test the backend
curl https://your-backend-name.onrender.com/api/health

# Restart your frontend
npm run dev
```

## ⚠️ Important: Free Tier Notes

**Cold starts**: Free tier sleeps after 15 minutes of inactivity. First request takes 30-50 seconds to wake up.

**Solutions**:
1. Upgrade to $7/month paid tier (always-on)
2. Use [UptimeRobot](https://uptimerobot.com/) to ping every 10 minutes
3. Accept the initial delay

## Update CORS

When deploying frontend to Vercel/Netlify, update `ALLOWED_ORIGINS` in Render:

```
ALLOWED_ORIGINS=https://your-app.vercel.app,http://localhost:5173
```

## Auto-Deploy

Push to Git and Render automatically deploys:

```bash
git add .
git commit -m "Update"
git push
```

## Troubleshooting

### CORS Errors
- Add your frontend URL to `ALLOWED_ORIGINS` environment variable
- Format: `https://domain.com` (no trailing slash)

### Service Won't Start
- Check logs in Render Dashboard
- Verify all required environment variables are set

### Cold Start Slow
- Normal for free tier
- Upgrade to paid tier or use keep-alive service

## Next Steps

- Deploy frontend to [Vercel](https://vercel.com) or [Netlify](https://netlify.com)
- Set up monitoring with [UptimeRobot](https://uptimerobot.com/)
- Consider upgrading to paid tier for production use

## Resources

- [Full Deployment Guide](./RENDER_DEPLOYMENT_GUIDE.md)
- [Render Docs](https://render.com/docs)
- [Backend README](./backend/README.md)

---

**Your backend will be live at**: `https://your-backend-name.onrender.com` 🎉

