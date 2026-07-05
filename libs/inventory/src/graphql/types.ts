import {
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
} from '../services';

/**
 * GraphQL context type.
 * All services are attached to the context in the server's
 * Apollo middleware setup, making them available to every resolver.
 */
export interface GraphQLContext {
  tenantId: string;
  userId: string;
  roles: string[];
  services: {
    productService: ProductService;
    categoryService: CategoryService;
    productVariantService: ProductVariantService;
    unitOfMeasureService: UnitOfMeasureService;
    productVariantAttributeService: ProductVariantAttributeService;
    warehouseService: WarehouseService;
    locationService: LocationService;
    stockService: StockService;
    serialNumberService: SerialNumberService;
    stockMovementService: StockMovementService;
    productOrchestratorService: ProductOrchestratorService;
    productAttributeService: ProductAttributeService;
  };
}

