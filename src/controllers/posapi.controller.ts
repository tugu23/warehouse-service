import { Request, Response, NextFunction } from "express";
import prisma from "../db/prisma";
import { AppError } from "../middleware/error.middleware";
import logger from "../utils/logger";
import { posApiService } from "../services/posapi.service";

export const syncOrderToPosApi = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Validate order exists
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
        customer: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      throw new AppError(req.t.orders.notFound, 404);
    }

    // Sync to POS API
    const result = await posApiService.syncOrder(order.id);

    if (result.success) {
      logger.info(`Order ${id} synced to POS: ${result.posOrderId}`);
    } else {
      logger.error(`Failed to sync order ${id} to POS: ${result.message}`);
    }

    res.json({
      status: result.success ? "success" : "error",
      data: {
        orderId: order.id,
        posOrderId: result.posOrderId,
        message: result.message,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const syncProductToPosApi = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Validate product exists
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: {
        category: true,
        supplier: true,
      },
    });

    if (!product) {
      throw new AppError(req.t.products.notFound, 404);
    }

    // Sync to POS API
    const result = await posApiService.syncProduct(product.id);

    if (result.success) {
      logger.info(`Product ${id} synced to POS: ${result.posProductId}`);
    } else {
      logger.error(`Failed to sync product ${id} to POS: ${result.message}`);
    }

    res.json({
      status: result.success ? "success" : "error",
      data: {
        productId: product.id,
        posProductId: result.posProductId,
        message: result.message,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getPosSalesData = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      throw new AppError("Эхлэх болон дуусах огноо заавал шаардлагатай", 400);
    }

    const start = new Date(startDate as string);
    const end = new Date(endDate as string);

    // Get sales data from POS
    const result = await posApiService.getPosSalesData(start, end);

    res.json({
      status: result.success ? "success" : "error",
      data: {
        dateRange: {
          startDate: start,
          endDate: end,
        },
        sales: result.data || [],
        message: result.message,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const checkPosApiStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await posApiService.checkStatus();

    res.json({
      status: result.success ? "success" : "error",
      data: {
        online: result.online,
        message: result.message,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
};

