/**
 * @mes-system/database
 *
 * Shared database infrastructure library.
 * Provides the Drizzle ORM instance, connection management,
 * and all schema definitions.
 */

// Connection management
export { TenantConnectionManager } from './connection';

// Schema tables and relations
export * from './schema';
