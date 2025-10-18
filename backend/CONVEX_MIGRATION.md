# Migration from Supabase to Convex

## Why Convex?

**Advantages over Supabase + PostgreSQL:**

### 🚀 Developer Experience
- **TypeScript-first**: Type-safe queries and mutations out of the box
- **No ORM needed**: Direct TypeScript API, no Drizzle/Prisma layer
- **Real-time by default**: Built-in live queries (no manual subscriptions)
- **Serverless functions**: Backend logic runs in Convex (no separate Express needed)
- **Instant deployment**: Push to prod with one command

### 💰 Cost
- **Generous free tier**: 1M function calls/month, 1GB storage
- **Simpler pricing**: No connection pooling fees
- **No cold starts**: Instant function execution

### 🔥 Features
- **Reactive queries**: UI updates automatically when data changes
- **Built-in auth**: Convex Auth or integrate with Clerk, Auth0, etc.
- **File storage**: Built-in file uploads and CDN
- **Scheduled functions**: Cron jobs without external services
- **Full-text search**: Built-in search capabilities

### 📊 Performance
- **Fast**: ~10-20ms query latency
- **Scalable**: Handles millions of operations
- **Global edge**: Fast from anywhere

## What Changed?

### 1. Database Layer

**Before (Supabase + Drizzle):**
```javascript
// Complex setup
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const sql = postgres(DATABASE_URL);
const db = drizzle(sql, { schema });

// Query with ORM
const foods = await db.select().from(foodMenu).where(eq(foodMenu.available, true));
```

**After (Convex):**
```javascript
// Simple TypeScript
export const getAll = query({
  args: { available: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("foodMenu")
      .withIndex("by_available", (q) => q.eq("available", args.available))
      .collect();
  },
});
```

### 2. Schema Definition

**Before (Drizzle):**
```javascript
// drizzle-orm SQL schema
export const foodMenu = pgTable('food_menu', {
  id: uuid('id').primaryKey(),
  dish: varchar('dish', { length: 255 }).notNull(),
  // ... more fields
});
```

**After (Convex):**
```typescript
// TypeScript schema
foodMenu: defineTable({
  dish: v.string(),
  tags: v.array(v.string()),
  available: v.boolean(),
  // ... more fields
}).index("by_available", ["available"]),
```

### 3. Models

**Before:** Models wrap Drizzle ORM queries
**After:** Models call Convex queries/mutations via HTTP client

```javascript
// Before
await db.select().from(foodMenu).where(eq(foodMenu.id, id));

// After
await convexClient.query(api.foods.getById, { id });
```

## Setup Instructions

### 1. Create Convex Account

