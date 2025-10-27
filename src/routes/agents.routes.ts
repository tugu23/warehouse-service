import { Router } from "express";
import { body, param, query } from "express-validator";
import {
  recordAgentLocation,
  getAgentRoute,
  getAllAgentLocations,
} from "../controllers/agents.controller";
import { authMiddleware, checkRole } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Agents
 *   description: Sales agent location tracking and route management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     AgentLocation:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         agentId:
 *           type: integer
 *           example: 3
 *         latitude:
 *           type: number
 *           format: float
 *           example: 47.9186
 *         longitude:
 *           type: number
 *           format: float
 *           example: 106.9177
 *         recordedAt:
 *           type: string
 *           format: date-time
 */

// All routes require authentication
router.use(authMiddleware);

/**
 * @swagger
 * /api/agents/{id}/location:
 *   post:
 *     summary: Record agent location
 *     tags: [Agents]
 *     security:
 *       - bearerAuth: []
 *     description: Record GPS location for an agent (Sales agents can only record their own location)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Agent (Employee) ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - latitude
 *               - longitude
 *             properties:
 *               latitude:
 *                 type: number
 *                 format: float
 *                 example: 47.9186
 *               longitude:
 *                 type: number
 *                 format: float
 *                 example: 106.9177
 *     responses:
 *       201:
 *         description: Location recorded successfully
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
 *                   example: Location recorded successfully
 *                 data:
 *                   $ref: '#/components/schemas/AgentLocation'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.post(
  "/:id/location",
  validate([
    param("id").isInt().withMessage("Valid agent ID is required"),
    body("latitude").isFloat().withMessage("Valid latitude is required"),
    body("longitude").isFloat().withMessage("Valid longitude is required"),
  ]),
  recordAgentLocation
);

/**
 * @swagger
 * /api/agents/{id}/route:
 *   get:
 *     summary: Get agent route history
 *     tags: [Agents]
 *     security:
 *       - bearerAuth: []
 *     description: Get location history for an agent within a date range (Manager/Admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Agent (Employee) ID
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start date for route history (ISO 8601 format)
 *         example: "2025-10-25T00:00:00Z"
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End date for route history (ISO 8601 format)
 *         example: "2025-10-25T23:59:59Z"
 *     responses:
 *       200:
 *         description: Agent route history
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
 *                     agentId:
 *                       type: integer
 *                       example: 3
 *                     startDate:
 *                       type: string
 *                       format: date-time
 *                     endDate:
 *                       type: string
 *                       format: date-time
 *                     locations:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/AgentLocation'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.get(
  "/:id/route",
  checkRole(["Admin", "Manager"]),
  validate([
    param("id").isInt().withMessage("Valid agent ID is required"),
    query("startDate")
      .optional()
      .isISO8601()
      .withMessage("Valid start date is required"),
    query("endDate")
      .optional()
      .isISO8601()
      .withMessage("Valid end date is required"),
  ]),
  getAgentRoute
);

/**
 * @swagger
 * /api/agents/locations/all:
 *   get:
 *     summary: Get all agent locations
 *     tags: [Agents]
 *     security:
 *       - bearerAuth: []
 *     description: Get current/recent locations for all agents (Manager/Admin only)
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Get locations for specific date (ISO 8601 format)
 *         example: "2025-10-25T00:00:00Z"
 *     responses:
 *       200:
 *         description: All agent locations
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
 *                     type: object
 *                     properties:
 *                       agentId:
 *                         type: integer
 *                       agentName:
 *                         type: string
 *                       locations:
 *                         type: array
 *                         items:
 *                           $ref: '#/components/schemas/AgentLocation'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.get(
  "/locations/all",
  checkRole(["Admin", "Manager"]),
  validate([
    query("date").optional().isISO8601().withMessage("Valid date is required"),
  ]),
  getAllAgentLocations
);

export default router;
