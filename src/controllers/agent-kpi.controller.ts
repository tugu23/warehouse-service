import { Response, NextFunction } from "express";
import { Prisma, AgentSalesTargetPeriodType } from "@prisma/client";
import { AuthRequest } from "../middleware/auth.middleware";
import { AppError } from "../middleware/error.middleware";
import prisma from "../db/prisma";
import logger from "../utils/logger";
import {
  assertAgentKpiAgentAccess,
  assertManagerOrAdmin,
} from "../utils/agent-kpi-access";
import {
  getSummary,
  getByProduct,
  getMultiAgentDaily,
  listTargets,
  createTarget,
  updateTarget,
  deleteTarget,
  getTargetById,
  normalizePeriodStart,
  parseDateOnlyUtc,
  KpiGranularity,
  getDashboardSummary,
  getAgentRanking,
  getCategoryAnalysis,
  getTrendData,
  getSalesByBrandProduct,
  SalesByBrandResult,
} from "../services/agent-kpi.service";

function parseGranularity(q: unknown): KpiGranularity {
  const g = String(q || "day").toLowerCase();
  if (g === "day" || g === "month" || g === "year") return g;
  throw new AppError("granularity Ð½ÑŒ day | month | year Ð±Ð°Ð¹Ñ… Ñ‘ÑÑ‚Ð¾Ð¹", 400);
}

export const getAgentKpiSummary = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    logger.debug("agent-kpi summary request received");
    const { from, to, agentId: agentIdQ, granularity: gQ } = req.query;
    if (!from || !to) {
      throw new AppError("from Ð±Ð¾Ð»Ð¾Ð½ to (YYYY-MM-DD) Ð·Ð°Ð°Ð²Ð°Ð»", 400);
    }
    const agentId = assertAgentKpiAgentAccess(
      req,
      agentIdQ ? parseInt(String(agentIdQ), 10) : undefined
    );
    const summary = await getSummary({
      agentId,
      from: String(from),
      to: String(to),
      granularity: parseGranularity(gQ),
    });
    res.json({ status: "success", data: summary });
  } catch (e) {
    next(e);
  }
};

export const getAgentKpiByProduct = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    logger.debug("agent-kpi by-product request received");
    const { from, to, agentId: agentIdQ } = req.query;
    if (!from || !to) {
      throw new AppError("from Ð±Ð¾Ð»Ð¾Ð½ to (YYYY-MM-DD) Ð·Ð°Ð°Ð²Ð°Ð»", 400);
    }
    const agentId = assertAgentKpiAgentAccess(
      req,
      agentIdQ ? parseInt(String(agentIdQ), 10) : undefined
    );
    const rows = await getByProduct(agentId, String(from), String(to));
    const data = rows.map((r) => ({
      productId: r.product_id,
      productName: r.product_name,
      categoryName: r.category_name,
      units: Number(r.units),
      boxes: Number(r.boxes),
      amount: parseFloat(r.amount),
    }));
    res.json({ status: "success", data: { products: data } });
  } catch (e) {
    next(e);
  }
};

export const getAgentKpiMultiAgentDaily = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    assertManagerOrAdmin(req);
    const { date } = req.query;
    if (!date) {
      throw new AppError("date (YYYY-MM-DD) Ð·Ð°Ð°Ð²Ð°Ð»", 400);
    }
    const dateStr = String(date);
    parseDateOnlyUtc(dateStr);
    const rows = await getMultiAgentDaily(dateStr);
    const ids = rows.map((r) => r.agent_id);
    const employees = await prisma.employee.findMany({
      where: { id: { in: ids } },
      select: { id: true, name: true },
    });
    const nameById = new Map(employees.map((e) => [e.id, e.name]));
    const agents = rows.map((r) => ({
      agentId: r.agent_id,
      agentName: nameById.get(r.agent_id) ?? `ID ${r.agent_id}`,
      amount: parseFloat(r.amount),
      boxes: Number(r.boxes),
      units: Number(r.units),
    }));
    res.json({
      status: "success",
      data: { date: dateStr, agents },
    });
  } catch (e) {
    next(e);
  }
};

