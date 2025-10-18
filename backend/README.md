# Everyone Is Your Mom - Backend API

Backend server for the "Everyone Is Your Mom" application - an AI-powered voice-enabled community assistant for condo residents in Singapore.

## 🏗️ Architecture

This backend follows the **MVC (Model-View-Controller)** pattern with clean separation of concerns:

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── db/              # Drizzle ORM setup, schema, migrations
│   ├── models/          # Data models (M in MVC)
│   ├── controllers/     # Business logic controllers (C in MVC)
│   ├── routes/          # API route definitions
│   ├── services/        # AI Agent and business services
│   ├── utils/           # Utility functions (OpenAI, ElevenLabs, etc.)
│   └── middleware/      # Express middleware
├── server.js            # Main server entry point
├── drizzle.config.js    # Drizzle ORM configuration
└── package.json         # Dependencies
```

## 🚀 Features

### Core Functionality
- **Food Recommendations**: AI-powered food matching based on dietary preferences, allergens, and proximity
- **Cleaning Services**: Smart cleaning slot booking with pet-friendly options
- **Item Exchange**: Community marketplace for donating, exchanging, or selling items
- **Voice Interaction**: Speech-to-text and text-to-speech with Singaporean mom persona
- **AI Agent**: Natural language processing with emotional intelligence

### Technologies
- **Database**: PostgreSQL (via Supabase) with Drizzle ORM
- **AI/ML**: OpenAI GPT-4 for NLP, OpenAI Whisper for speech-to-text
- **Voice**: ElevenLabs for text-to-speech with customizable voices
- **Backend**: Node.js with Express
- **Type Safety**: Drizzle ORM with schema definitions

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database (Supabase recommended)
- OpenAI API key
- ElevenLabs API key

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp env.example .env
```

Edit `.env` with your credentials:

```env
# Database (Get from Supabase Dashboard -> Settings -> Database)
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres

# Supabase
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4-turbo-preview

# ElevenLabs
ELEVENLABS_API_KEY=your_elevenlabs_api_key
ELEVENLABS_VOICE_ID=your_voice_id

# Server
PORT=3001
ALLOWED_ORIGINS=http://localhost:5173
```

### 3. Set Up Database

#### Generate Migration Files

```bash
npm run db:generate
```

#### Run Migrations

```bash
npm run db:migrate
```

#### Seed Initial Data

```bash
node src/db/seed.js
```

### 4. Start the Server

**Development mode** (with auto-reload):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

The server will start on `http://localhost:3001`

## 📚 API Documentation

### Base URL
```
http://localhost:3001/api
```

### Endpoints Overview

#### Health Check
```http
GET /api/health
```

#### 🍽️ Food API
```http
GET    /api/food                    # Get all food items
GET    /api/food/search            # Search food by criteria
GET    /api/food/recommendations   # Get personalized recommendations
GET    /api/food/nearby            # Get nearby food options
GET    /api/food/:id               # Get specific food item
POST   /api/food                   # Create food offering
PUT    /api/food/:id               # Update food offering
DELETE /api/food/:id               # Delete food offering
```

**Example - Search food:**
```bash
curl "http://localhost:3001/api/food/search?diet=vegetarian&excludeAllergens=nuts"
```

#### ✨ Cleaning API
```http
GET    /api/cleaning/slots                  # Get all slots
GET    /api/cleaning/slots/search          # Search slots
GET    /api/cleaning/slots/recommendations # Get recommendations
POST   /api/cleaning/bookings              # Book a slot
GET    /api/cleaning/bookings/my           # Get user's bookings
PATCH  /api/cleaning/bookings/:id/status   # Update booking
```

**Example - Book cleaning:**
```bash
curl -X POST http://localhost:3001/api/cleaning/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "slotId": "clean_01",
    "address": "Blk A-101",
    "specialRequests": "Please bring pet-friendly products"
  }'
```

#### 📦 Exchange API
```http
GET    /api/exchange                  # Get all items
GET    /api/exchange/search           # Search items
GET    /api/exchange/recommendations  # Get recommendations
GET    /api/exchange/nearby           # Get nearby items
GET    /api/exchange/my-items         # Get user's items
POST   /api/exchange                  # Post new item
POST   /api/exchange/claims           # Claim an item
GET    /api/exchange/:id/claims       # Get item claims
PUT    /api/exchange/:id              # Update item
DELETE /api/exchange/:id              # Delete item
```

#### 🎤 Voice API
```http
POST   /api/voice/speech-to-text          # Convert audio to text
POST   /api/voice/text-to-speech          # Convert text to audio
POST   /api/voice/text-to-speech/stream   # Stream TTS
POST   /api/voice/conversation            # Complete voice flow
GET    /api/voice/voices                  # Get available voices
GET    /api/voice/voices/:voiceId         # Get voice details
```

**Example - Text to Speech:**
```bash
curl -X POST http://localhost:3001/api/voice/text-to-speech \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Aiyo, hungry again ah? I order for you lah!",
    "emotion": "caring"
  }' \
  --output mom_voice.mp3
```

**Example - Speech to Text:**
```bash
curl -X POST http://localhost:3001/api/voice/speech-to-text \
  -F "audio=@recording.mp3"
```

**Example - Complete Voice Conversation:**
```bash
curl -X POST http://localhost:3001/api/voice/conversation \
  -F "audio=@user_message.mp3"
```

