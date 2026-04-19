import prisma from "../db/prisma";
import { config } from "../config";
import {
  AgentSalesTarget,
  AgentSalesTargetPeriodType,
  Prisma,
} from "@prisma/client";

export type KpiGranularity = "day" | "month" | "year";

const PAYMENT_STATUS_PAID = "Paid";

function assertSafeTimezone(tz: string): string {
  if (!/^[A-Za-z0-9_+\/-]+$/.test(tz)) {
    throw new Error("Invalid APP_TIMEZONE");
  }
  return tz;
}

export function getKpiTimezone(): string {
  return assertSafeTimezone(config.appTimezone);
}

/** UTC calendar date from YYYY-MM-DD (no local offset). */
export function parseDateOnlyUtc(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  if (!y || !m || !d) {
    throw new Error("Invalid date string");
  }
  return new Date(Date.UTC(y, m - 1, d));
}

export function normalizePeriodStart(
  input: Date | string,
  periodType: AgentSalesTargetPeriodType
): Date {
  const d = typeof input === "string" ? parseDateOnlyUtc(input) : input;
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth();
  const day = d.getUTCDate();
  if (periodType === AgentSalesTargetPeriodType.DAY) {
    return new Date(Date.UTC(y, m, day));
  }
  if (periodType === AgentSalesTargetPeriodType.MONTH) {
    return new Date(Date.UTC(y, m, 1));
  }
  return new Date(Date.UTC(y, 0, 1));
}

function formatBucketKey(d: Date, g: KpiGranularity): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  if (g === "day") return `${y}-${m}-${day}`;
  if (g === "month") return `${y}-${m}`;
  return `${y}`;
}

function enumerateBucketDates(
  fromStr: string,
  toStr: string,
  g: KpiGranularity
): Date[] {
  const from = parseDateOnlyUtc(fromStr);
  const to = parseDateOnlyUtc(toStr);
  if (from > to) return [];

  if (g === "day") {
    const out: Date[] = [];
    let cur = from.getTime();
    const end = to.getTime();
    for (; cur <= end; cur += 86400000) {
      out.push(new Date(cur));
    }
    return out;
  }

  if (g === "month") {
    const out: Date[] = [];
    let y = from.getUTCFullYear();
    let m = from.getUTCMonth();
    const endY = to.getUTCFullYear();
    const endM = to.getUTCMonth();
    while (y < endY || (y === endY && m <= endM)) {
      out.push(new Date(Date.UTC(y, m, 1)));
      m += 1;
      if (m > 11) {
        m = 0;
        y += 1;
      }
    }
    return out;
  }

  const out: Date[] = [];
  let y = from.getUTCFullYear();
  const endY = to.getUTCFullYear();
  while (y <= endY) {
    out.push(new Date(Date.UTC(y, 0, 1)));
    y += 1;
  }
  return out;
}

type RawBucketRow = {
  bucket: Date;
  amount: string;
  boxes: bigint;
  units: bigint;
};

type RawProductRow = {
  product_id: number;
  product_name: string;
  category_name: string | null;
  units: bigint;
  amount: string;
  boxes: bigint;
};

type RawAgentDayRow = {
  agent_id: number;
  amount: string;
  boxes: bigint;
  units: bigint;
};

function bucketSqlExpr(granularity: KpiGranularity): string {
  if (granularity === "day") {
    return `(o.order_date AT TIME ZONE $1)::date`;
  }
  if (granularity === "month") {
    return `date_trunc('month', (o.order_date AT TIME ZONE $1)::timestamp)::date`;
  }
  return `date_trunc('year', (o.order_date AT TIME ZONE $1)::timestamp)::date`;
}

