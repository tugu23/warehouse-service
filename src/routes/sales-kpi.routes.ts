import { Router } from "express";
import { query } from "express-validator";
import { validate } from "../middleware/validation.middleware";
import { authMiddleware, checkRole } from "../middleware/auth.middleware";
import { getSalesKpi } from "../controllers/sales-kpi.controller";

const router = Router();

router.use(authMiddleware);

const dateQuery = (field: string) =>
  query(field)
    .notEmpty()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage(`${field} must be YYYY-MM-DD`);

router.get(
  "/",
  checkRole(["Admin", "Manager"]),
  [
    dateQuery("from"),
    dateQuery("to"),
    query("agentId").optional().isInt(),
    query("productId").optional().isInt(),
    query("granularity").optional().isIn(["day", "week", "month", "year"]),
  ],
  validate,
  getSalesKpi
);

export default router;
