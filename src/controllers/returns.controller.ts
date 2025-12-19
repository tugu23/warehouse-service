import { Request, Response, NextFunction } from "express";
import prisma from "../db/prisma";
import { AppError } from "../middleware/error.middleware";
import logger from "../utils/logger";

export const createReturn = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { 
      orderId, 
      productId, 
      quantity, 
      reason, 
      customerId,      // NEW
      unitPrice,       // NEW
      expiryDate,      // NEW
      notes            // NEW
    } = req.body;

    // Use transaction to ensure data consistency
    const returnRecord = await prisma.$transaction(async (tx) => {
      // If orderId provided, validate it
      if (orderId) {
        const order = await tx.order.findUnique({
          where: { id: orderId },
          include: { orderItems: true },
        });

        if (!order) {
          throw new AppError(req.t.returns.orderNotFound, 404);
        }

        // Validate that the product was in this order
        const orderItem = order.orderItems.find(
          (item) => item.productId === productId
        );

        if (!orderItem) {
          throw new AppError(req.t.returns.productNotInOrder, 400);
        }

        // Validate quantity
        if (quantity > orderItem.quantity) {
          throw new AppError(
            `Буцаах тоо ширхэг (${quantity}) захиалсан тоо ширхгээс (${orderItem.quantity}) их байж болохгүй`,
            400
          );
        }
      }

      // Create return record with new fields
      const newReturn = await tx.return.create({
        data: {
          orderId: orderId || null,
          productId,
          quantity,
          reason,
          customerId: customerId || null,
          unitPrice: unitPrice || null,
          expiryDate: expiryDate ? new Date(expiryDate) : null,
          notes: notes || null,
        },
        include: {
          order: true,
          product: true,
          customer: true,
        },
      });

      // Increment stock
      await tx.product.update({
        where: { id: productId },
        data: {
          stockQuantity: {
            increment: quantity,
          },
        },
      });

      return newReturn;
    });

    logger.info(
      `Return created: Return ID ${returnRecord.id}, Product: ${returnRecord.product.nameMongolian}, Quantity: ${quantity}${customerId ? `, Customer ID: ${customerId}` : ''}`
    );

    res.status(201).json({
      status: "success",
      data: { return: returnRecord },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllReturns = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [returns, total] = await Promise.all([
      prisma.return.findMany({
        skip,
        take: limit,
        include: {
          order: {
            include: {
              customer: true,
              agent: {
                include: { role: true },
              },
            },
          },
          product: true,
          customer: true, // Include direct customer relation
        },
        orderBy: { returnDate: "desc" },
      }),
      prisma.return.count(),
    ]);

    res.json({
      status: "success",
      data: {
        returns,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getReturnById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const returnRecord = await prisma.return.findUnique({
      where: { id: parseInt(id) },
      include: {
        order: {
          include: {
            customer: true,
            agent: {
              include: { role: true },
            },
          },
        },
        product: true,
        customer: true, // Include direct customer relation
      },
    });

    if (!returnRecord) {
      throw new AppError(req.t.returns.notFound, 404);
    }

    res.json({
      status: "success",
      data: { return: returnRecord },
    });
  } catch (error) {
    next(error);
  }
};
