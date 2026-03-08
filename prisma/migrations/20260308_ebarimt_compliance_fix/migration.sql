-- Remove lottery and qrData columns from orders table (legal compliance: must not persist)
ALTER TABLE "orders" DROP COLUMN IF EXISTS "ebarimt_lottery";
ALTER TABLE "orders" DROP COLUMN IF EXISTS "ebarimt_qr_data";

-- Add eBarimt consumer number to customers table
ALTER TABLE "customers" ADD COLUMN IF NOT EXISTS "ebarimt_consumer_no" VARCHAR(20);
