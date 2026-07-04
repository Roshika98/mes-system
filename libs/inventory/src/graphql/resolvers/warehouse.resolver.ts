import { GraphQLContext } from '../types';

export const warehouseResolvers = {
  Query: {
    warehouses: (_parent: unknown, _args: unknown, ctx: GraphQLContext) => {
      return ctx.services.warehouseService.findAll();
    },
    warehouse: (_parent: unknown, args: { id: string }, ctx: GraphQLContext) => {
      return ctx.services.warehouseService.findById(args.id);
    },
    locations: (_parent: unknown, args: { warehouseId: string }, ctx: GraphQLContext) => {
      return ctx.services.locationService.findByWarehouseId(args.warehouseId);
    },
    location: (_parent: unknown, args: { id: string }, ctx: GraphQLContext) => {
      return ctx.services.locationService.findById(args.id);
    },
  },

  Mutation: {
    createWarehouse: (
      _parent: unknown,
      args: { input: { name: string; location?: string } },
      ctx: GraphQLContext
    ) => {
      return ctx.services.warehouseService.create(args.input);
    },
    updateWarehouse: (
      _parent: unknown,
      args: { id: string; input: { name?: string; location?: string } },
      ctx: GraphQLContext
    ) => {
      return ctx.services.warehouseService.update(args.id, args.input);
    },
    deleteWarehouse: (_parent: unknown, args: { id: string }, ctx: GraphQLContext) => {
      return ctx.services.warehouseService.delete(args.id);
    },
    createLocation: (
      _parent: unknown,
      args: { input: { warehouseId: string; name: string; description?: string } },
      ctx: GraphQLContext
    ) => {
      return ctx.services.locationService.create(args.input);
    },
    updateLocation: (
      _parent: unknown,
      args: { id: string; input: { name?: string; description?: string } },
      ctx: GraphQLContext
    ) => {
      return ctx.services.locationService.update(args.id, args.input);
    },
    deleteLocation: (_parent: unknown, args: { id: string }, ctx: GraphQLContext) => {
      return ctx.services.locationService.delete(args.id);
    },
  },

  Warehouse: {
    locations: (parent: { id: string }, _args: unknown, ctx: GraphQLContext) => {
      return ctx.services.locationService.findByWarehouseId(parent.id);
    },
  },

  Location: {
    warehouse: (parent: { warehouseId: string }, _args: unknown, ctx: GraphQLContext) => {
      return ctx.services.warehouseService.findById(parent.warehouseId);
    },
  },
};
