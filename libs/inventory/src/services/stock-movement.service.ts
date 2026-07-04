import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { StockMovementRepository } from '../repositories/stock-movement.repository';
import { StockRepository } from '../repositories/stock.repository';
import { SerialNumberRepository } from '../repositories/serial-number.repository';
import { WarehouseRepository, LocationRepository } from '../repositories/warehouse.repository';
import { ProductVariantRepository } from '../repositories/product-variant.repository';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Db = NodePgDatabase<any>;

export interface ExecuteStockMovementInput {
  productVariantId: string;
  fromWarehouseId?: string | null;
  fromLocationId?: string | null;
  toWarehouseId?: string | null;
  toLocationId?: string | null;
  quantity: number;
  movementType: 'RECEIPT' | 'ISSUE' | 'TRANSFER' | 'ADJUSTMENT';
  relatedOrderType?: string | null;
  relatedOrderId?: string | null;
  batchNumber?: string | null;
  serialNumberId?: string | null;
  notes?: string | null;
}

export class StockMovementService {
  constructor(
    private db: Db,
    private movementRepo: StockMovementRepository,
    private stockRepo: StockRepository,
    private serialNumberRepo: SerialNumberRepository,
    private warehouseRepo: WarehouseRepository,
    private locationRepo: LocationRepository,
    private variantRepo: ProductVariantRepository
  ) {}

  async findAll(filters?: {
    productVariantId?: string;
    warehouseId?: string;
    locationId?: string;
    movementType?: string;
  }) {
    return this.movementRepo.findAll(filters);
  }

  async findById(id: string) {
    return this.movementRepo.findById(id);
  }

