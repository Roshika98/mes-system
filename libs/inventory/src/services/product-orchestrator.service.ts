import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import {
  ProductRepository,
  CategoryRepository,
} from '../repositories/product.repository';
import {
  ProductVariantRepository,
  ProductVariantAttributeRepository,
} from '../repositories/product-variant.repository';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Db = NodePgDatabase<any>;

export interface CreateProductWithVariantsInput {
  name: string;
  categoryId: string;
  description?: string | null;
  isManufactured: boolean;
  variants: {
    sku: string;
    barcode?: string | null;
    uomId: string;
    price: number;
    routingId?: string | null;
    attributes: { attributeId: string; value: string }[];
  }[];
}

export interface AddVariantsToProductInput {
  productId: string;
  variants: {
    sku: string;
    barcode?: string | null;
    uomId: string;
    price: number;
    routingId?: string | null;
    attributes: { attributeId: string; value: string }[];
  }[];
}

export class ProductOrchestratorService {
  constructor(
    private db: Db,
    private tenantId: string,
    private userId: string,
    private productRepo: ProductRepository,
    private variantRepo: ProductVariantRepository,
    private categoryRepo: CategoryRepository,
    private productVariantAttributeRepo: ProductVariantAttributeRepository
  ) {}

  async createProductWithVariants(input: CreateProductWithVariantsInput) {
    // 1. Validate Category
    const category = await this.categoryRepo.findById(input.categoryId);
    if (!category) {
      throw new Error(`Category with id "${input.categoryId}" not found.`);
    }

    // 2. Perform Transaction
    return this.db.transaction(async (tx) => {
      // Create Tx-scoped Repositories
      const txProductRepo = this.productRepo.withTransaction(tx);
      const txVariantRepo = this.variantRepo.withTransaction(tx);
      const txAttrRepo = this.productVariantAttributeRepo.withTransaction(tx);

      // 3. Check SKU Uniqueness
      const skus = input.variants.map((v) => v.sku);
      for (const sku of skus) {
        const existing = await txVariantRepo.findBySku(sku);
        if (existing) {
          throw new Error(`SKU "${sku}" is already in use.`);
        }
      }

      // 4. Create Product
      const product = await txProductRepo.create({
        name: input.name,
        categoryId: input.categoryId,
        description: input.description,
        isManufactured: input.isManufactured,
      });

      if (input.variants.length === 0) {
        return product;
      }

      // 5. Bulk Create Variants
      const variantInputs = input.variants.map((v) => ({
        ...v,
        productId: product.id,
        price: v.price.toString(),
      }));
      const createdVariants = await txVariantRepo.createMany(variantInputs);

      // 6. Bulk Create Attributes
      const attributeInputs: {
        productVariantId: string;
        attributeId: string;
        value: string;
      }[] = [];
      const variantMap = new Map(createdVariants.map((v) => [v.sku, v.id]));

      for (const v of input.variants) {
        const variantId = variantMap.get(v.sku);
        if (variantId) {
          for (const attr of v.attributes) {
            attributeInputs.push({
              productVariantId: variantId,
              attributeId: attr.attributeId,
              value: attr.value,
            });
          }
        }
      }

      if (attributeInputs.length > 0) {
        await txAttrRepo.createMany(attributeInputs);
      }

      return product;
    });
  }

  async addVariantsToProduct(input: AddVariantsToProductInput) {
    // 1. Validate Product
    const product = await this.productRepo.findById(input.productId);
    if (!product) {
      throw new Error(`Product with id "${input.productId}" not found.`);
    }

    // 2. Perform Transaction
    return this.db.transaction(async (tx) => {
      // Create Tx-scoped Repositories
      const txVariantRepo = this.variantRepo.withTransaction(tx);
      const txAttrRepo = this.productVariantAttributeRepo.withTransaction(tx);

      // 3. Check SKU Uniqueness
      const skus = input.variants.map((v) => v.sku);
      for (const sku of skus) {
        const existing = await txVariantRepo.findBySku(sku);
        if (existing) {
          throw new Error(`SKU "${sku}" is already in use.`);
        }
      }

      if (input.variants.length === 0) {
        return [];
      }

      // 4. Bulk Create Variants
      const variantInputs = input.variants.map((v) => ({
        ...v,
        productId: input.productId,
        price: v.price.toString(),
      }));
      const createdVariants = await txVariantRepo.createMany(variantInputs);

      // 5. Bulk Create Attributes
      const attributeInputs: {
        productVariantId: string;
        attributeId: string;
        value: string;
      }[] = [];
      const variantMap = new Map(createdVariants.map((v) => [v.sku, v.id]));

      for (const v of input.variants) {
        const variantId = variantMap.get(v.sku);
        if (variantId) {
          for (const attr of v.attributes) {
            attributeInputs.push({
              productVariantId: variantId,
              attributeId: attr.attributeId,
              value: attr.value,
            });
          }
        }
      }

      if (attributeInputs.length > 0) {
        await txAttrRepo.createMany(attributeInputs);
      }

      return createdVariants;
    });
  }
}
