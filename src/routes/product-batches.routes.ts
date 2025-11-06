import { Router } from "express";
import {
  createProductBatch,
  getProductBatches,
  updateProductBatch,
  deactivateProductBatch,
  getProductInventoryBalance,
} from "../controllers/product-batches.controller";
import { authMiddleware, checkRole } from "../middleware/auth.middleware";
import { body, param, query } from "express-validator";
import { validate } from "../middleware/validation.middleware";

const router = Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * @swagger
 * /api/products/{id}/batches:
 *   post:
 *     summary: Create a new product batch
 *     tags: [Product Batches]
 *     security:
 *       - bearerAuth: []
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
 *             required:
 *               - batchNumber
 *               - arrivalDate
 *               - quantity
 *             properties:
 *               batchNumber:
 *                 type: string
 *                 description: Unique batch number
 *               arrivalDate:
 *                 type: string
 *                 format: date
 *                 description: Arrival date of batch
 *               expiryDate:
 *                 type: string
 *                 format: date
 *                 description: Expiry date of batch (optional)
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 description: Quantity in batch
 *               costPrice:
 *                 type: number
 *                 description: Cost price per unit (optional)
 *               supplierInvoice:
 *                 type: string
 *                 description: Supplier invoice number (optional)
 *     responses:
 *       201:
 *         description: Batch created successfully
 */
router.post(
  "/:id/batches",
  checkRole(["Admin", "Manager"]),
  [
    param("id").isInt().withMessage("Product ID must be an integer"),
    body("batchNumber")
      .notEmpty()
      .withMessage("Batch number is required")
      .isString()
      .withMessage("Batch number must be a string"),
    body("arrivalDate")
      .notEmpty()
      .withMessage("Arrival date is required")
      .isISO8601()
      .withMessage("Arrival date must be a valid date"),
    body("expiryDate")
      .optional()
      .isISO8601()
      .withMessage("Expiry date must be a valid date"),
    body("quantity")
      .isInt({ min: 1 })
      .withMessage("Quantity must be at least 1"),
    body("costPrice")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Cost price must be a positive number"),
    body("supplierInvoice")
      .optional()
      .isString()
      .withMessage("Supplier invoice must be a string"),
  ],
  validate,
  createProductBatch
);

/**
 * @swagger
 * /api/products/{id}/batches:
 *   get:
 *     summary: Get all batches for a product
 *     tags: [Product Batches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *       - in: query
 *         name: includeInactive
 *         schema:
 *           type: boolean
 *         description: Include inactive batches
 *     responses:
 *       200:
 *         description: List of product batches
 */
router.get(
  "/:id/batches",
  [
    param("id").isInt().withMessage("Product ID must be an integer"),
    query("includeInactive")
      .optional()
      .isBoolean()
      .withMessage("includeInactive must be a boolean"),
  ],
  validate,
  getProductBatches
);

/**
 * @swagger
 * /api/products/{id}/batches/{batchId}:
 *   put:
 *     summary: Update a product batch
 *     tags: [Product Batches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *       - in: path
 *         name: batchId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Batch ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               expiryDate:
 *                 type: string
 *                 format: date
 *                 description: Updated expiry date
 *               supplierInvoice:
 *                 type: string
 *                 description: Updated supplier invoice
 *               isActive:
 *                 type: boolean
 *                 description: Active status
 *     responses:
 *       200:
 *         description: Batch updated successfully
 */
router.put(
  "/:id/batches/:batchId",
  checkRole(["Admin", "Manager"]),
  [
    param("id").isInt().withMessage("Product ID must be an integer"),
    param("batchId").isInt().withMessage("Batch ID must be an integer"),
    body("expiryDate")
      .optional()
      .isISO8601()
      .withMessage("Expiry date must be a valid date"),
    body("supplierInvoice")
      .optional()
      .isString()
      .withMessage("Supplier invoice must be a string"),
    body("isActive")
      .optional()
      .isBoolean()
      .withMessage("isActive must be a boolean"),
  ],
  validate,
  updateProductBatch
);

/**
 * @swagger
 * /api/products/{id}/batches/{batchId}:
 *   delete:
 *     summary: Deactivate a product batch
 *     tags: [Product Batches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *       - in: path
 *         name: batchId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Batch ID
 *     responses:
 *       200:
 *         description: Batch deactivated successfully
 */
router.delete(
  "/:id/batches/:batchId",
  checkRole(["Admin", "Manager"]),
  [
    param("id").isInt().withMessage("Product ID must be an integer"),
    param("batchId").isInt().withMessage("Batch ID must be an integer"),
  ],
  validate,
  deactivateProductBatch
);

/**
 * @swagger
 * /api/products/{id}/inventory-balance:
 *   get:
 *     summary: Get inventory balance for a product
 *     tags: [Product Batches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         description: Month (1-12)
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Year
 *     responses:
 *       200:
 *         description: Inventory balance data
 */
router.get(
  "/:id/inventory-balance",
  [
    param("id").isInt().withMessage("Product ID must be an integer"),
    query("month")
      .optional()
      .isInt({ min: 1, max: 12 })
      .withMessage("Month must be between 1 and 12"),
    query("year")
      .optional()
      .isInt()
      .withMessage("Year must be an integer"),
  ],
  validate,
  getProductInventoryBalance
);

export default router;

