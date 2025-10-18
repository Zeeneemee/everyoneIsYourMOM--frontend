import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import dotenv from 'dotenv';
import * as schema from './schema.js';

dotenv.config();

// Create PostgreSQL connection
// For Supabase, the connection string format is:
// postgresql://postgres:[YOUR-PASSWORD]@[YOUR-HOST]:5432/postgres
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    'DATABASE_URL is not defined. Please add it to your .env file.\n' +
    'Format: postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres\n' +
    'You can find this in your Supabase project settings under Database -> Connection String'
  );
}

// Create the connection
export const sql = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

// Create drizzle instance
export const db = drizzle(sql, { schema });

// Export schema for use in other files
export * from './schema.js';

// Test database connection
export async function testConnection() {
  try {
    await sql`SELECT 1`;
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

export default db;

