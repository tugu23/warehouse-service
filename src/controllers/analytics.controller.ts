import { Request, Response, NextFunction } from "express";
import prisma from "../db/prisma";
import { AppError } from "../middleware/error.middleware";
import { AuthRequest } from "../middleware/auth.middleware";
import logger from "../utils/logger";
import analyticsService from "../services/analytics.service";
import { Prisma } from "@prisma/client";

export const calculateProductSalesAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { productId, month, year } = req.body;

    if (!productId) {
      throw new AppError("Product ID is required", 400);
    }

    const now = new Date();
    const targetMonth = month || now.getMonth() + 1;
    const targetYear = year || now.getFullYear();

    await analyticsService.calculateProductSalesAnalytics(
      productId,
      targetMonth,
      targetYear
    );

    const analytics = await prisma.productSalesAnalytics.findUnique({
      where: {
        productId_month_year: {
          productId,
          month: targetMonth,
          year: targetYear,
        },
      },
      include: {
        product: {
          select: {
            id: true,
            nameMongolian: true,
            nameEnglish: true,
            productCode: true,
          },
        },
      },
    });

    res.json({
      status: "success",
      data: { analytics },
      message: "Sales analytics calculated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const calculateAllProductsAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { month, year } = req.body;

    const now = new Date();
    const targetMonth = month || now.getMonth() + 1;
    const targetYear = year || now.getFullYear();

    // Get all products
    const products = await prisma.product.findMany({
      select: { id: true, nameMongolian: true },
    });

    let successCount = 0;
    let errorCount = 0;

    for (const product of products) {
      try {
        await analyticsService.calculateProductSalesAnalytics(
          product.id,
          targetMonth,
          targetYear
        );
        successCount++;
      } catch (error) {
        logger.error(
          `Error calculating analytics for product ${product.id}: ${error}`
        );
        errorCount++;
      }
    }

    logger.info(
      `Bulk analytics calculation completed: ${successCount} success, ${errorCount} errors`
    );

    res.json({
      status: "success",
      data: {
        month: targetMonth,
        year: targetYear,
        totalProducts: products.length,
        successCount,
        errorCount,
      },
      message: `Analytics calculated for ${successCount} products`,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllProductsSalesAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const months = parseInt(req.query.months as string) || 6;

    // Calculate the date range for filtering
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // 1-12
    
    // Calculate the cutoff date (months ago)
    const cutoffDate = new Date(currentDate);
    cutoffDate.setMonth(cutoffDate.getMonth() - months);
    const cutoffYear = cutoffDate.getFullYear();
    const cutoffMonth = cutoffDate.getMonth() + 1; // 1-12

    // Fetch all analytics data within the date range
    const analytics = await prisma.productSalesAnalytics.findMany({
      where: {
        OR: [
          { year: { gt: cutoffYear } },
          {
            AND: [
              { year: cutoffYear },
              { month: { gte: cutoffMonth } }
            ]
          }
        ]
      },
      include: {
        product: {
          select: {
            id: true,
            nameMongolian: true,
            nameEnglish: true,
            productCode: true,
            stockQuantity: true,
          },
        },
      },
      orderBy: [{ year: "desc" }, { month: "desc" }],
    });

    // Group analytics by product
    const productMap = new Map();
    
    for (const record of analytics) {
      const productId = record.productId;
      if (!productMap.has(productId)) {
        productMap.set(productId, {
          product: record.product,
          analytics: [],
        });
      }
      productMap.get(productId).analytics.push({
        id: record.id,
        productId: record.productId,
        month: record.month,
        year: record.year,
        quantitySold: record.quantitySold,
        averageMonthlySales: record.averageMonthlySales,
        threeMonthAverage: record.threeMonthAverage,
        sixMonthAverage: record.sixMonthAverage,
        isOutlier: record.isOutlier,
        outlierReason: record.outlierReason,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
      });
    }

    // Convert map to array and reverse analytics for each product (oldest first)
    const results = Array.from(productMap.values()).map(item => ({
      product: item.product,
      analytics: item.analytics.reverse(),
      count: item.analytics.length,
    }));

    res.json({
      status: "success",
      data: {
        products: results,
        totalProducts: results.length,
        months: months,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getProductSalesAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const months = parseInt(req.query.months as string) || 6;

    const analytics = await prisma.productSalesAnalytics.findMany({
      where: {
        productId: parseInt(id),
      },
      include: {
        product: {
          select: {
            id: true,
            nameMongolian: true,
            nameEnglish: true,
            productCode: true,
          },
        },
      },
      orderBy: [{ year: "desc" }, { month: "desc" }],
      take: months,
    });

    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        nameMongolian: true,
        nameEnglish: true,
        productCode: true,
        stockQuantity: true,
      },
    });

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    res.json({
      status: "success",
      data: {
        product,
        analytics: analytics.reverse(), // Show oldest first
        count: analytics.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const generateInventoryForecast = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { productId, month, year } = req.body;

    if (!productId) {
      throw new AppError("Product ID is required", 400);
    }

    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const targetMonth = month || nextMonth.getMonth() + 1;
    const targetYear = year || nextMonth.getFullYear();

    const forecast = await analyticsService.generateForecast(productId);

    // Save forecast to database
    const savedForecast = await prisma.inventoryForecast.upsert({
      where: {
        productId_month_year: {
          productId,
          month: targetMonth,
          year: targetYear,
        },
      },
      create: {
        productId,
        month: targetMonth,
        year: targetYear,
        recommendedOrderQuantity: forecast.recommendedQuantity,
        basedOnAverage: forecast.basedOnAverage,
        notes: forecast.notes,
      },
      update: {
        recommendedOrderQuantity: forecast.recommendedQuantity,
        basedOnAverage: forecast.basedOnAverage,
        notes: forecast.notes,
        forecastDate: new Date(),
        updatedAt: new Date(),
      },
      include: {
        product: {
          select: {
            id: true,
            nameMongolian: true,
            nameEnglish: true,
            productCode: true,
            stockQuantity: true,
          },
        },
      },
    });

    logger.info(
      `Forecast generated for product ${productId}: ${forecast.recommendedQuantity} units`
    );

    res.json({
      status: "success",
      data: { forecast: savedForecast },
      message: "Inventory forecast generated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const generateAllProductsForecasts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { month, year } = req.body;

    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const targetMonth = month || nextMonth.getMonth() + 1;
    const targetYear = year || nextMonth.getFullYear();

    // Get all products
    const products = await prisma.product.findMany({
      select: { id: true, nameMongolian: true },
    });

    let successCount = 0;
    let errorCount = 0;

    for (const product of products) {
      try {
        const forecast = await analyticsService.generateForecast(product.id);

        await prisma.inventoryForecast.upsert({
          where: {
            productId_month_year: {
              productId: product.id,
              month: targetMonth,
              year: targetYear,
            },
          },
          create: {
            productId: product.id,
            month: targetMonth,
            year: targetYear,
            recommendedOrderQuantity: forecast.recommendedQuantity,
            basedOnAverage: forecast.basedOnAverage,
            notes: forecast.notes,
          },
          update: {
            recommendedOrderQuantity: forecast.recommendedQuantity,
            basedOnAverage: forecast.basedOnAverage,
            notes: forecast.notes,
            forecastDate: new Date(),
            updatedAt: new Date(),
          },
        });

        successCount++;
      } catch (error) {
        logger.error(
          `Error generating forecast for product ${product.id}: ${error}`
        );
        errorCount++;
      }
    }

    logger.info(
      `Bulk forecast generation completed: ${successCount} success, ${errorCount} errors`
    );

    res.json({
      status: "success",
      data: {
        month: targetMonth,
        year: targetYear,
        totalProducts: products.length,
        successCount,
        errorCount,
      },
      message: `Forecasts generated for ${successCount} products`,
    });
  } catch (error) {
    next(error);
  }
};

export const getInventoryForecasts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    const month = req.query.month as string;
    const year = req.query.year as string;
    const productId = req.query.productId as string;

    const where: any = {};

    if (productId) {
      where.productId = parseInt(productId);
    }

    if (month) {
      where.month = parseInt(month);
    }

    if (year) {
      where.year = parseInt(year);
    }

    const [forecasts, total] = await Promise.all([
      prisma.inventoryForecast.findMany({
        where,
        skip,
        take: limit,
        include: {
          product: {
            select: {
              id: true,
              nameMongolian: true,
              nameEnglish: true,
              productCode: true,
              stockQuantity: true,
            },
          },
        },
        orderBy: [{ year: "desc" }, { month: "desc" }],
      }),
      prisma.inventoryForecast.count({ where }),
    ]);

    res.json({
      status: "success",
      data: {
        forecasts,
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

export const getSalesByPeriod = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { startDate, endDate, period } = req.query;

    if (!startDate || !endDate) {
      throw new AppError("Start date and end date are required", 400);
    }

    if (!period || !["week", "month", "year"].includes(period as string)) {
      throw new AppError("Period must be week, month, or year", 400);
    }

    const authReq = req as AuthRequest;
    const where: any = {
      orderDate: {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      },
    };

    // Sales agents can only see their own orders
    if (authReq.user?.role === "SalesAgent") {
      where.agentId = authReq.user.userId;
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
          },
        },
        agent: {
          select: {
            id: true,
            name: true,
          },
        },
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                nameMongolian: true,
                productCode: true,
                categoryId: true,
              },
            },
          },
        },
      },
      orderBy: { orderDate: "asc" },
    });

    const aggregated = analyticsService.aggregateSalesByPeriod(
      orders,
      period as "week" | "month" | "year"
    );

    res.json({
      status: "success",
      data: {
        period,
        dateRange: {
          startDate: startDate as string,
          endDate: endDate as string,
        },
        aggregated,
        summary: {
          totalPeriods: aggregated.length,
          totalOrders: orders.length,
          totalRevenue: orders.reduce(
            (sum, order) =>
              sum + parseFloat(order.totalAmount?.toString() || "0"),
            0
          ),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

