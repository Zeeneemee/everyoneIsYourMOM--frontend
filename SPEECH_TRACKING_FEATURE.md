# 🎯 Speech Tracking Feature

## Overview

Mom now automatically displays food recommendation cards when she mentions specific dishes in her speech! The system intelligently parses what Mom is saying and shows matching food items from Convex in real-time.

## 🌟 How It Works

### Flow Diagram

```
User: "What should I eat?"
    ↓
Mom: "I recommend trying Hainanese Chicken Rice, Nasi Lemak, or Laksa..."
    ↓
System detects food mentions in speech
    ↓
Searches Convex for matching dishes
    ↓
Displays cards automatically (no button click needed!)
    ↓
Cards appear on both voice modal AND home screen
```

### Technical Implementation

#### 1. **Frontend Speech Detection** (`VoiceAssistantModal.jsx`)

When Mom speaks, the `onMessage` handler:
- Checks if the message is from AI (`message.source === 'ai'`)
- Detects recommendation keywords: "recommend", "suggest", "try", "how about", "top 3", "here are"
- Calls `parseAndFetchFoodMentions()` to analyze the text

```javascript
// Parse Mom's speech for food mentions
if (message.source === 'ai' && messageText) {
  parseAndFetchFoodMentions(messageText);
}
```

#### 2. **Text Parsing Function**

```javascript
const parseAndFetchFoodMentions = async (messageText) => {
  // Check for recommendation patterns (expanded for natural conversation)
  const recommendationPatterns = [
    // Direct recommendations
    /recommend/i,
    /suggest/i,
    /try/i,
    /how about/i,
    /top \d+/i,
    /here are/i,
    /found/i,
    
    // Natural conversational patterns
    /got.*(?:chicken|rice|noodle|fish|meat|tofu|veggie|soup|curry)/i,
    /(?:auntie|uncle|chef|house).*got/i,
    /which one you (?:prefer|want|like)/i,
    /or.*got/i,
    /can (?:try|eat|order)/i,
    /available/i,
    /serve/i,
    /menu/i,
    /dish/i,
  ];

  // If detected, call backend to find matching food
  const response = await fetch('/api/voice-agent/parse-food-mentions', {
    method: 'POST',
    body: JSON.stringify({ text: messageText, limit: 3 })
  });
};
```

#### 3. **Backend Intelligent Matching** (`voiceAgentController.js`)

The backend performs smart food matching:

```javascript
async parseFoodMentions(req, res) {
  const { text } = req.body;
  
  // Get all available foods from Convex
  const allFoods = await convexClient.query('foods:getAll', { available: true });
  
  // Score-based matching
  for (const food of allFoods) {
    // Exact match: "Hainanese Chicken Rice" in speech
    if (textLower.includes(food.dish.toLowerCase())) {
      matchedFoods.push({ food, score: 10 });
    }
    
    // Partial match: "chicken" matches "Hainanese Chicken Rice"
    const dishWords = food.dish.toLowerCase().split(' ');
    for (const word of dishWords) {
      if (word.length > 3 && textLower.includes(word)) {
        matchScore += 2;
      }
    }
  }
  
  // Return top matches sorted by score and rating
  return sortedMatches.slice(0, 3);
}
```

#### 4. **Shared State Management** (`VoiceAssistantContext.jsx`)

Recommendations are shared globally:

```javascript
const [sharedRecommendations, setSharedRecommendations] = useState([]);

const updateRecommendations = (recommendations) => {
  setSharedRecommendations(recommendations);
};
```

This allows:
- Voice modal to display cards while talking
- Home screen to display cards when modal closes
- Seamless state persistence

## 🎨 User Experience

### Scenario 1: Direct Recommendation
```
User: "What should I eat?"
Mom: "I recommend Hainanese Chicken Rice, it's delicious!"
[Card automatically appears with dish details]
```

### Scenario 2: Multiple Recommendations
```
User: "Give me 3 food options"
Mom: "Here are my top 3 picks: Chicken Rice, Nasi Lemak, and Laksa"
[3 cards appear with ranking badges 🥇🥈🥉]
```

