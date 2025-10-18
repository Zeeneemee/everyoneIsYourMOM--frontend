# Complete Setup Guide

This guide will walk you through setting up the "Everyone Is Your Mom" backend from scratch.

## 📋 Prerequisites Checklist

Before starting, ensure you have:

- [ ] Node.js 18+ installed ([Download](https://nodejs.org/))
- [ ] npm or yarn package manager
- [ ] Git installed
- [ ] A Supabase account ([Sign up](https://supabase.com/))
- [ ] An OpenAI API key ([Get key](https://platform.openai.com/api-keys))
- [ ] An ElevenLabs API key ([Get key](https://elevenlabs.io/))
- [ ] A code editor (VS Code recommended)

## 🚀 Step-by-Step Setup

### Step 1: Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Click "New Project"
3. Fill in:
   - Project name: `everyone-is-your-mom`
   - Database password: (create a strong password - save it!)
   - Region: Choose closest to Singapore
4. Wait for project to be created (~2 minutes)

### Step 2: Get Supabase Credentials

In your Supabase project dashboard:

1. Go to **Settings** → **API**
   - Copy `Project URL` → This is your `SUPABASE_URL`
   - Copy `anon public` key → This is your `SUPABASE_ANON_KEY`
   
2. Go to **Settings** → **Database**
   - Scroll to **Connection string**
   - Select **URI** tab
   - Copy the connection string
   - Replace `[YOUR-PASSWORD]` with your database password
   - This is your `DATABASE_URL`

Example:
```
postgresql://postgres:YourPassword123@db.abcdefghijk.supabase.co:5432/postgres
```

### Step 3: Get OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign in or create an account
3. Navigate to **API Keys** section
4. Click "Create new secret key"
5. Name it: `everyone-is-your-mom-backend`
6. Copy the key (starts with `sk-...`)
7. **Important:** You won't be able to see it again!

### Step 4: Get ElevenLabs API Key

1. Go to [ElevenLabs](https://elevenlabs.io/)
2. Sign up or log in
3. Go to your **Profile Settings**
4. Find **API Key** section
5. Copy your API key

### Step 5: Choose ElevenLabs Voice

1. In ElevenLabs, go to **Voice Library**
2. Browse voices and listen to samples
3. For "Mom" character, look for:
   - Female voice
   - Mature/warm tone
   - Clear pronunciation
4. Click on a voice you like
5. Copy the **Voice ID** (found in the URL or voice details)

Recommended voices:
- **Rachel** - Warm and caring
- **Bella** - Mature and friendly
- **Elli** - Natural and expressive

### Step 6: Install Backend Dependencies

```bash
cd backend
npm install
```

This will install all required packages including:
- Express
- Drizzle ORM
- OpenAI SDK
- ElevenLabs integration
- And more...

### Step 7: Configure Environment Variables

1. Copy the example file:
```bash
cp env.example .env
```

2. Open `.env` in your editor

3. Fill in all the values you collected:

```env
# Server
PORT=3001
NODE_ENV=development

# Database (from Step 2)
DATABASE_URL=postgresql://postgres:YourPassword@db.xxxxx.supabase.co:5432/postgres

# Supabase (from Step 2)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_KEY=eyJhbGc...  # Optional, from same page

# OpenAI (from Step 3)
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4-turbo-preview

# ElevenLabs (from Steps 4 & 5)
ELEVENLABS_API_KEY=your_key_here
ELEVENLABS_VOICE_ID=your_voice_id_here

# CORS (Frontend URL)
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# AI Configuration
AI_AGENT_TEMPERATURE=0.7
AI_AGENT_MAX_TOKENS=500
```

4. Save the file

### Step 8: Set Up Database

#### Generate Migration Files

```bash
npm run db:generate
```

This reads `src/db/schema.js` and creates migration SQL files.

#### Apply Migrations to Database

```bash
npm run db:migrate
```

This creates all tables in your Supabase database:
- ✅ users
- ✅ user_preferences
- ✅ food_menu
- ✅ cleaning_slots
- ✅ cleaning_bookings
- ✅ exchange_items
- ✅ exchange_claims
- ✅ user_interactions
- ✅ mom_points_history
- ✅ food_orders
- ✅ conversations

#### Seed Initial Data

```bash
node src/db/seed.js
```

This populates the database with initial data from `data.json`:
- 20 food items
- 10 cleaning slots
- 10 exchange items

### Step 9: Verify Setup

#### Test Database Connection

```bash
npm run dev
```

Look for these success messages:
```
✅ Database connection successful
✅ Server running on http://localhost:3001
```

#### Test API Endpoints

Open a new terminal and run:

```bash
# Health check
curl http://localhost:3001/api/health

# Get food items
curl http://localhost:3001/api/food

# Get cleaning slots
curl http://localhost:3001/api/cleaning/slots
```

All should return JSON responses with `"success": true`

### Step 10: Test Voice Features

#### Test Text-to-Speech

```bash
curl -X POST http://localhost:3001/api/voice/text-to-speech \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello from Mom!", "emotion": "happy"}' \
  --output test_voice.mp3
```

Then play `test_voice.mp3` - you should hear the Mom voice!

#### Test Speech-to-Text

Record a short audio message, then:

```bash
curl -X POST http://localhost:3001/api/voice/speech-to-text \
  -F "audio=@your_recording.mp3"
```

You should get back the transcribed text.

### Step 11: Test AI Agent

```bash
curl -X POST http://localhost:3001/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I am hungry and want something vegetarian"
  }'
```

You should get a response from the AI Mom with food recommendations!

## 🎉 Success!

Your backend is now fully set up and running!

## 🐛 Troubleshooting

### Database Connection Failed

**Problem:** `Database connection failed`

**Solutions:**
1. Check `DATABASE_URL` is correct
2. Verify database password has no special characters that need escaping
3. Ensure your IP is not blocked by Supabase (check project settings)
4. Try using Connection Pooler URL instead (in Supabase settings)

### OpenAI API Error

**Problem:** `OpenAI API key invalid`

**Solutions:**
1. Verify API key starts with `sk-`
2. Check you have credits in your OpenAI account
3. Ensure API key is active and not revoked

### ElevenLabs Voice Error

**Problem:** `Failed to generate speech`

**Solutions:**
1. Verify ElevenLabs API key is correct
2. Check you have characters remaining in your ElevenLabs quota
3. Test voice ID is valid (try in ElevenLabs playground first)

### Port Already in Use

**Problem:** `Port 3001 is already in use`

**Solutions:**
1. Change `PORT=3002` in `.env`
2. Or kill the process using port 3001:
```bash
# Find process
lsof -ti:3001

# Kill it
kill -9 <PID>
```

### Missing Dependencies

**Problem:** `Cannot find module '...'`

**Solutions:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📊 Verify Database in Supabase

1. Go to Supabase Dashboard
2. Click on **Table Editor**
3. You should see all tables created
4. Click on `food_menu` - you should see 20 items
5. Click on `cleaning_slots` - you should see 10 slots

## 🔧 Optional: Use Drizzle Studio

Drizzle Studio is a database GUI:

```bash
npm run db:studio
```

Opens at `https://local.drizzle.studio`

## 📝 Next Steps

1. **Connect Frontend:**
   - Update frontend `.env` with `VITE_API_URL=http://localhost:3001`
   
2. **Customize Voice:**
   - Try different ElevenLabs voices
   - Adjust voice settings in `src/utils/elevenlabs.js`

3. **Add Your Data:**
   - Edit `data.json` with your community data
   - Run `node src/db/seed.js` again

4. **Test Full Flow:**
   - Start frontend: `cd .. && npm run dev`
   - Test voice conversation end-to-end

## 🚀 Production Deployment

For production deployment, see:
- [Railway](https://railway.app/) - Easy Node.js hosting
- [Render](https://render.com/) - Free tier available
- [Fly.io](https://fly.io/) - Global deployment
- [AWS/GCP/Azure](https://aws.amazon.com/) - Full control

Remember to:
- Set `NODE_ENV=production`
- Use environment variables (don't commit `.env`)
- Set up proper authentication
- Enable HTTPS
- Configure CORS properly
- Set up monitoring and logging

## 📞 Getting Help

If you're stuck:
1. Check the error message carefully
2. Search the issue in GitHub Issues
3. Review the API documentation in `README.md`
4. Check Supabase logs in dashboard
5. Enable verbose logging: `DEBUG=* npm run dev`

Happy coding! 🎉

