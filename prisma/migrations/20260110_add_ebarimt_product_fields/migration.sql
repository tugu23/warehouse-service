-- AlterTable: Add eBarimt fields to products table
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "classification_code" VARCHAR(20);
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "vat_type" VARCHAR(20) DEFAULT 'VAT';

-- Add comment for documentation
COMMENT ON COLUMN "products"."classification_code" IS '7-digit BUNA classification code for eBarimt';
COMMENT ON COLUMN "products"."vat_type" IS 'VAT type: VAT, VAT_FREE, VAT_ZERO, NO_VAT';

