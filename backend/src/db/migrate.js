import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db, sql } from './index.js';

/**
 * Run database migrations
 */
async function runMigrations() {
  console.log('🚀 Starting database migrations...');
  
  try {
    await migrate(db, { migrationsFolder: './src/db/migrations' });
    console.log('✅ Migrations completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

runMigrations();

