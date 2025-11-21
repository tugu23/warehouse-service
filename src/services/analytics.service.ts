import prisma from "../db/prisma";
import { Prisma } from "@prisma/client";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";
import logger from "../utils/logger";

const OUTLIER_THRESHOLD = 0.50; // 50% drop threshold

export interface SalesData {
  month: number;
  year: number;
  quantitySold: number;
}

export interface MonthlyAverages {
  oneMonthAverage: number;
  threeMonthAverage: number;
  sixMonthAverage: number;
}

export interface OutlierDetection {
  isOutlier: boolean;
  reason: string | null;
  comparisonAverage: number;
}

export interface ForecastRecommendation {
  recommendedQuantity: number;
  basedOnAverage: string;
  notes: string;
}

/**
 * Calculate monthly averages for a product
 * @param productId - Product ID
 * @param months - Number of months to analyze (1, 3, or 6)
 * @returns Average sales quantity
 */
export const calculateMonthlyAverages = async (
  productId: number,
  months: number = 3
): Promise<MonthlyAverages> => {
  const now = new Date();
  const startDate = startOfMonth(subMonths(now, months));
  
  // Get order items for this product in the specified period
  const orderItems = await prisma.orderItem.findMany({
    where: {
      productId,
      order: {
        orderDate: {
          gte: startDate,
          lte: now,
        },
        status: {
          in: ["Fulfilled", "Pending"], // Count fulfilled and pending orders
        },
      },
    },
    include: {
      order: {
        select: {
          orderDate: true,
        },
      },
    },
  });

  // Group by month/year and sum quantities
  const monthlySales: Map<string, number> = new Map();
  
  orderItems.forEach((item) => {
    const orderDate = item.order.orderDate;
    const monthKey = `${orderDate.getFullYear()}-${orderDate.getMonth() + 1}`;
    const currentQty = monthlySales.get(monthKey) || 0;
    monthlySales.set(monthKey, currentQty + item.quantity);
  });

  const salesArray = Array.from(monthlySales.values());
  const oneMonthAverage = salesArray.length > 0 ? salesArray[salesArray.length - 1] : 0;
  const threeMonthAverage = salesArray.slice(-3).reduce((a, b) => a + b, 0) / Math.min(3, salesArray.length) || 0;
  const sixMonthAverage = salesArray.slice(-6).reduce((a, b) => a + b, 0) / Math.min(6, salesArray.length) || 0;

  return {
    oneMonthAverage: Math.round(oneMonthAverage),
    threeMonthAverage: Math.round(threeMonthAverage),
    sixMonthAverage: Math.round(sixMonthAverage),
  };
};

/**
 * Detect if current month's sales is an outlier
 * @param salesData - Array of monthly sales data
 * @param threshold - Threshold for outlier detection (default: 50%)
 * @returns Outlier detection result
 */
export const detectOutliers = (
  salesData: SalesData[],
  threshold: number = OUTLIER_THRESHOLD
): OutlierDetection => {
  if (salesData.length < 2) {
    return {
      isOutlier: false,
      reason: null,
      comparisonAverage: 0,
    };
  }

  // Sort by date (most recent last)
  const sorted = [...salesData].sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.month - b.month;
  });

  const currentMonth = sorted[sorted.length - 1];
  const previousMonths = sorted.slice(0, -1);

  // Calculate average of previous months
  const average = previousMonths.reduce((sum, data) => sum + data.quantitySold, 0) / previousMonths.length;

  // Check if current month is significantly lower than average
  const dropPercentage = average > 0 ? (average - currentMonth.quantitySold) / average : 0;

  if (dropPercentage >= threshold) {
    return {
      isOutlier: true,
      reason: `Sales dropped ${Math.round(dropPercentage * 100)}% compared to ${previousMonths.length}-month average (${Math.round(average)} units)`,
      comparisonAverage: Math.round(average),
    };
  }

  return {
    isOutlier: false,
    reason: null,
    comparisonAverage: Math.round(average),
  };
};

/**
 * Generate forecast for next month
 * @param productId - Product ID
 * @returns Forecast recommendation
 */
export const generateForecast = async (
  productId: number
): Promise<ForecastRecommendation> => {
  // Get sales analytics for the past 6 months
  const now = new Date();
  const sixMonthsAgo = subMonths(now, 6);

  const analytics = await prisma.productSalesAnalytics.findMany({
    where: {
      productId,
      OR: [
        {
          year: { gt: sixMonthsAgo.getFullYear() },
        },
        {
          year: sixMonthsAgo.getFullYear(),
          month: { gte: sixMonthsAgo.getMonth() + 1 },
        },
      ],
    },
    orderBy: [{ year: "asc" }, { month: "asc" }],
  });

  // Filter out outliers
  const nonOutliers = analytics.filter((a) => !a.isOutlier);

  if (nonOutliers.length === 0) {
    // If all months are outliers or no data, use the last 3 months average
    const averages = await calculateMonthlyAverages(productId, 3);
    const baseQuantity = Math.round(averages.threeMonthAverage);
    const safetyStock = Math.round(baseQuantity * 0.20); // 20% safety stock
    
    return {
      recommendedQuantity: baseQuantity + safetyStock,
      basedOnAverage: "3-month",
      notes: "No reliable historical data available. Recommendation based on recent 3-month average with 20% safety stock.",
    };
  }

  // Calculate average from non-outlier months
  const avgQuantity = nonOutliers.reduce((sum, a) => sum + a.quantitySold, 0) / nonOutliers.length;
  const baseQuantity = Math.round(avgQuantity);
  const safetyStock = Math.round(baseQuantity * 0.20); // 20% safety stock

  return {
    recommendedQuantity: baseQuantity + safetyStock,
    basedOnAverage: `${nonOutliers.length}-month (excluding outliers)`,
    notes: `Based on ${nonOutliers.length} non-outlier months with 20% safety stock buffer. Average monthly sales: ${baseQuantity} units.`,
  };
};

