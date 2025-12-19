import { Router } from "express";
import {
  getExpiringProducts,
  getExpiredProducts,
  getBatchDetails,
  updateBatch,
  getExpirationStats,
} from "../controllers/productBatch.controller";

const router = Router();

/**
 * @swagger
 * /api/batches/expiring:
 *   get:
 *     summary: Хугацаа дуусах гэж байгаа бараанууд
 *     tags: [Product Batches]
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 30
 *         description: Хэдэн хоногийн дотор дуусах
 *     responses:
 *       200:
 *         description: Амжилттай
 */
router.get("/expiring", getExpiringProducts);

/**
 * @swagger
 * /api/batches/expired:
 *   get:
 *     summary: Хугацаа дууссан бараанууд
 *     tags: [Product Batches]
 *     responses:
 *       200:
 *         description: Амжилттай
 */
router.get("/expired", getExpiredProducts);

/**
 * @swagger
 * /api/batches/stats:
 *   get:
 *     summary: Хугацааны статистик
 *     tags: [Product Batches]
 *     responses:
 *       200:
 *         description: Амжилттай
 */
router.get("/stats", getExpirationStats);

/**
 * @swagger
 * /api/batches/product/{productId}:
 *   get:
 *     summary: Бүтээгдэхүүний бүх багцууд
 *     tags: [Product Batches]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Амжилттай
 */
router.get("/product/:productId", getBatchDetails);

/**
 * @swagger
 * /api/batches/{batchId}:
 *   put:
 *     summary: Багц шинэчлэх
 *     tags: [Product Batches]
 *     parameters:
 *       - in: path
 *         name: batchId
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
 *               quantity:
 *                 type: integer
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Амжилттай
 */
router.put("/:batchId", updateBatch);

export default router;

