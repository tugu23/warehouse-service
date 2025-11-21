import { Request, Response, NextFunction } from "express";
import prisma from "../db/prisma";
import { AppError } from "../middleware/error.middleware";
import { AuthRequest } from "../middleware/auth.middleware";
import logger from "../utils/logger";

export const createStore = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      name,
      address,
      storeType,
      locationLatitude,
      locationLongitude,
    } = req.body;

    const store = await prisma.store.create({
      data: {
        name,
        address,
        storeType,
        locationLatitude,
        locationLongitude,
        isActive: true,
      },
    });

    logger.info(`Store created: ${store.name} (${store.storeType})`);

    res.status(201).json({
      status: "success",
      data: { store },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllStores = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const storeType = req.query.storeType as string;
    const isActive = req.query.isActive as string;

    const where: any = {};

    if (storeType) {
      where.storeType = storeType;
    }

    if (isActive !== undefined) {
      where.isActive = isActive === "true";
    }

    const [stores, total] = await Promise.all([
      prisma.store.findMany({
        where,
        skip,
        take: limit,
        include: {
          employees: {
            select: {
              id: true,
              name: true,
              email: true,
              role: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: { name: "asc" },
      }),
      prisma.store.count({ where }),
    ]);

    res.json({
      status: "success",
      data: {
        stores,
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

export const getStoreById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const store = await prisma.store.findUnique({
      where: { id: parseInt(id) },
      include: {
        employees: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
            role: {
              select: {
                name: true,
              },
            },
            isActive: true,
          },
        },
      },
    });

    if (!store) {
      throw new AppError("Store not found", 404);
    }

    res.json({
      status: "success",
      data: { store },
    });
  } catch (error) {
    next(error);
  }
};

export const updateStore = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      name,
      address,
      storeType,
      locationLatitude,
      locationLongitude,
      isActive,
    } = req.body;

    const store = await prisma.store.findUnique({
      where: { id: parseInt(id) },
    });

    if (!store) {
      throw new AppError("Store not found", 404);
    }

    const updatedStore = await prisma.store.update({
      where: { id: parseInt(id) },
      data: {
        ...(name && { name }),
        ...(address !== undefined && { address }),
        ...(storeType && { storeType }),
        ...(locationLatitude !== undefined && { locationLatitude }),
        ...(locationLongitude !== undefined && { locationLongitude }),
        ...(isActive !== undefined && { isActive }),
      },
      include: {
        employees: {
          select: {
            id: true,
            name: true,
            email: true,
            role: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    logger.info(`Store updated: ${updatedStore.name} (ID: ${id})`);

    res.json({
      status: "success",
      data: { store: updatedStore },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteStore = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const store = await prisma.store.findUnique({
      where: { id: parseInt(id) },
      include: {
        employees: true,
      },
    });

    if (!store) {
      throw new AppError("Store not found", 404);
    }

    // Check if store has active employees
    const activeEmployees = store.employees.filter((e) => e.isActive);
    if (activeEmployees.length > 0) {
      throw new AppError(
        `Cannot deactivate store with ${activeEmployees.length} active employee(s). Please reassign or deactivate employees first.`,
        400
      );
    }

    // Soft delete by marking as inactive
    const updatedStore = await prisma.store.update({
      where: { id: parseInt(id) },
      data: { isActive: false },
    });

    logger.info(`Store deactivated: ${updatedStore.name} (ID: ${id})`);

    res.json({
      status: "success",
      message: "Store deactivated successfully",
      data: { store: updatedStore },
    });
  } catch (error) {
    next(error);
  }
};

export const getStoreEmployees = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const store = await prisma.store.findUnique({
      where: { id: parseInt(id) },
    });

    if (!store) {
      throw new AppError("Store not found", 404);
    }

    const employees = await prisma.employee.findMany({
      where: { storeId: parseInt(id) },
      include: {
        role: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    res.json({
      status: "success",
      data: {
        store: {
          id: store.id,
          name: store.name,
          storeType: store.storeType,
        },
        employees,
        count: employees.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

