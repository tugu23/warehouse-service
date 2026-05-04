import { Router } from "express";
import { query, param, body } from "express-validator";
import { validate } from "../middleware/validation.middleware";
import { authMiddleware, checkRole } from "../middleware/auth.middleware";
import {
  getAgentKpiSummary,
  getAgentKpiByProduct,
  getAgentKpiMultiAgentDaily,
  getAgentKpiTargets,
  postAgentKpiTarget,
  patchAgentKpiTarget,
  deleteAgentKpiTarget,
  getAgentKpiDashboardSummary,
  getAgentKpiRanking,
  getAgentKpiCategoryAnalysis,
  getAgentKpiTrendData,
} from "../controllers/agent-kpi.controller";

const router = Router();

const agentKpiReaders = ["Admin"];

router.use(authMiddleware);

const dateQuery = (field: string) =>
  query(field)
    .notEmpty()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage(`${field} must be YYYY-MM-DD`);

router.get(
  "/summary",
  checkRole(agentKpiReaders),
  [
    dateQuery("from"),
    dateQuery("to"),
    query("agentId").optional().isInt(),
    query("granularity").optional().isIn(["day", "month", "year"]),
  ],
  validate,
  getAgentKpiSummary
);

router.get(
  "/by-product",
  checkRole(agentKpiReaders),
  [dateQuery("from"), dateQuery("to"), query("agentId").optional().isInt()],
  validate,
  getAgentKpiByProduct
);

router.get(
  "/multi-agent-daily",
  checkRole(["Admin"]),
  [dateQuery("date")],
  validate,
  getAgentKpiMultiAgentDaily
);

router.get(
  "/targets",
  checkRole(agentKpiReaders),
  [query("employeeId").notEmpty().isInt()],
  validate,
  getAgentKpiTargets
);

router.post(
  "/targets",
  checkRole(["Admin"]),
  [
    body("employeeId").isInt(),
    body("periodType").isIn(["DAY", "MONTH", "YEAR"]),
    body("periodStart").notEmpty().isString(),
    body("targetAmount").notEmpty(),
    body("targetBoxQty").optional(),
  ],
  validate,
  postAgentKpiTarget
);

router.patch(
  "/targets/:id",
  checkRole(["Admin"]),
  [param("id").isInt()],
  validate,
  patchAgentKpiTarget
);

router.delete(
  "/targets/:id",
  checkRole(["Admin"]),
  [param("id").isInt()],
  validate,
  deleteAgentKpiTarget
);

// New dashboard endpoints
router.get(
  "/dashboard-summary",
  checkRole(agentKpiReaders),
  [
    dateQuery("from"),
    dateQuery("to"),
    query("agentId").optional().isInt(),
  ],
  validate,
  getAgentKpiDashboardSummary
);

router.get(
  "/ranking",
  checkRole(["Admin"]),
  [
    dateQuery("from"),
    dateQuery("to"),
    query("sortBy").optional().isIn(["amount", "boxes", "orders", "achievement"]),
  ],
  validate,
  getAgentKpiRanking
);

router.get(
  "/category-analysis",
  checkRole(agentKpiReaders),
  [
    dateQuery("from"),
    dateQuery("to"),
    query("agentId").optional().isInt(),
  ],
  validate,
  getAgentKpiCategoryAnalysis
);

router.get(
  "/trend-data",
  checkRole(agentKpiReaders),
  [
    dateQuery("from"),
    dateQuery("to"),
    query("agentId").optional().isInt(),
    query("granularity").optional().isIn(["day", "month"]),
  ],
  validate,
  getAgentKpiTrendData
);

export default router;
