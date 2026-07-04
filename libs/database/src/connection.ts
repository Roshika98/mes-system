import { Pool } from 'pg';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

export class TenantConnectionManager {
  private static pools = new Map<string, Pool>();
  private static dbs = new Map<string, NodePgDatabase<typeof schema>>();

  /**
   * Mock function to simulate looking up a tenant's config.
   * In a real system, this might query a master "tenants" database
   * or read from a configuration cache.
   */
  private static async getTenantConnectionString(
    _tenantId: string
  ): Promise<string> {
    // For now, all tenants fall back to the shared DATABASE_URL.
    // In the future: if (tenantId === 'premium_tenant') return process.env.PREMIUM_DB_URL;
    const url = process.env['DATABASE_URL'];
    if (!url) {
      throw new Error('DATABASE_URL environment variable is not set.');
    }
    return url;
  }

  /**
   * Retrieves or initializes a Drizzle database instance for the given tenant.
   * Caches the connection pool to prevent exhaustion.
   */
  public static async getDbForTenant(
    tenantId: string
  ): Promise<NodePgDatabase<typeof schema>> {
    // 1. Check if we already have a cached connection for this tenant
    if (this.dbs.has(tenantId)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return this.dbs.get(tenantId)!;
    }

    // 2. Look up the connection string for this tenant
    const connectionString = await this.getTenantConnectionString(tenantId);

    // 3. To optimize, if the connection string is the shared DB, we can
    // actually cache it under a "SHARED" key to avoid duplicating pools
    // for every shared tenant.
    const poolKey = connectionString; // Use the URL itself as the cache key for pools

    let pool = this.pools.get(poolKey);
    if (!pool) {
      pool = new Pool({ connectionString });
      this.pools.set(poolKey, pool);
    }

    // 4. Initialize Drizzle and cache it for the tenant
    const db = drizzle(pool, { schema });
    this.dbs.set(tenantId, db);

    return db;
  }

  /**
   * Gracefully close all cached connection pools.
   * Useful for application shutdown.
   */
  public static async closeAll(): Promise<void> {
    const promises: Promise<void>[] = [];
    for (const pool of this.pools.values()) {
      promises.push(pool.end());
    }
    await Promise.all(promises);
    this.pools.clear();
    this.dbs.clear();
  }
}
