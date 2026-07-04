import { StockRepository } from '../repositories/stock.repository';

export class StockService {
  constructor(private stockRepo: StockRepository) {}

  async findAll(filters?: {
    productVariantId?: string;
    warehouseId?: string;
    locationId?: string;
    batchNumber?: string | null;
  }) {
    return this.stockRepo.findAll(filters);
  }

  async findById(id: string) {
    return this.stockRepo.findById(id);
  }
}
