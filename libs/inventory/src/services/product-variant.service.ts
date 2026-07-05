import {
  ProductVariantRepository,
  UnitOfMeasureRepository,
  ProductVariantAttributeRepository,
} from '../repositories/product-variant.repository';
import { ProductRepository } from '../repositories/product.repository';

export class ProductVariantService {
  constructor(
    private variantRepo: ProductVariantRepository,
    private productRepo: ProductRepository,
    private uomRepo: UnitOfMeasureRepository,
  ) {}

  async findByProductId(productId: string) {
    return this.variantRepo.findByProductId(productId);
  }

  async findById(id: string) {
    return this.variantRepo.findById(id);
  }

  async findBySku(sku: string) {
    return this.variantRepo.findBySku(sku);
  }


  async create(input: {
    productId: string;
    sku: string;
    barcode?: string | null;
    uomId: string;
    price: number;
    routingId?: string | null;
  }) {
    // Validate that the parent product exists
    const product = await this.productRepo.findById(input.productId);
    if (!product) {
      throw new Error(`Product with id "${input.productId}" not found.`);
    }

    // Validate that the UOM exists
    const uom = await this.uomRepo.findById(input.uomId);
    if (!uom) {
      throw new Error(`Unit of Measure with id "${input.uomId}" not found.`);
    }

    // Check SKU uniqueness
    const existingSku = await this.variantRepo.findBySku(input.sku);
    if (existingSku) {
      throw new Error(`SKU "${input.sku}" is already in use.`);
    }

    return this.variantRepo.create({
      ...input,
      price: input.price.toString(),
      barcode: input.barcode ?? null,
      routingId: input.routingId ?? null,
    });
  }

  async update(
    id: string,
    input: {
      sku?: string;
      barcode?: string | null;
      uomId?: string;
      price?: number;
      routingId?: string | null;
    },
  ) {
    const existing = await this.variantRepo.findById(id);
    if (!existing) {
      throw new Error(`ProductVariant with id "${id}" not found.`);
    }

    // If changing UOM, validate it exists
    if (input.uomId) {
      const uom = await this.uomRepo.findById(input.uomId);
      if (!uom) {
        throw new Error(`Unit of Measure with id "${input.uomId}" not found.`);
      }
    }

    // If changing SKU, check uniqueness
    if (input.sku && input.sku !== existing.sku) {
      const existingSku = await this.variantRepo.findBySku(input.sku);
      if (existingSku) {
        throw new Error(`SKU "${input.sku}" is already in use.`);
      }
    }

    return this.variantRepo.update(id, {
      ...input,
      price: input.price?.toString(),
    });
  }

  async delete(id: string): Promise<boolean> {
    const existing = await this.variantRepo.findById(id);
    if (!existing) {
      throw new Error(`ProductVariant with id "${id}" not found.`);
    }

    return this.variantRepo.delete(id);
  }
}

export class UnitOfMeasureService {
  constructor(private uomRepo: UnitOfMeasureRepository) {}

  async findAll() {
    return this.uomRepo.findAll();
  }

  async findById(id: string) {
    return this.uomRepo.findById(id);
  }

  async create(input: { code: string; name: string }) {
    return this.uomRepo.create(input);
  }
}

export class ProductVariantAttributeService {
  constructor(private attrRepo: ProductVariantAttributeRepository) {}

  async findByVariantId(productVariantId: string) {
    const rows = await this.attrRepo.findByVariantId(productVariantId);
    return rows.map((row) => ({
      attributeId: row.attributeId,
      attribute: {
        id: row.attributeId,
        name: row.attributeName,
      },
      value: row.value,
    }));
  }
}