  async executeMovement(input: ExecuteStockMovementInput) {
    if (input.quantity <= 0) {
      throw new Error('Quantity must be greater than zero.');
    }

    // 1. Basic validation of product variant existence
    const variant = await this.variantRepo.findById(input.productVariantId);
    if (!variant) {
      throw new Error(`ProductVariant with id "${input.productVariantId}" not found.`);
    }

    // Validate destination warehouse/location if specified
    if (input.toWarehouseId) {
      const toWarehouse = await this.warehouseRepo.findById(input.toWarehouseId);
      if (!toWarehouse) {
        throw new Error(`Destination Warehouse with id "${input.toWarehouseId}" not found.`);
      }
    }
    if (input.toLocationId) {
      const toLocation = await this.locationRepo.findById(input.toLocationId);
      if (!toLocation) {
        throw new Error(`Destination Location with id "${input.toLocationId}" not found.`);
      }
      if (input.toWarehouseId && toLocation.warehouseId !== input.toWarehouseId) {
        throw new Error(`Destination Location does not belong to destination Warehouse.`);
      }
    }

    // Validate origin warehouse/location if specified
    if (input.fromWarehouseId) {
      const fromWarehouse = await this.warehouseRepo.findById(input.fromWarehouseId);
      if (!fromWarehouse) {
        throw new Error(`Origin Warehouse with id "${input.fromWarehouseId}" not found.`);
      }
    }
    if (input.fromLocationId) {
      const fromLocation = await this.locationRepo.findById(input.fromLocationId);
      if (!fromLocation) {
        throw new Error(`Origin Location with id "${input.fromLocationId}" not found.`);
      }
      if (input.fromWarehouseId && fromLocation.warehouseId !== input.fromWarehouseId) {
        throw new Error(`Origin Location does not belong to origin Warehouse.`);
      }
    }

    // Validate specific movement types and their parameters
    switch (input.movementType) {
      case 'RECEIPT':
        if (!input.toWarehouseId || !input.toLocationId) {
          throw new Error('Receipt movement requires a destination warehouse and location.');
        }
        break;
      case 'ISSUE':
        if (!input.fromWarehouseId || !input.fromLocationId) {
          throw new Error('Issue movement requires an origin warehouse and location.');
        }
        break;
      case 'TRANSFER':
        if (!input.fromWarehouseId || !input.fromLocationId || !input.toWarehouseId || !input.toLocationId) {
          throw new Error('Transfer movement requires both origin and destination warehouses and locations.');
        }
        break;
      case 'ADJUSTMENT':
        // Adjustment must have at least one (either origin, or destination, or both).
        if (!input.fromWarehouseId && !input.toWarehouseId) {
          throw new Error('Adjustment movement requires at least an origin or destination warehouse.');
        }
        break;
      default:
        throw new Error(`Invalid movement type: ${input.movementType}`);
    }

    // Transaction start
    return this.db.transaction(async (tx) => {
      // Instantiate tx-scoped repositories
      const txMovementRepo = this.movementRepo.withTransaction(tx);
      const txStockRepo = this.stockRepo.withTransaction(tx);
      const txSerialNumberRepo = this.serialNumberRepo.withTransaction(tx);

      // 2. Validate serial number if provided
      if (input.serialNumberId) {
        const serial = await txSerialNumberRepo.findById(input.serialNumberId);
        if (!serial) {
          throw new Error(`SerialNumber with id "${input.serialNumberId}" not found.`);
        }
        if (serial.productVariantId !== input.productVariantId) {
          throw new Error(`SerialNumber "${serial.serialNumber}" is not for product variant "${input.productVariantId}".`);
        }

        // Validation based on movement type
        if (input.movementType === 'TRANSFER' || input.movementType === 'ISSUE') {
          // Origin check: must match serial's current location
          if (serial.currentWarehouseId !== input.fromWarehouseId || serial.currentLocationId !== input.fromLocationId) {
            throw new Error(`SerialNumber "${serial.serialNumber}" is located at warehouse "${serial.currentWarehouseId}" and location "${serial.currentLocationId}", not origin.`);
          }
        }

        // Update serial number location and status
        let newStatus = serial.status;
        if (input.movementType === 'RECEIPT' || input.movementType === 'TRANSFER') {
          newStatus = 'AVAILABLE';
        } else if (input.movementType === 'ISSUE') {
          newStatus = 'SOLD';
        }

        await txSerialNumberRepo.update(input.serialNumberId, {
          status: newStatus,
          currentWarehouseId: input.toWarehouseId ?? null,
          currentLocationId: input.toLocationId ?? null,
        });
      }

      // 3. Process stock adjustments
      // Decrement origin stock if source is specified
      if (input.fromWarehouseId && input.fromLocationId) {
        const fromStock = await txStockRepo.findSpecificStock(
          input.productVariantId,
          input.fromWarehouseId,
          input.fromLocationId,
          input.batchNumber
        );

        if (!fromStock || Number(fromStock.quantity) < input.quantity) {
          throw new Error(`Insufficient stock at origin. Available: ${fromStock ? fromStock.quantity : 0}, Required: ${input.quantity}`);
        }

        await txStockRepo.upsertStock(
          input.productVariantId,
          input.fromWarehouseId,
          input.fromLocationId,
          input.batchNumber,
          -input.quantity
        );
      }

      // Increment destination stock if destination is specified
      if (input.toWarehouseId && input.toLocationId) {
        await txStockRepo.upsertStock(
          input.productVariantId,
          input.toWarehouseId,
          input.toLocationId,
          input.batchNumber,
          input.quantity
        );
      }

      // 4. Create immutable movement ledger entry
      return txMovementRepo.create({
        productVariantId: input.productVariantId,
        fromWarehouseId: input.fromWarehouseId,
        fromLocationId: input.fromLocationId,
        toWarehouseId: input.toWarehouseId,
        toLocationId: input.toLocationId,
        quantity: input.quantity.toString(),
        movementType: input.movementType,
        relatedOrderType: input.relatedOrderType,
        relatedOrderId: input.relatedOrderId,
        batchNumber: input.batchNumber,
        serialNumberId: input.serialNumberId,
        notes: input.notes,
      });
    });
  }
}
