import { Request, Response, NextFunction } from "express";
import prisma from "../db/prisma";
import { AppError } from "../middleware/error.middleware";
import { AuthRequest } from "../middleware/auth.middleware";
import logger from "../utils/logger";

export const createCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      name,
      address,
      phoneNumber,
      locationLatitude,
      locationLongitude,
      customerTypeId,
      assignedAgentId,
    } = req.body;

    const customer = await prisma.customer.create({
      data: {
        name,
        address,
        phoneNumber,
        locationLatitude,
        locationLongitude,
        customerTypeId,
        assignedAgentId,
      },
      include: {
        customerType: true,
        assignedAgent: {
          include: { role: true },
        },
      },
    });

    logger.info(`New customer created: ${customer.name}`);

    res.status(201).json({
      status: "success",
      data: { customer },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCustomers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    // Sales agents can only see their assigned customers
    if (authReq.user?.role === "SalesAgent") {
      where.assignedAgentId = authReq.user.userId;
    }

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take: limit,
        include: {
          customerType: true,
          assignedAgent: {
            include: { role: true },
          },
        },
        orderBy: { name: "asc" },
      }),
      prisma.customer.count({ where }),
    ]);

    res.json({
      status: "success",
      data: {
        customers,
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

export const getCustomerById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const { id } = req.params;

    const customer = await prisma.customer.findUnique({
      where: { id: parseInt(id) },
      include: {
        customerType: true,
        assignedAgent: {
          include: { role: true },
        },
      },
    });

    if (!customer) {
      throw new AppError("Customer not found", 404);
    }

    // Sales agents can only see their assigned customers
    if (
      authReq.user?.role === "SalesAgent" &&
      customer.assignedAgentId !== authReq.user.userId
    ) {
      throw new AppError("You do not have access to this customer", 403);
    }

    res.json({
      status: "success",
      data: { customer },
    });
  } catch (error) {
    next(error);
  }
};

export const updateCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      name,
      address,
      phoneNumber,
      locationLatitude,
      locationLongitude,
      customerTypeId,
      assignedAgentId,
    } = req.body;

    const customer = await prisma.customer.findUnique({
      where: { id: parseInt(id) },
    });

    if (!customer) {
      throw new AppError("Customer not found", 404);
    }

    const updatedCustomer = await prisma.customer.update({
      where: { id: parseInt(id) },
      data: {
        name,
        address,
        phoneNumber,
        locationLatitude,
        locationLongitude,
        customerTypeId,
        assignedAgentId,
      },
      include: {
        customerType: true,
        assignedAgent: {
          include: { role: true },
        },
      },
    });

    logger.info(`Customer updated: ${updatedCustomer.name}`);

    res.json({
      status: "success",
      data: { customer: updatedCustomer },
    });
  } catch (error) {
    next(error);
  }
};
