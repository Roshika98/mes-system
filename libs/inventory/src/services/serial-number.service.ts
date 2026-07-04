import { SerialNumberRepository } from '../repositories/serial-number.repository';
import { ProductVariantRepository } from '../repositories/product-variant.repository';
import { WarehouseRepository, LocationRepository } from '../repositories/warehouse.repository';

export class SerialNumberService {
  constructor(
    private serialNumberRepo: SerialNumberRepository,
    private variantRepo: ProductVariantRepository,
    private warehouseRepo: WarehouseRepository,
    private locationRepo: LocationRepository
  ) {}

  async findAll(filters?: {
    productVariantId?: string;
    status?: string;
    warehouseId?: string;
    locationId?: string;
  }) {
    return this.serialNumberRepo.findAll(filters);
  }

  async findById(id: string) {
    return this.serialNumberRepo.findById(id);
  }

  async findBySerialNumber(serialNumber: string) {
    return this.serialNumberRepo.findBySerialNumber(serialNumber);
  }

  async create(input: {
    productVariantId: string;
    serialNumber: string;
    status: string;
    currentWarehouseId?: string | null;
    currentLocationId?: string | null;
  }) {
    // Validate variant exists
    const variant = await this.variantRepo.findById(input.productVariantId);
    if (!variant) {
      throw new Error(`ProductVariant with id "${input.productVariantId}" not found.`);
    }

    // Validate serial number uniqueness
    const existing = await this.serialNumberRepo.findBySerialNumber(input.serialNumber);
    if (existing) {
      throw new Error(`Serial number "${input.serialNumber}" is already registered.`);
    }

    // Validate warehouse if provided
    if (input.currentWarehouseId) {
      const warehouse = await this.warehouseRepo.findById(input.currentWarehouseId);
      if (!warehouse) {
        throw new Error(`Warehouse with id "${input.currentWarehouseId}" not found.`);
      }
    }

    // Validate location if provided
    if (input.currentLocationId) {
      const location = await this.locationRepo.findById(input.currentLocationId);
      if (!location) {
        throw new Error(`Location with id "${input.currentLocationId}" not found.`);
      }
      if (input.currentWarehouseId && location.warehouseId !== input.currentWarehouseId) {
        throw new Error(`Location "${input.currentLocationId}" does not belong to Warehouse "${input.currentWarehouseId}".`);
      }
    }

    return this.serialNumberRepo.create(input);
  }

  async update(
    id: string,
    input: {
      status?: string;
      currentWarehouseId?: string | null;
      currentLocationId?: string | null;
    }
  ) {
    const existing = await this.serialNumberRepo.findById(id);
    if (!existing) {
      throw new Error(`SerialNumber with id "${id}" not found.`);
    }

    if (input.currentWarehouseId) {
      const warehouse = await this.warehouseRepo.findById(input.currentWarehouseId);
      if (!warehouse) {
        throw new Error(`Warehouse with id "${input.currentWarehouseId}" not found.`);
      }
    }

    if (input.currentLocationId) {
      const location = await this.locationRepo.findById(input.currentLocationId);
      if (!location) {
        throw new Error(`Location with id "${input.currentLocationId}" not found.`);
      }
      const warehouseId = input.currentWarehouseId !== undefined ? input.currentWarehouseId : existing.currentWarehouseId;
      if (warehouseId && location.warehouseId !== warehouseId) {
        throw new Error(`Location "${input.currentLocationId}" does not belong to Warehouse "${warehouseId}".`);
      }
    }

    return this.serialNumberRepo.update(id, input);
  }
}
