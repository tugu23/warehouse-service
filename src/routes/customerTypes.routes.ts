import { Router } from 'express';
import { param, body } from 'express-validator';
import {
  getAllCustomerTypes,
  getCustomerTypeById,
  createCustomerType,
  updateCustomerType,
  deleteCustomerType
} from '../controllers/customerTypes.controller';
import { authMiddleware, checkRole } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: CustomerTypes
 *   description: Customer type management endpoints
 */

// All routes require authentication
router.use(authMiddleware);

/**
 * @swagger
 * /api/customer-types:
 *   get:
 *     summary: Get all customer types
 *     tags: [CustomerTypes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of customer types
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/', getAllCustomerTypes);

/**
 * @swagger
 * /api/customer-types/{id}:
 *   get:
 *     summary: Get customer type by ID
 *     tags: [CustomerTypes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Customer type ID
 *     responses:
 *       200:
 *         description: Customer type details
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get(
  '/:id',
  validate([param('id').isInt().withMessage('Valid customer type ID is required')]),
  getCustomerTypeById
);

/**
 * @swagger
 * /api/customer-types:
 *   post:
 *     summary: Create a new customer type
 *     tags: [CustomerTypes]
 *     security:
 *       - bearerAuth: []
 *     description: Create a new customer type (Admin/Manager only)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - typeName
 *             properties:
 *               typeName:
 *                 type: string
 *                 example: Wholesale
 *               description:
 *                 type: string
 *                 example: Wholesale customers
 *     responses:
 *       201:
 *         description: Customer type created successfully
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.post(
  '/',
  checkRole(['Admin', 'Manager']),
  validate([
    body('typeName').notEmpty().withMessage('Type name is required'),
    body('description').optional().isString()
  ]),
  createCustomerType
);

/**
 * @swagger
 * /api/customer-types/{id}:
 *   put:
 *     summary: Update customer type
 *     tags: [CustomerTypes]
 *     security:
 *       - bearerAuth: []
 *     description: Update customer type details (Admin/Manager only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Customer type ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               typeName:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Customer type updated successfully
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.put(
  '/:id',
  checkRole(['Admin', 'Manager']),
  validate([
    param('id').isInt().withMessage('Valid customer type ID is required'),
    body('typeName').optional().notEmpty().withMessage('Type name cannot be empty'),
    body('description').optional().isString()
  ]),
  updateCustomerType
);

/**
 * @swagger
 * /api/customer-types/{id}:
 *   delete:
 *     summary: Delete customer type
 *     tags: [CustomerTypes]
 *     security:
 *       - bearerAuth: []
 *     description: Delete customer type (Admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Customer type ID
 *     responses:
 *       200:
 *         description: Customer type deleted successfully
 *       400:
 *         description: Customer type is in use
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete(
  '/:id',
  checkRole(['Admin']),
  validate([param('id').isInt().withMessage('Valid customer type ID is required')]),
  deleteCustomerType
);

export default router;

