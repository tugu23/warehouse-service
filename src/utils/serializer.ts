import { Decimal } from "@prisma/client/runtime/library";

/**
 * Converts Prisma Decimal objects to numbers for JSON serialization
 */
export function serializeDecimal(value: any): any {
  if (value === null || value === undefined) {
    return value;
  }

  if (value instanceof Decimal) {
    return Number(value.toString());
  }

  if (Array.isArray(value)) {
    return value.map(serializeDecimal);
  }

  if (typeof value === "object" && value.constructor === Object) {
    const serialized: any = {};
    for (const key in value) {
      serialized[key] = serializeDecimal(value[key]);
    }
    return serialized;
  }

  return value;
}

/**
 * Serializes products with proper Decimal conversion
 */
export function serializeProduct(product: any): any {
  return serializeDecimal(product);
}

/**
 * Serializes an array of products with proper Decimal conversion
 */
export function serializeProducts(products: any[]): any[] {
  return products.map(serializeProduct);
}

