/**
 * @mes-system/inventory
 *
 * Inventory Core bounded context library.
 * Provides GraphQL typedefs, resolvers, services, and repositories
 * for Product, ProductVariant, Category, and UnitOfMeasure.
 */

// GraphQL
export { inventoryTypeDefs } from './graphql/typedefs';
export { inventoryResolvers } from './graphql/resolvers';
export type { GraphQLContext } from './graphql/types';

// Services
export {
  ProductService,
  CategoryService,
  ProductVariantService,
  UnitOfMeasureService,
  ProductVariantAttributeService,
} from './services';

// Repositories
export {
  ProductRepository,
  CategoryRepository,
  ProductVariantRepository,
  UnitOfMeasureRepository,
  ProductVariantAttributeRepository,
} from './repositories';
