import { Router } from "express";
import {
  recordPayment,
  getOrderPayments,
  getAllPayments,
  getOverdueOrders,
  getCreditOrders,
} from "../controllers/payments.controller";
import { authMiddleware, checkRole } from "../middleware/auth.middleware";
import { body, param } from "express-validator";
import { validate } from "../middleware/validation.middleware";

const router = Router();

/**
 * @swagger
 * /api/payments:
 *   get:
 *     summary: Get all payments with filters
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by start date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by end date
 *       - in: query
 *         name: paymentMethod
 *         schema:
 *           type: string
 *           enum: [Cash, Credit, BankTransfer, Sales, Padan]
 *         description: Filter by payment method
 *     responses:
 *       200:
 *         description: List of payments with pagination
 */
router.get(
  "/",
  authMiddleware,
  checkRole(["Admin", "Manager"]),
  getAllPayments
);

/**
 * @swagger
 * /api/payments/overdue:
 *   get:
 *     summary: Get all overdue orders
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of overdue orders
 */
router.get(
  "/overdue",
  authMiddleware,
  checkRole(["Admin", "Manager"]),
  getOverdueOrders
);

/**
 * @swagger
 * /api/payments/credit:
 *   get:
 *     summary: Get all credit orders (pending/partial)
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *       - in: query
 *         name: customerId
 *         schema:
 *           type: integer
 *         description: Filter by customer ID
 *     responses:
 *       200:
 *         description: List of credit orders
 */
router.get(
  "/credit",
  authMiddleware,
  checkRole(["Admin", "Manager"]),
  getCreditOrders
);

/**
 * @swagger
 * /api/orders/{id}/payments:
 *   post:
 *     summary: Record a payment for an order
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Payment amount
 *               paymentMethod:
 *                 type: string
 *                 enum: [Cash, Credit, BankTransfer, Sales, Padan]
 *                 description: Payment method
 *               notes:
 *                 type: string
 *                 description: Payment notes
 *     responses:
 *       201:
 *         description: Payment recorded successfully
 */
router.post(
  "/orders/:id/payments",
  authMiddleware,
  checkRole(["Admin", "Manager", "SalesAgent"]),
  [
    param("id").isInt().withMessage("Order ID must be an integer"),
    body("amount")
      .isFloat({ min: 0.01 })
      .withMessage("Amount must be greater than zero"),
    body("paymentMethod")
      .optional()
      .isIn(["Cash", "Credit", "BankTransfer", "Sales", "Padan"])
      .withMessage("Invalid payment method"),
    body("notes").optional().isString().withMessage("Notes must be a string"),
  ],
  validate,
  recordPayment
);

/**
 * @swagger
 * /api/orders/{id}/payments:
 *   get:
 *     summary: Get payment history for an order
 *     tags: [Payments]
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
 *         description: Order payment information
 */
router.get(
  "/orders/:id/payments",
  authMiddleware,
  [param("id").isInt().withMessage("Order ID must be an integer")],
  validate,
  getOrderPayments
);

export default router;

