import { Router } from "express";
import { body, query } from "express-validator";
import { validate } from "../middleware/validation.middleware";
import { authMiddleware, checkRole } from "../middleware/auth.middleware";
import {
  createStore,
  getAllStores,
  getStoreById,
  updateStore,
  deleteStore,
  getStoreEmployees,
} from "../controllers/stores.controller";

const router = Router();

// All routes require authentication and Admin or Manager role
router.use(authMiddleware, checkRole(["Admin", "Manager"]));

/**
 * @swagger
 * /api/stores:
 *   post:
 *     summary: Create a new store
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - storeType
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Central Market"
 *               address:
 *                 type: string
 *                 example: "Ulaanbaatar, Mongolia"
 *               storeType:
 *                 type: string
 *                 enum: [Market, Store]
 *                 example: "Market"
 *               locationLatitude:
 *                 type: number
 *                 example: 47.918869
 *               locationLongitude:
 *                 type: number
 *                 example: 106.917580
 *     responses:
 *       201:
 *         description: Store created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post(
  "/",
  validate([
    body("name").notEmpty().withMessage("Store name is required"),
    body("storeType")
      .isIn(["Market", "Store"])
      .withMessage("Store type must be Market or Store"),
    body("address").optional().isString(),
    body("locationLatitude").optional().isFloat(),
    body("locationLongitude").optional().isFloat(),
  ]),
  createStore
);

/**
 * @swagger
 * /api/stores:
 *   get:
 *     summary: Get all stores
 *     tags: [Stores]
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
 *           default: 10
 *       - in: query
 *         name: storeType
 *         schema:
 *           type: string
 *           enum: [Market, Store]
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: List of stores
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
  "/",
  validate([
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 100 }),
    query("storeType").optional().isIn(["Market", "Store"]),
    query("isActive").optional().isBoolean(),
  ]),
  getAllStores
);

/**
 * @swagger
 * /api/stores/{id}:
 *   get:
 *     summary: Get store by ID
 *     tags: [Stores]
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
 *         description: Store details
 *       404:
 *         description: Store not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get("/:id", getStoreById);

/**
 * @swagger
 * /api/stores/{id}:
 *   put:
 *     summary: Update store
 *     tags: [Stores]
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
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               storeType:
 *                 type: string
 *                 enum: [Market, Store]
 *               locationLatitude:
 *                 type: number
 *               locationLongitude:
 *                 type: number
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Store updated successfully
 *       404:
 *         description: Store not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.put(
  "/:id",
  validate([
    body("name").optional().notEmpty().withMessage("Store name cannot be empty"),
    body("storeType")
      .optional()
      .isIn(["Market", "Store"])
      .withMessage("Store type must be Market or Store"),
    body("address").optional().isString(),
    body("locationLatitude").optional().isFloat(),
    body("locationLongitude").optional().isFloat(),
    body("isActive").optional().isBoolean(),
  ]),
  updateStore
);

/**
 * @swagger
 * /api/stores/{id}:
 *   delete:
 *     summary: Deactivate store
 *     tags: [Stores]
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
 *         description: Store deactivated successfully
 *       400:
 *         description: Cannot deactivate store with active employees
 *       404:
 *         description: Store not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.delete("/:id", deleteStore);

/**
 * @swagger
 * /api/stores/{id}/employees:
 *   get:
 *     summary: Get all employees assigned to a store
 *     tags: [Stores]
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
 *         description: List of employees in the store
 *       404:
 *         description: Store not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get("/:id/employees", getStoreEmployees);

export default router;

