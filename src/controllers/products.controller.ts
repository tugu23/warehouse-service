import { Request, Response, NextFunction } from "express";
import prisma from "../db/prisma";
import { AppError } from "../middleware/error.middleware";
import logger from "../utils/logger";
import { serializeProduct, serializeProducts } from "../utils/serializer";

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
      isActive,
    } = req.body;

    // Check if product code already exists
    if (productCode) {
      const existingProduct = await prisma.product.findUnique({
        where: { productCode },
      });

      if (existingProduct) {
        throw new AppError(req.t.products.codeExists, 400);
      }
    }

    // Note: Barcode duplicates are now allowed (constraint removed)
    // Multiple products can have the same barcode

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
        isActive: isActive !== undefined ? isActive : true,
      },
      include: {
        supplier: true,
        category: true,
      },
    });

    logger.info(`New product created: ${product.nameMongolian}`);

    res.status(201).json({
      status: "success",
      data: { product: serializeProduct(product) },
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
    let limit: number | undefined = parseInt(req.query.limit as string) || 10;
    let skip: number | undefined = (page - 1) * limit;

    if (req.query.limit === "all") {
      limit = undefined;
      skip = undefined;
    }

    const search = req.query.search as string;
    
    // Parse include query parameter: ?include=batches,prices,supplier,category
    const includeParam = req.query.include as string;
    const includeFields = includeParam ? includeParam.split(',') : ['supplier', 'category', 'batches', 'prices'];

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

    // Build dynamic include object based on query parameters
    const include: any = {};
    
    if (includeFields.includes('supplier')) {
      include.supplier = true;
    }
    
    if (includeFields.includes('category')) {
      include.category = true;
    }
    
    if (includeFields.includes('batches')) {
      include.batches = {
        where: {
          isActive: true,
        },
        orderBy: {
          expiryDate: "asc" as const,
        },
        take: 5, // Show only the first 5 batches
      };
    }
    
    if (includeFields.includes('prices')) {
      include.prices = {
        include: {
          customerType: true,
        },
        orderBy: {
          customerTypeId: "asc" as const,
        },
      };
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        include,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      status: "success",
      data: {
        products: serializeProducts(products),
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
        batches: {
          where: {
            isActive: true,
          },
          orderBy: {
            expiryDate: "asc",
          },
        },
        prices: {
          include: {
            customerType: true,
          },
          orderBy: {
            customerTypeId: "asc",
          },
        },
      },
    });

    if (!product) {
      throw new AppError(req.t.products.notFound, 404);
    }

    res.json({
      status: "success",
      data: { product: serializeProduct(product) },
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
      isActive,
    } = req.body;

    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!product) {
      throw new AppError(req.t.products.notFound, 404);
    }

    // Check if new product code already exists
    if (productCode && productCode !== product.productCode) {
      const existingProduct = await prisma.product.findUnique({
        where: { productCode },
      });

      if (existingProduct) {
        throw new AppError(req.t.products.codeExists, 400);
      }
    }

    // Note: Barcode duplicates are now allowed (constraint removed)
    // Multiple products can have the same barcode

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
        isActive,
      },
      include: {
        supplier: true,
        category: true,
      },
    });

    logger.info(`Product updated: ${updatedProduct.nameMongolian}`);

    res.json({
      status: "success",
      data: { product: serializeProduct(updatedProduct) },
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
      throw new AppError(req.t.products.notFound, 404);
    }

    const newQuantity = product.stockQuantity + adjustment;

    if (newQuantity < 0) {
      throw new AppError(req.t.products.insufficientStock, 400);
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
        product: serializeProduct(updatedProduct),
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

    // Use findMany since barcode is no longer unique
    const products = await prisma.product.findMany({
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

    if (!products || products.length === 0) {
      throw new AppError(req.t.products.notFound, 404);
    }

    logger.info(`Product(s) scanned by barcode: ${barcode}, found: ${products.length}`);

    // If only one product found, return it directly
    if (products.length === 1) {
      res.json({
        status: "success",
        data: { product: serializeProduct(products[0]) },
      });
    } else {
      // If multiple products found, return all
      res.json({
        status: "success",
        data: { 
          products: serializeProducts(products),
          count: products.length,
          message: `${products.length} бүтээгдэхүүн олдлоо`
        },
      });
    }
  } catch (error) {
    next(error);
  }
};
