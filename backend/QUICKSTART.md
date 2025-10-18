# Quick Start Guide - Using Gemini 2.0 Flash

## 🚀 Super Fast Setup (5 minutes)

### 1. Get Your Gemini API Key (FREE!)

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with Google
3. Click **"Get API Key"** (top right)
4. Click **"Create API key in new project"**
5. Copy your key (starts with `AIza...`)

**Free tier includes:**
- 15 requests/minute
- 1M tokens/minute  
- 1,500 requests/day
- Perfect for development! ✨

### 2. Install & Configure

```bash
# Install dependencies
cd backend
npm install

# Create .env file
cp env.example .env

# Edit .env
nano .env
```

**Add these (minimum required):**
```env
# Required
DATABASE_URL=your_supabase_connection_string
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=AIza...your_gemini_key
ELEVENLABS_API_KEY=your_elevenlabs_key
ELEVENLABS_VOICE_ID=your_voice_id

# Optional (only if you want speech-to-text)
OPENAI_API_KEY=sk-...
```

### 3. Set Up Database

```bash
# Run migrations
npm run db:migrate

# Seed with initial data
node src/db/seed.js
```

### 4. Start Server

```bash
npm run dev
```

You should see:
```
✅ Database connection successful
✅ Server running on http://localhost:3001
```

### 5. Test It!

```bash
# Test AI chat with Gemini
curl -X POST http://localhost:3001/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "I am hungry and want vegetarian food"}'
```

You should get a response from your AI Mom! 🎉

## 💰 Why Gemini?

**130x CHEAPER than GPT-4!**
- Gemini: $0.075 per 1M tokens
- GPT-4: $10 per 1M tokens

For 1 million requests:
- GPT-4: ~$11,000
- Gemini: ~$97 💰

## 🎯 Core Features Working

✅ AI Chat (Gemini)
✅ Food Recommendations  
✅ Cleaning Services
✅ Item Exchange
✅ Natural Language Understanding
✅ Singaporean Mom Persona
✅ Text-to-Speech (ElevenLabs)
⚠️ Speech-to-Text (Optional - needs OpenAI key)

## 🔧 Configuration Options

### Use Different Gemini Model

In `.env`:
```env
# Fastest (default)
GEMINI_MODEL=gemini-2.0-flash-exp

# More capable
GEMINI_MODEL=gemini-1.5-pro

# Balanced
GEMINI_MODEL=gemini-1.5-flash
```

### Adjust AI Personality

In `.env`:
```env
# More creative/varied (0.0-1.0)
AI_AGENT_TEMPERATURE=0.8

# Longer responses (tokens)
AI_AGENT_MAX_TOKENS=800
```

## 🎤 Speech-to-Text Options

### Option 1: OpenAI Whisper (Current)
- Add `OPENAI_API_KEY` to `.env`
- Very accurate
- ~$0.006 per minute

### Option 2: Skip STT
- Remove voice endpoints
- Use text chat only
- No extra cost

### Option 3: Client-side (Free!)
- Use Web Speech API in frontend
- No backend needed
- Browser-based

## 🧪 Test All Endpoints

```bash
# Health check
curl http://localhost:3001/api/health

# Get food items
curl http://localhost:3001/api/food

# Search vegetarian
curl "http://localhost:3001/api/food/search?diet=vegetarian"

# AI chat
curl -X POST http://localhost:3001/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Find me cleaning service with pets"}'

# Text-to-speech
curl -X POST http://localhost:3001/api/voice/text-to-speech \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello from Mom!", "emotion": "happy"}' \
  --output voice.mp3
```

## 📊 Monitor Usage

### Check Gemini Usage
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Click on your API key
3. View usage stats

### Rate Limits (Free Tier)
- 15 requests per minute
- If exceeded, wait 60 seconds
- For production, upgrade to paid tier

## ⚡ Performance Tips

1. **Cache Responses**: Common queries can be cached
2. **Batch Requests**: Process multiple items together
3. **Use Templates**: 70% responses use templates (faster)
4. **Optimize Prompts**: Shorter prompts = faster + cheaper

## 🐛 Common Issues

### "API key not valid"
```bash
# Check your key starts with "AIza"
# Regenerate if needed at ai.google.dev
```

### "Rate limit exceeded"
```bash
# Free tier: 15 req/min
# Wait 60 seconds or upgrade
```

### "Model not found"
```bash
# Check spelling: gemini-2.0-flash-exp
# Try: gemini-1.5-flash
```

### Database connection failed
```bash
# Check DATABASE_URL in .env
# Verify password has no special chars
# Test connection in Supabase dashboard
```

## 📚 Next Steps

1. ✅ Connect your frontend
2. ✅ Customize the Mom persona
3. ✅ Add your community data
4. ✅ Test voice features
5. ✅ Deploy to production

## 🎉 You're Ready!

Your AI-powered community assistant is running with:
- 🤖 Gemini 2.0 Flash (super cheap!)
- 🗣️ ElevenLabs voice
- 🎭 Singaporean mom persona
- 📊 Full MVC architecture
- 🗄️ PostgreSQL + Drizzle ORM

**Total cost for 1M requests: ~$100 vs $11,000 with GPT-4!** 💰

## 📞 Need Help?

- Read: `GEMINI_MIGRATION.md` for detailed migration info
- Read: `README.md` for full API documentation
- Read: `ARCHITECTURE.md` for technical details
- Check: Server logs for errors
- Test: One endpoint at a time

Happy coding! 🚀

