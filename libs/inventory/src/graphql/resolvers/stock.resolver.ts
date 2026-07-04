import { GraphQLContext } from '../types';

export const stockResolvers = {
  Query: {
    stocks: (
      _parent: unknown,
      args: {
        productVariantId?: string;
        warehouseId?: string;
        locationId?: string;
        batchNumber?: string;
      },
      ctx: GraphQLContext
    ) => {
      return ctx.services.stockService.findAll({
        productVariantId: args.productVariantId ?? undefined,
        warehouseId: args.warehouseId ?? undefined,
        locationId: args.locationId ?? undefined,
        batchNumber: args.batchNumber ?? undefined,
      });
    },
    stock: (_parent: unknown, args: { id: string }, ctx: GraphQLContext) => {
      return ctx.services.stockService.findById(args.id);
    },
  },

  Stock: {
    productVariant: (parent: { productVariantId: string }, _args: unknown, ctx: GraphQLContext) => {
      return ctx.services.productVariantService.findById(parent.productVariantId);
    },
    warehouse: (parent: { warehouseId: string }, _args: unknown, ctx: GraphQLContext) => {
      return ctx.services.warehouseService.findById(parent.warehouseId);
    },
    location: (parent: { locationId: string }, _args: unknown, ctx: GraphQLContext) => {
      return ctx.services.locationService.findById(parent.locationId);
    },
  },
};
