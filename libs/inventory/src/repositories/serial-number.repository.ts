import { eq, and } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { serialNumbers } from '@mes-system/database';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Db = NodePgDatabase<any>;

export interface CreateSerialNumberInput {
  productVariantId: string;
  serialNumber: string;
  status: string;
  currentWarehouseId?: string | null;
  currentLocationId?: string | null;
}

export interface UpdateSerialNumberInput {
  status?: string;
  currentWarehouseId?: string | null;
  currentLocationId?: string | null;
}

export class SerialNumberRepository {
  constructor(
    private db: Db,
    private tenantId: string,
    private userId: string
  ) {}

  withTransaction(tx: Db) {
    return new SerialNumberRepository(tx, this.tenantId, this.userId);
  }

  async findAll(filters?: {
    productVariantId?: string;
    status?: string;
    warehouseId?: string;
    locationId?: string;
  }) {
    const conditions = [eq(serialNumbers.tenantId, this.tenantId)];

    if (filters?.productVariantId) {
      conditions.push(eq(serialNumbers.productVariantId, filters.productVariantId));
    }
    if (filters?.status) {
      conditions.push(eq(serialNumbers.status, filters.status));
    }
    if (filters?.warehouseId) {
      conditions.push(eq(serialNumbers.currentWarehouseId, filters.warehouseId));
    }
    if (filters?.locationId) {
      conditions.push(eq(serialNumbers.currentLocationId, filters.locationId));
    }

    return this.db
      .select()
      .from(serialNumbers)
      .where(and(...conditions));
  }

  async findById(id: string) {
    const result = await this.db
      .select()
      .from(serialNumbers)
      .where(
        and(eq(serialNumbers.id, id), eq(serialNumbers.tenantId, this.tenantId))
      );
    return result[0] ?? null;
  }

  async findBySerialNumber(serialNumber: string) {
    const result = await this.db
      .select()
      .from(serialNumbers)
      .where(
        and(
          eq(serialNumbers.serialNumber, serialNumber),
          eq(serialNumbers.tenantId, this.tenantId)
        )
      );
    return result[0] ?? null;
  }

  async create(input: CreateSerialNumberInput) {
    const result = await this.db
      .insert(serialNumbers)
      .values({
        productVariantId: input.productVariantId,
        serialNumber: input.serialNumber,
        status: input.status,
        currentWarehouseId: input.currentWarehouseId ?? null,
        currentLocationId: input.currentLocationId ?? null,
        tenantId: this.tenantId,
        createdBy: this.userId,
        updatedBy: this.userId,
      })
      .returning();
    return result[0];
  }

  async update(id: string, input: UpdateSerialNumberInput) {
    const updateData: Record<string, unknown> = {
      updatedBy: this.userId,
      updatedAt: new Date(),
    };
    if (input.status !== undefined) updateData['status'] = input.status;
    if (input.currentWarehouseId !== undefined) {
      updateData['currentWarehouseId'] = input.currentWarehouseId;
    }
    if (input.currentLocationId !== undefined) {
      updateData['currentLocationId'] = input.currentLocationId;
    }

    const result = await this.db
      .update(serialNumbers)
      .set(updateData)
      .where(
        and(eq(serialNumbers.id, id), eq(serialNumbers.tenantId, this.tenantId))
      )
      .returning();
    return result[0] ?? null;
  }
}
