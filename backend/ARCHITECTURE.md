# Backend Architecture Documentation

## Overview

The "Everyone Is Your Mom" backend is built with a clean **MVC (Model-View-Controller)** architecture pattern, leveraging modern Node.js, Express, PostgreSQL (via Supabase), and AI services (OpenAI & ElevenLabs).

## 🏛️ Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                          │
│              (React Frontend / Voice Interface)               │
└──────────────────────┬────────────────────────────────────────┘
                       │ HTTP/REST API
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                       Express Server                          │
│                     (server.js + Routes)                      │
└──────────────────────┬────────────────────────────────────────┘
                       │
           ┌───────────┼───────────┐
           │           │           │
           ▼           ▼           ▼
    ┌──────────┐ ┌──────────┐ ┌──────────┐
    │Controllers│ │Middleware│ │ Services │
    └─────┬────┘ └──────────┘ └────┬─────┘
          │                         │
          │                         ▼
          │                  ┌─────────────┐
          │                  │  AI Agent   │
          │                  └─────────────┘
          ▼
    ┌──────────┐
    │  Models  │
    └─────┬────┘
          │
          ▼
    ┌──────────────────┐
    │  Drizzle ORM     │
    └─────┬────────────┘
          │
          ▼
    ┌──────────────────┐
    │  PostgreSQL      │
    │  (Supabase)      │
    └──────────────────┘

External Services:
- OpenAI (GPT-4, Whisper)
- ElevenLabs (TTS)
```

## 📁 Directory Structure

```
backend/
│
├── server.js                    # Express server entry point
├── drizzle.config.js            # Drizzle ORM configuration
├── package.json                 # Dependencies and scripts
├── .env                         # Environment variables (gitignored)
│
└── src/
    ├── config/
    │   └── database.js          # Configuration loader and validator
    │
    ├── db/
    │   ├── index.js             # Database connection and Drizzle setup
    │   ├── schema.js            # Database schema definitions
    │   ├── migrate.js           # Migration runner
    │   ├── seed.js              # Database seeding script
    │   └── migrations/          # Generated migration files
    │
    ├── models/                  # Data access layer (M in MVC)
    │   ├── foodModel.js
    │   ├── cleaningModel.js
    │   ├── exchangeModel.js
    │   └── userModel.js
    │
    ├── controllers/             # Business logic layer (C in MVC)
    │   ├── foodController.js
    │   ├── cleaningController.js
    │   ├── exchangeController.js
    │   ├── voiceController.js
    │   └── aiController.js
    │
    ├── services/                # Complex business services
    │   └── aiAgentService.js
    │
    ├── routes/                  # API endpoint definitions (V in MVC)
    │   ├── index.js
    │   ├── foodRoutes.js
    │   ├── cleaningRoutes.js
    │   ├── exchangeRoutes.js
    │   ├── voiceRoutes.js
    │   └── aiRoutes.js
    │
    ├── utils/                   # Utility functions and external integrations
    │   ├── supabase.js          # Supabase client (legacy)
    │   ├── openai.js            # OpenAI API wrapper
    │   └── elevenlabs.js        # ElevenLabs API wrapper
    │
    └── middleware/              # Express middleware
        ├── errorHandler.js      # Error handling
        └── authMiddleware.js    # Authentication/authorization
```

## 🎯 Component Responsibilities

### 1. Server Layer (`server.js`)
**Responsibility:** Application bootstrap and HTTP server setup

- Load environment configuration
- Initialize Express app
- Set up middleware (CORS, JSON parsing, logging)
- Mount API routes
- Start HTTP server
- Handle graceful shutdown

### 2. Configuration (`src/config/`)
**Responsibility:** Centralized configuration management

- Load and validate environment variables
- Export typed configuration objects
- Fail fast on missing required config

### 3. Database Layer (`src/db/`)
**Responsibility:** Database schema and connections

**schema.js:**
- Define all database tables using Drizzle ORM
- Type-safe schema definitions
- Relationships and constraints

**index.js:**
- Create PostgreSQL connection
- Initialize Drizzle ORM
- Export database instance

**migrate.js:**
- Run pending migrations
- Handle migration errors

**seed.js:**
- Populate database with initial data
- Load from `data.json`

### 4. Models (`src/models/`)
**Responsibility:** Data access and business logic

Each model encapsulates database operations for a specific entity:

```javascript
// Example: foodModel.js
class FoodModel {
  async getAll(filters) { }
  async getById(id) { }
  async create(data) { }
  async update(id, data) { }
  async delete(id) { }
  async searchByDiet(preferences) { }
  async getRecommendations(userId, prefs) { }
}
```

**Key Features:**
- CRUD operations
- Complex queries and filtering
- Business logic for recommendations
- Data validation

### 5. Controllers (`src/controllers/`)
**Responsibility:** Handle HTTP requests and responses

Each controller handles a specific domain:

```javascript
// Example: foodController.js
class FoodController {
  async getAllFood(req, res) {
    // 1. Extract params from req
    // 2. Call model method
    // 3. Format response
    // 4. Handle errors
  }
}
```

**Key Features:**
- Request validation
- Call appropriate models
- Format API responses
- Error handling

### 6. Services (`src/services/`)
**Responsibility:** Complex business logic and orchestration

**aiAgentService.js:**
- Process natural language messages
- Intent recognition and entity extraction
- Coordinate between multiple models
- Generate contextual responses
- Implement "Mom" personality

**Flow:**
```
User Message → Intent Analysis → Data Fetch → Response Generation → Return
```

### 7. Routes (`src/routes/`)
**Responsibility:** API endpoint definitions

Maps HTTP methods and paths to controller methods:

```javascript
// Example: foodRoutes.js
router.get('/', foodController.getAllFood);
router.post('/', foodController.createFood);
router.get('/search', foodController.searchFood);
```

### 8. Utils (`src/utils/`)
**Responsibility:** External service integrations

**openai.js:**
- GPT-4 chat completions
- Whisper speech-to-text
- Intent analysis
- Response generation

**elevenlabs.js:**
- Text-to-speech conversion
- Voice selection
- Emotion-based synthesis
- Streaming audio

### 9. Middleware (`src/middleware/`)
**Responsibility:** Request/response processing

**errorHandler.js:**
- Global error catching
- Consistent error responses
- Development vs production modes

**authMiddleware.js:**
- JWT token verification
- User identification
- Protected routes

## 🔄 Request Flow

### Example: Voice Conversation Flow

```
1. Client sends audio file
   ↓
