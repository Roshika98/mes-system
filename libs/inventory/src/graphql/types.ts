import {
  ProductService,
  CategoryService,
  ProductVariantService,
  UnitOfMeasureService,
  ProductVariantAttributeService,
} from '../services';

/**
 * GraphQL context type.
 * All services are attached to the context in the server's
 * Apollo middleware setup, making them available to every resolver.
 */
export interface GraphQLContext {
  tenantId: string;
  userId: string;
  services: {
    productService: ProductService;
    categoryService: CategoryService;
    productVariantService: ProductVariantService;
    unitOfMeasureService: UnitOfMeasureService;
    productVariantAttributeService: ProductVariantAttributeService;
  };
}
