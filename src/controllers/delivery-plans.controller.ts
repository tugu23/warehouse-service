import { Request, Response, NextFunction } from "express";
import prisma from "../db/prisma";
import { AppError } from "../middleware/error.middleware";
import { AuthRequest } from "../middleware/auth.middleware";
import logger from "../utils/logger";

export const createDeliveryPlan = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const {
      planDate,
      agentId,
      customerId,
      orderId,
      scheduledTime,
      description,
      targetArea,
      estimatedOrders,
      deliveryNotes,
    } = req.body;

    // Validate agent exists
    const agent = await prisma.employee.findUnique({
      where: { id: agentId },
    });

    if (!agent) {
      throw new AppError("Борлуулагч олдсонгүй", 404);
    }

    // Validate customer exists
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      throw new AppError(req.t.customers.notFound, 404);
    }

    // If orderId provided, validate it exists
    if (orderId) {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
      });

      if (!order) {
        throw new AppError(req.t.orders.notFound, 404);
      }
    }

    const plan = await prisma.deliveryPlan.create({
      data: {
        planDate: new Date(planDate),
        agentId,
        customerId,
        orderId: orderId || null,
        scheduledTime: scheduledTime ? new Date(scheduledTime) : null,
        status: "Planned",
        description: description || null,
        targetArea: targetArea || null,
        estimatedOrders: estimatedOrders || null,
        deliveryNotes: deliveryNotes || null,
      },
      include: {
        agent: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
          },
        },
        customer: {
          select: {
            id: true,
            name: true,
            address: true,
            phoneNumber: true,
            locationLatitude: true,
            locationLongitude: true,
          },
        },
      },
    });

    logger.info(
      `Delivery plan created: ID ${plan.id}, Agent ${agentId}, Customer ${customerId}`
    );

    res.status(201).json({
      status: "success",
      data: { plan },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllDeliveryPlans = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const planDate = req.query.planDate as string;
    const agentId = req.query.agentId as string;
    const customerId = req.query.customerId as string;
    const status = req.query.status as string;

    const where: any = {};

    // Sales agents can only see their own plans
    if (authReq.user?.role === "SalesAgent") {
      where.agentId = authReq.user.userId;
    } else if (agentId) {
      where.agentId = parseInt(agentId);
    }

    if (planDate) {
      const date = new Date(planDate);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      where.planDate = {
        gte: date,
        lt: nextDate,
      };
    }

    if (customerId) {
      where.customerId = parseInt(customerId);
    }

    if (status) {
      where.status = status;
    }

    const [plans, total] = await Promise.all([
      prisma.deliveryPlan.findMany({
        where,
        skip,
        take: limit,
        include: {
          agent: {
            select: {
              id: true,
              name: true,
              email: true,
              phoneNumber: true,
            },
          },
          customer: {
            select: {
              id: true,
              name: true,
              address: true,
              phoneNumber: true,
              locationLatitude: true,
              locationLongitude: true,
            },
          },
        },
        orderBy: [{ planDate: "asc" }, { scheduledTime: "asc" }],
      }),
      prisma.deliveryPlan.count({ where }),
    ]);

    res.json({
      status: "success",
      data: {
        plans,
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

export const getDeliveryPlanById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const plan = await prisma.deliveryPlan.findUnique({
      where: { id: parseInt(id) },
      include: {
        agent: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
          },
        },
        customer: {
          select: {
            id: true,
            name: true,
            address: true,
            phoneNumber: true,
            locationLatitude: true,
            locationLongitude: true,
          },
        },
      },
    });

    if (!plan) {
      throw new AppError("Хүргэлтийн төлөвлөгөө олдсонгүй", 404);
    }

    res.json({
      status: "success",
      data: { plan },
    });
  } catch (error) {
    next(error);
  }
};

export const updateDeliveryPlan = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      planDate,
      scheduledTime,
      description,
      targetArea,
      estimatedOrders,
      deliveryNotes,
      orderId,
    } = req.body;

    const plan = await prisma.deliveryPlan.findUnique({
      where: { id: parseInt(id) },
    });

    if (!plan) {
      throw new AppError("Хүргэлтийн төлөвлөгөө олдсонгүй", 404);
    }

    const updateData: any = {};

    if (planDate) {
      updateData.planDate = new Date(planDate);
    }

    if (scheduledTime !== undefined) {
      updateData.scheduledTime = scheduledTime ? new Date(scheduledTime) : null;
    }

    if (description !== undefined) {
      updateData.description = description;
    }

    if (targetArea !== undefined) {
      updateData.targetArea = targetArea;
    }

    if (estimatedOrders !== undefined) {
      updateData.estimatedOrders = estimatedOrders;
    }

    if (deliveryNotes !== undefined) {
      updateData.deliveryNotes = deliveryNotes;
    }

    if (orderId !== undefined) {
      updateData.orderId = orderId || null;
    }

    const updatedPlan = await prisma.deliveryPlan.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        agent: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
          },
        },
        customer: {
          select: {
            id: true,
            name: true,
            address: true,
            phoneNumber: true,
          },
        },
      },
    });

    logger.info(`Delivery plan ${id} updated`);

    res.json({
      status: "success",
      data: { plan: updatedPlan },
    });
  } catch (error) {
    next(error);
  }
};

export const updateDeliveryPlanStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const plan = await prisma.deliveryPlan.findUnique({
      where: { id: parseInt(id) },
    });

    if (!plan) {
      throw new AppError("Хүргэлтийн төлөвлөгөө олдсонгүй", 404);
    }

    const updateData: any = { status };

    // If status is Completed, record actual delivery time
    if (status === "Completed" && !plan.actualDeliveryTime) {
      updateData.actualDeliveryTime = new Date();
    }

    const updatedPlan = await prisma.deliveryPlan.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        agent: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        customer: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
      },
    });

    logger.info(`Delivery plan ${id} status updated to: ${status}`);

    res.json({
      status: "success",
      data: { plan: updatedPlan },
    });
  } catch (error) {
    next(error);
  }
};

