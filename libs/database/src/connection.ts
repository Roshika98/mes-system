import { Pool } from 'pg';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

let pool: Pool | null = null;
let db: NodePgDatabase<typeof schema> | null = null;

/**
 * Returns a singleton Drizzle database instance.
 * Lazily creates the pg Pool and wraps it with Drizzle on first call.
 *
 * Requires DATABASE_URL environment variable to be set.
 */
export function getDb(): NodePgDatabase<typeof schema> {
  if (db) return db;

  const connectionString = process.env['DATABASE_URL'];
  if (!connectionString) {
    throw new Error(
      'DATABASE_URL environment variable is not set. ' +
        'Please set it to a valid PostgreSQL connection string.'
    );
  }

  pool = new Pool({ connectionString });
  db = drizzle(pool, { schema });

  return db;
}

/**
 * Returns the underlying pg Pool instance.
 * Useful for health checks or manual query execution.
 * Must call getDb() first to initialize the pool.
 */
export function getPool(): Pool {
  if (!pool) {
    throw new Error('Database pool not initialized. Call getDb() first.');
  }
  return pool;
}

/**
 * Gracefully closes the database connection pool.
 * Should be called during application shutdown.
 */
export async function closeDb(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
    db = null;
  }
}
