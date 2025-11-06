import { Router } from "express";
import {
  syncOrderToPosApi,
  syncProductToPosApi,
  getPosSalesData,
  checkPosApiStatus,
} from "../controllers/posapi.controller";
import { authMiddleware, checkRole } from "../middleware/auth.middleware";
import { param, query } from "express-validator";
import { validate } from "../middleware/validation.middleware";

const router = Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * @swagger
 * /api/posapi/status:
 *   get:
 *     summary: Check POS API system status
 *     tags: [PosAPI]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: POS API status
 */
router.get("/status", checkPosApiStatus);

/**
 * @swagger
 * /api/posapi/sync/order/{id}:
 *   post:
 *     summary: Sync order to POS system
 *     tags: [PosAPI]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order sync result
 */
router.post(
  "/sync/order/:id",
  checkRole(["Admin", "Manager"]),
  [param("id").isInt().withMessage("Order ID must be an integer")],
  validate,
  syncOrderToPosApi
);

/**
 * @swagger
 * /api/posapi/sync/product/{id}:
 *   post:
 *     summary: Sync product to POS system
 *     tags: [PosAPI]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product sync result
 */
router.post(
  "/sync/product/:id",
  checkRole(["Admin", "Manager"]),
  [param("id").isInt().withMessage("Product ID must be an integer")],
  validate,
  syncProductToPosApi
);

/**
 * @swagger
 * /api/posapi/sales:
 *   get:
 *     summary: Get sales data from POS system
 *     tags: [PosAPI]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: POS sales data
 */
router.get(
  "/sales",
  checkRole(["Admin", "Manager"]),
  [
    query("startDate")
      .notEmpty()
      .withMessage("Start date is required")
      .isISO8601()
      .withMessage("Start date must be a valid date"),
    query("endDate")
      .notEmpty()
      .withMessage("End date is required")
      .isISO8601()
      .withMessage("End date must be a valid date"),
  ],
  validate,
  getPosSalesData
);

export default router;

