import { Request, Response, NextFunction } from "express";
import prisma from "../db/prisma";
import { AppError } from "../middleware/error.middleware";
import { AuthRequest } from "../middleware/auth.middleware";
import logger from "../utils/logger";
import { Prisma } from "@prisma/client";

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const { customerId, items } = req.body;

    if (!items || items.length === 0) {
      throw new AppError("Order must contain at least one item", 400);
    }

    // Use transaction to ensure data consistency
    const order = await prisma.$transaction(async (tx) => {
      // Validate customer exists
      const customer = await tx.customer.findUnique({
        where: { id: customerId },
      });

      if (!customer) {
        throw new AppError("Customer not found", 404);
      }

      // Validate stock availability and calculate total
      let totalAmount = new Prisma.Decimal(0);
      const orderItemsData = [];

      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new AppError(
            `Product with ID ${item.productId} not found`,
            404
          );
        }

        if (product.stockQuantity < item.quantity) {
          throw new AppError(
            `Insufficient stock for product ${product.nameMongolian}. Available: ${product.stockQuantity}, Requested: ${item.quantity}`,
            400
          );
        }

        // Determine price based on customer type
        const unitPrice =
          customer.customerTypeId === 2
            ? product.priceWholesale || product.priceRetail
            : product.priceRetail;

        if (!unitPrice) {
          throw new AppError(
            `Price not set for product ${product.nameMongolian}`,
            400
          );
        }

        const itemTotal = new Prisma.Decimal(unitPrice.toString()).mul(
          item.quantity
        );
        totalAmount = totalAmount.add(itemTotal);

        orderItemsData.push({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice,
        });

        // Decrement stock
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: {
              decrement: item.quantity,
            },
          },
        });
      }

      // Create order
      const newOrder = await tx.order.create({
        data: {
          customerId,
          agentId: authReq.user!.userId,
          totalAmount,
          status: "Pending",
          orderItems: {
            create: orderItemsData,
          },
        },
        include: {
          customer: true,
          agent: {
            include: { role: true },
          },
          orderItems: {
            include: { product: true },
          },
        },
      });

      return newOrder;
    });

    logger.info(
      `New order created: Order ID ${order.id}, Total: ${order.totalAmount}`
    );

    res.status(201).json({
      status: "success",
      data: { order },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status as string;
    const customerId = req.query.customerId as string;

    const where: any = {};

    // Sales agents can only see their own orders
    if (authReq.user?.role === "SalesAgent") {
      where.agentId = authReq.user.userId;
    }

    if (status) {
      where.status = status;
    }

    if (customerId) {
      where.customerId = parseInt(customerId);
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        include: {
          customer: true,
          agent: {
            include: { role: true },
          },
          orderItems: {
            include: { product: true },
          },
        },
        orderBy: { orderDate: "desc" },
      }),
      prisma.order.count({ where }),
    ]);

    res.json({
      status: "success",
      data: {
        orders,
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

export const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
        customer: true,
        agent: {
          include: { role: true },
        },
        orderItems: {
          include: { product: true },
        },
      },
    });

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    // Sales agents can only see their own orders
    if (
      authReq.user?.role === "SalesAgent" &&
      order.agentId !== authReq.user.userId
    ) {
      throw new AppError("You do not have access to this order", 403);
    }

    res.json({
      status: "success",
      data: { order },
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
    });

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(id) },
      data: { status },
      include: {
        customer: true,
        agent: {
          include: { role: true },
        },
        orderItems: {
          include: { product: true },
        },
      },
    });

    logger.info(`Order ${id} status updated to: ${status}`);

    res.json({
      status: "success",
      data: { order: updatedOrder },
    });
  } catch (error) {
    next(error);
  }
};
