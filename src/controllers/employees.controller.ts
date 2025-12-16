import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import prisma from "../db/prisma";
import { AppError } from "../middleware/error.middleware";
import logger from "../utils/logger";

export const createEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, phoneNumber, password, roleName, storeId } = req.body;

    // Check if email already exists
    const existingEmployee = await prisma.employee.findUnique({
      where: { email },
    });

    if (existingEmployee) {
      throw new AppError(req.t.employees.emailExists, 400);
    }

    // Find role
    const role = await prisma.role.findUnique({
      where: { name: roleName },
    });

    if (!role) {
      throw new AppError("Буруу эрх сонгосон байна", 400);
    }

    // Validate store if provided
    if (storeId) {
      const store = await prisma.store.findUnique({
        where: { id: storeId },
      });

      if (!store) {
        throw new AppError("Буруу дэлгүүр сонгосон байна", 400);
      }

      if (!store.isActive) {
        throw new AppError("Идэвхгүй дэлгүүрт ажилтан томилох боломжгүй", 400);
      }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create employee
    const employee = await prisma.employee.create({
      data: {
        name,
        email,
        phoneNumber,
        passwordHash,
        roleId: role.id,
        storeId: storeId || null,
      },
      include: { 
        role: true,
        store: true,
      },
    });

    logger.info(`New employee created: ${employee.email}${employee.storeId ? ` assigned to store ${employee.storeId}` : ''}`);

    res.status(201).json({
      status: "success",
      data: {
        employee: {
          id: employee.id,
          name: employee.name,
          email: employee.email,
          phoneNumber: employee.phoneNumber,
          role: employee.role.name,
          store: employee.store ? {
            id: employee.store.id,
            name: employee.store.name,
            storeType: employee.store.storeType,
          } : null,
          isActive: employee.isActive,
          createdAt: employee.createdAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllEmployees = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        skip,
        take: limit,
        include: { role: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.employee.count(),
    ]);

    res.json({
      status: "success",
      data: {
        employees: employees.map((emp) => ({
          id: emp.id,
          name: emp.name,
          email: emp.email,
          phoneNumber: emp.phoneNumber,
          role: emp.role.name,
          isActive: emp.isActive,
          createdAt: emp.createdAt,
        })),
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

export const getEmployeeById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const employee = await prisma.employee.findUnique({
      where: { id: parseInt(id) },
      include: { role: true },
    });

    if (!employee) {
      throw new AppError(req.t.employees.notFound, 404);
    }

    res.json({
      status: "success",
      data: {
        employee: {
          id: employee.id,
          name: employee.name,
          email: employee.email,
          phoneNumber: employee.phoneNumber,
          role: employee.role.name,
          isActive: employee.isActive,
          createdAt: employee.createdAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, phoneNumber, roleName, isActive } = req.body;

    const employee = await prisma.employee.findUnique({
      where: { id: parseInt(id) },
    });

    if (!employee) {
      throw new AppError(req.t.employees.notFound, 404);
    }

    const updateData: any = {};

    if (name) updateData.name = name;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
    if (isActive !== undefined) updateData.isActive = isActive;

    if (roleName) {
      const role = await prisma.role.findUnique({
        where: { name: roleName },
      });

      if (!role) {
        throw new AppError("Буруу эрх сонгосон байна", 400);
      }

      updateData.roleId = role.id;
    }

    const updatedEmployee = await prisma.employee.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: { role: true },
    });

    logger.info(`Employee updated: ${updatedEmployee.email}`);

    res.json({
      status: "success",
      data: {
        employee: {
          id: updatedEmployee.id,
          name: updatedEmployee.name,
          email: updatedEmployee.email,
          phoneNumber: updatedEmployee.phoneNumber,
          role: updatedEmployee.role.name,
          isActive: updatedEmployee.isActive,
          createdAt: updatedEmployee.createdAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const employee = await prisma.employee.findUnique({
      where: { id: parseInt(id) },
    });

    if (!employee) {
      throw new AppError(req.t.employees.notFound, 404);
    }

    // Soft delete by setting isActive to false
    await prisma.employee.update({
      where: { id: parseInt(id) },
      data: { isActive: false },
    });

    logger.info(`Employee deactivated: ${employee.email}`);

    res.json({
      status: "success",
      message: "Employee account deactivated successfully",
    });
  } catch (error) {
    next(error);
  }
};
