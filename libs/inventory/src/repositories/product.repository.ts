import { eq } from 'drizzle-orm';
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
  constructor(private db: Db) {}

  async findAll(filters?: {
    categoryId?: string;
    isManufactured?: boolean;
  }) {
    let query = this.db.select().from(products).$dynamic();

    if (filters?.categoryId) {
      query = query.where(eq(products.categoryId, filters.categoryId));
    }

    if (filters?.isManufactured !== undefined) {
      query = query.where(eq(products.isManufactured, filters.isManufactured));
    }

    return query;
  }

  async findById(id: string) {
    const result = await this.db
      .select()
      .from(products)
      .where(eq(products.id, id));
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
      })
      .returning();
    return result[0];
  }

  async update(id: string, input: UpdateProductInput) {
    const updateData: Record<string, unknown> = {};
    if (input.name !== undefined) updateData['name'] = input.name;
    if (input.categoryId !== undefined) updateData['categoryId'] = input.categoryId;
    if (input.description !== undefined) updateData['description'] = input.description;
    if (input.isManufactured !== undefined) updateData['isManufactured'] = input.isManufactured;

    const result = await this.db
      .update(products)
      .set(updateData)
      .where(eq(products.id, id))
      .returning();
    return result[0] ?? null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db
      .delete(products)
      .where(eq(products.id, id))
      .returning({ id: products.id });
    return result.length > 0;
  }
}

/**
 * Simple repository for Category lookups.
 * Used by field resolvers on Product.
 */
export class CategoryRepository {
  constructor(private db: Db) {}

  async findAll() {
    return this.db.select().from(categories);
  }

  async findById(id: string) {
    const result = await this.db
      .select()
      .from(categories)
      .where(eq(categories.id, id));
    return result[0] ?? null;
  }

  async create(input: { name: string }) {
    const result = await this.db
      .insert(categories)
      .values({ name: input.name })
      .returning();
    return result[0];
  }

  async update(id: string, input: { name?: string }) {
    const updateData: Record<string, unknown> = {};
    if (input.name !== undefined) updateData['name'] = input.name;

    const result = await this.db
      .update(categories)
      .set(updateData)
      .where(eq(categories.id, id))
      .returning();
    return result[0] ?? null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db
      .delete(categories)
      .where(eq(categories.id, id))
      .returning({ id: categories.id });
    return result.length > 0;
  }
}
