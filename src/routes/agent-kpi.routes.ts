import { Router } from "express";
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
  getAgentKpiSalesByBrand,
} from "../controllers/agent-kpi.controller";

const router = Router();

const agentKpiReaders = [
  "Admin",
  "Manager",
  "SalesAgent",
  "MarketSalesperson",
  "StoreSalesperson",
];
const agentKpiManagers = ["Admin", "Manager"];

router.use(authMiddleware);

router.get(
  "/summary",
  checkRole(agentKpiReaders),
  getAgentKpiSummary
);

router.get(
  "/by-product",
  checkRole(agentKpiReaders),
  getAgentKpiByProduct
);

router.get(
  "/multi-agent-daily",
  checkRole(agentKpiManagers),
  getAgentKpiMultiAgentDaily
);

router.get(
  "/targets",
  checkRole(agentKpiReaders),
  getAgentKpiTargets
);

router.post(
  "/targets",
  checkRole(agentKpiManagers),
  postAgentKpiTarget
);

router.patch(
  "/targets/:id",
  checkRole(agentKpiManagers),
  patchAgentKpiTarget
);

router.delete(
  "/targets/:id",
  checkRole(agentKpiManagers),
  deleteAgentKpiTarget
);

// New dashboard endpoints
router.get(
  "/dashboard-summary",
  checkRole(agentKpiReaders),
  getAgentKpiDashboardSummary
);

router.get(
  "/ranking",
  checkRole(agentKpiManagers),
  getAgentKpiRanking
);

router.get(
  "/category-analysis",
  checkRole(agentKpiReaders),
  getAgentKpiCategoryAnalysis
);

router.get(
  "/trend-data",
  checkRole(agentKpiReaders),
  getAgentKpiTrendData
);

router.get(
  "/sales-by-brand",
  checkRole(agentKpiReaders),
  getAgentKpiSalesByBrand
);

export default router;
