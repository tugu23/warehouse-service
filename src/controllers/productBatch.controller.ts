import { Request, Response, NextFunction } from "express";
import prisma from "../db/prisma";

/**
 * Хугацаа дуусах гэж байгаа бараанууд авах
 * Query params:
 *   - days: Хэдэн хоногийн дотор дуусах (default: 30)
 */
export const getExpiringProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    const expiringBatches = await prisma.productBatch.findMany({
      where: {
        isActive: true,
        quantity: {
          gt: 0,
        },
        expiryDate: {
          gte: now,
          lte: futureDate,
        },
      },
      include: {
        product: {
          include: {
            category: true,
            supplier: true,
          },
        },
      },
      orderBy: {
        expiryDate: "asc",
      },
    });

    res.json({
      status: "success",
      data: {
        batches: expiringBatches,
        count: expiringBatches.length,
        warningDays: days,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Хугацаа дууссан бараанууд авах
 */
export const getExpiredProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const now = new Date();

    const expiredBatches = await prisma.productBatch.findMany({
      where: {
        quantity: {
          gt: 0,
        },
        expiryDate: {
          lt: now,
        },
      },
      include: {
        product: {
          include: {
            category: true,
            supplier: true,
          },
        },
      },
      orderBy: {
        expiryDate: "desc",
      },
    });

    res.json({
      status: "success",
      data: {
        batches: expiredBatches,
        count: expiredBatches.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Багцын дэлгэрэнгүй мэдээлэл авах
 */
export const getBatchDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { productId } = req.params;

    const batches = await prisma.productBatch.findMany({
      where: {
        productId: parseInt(productId),
      },
      orderBy: [
        { isActive: "desc" },
        { expiryDate: "asc" },
      ],
    });

    res.json({
      status: "success",
      data: {
        batches,
        count: batches.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Багц шинэчлэх (тоо ширхэг, статус)
 */
export const updateBatch = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { batchId } = req.params;
    const { quantity, isActive } = req.body;

    const updateData: any = {};
    if (quantity !== undefined) updateData.quantity = quantity;
    if (isActive !== undefined) updateData.isActive = isActive;

    const updatedBatch = await prisma.productBatch.update({
      where: { id: parseInt(batchId) },
      data: updateData,
      include: {
        product: true,
      },
    });

    res.json({
      status: "success",
      data: { batch: updatedBatch },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Хугацааны статистик авах
 */
export const getExpirationStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const now = new Date();
    const next30Days = new Date();
    next30Days.setDate(next30Days.getDate() + 30);
    const next90Days = new Date();
    next90Days.setDate(next90Days.getDate() + 90);

    const [expired, expiring30, expiring90, total] = await Promise.all([
      // Хугацаа дууссан
      prisma.productBatch.count({
        where: {
          quantity: { gt: 0 },
          expiryDate: { lt: now },
        },
      }),
      // 30 хоногт дуусах
      prisma.productBatch.count({
        where: {
          isActive: true,
          quantity: { gt: 0 },
          expiryDate: {
            gte: now,
            lte: next30Days,
          },
        },
      }),
      // 90 хоногт дуусах
      prisma.productBatch.count({
        where: {
          isActive: true,
          quantity: { gt: 0 },
          expiryDate: {
            gte: now,
            lte: next90Days,
          },
        },
      }),
      // Нийт идэвхтэй багцууд
      prisma.productBatch.count({
        where: {
          isActive: true,
          quantity: { gt: 0 },
        },
      }),
    ]);

    res.json({
      status: "success",
      data: {
        expired,
        expiring30Days: expiring30,
        expiring90Days: expiring90,
        total,
        healthy: total - expiring90 - expired,
      },
    });
  } catch (error) {
    next(error);
  }
};

