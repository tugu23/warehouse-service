import { Prisma } from "@prisma/client";

const DEFAULT_VAT_RATE = 0.10; // 10%

export interface VATCalculation {
  subtotal: Prisma.Decimal;
  vat: Prisma.Decimal;
  total: Prisma.Decimal;
}

/**
 * Calculate VAT amount from a given amount
 * @param amount - The amount to calculate VAT from
 * @param rate - VAT rate (default: 10%)
 * @returns VAT amount
 */
export const calculateVAT = (
  amount: Prisma.Decimal | number,
  rate: number = DEFAULT_VAT_RATE
): Prisma.Decimal => {
  const amountDecimal = new Prisma.Decimal(amount.toString());
  const rateDecimal = new Prisma.Decimal(rate);
  return amountDecimal.mul(rateDecimal);
};

/**
 * Add VAT to an amount and return breakdown
 * @param subtotal - The subtotal amount before VAT
 * @param rate - VAT rate (default: 10%)
 * @returns Object with subtotal, vat, and total
 */
export const addVAT = (
  subtotal: Prisma.Decimal | number,
  rate: number = DEFAULT_VAT_RATE
): VATCalculation => {
  const subtotalDecimal = new Prisma.Decimal(subtotal.toString());
  const vatAmount = calculateVAT(subtotalDecimal, rate);
  const totalAmount = subtotalDecimal.add(vatAmount);

  return {
    subtotal: subtotalDecimal,
    vat: vatAmount,
    total: totalAmount,
  };
};

/**
 * Calculate subtotal and VAT from a total amount (reverse calculation)
 * @param total - The total amount including VAT
 * @param rate - VAT rate (default: 10%)
 * @returns Object with subtotal, vat, and total
 */
export const extractVAT = (
  total: Prisma.Decimal | number,
  rate: number = DEFAULT_VAT_RATE
): VATCalculation => {
  const totalDecimal = new Prisma.Decimal(total.toString());
  const divisor = new Prisma.Decimal(1 + rate);
  const subtotalDecimal = totalDecimal.div(divisor);
  const vatAmount = totalDecimal.sub(subtotalDecimal);

  return {
    subtotal: subtotalDecimal,
    vat: vatAmount,
    total: totalDecimal,
  };
};

export default {
  calculateVAT,
  addVAT,
  extractVAT,
  DEFAULT_VAT_RATE,
};

