# 🎤 Create Your ElevenLabs Agent - Step by Step

## Why You're Seeing "Failed to start conversation"

The placeholder Agent ID (`agent_placeholder_replace_me`) isn't real. You need to create an actual ElevenLabs agent!

## 📝 Step-by-Step Guide (10 minutes)

### Step 1: Go to ElevenLabs Dashboard

Open this link: **https://elevenlabs.io/app/conversational-ai**

- If you don't have an account, sign up (free tier available)
- Log in to your account

### Step 2: Create New Agent

1. Click **"Create Agent"** or **"New Agent"** button
2. You'll see a form to configure your agent

### Step 3: Basic Configuration

**Agent Name:**
```
Mom AI Assistant
```

**System Prompt:** (Copy and paste this)
```
You are a caring, nurturing Singaporean mom helping university students living in HDB flats.

You help them with:
1. Finding home-cooked food from neighbors
2. Booking cleaning services from aunties in the building
3. Finding items to exchange or donate within the community

Your personality:
- Warm, caring, and slightly bossy (in a loving way)
- Use occasional Singlish phrases like "lah", "okay", "don't worry"
- Always concerned about whether they're eating well
- Proud of the community and neighbors
- Practical and helpful

When users ask for help:
- Use your custom tools to search for food, cleaning slots, or exchange items
- Provide specific recommendations with details
- Offer to book cleaning slots or claim items for them
- Navigate them to appropriate screens when needed

Keep responses conversational, warm, and concise (2-3 sentences max).
```

**Voice Selection:**
- Browse the voice library
- Choose a warm, maternal voice
- **Recommended voices:** Rachel, Bella, or Charlotte
- Click "Preview" to test different voices
- Select the one that sounds most like a caring mom

### Step 4: Configure Custom Tools (Important!)

This is where the magic happens! Click **"Add Custom Tool"** or **"Configure Tools"** and add these 6 tools:

#### Tool 1: searchFood

```json
{
  "name": "searchFood",
  "description": "Search for home-cooked food items based on dietary preferences, price, or cuisine type",
  "url": "http://localhost:3001/api/voice-agent/search-food",
  "method": "POST",
  "parameters": {
    "type": "object",
    "properties": {
      "diet": {
        "type": "array",
        "items": {"type": "string"},
        "description": "Dietary preferences like halal, vegetarian, vegan"
      },
      "maxPrice": {
        "type": "number",
        "description": "Maximum price in dollars"
      },
      "searchTerm": {
        "type": "string",
        "description": "Search for specific dish name"
      },
      "tags": {
        "type": "array",
        "items": {"type": "string"},
        "description": "Tags like spicy, healthy, comfort"
      }
    }
  }
}
```

#### Tool 2: searchCleaningSlots

```json
{
  "name": "searchCleaningSlots",
  "description": "Find available cleaning service slots from aunties in the building",
  "url": "http://localhost:3001/api/voice-agent/search-cleaning",
  "method": "POST",
  "parameters": {
    "type": "object",
    "properties": {
      "petFriendly": {
        "type": "boolean",
        "description": "Whether the service needs to be pet-friendly"
      },
      "timeWindow": {
        "type": "string",
        "description": "Preferred time like morning, afternoon, evening"
      },
      "maxPrice": {
        "type": "number",
        "description": "Maximum hourly rate in dollars"
      }
    }
  }
}
```

#### Tool 3: searchExchangeItems

```json
{
  "name": "searchExchangeItems",
  "description": "Find items available for exchange, donation, or sale within the community",
  "url": "http://localhost:3001/api/voice-agent/search-exchange",
  "method": "POST",
  "parameters": {
    "type": "object",
    "properties": {
      "status": {
        "type": "string",
        "description": "Item status: donate, exchange, sell"
      },
      "itemType": {
        "type": "string",
        "description": "Type of item to search for"
      },
      "condition": {
        "type": "string",
        "description": "Item condition: excellent, good, fair"
      }
    }
  }
}
```

#### Tool 4: bookCleaningSlot

```json
{
  "name": "bookCleaningSlot",
  "description": "Book a cleaning service slot for the user",
  "url": "http://localhost:3001/api/voice-agent/book-cleaning",
  "method": "POST",
  "parameters": {
    "type": "object",
    "required": ["slotId"],
    "properties": {
      "slotId": {
        "type": "string",
        "description": "ID of the cleaning slot to book (from search results)"
      },
      "specialRequests": {
        "type": "string",
        "description": "Any special requests for the cleaner"
      }
    }
  }
}
```

#### Tool 5: claimExchangeItem

