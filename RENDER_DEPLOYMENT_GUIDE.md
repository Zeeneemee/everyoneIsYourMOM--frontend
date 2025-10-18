# Render Deployment Guide

This guide will help you deploy your backend to Render instead of using ngrok.

## Prerequisites

1. A [Render account](https://render.com/) (free tier available)
2. Your backend code pushed to a Git repository (GitHub, GitLab, or Bitbucket)
3. All your API keys ready (Convex, Gemini, ElevenLabs, Mem0)

## Deployment Steps

### Option 1: Using render.yaml (Recommended)

1. **Push your code to Git**
   ```bash
   git add backend/render.yaml
   git commit -m "Add Render configuration"
   git push
   ```

2. **Create a new Web Service on Render**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Blueprint"
   - Connect your Git repository
   - Render will automatically detect the `render.yaml` file

3. **Configure Environment Variables**
   
   In the Render dashboard, add these environment variables to your service:

   **Required:**
   - `CONVEX_URL`: Your Convex project URL (from https://dashboard.convex.dev/)
   - `GEMINI_API_KEY`: Your Google Gemini API key
   - `ELEVENLABS_API_KEY`: Your ElevenLabs API key
   - `ELEVENLABS_VOICE_ID`: Your ElevenLabs voice ID
   - `ELEVENLABS_AGENT_ID`: Your ElevenLabs agent ID
   - `ALLOWED_ORIGINS`: Your frontend URL (e.g., `https://your-app.vercel.app,http://localhost:5173`)

   **Optional:**
   - `OPENAI_API_KEY`: Only if using Whisper STT
   - `MEM0_API_KEY`: Your Mem0 API key

4. **Deploy**
   - Click "Apply" and wait for the deployment to complete
   - Your backend will be available at: `https://your-app-name.onrender.com`

### Option 2: Manual Setup

1. **Create a new Web Service**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Web Service"
   - Connect your Git repository
   - Select the `backend` directory as the root directory

2. **Configure Build Settings**
   - **Name**: `everyoneisyourmom-backend` (or your preferred name)
   - **Region**: Choose closest to your users (e.g., Oregon)
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

3. **Set Environment Variables** (same as Option 1)

4. **Deploy**

## Update Your Frontend

After deployment, update your frontend environment variables:

### Local Development (`.env`)

```env
# Use your Render URL for the backend
VITE_API_URL=https://your-backend-name.onrender.com/api
VITE_BACKEND_URL=https://your-backend-name.onrender.com
```

### Production (Vercel/Netlify)

Add the environment variables in your hosting platform's dashboard:

- `VITE_API_URL`: `https://your-backend-name.onrender.com/api`
- `VITE_BACKEND_URL`: `https://your-backend-name.onrender.com`

## Important Notes

### Free Tier Limitations

- **Spin down on idle**: Free tier services spin down after 15 minutes of inactivity
- **First request after idle**: Takes 30-50 seconds to wake up
- **Uptime**: Not guaranteed on free tier

**Solutions:**
1. Upgrade to paid tier ($7/month) for always-on service
2. Use a service like [UptimeRobot](https://uptimerobot.com/) to ping your backend every 10 minutes
3. Inform users about potential initial delay

### CORS Configuration

Make sure to update `ALLOWED_ORIGINS` to include your frontend URL:

```
ALLOWED_ORIGINS=https://your-frontend.vercel.app,http://localhost:5173
```

### Health Check

Render will use `/api/health` endpoint to check if your service is running. Make sure this endpoint works correctly.

### Logs

View logs in real-time:
- Go to your service in Render Dashboard
- Click on "Logs" tab

## Testing Your Deployment

1. **Check health endpoint**:
   ```bash
   curl https://your-backend-name.onrender.com/api/health
   ```

2. **Test from frontend**:
   - Update your `.env` file with the Render URL
   - Restart your development server
   - Try using features that call the backend

## Troubleshooting

### Service fails to start

- Check logs in Render Dashboard
- Verify all required environment variables are set
- Ensure your `package.json` has correct dependencies

### CORS errors

- Add your frontend domain to `ALLOWED_ORIGINS`
- Make sure the format is: `https://domain.com` (no trailing slash)

### Cold start issues

- First request after idle takes longer
- Consider upgrading to paid tier or using a keep-alive service

### Database connection issues

- Verify `CONVEX_URL` is correctly set
- Check Convex dashboard for any issues

## Monitoring

1. **Render Dashboard**: Monitor metrics, logs, and deployments
2. **Custom monitoring**: Set up external monitoring with:
   - UptimeRobot
   - Pingdom
   - Better Uptime

## Auto-Deploy

Render automatically deploys when you push to your connected branch:

```bash
git add .
git commit -m "Update backend"
git push
```

Render will automatically:
1. Detect the push
2. Build your app
3. Deploy the new version
4. Zero-downtime deployment

## Cost Considerations

### Free Tier
- ✅ Free
- ⚠️ Spins down after 15 minutes of inactivity
- ⚠️ 750 hours/month limit

### Paid Tier ($7/month)
- ✅ Always-on
- ✅ No spin down
- ✅ Better performance
- ✅ Custom domains

## Need Help?

- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com/)
- Check your logs in Render Dashboard

