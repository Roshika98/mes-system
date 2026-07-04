import { GraphQLContext } from '../types';

export const stockMovementResolvers = {
  Query: {
    stockMovements: (
      _parent: unknown,
      args: {
        productVariantId?: string;
        warehouseId?: string;
        locationId?: string;
        movementType?: string;
      },
      ctx: GraphQLContext
    ) => {
      return ctx.services.stockMovementService.findAll({
        productVariantId: args.productVariantId ?? undefined,
        warehouseId: args.warehouseId ?? undefined,
        locationId: args.locationId ?? undefined,
        movementType: args.movementType ?? undefined,
      });
    },
    stockMovement: (_parent: unknown, args: { id: string }, ctx: GraphQLContext) => {
      return ctx.services.stockMovementService.findById(args.id);
    },
  },

  Mutation: {
    executeStockMovement: (
      _parent: unknown,
      args: {
        input: {
          productVariantId: string;
          fromWarehouseId?: string;
          fromLocationId?: string;
          toWarehouseId?: string;
          toLocationId?: string;
          quantity: number;
          movementType: 'RECEIPT' | 'ISSUE' | 'TRANSFER' | 'ADJUSTMENT';
          relatedOrderType?: string;
          relatedOrderId?: string;
          batchNumber?: string;
          serialNumberId?: string;
          notes?: string;
        };
      },
      ctx: GraphQLContext
    ) => {
      return ctx.services.stockMovementService.executeMovement(args.input);
    },
  },

  StockMovement: {
    productVariant: (parent: { productVariantId: string }, _args: unknown, ctx: GraphQLContext) => {
      return ctx.services.productVariantService.findById(parent.productVariantId);
    },
    fromWarehouse: (parent: { fromWarehouseId?: string }, _args: unknown, ctx: GraphQLContext) => {
      if (!parent.fromWarehouseId) return null;
      return ctx.services.warehouseService.findById(parent.fromWarehouseId);
    },
    fromLocation: (parent: { fromLocationId?: string }, _args: unknown, ctx: GraphQLContext) => {
      if (!parent.fromLocationId) return null;
      return ctx.services.locationService.findById(parent.fromLocationId);
    },
    toWarehouse: (parent: { toWarehouseId?: string }, _args: unknown, ctx: GraphQLContext) => {
      if (!parent.toWarehouseId) return null;
      return ctx.services.warehouseService.findById(parent.toWarehouseId);
    },
    toLocation: (parent: { toLocationId?: string }, _args: unknown, ctx: GraphQLContext) => {
      if (!parent.toLocationId) return null;
      return ctx.services.locationService.findById(parent.toLocationId);
    },
    serialNumber: (parent: { serialNumberId?: string }, _args: unknown, ctx: GraphQLContext) => {
      if (!parent.serialNumberId) return null;
      return ctx.services.serialNumberService.findById(parent.serialNumberId);
    },
  },
};
