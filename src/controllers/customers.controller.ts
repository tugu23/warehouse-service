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
      organizationName,
      organizationType,
      contactPersonName,
      registrationNumber,
      address,
      district,
      detailedAddress,
      phoneNumber,
      isVatPayer,
      paymentTerms,
      locationLatitude,
      locationLongitude,
      customerTypeId,
      assignedAgentId,
    } = req.body;

    const customer = await prisma.customer.create({
      data: {
        name,
        organizationName,
        organizationType,
        contactPersonName,
        registrationNumber,
        address,
        district,
        detailedAddress,
        phoneNumber,
        isVatPayer: isVatPayer || false,
        paymentTerms,
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
    const district = req.query.district as string;
    const registrationNumber = req.query.registrationNumber as string;
    const isVatPayer = req.query.isVatPayer as string;
    const search = req.query.search as string;

    const where: any = {};

    // Sales agents can only see their assigned customers
    if (authReq.user?.role === "SalesAgent") {
      where.assignedAgentId = authReq.user.userId;
    }

    // Filter by district
    if (district) {
      where.district = district;
    }

    // Filter by registration number
    if (registrationNumber) {
      where.registrationNumber = {
        contains: registrationNumber,
        mode: "insensitive",
      };
    }

    // Filter by VAT payer status
    if (isVatPayer !== undefined) {
      where.isVatPayer = isVatPayer === "true";
    }

    // General search
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { organizationName: { contains: search, mode: "insensitive" } },
        { registrationNumber: { contains: search, mode: "insensitive" } },
        { phoneNumber: { contains: search, mode: "insensitive" } },
      ];
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
      organizationName,
      organizationType,
      contactPersonName,
      registrationNumber,
      address,
      district,
      detailedAddress,
      phoneNumber,
      isVatPayer,
      paymentTerms,
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
        organizationName,
        organizationType,
        contactPersonName,
        registrationNumber,
        address,
        district,
        detailedAddress,
        phoneNumber,
        isVatPayer,
        paymentTerms,
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
