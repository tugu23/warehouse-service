-- Migration: Set all products stockQuantity to 1000
-- Created: 2026-10-17

BEGIN;

-- Update all products to have stockQuantity = 1000
UPDATE "product" SET "stock_quantity" = 1000 WHERE "stock_quantity" IS DISTINCT FROM 1000;

COMMIT;

-- Verify the update (optional - for debugging)
-- SELECT id, name_mongolian, stock_quantity FROM "product" LIMIT 10;
