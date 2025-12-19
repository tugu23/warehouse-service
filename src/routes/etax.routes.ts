import express from 'express';
import { getOrganizationByRegno } from '../controllers/etax.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

/**
 * @swagger
 * /api/etax/organization/{regno}:
 *   get:
 *     summary: Get organization information from e-Tax API
 *     description: Fetch organization details by registration number from Mongolia's e-Tax system
 *     tags: [e-Tax]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: regno
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^\d{7}$'
 *         description: 7-digit organization registration number
 *         example: "5003059"
 *     responses:
 *       200:
 *         description: Organization information retrieved successfully
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
 *                     organization:
 *                       type: object
 *                       properties:
 *                         regno:
 *                           type: string
 *                           example: "5003059"
 *                         name:
 *                           type: string
 *                           example: "НОМИН ХОЛДИНГ ХХК"
 *                         address:
 *                           type: string
 *                           example: "Улаанбаатар, Сүхбаатар дүүрэг"
 *                         vatPayer:
 *                           type: boolean
 *                           example: true
 *                         status:
 *                           type: string
 *                           example: "active"
 *       404:
 *         description: Organization not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "Байгууллагын мэдээлэл олдсонгүй"
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Invalid registration number format
 */
router.get('/organization/:regno', authMiddleware, getOrganizationByRegno);

export default router;

