-- Migrate prices from product_prices table into direct product fields

-- Copy Бөөний (customer_type_id=1) prices to products.price_wholesale
UPDATE "products" p
SET "price_wholesale" = pp.price
FROM "product_prices" pp
WHERE pp.product_id = p.id
  AND pp.customer_type_id = 1;

-- Copy Жижиглэн (customer_type_id=2) prices to products.price_retail
UPDATE "products" p
SET "price_retail" = pp.price
FROM "product_prices" pp
WHERE pp.product_id = p.id
  AND pp.customer_type_id = 2;