```json
{
  "name": "claimExchangeItem",
  "description": "Claim or express interest in an exchange item",
  "url": "http://localhost:3001/api/voice-agent/claim-item",
  "method": "POST",
  "parameters": {
    "type": "object",
    "required": ["itemId"],
    "properties": {
      "itemId": {
        "type": "string",
        "description": "ID of the item to claim (from search results)"
      },
      "message": {
        "type": "string",
        "description": "Message to the item owner"
      }
    }
  }
}
```

#### Tool 6: navigate

```json
{
  "name": "navigate",
  "description": "Navigate the user to a specific screen in the app",
  "url": "http://localhost:3001/api/voice-agent/navigate",
  "method": "POST",
  "parameters": {
    "type": "object",
    "required": ["screen"],
    "properties": {
      "screen": {
        "type": "string",
        "enum": ["home", "food", "cleaning", "clean", "exchange", "items"],
        "description": "Screen to navigate to"
      }
    }
  }
}
```

### Step 5: Save Agent

1. Review all settings
2. Click **"Create"** or **"Save"**
3. Wait for the agent to be created

### Step 6: Get Your Agent ID

1. Once created, you'll see your agent in the dashboard
2. Click on the agent to open its details
3. Look for **"Agent ID"** (usually at the top or in settings)
4. It will look like: `agent_abc123xyz456...`
5. **Copy this entire ID**

### Step 7: Update Your .env File

Open `.env` in your project root and replace the placeholder:

**Before:**
```env
VITE_ELEVENLABS_AGENT_ID=agent_placeholder_replace_me
```

**After:**
```env
VITE_ELEVENLABS_AGENT_ID=agent_abc123xyz456  # ← Paste your real ID here
```

### Step 8: Restart Dev Server

```bash
# Stop the server (Ctrl+C)
npm run dev
```

### Step 9: Make Sure Backend is Running

In a **separate terminal**:

```bash
cd backend
npm run dev
```

Backend must be running on `http://localhost:3001` for the tools to work!

### Step 10: Test It! 🎉

1. Open `http://localhost:5173`
2. Click the mic icon (🎤)
3. Modal should show "Connecting..." then "Listening..."
4. Start talking!

**Try these commands:**
- "Find me halal food under $8"
- "I need a cleaner tomorrow"
- "Show me items for donation"
- "Go to the food page"

---

## ⚠️ Important Notes

### Backend MUST Be Running

The tools won't work if your backend isn't running. Always have two terminals:

```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
cd backend
npm run dev
```

### Using Localhost URLs

The tool URLs use `http://localhost:3001` which only works when testing locally.

**For production/deployment**, you'll need to:
1. Deploy your backend
2. Update ALL tool URLs in ElevenLabs dashboard to your production URL
3. Example: `https://your-api.com/api/voice-agent/search-food`

### Free Tier Limits

ElevenLabs free tier includes:
- Limited voice generation minutes
- May have usage caps
- Check your account dashboard for current usage

---

## 🐛 Troubleshooting

### "Failed to start conversation"

**Possible causes:**
1. Agent ID is still the placeholder → Update `.env` with real ID
2. Agent doesn't exist → Create agent in dashboard
3. Agent ID copied wrong → Double-check, no spaces/typos
4. Didn't restart server → Restart after updating `.env`

### "Tools not working" / No search results

**Possible causes:**
1. Backend not running → Start backend with `cd backend && npm run dev`
2. Backend on wrong port → Check it's on `http://localhost:3001`
3. Tool URLs incorrect → Should be `http://localhost:3001/api/voice-agent/...`
4. CORS error → Backend should allow `localhost:5173`

### Can't hear AI voice

**Check:**
1. Browser audio permissions
2. System volume
3. ElevenLabs has credits remaining
4. Voice is selected in agent settings

### Agent responds but tools don't trigger

**Check:**
1. Tool schemas are correct (copy from above exactly)
2. Backend logs show incoming requests
3. Backend `.env` has ELEVENLABS_AGENT_ID set

---

## 🎯 What Success Looks Like

1. Click mic → Modal opens
2. Shows "Connecting..." for 1-2 seconds
3. Changes to "Listening..." with green dot
4. You say: "Find me halal food under $8"
5. AI Mom responds with voice and shows results
6. Backend terminal shows: `Voice Agent - Food Search: { diet: ['halal'], maxPrice: 8 }`
7. Results appear in your app!

---

## 📚 Need More Help?

- **Full detailed guide:** `ELEVENLABS_SETUP_GUIDE.md`
- **Quick reference:** `START_HERE.md`
- **Technical details:** `VOICE_IMPLEMENTATION_SUMMARY.md`

---

**Current Status:**
- ✅ Frontend code ready
- ✅ Backend code ready
- ✅ `.env` file created
- ⏳ **YOU ARE HERE** → Create ElevenLabs agent
- ⏳ Copy Agent ID to `.env`
- ⏳ Restart and test!

**Estimated time:** 10-15 minutes to create agent and configure tools

Good luck! 🚀