#### 🤖 AI Agent API
```http
POST   /api/ai/chat                  # Chat with AI Mom
POST   /api/ai/analyze-intent        # Analyze user intent
GET    /api/ai/conversations         # Get chat history
GET    /api/ai/preferences           # Get user preferences
PUT    /api/ai/preferences           # Update preferences
GET    /api/ai/stats                 # Get user stats
POST   /api/ai/mom-points            # Update Mom Points
GET    /api/ai/mom-points/history    # Get points history
```

**Example - Chat with AI:**
```bash
curl -X POST http://localhost:3001/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I'm hungry and want something vegetarian with no nuts"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "intent": "food",
    "emotion": "hungry",
    "response": "Aiyo, hungry again ah? I got perfect one for you! Chef Jia got Tofu Basil Stir-Fry, vegetarian and no nuts. Very healthy somemore. I order for you?",
    "recommendations": [...],
    "needsFollowUp": true,
    "confidence": 0.95
  }
}
```

## 🗄️ Database Schema

### Tables

**users** - User profiles
- id, email, fullName, block, unit, phoneNumber, momPoints

**user_preferences** - User dietary and service preferences
- userId, dietaryRestrictions, allergens, preferredTags, petFriendly, etc.

**food_menu** - Available food offerings
- id, house, block, dish, tags, diet, allergens, price, eta, rating

**cleaning_slots** - Available cleaning time slots
- id, time, availableCleaner, petFriendly, price, duration

**cleaning_bookings** - Cleaning service bookings
- id, slotId, userId, status, specialRequests

**exchange_items** - Community exchange/donate/sell items
- id, ownerBlock, item, status, condition, price, category

**exchange_claims** - Item claim requests
- id, itemId, claimedBy, status, message

**user_interactions** - AI interaction history for learning
- userId, interactionType, intent, userMessage, aiResponse, emotion

**mom_points_history** - Gamification points tracking
- userId, points, reason

## 🧠 AI Agent System

The AI Agent service processes user requests through multiple stages:

### 1. Intent Analysis
Uses OpenAI GPT-4 to understand:
- User intent (food, cleaning, exchange, general)
- Entities (diet, allergens, time preferences, item types)
- Emotion (hungry, stressed, homesick, etc.)
- Urgency level

### 2. Data Retrieval
Queries relevant data based on intent:
- Food recommendations with dietary filtering
- Available cleaning slots with preferences
- Exchange items matching search criteria

### 3. Response Generation
Generates natural Singaporean mom-style responses:
- Uses predefined templates for consistency
- AI-generated responses for variety
- Emotional intelligence (caring, scolding, encouraging)

### 4. Voice Synthesis
Converts text response to natural speech:
- ElevenLabs TTS with customizable voice
- Emotion-based prosody adjustment
- Singaporean English accent

## 🎭 Mom Persona

The AI embodies a Singaporean mom character:

**Personality Traits:**
- Caring but practical
- Sometimes brutally honest
- Light use of Singlish
- Remembers user preferences
- Gently scolds when necessary

**Speech Templates** (from `data.json`):
- `hungry_found`: When food is available
- `hungry_none`: When no food matches
- `cleaning_found`: When cleaner available
- `homesick`: Comforting responses
- `scolding_rules`: Playful scolding triggers

## 🔧 Drizzle ORM Commands

```bash
# Generate new migration
npm run db:generate

# Apply migrations
npm run db:migrate

# Push schema changes directly (dev only)
npm run db:push

# Open Drizzle Studio (DB GUI)
npm run db:studio
```

## 🔐 Authentication

Currently using a placeholder auth system. For production:

1. Integrate Supabase Auth
2. Use JWT tokens
3. Implement proper user sessions
4. Add role-based access control

Example implementation in `src/middleware/authMiddleware.js`

## 🧪 Testing

Test the API with the included examples:

```bash
# Test health endpoint
curl http://localhost:3001/api/health

# Test food search
curl "http://localhost:3001/api/food/search?tags=vegetarian"

# Test AI chat
curl -X POST http://localhost:3001/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "I need cleaning service today"}'
```

## 📝 Development Notes

### Adding New Features

1. **Create Model** in `src/models/`
2. **Create Controller** in `src/controllers/`
3. **Add Routes** in `src/routes/`
4. **Update Schema** in `src/db/schema.js`
5. **Generate Migration** with `npm run db:generate`

### Logging

All interactions are logged to `user_interactions` table for:
- AI training and improvement
- User behavior analysis
- Debugging
- Analytics

## 🚨 Error Handling

The API uses consistent error responses:

```json
{
  "success": false,
  "error": "Error message here"
}
```

HTTP Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 409: Conflict
- 500: Server Error

## 📊 Performance

- Database connection pooling (max 10 connections)
- Request timeout: 30s
- File upload limit: 25MB
- JSON payload limit: 50MB

## 🔮 Future Enhancements

- [ ] Real-time notifications with WebSockets
- [ ] Image upload for food/items
- [ ] Payment integration
- [ ] Rating and review system
- [ ] Multi-language support
- [ ] Advanced recommendation algorithms
- [ ] User reputation system
- [ ] Community events and announcements

## 📄 License

ISC

## 👥 Support

For issues or questions, please open an issue on GitHub.

