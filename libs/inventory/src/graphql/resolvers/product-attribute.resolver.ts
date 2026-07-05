import { GraphQLContext } from '../types';

export const productAttributeResolvers = {
  Query: {
    productAttributes: (
      _parent: unknown,
      _args: unknown,
      ctx: GraphQLContext,
    ) => {
      return ctx.services.productAttributeService.findAll();
    },

    productAttribute: (
      _parent: unknown,
      args: { id: string },
      ctx: GraphQLContext,
    ) => {
      return ctx.services.productAttributeService.findById(args.id);
    },
  },

  Mutation: {
    createProductAttribute: (
      _parent: unknown,
      args: { input: { name: string } },
      ctx: GraphQLContext,
    ) => {
      return ctx.services.productAttributeService.create(args.input);
    },

    updateProductAttribute: (
      _parent: unknown,
      args: { id: string; input: { name?: string } },
      ctx: GraphQLContext,
    ) => {
      return ctx.services.productAttributeService.update(args.id, args.input);
    },

    deleteProductAttribute: (
      _parent: unknown,
      args: { id: string },
      ctx: GraphQLContext,
    ) => {
      return ctx.services.productAttributeService.delete(args.id);
    },
  },
};
