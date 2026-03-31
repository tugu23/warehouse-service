-- Харилцагчийн төрөл: Зах, Дэлгүүр, Номин, CU, Наш (5 төрөл)
UPDATE "customer_types" SET "type_name" = 'Зах' WHERE "id" = 1;
UPDATE "customer_types" SET "type_name" = 'Дэлгүүр' WHERE "id" = 2;

INSERT INTO "customer_types" ("id", "type_name") VALUES
  (3, 'Номин'),
  (4, 'CU'),
  (5, 'Наш')
ON CONFLICT ("id") DO UPDATE SET "type_name" = EXCLUDED."type_name";

SELECT setval(
  pg_get_serial_sequence('customer_types', 'id'),
  COALESCE((SELECT MAX("id") FROM "customer_types"), 1)
);
