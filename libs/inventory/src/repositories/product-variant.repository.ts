import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import {
  productVariants,
  unitOfMeasures,
  productVariantAttributes,
  productAttributes,
} from '@mes-system/database';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Db = NodePgDatabase<any>;

export interface CreateProductVariantInput {
  productId: string;
  sku: string;
  barcode?: string | null;
  uomId: string;
  price: string; // Drizzle decimal comes in as string
  routingId?: string | null;
}

export interface UpdateProductVariantInput {
  sku?: string;
  barcode?: string | null;
  uomId?: string;
  price?: string;
  routingId?: string | null;
}

export class ProductVariantRepository {
  constructor(private db: Db) {}

  async findByProductId(productId: string) {
    return this.db
      .select()
      .from(productVariants)
      .where(eq(productVariants.productId, productId));
  }

  async findById(id: string) {
    const result = await this.db
      .select()
      .from(productVariants)
      .where(eq(productVariants.id, id));
    return result[0] ?? null;
  }

  async findBySku(sku: string) {
    const result = await this.db
      .select()
      .from(productVariants)
      .where(eq(productVariants.sku, sku));
    return result[0] ?? null;
  }

  async create(input: CreateProductVariantInput) {
    const result = await this.db
      .insert(productVariants)
      .values({
        productId: input.productId,
        sku: input.sku,
        barcode: input.barcode ?? null,
        uomId: input.uomId,
        price: input.price,
        routingId: input.routingId ?? null,
      })
      .returning();
    return result[0];
  }

  async update(id: string, input: UpdateProductVariantInput) {
    const updateData: Record<string, unknown> = {};
    if (input.sku !== undefined) updateData['sku'] = input.sku;
    if (input.barcode !== undefined) updateData['barcode'] = input.barcode;
    if (input.uomId !== undefined) updateData['uomId'] = input.uomId;
    if (input.price !== undefined) updateData['price'] = input.price;
    if (input.routingId !== undefined) updateData['routingId'] = input.routingId;

    const result = await this.db
      .update(productVariants)
      .set(updateData)
      .where(eq(productVariants.id, id))
      .returning();
    return result[0] ?? null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db
      .delete(productVariants)
      .where(eq(productVariants.id, id))
      .returning({ id: productVariants.id });
    return result.length > 0;
  }
}

/**
 * Simple repository for UnitOfMeasure lookups.
 * Used by field resolvers on ProductVariant.
 */
export class UnitOfMeasureRepository {
  constructor(private db: Db) {}

  async findAll() {
    return this.db.select().from(unitOfMeasures);
  }

  async findById(id: string) {
    const result = await this.db
      .select()
      .from(unitOfMeasures)
      .where(eq(unitOfMeasures.id, id));
    return result[0] ?? null;
  }

  async create(input: { code: string; name: string }) {
    const result = await this.db
      .insert(unitOfMeasures)
      .values({ code: input.code, name: input.name })
      .returning();
    return result[0];
  }
}

/**
 * Repository for ProductVariantAttribute lookups.
 * Used by the ProductVariant.attributes field resolver.
 */
export class ProductVariantAttributeRepository {
  constructor(private db: Db) {}

  async findByVariantId(productVariantId: string) {
    return this.db
      .select({
        productVariantId: productVariantAttributes.productVariantId,
        attributeId: productVariantAttributes.attributeId,
        value: productVariantAttributes.value,
        attributeName: productAttributes.name,
      })
      .from(productVariantAttributes)
      .innerJoin(
        productAttributes,
        eq(productVariantAttributes.attributeId, productAttributes.id)
      )
      .where(
        eq(productVariantAttributes.productVariantId, productVariantId)
      );
  }
}
