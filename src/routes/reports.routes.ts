import { Router } from "express";
import {
  getSalesReport,
  getInventoryReport,
  getCustomersReport,
  getOrderExport,
  getCreditStatusReport,
  getDeliveryScheduleReport,
} from "../controllers/reports.controller";
import { authMiddleware, checkRole } from "../middleware/auth.middleware";
import { query, param } from "express-validator";
import { validate } from "../middleware/validation.middleware";

const router = Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * @swagger
 * /api/reports/sales:
 *   get:
 *     summary: Get sales report by date range
 *     tags: [Reports]
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
 *       - in: query
 *         name: agentId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: customerId
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Sales report data (JSON for Excel export)
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
    query("agentId")
      .optional()
      .isInt()
      .withMessage("Agent ID must be an integer"),
    query("customerId")
      .optional()
      .isInt()
      .withMessage("Customer ID must be an integer"),
  ],
  validate,
  getSalesReport
);

/**
 * @swagger
 * /api/reports/inventory:
 *   get:
 *     summary: Get inventory report with batch details
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: supplierId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: lowStock
 *         schema:
 *           type: boolean
 *           description: Filter low stock products
 *     responses:
 *       200:
 *         description: Inventory report data
 */
router.get(
  "/inventory",
  checkRole(["Admin", "Manager"]),
  [
    query("categoryId")
      .optional()
      .isInt()
      .withMessage("Category ID must be an integer"),
    query("supplierId")
      .optional()
      .isInt()
      .withMessage("Supplier ID must be an integer"),
    query("lowStock")
      .optional()
      .isBoolean()
      .withMessage("lowStock must be a boolean"),
  ],
  validate,
  getInventoryReport
);

/**
 * @swagger
 * /api/reports/customers:
 *   get:
 *     summary: Get customers report with order summary
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: customerTypeId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: agentId
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Customers report data
 */
router.get(
  "/customers",
  checkRole(["Admin", "Manager"]),
  [
    query("customerTypeId")
      .optional()
      .isInt()
      .withMessage("Customer type ID must be an integer"),
    query("agentId")
      .optional()
      .isInt()
      .withMessage("Agent ID must be an integer"),
  ],
  validate,
  getCustomersReport
);

/**
 * @swagger
 * /api/reports/orders/{id}/export:
 *   get:
 *     summary: Export single order data
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order export data
 */
router.get(
  "/orders/:id/export",
  [param("id").isInt().withMessage("Order ID must be an integer")],
  validate,
  getOrderExport
);

/**
 * @swagger
 * /api/reports/credit-status:
 *   get:
 *     summary: Get credit/unpaid orders report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: customerId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: agentId
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Credit status report data
 */
router.get(
  "/credit-status",
  checkRole(["Admin", "Manager"]),
  [
    query("customerId")
      .optional()
      .isInt()
      .withMessage("Customer ID must be an integer"),
    query("agentId")
      .optional()
      .isInt()
      .withMessage("Agent ID must be an integer"),
  ],
  validate,
  getCreditStatusReport
);

/**
 * @swagger
 * /api/reports/delivery-schedule:
 *   get:
 *     summary: Get delivery schedule report
 *     tags: [Reports]
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
 *       - in: query
 *         name: agentId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Planned, InProgress, Completed, Cancelled]
 *     responses:
 *       200:
 *         description: Delivery schedule report data
 */
router.get(
  "/delivery-schedule",
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
    query("agentId")
      .optional()
      .isInt()
      .withMessage("Agent ID must be an integer"),
    query("status")
      .optional()
      .isIn(["Planned", "InProgress", "Completed", "Cancelled"])
      .withMessage("Invalid status value"),
  ],
  validate,
  getDeliveryScheduleReport
);

export default router;

