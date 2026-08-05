import { Request, Response, NextFunction } from "express";
import { PromotionType } from "@prisma/client";
import prisma from "../db/prisma";
import { AppError } from "../middleware/error.middleware";
import logger from "../utils/logger";

type PromotionInput = {
  name?: string;
  type?: string;
  discountPercent?: number | string | null;
  minQuantity?: number | string | null;
  buyQty?: number | null;
  freeQty?: number | null;
  startDate?: string | Date;
  endDate?: string | Date;
  isActive?: boolean;
};

function parsePromotionPayload(
  body: PromotionInput,
  options: { partial?: boolean } = {}
) {
  const partial = options.partial === true;

  const name = body.name !== undefined ? String(body.name).trim() : undefined;
  if (!partial && !name) {
    throw new AppError("Урамшууллын нэр оруулна уу", 400);
  }

  let type: PromotionType | undefined;
  if (body.type !== undefined) {
    if (
      body.type !== "PERCENT_DISCOUNT" &&
      body.type !== "BUY_X_GET_Y"
    ) {
      throw new AppError("Урамшууллын төрөл буруу байна", 400);
    }
    type = body.type as PromotionType;
  } else if (!partial) {
    throw new AppError("Урамшууллын төрөл сонгоно уу", 400);
  }

  const startDate =
    body.startDate !== undefined && body.startDate !== null && body.startDate !== ""
      ? new Date(body.startDate as string)
      : undefined;
  const endDate =
    body.endDate !== undefined && body.endDate !== null && body.endDate !== ""
      ? new Date(body.endDate as string)
      : undefined;

  if (startDate && Number.isNaN(startDate.getTime())) {
    throw new AppError("Эхлэх огноо буруу байна", 400);
  }
  if (endDate && Number.isNaN(endDate.getTime())) {
    throw new AppError("Дуусах огноо буруу байна", 400);
  }
  if (!partial && startDate && endDate && endDate.getTime() <= startDate.getTime()) {
    throw new AppError("Дуусах огноо нь эхлэх огнооноос хойш байх ёстой", 400);
  }

  let discountPercent: number | null | undefined;
  let minQuantity: number | null | undefined;
  let buyQty: number | null | undefined;
  let freeQty: number | null | undefined;

  if (type === "PERCENT_DISCOUNT") {
    const dp =
      body.discountPercent !== undefined && body.discountPercent !== null
        ? Number(body.discountPercent)
        : NaN;
    if (!Number.isFinite(dp) || dp <= 0 || dp > 100) {
      throw new AppError("Хөнгөлөлтийн хувь 0-100 хооронд байх ёстой", 400);
    }
    discountPercent = dp;
    // minQuantity: if provided, must be >= 1; if not provided, null means no minimum
    if (body.minQuantity !== undefined && body.minQuantity !== null && body.minQuantity !== "") {
      const mq = Number(body.minQuantity);
      if (!Number.isFinite(mq) || mq < 1) {
        throw new AppError("Доод тоо ширхэг 1 буюу түүнээс их байх ёстой", 400);
      }
      minQuantity = Math.floor(mq);
    } else {
      minQuantity = null;
    }
    buyQty = null;
    freeQty = null;
  } else if (type === "BUY_X_GET_Y") {
    const bx = body.buyQty != null ? Number(body.buyQty) : NaN;
    const fy = body.freeQty != null ? Number(body.freeQty) : NaN;
    if (!Number.isFinite(bx) || bx < 1) {
      throw new AppError("Авах ширхэг (buyQty) 1 ба түүнээс их байна", 400);
    }
    if (!Number.isFinite(fy) || fy < 1) {
      throw new AppError("Урамшуулалт ширхэг (freeQty) 1 ба түүнээс их байна", 400);
    }
    discountPercent = null;
    minQuantity = null;
    buyQty = Math.floor(bx);
    freeQty = Math.floor(fy);
  } else if (partial) {
    if (body.discountPercent !== undefined) {
      const dp = body.discountPercent != null ? Number(body.discountPercent) : NaN;
      if (!Number.isFinite(dp) || dp <= 0 || dp > 100) {
        throw new AppError("Хөнгөлөлтийн хувь 0-100 хооронд байх ёстой", 400);
      }
      discountPercent = dp;
    }
    if (body.minQuantity !== undefined) {
      if (body.minQuantity === null || body.minQuantity === "" || body.minQuantity === undefined) {
        minQuantity = null;
      } else {
        const mq = Number(body.minQuantity);
        if (!Number.isFinite(mq) || mq < 1) {
          throw new AppError("Доод тоо ширхэг 1 буюу түүнээс их байх ёстой", 400);
        }
        minQuantity = Math.floor(mq);
      }
    }
    if (body.buyQty !== undefined) {
      const bx = body.buyQty != null ? Number(body.buyQty) : NaN;
      if (!Number.isFinite(bx) || bx < 1) {
        throw new AppError("Авах ширхэг (buyQty) 1 ба түүнээс их байна", 400);
      }
      buyQty = Math.floor(bx);
    }
    if (body.freeQty !== undefined) {
      const fy = body.freeQty != null ? Number(body.freeQty) : NaN;
      if (!Number.isFinite(fy) || fy < 1) {
        throw new AppError(
          "Урамшуулалт ширхэг (freeQty) 1 ба түүнээс их байна",
          400
        );
      }
      freeQty = Math.floor(fy);
    }
  }

  const isActive =
    body.isActive !== undefined ? Boolean(body.isActive) : undefined;

  return {
    name,
    type,
    discountPercent,
    minQuantity,
    buyQty,
    freeQty,
    startDate,
    endDate,
    isActive,
  };
}

