import { pgTable, uuid, text, timestamp, boolean, integer, jsonb, varchar, real } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

/**
 * Users Table
 */
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  fullName: varchar('full_name', { length: 255 }),
  block: varchar('block', { length: 50 }),
  unit: varchar('unit', { length: 50 }),
  phoneNumber: varchar('phone_number', { length: 20 }),
  momPoints: integer('mom_points').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

/**
 * User Preferences Table
 */
export const userPreferences = pgTable('user_preferences', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  dietaryRestrictions: jsonb('dietary_restrictions').$type<string[]>().default([]),
  allergens: jsonb('allergens').$type<string[]>().default([]),
  preferredTags: jsonb('preferred_tags').$type<string[]>().default([]),
  petFriendly: boolean('pet_friendly').default(false),
  preferredTimeSlots: jsonb('preferred_time_slots').$type<string[]>().default([]),
  maxDistance: real('max_distance').default(1.0),
  language: varchar('language', { length: 10 }).default('en'),
  voiceEnabled: boolean('voice_enabled').default(true),
  notificationsEnabled: boolean('notifications_enabled').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

/**
 * Food Menu Table
 */
export const foodMenu = pgTable('food_menu', {
  id: varchar('id', { length: 50 }).primaryKey(),
  house: varchar('house', { length: 255 }).notNull(),
  block: varchar('block', { length: 50 }).notNull(),
  dish: varchar('dish', { length: 255 }).notNull(),
  description: text('description'),
  tags: jsonb('tags').$type<string[]>().default([]),
  diet: jsonb('diet').$type<string[]>().default([]),
  allergens: jsonb('allergens').$type<string[]>().default([]),
  price: varchar('price', { length: 20 }).notNull(),
  eta: varchar('eta', { length: 50 }),
  distance: varchar('distance', { length: 50 }),
  rating: real('rating').default(5.0),
  calories: varchar('calories', { length: 50 }),
  protein: varchar('protein', { length: 50 }),
  image: varchar('image', { length: 255 }),
  available: boolean('available').default(true),
  userId: uuid('user_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

/**
 * Cleaning Slots Table
 */
export const cleaningSlots = pgTable('cleaning_slots', {
  id: varchar('id', { length: 50 }).primaryKey(),
  time: varchar('time', { length: 100 }).notNull(),
  date: varchar('date', { length: 50 }),
  availableCleaner: varchar('available_cleaner', { length: 255 }).notNull(),
  petFriendly: boolean('pet_friendly').default(false),
  price: varchar('price', { length: 20 }).notNull(),
  duration: integer('duration').default(2), // hours
  available: boolean('available').default(true),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

/**
 * Cleaning Bookings Table
 */
export const cleaningBookings = pgTable('cleaning_bookings', {
  id: uuid('id').primaryKey().defaultRandom(),
  slotId: varchar('slot_id', { length: 50 }).references(() => cleaningSlots.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  status: varchar('status', { length: 50 }).default('pending'), // pending, confirmed, completed, cancelled
  specialRequests: text('special_requests'),
  address: text('address'),
  contactNumber: varchar('contact_number', { length: 20 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

/**
 * Exchange Items Table
 */
export const exchangeItems = pgTable('exchange_items', {
  id: varchar('id', { length: 50 }).primaryKey(),
  ownerBlock: varchar('owner_block', { length: 50 }).notNull(),
  item: varchar('item', { length: 255 }).notNull(),
  description: text('description'),
  status: varchar('status', { length: 50 }).notNull(), // donate, exchange, sell
  condition: varchar('condition', { length: 50 }).default('good'), // like new, good, fair, poor
  price: varchar('price', { length: 20 }),
  category: varchar('category', { length: 100 }),
  images: jsonb('images').$type<string[]>().default([]),
  userId: uuid('user_id').references(() => users.id),
  available: boolean('available').default(true),
  hasInterest: boolean('has_interest').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

/**
 * Exchange Claims Table
 */
export const exchangeClaims = pgTable('exchange_claims', {
  id: uuid('id').primaryKey().defaultRandom(),
  itemId: varchar('item_id', { length: 50 }).references(() => exchangeItems.id).notNull(),
  claimedBy: uuid('claimed_by').references(() => users.id).notNull(),
  status: varchar('status', { length: 50 }).default('pending'), // pending, accepted, rejected, completed
  message: text('message'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

/**
 * User Interactions Table (for AI learning)
 */
export const userInteractions = pgTable('user_interactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  interactionType: varchar('interaction_type', { length: 50 }).notNull(), // voice, text, action
  intent: varchar('intent', { length: 50 }), // food, cleaning, exchange, general
  userMessage: text('user_message'),
  aiResponse: text('ai_response'),
  emotion: varchar('emotion', { length: 50 }),
  metadata: jsonb('metadata'),
  successful: boolean('successful').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

/**
 * Mom Points History Table
 */
export const momPointsHistory = pgTable('mom_points_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  points: integer('points').notNull(),
  reason: varchar('reason', { length: 255 }).notNull(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
});

/**
 * Food Orders Table
 */
export const foodOrders = pgTable('food_orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  foodId: varchar('food_id', { length: 50 }).references(() => foodMenu.id).notNull(),
  quantity: integer('quantity').default(1),
  status: varchar('status', { length: 50 }).default('pending'), // pending, confirmed, preparing, delivered, cancelled
  deliveryAddress: text('delivery_address'),
  specialInstructions: text('special_instructions'),
  totalPrice: varchar('total_price', { length: 20 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

/**
 * Conversations Table (for voice/chat history)
 */
export const conversations = pgTable('conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  title: varchar('title', { length: 255 }),
  messages: jsonb('messages').$type<Array<{role: string, content: string, timestamp: string}>>().default([]),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

