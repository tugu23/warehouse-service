import { Router } from "express";
import { body, param } from "express-validator";
import {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
} from "../controllers/customers.controller";
import { authMiddleware, checkRole } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: Customer management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Customer:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: ABC Store
 *         address:
 *           type: string
 *           example: Ulaanbaatar, Mongolia
 *         phoneNumber:
 *           type: string
 *           example: "+976-99999999"
 *         locationLatitude:
 *           type: number
 *           format: float
 *           example: 47.9186
 *         locationLongitude:
 *           type: number
 *           format: float
 *           example: 106.9177
 *         customerTypeId:
 *           type: integer
 *           example: 1
 *         assignedAgentId:
 *           type: integer
 *           example: 3
 */

// All routes require authentication
router.use(authMiddleware);

/**
 * @swagger
 * /api/customers:
 *   post:
 *     summary: Create a new customer
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     description: Create a new customer (Manager/Admin only)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: XYZ Supermarket
 *               address:
 *                 type: string
 *                 example: District 1, Ulaanbaatar
 *               phoneNumber:
 *                 type: string
 *                 example: "+976-88888888"
 *               locationLatitude:
 *                 type: number
 *                 example: 47.9186
 *               locationLongitude:
 *                 type: number
 *                 example: 106.9177
 *               customerTypeId:
 *                 type: integer
 *                 example: 2
 *                 description: 1 for Retail, 2 for Wholesale
 *               assignedAgentId:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       201:
 *         description: Customer created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Customer'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.post(
  "/",
  checkRole(["Admin", "Manager", "SalesAgent"]),
  validate([
    body("name").notEmpty().withMessage("Customer name is required"),
    body("address").optional().isString(),
    body("phoneNumber").optional().isString(),
    body("locationLatitude").optional().isFloat(),
    body("locationLongitude").optional().isFloat(),
    body("customerTypeId").optional().isInt(),
    body("assignedAgentId").optional().isInt(),
  ]),
  createCustomer
);

/**
 * @swagger
 * /api/customers:
 *   get:
 *     summary: Get all customers
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     description: Get all customers (filtered by role - agents see only their assigned customers)
 *     responses:
 *       200:
 *         description: List of customers
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
 *                     $ref: '#/components/schemas/Customer'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/", getAllCustomers);

/**
 * @swagger
 * /api/customers/{id}:
 *   get:
 *     summary: Get customer by ID
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Customer ID
 *     responses:
 *       200:
 *         description: Customer details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Customer'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get(
  "/:id",
  validate([param("id").isInt().withMessage("Valid customer ID is required")]),
  getCustomerById
);

/**
 * @swagger
 * /api/customers/{id}:
 *   put:
 *     summary: Update customer
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     description: Update customer details (Manager/Admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Customer ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               locationLatitude:
 *                 type: number
 *               locationLongitude:
 *                 type: number
 *               customerTypeId:
 *                 type: integer
 *               assignedAgentId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Customer updated successfully
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.put(
  "/:id",
  checkRole(["Admin", "Manager"]),
  validate([
    param("id").isInt().withMessage("Valid customer ID is required"),
    body("name").optional().notEmpty(),
    body("address").optional().isString(),
    body("phoneNumber").optional().isString(),
    body("locationLatitude").optional().isFloat(),
    body("locationLongitude").optional().isFloat(),
    body("customerTypeId").optional().isInt(),
    body("assignedAgentId").optional().isInt(),
  ]),
  updateCustomer
);

export default router;
