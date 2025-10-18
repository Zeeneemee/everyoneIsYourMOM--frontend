# ElevenLabs Voice Agent Setup Guide

This guide will help you set up and configure the ElevenLabs Conversational AI agent for the "Everyone is Your Mom" app.

## Prerequisites

- ElevenLabs account ([Sign up here](https://elevenlabs.io))
- Backend server running (see `backend/README.md`)
- Frontend development server

## Part 1: Create ElevenLabs Agent

### Step 1: Access ElevenLabs Dashboard

1. Go to [https://elevenlabs.io/app/conversational-ai](https://elevenlabs.io/app/conversational-ai)
2. Sign in to your account
3. Click "Create Agent" or "New Agent"

### Step 2: Configure Agent Basics

**Name:** `Mom AI Assistant`

**System Prompt:**
```
You are a caring, nurturing Singaporean mom helping university students living in HDB flats. You help them find:
1. Home-cooked food from neighbors
2. Cleaning services from aunties in the building
3. Items to exchange/donate within the community

Personality traits:
- Warm, caring, and slightly bossy (in a loving way)
- Use occasional Singlish phrases like "lah", "okay", "don't worry"
- Always concerned about whether they're eating well
- Proud of the community and neighbors
- Practical and helpful

When users ask for help:
- Use the custom tools to search for food, cleaning, or items
- Provide specific recommendations with details
- Offer to book or claim items for them
- Navigate them to appropriate screens when needed

Keep responses conversational, warm, and concise.
```

**Voice Selection:**
- Choose a warm, maternal voice (e.g., "Rachel", "Bella", or "Charlotte")
- Test different voices to find the best "mom" character
- Adjust voice settings for warmth and naturalness

### Step 3: Configure Custom Tools

In the agent settings, add these custom tools (functions):

#### Tool 1: searchFood
```json
{
  "name": "searchFood",
  "description": "Search for home-cooked food items based on user preferences like dietary restrictions, price, or cuisine type",
  "url": "YOUR_BACKEND_URL/api/voice-agent/search-food",
  "method": "POST",
  "parameters": {
    "type": "object",
    "properties": {
      "diet": {
        "type": "array",
        "items": { "type": "string" },
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
        "items": { "type": "string" },
        "description": "Tags like spicy, healthy, comfort"
      },
      "maxEta": {
        "type": "number",
        "description": "Maximum delivery time in minutes"
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
  "url": "YOUR_BACKEND_URL/api/voice-agent/search-cleaning",
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
      },
      "cleaner": {
        "type": "string",
        "description": "Specific cleaner name if requested"
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
  "url": "YOUR_BACKEND_URL/api/voice-agent/search-exchange",
  "method": "POST",
  "parameters": {
    "type": "object",
    "properties": {
      "status": {
        "type": "string",
        "description": "Item status: donate, exchange, sell"
      },
      "condition": {
        "type": "string",
        "description": "Item condition: excellent, good, fair"
      },
      "itemType": {
        "type": "string",
        "description": "Type of item to search for"
      },
      "ownerBlock": {
        "type": "string",
        "description": "Owner's block for proximity filtering"
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
  "url": "YOUR_BACKEND_URL/api/voice-agent/book-cleaning",
  "method": "POST",
  "parameters": {
    "type": "object",
    "required": ["slotId"],
    "properties": {
      "slotId": {
        "type": "string",
        "description": "ID of the cleaning slot to book"
      },
      "userId": {
        "type": "string",
        "description": "User ID (optional, defaults to guest)"
      },
      "specialRequests": {
        "type": "string",
        "description": "Any special requests for the cleaner"
      },
      "address": {
        "type": "string",
        "description": "User's address"
      },
      "contactNumber": {
        "type": "string",
        "description": "Contact number for the cleaner"
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
  "url": "YOUR_BACKEND_URL/api/voice-agent/claim-item",
  "method": "POST",
  "parameters": {
    "type": "object",
    "required": ["itemId"],
    "properties": {
      "itemId": {
        "type": "string",
        "description": "ID of the item to claim"
      },
      "userId": {
        "type": "string",
        "description": "User ID (optional, defaults to guest)"
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
  "url": "YOUR_BACKEND_URL/api/voice-agent/navigate",
  "method": "POST",
  "parameters": {
    "type": "object",
    "required": ["screen"],
    "properties": {
      "screen": {
        "type": "string",
        "enum": ["home", "food", "cleaning", "clean", "exchange", "items", "profile", "settings"],
        "description": "Screen to navigate to"
      }
    }
  }
}
```

**Important:** Replace `YOUR_BACKEND_URL` with your actual backend URL (e.g., `http://localhost:3001` for development or your deployed backend URL for production).

### Step 4: Save Agent Configuration

1. Review all settings
2. Click "Save" or "Create Agent"
3. Copy the **Agent ID** from the agent settings page

## Part 2: Configure Backend

### Step 1: Update Backend .env

Navigate to `backend/` and edit your `.env` file:

```bash
cd backend
```

Add/update these lines:
```env
ELEVENLABS_API_KEY=sk_your_api_key_here
ELEVENLABS_AGENT_ID=agent_your_agent_id_here
```

### Step 2: Restart Backend Server

```bash
# Stop the server (Ctrl+C if running)
npm run dev
```

The backend should now be ready to receive requests from the ElevenLabs agent.

## Part 3: Configure Frontend

### Step 1: Create .env File

In the project root (not backend/), create a `.env` file:

```bash
cd /path/to/everyoneIsYourMOM--frontend
touch .env
```

Add this content:
```env
VITE_ELEVENLABS_AGENT_ID=agent_your_agent_id_here
VITE_API_URL=http://localhost:3001
```

**Note:** Use the same Agent ID from Part 1, Step 4.

### Step 2: Restart Frontend Server

```bash
# Stop the development server (Ctrl+C if running)
npm run dev
```

The frontend should now display the voice assistant when you click the mic icon.

## Part 4: Test the Integration

### Test Voice Conversations

1. Open the app in your browser: `http://localhost:5173`
2. Navigate to any page (Home, Food, Cleaning, Exchange)
3. Click the microphone icon (🎤)
4. The voice assistant modal should open
5. Click the microphone in the modal to start talking

### Test Scenarios

**Food Search:**
- "Find me halal chicken rice under $7"
- "I want something spicy and healthy"
- "Show me Italian food nearby"

**Cleaning Service:**
- "I need a cleaner tomorrow morning"
- "Find me a pet-friendly cleaning service"
- "Book a cleaner for this weekend"

**Exchange Items:**
- "I'm looking for a free rice cooker"
- "Find furniture for donation"
- "Show me items in good condition"

**Navigation:**
- "Go to the food page"
- "Show me cleaning services"
- "Take me to the exchange page"

### Verify Backend Tool Calls

Check your backend terminal for logs like:
```
Voice Agent - Food Search: { diet: ['halal'], maxPrice: 7 }
Voice Agent - Navigate: { screen: 'food' }
```

## Troubleshooting

### Issue: Agent ID Not Found

**Solution:**
- Verify the Agent ID is correct in both `.env` files
- Make sure it starts with `agent_`
- Restart both servers after updating .env

### Issue: Tools Not Working

**Solution:**
- Check that `YOUR_BACKEND_URL` in ElevenLabs tool configuration is correct
- Verify backend server is running
- Check CORS settings in backend allow requests from ElevenLabs

### Issue: Microphone Not Working

**Solution:**
- Grant microphone permissions in your browser
- Use HTTPS in production (browsers require it for mic access)
- Check browser console for errors

### Issue: No Voice Response

**Solution:**
- Verify ElevenLabs API key is valid
- Check your ElevenLabs account has credits
- Test voice in ElevenLabs dashboard first

### Issue: Navigation Not Working

**Solution:**
- Check browser console for navigation errors
- Verify `VoiceAssistantContext` is properly wrapped around routes
- Check the route names match your app's routing

## Production Deployment

### Update Agent Tool URLs

In the ElevenLabs dashboard, update all tool URLs from:
```
http://localhost:3001/api/voice-agent/...
```

To your production URL:
```
https://your-production-domain.com/api/voice-agent/...
```

### Update Frontend .env

Create `.env.production`:
```env
VITE_ELEVENLABS_AGENT_ID=agent_your_agent_id_here
VITE_API_URL=https://your-production-domain.com
```

### CORS Configuration

In `backend/server.js`, ensure your production domain is in `ALLOWED_ORIGINS`:
```javascript
const allowedOrigins = [
  'https://your-frontend-domain.com',
  'https://api.elevenlabs.io'
];
```

## Support

- ElevenLabs Documentation: https://elevenlabs.io/docs
- ElevenLabs Support: https://elevenlabs.io/support
- Project Issues: [Your GitHub repo issues]

## Next Steps

- Customize the agent's personality in the system prompt
- Add more custom tools for additional features
- Fine-tune voice settings for better character portrayal
- Implement user authentication for personalized experiences
- Add conversation history and context management

