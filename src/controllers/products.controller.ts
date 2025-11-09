import { Request, Response, NextFunction } from "express";
import prisma from "../db/prisma";
import { AppError } from "../middleware/error.middleware";
import logger from "../utils/logger";

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      nameMongolian,
      nameEnglish,
      nameKorean,
      productCode,
      barcode,
      supplierId,
      categoryId,
      stockQuantity,
      unitsPerBox,
      priceWholesale,
      priceRetail,
      pricePerBox,
      netWeight,
      grossWeight,
    } = req.body;

    // Check if product code already exists
    if (productCode) {
      const existingProduct = await prisma.product.findUnique({
        where: { productCode },
      });

      if (existingProduct) {
        throw new AppError("Product with this code already exists", 400);
      }
    }

    // Check if barcode already exists
    if (barcode) {
      const existingBarcode = await prisma.product.findUnique({
        where: { barcode },
      });

      if (existingBarcode) {
        throw new AppError("Product with this barcode already exists", 400);
      }
    }

    const product = await prisma.product.create({
      data: {
        nameMongolian,
        nameEnglish,
        nameKorean,
        productCode,
        barcode,
        supplierId,
        categoryId,
        stockQuantity: stockQuantity || 0,
        unitsPerBox,
        priceWholesale,
        priceRetail,
        pricePerBox,
        netWeight,
        grossWeight,
      },
      include: {
        supplier: true,
        category: true,
      },
    });

    logger.info(`New product created: ${product.nameMongolian}`);

    res.status(201).json({
      status: "success",
      data: { product },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search as string;

    const where: any = {};

    if (search) {
      where.OR = [
        { nameMongolian: { contains: search, mode: "insensitive" } },
        { nameEnglish: { contains: search, mode: "insensitive" } },
        { nameKorean: { contains: search, mode: "insensitive" } },
        { productCode: { contains: search, mode: "insensitive" } },
        { barcode: { contains: search, mode: "insensitive" } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          supplier: true,
          category: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      status: "success",
      data: {
        products,
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

export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: {
        supplier: true,
        category: true,
      },
    });

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    res.json({
      status: "success",
      data: { product },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      nameMongolian,
      nameEnglish,
      nameKorean,
      productCode,
      barcode,
      supplierId,
      categoryId,
      unitsPerBox,
      priceWholesale,
      priceRetail,
      pricePerBox,
      netWeight,
      grossWeight,
    } = req.body;

    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    // Check if new product code already exists
    if (productCode && productCode !== product.productCode) {
      const existingProduct = await prisma.product.findUnique({
        where: { productCode },
      });

      if (existingProduct) {
        throw new AppError("Product with this code already exists", 400);
      }
    }

    // Check if new barcode already exists
    if (barcode && barcode !== product.barcode) {
      const existingBarcode = await prisma.product.findUnique({
        where: { barcode },
      });

      if (existingBarcode) {
        throw new AppError("Product with this barcode already exists", 400);
      }
    }

    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        nameMongolian,
        nameEnglish,
        nameKorean,
        productCode,
        barcode,
        supplierId,
        categoryId,
        unitsPerBox,
        priceWholesale,
        priceRetail,
        pricePerBox,
        netWeight,
        grossWeight,
      },
      include: {
        supplier: true,
        category: true,
      },
    });

    logger.info(`Product updated: ${updatedProduct.nameMongolian}`);

    res.json({
      status: "success",
      data: { product: updatedProduct },
    });
  } catch (error) {
    next(error);
  }
};

export const adjustInventory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { productId, adjustment, reason } = req.body;

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    const newQuantity = product.stockQuantity + adjustment;

    if (newQuantity < 0) {
      throw new AppError("Insufficient stock for this adjustment", 400);
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: { stockQuantity: newQuantity },
    });

    logger.info(
      `Inventory adjusted for ${
        updatedProduct.nameMongolian
      }: ${adjustment} (Reason: ${reason || "N/A"})`
    );

    res.json({
      status: "success",
      data: {
        product: updatedProduct,
        oldQuantity: product.stockQuantity,
        newQuantity,
        adjustment,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getProductByBarcode = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { barcode } = req.params;

    const product = await prisma.product.findUnique({
      where: { barcode },
      include: {
        supplier: true,
        category: true,
        batches: {
          where: {
            isActive: true,
            quantity: {
              gt: 0,
            },
          },
          orderBy: {
            expiryDate: "asc",
          },
        },
      },
    });

    if (!product) {
      throw new AppError("Product with this barcode not found", 404);
    }

    logger.info(`Product scanned by barcode: ${barcode}`);

    res.json({
      status: "success",
      data: { product },
    });
  } catch (error) {
    next(error);
  }
};
