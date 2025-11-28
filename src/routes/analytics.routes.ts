import { Router } from "express";
import { body, query } from "express-validator";
import { validate } from "../middleware/validation.middleware";
import { authMiddleware, checkRole } from "../middleware/auth.middleware";
import {
  calculateProductSalesAnalytics,
  calculateAllProductsAnalytics,
  getProductSalesAnalytics,
  getAllProductsSalesAnalytics,
  generateInventoryForecast,
  generateAllProductsForecasts,
  getInventoryForecasts,
  getSalesByPeriod,
} from "../controllers/analytics.controller";

const router = Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * @swagger
 * /api/analytics/calculate:
 *   post:
 *     summary: Calculate sales analytics for a product (Admin/Manager only)
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 1
 *               month:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 12
 *                 example: 11
 *               year:
 *                 type: integer
 *                 example: 2025
 *     responses:
 *       200:
 *         description: Analytics calculated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post(
  "/calculate",
  checkRole(["Admin", "Manager"]),
  validate([
    body("productId").isInt({ min: 1 }).withMessage("Valid product ID is required"),
    body("month").optional().isInt({ min: 1, max: 12 }),
    body("year").optional().isInt({ min: 2020, max: 2100 }),
  ]),
  calculateProductSalesAnalytics
);

/**
 * @swagger
 * /api/analytics/calculate/all:
 *   post:
 *     summary: Calculate sales analytics for all products (Admin/Manager only)
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               month:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 12
 *               year:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Bulk analytics calculated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post(
  "/calculate/all",
  checkRole(["Admin", "Manager"]),
  validate([
    body("month").optional().isInt({ min: 1, max: 12 }),
    body("year").optional().isInt({ min: 2020, max: 2100 }),
  ]),
  calculateAllProductsAnalytics
);

/**
 * @swagger
 * /api/analytics/products/all:
 *   get:
 *     summary: Get sales analytics for all products
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: months
 *         schema:
 *           type: integer
 *           default: 6
 *     responses:
 *       200:
 *         description: Sales analytics for all products
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/products/all",
  checkRole(["Admin", "Manager"]),
  validate([
    query("months").optional().isInt({ min: 1, max: 24 }),
  ]),
  getAllProductsSalesAnalytics
);

/**
 * @swagger
 * /api/analytics/products/{id}:
 *   get:
 *     summary: Get sales analytics for a product
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: months
 *         schema:
 *           type: integer
 *           default: 6
 *     responses:
 *       200:
 *         description: Product sales analytics
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/products/:id",
  checkRole(["Admin", "Manager"]),
  validate([
    query("months").optional().isInt({ min: 1, max: 24 }),
  ]),
  getProductSalesAnalytics
);

/**
 * @swagger
 * /api/analytics/forecast:
 *   post:
 *     summary: Generate inventory forecast for a product (Admin/Manager only)
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 1
 *               month:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 12
 *               year:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Forecast generated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post(
  "/forecast",
  checkRole(["Admin", "Manager"]),
  validate([
    body("productId").isInt({ min: 1 }).withMessage("Valid product ID is required"),
    body("month").optional().isInt({ min: 1, max: 12 }),
    body("year").optional().isInt({ min: 2020, max: 2100 }),
  ]),
  generateInventoryForecast
);

/**
 * @swagger
 * /api/analytics/forecast/all:
 *   post:
 *     summary: Generate inventory forecasts for all products (Admin/Manager only)
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               month:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 12
 *               year:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Bulk forecasts generated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post(
  "/forecast/all",
  checkRole(["Admin", "Manager"]),
  validate([
    body("month").optional().isInt({ min: 1, max: 12 }),
    body("year").optional().isInt({ min: 2020, max: 2100 }),
  ]),
  generateAllProductsForecasts
);

/**
 * @swagger
 * /api/analytics/forecast:
 *   get:
 *     summary: Get inventory forecasts (Admin/Manager only)
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: productId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of inventory forecasts
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
  "/forecast",
  checkRole(["Admin", "Manager"]),
  validate([
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 100 }),
    query("productId").optional().isInt({ min: 1 }),
    query("month").optional().isInt({ min: 1, max: 12 }),
    query("year").optional().isInt({ min: 2020, max: 2100 }),
  ]),
  getInventoryForecasts
);

/**
 * @swagger
 * /api/analytics/sales-by-period:
 *   get:
 *     summary: Get sales aggregated by period (week/month/year)
 *     tags: [Analytics]
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
 *         name: period
 *         required: true
 *         schema:
 *           type: string
 *           enum: [week, month, year]
 *     responses:
 *       200:
 *         description: Sales aggregated by period
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/sales-by-period",
  checkRole(["Admin", "Manager"]),
  validate([
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
    query("period")
      .isIn(["week", "month", "year"])
      .withMessage("Period must be week, month, or year"),
  ]),
  getSalesByPeriod
);

export default router;