export async function aggregateSalesBuckets(
  fromStr: string,
  toStr: string,
  agentId: number | null,
  granularity: KpiGranularity
): Promise<RawBucketRow[]> {
  const tz = getKpiTimezone();
  const bucket = bucketSqlExpr(granularity);
  const sql = `
    SELECT ${bucket} AS bucket,
      COALESCE(SUM(oi.quantity::numeric * oi.unit_price::numeric), 0)::text AS amount,
      COALESCE(SUM(
        CASE
          WHEN p.units_per_box IS NOT NULL AND p.units_per_box > 0
          THEN FLOOR(oi.quantity::numeric / p.units_per_box::numeric)
          ELSE 0
        END
      ), 0)::bigint AS boxes,
      COALESCE(SUM(oi.quantity), 0)::bigint AS units
    FROM orders o
    INNER JOIN order_items oi ON oi.order_id = o.id
    INNER JOIN products p ON p.id = oi.product_id
    WHERE o.payment_status = '${PAYMENT_STATUS_PAID}'
      AND (o.order_date AT TIME ZONE $1)::date >= $2::date
      AND (o.order_date AT TIME ZONE $1)::date <= $3::date
      AND ($4::integer IS NULL OR o.agent_id = $4)
    GROUP BY 1
    ORDER BY 1 ASC
  `;
  return prisma.$queryRawUnsafe<RawBucketRow[]>(
    sql,
    tz,
    fromStr,
    toStr,
    agentId
  );
}

export async function getByProduct(
  agentId: number,
  fromStr: string,
  toStr: string
): Promise<RawProductRow[]> {
  const tz = getKpiTimezone();
  const sql = `
    SELECT p.id AS product_id,
      p.name_mongolian AS product_name,
      c.name_mongolian AS category_name,
      COALESCE(SUM(oi.quantity), 0)::bigint AS units,
      COALESCE(SUM(oi.quantity::numeric * oi.unit_price::numeric), 0)::text AS amount,
      COALESCE(SUM(
        CASE
          WHEN p.units_per_box IS NOT NULL AND p.units_per_box > 0
          THEN FLOOR(oi.quantity::numeric / p.units_per_box::numeric)
          ELSE 0
        END
      ), 0)::bigint AS boxes
    FROM orders o
    INNER JOIN order_items oi ON oi.order_id = o.id
    INNER JOIN products p ON p.id = oi.product_id
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE o.payment_status = '${PAYMENT_STATUS_PAID}'
      AND (o.order_date AT TIME ZONE $1)::date >= $2::date
      AND (o.order_date AT TIME ZONE $1)::date <= $3::date
      AND o.agent_id = $4
    GROUP BY p.id, p.name_mongolian, c.name_mongolian
    ORDER BY p.name_mongolian ASC
  `;
  return prisma.$queryRawUnsafe<RawProductRow[]>(
    sql,
    tz,
    fromStr,
    toStr,
    agentId
  );
}

export async function getMultiAgentDaily(isoDate: string): Promise<RawAgentDayRow[]> {
  const tz = getKpiTimezone();
  const sql = `
    SELECT o.agent_id AS agent_id,
      COALESCE(SUM(oi.quantity::numeric * oi.unit_price::numeric), 0)::text AS amount,
      COALESCE(SUM(
        CASE
          WHEN p.units_per_box IS NOT NULL AND p.units_per_box > 0
          THEN FLOOR(oi.quantity::numeric / p.units_per_box::numeric)
          ELSE 0
        END
      ), 0)::bigint AS boxes,
      COALESCE(SUM(oi.quantity), 0)::bigint AS units
    FROM orders o
    INNER JOIN order_items oi ON oi.order_id = o.id
    INNER JOIN products p ON p.id = oi.product_id
    WHERE o.payment_status = '${PAYMENT_STATUS_PAID}'
      AND (o.order_date AT TIME ZONE $1)::date = $2::date
    GROUP BY o.agent_id
    ORDER BY o.agent_id ASC
  `;
  return prisma.$queryRawUnsafe<RawAgentDayRow[]>(sql, tz, isoDate);
}

