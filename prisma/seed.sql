-- 1. Admin employee (password: admin123)
INSERT INTO employees (name, email, phone_number, password_hash, role_id, is_active)
SELECT 'Админ', 'admin@warehouse.mn', '99001122', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', id, true
FROM roles WHERE name = 'Admin'
ON CONFLICT (email) DO NOTHING;

-- 2. Customer types
INSERT INTO customer_types (type_name) VALUES ('Бөөний'), ('Жижиглэн')
ON CONFLICT DO NOTHING;

-- 3. Categories
INSERT INTO categories (name_mongolian, description) VALUES
  ('Ундаа', 'Ундаа болон шингэн бүтээгдэхүүн'),
  ('Нарийн боов', 'Нарийн боов, чихэр'),
  ('Гурилан бүтээгдэхүүн', 'Гурил, талх'),
  ('Ногоо, жимс', 'Хүнсний ногоо болон жимс'),
  ('Бусад', NULL)
ON CONFLICT DO NOTHING;

-- 4. Products
INSERT INTO products (name_mongolian, product_code, barcode, category_id, stock_quantity, price_wholesale, price_retail, is_active)
SELECT 'Coca-Cola 0.5L', 'CC-500', '8888888001', id, 500, 1500, 1800, true FROM categories WHERE name_mongolian = 'Ундаа'
ON CONFLICT (product_code) DO NOTHING;

INSERT INTO products (name_mongolian, product_code, barcode, category_id, stock_quantity, price_wholesale, price_retail, is_active)
SELECT 'Pepsi 0.5L', 'PP-500', '8888888002', id, 300, 1400, 1700, true FROM categories WHERE name_mongolian = 'Ундаа'
ON CONFLICT (product_code) DO NOTHING;

INSERT INTO products (name_mongolian, product_code, barcode, category_id, stock_quantity, price_wholesale, price_retail, is_active)
SELECT 'Sprite 0.5L', 'SP-500', '8888888003', id, 400, 1400, 1700, true FROM categories WHERE name_mongolian = 'Ундаа'
ON CONFLICT (product_code) DO NOTHING;

INSERT INTO products (name_mongolian, product_code, barcode, category_id, stock_quantity, price_wholesale, price_retail, is_active)
SELECT 'Oreo 137г', 'OR-137', '8801301345652', id, 200, 3500, 4200, true FROM categories WHERE name_mongolian = 'Нарийн боов'
ON CONFLICT (product_code) DO NOTHING;

INSERT INTO products (name_mongolian, product_code, barcode, category_id, stock_quantity, price_wholesale, price_retail, is_active)
SELECT 'Choco Pie 12ш', 'CH-012', '8888888005', id, 150, 5500, 6500, true FROM categories WHERE name_mongolian = 'Нарийн боов'
ON CONFLICT (product_code) DO NOTHING;

INSERT INTO products (name_mongolian, product_code, barcode, category_id, stock_quantity, price_wholesale, price_retail, is_active)
SELECT 'Гурил 1кг', 'FL-001', '8888888006', id, 1000, 1800, 2200, true FROM categories WHERE name_mongolian = 'Гурилан бүтээгдэхүүн'
ON CONFLICT (product_code) DO NOTHING;

INSERT INTO products (name_mongolian, product_code, barcode, category_id, stock_quantity, price_wholesale, price_retail, is_active)
SELECT 'Талх цагаан', 'BR-001', '8888888007', id, 100, 1200, 1500, true FROM categories WHERE name_mongolian = 'Гурилан бүтээгдэхүүн'
ON CONFLICT (product_code) DO NOTHING;

-- 5. Customers
INSERT INTO customers (name, address, phone_number, location_latitude, location_longitude, customer_type_id, is_vat_payer)
SELECT 'Номин Дэлгүүр', 'УБ, Сүхбаатар дүүрэг, 1-р хороо', '88001100', 47.9184, 106.9177, id, false
FROM customer_types WHERE type_name = 'Бөөний';

INSERT INTO customers (name, address, phone_number, location_latitude, location_longitude, customer_type_id, is_vat_payer)
SELECT 'Ногоон Дэлгүүр', 'УБ, Баянзүрх дүүрэг, 5-р хороо', '88002200', 47.9200, 106.9300, id, false
FROM customer_types WHERE type_name = 'Жижиглэн';

INSERT INTO customers (name, address, phone_number, location_latitude, location_longitude, customer_type_id, is_vat_payer)
SELECT 'Алтай Маркет', 'УБ, Хан-Уул дүүрэг, 3-р хороо', '88003300', 47.8950, 106.9100, id, true
FROM customer_types WHERE type_name = 'Бөөний';

-- 6. Store
INSERT INTO stores (name, address, store_type, is_active)
VALUES ('Төв Агуулах', 'УБ, Сүхбаатар дүүрэг', 'Store', true);

-- Show results
SELECT 'employees' as tbl, count(*) as cnt FROM employees
UNION ALL SELECT 'customer_types', count(*) FROM customer_types
UNION ALL SELECT 'categories', count(*) FROM categories
UNION ALL SELECT 'products', count(*) FROM products
UNION ALL SELECT 'customers', count(*) FROM customers
UNION ALL SELECT 'stores', count(*) FROM stores;
