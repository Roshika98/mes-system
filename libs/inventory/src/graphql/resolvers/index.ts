import { mergeResolvers } from '@graphql-tools/merge';
import { productResolvers } from './product.resolver';
import { productVariantResolvers } from './product-variant.resolver';
import { warehouseResolvers } from './warehouse.resolver';
import { stockResolvers } from './stock.resolver';
import { serialNumberResolvers } from './serial-number.resolver';
import { stockMovementResolvers } from './stock-movement.resolver';

/**
 * All inventory module resolvers, deep-merged into a single
 * resolver map ready for makeExecutableSchema.
 */
export const inventoryResolvers = mergeResolvers([
  productResolvers,
  productVariantResolvers,
  warehouseResolvers,
  stockResolvers,
  serialNumberResolvers,
  stockMovementResolvers,
]);

