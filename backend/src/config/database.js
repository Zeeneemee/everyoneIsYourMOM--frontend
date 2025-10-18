import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  convex: {
    url: process.env.CONVEX_URL,
  },
  
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    model: process.env.GEMINI_MODEL || 'gemini-2.0-flash-exp',
    temperature: parseFloat(process.env.AI_AGENT_TEMPERATURE) || 0.7,
    maxTokens: parseInt(process.env.AI_AGENT_MAX_TOKENS) || 500,
  },
  
  openai: {
    apiKey: process.env.OPENAI_API_KEY, // Optional, only for Whisper STT
  },
  
  elevenlabs: {
    apiKey: process.env.ELEVENLABS_API_KEY,
    voiceId: process.env.ELEVENLABS_VOICE_ID,
  },
  
  cors: {
    origins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'],
  },
};

// Validate required environment variables
export const validateConfig = () => {
  // Only CONVEX_URL is required for basic functionality
  const required = [
    'CONVEX_URL',
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please add CONVEX_URL to your .env file.'
    );
  }
  
  // Warn about optional features
  if (!process.env.GEMINI_API_KEY) {
    console.warn('⚠️  GEMINI_API_KEY not set. AI agent features will be disabled.');
  }
  if (!process.env.ELEVENLABS_API_KEY) {
    console.warn('⚠️  ELEVENLABS_API_KEY not set. Text-to-speech will be disabled.');
  }
  if (!process.env.OPENAI_API_KEY) {
    console.warn('⚠️  OPENAI_API_KEY not set. Speech-to-text will be disabled.');
  }
};

