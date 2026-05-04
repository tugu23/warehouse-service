import { Router } from "express";
import { body, param } from "express-validator";
import {
  listPromotionsByProduct,
  createPromotion,
  updatePromotion,
  deletePromotion,
} from "../controllers/promotions.controller";
import { authMiddleware, checkRole } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";

const router = Router();

router.use(authMiddleware);

const promotionBodyValidators = [
  body("name").optional().isString().isLength({ min: 1, max: 255 }),
  body("type").optional().isIn(["PERCENT_DISCOUNT", "BUY_X_GET_Y"]),
  body("discountPercent").optional({ nullable: true }).isFloat({ min: 0, max: 100 }),
  body("buyQty").optional({ nullable: true }).isInt({ min: 1 }),
  body("freeQty").optional({ nullable: true }).isInt({ min: 1 }),
  body("startDate").optional().isISO8601(),
  body("endDate").optional().isISO8601(),
  body("isActive").optional().isBoolean(),
];

/**
 * @swagger
 * /api/products/{productId}/promotions:
 *   get:
 *     summary: List promotions for a product
 *     tags: [Promotions]
 */
router.get(
  "/products/:productId/promotions",
  validate([param("productId").isInt().withMessage("Valid product ID is required")]),
  listPromotionsByProduct
);

/**
 * @swagger
 * /api/products/{productId}/promotions:
 *   post:
 *     summary: Create a new promotion for a product
 *     tags: [Promotions]
 */
router.post(
  "/products/:productId/promotions",
  checkRole(["Admin", "Manager"]),
  validate([
    param("productId").isInt().withMessage("Valid product ID is required"),
    body("name").notEmpty().isString().isLength({ min: 1, max: 255 }),
    body("type").notEmpty().isIn(["PERCENT_DISCOUNT", "BUY_X_GET_Y"]),
    body("startDate").notEmpty().isISO8601(),
    body("endDate").notEmpty().isISO8601(),
    body("discountPercent").optional({ nullable: true }).isFloat({ min: 0, max: 100 }),
    body("buyQty").optional({ nullable: true }).isInt({ min: 1 }),
    body("freeQty").optional({ nullable: true }).isInt({ min: 1 }),
    body("isActive").optional().isBoolean(),
  ]),
  createPromotion
);

/**
 * @swagger
 * /api/promotions/{id}:
 *   put:
 *     summary: Update a promotion
 *     tags: [Promotions]
 */
router.put(
  "/promotions/:id",
  checkRole(["Admin", "Manager"]),
  validate([
    param("id").isInt().withMessage("Valid promotion ID is required"),
    ...promotionBodyValidators,
  ]),
  updatePromotion
);

/**
 * @swagger
 * /api/promotions/{id}:
 *   delete:
 *     summary: Delete a promotion
 *     tags: [Promotions]
 */
router.delete(
  "/promotions/:id",
  checkRole(["Admin", "Manager"]),
  validate([param("id").isInt().withMessage("Valid promotion ID is required")]),
  deletePromotion
);

export default router;
