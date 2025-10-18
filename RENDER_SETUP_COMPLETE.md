# ✅ Render Setup Complete!

Your backend is now ready to deploy to Render instead of using ngrok.

## 📁 Files Created

1. **`backend/render.yaml`** - Render configuration file
2. **`RENDER_DEPLOYMENT_GUIDE.md`** - Comprehensive deployment guide
3. **`RENDER_QUICK_START.md`** - 5-minute quick start guide
4. **`env.template`** - Updated with production examples

## 🚀 Quick Deploy (3 Steps)

### 1. Push to Git

```bash
git add backend/render.yaml RENDER_DEPLOYMENT_GUIDE.md RENDER_QUICK_START.md env.template
git commit -m "Add Render deployment configuration"
git push
```

### 2. Deploy on Render

1. Go to https://dashboard.render.com/
2. Click **"New +"** → **"Blueprint"**
3. Connect your Git repository
4. Render will auto-detect `backend/render.yaml`
5. Click **"Apply"**

### 3. Add Environment Variables

In Render Dashboard, add these environment variables:

**Required:**
```
CONVEX_URL=https://giddy-cassowary-400.convex.cloud
GEMINI_API_KEY=[your-gemini-api-key]
ELEVENLABS_API_KEY=[your-elevenlabs-api-key]
ELEVENLABS_VOICE_ID=[your-voice-id]
ELEVENLABS_AGENT_ID=agent_7101k7v2614becv82e9npajj02f7
ALLOWED_ORIGINS=http://localhost:5173
```

**Optional:**
```
MEM0_API_KEY=[your-mem0-api-key]
OPENAI_API_KEY=[your-openai-api-key]
```

## 🔧 Update Frontend

After deployment, update your `.env` file:

```env
# Replace with your actual Render URL
VITE_API_URL=https://your-backend-name.onrender.com/api
VITE_BACKEND_URL=https://your-backend-name.onrender.com

VITE_ELEVENLABS_AGENT_ID=agent_7101k7v2614becv82e9npajj02f7
VITE_CONVEX_URL=https://giddy-cassowary-400.convex.cloud
```

## ✨ Benefits Over ngrok

| Feature | ngrok | Render |
|---------|-------|--------|
| **URL** | Changes every restart | Permanent URL |
| **Uptime** | Manual process | Auto-restart on crash |
| **Deploy** | Manual | Auto-deploy on git push |
| **HTTPS** | ✅ | ✅ |
| **Free Tier** | Limited | 750 hours/month |
| **Production Ready** | ❌ | ✅ |

## ⚠️ Free Tier Limitation

**Cold starts**: Free tier sleeps after 15 minutes of inactivity.

**Impact**: First request after idle takes 30-50 seconds to wake up.

**Solutions**:
1. **Paid tier**: $7/month for always-on service
2. **Keep-alive service**: Use [UptimeRobot](https://uptimerobot.com/) to ping every 10 minutes
3. **Accept delay**: Fine for development/demos

## 📊 Environment Variable Reference

### Backend (Render Dashboard)

```env
NODE_ENV=production
PORT=10000
CONVEX_URL=your-convex-url
GEMINI_API_KEY=your-gemini-key
GEMINI_MODEL=gemini-2.0-flash-exp
ELEVENLABS_API_KEY=your-elevenlabs-key
ELEVENLABS_VOICE_ID=your-voice-id
ELEVENLABS_AGENT_ID=your-agent-id
ALLOWED_ORIGINS=your-frontend-urls
AI_AGENT_TEMPERATURE=0.7
AI_AGENT_MAX_TOKENS=500
MEM0_API_KEY=your-mem0-key
MEM0_USER_ID_PREFIX=mom_user_
```

### Frontend (.env file)

```env
VITE_API_URL=https://your-backend-name.onrender.com/api
VITE_BACKEND_URL=https://your-backend-name.onrender.com
VITE_ELEVENLABS_AGENT_ID=your-agent-id
VITE_CONVEX_URL=your-convex-url
```

## 🧪 Testing

### Test Backend Health

```bash
curl https://your-backend-name.onrender.com/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "API is healthy"
}
```

### Test Frontend Connection

1. Update your `.env` with Render URL
2. Restart dev server: `npm run dev`
3. Test features that call the backend

## 🔄 Auto-Deploy

Render automatically deploys when you push to Git:

```bash
git add .
git commit -m "Update backend"
git push
```

Render will:
- Detect the push
- Build your app
- Deploy with zero downtime
- Show live deployment logs

## 📖 Documentation

- **Quick Start**: See [RENDER_QUICK_START.md](./RENDER_QUICK_START.md)
- **Full Guide**: See [RENDER_DEPLOYMENT_GUIDE.md](./RENDER_DEPLOYMENT_GUIDE.md)
- **Render Docs**: https://render.com/docs

## 🆘 Troubleshooting

### CORS Errors
**Problem**: Frontend can't connect to backend

**Solution**: 
```bash
# In Render Dashboard, update ALLOWED_ORIGINS:
ALLOWED_ORIGINS=https://your-frontend.vercel.app,http://localhost:5173
```

### Service Won't Start
**Problem**: Deployment fails

**Solution**:
1. Check logs in Render Dashboard
2. Verify all required environment variables are set
3. Check for any build errors

### Cold Start Issues
**Problem**: First request is very slow

**Solution**:
- This is normal for free tier
- Upgrade to paid tier ($7/month) or use keep-alive service

## 🎯 Next Steps

1. ✅ Deploy backend to Render
2. ✅ Update frontend environment variables
3. ✅ Test the connection
4. 🚀 Deploy frontend to Vercel/Netlify
5. 📊 Set up monitoring
6. 💰 Consider upgrading to paid tier for production

## 💡 Pro Tips

1. **Keep local development**: Use `http://localhost:3001` for local dev
2. **Use .env files**: Keep separate configs for local/production
3. **Monitor logs**: Check Render dashboard regularly
4. **Set up alerts**: Use UptimeRobot for uptime monitoring
5. **Git workflow**: Push to Git → Auto-deploy to Render

## 🎉 Success!

Your backend is now ready for production deployment on Render!

No more manually starting ngrok or dealing with changing URLs. Just push to Git and deploy! 🚀

---

**Need help?** Check the troubleshooting section or Render's documentation.

