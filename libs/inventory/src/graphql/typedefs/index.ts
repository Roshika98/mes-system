import gql from 'graphql-tag';
import { DocumentNode } from 'graphql';

const baseTypeDefs = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

const categoryTypeDefs = gql`
  type Category {
    id: ID!
    name: String!
    products: [Product!]!
  }

  input CreateCategoryInput {
    name: String!
  }

  input UpdateCategoryInput {
    name: String
  }

  extend type Query {
    categories: [Category!]!
    category(id: ID!): Category
  }

  extend type Mutation {
    createCategory(input: CreateCategoryInput!): Category!
    updateCategory(id: ID!, input: UpdateCategoryInput!): Category!
    deleteCategory(id: ID!): Boolean!
  }
`;

const uomTypeDefs = gql`
  type UnitOfMeasure {
    id: ID!
    code: String!
    name: String!
  }

  input CreateUnitOfMeasureInput {
    code: String!
    name: String!
  }

  extend type Query {
    unitsOfMeasure: [UnitOfMeasure!]!
    unitOfMeasure(id: ID!): UnitOfMeasure
  }

  extend type Mutation {
    createUnitOfMeasure(input: CreateUnitOfMeasureInput!): UnitOfMeasure!
  }
`;

const productTypeDefs = gql`
  type Product {
    id: ID!
    name: String!
    category: Category
    categoryId: ID!
    description: String
    isManufactured: Boolean!
    variants: [ProductVariant!]!
  }

  input CreateProductInput {
    name: String!
    categoryId: ID!
    description: String
    isManufactured: Boolean!
  }

  input UpdateProductInput {
    name: String
    categoryId: ID
    description: String
    isManufactured: Boolean
  }

  extend type Query {
    products(categoryId: ID, isManufactured: Boolean): [Product!]!
    product(id: ID!): Product
  }

  extend type Mutation {
    createProduct(input: CreateProductInput!): Product!
    updateProduct(id: ID!, input: UpdateProductInput!): Product!
    deleteProduct(id: ID!): Boolean!
  }
`;

const productVariantTypeDefs = gql`
  type ProductVariant {
    id: ID!
    product: Product!
    productId: ID!
    sku: String!
    barcode: String
    uom: UnitOfMeasure
    uomId: ID!
    price: Float!
    routingId: ID
    attributes: [ProductVariantAttribute!]!
  }

  type ProductVariantAttribute {
    attributeId: ID!
    attribute: ProductAttribute!
    value: String!
  }

  type ProductAttribute {
    id: ID!
    name: String!
  }

  input CreateProductVariantInput {
    productId: ID!
    sku: String!
    barcode: String
    uomId: ID!
    price: Float!
    routingId: ID
  }

  input UpdateProductVariantInput {
    sku: String
    barcode: String
    uomId: ID
    price: Float
    routingId: ID
  }

  extend type Query {
    productVariants(productId: ID!): [ProductVariant!]!
    productVariant(id: ID!): ProductVariant
    productVariantBySku(sku: String!): ProductVariant
  }

  extend type Mutation {
    createProductVariant(input: CreateProductVariantInput!): ProductVariant!
    updateProductVariant(
      id: ID!
      input: UpdateProductVariantInput!
    ): ProductVariant!
    deleteProductVariant(id: ID!): Boolean!
  }
`;

const warehouseTypeDefs = gql`
  type Warehouse {
    id: ID!
    name: String!
    location: String
    locations: [Location!]!
  }

  input CreateWarehouseInput {
    name: String!
    location: String
  }

  input UpdateWarehouseInput {
    name: String
    location: String
  }

  extend type Query {
    warehouses: [Warehouse!]!
    warehouse(id: ID!): Warehouse
  }

  extend type Mutation {
    createWarehouse(input: CreateWarehouseInput!): Warehouse!
    updateWarehouse(id: ID!, input: UpdateWarehouseInput!): Warehouse!
    deleteWarehouse(id: ID!): Boolean!
  }
`;

