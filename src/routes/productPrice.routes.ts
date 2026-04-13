import express from 'express';
import {
  getProductPrices,
  getAllPrices,
  getProductPriceById,
  createProductPrice,
  upsertProductPrice,
  updateProductPriceById,
  bulkUpdateProductPrices,
  deleteProductPrice,
  deleteProductPriceById,
  copyProductPrices,
  adjustProductPrices,
} from '../controllers/productPrice.controller';
import { authMiddleware as authenticate } from '../middleware/auth.middleware';

const router = express.Router();

// Get all prices (admin view)
router.get('/', authenticate, getAllPrices);

// Frontend compatibility routes
router.get('/product/:productId', authenticate, getProductPrices);
router.get('/:id', authenticate, getProductPriceById);
router.post('/', authenticate, createProductPrice);
router.put('/:id', authenticate, updateProductPriceById);
router.delete('/:id', authenticate, deleteProductPriceById);

// Nested routes
router.get('/products/:productId/prices', authenticate, getProductPrices);
router.post('/products/:productId/prices', authenticate, upsertProductPrice);
router.put('/products/:productId/prices/bulk', authenticate, bulkUpdateProductPrices);
router.delete('/products/:productId/prices/:customerTypeId', authenticate, deleteProductPrice);
router.post('/products/:sourceProductId/prices/copy/:targetProductId', authenticate, copyProductPrices);
router.post('/products/:productId/prices/adjust', authenticate, adjustProductPrices);

export default router;
