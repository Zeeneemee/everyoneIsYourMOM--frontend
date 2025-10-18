# Migration from OpenAI GPT to Google Gemini

## Why Gemini 2.0 Flash?

**Cost Savings:**
- **Gemini 2.0 Flash**: ~$0.075 per 1M input tokens, $0.30 per 1M output tokens
- **GPT-4 Turbo**: ~$10 per 1M input tokens, $30 per 1M output tokens
- **Savings**: ~130x cheaper! 💰

**Performance:**
- Similar quality for conversational AI
- Faster response times
- Better multilingual support
- Excellent for Singlish/Southeast Asian languages

## What Changed?

### 1. Package Dependencies
```diff
- "openai": "^4.28.0"
+ "@google/generative-ai": "^0.21.0"
```

### 2. Environment Variables
```diff
- OPENAI_API_KEY=sk-...
- OPENAI_MODEL=gpt-4-turbo-preview

+ GEMINI_API_KEY=your_gemini_api_key
+ GEMINI_MODEL=gemini-2.0-flash-exp

+ # Optional: Only if you need Whisper STT
+ OPENAI_API_KEY=sk-...
```

### 3. Service Files
- `src/utils/openai.js` → Split into:
  - `src/utils/gemini.js` (for text generation)
  - `src/utils/whisper.js` (for speech-to-text only)

### 4. Import Updates
All controllers and services now import:
```javascript
import { geminiService } from '../utils/gemini.js';
import { whisperService } from '../utils/whisper.js'; // For STT only
```

## Getting Your Gemini API Key

### Option 1: Google AI Studio (Recommended for Development)

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click "Get API Key" in the top right
4. Click "Create API Key"
5. Choose "Create API key in new project"
6. Copy your API key

**Free Tier:**
- 15 requests per minute
- 1 million tokens per minute
- 1,500 requests per day
- Perfect for development!

### Option 2: Google Cloud Platform (for Production)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable "Generative Language API"
4. Go to "Credentials"
5. Create an API key
6. Copy your API key

**Pricing:**
- Pay-as-you-go
- Much cheaper than OpenAI
- Better for production scale

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

This will install `@google/generative-ai` package.

### 2. Update Environment Variables

```bash
# Edit your .env file
nano .env
```

Add your Gemini API key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.0-flash-exp
```

**Optional:** If you want to keep using Whisper for speech-to-text:
```env
OPENAI_API_KEY=your_openai_key  # Only for Whisper STT
```

### 3. Test the Migration

```bash
npm run dev
```

### 4. Test AI Chat

```bash
curl -X POST http://localhost:3001/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I am hungry and want something vegetarian"
  }'