async function loadTargetsForSummary(
  agentId: number,
  fromStr: string,
  toStr: string,
  granularity: KpiGranularity
): Promise<AgentSalesTarget[]> {
  const fromD = parseDateOnlyUtc(fromStr);
  const toD = parseDateOnlyUtc(toStr);
  if (granularity === "day") {
    return prisma.agentSalesTarget.findMany({
      where: {
        employeeId: agentId,
        periodType: AgentSalesTargetPeriodType.DAY,
        periodStart: { gte: fromD, lte: toD },
      },
    });
  }
  if (granularity === "month") {
    const startM = new Date(
      Date.UTC(fromD.getUTCFullYear(), fromD.getUTCMonth(), 1)
    );
    const endM = new Date(Date.UTC(toD.getUTCFullYear(), toD.getUTCMonth(), 1));
    return prisma.agentSalesTarget.findMany({
      where: {
        employeeId: agentId,
        periodType: AgentSalesTargetPeriodType.MONTH,
        periodStart: { gte: startM, lte: endM },
      },
    });
  }
  const startY = new Date(Date.UTC(fromD.getUTCFullYear(), 0, 1));
  const endY = new Date(Date.UTC(toD.getUTCFullYear(), 0, 1));
  return prisma.agentSalesTarget.findMany({
    where: {
      employeeId: agentId,
      periodType: AgentSalesTargetPeriodType.YEAR,
      periodStart: { gte: startY, lte: endY },
    },
  });
}

function targetKeyFromPeriodStart(
  periodStart: Date,
  periodType: AgentSalesTargetPeriodType
): string {
  if (periodType === AgentSalesTargetPeriodType.DAY) {
    return formatBucketKey(periodStart, "day");
  }
  if (periodType === AgentSalesTargetPeriodType.MONTH) {
    return formatBucketKey(periodStart, "month");
  }
  return formatBucketKey(periodStart, "year");
}

export type SummaryRow = {
  bucket: string;
  bucketDate: string;
  actualAmount: number;
  actualBoxes: number;
  actualUnits: number;
  targetAmount: number | null;
  targetBoxQty: number | null;
  achievementPercent: number | null;
  runningAvgPercent: number | null;
};

export async function getSummary(input: {
  agentId: number;
  from: string;
  to: string;
  granularity: KpiGranularity;
}): Promise<{
  timezone: string;
  granularity: KpiGranularity;
  agentId: number;
  from: string;
  to: string;
  rows: SummaryRow[];
  totals: {
    sumActualAmount: number;
    sumTargetAmount: number;
    sumActualBoxes: number;
    sumTargetBoxQty: number | null;
    overallAchievementPercent: number | null;
  };
}> {
  const { agentId, from, to, granularity } = input;
  const sales = await aggregateSalesBuckets(from, to, agentId, granularity);
  const salesMap = new Map<string, RawBucketRow>();
  for (const r of sales) {
    salesMap.set(formatBucketKey(r.bucket, granularity), r);
  }

  const targets = await loadTargetsForSummary(agentId, from, to, granularity);
  const targetMap = new Map<string, AgentSalesTarget>();
  for (const t of targets) {
    targetMap.set(
      targetKeyFromPeriodStart(t.periodStart, t.periodType),
      t
    );
  }

  const bucketDates = enumerateBucketDates(from, to, granularity);
  const rows: SummaryRow[] = [];
  let runSumPct = 0;
  let runCount = 0;

  for (const b of bucketDates) {
    const key = formatBucketKey(b, granularity);
    const s = salesMap.get(key);
    const amount = s ? parseFloat(s.amount) : 0;
    const boxes = s ? Number(s.boxes) : 0;
    const units = s ? Number(s.units) : 0;
    const t = targetMap.get(key);
    const targetAmount = t ? parseFloat(t.targetAmount.toString()) : null;
    const targetBoxQty = t?.targetBoxQty
      ? parseFloat(t.targetBoxQty.toString())
      : null;

    const achievementPercent =
      targetAmount != null && targetAmount > 0
        ? (amount / targetAmount) * 100
        : null;

    let runningAvgPercent: number | null = null;
    if (
      granularity === "day" &&
      targetAmount != null &&
      targetAmount > 0
    ) {
      runSumPct += (amount / targetAmount) * 100;
      runCount += 1;
      runningAvgPercent = runSumPct / runCount;
    }

    rows.push({
      bucket: key,
      bucketDate: formatBucketKey(b, "day"),
      actualAmount: amount,
      actualBoxes: boxes,
      actualUnits: units,
      targetAmount,
      targetBoxQty,
      achievementPercent,
      runningAvgPercent,
    });
  }

  let sumActualAmount = 0;
  let sumTargetAmount = 0;
  let sumActualBoxes = 0;
  let sumTargetBox: number | null = null;
  for (const r of rows) {
    sumActualAmount += r.actualAmount;
    sumActualBoxes += r.actualBoxes;
    if (r.targetAmount != null && r.targetAmount > 0) {
      sumTargetAmount += r.targetAmount;
      if (r.targetBoxQty != null) {
        sumTargetBox = (sumTargetBox ?? 0) + r.targetBoxQty;
      }
    }
  }

  const overallAchievementPercent =
    sumTargetAmount > 0 ? (sumActualAmount / sumTargetAmount) * 100 : null;

  return {
    timezone: getKpiTimezone(),
    granularity,
    agentId,
    from,
    to,
    rows,
    totals: {
      sumActualAmount,
      sumTargetAmount,
      sumActualBoxes,
      sumTargetBoxQty: sumTargetBox,
      overallAchievementPercent,
    },
  };
}

