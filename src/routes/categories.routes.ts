import { Router } from "express";
import { body, param } from "express-validator";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/categories.controller";
import { authMiddleware, checkRole } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Product category management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         nameMongolian:
 *           type: string
 *           example: Ундаа
 *         nameEnglish:
 *           type: string
 *           example: Beverages
 *         description:
 *           type: string
 *           example: All types of beverages and drinks
 *         createdAt:
 *           type: string
 *           format: date-time
 */

// All routes require authentication
router.use(authMiddleware);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     description: Create a new product category (Manager/Admin only)
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
 *                 example: Хүнсний бүтээгдэхүүн
 *               nameEnglish:
 *                 type: string
 *                 example: Food Products
 *               description:
 *                 type: string
 *                 example: All food and grocery items
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Category'
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
    body("nameMongolian")
      .notEmpty()
      .withMessage("Mongolian name is required")
      .isString(),
    body("nameEnglish").optional().isString(),
    body("description").optional().isString(),
  ]),
  createCategory
);

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     description: Get all product categories with optional filtering
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by category name or description
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     categories:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Category'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                         total:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/", getAllCategories);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category details with associated products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get(
  "/:id",
  validate([param("id").isInt().withMessage("Valid category ID is required")]),
  getCategoryById
);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Update category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     description: Update category details (Manager/Admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
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
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.put(
  "/:id",
  checkRole(["Admin", "Manager"]),
  validate([
    param("id").isInt().withMessage("Valid category ID is required"),
    body("nameMongolian").optional().notEmpty().isString(),
    body("nameEnglish").optional().isString(),
    body("description").optional().isString(),
  ]),
  updateCategory
);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     description: Delete a category (Manager/Admin only). Cannot delete categories with associated products.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       400:
 *         description: Cannot delete category with associated products
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete(
  "/:id",
  checkRole(["Admin", "Manager"]),
  validate([param("id").isInt().withMessage("Valid category ID is required")]),
  deleteCategory
);

export default router;
