import { GraphQLContext } from '../types';

export const serialNumberResolvers = {
  Query: {
    serialNumbers: (
      _parent: unknown,
      args: {
        productVariantId?: string;
        status?: string;
        warehouseId?: string;
        locationId?: string;
      },
      ctx: GraphQLContext
    ) => {
      return ctx.services.serialNumberService.findAll({
        productVariantId: args.productVariantId ?? undefined,
        status: args.status ?? undefined,
        warehouseId: args.warehouseId ?? undefined,
        locationId: args.locationId ?? undefined,
      });
    },
    serialNumber: (_parent: unknown, args: { id: string }, ctx: GraphQLContext) => {
      return ctx.services.serialNumberService.findById(args.id);
    },
    serialNumberByCode: (
      _parent: unknown,
      args: { serialNumber: string },
      ctx: GraphQLContext
    ) => {
      return ctx.services.serialNumberService.findBySerialNumber(args.serialNumber);
    },
  },

  Mutation: {
    createSerialNumber: (
      _parent: unknown,
      args: {
        input: {
          productVariantId: string;
          serialNumber: string;
          status: string;
          currentWarehouseId?: string;
          currentLocationId?: string;
        };
      },
      ctx: GraphQLContext
    ) => {
      return ctx.services.serialNumberService.create(args.input);
    },
    updateSerialNumber: (
      _parent: unknown,
      args: {
        id: string;
        input: {
          status?: string;
          currentWarehouseId?: string;
          currentLocationId?: string;
        };
      },
      ctx: GraphQLContext
    ) => {
      return ctx.services.serialNumberService.update(args.id, args.input);
    },
  },

  SerialNumber: {
    productVariant: (parent: { productVariantId: string }, _args: unknown, ctx: GraphQLContext) => {
      return ctx.services.productVariantService.findById(parent.productVariantId);
    },
    currentWarehouse: (parent: { currentWarehouseId?: string }, _args: unknown, ctx: GraphQLContext) => {
      if (!parent.currentWarehouseId) return null;
      return ctx.services.warehouseService.findById(parent.currentWarehouseId);
    },
    currentLocation: (parent: { currentLocationId?: string }, _args: unknown, ctx: GraphQLContext) => {
      if (!parent.currentLocationId) return null;
      return ctx.services.locationService.findById(parent.currentLocationId);
    },
  },
};