export const getAgentKpiTargets = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { employeeId: eid } = req.query;
    if (!eid) {
      throw new AppError("employeeId Ð·Ð°Ð°Ð²Ð°Ð»", 400);
    }
    const employeeId = parseInt(String(eid), 10);
    assertAgentKpiAgentAccess(req, employeeId);
    const targets = await listTargets(employeeId);
    res.json({
      status: "success",
      data: {
        targets: targets.map(serializeTarget),
      },
    });
  } catch (e) {
    next(e);
  }
};

function serializeTarget(t: {
  id: number;
  employeeId: number;
  periodType: AgentSalesTargetPeriodType;
  periodStart: Date;
  targetAmount: Prisma.Decimal;
  targetBoxQty: Prisma.Decimal | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: t.id,
    employeeId: t.employeeId,
    periodType: t.periodType,
    periodStart: t.periodStart.toISOString().slice(0, 10),
    targetAmount: t.targetAmount.toString(),
    targetBoxQty: t.targetBoxQty?.toString() ?? null,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
  };
}

export const postAgentKpiTarget = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    assertManagerOrAdmin(req);
    const { employeeId, periodType, periodStart, targetAmount, targetBoxQty } =
      req.body;
    if (!employeeId || !periodType || !periodStart || targetAmount == null) {
      throw new AppError(
        "employeeId, periodType, periodStart, targetAmount Ð·Ð°Ð°Ð²Ð°Ð»",
        400
      );
    }
    const pt = periodType as AgentSalesTargetPeriodType;
    if (
      pt !== AgentSalesTargetPeriodType.DAY &&
      pt !== AgentSalesTargetPeriodType.MONTH &&
      pt !== AgentSalesTargetPeriodType.YEAR
    ) {
      throw new AppError("periodType Ð±ÑƒÑ€ÑƒÑƒ", 400);
    }
    const ps = parseDateOnlyUtc(String(periodStart));
    const created = await createTarget({
      employeeId: parseInt(String(employeeId), 10),
      periodType: pt,
      periodStart: ps,
      targetAmount: new Prisma.Decimal(String(targetAmount)),
      targetBoxQty:
        targetBoxQty != null && targetBoxQty !== ""
          ? new Prisma.Decimal(String(targetBoxQty))
          : null,
    });
    res.status(201).json({
      status: "success",
      data: { target: serializeTarget(created) },
    });
  } catch (e) {
    next(e);
  }
};

export const patchAgentKpiTarget = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    assertManagerOrAdmin(req);
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) throw new AppError("ID Ð±ÑƒÑ€ÑƒÑƒ", 400);
    const existing = await getTargetById(id);
    if (!existing) throw new AppError("ÐžÐ»Ð´ÑÐ¾Ð½Ð³Ò¯Ð¹", 404);
    const { targetAmount, targetBoxQty } = req.body;
    const updated = await updateTarget(id, {
      ...(targetAmount !== undefined && {
        targetAmount: new Prisma.Decimal(String(targetAmount)),
      }),
      ...(targetBoxQty !== undefined && {
        targetBoxQty:
          targetBoxQty === null || targetBoxQty === ""
            ? null
            : new Prisma.Decimal(String(targetBoxQty)),
      }),
    });
    res.json({
      status: "success",
      data: { target: serializeTarget(updated) },
    });
  } catch (e) {
    next(e);
  }
};

export const deleteAgentKpiTarget = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    assertManagerOrAdmin(req);
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) throw new AppError("ID Ð±ÑƒÑ€ÑƒÑƒ", 400);
    await deleteTarget(id);
    res.json({ status: "success", data: null });
  } catch (e) {
    next(e);
  }
};

// New dashboard endpoints

