import { eq, and, or } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { stockMovements } from '@mes-system/database';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Db = NodePgDatabase<any>;

export interface CreateStockMovementInput {
  productVariantId: string;
  fromWarehouseId?: string | null;
  fromLocationId?: string | null;
  toWarehouseId?: string | null;
  toLocationId?: string | null;
  quantity: string;
  movementType: string;
  relatedOrderType?: string | null;
  relatedOrderId?: string | null;
  batchNumber?: string | null;
  serialNumberId?: string | null;
  notes?: string | null;
}

export class StockMovementRepository {
  constructor(
    private db: Db,
    private tenantId: string,
    private userId: string
  ) {}

  withTransaction(tx: Db) {
    return new StockMovementRepository(tx, this.tenantId, this.userId);
  }

  async findAll(filters?: {
    productVariantId?: string;
    warehouseId?: string;
    locationId?: string;
    movementType?: string;
  }) {
    const conditions = [eq(stockMovements.tenantId, this.tenantId)];

    if (filters?.productVariantId) {
      conditions.push(eq(stockMovements.productVariantId, filters.productVariantId));
    }
    if (filters?.movementType) {
      conditions.push(eq(stockMovements.movementType, filters.movementType));
    }
    if (filters?.warehouseId) {
      const warehouseOr = or(
        eq(stockMovements.fromWarehouseId, filters.warehouseId),
        eq(stockMovements.toWarehouseId, filters.warehouseId)
      );
      if (warehouseOr) {
        conditions.push(warehouseOr);
      }
    }
    if (filters?.locationId) {
      const locationOr = or(
        eq(stockMovements.fromLocationId, filters.locationId),
        eq(stockMovements.toLocationId, filters.locationId)
      );
      if (locationOr) {
        conditions.push(locationOr);
      }
    }


    return this.db
      .select()
      .from(stockMovements)
      .where(and(...conditions));
  }

  async findById(id: string) {
    const result = await this.db
      .select()
      .from(stockMovements)
      .where(
        and(eq(stockMovements.id, id), eq(stockMovements.tenantId, this.tenantId))
      );
    return result[0] ?? null;
  }

  async create(input: CreateStockMovementInput) {
    const result = await this.db
      .insert(stockMovements)
      .values({
        productVariantId: input.productVariantId,
        fromWarehouseId: input.fromWarehouseId ?? null,
        fromLocationId: input.fromLocationId ?? null,
        toWarehouseId: input.toWarehouseId ?? null,
        toLocationId: input.toLocationId ?? null,
        quantity: input.quantity,
        movementType: input.movementType,
        relatedOrderType: input.relatedOrderType ?? null,
        relatedOrderId: input.relatedOrderId ?? null,
        batchNumber: input.batchNumber ?? null,
        serialNumberId: input.serialNumberId ?? null,
        notes: input.notes ?? null,
        tenantId: this.tenantId,
        createdBy: this.userId,
        updatedBy: this.userId,
      })
      .returning();
    return result[0];
  }
}
