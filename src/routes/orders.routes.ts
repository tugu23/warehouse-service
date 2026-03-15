import { Router } from "express";
import { body, param } from "express-validator";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updateOrderEbarimt,
  getOrderReceipt,
  prepareOrderDocument,
  getMarketOrders,
  getStoreOrders,
  getOrderReceiptPDF,
} from "../controllers/orders.controller";
import { authMiddleware, checkRole } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         customerId:
 *           type: integer
 *           example: 1
 *         totalAmount:
 *           type: number
 *           format: decimal
 *           example: 15000
 *         status:
 *           type: string
 *           enum: [Pending, Fulfilled, Cancelled]
 *           example: Pending
 *         createdAt:
 *           type: string
 *           format: date-time
 *         createdById:
 *           type: integer
 *           example: 3
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *               unitPrice:
 *                 type: number
 */

// All routes require authentication
router.use(authMiddleware);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     description: Create a new order for a customer (Admin, Manager, SalesAgent, MarketSalesperson, StoreSalesperson)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerId
 *               - items
 *             properties:
 *               customerId:
 *                 type: integer
 *                 example: 1
 *               items:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - quantity
 *                   properties:
 *                     productId:
 *                       type: integer
 *                       example: 1
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *                       example: 10
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post(
  "/",
  checkRole([
    "Admin",
    "Manager",
    "SalesAgent",
    "MarketSalesperson",
    "StoreSalesperson",
  ]),
  validate([
    body("customerId").isInt().withMessage("Valid customer ID is required"),
    body("items")
      .isArray({ min: 1 })
      .withMessage("Order must contain at least one item"),
    body("items.*.productId")
      .isInt()
      .withMessage("Valid product ID is required"),
    body("items.*.quantity")
      .isInt({ min: 1 })
      .withMessage("Quantity must be at least 1"),
    body("orderType")
      .optional()
      .isIn(["Market", "Store"])
      .withMessage("Order type must be Market or Store"),
    body("deliveryDate")
      .optional()
      .isISO8601()
      .withMessage("Delivery date must be a valid date"),
    body("paymentMethod")
      .optional()
      .isIn(["Cash", "Credit", "BankTransfer", "Sales", "Padan"])
      .withMessage("Invalid payment method"),
    body("creditTermDays")
      .optional({ nullable: true, checkFalsy: true })
      .isInt({ min: 1 })
      .withMessage("Credit term days must be a positive integer"),
  ]),
  createOrder
);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     description: Get all orders (filtered by role - agents see only their customers' orders)
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Pending, Fulfilled, Cancelled]
 *         description: Filter by order status
 *       - in: query
 *         name: customerId
 *         schema:
 *           type: integer
 *         description: Filter by customer ID
 *     responses:
 *       200:
 *         description: List of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/", getAllOrders);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
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
 *         description: Order details with items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get(
  "/:id",
  validate([param("id").isInt().withMessage("Valid order ID is required")]),
  getOrderById
);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   put:
 *     summary: Update order status
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     description: Update order status (Manager/Admin only)
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
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Pending, Fulfilled, Cancelled]
 *                 example: Fulfilled
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Order status updated successfully
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.put(
  "/:id/status",
  checkRole(["Admin", "Manager"]),
  validate([
    param("id").isInt().withMessage("Valid order ID is required"),
    body("status")
      .isIn(["Pending", "Fulfilled", "Cancelled"])
      .withMessage("Status must be Pending, Fulfilled, or Cancelled"),
  ]),
  updateOrderStatus
);

/**
 * @swagger
 * /api/orders/{id}/ebarimt:
 *   put:
 *     summary: Update order eBarimt information
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     description: Save eBarimt registration data from frontend POS device
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
 *               - ebarimtId
 *               - ebarimtBillId
 *             properties:
 *               ebarimtId:
 *                 type: string
 *               ebarimtBillId:
 *                 type: string
 *               ebarimtDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: eBarimt info updated successfully
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.put(
  "/:id/ebarimt",
  checkRole([
    "Admin",
    "Manager",
    "SalesAgent",
    "MarketSalesperson",
    "StoreSalesperson",
  ]),
  validate([
    param("id").isInt().withMessage("Valid order ID is required"),
    body("ebarimtId").isString().withMessage("ebarimtId is required"),
    body("ebarimtBillId").isString().withMessage("ebarimtBillId is required"),
  ]),
  updateOrderEbarimt
);

/**
 * @swagger
 * /api/orders/{id}/receipt:
 *   get:
 *     summary: Get order receipt data
 *     tags: [Orders]
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
 *         description: Receipt data for order
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get(
  "/:id/receipt",
  validate([param("id").isInt().withMessage("Valid order ID is required")]),
  getOrderReceipt
);

/**
 * @swagger
 * /api/orders/{id}/document:
 *   get:
 *     summary: Prepare order document for printing
 *     tags: [Orders]
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
 *         description: Document data for printing
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get(
  "/:id/document",
  validate([param("id").isInt().withMessage("Valid order ID is required")]),
  prepareOrderDocument
);

/**
 * @swagger
 * /api/orders/{id}/receipt/pdf:
 *   get:
 *     summary: Get order receipt as PDF
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     description: Generate and download or view order e-receipt as PDF with full details including company info, customer data, items, VAT, payment info, and QR code
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *       - in: query
 *         name: download
 *         required: false
 *         schema:
 *           type: boolean
 *           default: false
 *         description: If true, downloads the PDF. If false, displays in browser
 *     responses:
 *       200:
 *         description: PDF file generated successfully
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       403:
 *         description: Access denied - Sales agents can only access their own orders
 *       404:
 *         description: Order not found
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get(
  "/:id/receipt/pdf",
  validate([param("id").isInt().withMessage("Valid order ID is required")]),
  getOrderReceiptPDF
);

/**
 * @swagger
 * /api/orders/market:
 *   get:
 *     summary: Get all market orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     description: Get all market orders (day-ahead wholesale orders)
 *     responses:
 *       200:
 *         description: List of market orders
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/market", getMarketOrders);

/**
 * @swagger
 * /api/orders/store:
 *   get:
 *     summary: Get all store orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     description: Get all store orders (immediate retail orders with VAT)
 *     responses:
 *       200:
 *         description: List of store orders
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/store", getStoreOrders);

export default router;
