# Mem0 Integration Guide

## Overview

Mom now has memory! The Mem0 integration enables Mom to learn from past conversations and remember user preferences across both text chat and voice interactions. This creates a more personalized, contextual experience for authenticated users.

## Features

- **Automatic Memory Storage**: Every text chat and voice interaction is automatically stored as a memory
- **Contextual Retrieval**: Relevant memories are retrieved based on current conversation context
- **Cross-Platform Learning**: Memories are shared between text chat and voice assistant
- **User-Controlled**: Users can view, search, and delete their memories
- **Intent-Aware**: Memories are tagged with intent (food, cleaning, exchange, general) for better organization

## Setup

### 1. Get Mem0 API Key

1. Visit [https://app.mem0.ai/](https://app.mem0.ai/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key

### 2. Configure Environment Variables

Add the following to your `backend/.env` file:

```bash
# Mem0 Configuration
MEM0_API_KEY=your_mem0_api_key_here
MEM0_USER_ID_PREFIX=mom_user_
```

### 3. Restart Backend Server

```bash
cd backend
npm run dev
```

You should see:
```
✅ Mem0 memory service initialized
```

If the API key is missing, you'll see:
```
⚠️  MEM0_API_KEY not set. Memory learning features will be disabled.
```

## How It Works

### Memory Storage

**Text Chat (AI Agent Service)**
- Every conversation is stored with:
  - User message
  - Assistant response
  - Intent (food/cleaning/exchange/general)
  - Emotion detected
  - Timestamp
  - Type: `text_chat`

**Voice Interactions**
- Search actions store:
  - Action type (search_food, search_cleaning, search_exchange)
  - Search parameters
  - Results returned
  - Type: `voice_interaction`

- Booking/Claiming actions store:
  - Action details
  - Special requests or messages
  - Type: `voice_interaction`

### Memory Retrieval

When a user sends a message or makes a voice request:
1. Mem0 retrieves the 3-5 most relevant memories based on semantic similarity
2. Memories are passed to Gemini as context
3. Gemini uses this context to personalize responses

**Example:**
```
User (previous): "I'm vegetarian and allergic to nuts"
User (current): "I'm hungry"
Mom: "Okay lah, let me find you some good vegetarian food without nuts..."
```

## API Endpoints

All memory endpoints require authentication.

### Get All Memories
```http
GET /api/memory
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "mem_123",
      "memory": "User prefers vegetarian food",
      "metadata": {
        "intent": "food",
        "type": "text_chat",
        "stored_at": "2025-01-15T10:30:00Z"
      }
    }
  ],
  "count": 1
}
```

### Search Memories
```http
GET /api/memory/search?q=food%20preferences&limit=5
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [...],
  "count": 3,
  "query": "food preferences"
}
```

### Get Memory Statistics
```http
GET /api/memory/stats
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 25,
    "byType": {
      "text_chat": 15,
      "voice_interaction": 10
    },
    "byIntent": {
      "food": 10,
      "cleaning": 8,
      "exchange": 5,
      "general": 2
    },
    "oldestMemory": "2025-01-01T00:00:00Z",
    "newestMemory": "2025-01-15T10:30:00Z"
  }
}
```

### Delete a Memory
```http
DELETE /api/memory/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Memory deleted successfully"
}
```

### Clear All Memories
```http
DELETE /api/memory
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Cleared 25 memories",
  "count": 25
}
```

## Integration Points

### 1. AI Agent Service (`backend/src/services/aiAgentService.js`)

**Memory Retrieval** (line ~44):
```javascript
const memories = await mem0Service.retrieveMemories(userId, userMessage, 5);
const memoryContext = memories.map(m => m.memory || m.text || JSON.stringify(m)).join('\n');
```

**Memory Storage** (line ~99):
```javascript
await mem0Service.storeMemory(userId, {
  user: userMessage,
  assistant: response.text,
}, {
  intent: intent.intent,
  emotion: intent.emotion,
  timestamp: new Date().toISOString(),
  type: 'text_chat',
});
```

### 2. Voice Agent Controller (`backend/src/controllers/voiceAgentController.js`)

Each voice action method (searchFood, searchCleaningSlots, searchExchangeItems, bookCleaningSlot, claimExchangeItem) now:

1. **Retrieves memories** at the start:
```javascript
const userId = req.user?.id || req.body.userId;
if (userId) {
  const memories = await mem0Service.retrieveMemories(userId, 
    `food preferences: ${searchTerm || ''}`, 3);
}
```

2. **Stores interactions** after successful actions:
```javascript
if (userId) {
  await mem0Service.storeMemory(userId, {
    action: 'search_food',
    parameters: req.body,
    result: formattedResults,
  }, {
    type: 'voice_interaction',
    intent: 'food',
    timestamp: new Date().toISOString(),
  });
}
```

### 3. Gemini Service (`backend/src/utils/gemini.js`)

The system prompt now includes memory context (line ~144):
```javascript
const memorySection = context.userMemories 
  ? `\nWhat you remember about this user:\n${context.userMemories}\n\nUse this context to personalize your response naturally.`
  : '\nNo previous interactions yet. Get to know this user through this conversation.';
```

## Usage Examples

### Example 1: Learning Food Preferences

**Conversation 1:**
```
User: "I'm vegetarian and I don't like spicy food"
Mom: "Okay noted! Let me remember that you're vegetarian and don't like spicy..."
[Stored as memory]
```

**Conversation 2 (next day):**
```
User: "What's for lunch?"
Mom: "Lah, I remember you're vegetarian and don't like spicy. Let me find some mild vegetarian dishes for you..."
[Memory retrieved and used]
```

### Example 2: Voice Assistant Learning

**Voice Interaction 1:**
```
User: "Find pet-friendly cleaning services for evening"
[Stores: search_cleaning with petFriendly=true, timeWindow=evening]
```

**Voice Interaction 2:**
```
User: "Book cleaning"
[Retrieves memory, suggests pet-friendly evening slots automatically]
```

## Memory Management UI (Optional Enhancement)

You can add a memory management section to `src/components/ProfileScreen.jsx`:

```jsx
const [memories, setMemories] = useState([]);

useEffect(() => {
  fetchMemories();
}, []);

const fetchMemories = async () => {
  const response = await fetch(`${API_URL}/memory`, {
    credentials: 'include',
  });
  const data = await response.json();
  if (data.success) {
    setMemories(data.data);
  }
};

const deleteMemory = async (memoryId) => {
  await fetch(`${API_URL}/memory/${memoryId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  fetchMemories();
};
```

## Privacy & Data Control

- **User-Scoped**: Each user's memories are isolated with a prefix (`mom_user_{userId}`)
- **Authenticated Only**: Only authenticated users have memories stored
- **User Control**: Users can view and delete their memories at any time
- **Transparent**: Memory storage happens automatically but users maintain full control

## Troubleshooting

### Memories Not Being Stored

1. **Check API Key**: Ensure `MEM0_API_KEY` is set in `.env`
2. **Check Logs**: Look for "💾 Memory stored" in console
3. **Check Authentication**: Memories only work for authenticated users
4. **Check Service Status**: Look for "✅ Mem0 memory service initialized" on startup

### Memories Not Being Retrieved

1. **Check User ID**: Ensure the user is authenticated
2. **Check Logs**: Look for "🔍 Retrieved X memories" in console
3. **Check Memory Count**: Use `/api/memory/stats` to see if memories exist
4. **Check Semantic Match**: Mem0 uses semantic search; exact matches may not be required

### Performance Issues

- Mem0 API calls are asynchronous and non-blocking
- Failed memory operations don't crash the app (graceful degradation)
- Memory retrieval is limited to 3-5 most relevant items

## Best Practices

1. **Meaningful Context**: Store rich context in memories, not just raw data
2. **Appropriate Metadata**: Use intent, emotion, and timestamps for better organization
3. **User Transparency**: Let users know Mom is learning from their interactions
4. **Respect Privacy**: Allow users to delete memories they don't want stored
5. **Graceful Degradation**: The app works perfectly fine without Mem0 if the API key is missing

## Next Steps

- [ ] Add memory visualization in Profile screen
- [ ] Add export memories feature
- [ ] Add memory categories/tags UI
- [ ] Implement memory importance scoring
- [ ] Add periodic memory consolidation

## Resources

- [Mem0 Documentation](https://docs.mem0.ai/)
- [Mem0 Dashboard](https://app.mem0.ai/)
- [Mem0 GitHub](https://github.com/mem0ai/mem0)

