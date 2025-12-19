import express from 'express';
import {
  getProductPrices,
  getAllPrices,
  upsertProductPrice,
  bulkUpdateProductPrices,
  deleteProductPrice,
  copyProductPrices,
  adjustProductPrices,
} from '../controllers/productPrice.controller';
import { authMiddleware as authenticate } from '../middleware/auth.middleware';

const router = express.Router();

// Get all prices (admin view)
router.get('/', authenticate, getAllPrices);

// Get prices for a specific product
router.get('/products/:productId/prices', authenticate, getProductPrices);

// Create or update a single price
router.post('/products/:productId/prices', authenticate, upsertProductPrice);

// Bulk update prices for a product
router.put('/products/:productId/prices/bulk', authenticate, bulkUpdateProductPrices);

// Delete a price
router.delete(
  '/products/:productId/prices/:customerTypeId',
  authenticate,
  deleteProductPrice
);

// Copy prices from one product to another
router.post(
  '/products/:sourceProductId/prices/copy/:targetProductId',
  authenticate,
  copyProductPrices
);

// Adjust prices by percentage
router.post('/products/:productId/prices/adjust', authenticate, adjustProductPrices);

export default router;
