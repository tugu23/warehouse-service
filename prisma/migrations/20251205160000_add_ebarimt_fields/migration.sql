-- Add E-Barimt (Electronic Receipt) fields to orders table
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "ebarimt_id" VARCHAR(100);
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "ebarimt_bill_id" VARCHAR(100);
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "ebarimt_lottery" VARCHAR(50);
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "ebarimt_qr_data" TEXT;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "ebarimt_registered" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "ebarimt_date" TIMESTAMPTZ(3);
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "ebarimt_return_id" VARCHAR(100);
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "order_number" VARCHAR(50);

-- Create unique index on order_number
CREATE UNIQUE INDEX IF NOT EXISTS "orders_order_number_key" ON "orders"("order_number");

-- Create index on ebarimt_id for faster lookups
CREATE INDEX IF NOT EXISTS "orders_ebarimt_id_idx" ON "orders"("ebarimt_id");

-- Create index on ebarimt_registered for filtering
CREATE INDEX IF NOT EXISTS "orders_ebarimt_registered_idx" ON "orders"("ebarimt_registered");