### Scenario 3: Natural Conversation (NEW!)
```
User: "Yeah, I want something healthy."
Mom: "Okay, healthy ah? I see Auntie Ling got steamed herbal chicken, 
      no oil one. Or Chef Jia got tofu basil stir-fry, also high protein. 
      Which one you prefer?"
[Cards for both dishes appear automatically! 🎯]
```

### Scenario 4: Partial Mentions
```
User: "I want chicken"
Mom: "Perfect! How about chicken rice or chicken curry?"
[Cards for all chicken dishes appear]
```

## 📍 Detection Patterns

### Direct Recommendations
- "I **recommend**..."
- "I **suggest**..."
- "**Try** this..."
- "**How about**..."
- "**Here are** my top 3..."

### Natural Conversational Patterns (NEW! 🎯)
- "Auntie/Uncle/Chef **got** [food]"
- "**Got** chicken/rice/noodles/tofu..."
- "**Which one you prefer**?"
- "**Or** [person] got [food]"
- "Can **try/eat/order**..."
- "**Available** now..."
- "**Serving** [food]..."
- "On the **menu**..."
- "This **dish**..."

### Example Detection:
```
"I see Auntie Ling got steamed herbal chicken"
       ↓
Matches: /(?:auntie|uncle|chef).*got/i ✅
Matches: /got.*chicken/i ✅
       ↓
Triggers food parsing!
```

## 📍 Matching Logic

### Exact Match (Score: 10)
- Direct dish name mention
- Example: "Hainanese Chicken Rice" → matches exactly

### Partial Match (Score: 2 per word)
- Individual word matching (min 4 characters)
- Example: "chicken" → matches "Hainanese Chicken Rice", "Chicken Curry", etc.

### Fallback (No Match)
- Returns top-rated dishes
- Ensures users always see recommendations

## 🔗 API Endpoint

### POST `/api/voice-agent/parse-food-mentions`

**Request:**
```json
{
  "text": "I recommend trying Hainanese Chicken Rice, Nasi Lemak, or Laksa",
  "limit": 3
}
```

**Response:**
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
      "rating": 5.0,
      "diet": "Non-Vegetarian",
      "tags": "Popular, Local"
    },
    // ... 2 more items
  ],
  "message": "Found 3 matching food items."
}
```

## 🧠 Memory Integration

The system stores interactions in Mem0:

```javascript
await mem0Service.storeMemory(userId, {
  action: 'food_mention_detected',
  text: text.substring(0, 100),
  matched_items: ['Chicken Rice', 'Nasi Lemak', 'Laksa']
});
```

This allows Mom to:
- Learn user preferences over time
- Remember which dishes were mentioned
- Provide better recommendations in future conversations

## 🎯 Key Features

✅ **Real-time Detection**: Cards appear as Mom speaks
✅ **Intelligent Matching**: Both exact and partial word matching
✅ **Multi-level Fallback**: Always shows something relevant
✅ **Persistent State**: Cards remain visible on home screen
✅ **Memory Tracking**: Learns from every interaction
✅ **Ranking Display**: Shows top picks with medal icons 🥇🥈🥉
✅ **Click to Order**: Tap any card to navigate to food details

## 🧪 Testing

### Manual Test
1. Open the app, click the big mic on home screen
2. Say: "What should I eat?"
3. Mom will respond with food recommendations
4. Watch cards automatically appear!
5. Close the modal - cards persist on home screen

### Quick Demo Test
1. Open voice modal
2. Click "👀 Preview Food Cards" button
3. See sample cards appear instantly

## 🚀 Next Steps

Potential enhancements:
- Expand to cleaning services mentions
- Support exchange item mentions
- Add dietary restriction parsing ("vegetarian", "halal")
- Multi-language food name detection
- Confidence scoring display
- Voice feedback when cards appear

## 📝 Code Files

| File | Purpose |
|------|---------|
| `src/components/VoiceAssistantModal.jsx` | Frontend speech parsing & display |
| `backend/src/controllers/voiceAgentController.js` | Backend matching logic |
| `backend/src/routes/voiceAgentRoutes.js` | API route registration |
| `src/contexts/VoiceAssistantContext.jsx` | Shared state management |
| `src/components/HomeScreen.jsx` | Displays persistent cards |

---

**Built with ❤️ for a better Mom experience!**

