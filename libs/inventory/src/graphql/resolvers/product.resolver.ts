import { GraphQLContext } from '../types';

export const productResolvers = {
  Query: {
    products: (
      _parent: unknown,
      args: { categoryId?: string; isManufactured?: boolean },
      ctx: GraphQLContext
    ) => {
      return ctx.services.productService.findAll({
        categoryId: args.categoryId ?? undefined,
        isManufactured: args.isManufactured ?? undefined,
      });
    },

    product: (
      _parent: unknown,
      args: { id: string },
      ctx: GraphQLContext
    ) => {
      return ctx.services.productService.findById(args.id);
    },

    categories: (
      _parent: unknown,
      _args: unknown,
      ctx: GraphQLContext
    ) => {
      return ctx.services.categoryService.findAll();
    },

    category: (
      _parent: unknown,
      args: { id: string },
      ctx: GraphQLContext
    ) => {
      return ctx.services.categoryService.findById(args.id);
    },
  },

  Mutation: {
    createProduct: (
      _parent: unknown,
      args: {
        input: {
          name: string;
          categoryId: string;
          description?: string;
          isManufactured: boolean;
        };
      },
      ctx: GraphQLContext
    ) => {
      return ctx.services.productService.create(args.input);
    },

    createProductWithVariants: (
      _parent: unknown,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      args: { input: any },
      ctx: GraphQLContext
    ) => {
      return ctx.services.productOrchestratorService.createProductWithVariants(args.input);
    },

    updateProduct: (
      _parent: unknown,
      args: {
        id: string;
        input: {
          name?: string;
          categoryId?: string;
          description?: string;
          isManufactured?: boolean;
        };
      },
      ctx: GraphQLContext
    ) => {
      return ctx.services.productService.update(args.id, args.input);
    },

    deleteProduct: (
      _parent: unknown,
      args: { id: string },
      ctx: GraphQLContext
    ) => {
      return ctx.services.productService.delete(args.id);
    },

    createCategory: (
      _parent: unknown,
      args: { input: { name: string } },
      ctx: GraphQLContext
    ) => {
      return ctx.services.categoryService.create(args.input);
    },

    updateCategory: (
      _parent: unknown,
      args: { id: string; input: { name?: string } },
      ctx: GraphQLContext
    ) => {
      return ctx.services.categoryService.update(args.id, args.input);
    },

    deleteCategory: (
      _parent: unknown,
      args: { id: string },
      ctx: GraphQLContext
    ) => {
      return ctx.services.categoryService.delete(args.id);
    },
  },

  // Field resolvers for nested relationships
  Product: {
    category: (
      parent: { categoryId: string },
      _args: unknown,
      ctx: GraphQLContext
    ) => {
      return ctx.services.categoryService.findById(parent.categoryId);
    },

    variants: (
      parent: { id: string },
      _args: unknown,
      ctx: GraphQLContext
    ) => {
      return ctx.services.productVariantService.findByProductId(parent.id);
    },
  },

  Category: {
    products: (
      parent: { id: string },
      _args: unknown,
      ctx: GraphQLContext
    ) => {
      return ctx.services.productService.findAll({
        categoryId: parent.id,
      });
    },
  },
};
