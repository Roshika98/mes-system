import { eq, and } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { warehouses, locations } from '@mes-system/database';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Db = NodePgDatabase<any>;

export interface CreateWarehouseInput {
  name: string;
  location?: string | null;
}

export interface UpdateWarehouseInput {
  name?: string;
  location?: string | null;
}

export class WarehouseRepository {
  constructor(
    private db: Db,
    private tenantId: string,
    private userId: string
  ) {}

  withTransaction(tx: Db) {
    return new WarehouseRepository(tx, this.tenantId, this.userId);
  }

  async findAll() {
    return this.db
      .select()
      .from(warehouses)
      .where(eq(warehouses.tenantId, this.tenantId));
  }

  async findById(id: string) {
    const result = await this.db
      .select()
      .from(warehouses)
      .where(
        and(eq(warehouses.id, id), eq(warehouses.tenantId, this.tenantId))
      );
    return result[0] ?? null;
  }

  async create(input: CreateWarehouseInput) {
    const result = await this.db
      .insert(warehouses)
      .values({
        name: input.name,
        location: input.location ?? null,
        tenantId: this.tenantId,
        createdBy: this.userId,
        updatedBy: this.userId,
      })
      .returning();
    return result[0];
  }

  async update(id: string, input: UpdateWarehouseInput) {
    const updateData: Record<string, unknown> = {
      updatedBy: this.userId,
      updatedAt: new Date(),
    };
    if (input.name !== undefined) updateData['name'] = input.name;
    if (input.location !== undefined) updateData['location'] = input.location;

    const result = await this.db
      .update(warehouses)
      .set(updateData)
      .where(
        and(eq(warehouses.id, id), eq(warehouses.tenantId, this.tenantId))
      )
      .returning();
    return result[0] ?? null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db
      .delete(warehouses)
      .where(
        and(eq(warehouses.id, id), eq(warehouses.tenantId, this.tenantId))
      )
      .returning({ id: warehouses.id });
    return result.length > 0;
  }
}

export interface CreateLocationInput {
  warehouseId: string;
  name: string;
  description?: string | null;
}

export interface UpdateLocationInput {
  name?: string;
  description?: string | null;
}

export class LocationRepository {
  constructor(
    private db: Db,
    private tenantId: string,
    private userId: string
  ) {}

  withTransaction(tx: Db) {
    return new LocationRepository(tx, this.tenantId, this.userId);
  }

  async findAll() {
    return this.db
      .select()
      .from(locations)
      .where(eq(locations.tenantId, this.tenantId));
  }

  async findByWarehouseId(warehouseId: string) {
    return this.db
      .select()
      .from(locations)
      .where(
        and(
          eq(locations.warehouseId, warehouseId),
          eq(locations.tenantId, this.tenantId)
        )
      );
  }

  async findById(id: string) {
    const result = await this.db
      .select()
      .from(locations)
      .where(
        and(eq(locations.id, id), eq(locations.tenantId, this.tenantId))
      );
    return result[0] ?? null;
  }

  async create(input: CreateLocationInput) {
    const result = await this.db
      .insert(locations)
      .values({
        warehouseId: input.warehouseId,
        name: input.name,
        description: input.description ?? null,
        tenantId: this.tenantId,
        createdBy: this.userId,
        updatedBy: this.userId,
      })
      .returning();
    return result[0];
  }

  async update(id: string, input: UpdateLocationInput) {
    const updateData: Record<string, unknown> = {
      updatedBy: this.userId,
      updatedAt: new Date(),
    };
    if (input.name !== undefined) updateData['name'] = input.name;
    if (input.description !== undefined) updateData['description'] = input.description;

    const result = await this.db
      .update(locations)
      .set(updateData)
      .where(
        and(eq(locations.id, id), eq(locations.tenantId, this.tenantId))
      )
      .returning();
    return result[0] ?? null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db
      .delete(locations)
      .where(
        and(eq(locations.id, id), eq(locations.tenantId, this.tenantId))
      )
      .returning({ id: locations.id });
    return result.length > 0;
  }
}
