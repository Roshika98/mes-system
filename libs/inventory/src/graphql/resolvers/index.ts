import { mergeResolvers } from '@graphql-tools/merge';
import { productResolvers } from './product.resolver';
import { productVariantResolvers } from './product-variant.resolver';

/**
 * All inventory module resolvers, deep-merged into a single
 * resolver map ready for makeExecutableSchema.
 */
export const inventoryResolvers = mergeResolvers([
  productResolvers,
  productVariantResolvers,
]);
