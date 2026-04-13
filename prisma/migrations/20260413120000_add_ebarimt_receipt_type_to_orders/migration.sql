-- Баримтын төрөл (B2B/B2C) — UI-д буруу таамаглалгүй хадгалах
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "ebarimt_receipt_type" VARCHAR(10);
