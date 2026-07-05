import { eq, and } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { products, categories } from '@mes-system/database';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Db = NodePgDatabase<any>;

export interface CreateProductInput {
  name: string;
  categoryId: string;
  description?: string | null;
  isManufactured: boolean;
}

export interface UpdateProductInput {
  name?: string;
  categoryId?: string;
  description?: string | null;
  isManufactured?: boolean;
}

export class ProductRepository {
  constructor(
    private db: Db,
    private tenantId: string,
    private userId: string,
  ) {}

  withTransaction(tx: Db): ProductRepository {
    return new ProductRepository(tx, this.tenantId, this.userId);
  }

  async findAll(filters?: { categoryId?: string; isManufactured?: boolean }) {
    const conditions = [eq(products.tenantId, this.tenantId)];

    if (filters?.categoryId) {
      conditions.push(eq(products.categoryId, filters.categoryId));
    }

    if (filters?.isManufactured !== undefined) {
      conditions.push(eq(products.isManufactured, filters.isManufactured));
    }

    return this.db
      .select()
      .from(products)
      .where(and(...conditions));
  }

  async findById(id: string) {
    const result = await this.db
      .select()
      .from(products)
      .where(and(eq(products.id, id), eq(products.tenantId, this.tenantId)));
    return result[0] ?? null;
  }

  async create(input: CreateProductInput) {
    const result = await this.db
      .insert(products)
      .values({
        name: input.name,
        categoryId: input.categoryId,
        description: input.description ?? null,
        isManufactured: input.isManufactured,
        tenantId: this.tenantId,
        createdBy: this.userId,
        updatedBy: this.userId,
      })
      .returning();
    return result[0];
  }

  async update(id: string, input: UpdateProductInput) {
    const updateData: Record<string, unknown> = {
      updatedBy: this.userId,
      updatedAt: new Date(),
    };
    if (input.name !== undefined) updateData['name'] = input.name;
    if (input.categoryId !== undefined)
      updateData['categoryId'] = input.categoryId;
    if (input.description !== undefined)
      updateData['description'] = input.description;
    if (input.isManufactured !== undefined)
      updateData['isManufactured'] = input.isManufactured;

    const result = await this.db
      .update(products)
      .set(updateData)
      .where(and(eq(products.id, id), eq(products.tenantId, this.tenantId)))
      .returning();
    return result[0] ?? null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db
      .delete(products)
      .where(and(eq(products.id, id), eq(products.tenantId, this.tenantId)))
      .returning({ id: products.id });
    return result.length > 0;
  }
}

/**
 * Simple repository for Category lookups.
 * Used by field resolvers on Product.
 */
export class CategoryRepository {
  constructor(
    private db: Db,
    private tenantId: string,
    private userId: string
  ) {}

  async findAll() {
    return this.db
      .select()
      .from(categories)
      .where(eq(categories.tenantId, this.tenantId));
  }

  async findById(id: string) {
    const result = await this.db
      .select()
      .from(categories)
      .where(
        and(eq(categories.id, id), eq(categories.tenantId, this.tenantId))
      );
    return result[0] ?? null;
  }

  async create(input: { name: string }) {
    const result = await this.db
      .insert(categories)
      .values({
        name: input.name,
        tenantId: this.tenantId,
        createdBy: this.userId,
        updatedBy: this.userId,
      })
      .returning();
    return result[0];
  }

  async update(id: string, input: { name?: string }) {
    const updateData: Record<string, unknown> = {
      updatedBy: this.userId,
      updatedAt: new Date(),
    };
    if (input.name !== undefined) updateData['name'] = input.name;

    const result = await this.db
      .update(categories)
      .set(updateData)
      .where(
        and(eq(categories.id, id), eq(categories.tenantId, this.tenantId))
      )
      .returning();
    return result[0] ?? null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db
      .delete(categories)
      .where(
        and(eq(categories.id, id), eq(categories.tenantId, this.tenantId))
      )
      .returning({ id: categories.id });
    return result.length > 0;
  }
}
