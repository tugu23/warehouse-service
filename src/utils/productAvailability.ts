import { Prisma } from "@prisma/client";

type DecimalLike = Prisma.Decimal | number | string | null | undefined;

function positiveNumber(value: DecimalLike): number | null {
  if (value === null || value === undefined || value === "") return null;
  const num =
    typeof value === "number"
      ? value
      : typeof value === "string"
      ? Number(value)
      : Number(value.toString());

  if (!Number.isFinite(num) || num <= 0) return null;
  return num;
}

export function hasAnyPositivePrice(product: {
  defaultPrice?: DecimalLike;
  pricePerBox?: DecimalLike;
  prices?: Array<{ price?: DecimalLike | null }>;
}): boolean {
  if (positiveNumber(product.defaultPrice) != null) return true;
  if (positiveNumber(product.pricePerBox) != null) return true;
  return (
    product.prices?.some((priceRow) => positiveNumber(priceRow.price) != null) ??
    false
  );
}

export function shouldForceInactiveProduct(product: {
  stockQuantity: number;
  defaultPrice?: DecimalLike;
  pricePerBox?: DecimalLike;
  prices?: Array<{ price?: DecimalLike | null }>;
}): boolean {
  return (product.stockQuantity ?? 0) <= 0 && !hasAnyPositivePrice(product);
}

export function resolveProductActiveState(params: {
  currentIsActive?: boolean | null;
  requestedIsActive?: boolean | undefined;
  stockQuantity: number;
  defaultPrice?: DecimalLike;
  pricePerBox?: DecimalLike;
  prices?: Array<{ price?: DecimalLike | null }>;
}): boolean {
  if (shouldForceInactiveProduct(params)) {
    return false;
  }

  if (params.requestedIsActive !== undefined) {
    return params.requestedIsActive;
  }

  return params.currentIsActive ?? true;
}

export function withResolvedProductActiveState<
  T extends {
    isActive?: boolean | null;
    stockQuantity: number;
    defaultPrice?: DecimalLike;
    pricePerBox?: DecimalLike;
    prices?: Array<{ price?: DecimalLike | null }>;
  }
>(product: T): T & { isActive: boolean } {
  return {
    ...product,
    isActive: resolveProductActiveState({
      currentIsActive: product.isActive,
      stockQuantity: product.stockQuantity,
      defaultPrice: product.defaultPrice,
      pricePerBox: product.pricePerBox,
      prices: product.prices,
    }),
  };
}