2. Multer middleware saves file temporarily
   ↓
3. voiceController.voiceConversation()
   ├─→ OpenAI Whisper transcribes audio to text
   │
   ├─→ aiAgentService.processMessage()
   │   ├─→ Analyze intent (OpenAI GPT-4)
   │   ├─→ Fetch data (foodModel/cleaningModel/exchangeModel)
   │   └─→ Generate response (AI + templates)
   │
   ├─→ ElevenLabs TTS converts response to audio
   │
   └─→ Return JSON with text + base64 audio
   ↓
4. Client receives and plays audio
```

### Example: Food Search Flow

```
1. GET /api/food/search?diet=vegetarian&excludeAllergens=nuts
   ↓
2. foodRoutes maps to foodController.searchFood()
   ↓
3. Controller validates query params
   ↓
4. foodModel.searchByDiet({ diet: ['vegetarian'], excludeAllergens: ['nuts'] })
   ↓
5. Drizzle ORM queries PostgreSQL
   ↓
6. Results filtered and scored
   ↓
7. JSON response returned
```

## 🗄️ Data Models

### Core Entities

**User**
```typescript
{
  id: uuid
  email: string
  fullName: string
  block: string
  momPoints: number
}
```

**UserPreferences**
```typescript
{
  userId: uuid
  dietaryRestrictions: string[]
  allergens: string[]
  preferredTags: string[]
  petFriendly: boolean
}
```

**FoodMenu**
```typescript
{
  id: string
  house: string
  block: string
  dish: string
  tags: string[]
  diet: string[]
  allergens: string[]
  price: string
  rating: number
}
```

**CleaningSlot**
```typescript
{
  id: string
  time: string
  availableCleaner: string
  petFriendly: boolean
  price: string
  available: boolean
}
```

**ExchangeItem**
```typescript
{
  id: string
  ownerBlock: string
  item: string
  status: 'donate' | 'exchange' | 'sell'
  condition: string
  price?: string
}
```

## 🤖 AI Agent Architecture

### Intent Recognition Pipeline

```
User Input
   │
   ▼
┌─────────────────────┐
│ OpenAI GPT-4        │
│ Analyze Intent      │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Extract:            │
│ - Intent (food/     │
│   cleaning/exchange)│
│ - Entities          │
│ - Emotion           │
│ - Urgency           │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Route to Handler    │
│ - handleFoodIntent  │
│ - handleCleaning    │
│ - handleExchange    │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Query Database      │
│ Get Recommendations │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Generate Response   │
│ - Templates (70%)   │
│ - AI Generated(30%) │
└──────┬──────────────┘
       │
       ▼
    Response
```

### Response Generation Strategy

**Template-based (70%):**
- Predefined responses from `data.json`
- Fast and consistent
- Natural Singlish patterns
- Variable substitution

**AI-generated (30%):**
- Context-aware responses
- Handles edge cases
- More natural variation
- Personality consistency

## 🔐 Security Considerations

### Current Implementation
- Optional authentication (development mode)
- CORS configuration
- Request validation
- Error message sanitization

### Production Requirements
1. **Authentication:**
   - Supabase Auth integration
   - JWT token validation
   - Session management

2. **Authorization:**
   - Role-based access control
   - Resource ownership verification
   - Rate limiting

3. **Data Protection:**
   - Input sanitization
   - SQL injection prevention (via Drizzle ORM)
   - XSS protection
   - API key rotation

## 📊 Performance Optimization

### Database
- Connection pooling (max 10)
- Indexed columns for searches
- Query optimization with Drizzle
- Prepared statements

### API
- Request caching
- Response compression
- Pagination support
- Lazy loading

### AI Services
- Response caching for common queries
- Batch processing where possible
- Timeout handling
- Fallback mechanisms

## 🧪 Testing Strategy

### Unit Tests
- Model methods
- Utility functions
- Pure business logic

### Integration Tests
- API endpoints
- Database operations
- External service mocks

### End-to-End Tests
- Complete user flows
- Voice conversation pipeline
- Recommendation accuracy

## 🚀 Deployment Architecture

```
┌─────────────────┐
│   Load Balancer │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌──▼────┐
│Node.js│ │Node.js│
│Server │ │Server │
└───┬───┘ └──┬────┘
    │        │
    └────┬───┘
         │
    ┌────▼─────────┐
    │  Supabase    │
    │  PostgreSQL  │
    └──────────────┘

External:
- OpenAI API
- ElevenLabs API
```

## 📈 Monitoring & Logging

### Logs
- Request/response logging
- Error tracking
- AI interaction history
- Performance metrics

### Metrics
- API response times
- Database query performance
- AI service usage
- User engagement stats

## 🔮 Future Architecture Enhancements

1. **Microservices:** Split into AI, Voice, and Data services
2. **Message Queue:** Redis/RabbitMQ for async processing
3. **Caching:** Redis for frequently accessed data
4. **WebSockets:** Real-time notifications
5. **CDN:** Static asset delivery
6. **GraphQL:** Alternative API layer

