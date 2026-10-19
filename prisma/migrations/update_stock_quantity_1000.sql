-- Migration: Set all products stockQuantity to 1000
-- Created: 2026-10-17

-- Update all products to have stockQuantity = 1000
UPDATE "product" SET "stock_quantity" = 1000;

-- Verify the update
SELECT COUNT(*) as "Updated products count" FROM "product" WHERE "stock_quantity" = 1000;
