import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { AppError } from "../middleware/error.middleware";
import { getSalesTransactions } from "../services/sales-kpi.service";
import { assertManagerOrAdmin } from "../utils/agent-kpi-access";

type Granularity = "day" | "week" | "month" | "year";

function parseGranularity(q: unknown): Granularity {
  const g = String(q || "day").toLowerCase();
  if (g === "day" || g === "week" || g === "month" || g === "year") return g;
  throw new AppError("granularity нь day | week | month | year байх ёстой", 400);
}

export const getSalesKpi = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Only admin can access
    assertManagerOrAdmin(req);

    const { from, to, agentId, productId, granularity: gQ } = req.query;

    if (!from || !to) {
      throw new AppError("from болон to (YYYY-MM-DD) заавал", 400);
    }

    const filters = {
      from: String(from),
      to: String(to),
      agentId: agentId ? parseInt(String(agentId), 10) : undefined,
      productId: productId ? parseInt(String(productId), 10) : undefined,
      granularity: parseGranularity(gQ),
    };

    const result = await getSalesTransactions(filters);

    res.json({ status: "success", data: result });
  } catch (e) {
    next(e);
  }
};
