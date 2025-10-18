# 🔧 Fix Render Deployment Error

## The Problem

Your deployment failed with: `Missing script: "build"`

This happens because Render is trying to run `npm run build`, but the backend doesn't need a build step.

## Quick Fix (2 Options)

### Option 1: Delete and Use Blueprint ✅ (Recommended)

1. **Delete the current service**:
   - Go to Render Dashboard
   - Find your service
   - Settings → Delete Service

2. **Create new service using Blueprint**:
   - Click **"New +"** → **"Blueprint"**
   - Connect your repository
   - Render will auto-detect `backend/render.yaml`
   - This sets the correct root directory and build command
   - Click **"Apply"**

3. **Add environment variables** (see below)

### Option 2: Fix Current Service

1. **Go to your service in Render Dashboard**

2. **Update Build & Deploy settings**:
   - **Root Directory**: `backend` ⚠️ IMPORTANT!
   - **Build Command**: `npm install` (remove `npm run build`)
   - **Start Command**: `npm start`

3. **Trigger Manual Deploy**:
   - Click "Manual Deploy" → "Clear build cache & deploy"

## Environment Variables (Required)

After deployment, add these in Dashboard → Environment:

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

## Push Updated Config

First, push the fixed `render.yaml`:

```bash
git add backend/render.yaml
git commit -m "Fix Render configuration - add rootDir"
git push
```

Then follow Option 1 or 2 above.

## Verify Settings

After deployment, your settings should be:

| Setting | Value |
|---------|-------|
| Root Directory | `backend` |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Node Version | 22.x (auto-detected) |

## Expected Logs (Success)

You should see:
```
==> Using Node.js version 22.16.0
==> Running build command 'npm install'...
==> Build succeeded 🎉
==> Starting service with 'npm start'...
🏠  Everyone Is Your Mom - Backend API
✅  Server running on http://0.0.0.0:10000
```

## Test After Deployment

```bash
# Replace with your actual Render URL
curl https://your-backend-name.onrender.com/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "API is healthy"
}
```

## Still Having Issues?

### Common Problems

**1. Wrong root directory**
- **Symptom**: Can't find package.json or build fails
- **Fix**: Set Root Directory to `backend`

**2. Missing environment variables**
- **Symptom**: Server crashes on start
- **Fix**: Add all required env vars in Dashboard

**3. Port issues**
- **Symptom**: Service shows "not responding"
- **Fix**: Render automatically sets PORT=10000, no changes needed

### Check Logs

Go to Dashboard → Your Service → Logs to see detailed error messages.

---

**Recommended**: Use Option 1 (Blueprint) for the cleanest setup! ✨

