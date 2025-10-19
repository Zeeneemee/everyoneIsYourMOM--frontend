# Vercel CORS Fix Guide

## Problems Identified

1. **CORS Error**: Backend on Render doesn't allow requests from Vercel frontend
2. **Double `/api/api/` in URL**: Incorrect environment variable configuration on Vercel

## Quick Fixes

### 1. Fix Render Backend (CORS)

Go to [Render Dashboard](https://dashboard.render.com/) → Your Backend Service

**Add/Update Environment Variable:**
```
Variable: ALLOWED_ORIGINS
Value: http://localhost:5173,http://localhost:3000,https://everyone-is-your-mom-frontend.vercel.app
```

💡 **Tip**: If you have multiple Vercel preview URLs, add them all separated by commas.

### 2. Fix Vercel Frontend (Environment Variables)

Go to [Vercel Dashboard](https://vercel.com/dashboard) → Your Project → Settings → Environment Variables

**Ensure you have BOTH variables set correctly:**

| Variable | Correct Value | Notes |
|----------|---------------|-------|
| `VITE_BACKEND_URL` | `https://everyoneisyourmom-frontend.onrender.com` | **NO** `/api` at the end |
| `VITE_API_URL` | `https://everyoneisyourmom-frontend.onrender.com/api` | **WITH** `/api` at the end |
| `VITE_CONVEX_URL` | Your Convex URL | From Convex dashboard |
| `VITE_ELEVENLABS_AGENT_ID` | Your ElevenLabs Agent ID | Optional |

### 3. Deploy Changes

After updating environment variables:

1. **Render**: Will auto-deploy when you save the environment variable
2. **Vercel**: Either:
   - Wait for auto-deploy (if you have GitHub integration)
   - Manually trigger a redeploy from the Deployments tab

## Verification

Once both services are redeployed, test by:

1. Open your Vercel app: `https://everyone-is-your-mom-frontend.vercel.app`
2. Try to login or use any API feature
3. Check the browser console - no CORS errors should appear
4. Verify the API calls show the correct URL format (single `/api/`)

## Why This Happened

### CORS Issue
- The backend uses the `ALLOWED_ORIGINS` environment variable to determine which domains can access it
- By default, it only allowed `localhost` URLs for development
- Production URLs need to be explicitly added

### Double `/api/` Issue
- `VITE_BACKEND_URL` = Base URL (e.g., `https://example.com`)
- `VITE_API_URL` = API URL with path (e.g., `https://example.com/api`)
- VoiceAssistantModal uses `VITE_BACKEND_URL` and manually adds `/api/...`
- Other services use `VITE_API_URL` which already includes `/api`
- If you set `VITE_BACKEND_URL` to include `/api`, you get double `/api/api/`

## Common Mistakes to Avoid

❌ **DON'T** set `VITE_BACKEND_URL` to `https://example.com/api`  
✅ **DO** set `VITE_BACKEND_URL` to `https://example.com`

❌ **DON'T** forget to add your production URL to `ALLOWED_ORIGINS`  
✅ **DO** include all your deployment URLs (production + preview if needed)

## Need More Help?

- Check backend logs in Render Dashboard → Logs
- Check browser console for detailed error messages
- Verify environment variables are saved correctly on both platforms

