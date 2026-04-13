-- Үндсэн үнэ нэг талбарт; бөөний/жижиглэн хасах
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "default_price" DECIMAL(10,2);

UPDATE "products"
SET "default_price" = COALESCE("price_retail", "price_wholesale")
WHERE "default_price" IS NULL;

ALTER TABLE "products" DROP COLUMN IF EXISTS "price_wholesale";
ALTER TABLE "products" DROP COLUMN IF EXISTS "price_retail";
