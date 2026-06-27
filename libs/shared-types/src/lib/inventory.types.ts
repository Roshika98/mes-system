export interface UnitOfMeasure {
  id: number;
  code: string;
  name: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  categoryId: number;
  description: string;
  isManufactured: boolean;
}

export interface ProductVariant {
  id: number;
  productId: number;
  sku: string;
  barcode: string;
  uomId: number;
  price: number;
  routingId?: number;
}

export interface Warehouse {
  id: number;
  name: string;
  location: string;
}

export interface Location {
  id: number;
  warehouseId: number;
  name: string;
  description: string;
}

export interface Stock {
  id: number;
  productVariantId: number;
  warehouseId: number;
  locationId: number;
  containerId?: number;
  quantity: number;
  batchNumber?: string;
  expiryDate?: Date;
  status: string;
}
