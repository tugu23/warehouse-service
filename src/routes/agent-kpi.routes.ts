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
} from "../controllers/agent-kpi.controller";

const router = Router();

const agentKpiReaders = [
  "Admin",
  "Manager",
  "SalesAgent",
  "MarketSalesperson",
  "StoreSalesperson",
];

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
  checkRole(["Admin", "Manager"]),
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
  checkRole(["Admin", "Manager"]),
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
  checkRole(["Admin", "Manager"]),
  [param("id").isInt()],
  validate,
  patchAgentKpiTarget
);

router.delete(
  "/targets/:id",
  checkRole(["Admin", "Manager"]),
  [param("id").isInt()],
  validate,
  deleteAgentKpiTarget
);

export default router;