```

You should get a response from Gemini!

## Speech-to-Text Options

Since Gemini doesn't have built-in STT, you have several options:

### Option 1: Keep Using OpenAI Whisper (Current Setup)

**Pros:**
- Already integrated
- Excellent accuracy
- Relatively cheap ($0.006 per minute)

**Cons:**
- Still requires OpenAI API key
- Additional dependency

**Setup:**
```env
OPENAI_API_KEY=your_openai_key
```

### Option 2: Google Cloud Speech-to-Text

**Pros:**
- Native Google integration
- Same billing as Gemini
- Excellent for multiple languages

**Cons:**
- More complex setup
- Requires Google Cloud project

**Implementation:**
```javascript
// Install: npm install @google-cloud/speech
import speech from '@google-cloud/speech';
const client = new speech.SpeechClient();
```

### Option 3: Web Speech API (Client-side)

**Pros:**
- Free
- No backend processing
- Works in browser

**Cons:**
- Client-side only
- Browser compatibility
- Less accurate

**Frontend Implementation:**
```javascript
const recognition = new webkitSpeechRecognition();
recognition.start();
```

### Option 4: AssemblyAI

**Pros:**
- Affordable
- Good accuracy
- Easy to integrate

**Cons:**
- Another third-party service
- Additional API key

## API Changes

### Before (OpenAI)
```javascript
const response = await openAIService.chat(messages);
```

### After (Gemini)
```javascript
const response = await geminiService.chat(messages);
```

The interface is the same! 🎉

## Features Preserved

✅ **Intent Analysis** - Working with Gemini
✅ **Mom Response Generation** - Working with Gemini
✅ **Natural Language Processing** - Working with Gemini
✅ **Emotional Intelligence** - Working with Gemini
✅ **Context Awareness** - Working with Gemini
⚠️ **Speech-to-Text** - Requires OpenAI or alternative
✅ **Text-to-Speech** - Still using ElevenLabs

## Performance Comparison

### Response Time
- **GPT-4 Turbo**: ~2-3 seconds
- **Gemini 2.0 Flash**: ~1-2 seconds ⚡

### Quality for "Mom" Persona
Both models handle the Singaporean mom character well, but Gemini has:
- Better understanding of Singlish
- More natural Southeast Asian language patterns
- Good at maintaining character consistency

## Cost Comparison Example

For 1 million AI requests (average 500 tokens each):

**OpenAI GPT-4 Turbo:**
- Input: 500M tokens × $10/1M = $5,000
- Output: 200M tokens × $30/1M = $6,000
- **Total: $11,000**

**Google Gemini 2.0 Flash:**
- Input: 500M tokens × $0.075/1M = $37.50
- Output: 200M tokens × $0.30/1M = $60
- **Total: $97.50**

**Savings: $10,902.50 (99.1% reduction!)** 💰💰💰

## Troubleshooting

### Error: "API key not valid"

**Solution:**
1. Check your Gemini API key is correct
2. Ensure you've enabled the Generative Language API
3. Try regenerating your API key

### Error: "Rate limit exceeded"

**Solution:**
1. If using free tier, wait 1 minute
2. For production, upgrade to paid tier
3. Implement request queuing

### Error: "Model not found"

**Solution:**
1. Check model name is correct: `gemini-2.0-flash-exp`
2. Some models may not be available in all regions
3. Try `gemini-1.5-flash` as fallback

### Responses are different from GPT-4

This is normal! Gemini has a different "personality". You can adjust:
1. Temperature (try 0.6-0.8)
2. System prompts
3. Few-shot examples

## Rollback Plan

If you need to rollback to OpenAI:

1. Revert package.json:
```bash
npm install openai@^4.28.0
npm uninstall @google/generative-ai
```

2. Restore files from git:
```bash
git checkout HEAD -- src/utils/openai.js
git checkout HEAD -- src/services/aiAgentService.js
```

3. Update .env:
```env
OPENAI_API_KEY=your_openai_key
OPENAI_MODEL=gpt-4-turbo-preview
```

## Best Practices

### 1. Error Handling
Always wrap Gemini calls in try-catch:
```javascript
try {
  const response = await geminiService.chat(messages);
} catch (error) {
  // Fallback to template response
}
```

### 2. Prompt Engineering
Gemini responds well to:
- Clear system instructions
- Structured output formats (JSON)
- Few-shot examples

### 3. Rate Limiting
Implement exponential backoff for retries:
```javascript
const retry = async (fn, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(r => setTimeout(r, 1000 * Math.pow(2, i)));
    }
  }
};
```

## Next Steps

1. ✅ Test all AI endpoints
2. ✅ Monitor response quality
3. ✅ Adjust prompts if needed
4. ⏳ Consider client-side STT to remove OpenAI dependency entirely
5. ⏳ Set up usage monitoring in Google Cloud Console

## Support

If you encounter issues:
1. Check [Gemini API docs](https://ai.google.dev/docs)
2. Review error logs in console
3. Test with simple prompts first
4. Check API quotas in Google Cloud Console

## Summary

✅ **130x cheaper** than GPT-4
✅ **Faster** response times
✅ **Better** for Singlish/Asian languages
✅ **Same** developer experience
✅ **Easy** migration

The migration is complete and your AI Mom is now powered by Gemini! 🚀

