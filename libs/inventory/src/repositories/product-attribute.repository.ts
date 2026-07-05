import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, and } from 'drizzle-orm';
import { productAttributes } from '@mes-system/database';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Db = NodePgDatabase<any>;

export interface CreateProductAttributeInput {
  name: string;
}

export interface UpdateProductAttributeInput {
  name?: string;
}

export class ProductAttributeRepository {
  constructor(
    private db: Db,
    private tenantId: string,
    private userId: string,
  ) {}

  withTransaction(tx: Db): ProductAttributeRepository {
    return new ProductAttributeRepository(tx, this.tenantId, this.userId);
  }

  async findAll() {
    return this.db
      .select()
      .from(productAttributes)
      .where(eq(productAttributes.tenantId, this.tenantId));
  }

  async findById(id: string) {
    const result = await this.db
      .select()
      .from(productAttributes)
      .where(
        and(
          eq(productAttributes.id, id),
          eq(productAttributes.tenantId, this.tenantId),
        ),
      );
    return result[0] ?? null;
  }

  async create(input: CreateProductAttributeInput) {
    const result = await this.db
      .insert(productAttributes)
      .values({
        name: input.name,
        tenantId: this.tenantId,
        createdBy: this.userId,
        updatedBy: this.userId,
      })
      .returning();
    return result[0];
  }

  async update(id: string, input: UpdateProductAttributeInput) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {
      updatedBy: this.userId,
      updatedAt: new Date(),
    };
    if (input.name !== undefined) updateData['name'] = input.name;

    const result = await this.db
      .update(productAttributes)
      .set(updateData)
      .where(
        and(
          eq(productAttributes.id, id),
          eq(productAttributes.tenantId, this.tenantId),
        ),
      )
      .returning();
    return result[0] ?? null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db
      .delete(productAttributes)
      .where(
        and(
          eq(productAttributes.id, id),
          eq(productAttributes.tenantId, this.tenantId),
        ),
      )
      .returning({ id: productAttributes.id });
    return result.length > 0;
  }
}
