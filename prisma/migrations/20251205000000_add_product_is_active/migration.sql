-- AlterTable: Add isActive field to products table
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "is_active" BOOLEAN NOT NULL DEFAULT true;

