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
  WarehouseService,
  LocationService,
  StockService,
  SerialNumberService,
  StockMovementService,
  ProductOrchestratorService,
  ProductAttributeService,
} from './services';

// Repositories
export {
  ProductRepository,
  CategoryRepository,
  ProductVariantRepository,
  UnitOfMeasureRepository,
  ProductVariantAttributeRepository,
  ProductAttributeRepository,
  WarehouseRepository,
  LocationRepository,
  StockRepository,
  SerialNumberRepository,
  StockMovementRepository,
} from './repositories';

