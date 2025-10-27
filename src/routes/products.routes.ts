import { Router } from "express";
import { body, param } from "express-validator";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  adjustInventory,
} from "../controllers/products.controller";
import { authMiddleware, checkRole } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product and inventory management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         nameMongolian:
 *           type: string
 *           example: Ус
 *         nameEnglish:
 *           type: string
 *           example: Water
 *         productCode:
 *           type: string
 *           example: PROD-001
 *         supplierId:
 *           type: integer
 *           example: 1
 *         stockQuantity:
 *           type: integer
 *           example: 100
 *         priceWholesale:
 *           type: number
 *           format: decimal
 *           example: 500
 *         priceRetail:
 *           type: number
 *           format: decimal
 *           example: 700
 *         createdAt:
 *           type: string
 *           format: date-time
 */

// All routes require authentication
router.use(authMiddleware);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     description: Create a new product (Manager/Admin only)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nameMongolian
 *             properties:
 *               nameMongolian:
 *                 type: string
 *                 example: Сүү
 *               nameEnglish:
 *                 type: string
 *                 example: Milk
 *               productCode:
 *                 type: string
 *                 example: PROD-004
 *               supplierId:
 *                 type: integer
 *                 example: 1
 *               stockQuantity:
 *                 type: integer
 *                 example: 50
 *               priceWholesale:
 *                 type: number
 *                 example: 1500
 *               priceRetail:
 *                 type: number
 *                 example: 2000
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.post(
  "/",
  checkRole(["Admin", "Manager"]),
  validate([
    body("nameMongolian").notEmpty().withMessage("Mongolian name is required"),
    body("nameEnglish").optional().isString(),
    body("productCode").optional().isString(),
    body("supplierId").optional().isInt(),
    body("stockQuantity")
      .optional()
      .isInt()
      .withMessage("Stock quantity must be a number"),
    body("priceWholesale").optional().isDecimal(),
    body("priceRetail").optional().isDecimal(),
  ]),
  createProduct
);

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     description: Get all products with optional filtering
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by product name
 *       - in: query
 *         name: supplierId
 *         schema:
 *           type: integer
 *         description: Filter by supplier ID
 *     responses:
 *       200:
 *         description: List of products
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
 *                     $ref: '#/components/schemas/Product'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/", getAllProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
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
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get(
  "/:id",
  validate([param("id").isInt().withMessage("Valid product ID is required")]),
  getProductById
);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     description: Update product details (Manager/Admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nameMongolian:
 *                 type: string
 *               nameEnglish:
 *                 type: string
 *               productCode:
 *                 type: string
 *               supplierId:
 *                 type: integer
 *               priceWholesale:
 *                 type: number
 *               priceRetail:
 *                 type: number
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.put(
  "/:id",
  checkRole(["Admin", "Manager"]),
  validate([
    param("id").isInt().withMessage("Valid product ID is required"),
    body("nameMongolian").optional().notEmpty(),
    body("nameEnglish").optional().isString(),
    body("productCode").optional().isString(),
    body("supplierId").optional().isInt(),
    body("priceWholesale").optional().isDecimal(),
    body("priceRetail").optional().isDecimal(),
  ]),
  updateProduct
);

/**
 * @swagger
 * /api/products/inventory/adjust:
 *   post:
 *     summary: Adjust product inventory
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     description: Adjust inventory levels (Manager/Admin only)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - adjustment
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 1
 *               adjustment:
 *                 type: integer
 *                 description: Positive to add, negative to subtract
 *                 example: 10
 *               reason:
 *                 type: string
 *                 example: Stock replenishment
 *     responses:
 *       200:
 *         description: Inventory adjusted successfully
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
 *                   example: Inventory adjusted successfully
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */
router.post(
  "/inventory/adjust",
  checkRole(["Admin", "Manager"]),
  validate([
    body("productId").isInt().withMessage("Valid product ID is required"),
    body("adjustment").isInt().withMessage("Adjustment must be an integer"),
    body("reason").optional().isString(),
  ]),
  adjustInventory
);

export default router;
