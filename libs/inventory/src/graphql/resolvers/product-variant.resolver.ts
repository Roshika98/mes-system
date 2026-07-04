import { GraphQLContext } from '../types';

export const productVariantResolvers = {
  Query: {
    productVariants: (
      _parent: unknown,
      args: { productId: string },
      ctx: GraphQLContext
    ) => {
      return ctx.services.productVariantService.findByProductId(
        args.productId
      );
    },

    productVariant: (
      _parent: unknown,
      args: { id: string },
      ctx: GraphQLContext
    ) => {
      return ctx.services.productVariantService.findById(args.id);
    },

    productVariantBySku: (
      _parent: unknown,
      args: { sku: string },
      ctx: GraphQLContext
    ) => {
      return ctx.services.productVariantService.findBySku(args.sku);
    },

    unitsOfMeasure: (
      _parent: unknown,
      _args: unknown,
      ctx: GraphQLContext
    ) => {
      return ctx.services.unitOfMeasureService.findAll();
    },

    unitOfMeasure: (
      _parent: unknown,
      args: { id: string },
      ctx: GraphQLContext
    ) => {
      return ctx.services.unitOfMeasureService.findById(args.id);
    },
  },

  Mutation: {
    createProductVariant: (
      _parent: unknown,
      args: {
        input: {
          productId: string;
          sku: string;
          barcode?: string;
          uomId: string;
          price: number;
          routingId?: string;
        };
      },
      ctx: GraphQLContext
    ) => {
      return ctx.services.productVariantService.create(args.input);
    },

    updateProductVariant: (
      _parent: unknown,
      args: {
        id: string;
        input: {
          sku?: string;
          barcode?: string;
          uomId?: string;
          price?: number;
          routingId?: string;
        };
      },
      ctx: GraphQLContext
    ) => {
      return ctx.services.productVariantService.update(
        args.id,
        args.input
      );
    },

    deleteProductVariant: (
      _parent: unknown,
      args: { id: string },
      ctx: GraphQLContext
    ) => {
      return ctx.services.productVariantService.delete(args.id);
    },

    createUnitOfMeasure: (
      _parent: unknown,
      args: { input: { code: string; name: string } },
      ctx: GraphQLContext
    ) => {
      return ctx.services.unitOfMeasureService.create(args.input);
    },
  },

  // Field resolvers for nested relationships
  ProductVariant: {
    product: (
      parent: { productId: string },
      _args: unknown,
      ctx: GraphQLContext
    ) => {
      return ctx.services.productService.findById(parent.productId);
    },

    uom: (
      parent: { uomId: string },
      _args: unknown,
      ctx: GraphQLContext
    ) => {
      return ctx.services.unitOfMeasureService.findById(parent.uomId);
    },

    price: (parent: { price: string }) => {
      // Drizzle returns decimal as string; GraphQL expects Float
      return parseFloat(parent.price);
    },

    attributes: (
      parent: { id: string },
      _args: unknown,
      ctx: GraphQLContext
    ) => {
      return ctx.services.productVariantAttributeService.findByVariantId(
        parent.id
      );
    },
  },
};
