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
    const limitParam = req.query.limit as string;
    const fetchAll = limitParam === 'all' || limitParam === '-1' || limitParam === '0';
    const limit = fetchAll ? undefined : (parseInt(limitParam) || 10);
    const skip = fetchAll ? undefined : (page - 1) * (limit || 10);

    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        ...(skip !== undefined && { skip }),
        ...(limit !== undefined && { take: limit }),
        include: { role: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.employee.count(),
    ]);

    const actualLimit = limit || total;
    res.json({
      status: "success",
      data: {
        employees: employees.map((emp) => ({
          id: emp.id,
          name: emp.name,
          email: emp.email,
          phoneNumber: emp.phoneNumber,
          role: {
            id: emp.role.id,
            name: emp.role.name,
          },
          isActive: emp.isActive,
          createdAt: emp.createdAt,
        })),
        pagination: {
          page: fetchAll ? 1 : page,
          limit: fetchAll ? total : actualLimit,
          total,
          totalPages: fetchAll ? 1 : Math.ceil(total / actualLimit),
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

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authReq = req as any;
    const userId = authReq.user.userId;

    const employee = await prisma.employee.findUnique({
      where: { id: userId },
      include: { role: true, store: true },
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

export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authReq = req as any;
    const userId = authReq.user.userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw new AppError("Одоогийн нууц үг болон шинэ нууц үгийг оруулна уу", 400);
    }

    if (newPassword.length < 6) {
      throw new AppError("Шинэ нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой", 400);
    }

    const employee = await prisma.employee.findUnique({
      where: { id: userId },
    });

    if (!employee) {
      throw new AppError(req.t.employees.notFound, 404);
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, employee.passwordHash);
    if (!isPasswordValid) {
      throw new AppError("Одоогийн нууц үг буруу байна", 400);
    }

    // Hash and update new password
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.employee.update({
      where: { id: userId },
      data: { passwordHash },
    });

    logger.info(`Password changed for employee: ${employee.email}`);

    res.json({
      status: "success",
      message: "Нууц үг амжилттай өөрчлөгдлөө",
    });
  } catch (error) {
    next(error);
  }
};

export const changeEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authReq = req as any;
    const userId = authReq.user.userId;
    const { newEmail, password } = req.body;

    if (!newEmail || !password) {
      throw new AppError("Шинэ имэйл болон нууц үгийг оруулна уу", 400);
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      throw new AppError("Зөв имэйл хаяг оруулна уу", 400);
    }

    const employee = await prisma.employee.findUnique({
      where: { id: userId },
    });

    if (!employee) {
      throw new AppError(req.t.employees.notFound, 404);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, employee.passwordHash);
    if (!isPasswordValid) {
      throw new AppError("Нууц үг буруу байна", 400);
    }

    // Check if new email is already taken by another user
    if (newEmail !== employee.email) {
      const existingEmail = await prisma.employee.findUnique({
        where: { email: newEmail },
      });

      if (existingEmail) {
        throw new AppError("Энэ имэйл хаяг аль хэдийн бүртгэлтэй байна", 400);
      }
    }

    await prisma.employee.update({
      where: { id: userId },
      data: { email: newEmail },
    });

    logger.info(`Email changed for employee: ${employee.email} -> ${newEmail}`);

    res.json({
      status: "success",
      message: "Имэйл хаяг амжилттай өөрчлөгдлөө",
    });
  } catch (error) {
    next(error);
  }
};
