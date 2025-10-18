# ✨ Add Personalized Food Recommendations

## What's New

I've added a new feature that lets the AI Mom suggest top-rated food items from Convex automatically!

## 🎯 What It Does

When users ask for food recommendations, the AI can now:
- Fetch the top 3 highest-rated dishes from Convex
- Show personalized suggestions based on ratings
- Make proactive recommendations

## 🔧 Backend Already Updated

✅ New endpoint created: `/api/voice-agent/personalized-food`
✅ Queries Convex and returns top 3 rated items
✅ Ready to use!

## 📝 Add This Tool to Your ElevenLabs Agent

### Step 1: Go to Your Agent

Open: https://elevenlabs.io/app/conversational-ai

Click on your "Mom AI Assistant" agent

### Step 2: Add New Custom Tool

Click **"Add Tool"** or **"Configure Tools"** and add this **7th tool**:

#### Tool 7: getPersonalizedFood

```json
{
  "name": "getPersonalizedFood",
  "description": "Get personalized food recommendations for the user based on ratings and preferences. Use this when user asks for general food suggestions without specific criteria.",
  "url": "http://localhost:3001/api/voice-agent/personalized-food",
  "method": "POST",
  "parameters": {
    "type": "object",
    "properties": {
      "userId": {
        "type": "string",
        "description": "User ID (optional)"
      },
      "limit": {
        "type": "number",
        "description": "Number of recommendations to return (default: 3)"
      }
    }
  }
}
```

### Step 3: Update System Prompt (Optional but Recommended)

In your agent's system prompt, add this line:

```
When users ask for general food recommendations or "what should I eat", use getPersonalizedFood to show them top-rated dishes. For specific searches (halal, cheap, etc.), use searchFood instead.
```

**Full updated prompt:**
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
- Use getPersonalizedFood for general food recommendations ("What should I eat?", "Suggest something")
- Use searchFood for specific searches (halal, price, cuisine type)
- Use searchCleaningSlots to find cleaning services
- Use searchExchangeItems to find items to exchange
- Use bookCleaningSlot to book cleaning services
- Use claimExchangeItem to claim items
- Use navigate to move between app screens

Provide specific recommendations with details.
Keep responses conversational, warm, and concise (2-3 sentences max).
```

### Step 4: Save Agent

Click **"Save"** to update your agent configuration.

## 🧪 Test It!

Restart your dev server if it's running:

```bash
# Stop and restart
npm run dev
```

Then try these voice commands:

**General Recommendations:**
- "What should I eat today?"
- "Suggest some food for me"
- "I'm hungry, what do you recommend?"
- "Show me popular dishes"

**Specific Searches (uses searchFood):**
- "Find me halal food under $8"
- "I want something spicy"

## 🔄 How It Works

### General Request Flow:
```
User: "What should I eat?"
  ↓
AI uses: getPersonalizedFood
  ↓
Backend queries Convex → Gets top 3 rated items
  ↓
AI responds: "I recommend Hainanese Chicken Rice from Auntie Mei (5.0★, $6.50)..."
```

### Specific Search Flow:
```
User: "Find halal food under $8"
  ↓
AI uses: searchFood with parameters {diet: ['halal'], maxPrice: 8}
  ↓
Backend queries Convex with filters
  ↓
AI responds: "Found 3 halal dishes under $8..."
```

## 📊 What Gets Returned

The endpoint returns:

```json
{
  "success": true,
  "count": 3,
  "items": [
    {
      "id": "...",
      "name": "Hainanese Chicken Rice",
      "house": "Auntie Mei",
      "price": "$6.50",
      "eta": "20 min",
      "distance": "0.5 km",
      "rating": 5.0,
      "diet": "halal",
      "tags": "comfort, asian"
    }
    // ... 2 more items
  ],
  "message": "Here are 3 top-rated food recommendations for you!"
}
```

## 🚀 Future Enhancements

This currently returns top-rated items. You could enhance it to:

1. **User Preferences:** Store user dietary preferences in Convex and filter by them
2. **Order History:** Recommend based on what user ordered before
3. **Time of Day:** Different suggestions for breakfast/lunch/dinner
4. **Location:** Prioritize nearby options
5. **Favorites:** Let users mark favorites and suggest similar

To implement user preferences, you'd modify the backend controller to:
- Query user preferences from Convex users table
- Filter results based on those preferences
- Return truly personalized suggestions

## 📝 Summary

✅ **Backend:** New endpoint ready at `/api/voice-agent/personalized-food`
✅ **What to do:** Add the 7th tool to your ElevenLabs agent (JSON above)
✅ **Test:** Say "What should I eat?" and get top 3 recommendations!

---

**Now you have 7 tools total:**
1. searchFood - Specific searches
2. **getPersonalizedFood - General recommendations** ⭐ NEW
3. searchCleaningSlots
4. searchExchangeItems
5. bookCleaningSlot
6. claimExchangeItem
7. navigate

The AI will automatically choose the right tool based on what the user asks! 🎉

