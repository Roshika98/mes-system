import {
  WarehouseRepository,
  LocationRepository,
} from '../repositories/warehouse.repository';

export class WarehouseService {
  constructor(private warehouseRepo: WarehouseRepository) {}

  async findAll() {
    return this.warehouseRepo.findAll();
  }

  async findById(id: string) {
    return this.warehouseRepo.findById(id);
  }

  async create(input: { name: string; location?: string | null }) {
    return this.warehouseRepo.create(input);
  }

  async update(id: string, input: { name?: string; location?: string | null }) {
    const existing = await this.warehouseRepo.findById(id);
    if (!existing) {
      throw new Error(`Warehouse with id "${id}" not found.`);
    }
    return this.warehouseRepo.update(id, input);
  }

  async delete(id: string): Promise<boolean> {
    const existing = await this.warehouseRepo.findById(id);
    if (!existing) {
      throw new Error(`Warehouse with id "${id}" not found.`);
    }
    return this.warehouseRepo.delete(id);
  }
}

export class LocationService {
  constructor(
    private locationRepo: LocationRepository,
    private warehouseRepo: WarehouseRepository
  ) {}

  async findAll() {
    return this.locationRepo.findAll();
  }

  async findByWarehouseId(warehouseId: string) {
    return this.locationRepo.findByWarehouseId(warehouseId);
  }

  async findById(id: string) {
    return this.locationRepo.findById(id);
  }

  async create(input: { warehouseId: string; name: string; description?: string | null }) {
    const warehouse = await this.warehouseRepo.findById(input.warehouseId);
    if (!warehouse) {
      throw new Error(`Warehouse with id "${input.warehouseId}" not found.`);
    }
    return this.locationRepo.create(input);
  }

  async update(id: string, input: { name?: string; description?: string | null }) {
    const existing = await this.locationRepo.findById(id);
    if (!existing) {
      throw new Error(`Location with id "${id}" not found.`);
    }
    return this.locationRepo.update(id, input);
  }

  async delete(id: string): Promise<boolean> {
    const existing = await this.locationRepo.findById(id);
    if (!existing) {
      throw new Error(`Location with id "${id}" not found.`);
    }
    return this.locationRepo.delete(id);
  }
}
