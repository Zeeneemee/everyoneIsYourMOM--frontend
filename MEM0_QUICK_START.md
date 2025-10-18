# Mem0 Integration - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Get Your Mem0 API Key

1. Go to [https://app.mem0.ai/](https://app.mem0.ai/)
2. Sign up for a free account
3. Navigate to the API Keys section
4. Create a new API key and copy it

### Step 2: Configure Backend

Add to your `backend/.env` file:

```bash
MEM0_API_KEY=your_api_key_here
MEM0_USER_ID_PREFIX=mom_user_
```

### Step 3: Start Backend

```bash
cd backend
npm run dev
```

Look for this message:
```
✅ Mem0 memory service initialized
```

### Step 4: Test It!

Run the test script:
```bash
cd backend
npm run test:mem0
```

You should see all tests pass! ✅

## 🎉 That's It!

Mom now has memory! Try these:

### Text Chat Test
```bash
# First conversation
curl -X POST http://localhost:3001/api/ai/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"message": "I love vegetarian food and hate spicy things"}'

# Second conversation (Mom will remember!)
curl -X POST http://localhost:3001/api/ai/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"message": "What should I eat for lunch?"}'
```

Mom will remember your preferences and suggest vegetarian, non-spicy options! 🎯

### View Your Memories
```bash
curl http://localhost:3001/api/memory \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📚 What's Next?

- Read [MEM0_SETUP_GUIDE.md](./MEM0_SETUP_GUIDE.md) for detailed documentation
- Read [MEM0_IMPLEMENTATION_SUMMARY.md](./MEM0_IMPLEMENTATION_SUMMARY.md) for technical details
- Read [FRONTEND_MEMORY_EXAMPLE.md](./FRONTEND_MEMORY_EXAMPLE.md) for UI examples

## 🔧 Troubleshooting

**Problem:** "Mem0 service disabled"  
**Solution:** Add `MEM0_API_KEY` to your `.env` file

**Problem:** Memories not storing  
**Solution:** Make sure user is authenticated (has valid JWT token)

**Problem:** Can't find memories  
**Solution:** Check `/api/memory/stats` to see if any memories exist

## 💡 Key Features

- ✅ Learns from every conversation
- ✅ Works with text chat AND voice
- ✅ Remembers across sessions
- ✅ Fully private per user
- ✅ User can delete memories
- ✅ Graceful degradation (works without API key)

## 🎨 Optional: Add UI

See [FRONTEND_MEMORY_EXAMPLE.md](./FRONTEND_MEMORY_EXAMPLE.md) for ready-to-use React components to:
- View memories
- Search memories
- Delete memories
- Show memory statistics

Enjoy your smart, learning Mom! 🧠❤️

