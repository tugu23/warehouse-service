import prisma from "../db/prisma";
import { config } from "../config";
import { format } from "date-fns";
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

function dateOnlyRangeUtc(dateStr: string): { start: Date; end: Date } {
  const start = parseDateOnlyUtc(dateStr);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);
  return { start, end };
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

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

function formatSalesPeriodKey(date: Date, granularity: KpiGranularity): string {
  const y = date.getUTCFullYear();
  const m = pad2(date.getUTCMonth() + 1);
  const d = pad2(date.getUTCDate());
  if (granularity === "day") return `${y}-${m}-${d}`;
  if (granularity === "month") return `${y}-${m}`;
  return `${y}`;
}

function formatSalesPeriodLabel(date: Date, granularity: KpiGranularity): string {
  const y = date.getUTCFullYear();
  const m = pad2(date.getUTCMonth() + 1);
  const d = pad2(date.getUTCDate());
  if (granularity === "day") return `${y}-${m}-${d}`;
  if (granularity === "month") return `${y}-${m}`;
  return `${y}`;
}

function buildSalesPeriods(fromStr: string, toStr: string, granularity: KpiGranularity) {
  return enumerateBucketDates(fromStr, toStr, granularity).map((date) => ({
    key: formatSalesPeriodKey(date, granularity),
    label: formatSalesPeriodLabel(date, granularity),
  }));
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
  const { start, end } = dateOnlyRangeUtc(isoDate);
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
      AND o.order_date >= $2::timestamptz
      AND o.order_date < $3::timestamptz
    GROUP BY o.agent_id
    ORDER BY o.agent_id ASC
  `;
  return prisma.$queryRawUnsafe<RawAgentDayRow[]>(sql, tz, start.toISOString(), end.toISOString());
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
      AND ($4::integer IS NULL OR o.agent_id = $4)
    GROUP BY e.id, e.name
    ORDER BY SUM(oi.quantity::numeric * oi.unit_price::numeric) DESC
    LIMIT 1
  `;

  const topAgentResult = await prisma.$queryRawUnsafe<Array<{
    id: number;
    name: string;
    amount: string;
  }>>(topAgentSql, tz, from, to, agentId ?? null);

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

  // Calculate previous period totals for comparison
  let previousPeriodTotals = null;
  try {
    const fromD = parseDateOnlyUtc(from);
    const toD = parseDateOnlyUtc(to);
    const periodDays = Math.ceil((toD.getTime() - fromD.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const prevToD = new Date(fromD);
    prevToD.setDate(prevToD.getDate() - 1);
    const prevFromD = new Date(prevToD);
    prevFromD.setDate(prevFromD.getDate() - periodDays + 1);

    const prevTotalsSql = `
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
    `;

    const prevTotalsResult = await prisma.$queryRawUnsafe<Array<{
      total_amount: string;
      total_boxes: bigint;
      total_orders: number;
    }>>(
      prevTotalsSql,
      tz,
      format(prevFromD, 'yyyy-MM-dd'),
      format(prevToD, 'yyyy-MM-dd')
    );

    if (prevTotalsResult[0]) {
      const prevTotals = prevTotalsResult[0];
      previousPeriodTotals = {
        totalAmount: parseFloat(prevTotals.total_amount),
        totalBoxes: Number(prevTotals.total_boxes),
        totalOrders: prevTotals.total_orders,
      };
    }
  } catch (error) {
    console.error('Error calculating previous period totals:', error);
  }

  // Get agents who missed their monthly targets (only for all agents view)
  let missedTargets: Array<{ agentId: number; agentName: string; target: number; actual: number; shortfall: number }> = [];
  try {
    if (agentId == null) {
      const fromD = parseDateOnlyUtc(from);
      const toD = parseDateOnlyUtc(to);

      // Get monthly targets for the period
      const targets = await prisma.agentSalesTarget.findMany({
        where: {
          periodType: AgentSalesTargetPeriodType.MONTH,
          periodStart: { gte: fromD, lte: toD },
        },
        include: { employee: true },
      });

      if (targets.length > 0) {
        // Get agent sales for the same period
        const agentSalesSql = `
          SELECT o.agent_id,
            COALESCE(SUM(oi.quantity::numeric * oi.unit_price::numeric), 0)::text AS amount
          FROM orders o
          INNER JOIN order_items oi ON oi.order_id = o.id
          WHERE o.payment_status = '${PAYMENT_STATUS_PAID}'
            AND (o.order_date AT TIME ZONE $1)::date >= $2::date
            AND (o.order_date AT TIME ZONE $1)::date <= $3::date
            AND o.agent_id IS NOT NULL
          GROUP BY o.agent_id
        `;

        const agentSalesResult = await prisma.$queryRawUnsafe<Array<{
          agent_id: number;
          amount: string;
        }>>(agentSalesSql, tz, from, to);

        const agentSalesMap = new Map<number, number>();
        agentSalesResult.forEach(row => {
          agentSalesMap.set(row.agent_id, parseFloat(row.amount));
        });

        // Find agents who missed targets
        for (const target of targets) {
          const actual = agentSalesMap.get(target.employeeId) ?? 0;
          const targetAmount = parseFloat(target.targetAmount.toString());
          if (actual < targetAmount) {
            missedTargets.push({
              agentId: target.employeeId,
              agentName: target.employee?.name || 'Unknown',
              target: targetAmount,
              actual,
              shortfall: targetAmount - actual,
            });
          }
        }
      }
    }
  } catch (error) {
    console.error('Error calculating missed targets:', error);
  }

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
    previousPeriodTotals,
    missedTargets,
  };
}

export async function getAgentRanking(filters: {
  from: string;
  to: string;
  sortBy?: 'amount' | 'boxes' | 'orders' | 'achievement';
}) {
  const tz = getKpiTimezone();
  const { from, to, sortBy = 'amount' } = filters;
  const fromD = parseDateOnlyUtc(from);
  const toD = parseDateOnlyUtc(to);

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

  // Load monthly targets for all agents in the result
  const agentIds = result.map(r => r.agent_id);
  const targets = await prisma.agentSalesTarget.findMany({
    where: {
      employeeId: { in: agentIds },
      periodType: AgentSalesTargetPeriodType.MONTH,
      periodStart: { gte: fromD, lte: toD },
    },
  });

  // Sum targetAmount per agent (handles multi-month ranges)
  const targetSumMap = new Map<number, number>();
  for (const t of targets) {
    const current = targetSumMap.get(t.employeeId) ?? 0;
    targetSumMap.set(t.employeeId, current + parseFloat(t.targetAmount.toString()));
  }

  return result.map((row, index) => {
    const sumTarget = targetSumMap.get(row.agent_id) ?? 0;
    const amount = parseFloat(row.amount);
    const achievementPct = sumTarget > 0 ? (amount / sumTarget) * 100 : 0;

    return {
      rank: index + 1,
      agentId: row.agent_id,
      agentName: row.agent_name,
      amount,
      boxes: Number(row.boxes),
      orders: row.orders,
      achievementPct: Math.round(achievementPct * 10) / 10,
    };
  });
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

  // Load targets when a specific agent is selected
  const targetMap = new Map<string, number>();
  if (agentId != null) {
    const fromD = parseDateOnlyUtc(from);
    const toD = parseDateOnlyUtc(to);
    const periodType = granularity === 'day'
      ? AgentSalesTargetPeriodType.DAY
      : AgentSalesTargetPeriodType.MONTH;
    const targets = await prisma.agentSalesTarget.findMany({
      where: {
        employeeId: agentId,
        periodType,
        periodStart: { gte: fromD, lte: toD },
      },
    });
    for (const t of targets) {
      targetMap.set(targetKeyFromPeriodStart(t.periodStart, t.periodType), parseFloat(t.targetAmount.toString()));
    }
  }

  return result.map(row => {
    const key = formatBucketKey(row.period, granularity);
    const targetAmount = targetMap.get(key) ?? 0;
    const amount = parseFloat(row.amount);
    const achievementPct = targetAmount > 0 ? (amount / targetAmount) * 100 : 0;

    return {
      period: key,
      amount,
      boxes: Number(row.boxes),
      orders: row.orders,
      target: targetAmount,
      achievementPct: Math.round(achievementPct * 10) / 10,
    };
  });
}

type SalesByBrandPeriod = {
  key: string;
  label: string;
  boxes: number;
  amount: number;
};

export type SalesByBrandProductRow = {
  productId: number;
  productName: string;
  categoryId: number;
  categoryName: string;
  supplierId: number;
  supplierName: string;
  periodData: SalesByBrandPeriod[];
  totalBoxes: number;
  totalAmount: number;
};

export type SalesByBrandSupplierRow = {
  supplierId: number;
  supplierName: string;
  products: SalesByBrandProductRow[];
  totalBoxes: number;
  totalAmount: number;
  periodData?: SalesByBrandPeriod[];
};

export type SalesByBrandResult = {
  granularity: KpiGranularity;
  periods: Array<{
    key: string;
    label: string;
  }>;
  brands: {
    categoryId: number;
    categoryName: string;
    suppliers: SalesByBrandSupplierRow[];
    totalBoxes: number;
    totalAmount: number;
    periodData?: SalesByBrandPeriod[];
  }[];
  grandTotalBoxes: number;
  grandTotalAmount: number;
  grandPeriodData: SalesByBrandPeriod[];
};

export async function getSalesByBrandProduct(filters: {
  from: string;
  to: string;
  agentId?: number;
  granularity?: KpiGranularity;
}): Promise<SalesByBrandResult> {
  const tz = getKpiTimezone();
  const { from, to, agentId, granularity = "year" } = filters;
  const periods = buildSalesPeriods(from, to, granularity);
  const periodSql =
    granularity === "day"
      ? `(o.order_date AT TIME ZONE $1)::date`
      : granularity === "month"
        ? `date_trunc('month', (o.order_date AT TIME ZONE $1)::timestamp)::date`
        : `date_trunc('year', (o.order_date AT TIME ZONE $1)::timestamp)::date`;

  const sql = `
    SELECT
      COALESCE(c.id, 0) AS category_id,
      COALESCE(c.name_mongolian, 'Ангилалгүй') AS category_name,
      p.id AS product_id,
      p.name_mongolian AS product_name,
      COALESCE(s.id, 0) AS supplier_id,
      COALESCE(s.name, 'Нийлүүлэгчгүй') AS supplier_name,
      ${periodSql} AS period,
      COALESCE(SUM(
        CASE
          WHEN p.units_per_box IS NOT NULL AND p.units_per_box > 0
          THEN FLOOR(oi.quantity::numeric / p.units_per_box::numeric)
          ELSE 0
        END
      ), 0)::bigint AS boxes,
      COALESCE(SUM(oi.quantity::numeric * oi.unit_price::numeric), 0)::text AS amount
    FROM orders o
    INNER JOIN order_items oi ON oi.order_id = o.id
    INNER JOIN products p ON p.id = oi.product_id
    LEFT JOIN categories c ON c.id = p.category_id
    LEFT JOIN suppliers s ON s.id = p.supplier_id
    WHERE o.payment_status = '${PAYMENT_STATUS_PAID}'
      AND (o.order_date AT TIME ZONE $1)::date >= $2::date
      AND (o.order_date AT TIME ZONE $1)::date <= $3::date
      AND ($4::integer IS NULL OR o.agent_id = $4)
    GROUP BY COALESCE(c.id, 0), COALESCE(c.name_mongolian, 'Ангилалгүй'), p.id, p.name_mongolian, COALESCE(s.id, 0), COALESCE(s.name, 'Нийлүүлэгчгүй'), period
    ORDER BY COALESCE(c.name_mongolian, 'Ангилалгүй') ASC, COALESCE(s.name, 'Нийлүүлэгчгүй') ASC, p.name_mongolian ASC, period ASC
  `;

  const result = await prisma.$queryRawUnsafe<Array<{
    category_id: number;
    category_name: string;
    product_id: number;
    product_name: string;
    supplier_id: number;
    supplier_name: string;
    period: Date;
    boxes: bigint;
    amount: string;
  }>>(sql, tz, from, to, agentId ?? null);

  const categoryMap = new Map<number, {
    categoryId: number;
    categoryName: string;
    suppliers: Map<number, {
      supplierId: number;
      supplierName: string;
      products: Map<number, {
        productId: number;
        productName: string;
        periodData: Map<string, SalesByBrandPeriod>;
      }>;
      periodData: Map<string, SalesByBrandPeriod>;
    }>;
    periodData: Map<string, SalesByBrandPeriod>;
  }>();

  for (const row of result) {
    const periodKey = formatSalesPeriodKey(row.period, granularity);
    const periodLabel = formatSalesPeriodLabel(row.period, granularity);
    const boxes = Number(row.boxes);
    const amount = parseFloat(row.amount);

    if (!categoryMap.has(row.category_id)) {
      categoryMap.set(row.category_id, {
        categoryId: row.category_id,
        categoryName: row.category_name || 'Ангилалгүй',
        suppliers: new Map(),
        periodData: new Map(),
      });
    }

    const category = categoryMap.get(row.category_id)!;

    if (!category.suppliers.has(row.supplier_id)) {
      category.suppliers.set(row.supplier_id, {
        supplierId: row.supplier_id,
        supplierName: row.supplier_name || 'Нийлүүлэгчгүй',
        products: new Map(),
        periodData: new Map(),
      });
    }

    const supplier = category.suppliers.get(row.supplier_id)!;

    if (!supplier.products.has(row.product_id)) {
      supplier.products.set(row.product_id, {
        productId: row.product_id,
        productName: row.product_name,
        periodData: new Map(),
      });
    }

    const product = supplier.products.get(row.product_id)!;
    const productPeriod = product.periodData.get(periodKey) ?? {
      key: periodKey,
      label: periodLabel,
      boxes: 0,
      amount: 0,
    };
    productPeriod.boxes += boxes;
    productPeriod.amount += amount;
    product.periodData.set(periodKey, productPeriod);

    const supplierPeriod = supplier.periodData.get(periodKey) ?? {
      key: periodKey,
      label: periodLabel,
      boxes: 0,
      amount: 0,
    };
    supplierPeriod.boxes += boxes;
    supplierPeriod.amount += amount;
    supplier.periodData.set(periodKey, supplierPeriod);

    const categoryPeriod = category.periodData.get(periodKey) ?? {
      key: periodKey,
      label: periodLabel,
      boxes: 0,
      amount: 0,
    };
    categoryPeriod.boxes += boxes;
    categoryPeriod.amount += amount;
    category.periodData.set(periodKey, categoryPeriod);
  }

  let grandTotalBoxes = 0;
  let grandTotalAmount = 0;

  const brands = Array.from(categoryMap.values()).map((cat) => {
    const suppliers = Array.from(cat.suppliers.values()).map((supp) => {
      const products: SalesByBrandProductRow[] = Array.from(supp.products.values()).map((p) => {
        const periodData = periods.map((period) => p.periodData.get(period.key) ?? {
          key: period.key,
          label: period.label,
          boxes: 0,
          amount: 0,
        });
        const totalBoxes = periodData.reduce((sum, y) => sum + y.boxes, 0);
        const totalAmount = periodData.reduce((sum, y) => sum + y.amount, 0);
        return {
          productId: p.productId,
          productName: p.productName,
          categoryId: cat.categoryId,
          categoryName: cat.categoryName,
          supplierId: supp.supplierId,
          supplierName: supp.supplierName,
          periodData,
          totalBoxes,
          totalAmount,
        };
      });

      const periodData = periods.map((period) => supp.periodData.get(period.key) ?? {
        key: period.key,
        label: period.label,
        boxes: 0,
        amount: 0,
      });
      const totalBoxes = periodData.reduce((sum, y) => sum + y.boxes, 0);
      const totalAmount = periodData.reduce((sum, y) => sum + y.amount, 0);

      return {
        supplierId: supp.supplierId,
        supplierName: supp.supplierName,
        products,
        totalBoxes,
        totalAmount,
        periodData,
      };
    });

    const periodData = periods.map((period) => cat.periodData.get(period.key) ?? {
      key: period.key,
      label: period.label,
      boxes: 0,
      amount: 0,
    });
    const totalBoxes = periodData.reduce((sum, y) => sum + y.boxes, 0);
    const totalAmount = periodData.reduce((sum, y) => sum + y.amount, 0);

    grandTotalBoxes += totalBoxes;
    grandTotalAmount += totalAmount;

    return {
      categoryId: cat.categoryId,
      categoryName: cat.categoryName,
      suppliers,
      totalBoxes,
      totalAmount,
      periodData,
    };
  });

  const grandPeriodData = periods.map((period) => {
    let boxes = 0;
    let amount = 0;
    brands.forEach((brand) => {
      const entry = brand.periodData?.find((p) => p.key === period.key);
      if (entry) {
        boxes += entry.boxes;
        amount += entry.amount;
      }
    });
    return {
      key: period.key,
      label: period.label,
      boxes,
      amount,
    };
  });

  return {
    granularity,
    periods,
    brands,
    grandTotalBoxes,
    grandTotalAmount,
    grandPeriodData,
  };
}
