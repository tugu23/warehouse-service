import { Prisma } from "@prisma/client";
import { AppError } from "../middleware/error.middleware";

type Tx = Prisma.TransactionClient;

function positiveDecimal(
  d: Prisma.Decimal | null | undefined
): Prisma.Decimal | null {
  if (d == null) return null;
  const n = Number(d);
  if (!Number.isFinite(n) || n <= 0) return null;
  return d;
}

/**
 * Захиалгын мөрийн нэгж үнэ: эхлээд product_prices (харилцагчийн төрөл), дараа нь products.default_price.
 */
export async function resolveOrderItemUnitPrice(
  tx: Tx,
  params: {
    product: { id: number; defaultPrice: Prisma.Decimal | null };
    customer: { customerTypeId: number | null };
    mode:
      | "auto"
      | "wholesale"
      | "retail"
      | "defaultPrice"
      | "custom"
      | "customerType";
    item: { customUnitPrice?: number; unitPrice?: number };
    productName: string;
  }
): Promise<Prisma.Decimal> {
  const { product, customer, mode, item, productName } = params;

  if (mode === "custom") {
    const cp = Number(item.customUnitPrice ?? item.unitPrice);
    if (!Number.isFinite(cp) || cp <= 0) {
      throw new AppError(
        `${productName} барааны гараар оруулсан үнэ буруу байна`,
        400
      );
    }
    return new Prisma.Decimal(cp);
  }

  const fallback = positiveDecimal(product.defaultPrice);

  const typePriceFor = async (
    customerTypeId: number
  ): Promise<Prisma.Decimal | null> => {
    const pp = await tx.productPrice.findUnique({
      where: {
        productId_customerTypeId: {
          productId: product.id,
          customerTypeId,
        },
      },
    });
    return pp ? positiveDecimal(pp.price) : null;
  };

  if (mode === "customerType") {
    const ctId = customer.customerTypeId;
    if (ctId == null) {
      if (!fallback) {
        throw new AppError(
          `${productName}: төрлийн үнэ сонгогдсон боловч харилцагчид төрөл байхгүй, үндсэн үнэ ч тохируулаагүй`,
          400
        );
      }
      return fallback;
    }
    const tp = await typePriceFor(ctId);
    if (tp) return tp;
    if (!fallback) {
      throw new AppError(
        `${productName}: энэ харилцагчийн төрөлд үнэ тохируулаагүй, үндсэн үнэ ч байхгүй (Бараа → Үнэ удирдлага)`,
        400
      );
    }
    return fallback;
  }

  // auto | wholesale | retail | defaultPrice — ижил дүрэм: төрлийн үнэ эсвэл үндсэн
  const ctId = customer.customerTypeId;
  if (ctId != null) {
    const tp = await typePriceFor(ctId);
    if (tp) return tp;
  }
  if (!fallback) {
    throw new AppError(
      `${productName}: барааны үнэ тохируулаагүй (харилцагчийн төрөлд үнэ эсвэл үндсэн үнэ)`,
      400
    );
  }
  return fallback;
}
