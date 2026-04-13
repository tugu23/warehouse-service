-- Олон тохиолдолд үнэ зөвхөн product_prices хүснэгтэд байсан бөгөөд
-- products.price_retail / price_wholesale хоосон байсан тул default_price NULL үлдсэн.
-- Дэлгүүр (2), дараа нь Зах (1), эсвэл тухайн барааны product_prices-ийн хамгийн их үнээр бөглөнө.

UPDATE "products" p
SET "default_price" = COALESCE(
  (
    SELECT pp.price
    FROM "product_prices" pp
    WHERE pp.product_id = p.id AND pp.customer_type_id = 2
    LIMIT 1
  ),
  (
    SELECT pp.price
    FROM "product_prices" pp
    WHERE pp.product_id = p.id AND pp.customer_type_id = 1
    LIMIT 1
  ),
  (
    SELECT MAX(pp.price)
    FROM "product_prices" pp
    WHERE pp.product_id = p.id
  )
)
WHERE
  (p.default_price IS NULL OR p.default_price = 0)
  AND EXISTS (SELECT 1 FROM "product_prices" pp WHERE pp.product_id = p.id);