export async function listTargets(employeeId: number): Promise<AgentSalesTarget[]> {
  return prisma.agentSalesTarget.findMany({
    where: { employeeId },
    orderBy: [{ periodType: "asc" }, { periodStart: "desc" }],
  });
}

export async function createTarget(data: {
  employeeId: number;
  periodType: AgentSalesTargetPeriodType;
  periodStart: Date;
  targetAmount: Prisma.Decimal;
  targetBoxQty?: Prisma.Decimal | null;
}): Promise<AgentSalesTarget> {
  const periodStart = normalizePeriodStart(data.periodStart, data.periodType);
  return prisma.agentSalesTarget.create({
    data: {
      employeeId: data.employeeId,
      periodType: data.periodType,
      periodStart,
      targetAmount: data.targetAmount,
      targetBoxQty: data.targetBoxQty ?? null,
    },
  });
}

export async function updateTarget(
  id: number,
  data: {
    targetAmount?: Prisma.Decimal;
    targetBoxQty?: Prisma.Decimal | null;
  }
): Promise<AgentSalesTarget> {
  return prisma.agentSalesTarget.update({
    where: { id },
    data: {
      ...(data.targetAmount !== undefined && { targetAmount: data.targetAmount }),
      ...(data.targetBoxQty !== undefined && { targetBoxQty: data.targetBoxQty }),
    },
  });
}

export async function deleteTarget(id: number): Promise<void> {
  await prisma.agentSalesTarget.delete({ where: { id } });
}

export async function getTargetById(id: number): Promise<AgentSalesTarget | null> {
  return prisma.agentSalesTarget.findUnique({ where: { id } });
}

// New dashboard functions

