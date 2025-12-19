import { Request, Response, NextFunction } from 'express';
import prisma from '../db/prisma';
import { AppError } from '../middleware/error.middleware';
import logger from '../utils/logger';

/**
 * Бүх харилцагчийн төрлүүдийг авах
 */
export const getAllCustomerTypes = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const customerTypes = await prisma.customerType.findMany({
      orderBy: { id: 'asc' }
    });

    res.json({
      status: 'success',
      data: {
        customerTypes
      }
    });
  } catch (error) {
    logger.error('Error fetching customer types:', error);
    next(error);
  }
};

/**
 * Тодорхой харилцагчийн төрлийг ID-аар авах
 */
export const getCustomerTypeById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const customerType = await prisma.customerType.findUnique({
      where: { id: parseInt(id) }
    });

    if (!customerType) {
      throw new AppError('Харилцагчийн төрөл олдсонгүй', 404);
    }

    res.json({
      status: 'success',
      data: { customerType }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Шинэ харилцагчийн төрөл үүсгэх
 */
export const createCustomerType = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { typeName } = req.body;

    if (!typeName) {
      throw new AppError('Төрлийн нэр заавал оруулна уу', 400);
    }

    const customerType = await prisma.customerType.create({
      data: {
        typeName
      }
    });

    logger.info(`New customer type created: ${customerType.typeName}`);

    res.status(201).json({
      status: 'success',
      data: { customerType }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Харилцагчийн төрөл шинэчлэх
 */
export const updateCustomerType = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { typeName } = req.body;

    const existingType = await prisma.customerType.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingType) {
      throw new AppError('Харилцагчийн төрөл олдсонгүй', 404);
    }

    const updatedType = await prisma.customerType.update({
      where: { id: parseInt(id) },
      data: {
        typeName
      }
    });

    logger.info(`Customer type updated: ${updatedType.typeName}`);

    res.json({
      status: 'success',
      data: { customerType: updatedType }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Харилцагчийн төрөл устгах
 */
export const deleteCustomerType = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const existingType = await prisma.customerType.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingType) {
      throw new AppError('Харилцагчийн төрөл олдсонгүй', 404);
    }

    // Check if any customers are using this type
    const customersCount = await prisma.customer.count({
      where: { customerTypeId: parseInt(id) }
    });

    if (customersCount > 0) {
      throw new AppError(
        `Энэ төрөл ${customersCount} харилцагчид ашиглагдаж байгаа тул устгах боломжгүй`,
        400
      );
    }

    await prisma.customerType.delete({
      where: { id: parseInt(id) }
    });

    logger.info(`Customer type deleted: ${existingType.typeName}`);

    res.json({
      status: 'success',
      message: 'Харилцагчийн төрлийг амжилттай устгалаа'
    });
  } catch (error) {
    next(error);
  }
};

