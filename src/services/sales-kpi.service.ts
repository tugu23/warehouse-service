import prisma from "../db/prisma";
import { Prisma } from "@prisma/client";

type Granularity = "day" | "week" | "month" | "year";

interface SalesKpiFilters {
  from: string;
  to: string;
  agentId?: number;
  productId?: number;
  granularity: Granularity;
}

interface SalesTransaction {
  orderId: number;
  orderNumber: string | null;
  orderDate: string;
  agentId: number;
  agentName: string;
  customerId: number;
  customerName: string;
  productId: number;
  productName: string;
  categoryName: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  bucket: string;
}

interface SalesKpiResult {
  transactions: SalesTransaction[];
  totals: {
    totalQuantity: number;
    totalAmount: number;
    orderCount: number;
  };
  periodTotals: Array<{
    bucket: string;
    totalQuantity: number;
    totalAmount: number;
    orderCount: number;
  }>;
}

function parseDateOnlyUtc(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  if (!y || !m || !d) {
    throw new Error("Invalid date string");
  }
  return new Date(Date.UTC(y, m - 1, d));
}

function getBucketExpression(granularity: Granularity): string {
  switch (granularity) {
    case "day":
      return "TO_CHAR(o.order_date, 'YYYY-MM-DD')";
    case "week":
      return "TO_CHAR(DATE_TRUNC('week', o.order_date), 'YYYY-MM-DD')";
    case "month":
      return "TO_CHAR(o.order_date, 'YYYY-MM')";
    case "year":
      return "TO_CHAR(o.order_date, 'YYYY')";
  }
}

export async function getSalesTransactions(
  filters: SalesKpiFilters
): Promise<SalesKpiResult> {
  const { from, to, agentId, productId, granularity } = filters;

  const fromDate = parseDateOnlyUtc(from);
  const toDate = parseDateOnlyUtc(to);
  toDate.setUTCHours(23, 59, 59, 999);

  const bucketExpr = getBucketExpression(granularity);

  // Build WHERE conditions
  const conditions: string[] = [
    "o.payment_status = 'Paid'",
    `o.order_date >= '${fromDate.toISOString()}'`,
    `o.order_date <= '${toDate.toISOString()}'`,
  ];

  if (agentId) {
    conditions.push(`o.agent_id = ${agentId}`);
  }

  if (productId) {
    conditions.push(`oi.product_id = ${productId}`);
  }

  const whereClause = conditions.join(" AND ");

  // Query for individual transactions
  const transactionsQuery = `
    SELECT
      o.id as order_id,
      o.order_number,
      o.order_date,
      o.agent_id,
      e.name as agent_name,
      o.customer_id,
      c.name as customer_name,
      oi.product_id,
      p.name_mongolian as product_name,
      cat.name_mongolian as category_name,
      oi.quantity,
      oi.unit_price,
      (oi.quantity * oi.unit_price) as total_price,
      ${bucketExpr} as bucket
    FROM orders o
    INNER JOIN order_items oi ON o.id = oi.order_id
    INNER JOIN employees e ON o.agent_id = e.id
    INNER JOIN customers c ON o.customer_id = c.id
    INNER JOIN products p ON oi.product_id = p.id
    LEFT JOIN categories cat ON p.category_id = cat.id
    WHERE ${whereClause}
    ORDER BY o.order_date DESC, o.id DESC, oi.id
  `;

  const rawTransactions = await prisma.$queryRawUnsafe<any[]>(transactionsQuery);

  const transactions: SalesTransaction[] = rawTransactions.map((row) => ({
    orderId: row.order_id,
    orderNumber: row.order_number,
    orderDate: new Date(row.order_date).toISOString(),
    agentId: row.agent_id,
    agentName: row.agent_name,
    customerId: row.customer_id,
    customerName: row.customer_name,
    productId: row.product_id,
    productName: row.product_name,
    categoryName: row.category_name,
    quantity: Number(row.quantity),
    unitPrice: parseFloat(row.unit_price),
    totalPrice: parseFloat(row.total_price),
    bucket: row.bucket,
  }));

  // Calculate overall totals
  const totalQuantity = transactions.reduce((sum, t) => sum + t.quantity, 0);
  const totalAmount = transactions.reduce((sum, t) => sum + t.totalPrice, 0);
  const uniqueOrders = new Set(transactions.map((t) => t.orderId));

  // Calculate period totals
  const periodMap = new Map<
    string,
    { totalQuantity: number; totalAmount: number; orders: Set<number> }
  >();

  transactions.forEach((t) => {
    if (!periodMap.has(t.bucket)) {
      periodMap.set(t.bucket, {
        totalQuantity: 0,
        totalAmount: 0,
        orders: new Set(),
      });
    }
    const period = periodMap.get(t.bucket)!;
    period.totalQuantity += t.quantity;
    period.totalAmount += t.totalPrice;
    period.orders.add(t.orderId);
  });

  const periodTotals = Array.from(periodMap.entries())
    .map(([bucket, data]) => ({
      bucket,
      totalQuantity: data.totalQuantity,
      totalAmount: data.totalAmount,
      orderCount: data.orders.size,
    }))
    .sort((a, b) => a.bucket.localeCompare(b.bucket));

  return {
    transactions,
    totals: {
      totalQuantity,
      totalAmount,
      orderCount: uniqueOrders.size,
    },
    periodTotals,
  };
}
