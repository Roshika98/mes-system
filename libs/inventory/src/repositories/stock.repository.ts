import { eq, and, isNull } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { stocks } from '@mes-system/database';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Db = NodePgDatabase<any>;

export class StockRepository {
  constructor(
    private db: Db,
    private tenantId: string,
    private userId: string
  ) {}

  withTransaction(tx: Db) {
    return new StockRepository(tx, this.tenantId, this.userId);
  }

  async findAll(filters?: {
    productVariantId?: string;
    warehouseId?: string;
    locationId?: string;
    batchNumber?: string | null;
  }) {
    const conditions = [eq(stocks.tenantId, this.tenantId)];

    if (filters?.productVariantId) {
      conditions.push(eq(stocks.productVariantId, filters.productVariantId));
    }
    if (filters?.warehouseId) {
      conditions.push(eq(stocks.warehouseId, filters.warehouseId));
    }
    if (filters?.locationId) {
      conditions.push(eq(stocks.locationId, filters.locationId));
    }
    if (filters?.batchNumber !== undefined) {
      if (filters.batchNumber === null) {
        conditions.push(isNull(stocks.batchNumber));
      } else {
        conditions.push(eq(stocks.batchNumber, filters.batchNumber));
      }
    }

    return this.db
      .select()
      .from(stocks)
      .where(and(...conditions));
  }

  async findById(id: string) {
    const result = await this.db
      .select()
      .from(stocks)
      .where(and(eq(stocks.id, id), eq(stocks.tenantId, this.tenantId)));
    return result[0] ?? null;
  }

  async findSpecificStock(
    productVariantId: string,
    warehouseId: string,
    locationId: string,
    batchNumber: string | null | undefined
  ) {
    const conditions = [
      eq(stocks.tenantId, this.tenantId),
      eq(stocks.productVariantId, productVariantId),
      eq(stocks.warehouseId, warehouseId),
      eq(stocks.locationId, locationId),
    ];

    if (batchNumber === null || batchNumber === undefined) {
      conditions.push(isNull(stocks.batchNumber));
    } else {
      conditions.push(eq(stocks.batchNumber, batchNumber));
    }

    const result = await this.db
      .select()
      .from(stocks)
      .where(and(...conditions));

    return result[0] ?? null;
  }

  async upsertStock(
    productVariantId: string,
    warehouseId: string,
    locationId: string,
    batchNumber: string | null | undefined,
    deltaQuantity: number,
    status?: string
  ) {
    const existing = await this.findSpecificStock(
      productVariantId,
      warehouseId,
      locationId,
      batchNumber
    );

    if (existing) {
      const currentQty = Number(existing.quantity);
      const newQty = currentQty + deltaQuantity;

      const result = await this.db
        .update(stocks)
        .set({
          quantity: newQty.toFixed(4),
          updatedBy: this.userId,
          updatedAt: new Date(),
        })
        .where(eq(stocks.id, existing.id))
        .returning();

      return result[0];
    } else {
      const result = await this.db
        .insert(stocks)
        .values({
          productVariantId,
          warehouseId,
          locationId,
          batchNumber: batchNumber ?? null,
          quantity: deltaQuantity.toFixed(4),
          status: status ?? 'AVAILABLE',
          tenantId: this.tenantId,
          createdBy: this.userId,
          updatedBy: this.userId,
        })
        .returning();

      return result[0];
    }
  }
}
