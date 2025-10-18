# Voice Assistant - Quick Start Guide

## What Was Implemented

A fully functional ElevenLabs Conversational AI integration that allows users to interact with the app using voice commands.

### Features

✅ **Voice Input** - Click mic icon to talk with AI Mom
✅ **Natural Conversations** - Powered by ElevenLabs Conversational AI
✅ **Smart Search** - Find food, cleaning, and exchange items by voice
✅ **Voice Actions** - Book cleaning slots and claim items hands-free
✅ **App Navigation** - Voice commands to switch between screens
✅ **Multi-Page** - Mic icons available on Home, Food, Cleaning, and Exchange pages

## Quick Setup (3 Steps)

### 1. Create ElevenLabs Agent

Go to [ElevenLabs Dashboard](https://elevenlabs.io/app/conversational-ai) and:
- Create new agent named "Mom AI Assistant"
- Add system prompt (see `ELEVENLABS_SETUP_GUIDE.md`)
- Configure 6 custom tools (see full guide)
- Copy your Agent ID

### 2. Configure Environment

**Backend** (`backend/.env`):
```env
ELEVENLABS_API_KEY=sk_your_key
ELEVENLABS_AGENT_ID=agent_your_id
```

**Frontend** (`.env` in project root):
```env
VITE_ELEVENLABS_AGENT_ID=agent_your_id
```

### 3. Start Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
npm run dev
```

## How to Use

### Opening Voice Assistant

Click any microphone icon (🎤) in the app:
- **Home Screen** - In the text input area (right side)
- **Food Screen** - Header (next to Settings)
- **Cleaning Screen** - Header (next to Settings)
- **Exchange Screen** - Header (next to Settings)

### Voice Commands Examples

**Food:**
```
"Find me halal food under $8"
"I want something spicy"
"Show me chicken rice"
"Find Italian food nearby"
```

**Cleaning:**
```
"I need a cleaner tomorrow"
"Find pet-friendly cleaning service"
"Book a cleaner for this weekend"
"Show me available cleaners"
```

**Exchange:**
```
"Find a free rice cooker"
"I need furniture"
"Show me items for donation"
"Find kitchen appliances"
```

**Navigation:**
```
"Go to the food page"
"Show me cleaning services"
"Take me home"
"Open the exchange page"
```

**Booking/Claiming:**
```
"Book that cleaning slot"
"I want to claim that item"
"Reserve the first one"
```

## Technical Architecture

### Backend Components

**New Files:**
- `backend/src/controllers/voiceAgentController.js` - Handles agent tool requests
- `backend/src/routes/voiceAgentRoutes.js` - API endpoints for agent tools

**Endpoints:**
- `POST /api/voice-agent/search-food` - Search food items
- `POST /api/voice-agent/search-cleaning` - Search cleaning slots
- `POST /api/voice-agent/search-exchange` - Search exchange items
- `POST /api/voice-agent/book-cleaning` - Book a cleaning slot
- `POST /api/voice-agent/claim-item` - Claim an exchange item
- `POST /api/voice-agent/navigate` - Get navigation route

### Frontend Components

**New Files:**
- `src/contexts/VoiceAssistantContext.jsx` - Global voice assistant state
- `src/components/VoiceAssistantModal.jsx` - Voice assistant UI modal

**Modified Files:**
- `src/App.jsx` - Added VoiceAssistantProvider wrapper
- `src/components/HomeScreen.jsx` - Added mic click handler
- `src/components/FoodScreen.jsx` - Added mic button
- `src/components/CleaningScreen.jsx` - Added mic button
- `src/components/ExchangeScreen.jsx` - Added mic button

### Dependencies

**Installed:**
- `@elevenlabs/react` - ElevenLabs React SDK for voice interface

## How It Works

1. **User clicks mic** → Voice assistant modal opens
2. **User speaks** → ElevenLabs agent processes speech-to-text
3. **Agent analyzes intent** → Determines what the user wants
4. **Agent calls tools** → Backend endpoints query Convex database
5. **Backend returns data** → Formatted results sent to agent
6. **Agent responds** → Natural voice response with information
7. **Action executed** → Navigation, booking, or claiming happens

## Data Flow

```
User Voice → ElevenLabs Agent → Backend Tool → Convex Query → Response
                    ↓
              Voice Response + Action (navigate/book/claim)
```

## Customization

### Change Voice Personality

Edit system prompt in ElevenLabs dashboard to adjust:
- Tone (more caring, professional, funny)
- Language style (more Singlish, formal English)
- Response length (concise or detailed)

### Add New Tools

1. Create endpoint in `voiceAgentController.js`
2. Add route in `voiceAgentRoutes.js`
3. Configure tool in ElevenLabs dashboard
4. Update system prompt to mention new capability

### Modify Voice Settings

In ElevenLabs dashboard:
- Stability: 0.5 (higher = more consistent)
- Similarity: 0.75 (higher = more like original voice)
- Style: 0.5 (expressiveness level)

## Troubleshooting

**Mic icon doesn't open modal:**
- Check console for errors
- Verify VoiceAssistantProvider is wrapping routes
- Check `.env` has VITE_ELEVENLABS_AGENT_ID

**No voice response:**
- Check ElevenLabs API key is valid
- Verify agent ID is correct
- Check browser console for errors

**Tools not working:**
- Backend must be running on port 3001
- Check tool URLs in ElevenLabs dashboard
- Verify backend .env has ELEVENLABS_AGENT_ID

**Navigation not working:**
- Check VoiceAssistantContext handleNavigation function
- Verify route names match your app's routes

## Production Checklist

- [ ] Update tool URLs to production backend
- [ ] Set up HTTPS (required for microphone)
- [ ] Configure CORS for production domains
- [ ] Test all voice commands in production
- [ ] Monitor ElevenLabs usage/credits
- [ ] Set up error logging
- [ ] Test on mobile devices

## Resources

- **Full Setup Guide:** `ELEVENLABS_SETUP_GUIDE.md`
- **ElevenLabs Docs:** https://elevenlabs.io/docs/conversational-ai
- **Backend Routes:** `backend/src/routes/voiceAgentRoutes.js`
- **Frontend Context:** `src/contexts/VoiceAssistantContext.jsx`

## Support Commands

```bash
# Check backend logs
cd backend && npm run dev

# Check frontend logs  
npm run dev

# Test backend endpoint
curl -X POST http://localhost:3001/api/voice-agent/search-food \
  -H "Content-Type: application/json" \
  -d '{"maxPrice": 10}'

# Rebuild if needed
npm install
cd backend && npm install
```

---

**Need Help?** Check `ELEVENLABS_SETUP_GUIDE.md` for detailed setup instructions.