export async function getDashboardSummary(filters: {
  from: string;
  to: string;
  agentId?: number;
}) {
  const tz = getKpiTimezone();
  const { from, to, agentId } = filters;

  // Total metrics
  const totalsSql = `
    SELECT
      COALESCE(SUM(oi.quantity::numeric * oi.unit_price::numeric), 0)::text AS total_amount,
      COALESCE(SUM(
        CASE
          WHEN p.units_per_box IS NOT NULL AND p.units_per_box > 0
          THEN FLOOR(oi.quantity::numeric / p.units_per_box::numeric)
          ELSE 0
        END
      ), 0)::bigint AS total_boxes,
      COUNT(DISTINCT o.id)::integer AS total_orders
    FROM orders o
    INNER JOIN order_items oi ON oi.order_id = o.id
    INNER JOIN products p ON p.id = oi.product_id
    WHERE o.payment_status = '${PAYMENT_STATUS_PAID}'
      AND (o.order_date AT TIME ZONE $1)::date >= $2::date
      AND (o.order_date AT TIME ZONE $1)::date <= $3::date
      AND ($4::integer IS NULL OR o.agent_id = $4)
  `;

  const totalsResult = await prisma.$queryRawUnsafe<Array<{
    total_amount: string;
    total_boxes: bigint;
    total_orders: number;
  }>>(totalsSql, tz, from, to, agentId ?? null);

  const totals = totalsResult[0] || { total_amount: '0', total_boxes: 0n, total_orders: 0 };
  const totalAmount = parseFloat(totals.total_amount);
  const totalBoxes = Number(totals.total_boxes);
  const totalOrders = totals.total_orders;
  const avgOrderValue = totalOrders > 0 ? totalAmount / totalOrders : 0;

  // Top agent
  const topAgentSql = `
    SELECT e.id, e.name,
      COALESCE(SUM(oi.quantity::numeric * oi.unit_price::numeric), 0)::text AS amount
    FROM orders o
    INNER JOIN order_items oi ON oi.order_id = o.id
    INNER JOIN employees e ON e.id = o.agent_id
    WHERE o.payment_status = '${PAYMENT_STATUS_PAID}'
      AND (o.order_date AT TIME ZONE $1)::date >= $2::date
      AND (o.order_date AT TIME ZONE $1)::date <= $3::date
    GROUP BY e.id, e.name
    ORDER BY SUM(oi.quantity::numeric * oi.unit_price::numeric) DESC
    LIMIT 1
  `;

  const topAgentResult = await prisma.$queryRawUnsafe<Array<{
    id: number;
    name: string;
    amount: string;
  }>>(topAgentSql, tz, from, to);

  const topAgent = topAgentResult[0]
    ? { id: topAgentResult[0].id, name: topAgentResult[0].name, amount: parseFloat(topAgentResult[0].amount) }
    : { id: 0, name: 'N/A', amount: 0 };

  // Top product
  const topProductSql = `
    SELECT p.id, p.name_mongolian AS name,
      COALESCE(SUM(oi.quantity::numeric * oi.unit_price::numeric), 0)::text AS amount
    FROM orders o
    INNER JOIN order_items oi ON oi.order_id = o.id
    INNER JOIN products p ON p.id = oi.product_id
    WHERE o.payment_status = '${PAYMENT_STATUS_PAID}'
      AND (o.order_date AT TIME ZONE $1)::date >= $2::date
      AND (o.order_date AT TIME ZONE $1)::date <= $3::date
      AND ($4::integer IS NULL OR o.agent_id = $4)
    GROUP BY p.id, p.name_mongolian
    ORDER BY SUM(oi.quantity::numeric * oi.unit_price::numeric) DESC
    LIMIT 1
  `;

  const topProductResult = await prisma.$queryRawUnsafe<Array<{
    id: number;
    name: string;
    amount: string;
  }>>(topProductSql, tz, from, to, agentId ?? null);

  const topProduct = topProductResult[0]
    ? { id: topProductResult[0].id, name: topProductResult[0].name, amount: parseFloat(topProductResult[0].amount) }
    : { id: 0, name: 'N/A', amount: 0 };

  // Top category
  const topCategorySql = `
    SELECT c.id, c.name_mongolian AS name,
      COALESCE(SUM(oi.quantity::numeric * oi.unit_price::numeric), 0)::text AS amount
    FROM orders o
    INNER JOIN order_items oi ON oi.order_id = o.id
    INNER JOIN products p ON p.id = oi.product_id
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE o.payment_status = '${PAYMENT_STATUS_PAID}'
      AND (o.order_date AT TIME ZONE $1)::date >= $2::date
      AND (o.order_date AT TIME ZONE $1)::date <= $3::date
      AND ($4::integer IS NULL OR o.agent_id = $4)
      AND c.id IS NOT NULL
    GROUP BY c.id, c.name_mongolian
    ORDER BY SUM(oi.quantity::numeric * oi.unit_price::numeric) DESC
    LIMIT 1
  `;

  const topCategoryResult = await prisma.$queryRawUnsafe<Array<{
    id: number;
    name: string;
    amount: string;
  }>>(topCategorySql, tz, from, to, agentId ?? null);

  const topCategory = topCategoryResult[0]
    ? { id: topCategoryResult[0].id, name: topCategoryResult[0].name, amount: parseFloat(topCategoryResult[0].amount) }
    : { id: 0, name: 'N/A', amount: 0 };

  // Daily trend (last 30 days or date range)
  const dailyTrendSql = `
    SELECT (o.order_date AT TIME ZONE $1)::date AS date,
      COALESCE(SUM(oi.quantity::numeric * oi.unit_price::numeric), 0)::text AS amount,
      COALESCE(SUM(
        CASE
          WHEN p.units_per_box IS NOT NULL AND p.units_per_box > 0
          THEN FLOOR(oi.quantity::numeric / p.units_per_box::numeric)
          ELSE 0
        END
      ), 0)::bigint AS boxes
    FROM orders o
    INNER JOIN order_items oi ON oi.order_id = o.id
    INNER JOIN products p ON p.id = oi.product_id
    WHERE o.payment_status = '${PAYMENT_STATUS_PAID}'
      AND (o.order_date AT TIME ZONE $1)::date >= $2::date
      AND (o.order_date AT TIME ZONE $1)::date <= $3::date
      AND ($4::integer IS NULL OR o.agent_id = $4)
    GROUP BY 1
    ORDER BY 1 ASC
  `;

  const dailyTrendResult = await prisma.$queryRawUnsafe<Array<{
    date: Date;
    amount: string;
    boxes: bigint;
  }>>(dailyTrendSql, tz, from, to, agentId ?? null);

  const dailyTrend = dailyTrendResult.map(row => ({
    date: formatBucketKey(row.date, 'day'),
    amount: parseFloat(row.amount),
    boxes: Number(row.boxes),
  }));

  // Achievement summary (simplified - using targets if available)
  const achievementSummary = {
    dailyAvg: 0,
    monthlyAvg: 0,
    overallPct: 0,
  };

  return {
    totalAmount,
    totalBoxes,
    totalOrders,
    avgOrderValue,
    topAgent,
    topProduct,
    topCategory,
    dailyTrend,
    achievementSummary,
  };
}

