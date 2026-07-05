import {
  ProductAttributeRepository,
  CreateProductAttributeInput,
  UpdateProductAttributeInput,
} from '../repositories/product-attribute.repository';

export class ProductAttributeService {
  constructor(private productAttributeRepo: ProductAttributeRepository) {}

  async findAll() {
    return this.productAttributeRepo.findAll();
  }

  async findById(id: string) {
    return this.productAttributeRepo.findById(id);
  }

  async create(input: CreateProductAttributeInput) {
    return this.productAttributeRepo.create(input);
  }

  async update(id: string, input: UpdateProductAttributeInput) {
    const existing = await this.productAttributeRepo.findById(id);
    if (!existing) {
      throw new Error(`ProductAttribute with id "${id}" not found.`);
    }
    return this.productAttributeRepo.update(id, input);
  }

  async delete(id: string): Promise<boolean> {
    const existing = await this.productAttributeRepo.findById(id);
    if (!existing) {
      throw new Error(`ProductAttribute with id "${id}" not found.`);
    }
    return this.productAttributeRepo.delete(id);
  }
}
