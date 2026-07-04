export interface UnitOfMeasure {
  id: string;
  code: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  description: string;
  isManufactured: boolean;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  barcode: string;
  uomId: string;
  price: number;
  routingId?: string;
}

export interface Warehouse {
  id: string;
  name: string;
  location: string;
}

export interface Location {
  id: string;
  warehouseId: string;
  name: string;
  description: string;
}

export interface Stock {
  id: string;
  productVariantId: string;
  warehouseId: string;
  locationId: string;
  containerId?: string;
  quantity: number;
  batchNumber?: string;
  expiryDate?: Date;
  status: string;
}