export const getAgentKpiDashboardSummary = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    logger.debug("agent-kpi dashboard-summary request received");
    const { from, to, agentId: agentIdQ } = req.query;
    if (!from || !to) {
      throw new AppError("from Ð±Ð¾Ð»Ð¾Ð½ to (YYYY-MM-DD) Ð·Ð°Ð°Ð²Ð°Ð»", 400);
    }
    const isPrivileged =
      req.user?.role === "Admin" || req.user?.role === "Manager";
    const agentId =
      isPrivileged && !agentIdQ
        ? undefined
        : assertAgentKpiAgentAccess(
            req,
            agentIdQ ? parseInt(String(agentIdQ), 10) : undefined
          );

    const summary = await getDashboardSummary({
      from: String(from),
      to: String(to),
      agentId,
    });

    res.json({ status: "success", data: summary });
  } catch (e) {
    next(e);
  }
};

export const getAgentKpiRanking = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    assertManagerOrAdmin(req);
    const { from, to, sortBy } = req.query;
    if (!from || !to) {
      throw new AppError("from Ð±Ð¾Ð»Ð¾Ð½ to (YYYY-MM-DD) Ð·Ð°Ð°Ð²Ð°Ð»", 400);
    }

    const ranking = await getAgentRanking({
      from: String(from),
      to: String(to),
      sortBy: sortBy as 'amount' | 'boxes' | 'orders' | 'achievement' | undefined,
    });

    res.json({ status: "success", data: { ranking } });
  } catch (e) {
    next(e);
  }
};

export const getAgentKpiCategoryAnalysis = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    logger.debug("agent-kpi category-analysis request received");
    const { from, to, agentId: agentIdQ } = req.query;
    if (!from || !to) {
      throw new AppError('from болон to (YYYY-MM-DD) заавал', 400);
    }

    const isPrivileged = req.user?.role === 'Admin' || req.user?.role === 'Manager';
    const agentId =
      isPrivileged && !agentIdQ
        ? undefined
        : assertAgentKpiAgentAccess(
            req,
            agentIdQ ? parseInt(String(agentIdQ), 10) : undefined
          );

    const categories = await getCategoryAnalysis({
      from: String(from),
      to: String(to),
      agentId,
    });

    res.json({ status: 'success', data: { categories } });
  } catch (e) {
    next(e);
  }
};
export const getAgentKpiTrendData = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    logger.debug("agent-kpi trend-data request received");
    const { from, to, agentId: agentIdQ, granularity } = req.query;
    if (!from || !to) {
      throw new AppError('from болон to (YYYY-MM-DD) заавал', 400);
    }

    const gran = String(granularity || 'day');
    if (gran !== 'day' && gran !== 'month') {
      throw new AppError('granularity нь day эсвэл month байх ёстой', 400);
    }

    const isPrivileged = req.user?.role === 'Admin' || req.user?.role === 'Manager';
    const agentId =
      isPrivileged && !agentIdQ
        ? undefined
        : assertAgentKpiAgentAccess(
            req,
            agentIdQ ? parseInt(String(agentIdQ), 10) : undefined
          );

    const trend = await getTrendData({
      from: String(from),
      to: String(to),
      agentId,
      granularity: gran,
    });

    res.json({ status: 'success', data: { trend } });
  } catch (e) {
    next(e);
  }
};
export const getAgentKpiSalesByBrand = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    logger.debug("agent-kpi sales-by-brand request received");
    const { from, to, agentId: agentIdQ, granularity } = req.query;
    if (!from || !to) {
      throw new AppError('from болон to (YYYY-MM-DD) заавал', 400);
    }

    const salesGranularity = parseGranularity(granularity);
    const isPrivileged = req.user?.role === 'Admin' || req.user?.role === 'Manager';
    const agentId =
      isPrivileged && !agentIdQ
        ? undefined
        : assertAgentKpiAgentAccess(
            req,
            agentIdQ ? parseInt(String(agentIdQ), 10) : undefined
          );

    const result = await getSalesByBrandProduct({
      from: String(from),
      to: String(to),
      agentId,
      granularity: salesGranularity,
    });

    res.json({ status: 'success', data: result });
  } catch (e) {
    next(e);
  }
};



