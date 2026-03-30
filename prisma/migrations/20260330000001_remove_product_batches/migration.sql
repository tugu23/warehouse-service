-- Remove product_batches table and expiry_date from returns
DROP TABLE IF EXISTS "product_batches";
ALTER TABLE "returns" DROP COLUMN IF EXISTS "expiry_date";
