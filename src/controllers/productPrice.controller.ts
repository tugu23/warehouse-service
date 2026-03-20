import { Request, Response, NextFunction } from 'express';
import prisma from '../db/prisma';
import { AppError } from '../middleware/error.middleware';
import logger from '../utils/logger';

/**
 * Get all prices for a specific product
 * GET /api/products/:productId/prices
 */
export const getProductPrices = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { productId } = req.params;

    const prices = await prisma.productPrice.findMany({
      where: {
        productId: parseInt(productId),
      },
      include: {
        customerType: true,
        product: {
          select: {
            id: true,
            nameMongolian: true,
            nameEnglish: true,
          },
        },
      },
      orderBy: {
        customerTypeId: 'asc',
      },
    });

    res.json({
      status: 'success',
      data: {
        prices,
        count: prices.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all prices (admin view)
 * GET /api/prices
 */
export const getAllPrices = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const customerTypeId = req.query.customerTypeId
      ? parseInt(req.query.customerTypeId as string)
      : undefined;
    const productId = req.query.productId
      ? parseInt(req.query.productId as string)
      : undefined;

    const where: any = {};

    if (customerTypeId) {
      where.customerTypeId = customerTypeId;
    }

    if (productId) {
      where.productId = productId;
    }

    const [prices, total] = await Promise.all([
      prisma.productPrice.findMany({
        where,
        skip,
        take: limit,
        include: {
          customerType: true,
          product: {
            select: {
              id: true,
              nameMongolian: true,
              nameEnglish: true,
              productCode: true,
            },
          },
        },
        orderBy: [
          { productId: 'asc' },
          { customerTypeId: 'asc' },
        ],
      }),
      prisma.productPrice.count({ where }),
    ]);

    res.json({
      status: 'success',
      data: {
        prices,
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

/**
 * Create or update a single price
 * POST /api/products/:productId/prices
 */
export const upsertProductPrice = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { productId } = req.params;
    const { customerTypeId, price } = req.body;

    if (!customerTypeId || price === undefined || price === null) {
      throw new AppError('Customer type and price are required', 400);
    }

    // Validate product exists
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) },
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    // Validate customer type exists
    const customerType = await prisma.customerType.findUnique({
      where: { id: customerTypeId },
    });

    if (!customerType) {
      throw new AppError('Customer type not found', 404);
    }

    // Upsert price
    const productPrice = await prisma.productPrice.upsert({
      where: {
        productId_customerTypeId: {
          productId: parseInt(productId),
          customerTypeId: customerTypeId,
        },
      },
      update: {
        price: parseFloat(price.toString()),
      },
      create: {
        productId: parseInt(productId),
        customerTypeId: customerTypeId,
        price: parseFloat(price.toString()),
      },
      include: {
        customerType: true,
      },
    });

    logger.info(
      `Price ${productPrice.id} for product ${productId} updated: ₮${price}`
    );

    res.json({
      status: 'success',
      data: { price: productPrice },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Bulk update prices for a product
 * PUT /api/products/:productId/prices/bulk
 */
export const bulkUpdateProductPrices = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { productId } = req.params;
    const { prices } = req.body; // Array of { customerTypeId, price }

    if (!Array.isArray(prices) || prices.length === 0) {
      throw new AppError('Prices array is required', 400);
    }

    // Validate product exists
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) },
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    // Validate all customer types exist
    const customerTypeIds = prices.map((p) => p.customerTypeId);
    const customerTypes = await prisma.customerType.findMany({
      where: { id: { in: customerTypeIds } },
    });

    if (customerTypes.length !== customerTypeIds.length) {
      throw new AppError('One or more customer types not found', 404);
    }

    // Bulk upsert prices using transaction
    const updatedPrices = await prisma.$transaction(
      prices.map((priceData) =>
        prisma.productPrice.upsert({
          where: {
            productId_customerTypeId: {
              productId: parseInt(productId),
              customerTypeId: priceData.customerTypeId,
            },
          },
          update: {
            price: parseFloat(priceData.price.toString()),
          },
          create: {
            productId: parseInt(productId),
            customerTypeId: priceData.customerTypeId,
            price: parseFloat(priceData.price.toString()),
          },
          include: {
            customerType: true,
          },
        })
      )
    );

    logger.info(
      `Bulk updated ${updatedPrices.length} prices for product ${productId}`
    );

    res.json({
      status: 'success',
      data: {
        prices: updatedPrices,
        count: updatedPrices.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a price
 * DELETE /api/products/:productId/prices/:customerTypeId
 */
export const deleteProductPrice = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { productId, customerTypeId } = req.params;

    const deletedPrice = await prisma.productPrice.delete({
      where: {
        productId_customerTypeId: {
          productId: parseInt(productId),
          customerTypeId: parseInt(customerTypeId),
        },
      },
    });

    logger.info(
      `Price deleted for product ${productId}, customer type ${customerTypeId}`
    );

    res.json({
      status: 'success',
      data: {
        message: 'Price deleted successfully',
        deletedPrice,
      },
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return next(new AppError('Price not found', 404));
    }
    next(error);
  }
};

/**
 * Copy prices from one product to another
 * POST /api/products/:sourceProductId/prices/copy/:targetProductId
 */
export const copyProductPrices = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { sourceProductId, targetProductId } = req.params;
    const { overwrite } = req.body; // If true, overwrite existing prices

    // Validate both products exist
    const [sourceProduct, targetProduct] = await Promise.all([
      prisma.product.findUnique({ where: { id: parseInt(sourceProductId) } }),
      prisma.product.findUnique({ where: { id: parseInt(targetProductId) } }),
    ]);

    if (!sourceProduct) {
      throw new AppError('Source product not found', 404);
    }

    if (!targetProduct) {
      throw new AppError('Target product not found', 404);
    }

    // Get source prices
    const sourcePrices = await prisma.productPrice.findMany({
      where: { productId: parseInt(sourceProductId) },
    });

    if (sourcePrices.length === 0) {
      throw new AppError('No prices found for source product', 404);
    }

    // Copy prices to target product
    const copiedPrices = await prisma.$transaction(
      sourcePrices.map((sourcePrice) =>
        prisma.productPrice.upsert({
          where: {
            productId_customerTypeId: {
              productId: parseInt(targetProductId),
              customerTypeId: sourcePrice.customerTypeId,
            },
          },
          update: overwrite
            ? {
                price: sourcePrice.price,
              }
            : {},
          create: {
            productId: parseInt(targetProductId),
            customerTypeId: sourcePrice.customerTypeId,
            price: sourcePrice.price,
          },
          include: {
            customerType: true,
          },
        })
      )
    );

    logger.info(
      `Copied ${copiedPrices.length} prices from product ${sourceProductId} to ${targetProductId}`
    );

    res.json({
      status: 'success',
      data: {
        prices: copiedPrices,
        count: copiedPrices.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Apply percentage change to all prices of a product
 * POST /api/products/:productId/prices/adjust
 */
export const adjustProductPrices = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { productId } = req.params;
    const { percentage, customerTypeIds } = req.body; // percentage can be positive or negative

    if (percentage === undefined || percentage === null) {
      throw new AppError('Percentage is required', 400);
    }

    // Validate product exists
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) },
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    // Build where clause
    const where: any = {
      productId: parseInt(productId),
    };

    if (customerTypeIds && Array.isArray(customerTypeIds)) {
      where.customerTypeId = { in: customerTypeIds };
    }

    // Get current prices
    const currentPrices = await prisma.productPrice.findMany({
      where,
    });

    if (currentPrices.length === 0) {
      throw new AppError('No prices found to adjust', 404);
    }

    // Calculate new prices
    const multiplier = 1 + percentage / 100;
    const updatedPrices = await prisma.$transaction(
      currentPrices.map((priceRecord) =>
        prisma.productPrice.update({
          where: { id: priceRecord.id },
          data: {
            price: Math.round(parseFloat(priceRecord.price.toString()) * multiplier),
          },
          include: {
            customerType: true,
          },
        })
      )
    );

    logger.info(
      `Adjusted ${updatedPrices.length} prices for product ${productId} by ${percentage}%`
    );

    res.json({
      status: 'success',
      data: {
        prices: updatedPrices,
        count: updatedPrices.length,
        adjustment: `${percentage > 0 ? '+' : ''}${percentage}%`,
      },
    });
  } catch (error) {
    next(error);
  }
};
