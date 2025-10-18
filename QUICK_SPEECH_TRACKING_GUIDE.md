# 🎤 Quick Speech Tracking Guide

## What's New?

Mom now **automatically shows food cards** when she mentions dishes in her speech - no button clicking needed!

## How It Works

### Example Conversation:

**You:** "What should I eat?"

**Mom:** "I recommend trying Hainanese Chicken Rice, Nasi Lemak, or Laksa..."

**Result:** ✨ **3 food cards automatically appear!** ✨

---

## The Magic Behind It

### 1️⃣ **Mom Speaks**
When Mom responds, the system listens for recommendation keywords:
- "I recommend..."
- "Try this..."
- "How about..."
- "Here are my top 3..."

### 2️⃣ **Smart Matching**
The backend searches Convex for dishes mentioned:
- **Exact match**: "Hainanese Chicken Rice" → perfect match!
- **Partial match**: "chicken" → finds all chicken dishes
- **Fallback**: No match? Shows top-rated dishes

### 3️⃣ **Cards Appear**
Food cards pop up with:
- 🥇🥈🥉 Ranking badges
- Dish name, house, price
- ⭐ Rating and ⏱️ ETA
- Click to order!

### 4️⃣ **Persistent Display**
Cards stay visible:
- ✅ While talking in voice modal
- ✅ On home screen after closing modal

---

## 🧪 Try It Now!

### Option 1: With Voice
```
1. Click big mic on home screen
2. Say: "What should I eat?"
3. Watch cards appear automatically!
```

### Option 2: Quick Demo
```
1. Open voice modal
2. Click "👀 Preview Food Cards"
3. See instant cards!
```

---

## 🎯 Technical Flow

```
Mom's Speech Text
       ↓
Check for keywords (recommend, suggest, try...)
       ↓
Extract mentioned food names
       ↓
Search Convex database
       ↓
Match dishes (exact + partial)
       ↓
Display top 3 cards
       ↓
Store in memory for learning
```

---

## 📡 New API Endpoint

**POST** `/api/voice-agent/parse-food-mentions`

```json
{
  "text": "I recommend Chicken Rice and Nasi Lemak",
  "limit": 3
}
```

Returns matching food items from Convex!

---

## 🔑 Key Features

✅ Real-time speech parsing
✅ Intelligent dish matching
✅ Automatic card display
✅ No manual button clicks
✅ Shared state (modal + home)
✅ Memory tracking for personalization

---

## 🎨 Visual Experience

When Mom recommends food, you'll see:

```
┌─────────────────────────────────────┐
│ 🍽️ Mom's Recommendations for You:  │
├─────────────────────────────────────┤
│ 🥇 Hainanese Chicken Rice          │
│    From Auntie Mei                  │
│    ⭐ 5.0  |  $6.50  |  20 min     │
├─────────────────────────────────────┤
│ 🥈 Nasi Lemak                       │
│    From Uncle Wong                  │
│    ⭐ 4.8  |  $5.00  |  15 min     │
├─────────────────────────────────────┤
│ 🥉 Laksa                            │
│    From Auntie Siti                 │
│    ⭐ 4.9  |  $7.00  |  25 min     │
└─────────────────────────────────────┘
```

---

## 📁 Modified Files

1. **`src/components/VoiceAssistantModal.jsx`**
   - Added `parseAndFetchFoodMentions()` function
   - Updated `onMessage` handler to parse AI speech

2. **`backend/src/controllers/voiceAgentController.js`**
   - Added `parseFoodMentions()` method
   - Implements intelligent matching algorithm

3. **`backend/src/routes/voiceAgentRoutes.js`**
   - Added `/parse-food-mentions` endpoint

---

## 🚀 What's Next?

Future enhancements:
- Support cleaning service mentions
- Support exchange item mentions
- Multi-language detection
- Dietary restriction parsing
- Voice confirmation feedback

---

**Enjoy your smarter Mom! 🎉**