function serializePromotion<T extends { discountPercent: any; minQuantity: any }>(p: T) {
  return {
    ...p,
    discountPercent:
      p.discountPercent != null ? Number(p.discountPercent) : null,
    minQuantity:
      p.minQuantity != null ? Number(p.minQuantity) : null,
  };
}

export const listPromotionsByProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const productId = parseInt(req.params.productId, 10);
    if (!Number.isFinite(productId)) {
      throw new AppError("Барааны ID буруу байна", 400);
    }

    const onlyActive = req.query.activeOnly === "true";
    const now = new Date();

    const where: any = { productId };
    if (onlyActive) {
      where.isActive = true;
      where.AND = [
        { startDate: { lte: now } },
        { OR: [{ endDate: null }, { endDate: { gte: now } }] },
      ];
    }

    const promotions = await prisma.promotion.findMany({
      where,
      orderBy: [{ isActive: "desc" }, { startDate: "asc" }],
    });

    res.json({
      status: "success",
      data: { promotions: promotions.map(serializePromotion) },
    });
  } catch (error) {
    next(error);
  }
};

export const createPromotion = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const productId = parseInt(req.params.productId, 10);
    if (!Number.isFinite(productId)) {
      throw new AppError("Барааны ID буруу байна", 400);
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new AppError("Бараа олдсонгүй", 404);
    }

    const data = parsePromotionPayload(req.body || {});

    const created = await prisma.promotion.create({
      data: {
        productId,
        name: data.name!,
        type: data.type!,
        discountPercent: data.discountPercent ?? null,
        minQuantity: data.minQuantity ?? null,
        buyQty: data.buyQty ?? null,
        freeQty: data.freeQty ?? null,
        startDate: data.startDate ?? new Date(),
        endDate: data.endDate ?? null,
        isActive: data.isActive ?? true,
      },
    });

    logger.info(
      `Promotion created for product ${productId}: ${created.name} (${created.type})`
    );

    res.status(201).json({
      status: "success",
      data: { promotion: serializePromotion(created) },
    });
  } catch (error) {
    next(error);
  }
};

export const updatePromotion = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!Number.isFinite(id)) {
      throw new AppError("Урамшууллын ID буруу байна", 400);
    }

    const existing = await prisma.promotion.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError("Урамшуулал олдсонгүй", 404);
    }

    const partial = parsePromotionPayload(req.body || {}, { partial: true });

    const newType = partial.type ?? existing.type;
    const newStart = partial.startDate ?? existing.startDate;
    const newEnd = partial.endDate ?? existing.endDate;
    if (newEnd && newStart && newEnd.getTime() <= newStart.getTime()) {
      throw new AppError(
        "Дуусах огноо нь эхлэх огнооноос хойш байх ёстой",
        400
      );
    }

    const data: any = {};
    if (partial.name !== undefined) data.name = partial.name;
    if (partial.type !== undefined) data.type = partial.type;
    if (partial.startDate !== undefined) data.startDate = partial.startDate;
    if (partial.endDate !== undefined) data.endDate = partial.endDate;
    if (partial.isActive !== undefined) data.isActive = partial.isActive;

    if (newType === "PERCENT_DISCOUNT") {
      if (partial.discountPercent !== undefined) data.discountPercent = partial.discountPercent;
      if (partial.minQuantity !== undefined) data.minQuantity = partial.minQuantity;
      if (existing.type !== newType) {
        data.buyQty = null;
        data.freeQty = null;
      }
    } else if (newType === "BUY_X_GET_Y") {
      if (partial.buyQty !== undefined) data.buyQty = partial.buyQty;
      if (partial.freeQty !== undefined) data.freeQty = partial.freeQty;
      if (existing.type !== newType) {
        data.discountPercent = null;
        data.minQuantity = null;
      }
    }

    const updated = await prisma.promotion.update({
      where: { id },
      data,
    });

    res.json({
      status: "success",
      data: { promotion: serializePromotion(updated) },
    });
  } catch (error) {
    next(error);
  }
};

export const deletePromotion = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!Number.isFinite(id)) {
      throw new AppError("Урамшууллын ID буруу байна", 400);
    }

    const existing = await prisma.promotion.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError("Урамшуулал олдсонгүй", 404);
    }

    await prisma.promotion.delete({ where: { id } });

    res.json({ status: "success", data: { id } });
  } catch (error) {
    next(error);
  }
};

/**
 * Хугацаа нь дууссан бүх урамшууллыг авто идэвхгүй болгох туслах функц.
 * Scheduler-ээс дуудна.
 */
export const deactivateExpiredPromotions = async (): Promise<number> => {
  const now = new Date();
  const result = await prisma.promotion.updateMany({
    where: {
      isActive: true,
      endDate: { lt: now },
    },
    data: { isActive: false },
  });
  if (result.count > 0) {
    logger.info(`Deactivated ${result.count} expired promotion(s)`);
  }
  return result.count;
};