1. Go to [dashboard.convex.dev](https://dashboard.convex.dev/)
2. Sign up with GitHub
3. Create a new project: `everyone-is-your-mom`
4. Copy your deployment URL (looks like `https://your-project.convex.cloud`)

### 2. Install Convex CLI

```bash
npm install convex --save
```

### 3. Initialize Convex

```bash
cd backend
npx convex dev
```

This will:
- Create `convex/` directory
- Generate TypeScript configuration
- Set up local development

When prompted:
- Choose your project
- Configure as needed

### 4. Configure Environment

```bash
# Edit .env
CONVEX_URL=https://your-project.convex.cloud
```

### 5. Push Schema to Convex

```bash
npx convex dev
```

This deploys your schema and functions to Convex.

### 6. Seed Data

```bash
npm run seed
```

### 7. Start Express Server

```bash
npm run dev
```

## Project Structure

```
backend/
├── convex/                    # Convex backend
│   ├── schema.ts             # Database schema (TypeScript)
│   ├── foods.ts              # Food queries/mutations
│   ├── cleaning.ts           # Cleaning queries/mutations
│   ├── exchange.ts           # Exchange queries/mutations
│   ├── users.ts              # User queries/mutations
│   ├── tsconfig.json         # TypeScript config
│   └── _generated/           # Auto-generated types
│       └── api.js            # API exports
│
├── src/
│   ├── models/               # Model layer (calls Convex)
│   ├── controllers/          # Express controllers
│   ├── routes/               # Express routes
│   ├── services/             # AI services
│   ├── utils/
│   │   └── convexClient.js   # Convex HTTP client wrapper
│   └── scripts/
│       └── seed.js           # Database seeding
│
├── server.js                 # Express server
└── package.json
```

## Key Differences

### Data Access

**Supabase + Drizzle:**
```javascript
const { data } = await supabase
  .from('food_menu')
  .select('*')
  .eq('available', true);
```

**Convex:**
```javascript
const data = await convexClient.query(api.foods.getAll, { available: true });
```

### Real-time Updates

**Supabase:** Manual subscriptions
```javascript
supabase.channel('food_menu')
  .on('postgres_changes', callback)
  .subscribe();
```

**Convex:** Automatic
```javascript
// In React
const foods = useQuery(api.foods.getAll, { available: true });
// Automatically updates when data changes!
```

### Mutations

**Supabase:**
```javascript
await supabase.from('food_menu').insert(data);
```

**Convex:**
```javascript
await convexClient.mutation(api.foods.create, data);
```

## Advanced Features

### 1. Scheduled Functions

Add to `convex/crons.ts`:
```typescript
import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.daily(
  "cleanup expired items",
  { hourUTC: 2, minuteUTC: 0 },
  internal.exchange.cleanupExpired
);

export default crons;
```

### 2. File Storage

```typescript
// In Convex function
export const uploadImage = mutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    const url = await ctx.storage.getUrl(args.storageId);
    return url;
  },
});
```

### 3. Full-Text Search

```typescript
export const searchDishes = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("foodMenu")
      .withSearchIndex("search_dish", (q) => 
        q.search("dish", args.searchTerm)
      )
      .collect();
  },
});
```

### 4. Transactions

Convex functions are automatically transactional:
```typescript
export const transferPoints = mutation({
  args: { fromUserId: v.id("users"), toUserId: v.id("users"), points: v.number() },
  handler: async (ctx, args) => {
    const fromUser = await ctx.db.get(args.fromUserId);
    const toUser = await ctx.db.get(args.toUserId);
    
    // Both updates succeed or both fail (atomic)
    await ctx.db.patch(args.fromUserId, {
      momPoints: fromUser.momPoints - args.points
    });
    await ctx.db.patch(args.toUserId, {
      momPoints: toUser.momPoints + args.points
    });
  },
});
```

## Convex CLI Commands

```bash
# Start development mode (watch for changes)
npx convex dev

# Deploy to production
npx convex deploy

# Open dashboard
npx convex dashboard

# Run data migrations
npx convex run foods:create --args '{"dish":"Test",...}'

# View logs
npx convex logs

# Import data
npx convex import --table foodMenu data.jsonl
```

## Testing Convex Functions

```bash
# Test a query
npx convex run foods:getAll

# Test a mutation
npx convex run foods:create '{"itemId":"test","dish":"Test Dish",...}'

# Test with args file
npx convex run foods:searchByName --args '{"searchTerm":"chicken"}'
```

## Moving from Development to Production

1. **Create production deployment:**
```bash
npx convex deploy --prod
```

2. **Update environment variable:**
```bash
# In production .env
CONVEX_URL=https://your-prod-project.convex.cloud
```

3. **Seed production data:**
```bash
CONVEX_URL=https://your-prod-project.convex.cloud npm run seed
```

## Monitoring and Logs

### View Logs
```bash
npx convex logs
```

### Dashboard
- Go to [dashboard.convex.dev](https://dashboard.convex.dev/)
- View function calls, errors, performance
- Monitor usage and limits

## Comparison with Supabase

| Feature | Supabase + Drizzle | Convex |
|---------|-------------------|---------|
| **Schema** | SQL migrations | TypeScript definitions |
| **Type Safety** | Via Drizzle codegen | Native TypeScript |
| **Real-time** | Manual subscriptions | Built-in reactive queries |
| **Setup Time** | ~30 minutes | ~5 minutes |
| **Backend Logic** | Separate Express server | Built-in serverless functions |
| **File Storage** | Separate Supabase Storage | Built-in storage |
| **Auth** | Supabase Auth (separate) | Convex Auth (integrated) |
| **Pricing** | Connection pooling fees | Generous free tier |
| **Cold Starts** | PostgreSQL connections | None |
| **Learning Curve** | SQL + ORM | TypeScript functions |

## Benefits Summary

✅ **Simpler architecture** - No ORM layer, no connection pooling
✅ **Type-safe** - End-to-end TypeScript
✅ **Real-time** - Automatic UI updates
✅ **Faster development** - Less boilerplate
✅ **Better DX** - Excellent tools and dashboard
✅ **Cheaper** - More generous free tier
✅ **Serverless** - No server management
✅ **Global** - Fast from anywhere

## Migration Checklist

- [x] Install Convex package
- [x] Create Convex schema
- [x] Create queries and mutations
- [x] Update models to use Convex client
- [x] Update configuration
- [x] Create seeding script
- [ ] Initialize Convex project (`npx convex dev`)
- [ ] Seed data (`npm run seed`)
- [ ] Test all endpoints
- [ ] Deploy to production

## Need Help?

- **Docs**: https://docs.convex.dev/
- **Discord**: https://convex.dev/community
- **Examples**: https://github.com/get-convex/convex-demos

## Next Steps

1. Initialize Convex: `npx convex dev`
2. Seed your data: `npm run seed`
3. Test endpoints
4. Enjoy faster development! 🚀

Your backend is now powered by Convex! 🎉