const locationTypeDefs = gql`
  type Location {
    id: ID!
    warehouseId: ID!
    warehouse: Warehouse!
    name: String!
    description: String
  }

  input CreateLocationInput {
    warehouseId: ID!
    name: String!
    description: String
  }

  input UpdateLocationInput {
    name: String
    description: String
  }

  extend type Query {
    locations(warehouseId: ID!): [Location!]!
    location(id: ID!): Location
  }

  extend type Mutation {
    createLocation(input: CreateLocationInput!): Location!
    updateLocation(id: ID!, input: UpdateLocationInput!): Location!
    deleteLocation(id: ID!): Boolean!
  }
`;

const stockTypeDefs = gql`
  type Stock {
    id: ID!
    productVariantId: ID!
    productVariant: ProductVariant!
    warehouseId: ID!
    warehouse: Warehouse!
    locationId: ID!
    location: Location!
    quantity: Float!
    batchNumber: String
    status: String!
  }

  extend type Query {
    stocks(
      productVariantId: ID
      warehouseId: ID
      locationId: ID
      batchNumber: String
    ): [Stock!]!
    stock(id: ID!): Stock
  }
`;

const serialNumberTypeDefs = gql`
  type SerialNumber {
    id: ID!
    productVariantId: ID!
    productVariant: ProductVariant!
    serialNumber: String!
    status: String!
    currentWarehouseId: ID
    currentWarehouse: Warehouse
    currentLocationId: ID
    currentLocation: Location
  }

  input CreateSerialNumberInput {
    productVariantId: ID!
    serialNumber: String!
    status: String!
    currentWarehouseId: ID
    currentLocationId: ID
  }

  input UpdateSerialNumberInput {
    status: String
    currentWarehouseId: ID
    currentLocationId: ID
  }

  extend type Query {
    serialNumbers(
      productVariantId: ID
      status: String
      warehouseId: ID
      locationId: ID
    ): [SerialNumber!]!
    serialNumber(id: ID!): SerialNumber
    serialNumberByCode(serialNumber: String!): SerialNumber
  }

  extend type Mutation {
    createSerialNumber(input: CreateSerialNumberInput!): SerialNumber!
    updateSerialNumber(id: ID!, input: UpdateSerialNumberInput!): SerialNumber!
  }
`;

const stockMovementTypeDefs = gql`
  enum StockMovementType {
    RECEIPT
    ISSUE
    TRANSFER
    ADJUSTMENT
  }

  type StockMovement {
    id: ID!
    productVariantId: ID!
    productVariant: ProductVariant!
    fromWarehouseId: ID
    fromWarehouse: Warehouse
    fromLocationId: ID
    fromLocation: Location
    toWarehouseId: ID
    toWarehouse: Warehouse
    toLocationId: ID
    toLocation: Location
    quantity: Float!
    movementType: StockMovementType!
    relatedOrderType: String
    relatedOrderId: ID
    batchNumber: String
    serialNumberId: ID
    serialNumber: SerialNumber
    notes: String
    createdAt: String!
    createdBy: ID!
  }

  input ExecuteStockMovementInput {
    productVariantId: ID!
    fromWarehouseId: ID
    fromLocationId: ID
    toWarehouseId: ID
    toLocationId: ID
    quantity: Float!
    movementType: StockMovementType!
    relatedOrderType: String
    relatedOrderId: ID
    batchNumber: String
    serialNumberId: ID
    notes: String
  }

  extend type Query {
    stockMovements(
      productVariantId: ID
      warehouseId: ID
      locationId: ID
      movementType: StockMovementType
    ): [StockMovement!]!
    stockMovement(id: ID!): StockMovement
  }

  extend type Mutation {
    executeStockMovement(input: ExecuteStockMovementInput!): StockMovement!
  }
`;

export const inventoryTypeDefs: DocumentNode[] = [
  baseTypeDefs,
  categoryTypeDefs,
  uomTypeDefs,
  productTypeDefs,
  productVariantTypeDefs,
  warehouseTypeDefs,
  locationTypeDefs,
  stockTypeDefs,
  serialNumberTypeDefs,
  stockMovementTypeDefs,
];

