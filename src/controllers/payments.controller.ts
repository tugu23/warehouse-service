import { Request, Response, NextFunction } from "express";
import prisma from "../db/prisma";
import { AppError } from "../middleware/error.middleware";
import { AuthRequest } from "../middleware/auth.middleware";
import logger from "../utils/logger";
import { Prisma } from "@prisma/client";

export const recordPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id: orderId } = req.params;
    const { amount, paymentMethod, notes } = req.body;

    // Validate amount
    if (!amount || amount <= 0) {
      throw new AppError(req.t.payments.invalidAmount, 400);
    }

    const result = await prisma.$transaction(async (tx) => {
      // Get order with current payment info
      const order = await tx.order.findUnique({
        where: { id: parseInt(orderId) },
        include: {
          customer: true,
          payments: true,
        },
      });

      if (!order) {
        throw new AppError(req.t.payments.orderNotFound, 404);
      }

      // Calculate remaining amount
      const totalAmount = order.totalAmount || new Prisma.Decimal(0);
      const currentPaid = order.paidAmount || new Prisma.Decimal(0);
      const paymentAmount = new Prisma.Decimal(amount.toString());
      const newPaidAmount = currentPaid.add(paymentAmount);
      const remaining = totalAmount.sub(newPaidAmount);

      if (remaining.lt(0)) {
        throw new AppError(
          `Төлбөрийн дүн үлдсэн дүнгээс их байна. Үлдсэн дүн: ${totalAmount.sub(currentPaid).toString()}`,
          400
        );
      }

      // Create payment record
      const payment = await tx.payment.create({
        data: {
          orderId: parseInt(orderId),
          amount: paymentAmount,
          paymentMethod: paymentMethod || order.paymentMethod,
          notes,
        },
      });

      // Update order payment status
      let paymentStatus: "Paid" | "Pending" | "Partial" | "Overdue";
      if (remaining.equals(0)) {
        paymentStatus = "Paid";
      } else if (newPaidAmount.gt(0)) {
        paymentStatus = "Partial";
      } else {
        paymentStatus = order.paymentStatus as "Paid" | "Pending" | "Partial" | "Overdue";
      }

      // Check if payment is overdue
      if (order.dueDate && new Date() > order.dueDate && remaining.gt(0)) {
        paymentStatus = "Overdue";
      }

      const updatedOrder = await tx.order.update({
        where: { id: parseInt(orderId) },
        data: {
          paidAmount: newPaidAmount,
          remainingAmount: remaining,
          paymentStatus,
        },
        include: {
          customer: true,
          agent: {
            include: { role: true },
          },
          payments: true,
        },
      });

      return { payment, order: updatedOrder };
    });

    logger.info(
      `Payment recorded: Order ${orderId}, Amount: ${amount}, Method: ${paymentMethod}`
    );

    res.status(201).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderPayments = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id: orderId } = req.params;

    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId) },
      include: {
        payments: {
          orderBy: { paymentDate: "desc" },
        },
        customer: true,
      },
    });

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    res.json({
      status: "success",
      data: {
        orderId: order.id,
        totalAmount: order.totalAmount,
        paidAmount: order.paidAmount,
        remainingAmount: order.remainingAmount,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        dueDate: order.dueDate,
        payments: order.payments,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllPayments = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;
    const paymentMethod = req.query.paymentMethod as string;

    const where: any = {};

    if (startDate || endDate) {
      where.paymentDate = {};
      if (startDate) {
        where.paymentDate.gte = new Date(startDate);
      }
      if (endDate) {
        where.paymentDate.lte = new Date(endDate);
      }
    }

    if (paymentMethod) {
      where.paymentMethod = paymentMethod;
    }

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        skip,
        take: limit,
        include: {
          order: {
            include: {
              customer: true,
              agent: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
        orderBy: { paymentDate: "desc" },
      }),
      prisma.payment.count({ where }),
    ]);

    res.json({
      status: "success",
      data: {
        payments,
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

export const getOverdueOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const now = new Date();

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: {
          paymentStatus: {
            in: ["Pending", "Partial", "Overdue"],
          },
          dueDate: {
            lt: now,
          },
        },
        skip,
        take: limit,
        include: {
          customer: true,
          agent: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          payments: true,
        },
        orderBy: { dueDate: "asc" },
      }),
      prisma.order.count({
        where: {
          paymentStatus: {
            in: ["Pending", "Partial", "Overdue"],
          },
          dueDate: {
            lt: now,
          },
        },
      }),
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

export const getCreditOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    const customerId = req.query.customerId as string;

    const where: any = {
      paymentMethod: "Credit",
      paymentStatus: {
        in: ["Pending", "Partial"],
      },
    };

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
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          payments: true,
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