export async function getAgentRanking(filters: {
  from: string;
  to: string;
  sortBy?: 'amount' | 'boxes' | 'orders' | 'achievement';
}) {
  const tz = getKpiTimezone();
  const { from, to, sortBy = 'amount' } = filters;

  const sql = `
    SELECT e.id AS agent_id,
      e.name AS agent_name,
      COALESCE(SUM(oi.quantity::numeric * oi.unit_price::numeric), 0)::text AS amount,
      COALESCE(SUM(
        CASE
          WHEN p.units_per_box IS NOT NULL AND p.units_per_box > 0
          THEN FLOOR(oi.quantity::numeric / p.units_per_box::numeric)
          ELSE 0
        END
      ), 0)::bigint AS boxes,
      COUNT(DISTINCT o.id)::integer AS orders
    FROM orders o
    INNER JOIN order_items oi ON oi.order_id = o.id
    INNER JOIN products p ON p.id = oi.product_id
    INNER JOIN employees e ON e.id = o.agent_id
    WHERE o.payment_status = '${PAYMENT_STATUS_PAID}'
      AND (o.order_date AT TIME ZONE $1)::date >= $2::date
      AND (o.order_date AT TIME ZONE $1)::date <= $3::date
    GROUP BY e.id, e.name
    ORDER BY ${sortBy === 'boxes' ? 'boxes' : sortBy === 'orders' ? 'orders' : 'amount'} DESC
  `;

  const result = await prisma.$queryRawUnsafe<Array<{
    agent_id: number;
    agent_name: string;
    amount: string;
    boxes: bigint;
    orders: number;
  }>>(sql, tz, from, to);

  return result.map((row, index) => ({
    rank: index + 1,
    agentId: row.agent_id,
    agentName: row.agent_name,
    amount: parseFloat(row.amount),
    boxes: Number(row.boxes),
    orders: row.orders,
    achievementPct: 0, // TODO: calculate from targets
  }));
}

