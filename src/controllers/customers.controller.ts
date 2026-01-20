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
      realName,
      name2,
      legacyCustomerId,
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
      direction,
    } = req.body;

    const customer = await prisma.customer.create({
      data: {
        name,
        realName,
        name2,
        legacyCustomerId,
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
        direction,
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

    // Always show all customers regardless of limit parameter
    // This ensures all 3500+ customers are visible on the customer page
    let limit: number | undefined = undefined;
    let skip: number | undefined = undefined;

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
        { realName: { contains: search, mode: "insensitive" } },
        { name2: { contains: search, mode: "insensitive" } },
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
          limit: limit || total,
          total,
          totalPages: limit ? Math.ceil(total / limit) : 1,
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
      throw new AppError(req.t.customers.notFound, 404);
    }

    // Sales agents can only see their assigned customers
    if (
      authReq.user?.role === "SalesAgent" &&
      customer.assignedAgentId !== authReq.user.userId
    ) {
      throw new AppError(req.t.auth.forbidden, 403);
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
      realName,
      name2,
      legacyCustomerId,
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
      direction,
    } = req.body;

    const customer = await prisma.customer.findUnique({
      where: { id: parseInt(id) },
    });

    if (!customer) {
      throw new AppError(req.t.customers.notFound, 404);
    }

    const updatedCustomer = await prisma.customer.update({
      where: { id: parseInt(id) },
      data: {
        name,
        realName,
        name2,
        legacyCustomerId,
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
        direction,
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

/**
 * Remove duplicate customers (Admin only)
 * Keeps the customer with lowest ID for each duplicate name
 */
export const removeDuplicateCustomers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Find all duplicate customer names
    const duplicates = await prisma.$queryRaw<Array<{ name: string; count: bigint }>>`
      SELECT name, COUNT(*) as count
      FROM customers
      GROUP BY name
      HAVING COUNT(*) > 1
    `;

    if (duplicates.length === 0) {
      res.json({
        status: "success",
        message: "No duplicate customers found",
        data: { removed: 0, duplicates: [] },
      });
      return;
    }

    let totalRemoved = 0;
    const duplicateNames: string[] = [];

    // For each duplicate name, keep only the first (lowest ID)
    for (const dup of duplicates) {
      duplicateNames.push(dup.name);
      
      // Get all customers with this name
      const customers = await prisma.customer.findMany({
        where: { name: dup.name },
        orderBy: { id: 'asc' },
      });

      // Delete all except the first one
      if (customers.length > 1) {
        const idsToDelete = customers.slice(1).map(c => c.id);
        const deleted = await prisma.customer.deleteMany({
          where: { id: { in: idsToDelete } },
        });
        totalRemoved += deleted.count;
        logger.info(`Removed ${deleted.count} duplicate(s) for customer: ${dup.name}`);
      }
    }

    logger.info(`Total duplicate customers removed: ${totalRemoved}`);

    res.json({
      status: "success",
      message: `Removed ${totalRemoved} duplicate customers`,
      data: {
        removed: totalRemoved,
        duplicates: duplicateNames,
      },
    });
  } catch (error) {
    next(error);
  }
};
