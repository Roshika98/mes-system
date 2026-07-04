import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  decimal,
  primaryKey,
  unique,
  timestamp,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

const auditColumns = {
  tenantId: uuid('tenant_id').notNull(),
  createdBy: uuid('created_by').notNull(),
  updatedBy: uuid('updated_by').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
};

// ---------------------------------------------------------------------------
// Tables
// ---------------------------------------------------------------------------

export const categories = pgTable('categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  ...auditColumns,
});

export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  categoryId: uuid('category_id')
    .references(() => categories.id)
    .notNull(),
  description: text('description'),
  isManufactured: boolean('is_manufactured').notNull().default(false),
  ...auditColumns,
});

export const unitOfMeasures = pgTable(
  'unit_of_measures',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    code: varchar('code', { length: 50 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    ...auditColumns,
  },
  (t) => [unique('uom_tenant_code_idx').on(t.tenantId, t.code)],
);

export const productVariants = pgTable(
  'product_variants',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    productId: uuid('product_id')
      .references(() => products.id)
      .notNull(),
    sku: varchar('sku', { length: 255 }).notNull(),
    barcode: varchar('barcode', { length: 255 }),
    uomId: uuid('uom_id')
      .references(() => unitOfMeasures.id)
      .notNull(),
    price: decimal('price', { precision: 12, scale: 2 }).notNull(),
    routingId: uuid('routing_id'),
    ...auditColumns,
  },
  (t) => [unique('variant_tenant_sku_idx').on(t.tenantId, t.sku)],
);

export const productAttributes = pgTable('product_attributes', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  ...auditColumns,
});

export const productVariantAttributes = pgTable(
  'product_variant_attributes',
  {
    productVariantId: uuid('product_variant_id')
      .references(() => productVariants.id)
      .notNull(),
    attributeId: uuid('attribute_id')
      .references(() => productAttributes.id)
      .notNull(),
    value: varchar('value', { length: 255 }).notNull(),
    ...auditColumns,
  },
  (t) => [primaryKey({ columns: [t.productVariantId, t.attributeId] })],
);

// ---------------------------------------------------------------------------
// Relations (for Drizzle relational query API)
// ---------------------------------------------------------------------------

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  variants: many(productVariants),
}));

export const unitOfMeasuresRelations = relations(unitOfMeasures, ({ many }) => ({
  productVariants: many(productVariants),
}));

export const productVariantsRelations = relations(
  productVariants,
  ({ one, many }) => ({
    product: one(products, {
      fields: [productVariants.productId],
      references: [products.id],
    }),
    uom: one(unitOfMeasures, {
      fields: [productVariants.uomId],
      references: [unitOfMeasures.id],
    }),
    attributes: many(productVariantAttributes),
  })
);

export const productAttributesRelations = relations(
  productAttributes,
  ({ many }) => ({
    variantAttributes: many(productVariantAttributes),
  })
);

export const productVariantAttributesRelations = relations(
  productVariantAttributes,
  ({ one }) => ({
    productVariant: one(productVariants, {
      fields: [productVariantAttributes.productVariantId],
      references: [productVariants.id],
    }),
    attribute: one(productAttributes, {
      fields: [productVariantAttributes.attributeId],
      references: [productAttributes.id],
    }),
  })
);
