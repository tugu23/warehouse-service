-- AlterTable: Add new fields to products table
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "name_korean" VARCHAR(255);
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "barcode" VARCHAR(100);
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "units_per_box" INTEGER;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "price_per_box" DECIMAL(10,2);
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "net_weight" DECIMAL(10,3);
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "gross_weight" DECIMAL(10,3);

-- Add unique constraint to barcode if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'products_barcode_key') THEN
        ALTER TABLE "products" ADD CONSTRAINT "products_barcode_key" UNIQUE ("barcode");
    END IF;
END $$;

-- AlterTable: Add new fields to customers table
ALTER TABLE "customers" ADD COLUMN IF NOT EXISTS "organization_name" VARCHAR(255);
ALTER TABLE "customers" ADD COLUMN IF NOT EXISTS "organization_type" VARCHAR(100);
ALTER TABLE "customers" ADD COLUMN IF NOT EXISTS "contact_person_name" VARCHAR(255);
ALTER TABLE "customers" ADD COLUMN IF NOT EXISTS "registration_number" VARCHAR(100);
ALTER TABLE "customers" ADD COLUMN IF NOT EXISTS "district" VARCHAR(100);
ALTER TABLE "customers" ADD COLUMN IF NOT EXISTS "detailed_address" TEXT;
ALTER TABLE "customers" ADD COLUMN IF NOT EXISTS "is_vat_payer" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "customers" ADD COLUMN IF NOT EXISTS "payment_terms" VARCHAR(100);

-- AlterTable: Add new fields to delivery_plans table
ALTER TABLE "delivery_plans" ADD COLUMN IF NOT EXISTS "description" TEXT;
ALTER TABLE "delivery_plans" ADD COLUMN IF NOT EXISTS "target_area" VARCHAR(255);
ALTER TABLE "delivery_plans" ADD COLUMN IF NOT EXISTS "estimated_orders" INTEGER;