export async function getCategoryAnalysis(filters: {
  from: string;
  to: string;
  agentId?: number;
}) {
  const tz = getKpiTimezone();
  const { from, to, agentId } = filters;

  const sql = `
    SELECT c.id AS category_id,
      c.name_mongolian AS category_name,
      COALESCE(SUM(oi.quantity::numeric * oi.unit_price::numeric), 0)::text AS amount,
      COALESCE(SUM(
        CASE
          WHEN p.units_per_box IS NOT NULL AND p.units_per_box > 0
          THEN FLOOR(oi.quantity::numeric / p.units_per_box::numeric)
          ELSE 0
        END
      ), 0)::bigint AS boxes,
      COALESCE(SUM(oi.quantity), 0)::bigint AS units
    FROM orders o
    INNER JOIN order_items oi ON oi.order_id = o.id
    INNER JOIN products p ON p.id = oi.product_id
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE o.payment_status = '${PAYMENT_STATUS_PAID}'
      AND (o.order_date AT TIME ZONE $1)::date >= $2::date
      AND (o.order_date AT TIME ZONE $1)::date <= $3::date
      AND ($4::integer IS NULL OR o.agent_id = $4)
      AND c.id IS NOT NULL
    GROUP BY c.id, c.name_mongolian
    ORDER BY amount DESC
  `;

  const result = await prisma.$queryRawUnsafe<Array<{
    category_id: number;
    category_name: string;
    amount: string;
    boxes: bigint;
    units: bigint;
  }>>(sql, tz, from, to, agentId ?? null);

  const totalAmount = result.reduce((sum, row) => sum + parseFloat(row.amount), 0);

  return result.map(row => ({
    categoryId: row.category_id,
    categoryName: row.category_name,
    amount: parseFloat(row.amount),
    boxes: Number(row.boxes),
    units: Number(row.units),
    contributionPct: totalAmount > 0 ? (parseFloat(row.amount) / totalAmount) * 100 : 0,
  }));
}

export async function getTrendData(filters: {
  from: string;
  to: string;
  agentId?: number;
  granularity: 'day' | 'month';
}) {
  const tz = getKpiTimezone();
  const { from, to, agentId, granularity } = filters;
  const bucket = bucketSqlExpr(granularity);

  const sql = `
    SELECT ${bucket} AS period,
      COALESCE(SUM(oi.quantity::numeric * oi.unit_price::numeric), 0)::text AS amount,
      COALESCE(SUM(
        CASE
          WHEN p.units_per_box IS NOT NULL AND p.units_per_box > 0
          THEN FLOOR(oi.quantity::numeric / p.units_per_box::numeric)
          ELSE 0
        END
      ), 0)::bigint AS boxes,
      COUNT(DISTINCT o.id)::integer AS orders
    FROM orders o
    INNER JOIN order_items oi ON oi.order_id = o.id
    INNER JOIN products p ON p.id = oi.product_id
    WHERE o.payment_status = '${PAYMENT_STATUS_PAID}'
      AND (o.order_date AT TIME ZONE $1)::date >= $2::date
      AND (o.order_date AT TIME ZONE $1)::date <= $3::date
      AND ($4::integer IS NULL OR o.agent_id = $4)
    GROUP BY 1
    ORDER BY 1 ASC
  `;

  const result = await prisma.$queryRawUnsafe<Array<{
    period: Date;
    amount: string;
    boxes: bigint;
    orders: number;
  }>>(sql, tz, from, to, agentId ?? null);

  return result.map(row => ({
    period: formatBucketKey(row.period, granularity),
    amount: parseFloat(row.amount),
    boxes: Number(row.boxes),
    orders: row.orders,
    target: 0, // TODO: load from targets
    achievementPct: 0,
  }));
}
