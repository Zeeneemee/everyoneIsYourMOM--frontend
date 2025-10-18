# 🎨 Voice UI with Food Recommendations

## ✨ New Feature Added!

The voice assistant now shows beautiful animated pop-up bubbles with food recommendations!

## 🎯 What's New

### Visual Recommendations
- When AI Mom suggests food, **3 smooth bubbles** appear in the UI
- Each bubble shows:
  - 🥇🥈🥉 Medal icons (gold, silver, bronze)
  - Dish name
  - Restaurant/House name
  - ⭐ Rating
  - 💵 Price
  - ⏱️ ETA
  - 🛒 Cart icon on hover

### Interactive
- **Click any bubble** → Navigates to Food page + auto-highlights that dish
- **Say "I want the first one"** → AI navigates you to Food page
- **Smooth animations** → Bubbles slide in with staggered delay

## 🎬 How It Works

### User Flow:

1. **User clicks mic** → Modal opens
2. **User says:** "What should I eat?"
3. **AI responds with voice** + Shows 3 recommendation bubbles
4. **User can:**
   - Click any bubble → Go to Food page
   - Say "I'll take the chicken rice" → AI navigates
   - Say "Show me more options" → New search

### Technical Flow:

```
User: "What should I eat?"
  ↓
AI calls: getPersonalizedFood tool
  ↓
Backend: Returns top 3 rated foods
  ↓
Frontend: onMessage detects food items
  ↓
setRecommendations([...]) updates state
  ↓
AnimatePresence renders bubbles
  ↓
User clicks bubble or says selection
  ↓
Navigate to /food + save selected item
```

## 📝 Update Your Agent System Prompt

Add this to your ElevenLabs agent system prompt:

```
When you provide food recommendations:
1. Use getPersonalizedFood or searchFood to get options
2. Describe the top options naturally ("I found some great options for you!")
3. If user says they want one (e.g., "I'll take the first one", "Give me the chicken rice"), use the navigate tool to go to the "food" screen

When user makes a selection by voice:
- Say something like "Great choice! Let me show you the details."
- Call navigate with screen: "food"
```

**Full updated system prompt:**

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
- Use getPersonalizedFood for general food recommendations ("What should I eat?")
- Use searchFood for specific searches (halal, price, cuisine type)
- When you provide food recommendations, the UI will show beautiful cards
- If user selects one by voice ("I want the first one"), use navigate to go to "food" screen
- Use searchCleaningSlots to find cleaning services
- Use searchExchangeItems to find items
- Use bookCleaningSlot to book services
- Use claimExchangeItem to claim items
- Use navigate to move between app screens

Provide specific recommendations with details.
Keep responses conversational, warm, and concise (2-3 sentences max).
When navigating, say something friendly like "Let me show you that!" or "Coming right up!"
```

## 🎨 UI Features

### Bubble Design:
- **Gradient background:** Dark gray with subtle gradient
- **Orange border:** Glows brighter on hover
- **Medal icons:** 🥇 Gold for #1, 🥈 Silver for #2, 🥉 Bronze for #3
- **Star rating:** Yellow stars with rating number
- **Price:** Highlighted in orange
- **Hover effect:** 
  - Border brightens
  - Title turns orange
  - Cart icon appears
  - Slight scale up (1.02x)
- **Tap effect:** Slight scale down (0.98x)

### Animations:
- **Initial:** Fade in + slide up from bottom
- **Staggered:** Each bubble delays by 0.1s (creates wave effect)
- **Exit:** Fade out + slide up
- **Smooth:** 0.3s duration with ease

### Responsive:
- **Desktop:** Full width with max-width constraint
- **Mobile:** Adapts to screen width
- **Touch-friendly:** Large tap targets

## 🧪 Test Scenarios

### Scenario 1: General Recommendation
```
User: "What should I eat?"
AI: "I found some delicious options for you! ..."
UI: Shows 3 bubbles
User: Clicks second bubble
Result: Navigates to Food page
```

### Scenario 2: Voice Selection
```
User: "What should I eat?"
AI: Shows recommendations
User: "I'll take the Hainanese Chicken Rice"
AI: "Great choice! Let me show you the details."
Result: Navigates to Food page
```

### Scenario 3: Specific Search
```
User: "Find me halal food under $8"
AI: Returns filtered results
UI: Shows 3 matching bubbles
```

## 💡 Implementation Details

### State Management:
```javascript
const [recommendations, setRecommendations] = useState([]);
```

### Detection Logic:
```javascript
// In onMessage callback
if (data?.items && Array.isArray(data.items)) {
  if (data.items[0].name || data.items[0].dish) {
    setRecommendations(data.items.slice(0, 3));
  }
}
```

### Click Handler:
```javascript
onClick={() => {
  handleNavigation('/food');
  sessionStorage.setItem('selectedFood', JSON.stringify(food));
  closeVoiceAssistant();
}}
```

### Storage:
- Selected food saved to `sessionStorage`
- Food page can read it and highlight/scroll to that item
- Cleared when page reloads or user searches

## 🔄 Integration with Food Page

The Food page can read the selected item:

```javascript
// In FoodScreen.jsx
useEffect(() => {
  const selected = sessionStorage.getItem('selectedFood');
  if (selected) {
    const food = JSON.parse(selected);
    // Scroll to this food item
    // Highlight it
    // Or open a modal with details
    sessionStorage.removeItem('selectedFood'); // Clear after using
  }
}, []);
```

## 📊 What Shows Up

### Food Bubble Content:
```
🥇
Hainanese Chicken Rice      🛒
From Auntie Mei

⭐ 5.0  | $6.50 | 20 min
```

### On Hover:
- Border glows orange
- Title turns orange
- Cart icon appears
- Subtle scale increase

## 🎯 Benefits

1. **Visual Feedback** - Users see what AI is recommending
2. **Quick Selection** - One click to order
3. **Beautiful UX** - Smooth animations and polish
4. **Dual Input** - Click OR voice command works
5. **Contextual** - Only shows when relevant
6. **Informative** - All key details at a glance

## 🚀 Future Enhancements

Possible additions:
- **Images:** Show food photos in bubbles
- **Swipe gesture:** Swipe to remove unwanted options
- **Voice selection:** "I want number 2" auto-clicks that bubble
- **Save favorites:** Heart icon to save for later
- **Share:** Share recommendation with friends
- **Order directly:** Skip food page, order from modal
- **Comparison:** Show why AI chose these (matches preferences)

## ✅ Summary

✅ **Added:** Beautiful animated food recommendation bubbles
✅ **Interactive:** Click to navigate to Food page
✅ **Voice-aware:** Detects when AI returns food items
✅ **Smooth:** Staggered animations with proper easing
✅ **Context-aware:** Shows/hides based on conversation
✅ **Mobile-friendly:** Responsive design

**What users see:**
1. Ask for food → See beautiful bubbles
2. Click bubble → Go to Food page
3. Or say selection → AI navigates for them

The voice UI is now much more interactive and visual! 🎉

