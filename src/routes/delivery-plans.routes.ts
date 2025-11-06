import { Router } from "express";
import {
  createDeliveryPlan,
  getAllDeliveryPlans,
  getDeliveryPlanById,
  updateDeliveryPlan,
  updateDeliveryPlanStatus,
} from "../controllers/delivery-plans.controller";
import { authMiddleware, checkRole } from "../middleware/auth.middleware";
import { body, param, query } from "express-validator";
import { validate } from "../middleware/validation.middleware";

const router = Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * @swagger
 * /api/delivery-plans:
 *   post:
 *     summary: Create a new delivery plan
 *     tags: [Delivery Plans]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - planDate
 *               - agentId
 *               - customerId
 *             properties:
 *               planDate:
 *                 type: string
 *                 format: date
 *               agentId:
 *                 type: integer
 *               customerId:
 *                 type: integer
 *               orderId:
 *                 type: integer
 *               scheduledTime:
 *                 type: string
 *                 format: date-time
 *               deliveryNotes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Delivery plan created successfully
 */
router.post(
  "/",
  checkRole(["Admin", "Manager", "SalesAgent"]),
  [
    body("planDate")
      .notEmpty()
      .withMessage("Plan date is required")
      .isISO8601()
      .withMessage("Plan date must be a valid date"),
    body("agentId")
      .isInt()
      .withMessage("Agent ID must be an integer"),
    body("customerId")
      .isInt()
      .withMessage("Customer ID must be an integer"),
    body("orderId")
      .optional()
      .isInt()
      .withMessage("Order ID must be an integer"),
    body("scheduledTime")
      .optional()
      .isISO8601()
      .withMessage("Scheduled time must be a valid date-time"),
    body("deliveryNotes")
      .optional()
      .isString()
      .withMessage("Delivery notes must be a string"),
  ],
  validate,
  createDeliveryPlan
);

/**
 * @swagger
 * /api/delivery-plans:
 *   get:
 *     summary: Get all delivery plans
 *     tags: [Delivery Plans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: planDate
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
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Planned, InProgress, Completed, Cancelled]
 *     responses:
 *       200:
 *         description: List of delivery plans
 */
router.get("/", getAllDeliveryPlans);

/**
 * @swagger
 * /api/delivery-plans/{id}:
 *   get:
 *     summary: Get delivery plan by ID
 *     tags: [Delivery Plans]
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
 *         description: Delivery plan details
 */
router.get(
  "/:id",
  [param("id").isInt().withMessage("Plan ID must be an integer")],
  validate,
  getDeliveryPlanById
);

/**
 * @swagger
 * /api/delivery-plans/{id}:
 *   put:
 *     summary: Update delivery plan
 *     tags: [Delivery Plans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               planDate:
 *                 type: string
 *                 format: date
 *               scheduledTime:
 *                 type: string
 *                 format: date-time
 *               deliveryNotes:
 *                 type: string
 *               orderId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Plan updated successfully
 */
router.put(
  "/:id",
  checkRole(["Admin", "Manager", "SalesAgent"]),
  [
    param("id").isInt().withMessage("Plan ID must be an integer"),
    body("planDate")
      .optional()
      .isISO8601()
      .withMessage("Plan date must be a valid date"),
    body("scheduledTime")
      .optional()
      .isISO8601()
      .withMessage("Scheduled time must be a valid date-time"),
    body("deliveryNotes")
      .optional()
      .isString()
      .withMessage("Delivery notes must be a string"),
    body("orderId")
      .optional()
      .isInt()
      .withMessage("Order ID must be an integer"),
  ],
  validate,
  updateDeliveryPlan
);

/**
 * @swagger
 * /api/delivery-plans/{id}/status:
 *   put:
 *     summary: Update delivery plan status
 *     tags: [Delivery Plans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Planned, InProgress, Completed, Cancelled]
 *     responses:
 *       200:
 *         description: Status updated successfully
 */
router.put(
  "/:id/status",
  checkRole(["Admin", "Manager", "SalesAgent"]),
  [
    param("id").isInt().withMessage("Plan ID must be an integer"),
    body("status")
      .isIn(["Planned", "InProgress", "Completed", "Cancelled"])
      .withMessage("Invalid status value"),
  ],
  validate,
  updateDeliveryPlanStatus
);

export default router;

