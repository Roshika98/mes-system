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

export const inventoryTypeDefs: DocumentNode[] = [
  baseTypeDefs,
  categoryTypeDefs,
  uomTypeDefs,
  productTypeDefs,
  productVariantTypeDefs,
];
