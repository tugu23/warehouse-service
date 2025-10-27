import { Router } from "express";
import { body, param } from "express-validator";
import {
  createReturn,
  getAllReturns,
  getReturnById,
} from "../controllers/returns.controller";
import { authMiddleware, checkRole } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Returns
 *   description: Product return management endpoints (Manager/Admin only)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Return:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         orderId:
 *           type: integer
 *           example: 1
 *         productId:
 *           type: integer
 *           example: 1
 *         quantity:
 *           type: integer
 *           example: 2
 *         reason:
 *           type: string
 *           example: Product damaged
 *         returnDate:
 *           type: string
 *           format: date-time
 */

// All routes require authentication and Manager/Admin role
router.use(authMiddleware, checkRole(["Admin", "Manager"]));

/**
 * @swagger
 * /api/returns:
 *   post:
 *     summary: Create a product return
 *     tags: [Returns]
 *     security:
 *       - bearerAuth: []
 *     description: Process a product return from an order (Manager/Admin only)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *               - productId
 *               - quantity
 *             properties:
 *               orderId:
 *                 type: integer
 *                 example: 1
 *               productId:
 *                 type: integer
 *                 example: 1
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 example: 2
 *               reason:
 *                 type: string
 *                 example: Defective product
 *     responses:
 *       201:
 *         description: Return created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Return'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.post(
  "/",
  validate([
    body("orderId").isInt().withMessage("Valid order ID is required"),
    body("productId").isInt().withMessage("Valid product ID is required"),
    body("quantity")
      .isInt({ min: 1 })
      .withMessage("Quantity must be at least 1"),
    body("reason").optional().isString(),
  ]),
  createReturn
);

/**
 * @swagger
 * /api/returns:
 *   get:
 *     summary: Get all returns
 *     tags: [Returns]
 *     security:
 *       - bearerAuth: []
 *     description: Get all product returns (Manager/Admin only)
 *     parameters:
 *       - in: query
 *         name: orderId
 *         schema:
 *           type: integer
 *         description: Filter by order ID
 *       - in: query
 *         name: productId
 *         schema:
 *           type: integer
 *         description: Filter by product ID
 *     responses:
 *       200:
 *         description: List of returns
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
 *                     $ref: '#/components/schemas/Return'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.get("/", getAllReturns);

/**
 * @swagger
 * /api/returns/{id}:
 *   get:
 *     summary: Get return by ID
 *     tags: [Returns]
 *     security:
 *       - bearerAuth: []
 *     description: Get return details by ID (Manager/Admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Return ID
 *     responses:
 *       200:
 *         description: Return details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Return'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get(
  "/:id",
  validate([param("id").isInt().withMessage("Valid return ID is required")]),
  getReturnById
);

export default router;
