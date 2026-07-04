import {
  ProductRepository,
  CategoryRepository,
} from '../repositories/product.repository';

export class ProductService {
  constructor(
    private productRepo: ProductRepository,
    private categoryRepo: CategoryRepository
  ) {}

  async findAll(filters?: {
    categoryId?: string;
    isManufactured?: boolean;
  }) {
    return this.productRepo.findAll(filters);
  }

  async findById(id: string) {
    return this.productRepo.findById(id);
  }

  async create(input: {
    name: string;
    categoryId: string;
    description?: string | null;
    isManufactured: boolean;
  }) {
    // Validate that the category exists
    const category = await this.categoryRepo.findById(input.categoryId);
    if (!category) {
      throw new Error(`Category with id "${input.categoryId}" not found.`);
    }

    return this.productRepo.create(input);
  }

  async update(
    id: string,
    input: {
      name?: string;
      categoryId?: string;
      description?: string | null;
      isManufactured?: boolean;
    }
  ) {
    // Verify the product exists
    const existing = await this.productRepo.findById(id);
    if (!existing) {
      throw new Error(`Product with id "${id}" not found.`);
    }

    // If changing category, validate it exists
    if (input.categoryId) {
      const category = await this.categoryRepo.findById(input.categoryId);
      if (!category) {
        throw new Error(
          `Category with id "${input.categoryId}" not found.`
        );
      }
    }

    return this.productRepo.update(id, input);
  }

  async delete(id: string): Promise<boolean> {
    const existing = await this.productRepo.findById(id);
    if (!existing) {
      throw new Error(`Product with id "${id}" not found.`);
    }

    return this.productRepo.delete(id);
  }
}

export class CategoryService {
  constructor(private categoryRepo: CategoryRepository) {}

  async findAll() {
    return this.categoryRepo.findAll();
  }

  async findById(id: string) {
    return this.categoryRepo.findById(id);
  }

  async create(input: { name: string }) {
    return this.categoryRepo.create(input);
  }

  async update(id: string, input: { name?: string }) {
    const existing = await this.categoryRepo.findById(id);
    if (!existing) {
      throw new Error(`Category with id "${id}" not found.`);
    }
    return this.categoryRepo.update(id, input);
  }

  async delete(id: string): Promise<boolean> {
    const existing = await this.categoryRepo.findById(id);
    if (!existing) {
      throw new Error(`Category with id "${id}" not found.`);
    }
    return this.categoryRepo.delete(id);
  }
}
