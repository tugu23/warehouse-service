import { Request, Response, NextFunction } from "express";
import prisma from "../db/prisma";
import { AppError } from "../middleware/error.middleware";
import logger from "../utils/logger";

export const createProductBatch = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id: productId } = req.params;
    const {
      batchNumber,
      arrivalDate,
      expiryDate,
      quantity,
      costPrice,
      supplierInvoice,
    } = req.body;

    // Validate product exists
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) },
    });

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    // Check if batch number already exists for this product
    const existingBatch = await prisma.productBatch.findUnique({
      where: {
        productId_batchNumber: {
          productId: parseInt(productId),
          batchNumber,
        },
      },
    });

    if (existingBatch) {
      throw new AppError(
        `Batch number ${batchNumber} already exists for this product`,
        400
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      // Create batch
      const batch = await tx.productBatch.create({
        data: {
          productId: parseInt(productId),
          batchNumber,
          arrivalDate: new Date(arrivalDate),
          expiryDate: expiryDate ? new Date(expiryDate) : null,
          quantity,
          costPrice: costPrice || null,
          supplierInvoice: supplierInvoice || null,
          isActive: true,
        },
        include: {
          product: {
            select: {
              id: true,
              nameMongolian: true,
              productCode: true,
            },
          },
        },
      });

      // Update product total stock
      await tx.product.update({
        where: { id: parseInt(productId) },
        data: {
          stockQuantity: {
            increment: quantity,
          },
        },
      });

      // Update or create inventory balance for current month
      const now = new Date();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();

      const existingBalance = await tx.inventoryBalance.findUnique({
        where: {
          productId_month_year: {
            productId: parseInt(productId),
            month,
            year,
          },
        },
      });

      if (existingBalance) {
        await tx.inventoryBalance.update({
          where: {
            productId_month_year: {
              productId: parseInt(productId),
              month,
              year,
            },
          },
          data: {
            totalIn: {
              increment: quantity,
            },
            closingBalance: {
              increment: quantity,
            },
          },
        });
      } else {
        await tx.inventoryBalance.create({
          data: {
            productId: parseInt(productId),
            month,
            year,
            openingBalance: product.stockQuantity,
            closingBalance: product.stockQuantity + quantity,
            totalIn: quantity,
            totalOut: 0,
          },
        });
      }

      return batch;
    });

    logger.info(
      `New batch created: Product ${productId}, Batch ${batchNumber}, Quantity ${quantity}`
    );

    res.status(201).json({
      status: "success",
      data: { batch: result },
    });
  } catch (error) {
    next(error);
  }
};

export const getProductBatches = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id: productId } = req.params;
    const includeInactive = req.query.includeInactive === "true";

    const where: any = {
      productId: parseInt(productId),
    };

    if (!includeInactive) {
      where.isActive = true;
    }

    const batches = await prisma.productBatch.findMany({
      where,
      include: {
        product: {
          select: {
            id: true,
            nameMongolian: true,
            productCode: true,
          },
        },
      },
      orderBy: {
        arrivalDate: "asc", // FIFO - oldest first
      },
    });

    res.json({
      status: "success",
      data: { batches },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProductBatch = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id: productId, batchId } = req.params;
    const { expiryDate, supplierInvoice, isActive } = req.body;

    const batch = await prisma.productBatch.findUnique({
      where: { id: parseInt(batchId) },
    });

    if (!batch) {
      throw new AppError("Batch not found", 404);
    }

    if (batch.productId !== parseInt(productId)) {
      throw new AppError("Batch does not belong to this product", 400);
    }

    const updateData: any = {};

    if (expiryDate !== undefined) {
      updateData.expiryDate = expiryDate ? new Date(expiryDate) : null;
    }

    if (supplierInvoice !== undefined) {
      updateData.supplierInvoice = supplierInvoice;
    }

    if (isActive !== undefined) {
      updateData.isActive = isActive;
    }

    const updatedBatch = await prisma.productBatch.update({
      where: { id: parseInt(batchId) },
      data: updateData,
      include: {
        product: {
          select: {
            id: true,
            nameMongolian: true,
            productCode: true,
          },
        },
      },
    });

    logger.info(`Batch ${batchId} updated for product ${productId}`);

    res.json({
      status: "success",
      data: { batch: updatedBatch },
    });
  } catch (error) {
    next(error);
  }
};

export const deactivateProductBatch = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id: productId, batchId } = req.params;

    const batch = await prisma.productBatch.findUnique({
      where: { id: parseInt(batchId) },
    });

    if (!batch) {
      throw new AppError("Batch not found", 404);
    }

    if (batch.productId !== parseInt(productId)) {
      throw new AppError("Batch does not belong to this product", 400);
    }

    const updatedBatch = await prisma.productBatch.update({
      where: { id: parseInt(batchId) },
      data: { isActive: false },
    });

    logger.info(`Batch ${batchId} deactivated for product ${productId}`);

    res.json({
      status: "success",
      message: "Batch deactivated successfully",
      data: { batch: updatedBatch },
    });
  } catch (error) {
    next(error);
  }
};

export const getProductInventoryBalance = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id: productId } = req.params;
    const { month, year } = req.query;

    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) },
    });

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    let where: any = {
      productId: parseInt(productId),
    };

    if (month && year) {
      where.month = parseInt(month as string);
      where.year = parseInt(year as string);
    }

    const balances = await prisma.inventoryBalance.findMany({
      where,
      include: {
        product: {
          select: {
            id: true,
            nameMongolian: true,
            productCode: true,
          },
        },
      },
      orderBy: [{ year: "desc" }, { month: "desc" }],
    });

    res.json({
      status: "success",
      data: {
        product: {
          id: product.id,
          name: product.nameMongolian,
          code: product.productCode,
          currentStock: product.stockQuantity,
        },
        balances,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getActiveBatchesForFIFO = async (
  productId: number,
  requiredQuantity: number
): Promise<
  Array<{
    batchId: number;
    availableQuantity: number;
    quantityToUse: number;
  }>
> => {
  const batches = await prisma.productBatch.findMany({
    where: {
      productId,
      isActive: true,
      quantity: {
        gt: 0,
      },
      OR: [
        { expiryDate: null },
        { expiryDate: { gt: new Date() } }, // Not expired
      ],
    },
    orderBy: {
      arrivalDate: "asc", // FIFO - oldest first
    },
  });

  const batchAllocations: Array<{
    batchId: number;
    availableQuantity: number;
    quantityToUse: number;
  }> = [];

  let remainingQuantity = requiredQuantity;

  for (const batch of batches) {
    if (remainingQuantity <= 0) break;

    const quantityToUse = Math.min(batch.quantity, remainingQuantity);
    batchAllocations.push({
      batchId: batch.id,
      availableQuantity: batch.quantity,
      quantityToUse,
    });

    remainingQuantity -= quantityToUse;
  }

  if (remainingQuantity > 0) {
    throw new AppError(
      `Insufficient batch inventory. Need ${remainingQuantity} more units.`,
      400
    );
  }

  return batchAllocations;
};