/**
 * Aggregate sales by period (week, month, year)
 * @param orders - Array of orders
 * @param period - Period type: 'week', 'month', or 'year'
 * @returns Aggregated sales data
 */
export const aggregateSalesByPeriod = (
  orders: any[],
  period: "week" | "month" | "year"
) => {
  const aggregated: Map<string, any> = new Map();

  orders.forEach((order) => {
    let key: string;
    const orderDate = new Date(order.orderDate);

    switch (period) {
      case "week":
        // ISO week number
        const weekNumber = getISOWeek(orderDate);
        key = `${orderDate.getFullYear()}-W${weekNumber.toString().padStart(2, "0")}`;
        break;
      case "month":
        key = `${orderDate.getFullYear()}-${(orderDate.getMonth() + 1).toString().padStart(2, "0")}`;
        break;
      case "year":
        key = orderDate.getFullYear().toString();
        break;
      default:
        key = orderDate.toISOString().split("T")[0];
    }

    if (!aggregated.has(key)) {
      aggregated.set(key, {
        period: key,
        orderCount: 0,
        totalRevenue: 0,
        totalQuantity: 0,
        orders: [],
      });
    }

    const entry = aggregated.get(key)!;
    entry.orderCount += 1;
    entry.totalRevenue += parseFloat(order.totalAmount?.toString() || "0");
    entry.totalQuantity += order.orderItems?.reduce(
      (sum: number, item: any) => sum + item.quantity,
      0
    ) || 0;
    entry.orders.push(order);
  });

  return Array.from(aggregated.values()).sort((a, b) =>
    a.period.localeCompare(b.period)
  );
};

/**
 * Get ISO week number for a date
 * @param date - Date to get week number for
 * @returns ISO week number
 */
const getISOWeek = (date: Date): number => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return weekNo;
};

/**
 * Calculate and save sales analytics for a product and month
 * @param productId - Product ID
 * @param month - Month (1-12)
 * @param year - Year
 */
export const calculateProductSalesAnalytics = async (
  productId: number,
  month: number,
  year: number
): Promise<void> => {
  try {
    // Get total quantity sold in this month
    const startDate = new Date(year, month - 1, 1);
    const endDate = endOfMonth(startDate);

    const orderItems = await prisma.orderItem.findMany({
      where: {
        productId,
        order: {
          orderDate: {
            gte: startDate,
            lte: endDate,
          },
          status: {
            in: ["Fulfilled", "Pending"],
          },
        },
      },
    });

    const quantitySold = orderItems.reduce((sum, item) => sum + item.quantity, 0);

    // Calculate averages
    const averages = await calculateMonthlyAverages(productId, 6);

    // Get historical data for outlier detection
    const historicalData = await prisma.productSalesAnalytics.findMany({
      where: {
        productId,
        OR: [
          { year: { lt: year } },
          { year, month: { lt: month } },
        ],
      },
      orderBy: [{ year: "asc" }, { month: "asc" }],
      take: 12, // Look at last 12 months
    });

    const salesData: SalesData[] = [
      ...historicalData.map((h) => ({
        month: h.month,
        year: h.year,
        quantitySold: h.quantitySold,
      })),
      { month, year, quantitySold },
    ];

    const outlierResult = detectOutliers(salesData);

    // Upsert analytics record
    await prisma.productSalesAnalytics.upsert({
      where: {
        productId_month_year: {
          productId,
          month,
          year,
        },
      },
      create: {
        productId,
        month,
        year,
        quantitySold,
        averageMonthlySales: new Prisma.Decimal(averages.oneMonthAverage),
        threeMonthAverage: new Prisma.Decimal(averages.threeMonthAverage),
        sixMonthAverage: new Prisma.Decimal(averages.sixMonthAverage),
        isOutlier: outlierResult.isOutlier,
        outlierReason: outlierResult.reason,
      },
      update: {
        quantitySold,
        averageMonthlySales: new Prisma.Decimal(averages.oneMonthAverage),
        threeMonthAverage: new Prisma.Decimal(averages.threeMonthAverage),
        sixMonthAverage: new Prisma.Decimal(averages.sixMonthAverage),
        isOutlier: outlierResult.isOutlier,
        outlierReason: outlierResult.reason,
        updatedAt: new Date(),
      },
    });

    logger.info(
      `Sales analytics calculated for product ${productId}, month ${month}/${year}: ${quantitySold} units sold${outlierResult.isOutlier ? " (OUTLIER)" : ""}`
    );
  } catch (error) {
    logger.error(`Error calculating sales analytics: ${error}`);
    throw error;
  }
};

export default {
  calculateMonthlyAverages,
  detectOutliers,
  generateForecast,
  aggregateSalesByPeriod,
  calculateProductSalesAnalytics,
  OUTLIER_THRESHOLD,
};

