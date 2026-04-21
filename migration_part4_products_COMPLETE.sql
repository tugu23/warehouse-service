-- ============================================
-- MIGRATION PART 4: PRODUCTS
-- PRODUCTION READY - COMPLETE DATA
-- Generated: 2026-04-21
-- Total Records: 515
-- ============================================

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    422, 'Дашида монго 1кг', 'Mongo dashi 1kg', '', NULL, 15, 12,
    '8801301345652', 10, 0, 0, 4686, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    423, 'Дашида sajo 100гр', 'Dashida sajo 100g', '', NULL, 13, 12,
    '8801039906774', 50, 0, 0, 650, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    424, 'Гучужан 170гр', 'Gochujang  170g', '', NULL, 14, 12,
    '8801161240418', 40, 0, 0, 1223, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    425, 'Гучужан 500гр', 'Gochujang  500g', '', NULL, 14, 12,
    '8801161240449', 20, 0, 0, 2626, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    426, 'Гучужан sajo 170гр', 'Sunchang Gung Tae Yang Cho Gochujang 170g', '', NULL, 13, 12,
    '8801075012323', 24, 0, 0, 1140, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    427, 'Гучужан sajo 500гр', 'Gochujang sajo  500g', '', NULL, 13, 12,
    '8801075012316', 20, 0, 0, 2340, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    428, 'Гучужан 1кг', 'Gochujang 1кg', '', NULL, 14, 12,
    '8801161240456', 12, 0, 0, 3960, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    429, 'Гучужан sajo цаасан 14кг', 'Gochujang sajo paper 14kg', '', NULL, 13, 12,
    '8801075011128', 1, 0, 0, 0, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    430, 'Гучужан sajo лааз 14кг', 'Gochujang sajo can 14kg', '', NULL, 17, 12,
    '8801005178600', 1, 0, 0, 0, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    431, 'Самжан 170гр', 'Samjang 170g', '', NULL, 14, 12,
    '8801161252176', 40, 0, 0, 1171, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    432, 'Самжан 500гр', 'Samjang 500g', '', NULL, 14, 12,
    '8801161252190', 20, 0, 0, 2376, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    433, 'Самжан sajo 170гр', 'Samjang sajo  170g', '', NULL, 13, 12,
    '8801075010084', 24, 0, 0, 0, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    434, 'Самжан sajo 500гр', 'Samjang sajo  500g', '', NULL, 13, 12,
    '8801075010091', 20, 0, 0, 0, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    435, 'Самжан sajo 14кг', 'Samjang sajo 14kg', '', NULL, 13, 12,
    '', 1, 0, 0, 0, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    436, 'Пүнтүүз 500гр', 'Sweet potato noodles 500g', '', NULL, 14, 12,
    '8801161285402', 20, 0, 0, 2693, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    437, 'Пүнтүүз 1кг', 'Sweet potato noodles 1kg', '', NULL, 14, 12,
    '8801161285402', 10, 0, 0, 0, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    438, 'Гим оригналь 23гр', 'Gim original 23g', '', NULL, 16, 12,
    '8809275101557', 36, 0, 0, 1066, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    439, 'Гим ногоон цай 23гр', 'Gim green tea 23g', '', NULL, 16, 12,
    '8809275101533', 20, 0, 0, 1066, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    440, 'Кимбаб гим haejo 20гр', 'Kimbab gim haejo 20g', '', NULL, 16, 12,
    '8809275101243', 50, 0, 0, 1395, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    441, 'Кимбаб гим sajo 20гр', 'Kimbab gim sajo 20g', '', NULL, 13, 12,
    '8801039905685', 40, 0, 0, 1030, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    442, 'Нунтаг гим 65гр', 'Gim powder 65g', '', NULL, 16, 12,
    '8809275101236', 20, 0, 0, 2225, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    443, 'Жижиг гим олив 4гр', 'Gim third oliv 4g', '', NULL, 16, 12,
    '8809275101489', 72, 0, 0, 393, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    444, 'Жижиг гим sajo 10ш', 'Gim small sajo 10', '', NULL, 13, 12,
    '', 1, 0, 0, 2850, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    445, 'Миёог 45гр', 'Seaweed 45g', '', NULL, 13, 12,
    '8801039905722', 30, 0, 0, 1540, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    446, 'Миёог 20гр', 'Seaweed 20g', '', NULL, 13, 12,
    '8801039700150', 60, 0, 0, 780, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    447, 'Хар цуу 14л', 'Soy sauce 14L', '', NULL, 14, 12,
    '8801161221103', 1, 0, 0, 19500, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    448, 'Хар цуу 300мл', 'Soy sauce 300ml', '', NULL, 17, 12,
    '8801005153478', 24, 0, 0, 1181, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    449, 'Хар цуу 500мл', 'Soy sauce 500ml', '', NULL, 17, 12,
    '8801005153430', 24, 0, 0, 1673, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    450, 'Хар цуу 900мл', 'Soy sauce 900ml', '', NULL, 14, 12,
    '8801161228102', 15, 0, 0, 2483, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    451, 'Хар цуу сармистай 300мл', 'Soy sauce garlic 300ml', '', NULL, 14, 12,
    '', 24, 0, 0, 0, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    452, 'Алимны цуу 500мл', 'Apple vinegar 500ml', '', NULL, 14, 12,
    '8801161293063', 24, 0, 0, 1228, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    453, 'Алимны цуу 1.8л', 'Apple vinegar 1.8L', '', NULL, 14, 12,
    '8801161293087', 9, 0, 0, 3480, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    454, 'Арвайн цай 300гр', 'Barley tea 300g', '', NULL, 17, 12,
    '8801005633444', 24, 0, 0, 0, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    455, 'Гүнжидийн тос sajo 55мл', 'Sesame oil sajo 55ml', '', NULL, 13, 12,
    '8801039937730', 30, 0, 0, 1460, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    456, 'Гүнжидийн тос sajo 110мл', 'Sesame oil sajo 110ml', '', NULL, 13, 12,
    '8801039934074', 30, 0, 0, 2320, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    457, 'Гүнжидийн тос 160мл', 'Sesame oil 160ml', '', NULL, 14, 12,
    '8801161340019', 24, 0, 0, 3333, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    458, 'Гүнжидийн үр 230гр', 'Sesame seed 230g', '', NULL, 14, 12,
    '8801161310005', 20, 0, 0, 5600, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    459, 'Оливын тос 250мл', 'Olive oil 250ml', '', NULL, 13, 12,
    '8801039207680', 30, 0, 0, 2540, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    460, 'Оливын тос 500мл', 'Olive oil 500ml', '', NULL, 13, 12,
    '8801039903797', 20, 0, 0, 4200, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    461, 'Ургамлын тос 250мл', 'Soy bean oil 250ml', '', NULL, 13, 12,
    '8801039914151', 30, 0, 0, 687, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    462, 'Ургамлын тос 500мл', 'Soybean oil 500ml', '', NULL, 13, 12,
    '8801039202401', 30, 0, 0, 1187, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    463, 'Ургамлын тос 900мл', 'Soybean oil 900ml', '', NULL, 13, 12,
    '8801039202395', 20, 0, 0, 4000, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    464, 'Чихрийн уусмал 700гр', 'Corn syrup 700g', '', NULL, 14, 12,
    '8801161271603', 20, 0, 0, 1893, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    465, 'Чихрийн уусмал sajo 700гр', 'Corn syrup sajo 700g', '', NULL, 13, 12,
    '8801039503065', 20, 0, 0, 1620, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    466, 'Шинсун давс 1кг', 'Salt 1kg', '', NULL, 14, 12,
    '8801161294121', 15, 0, 0, 1853, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    467, 'Шинсун давс 500гр', 'Salt  500g', '', NULL, 14, 12,
    '8801161294114', 30, 0, 0, 995, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    468, 'Давс sajo 1кг', 'Salt sajo 1kg', '', NULL, 13, 12,
    '8801039703014', 14, 0, 0, 0, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    469, 'Давс sajo 1.5кг', 'Salt sajo 1.5kg', '', NULL, 13, 12,
    '8801039903520', 10, 0, 0, 3300, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    470, 'Гоймон 900гр', 'Noodle 900g', '', NULL, 13, 12,
    '8802304710027', 15, 0, 0, 2120, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    471, 'Туна 150гр', 'Tuna light 150g', '', NULL, 13, 12,
    '8801075010923', 48, 0, 0, 1690, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    472, 'Туна 250гр', 'Tuna light 250g', '', NULL, 13, 12,
    '8801075003734', 36, 0, 0, 2440, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    473, 'Туна mild 250гр', 'Tuna mild 250g', '', NULL, 13, 12,
    '8801075003932', 36, 0, 0, 2150, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    474, 'Туна mild 150гр', 'Tuna mild 150g', '', NULL, 13, 12,
    '8801075011685', 48, 0, 0, 1260, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    475, 'Салмон загас 90гр', 'Canned salmon 90g', '', NULL, 13, 12,
    '', 36, 0, 0, 1262, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    476, 'Тахианы цээж утсан 90гр', 'Smoked chicken breast 90g', '', NULL, 13, 12,
    '8801075010992', 36, 0, 0, 483, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    477, 'Туна hot pepper 150гр', 'Tuna hot pepper 150g', '', NULL, 13, 12,
    '8801075011647', 48, 0, 0, 2650, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    478, 'Хиам холимог 200гр', 'Heim mixed 200g', '', NULL, 13, 12,
    '8801039919149', 48, 0, 0, 2900, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    479, 'Хиам гахай 200гр', 'Heim pork 200g', '', NULL, 13, 12,
    '', 24, 0, 0, 0, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    480, 'Хиам нугас 200гр', 'Heim duck 200g', '', NULL, 13, 12,
    '', 24, 0, 0, 3650, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    481, 'Туна barbecue 150гр', 'Tuna barbecue 150g', '', NULL, 13, 12,
    '', 48, 0, 0, 2650, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    482, 'Бүлгоги соус 300гр', 'Bulgogi marinade 300g', '', NULL, 17, 12,
    '', 20, 0, 0, 2500, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    483, 'Халуун калби соус 300гр', 'Hot kalbi marinade 300g', '', NULL, 17, 12,
    '8801005222143', 20, 0, 0, 2500, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    484, 'Калби соус 300гр', 'Kalbi marinade 300g', '', NULL, 17, 12,
    '8801005222129', 20, 0, 0, 2500, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    485, 'Удон 200гр', 'Udon 200g', '', NULL, 18, 12,
    '8801085020301', 50, 0, 0, 571, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    486, 'Удон 225гр', 'Udon 225g', '', NULL, 18, 12,
    '8801085067733', 30, 0, 0, 976, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    487, 'Удон 220гр', 'Udon 220g', '', NULL, 18, 12,
    '8801085075349', 12, 0, 0, 1710, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    488, 'Удон 120гр', 'Udon 120g', '', NULL, 18, 12,
    '8801085067863', 24, 0, 0, 750, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    489, 'Mixpresso', 'Mixpresso', '', NULL, 19, 12,
    '8803217011652', 30, 0, 0, 4036, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    490, 'White rich', 'White rich', '', NULL, 19, 12,
    '8809130280786', 30, 0, 0, 4036, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    491, 'Pure mild', 'Pure mild', '', NULL, 19, 12,
    '8809130280793', 30, 0, 0, 4036, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    492, 'Pure mild 100ш', 'Pure mild 100ш', '', NULL, 19, 12,
    '8809130280632', 8, 0, 0, 14000, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    493, 'Mixpresso 100ш', 'Mixpresso 100ш', '', NULL, 19, 12,
    '', 8, 0, 0, 14000, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    494, 'White rich 100ш', 'White rich 100ш', '', NULL, 19, 12,
    '', 8, 0, 0, 14000, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    495, 'Американо хар', 'Americano', '', NULL, 28, 12,
    '8808024021443', 24, 0, 0, 2520, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    496, 'Лава жүрж 100мл', 'Larva orange 100ml', '', NULL, 23, 12,
    '8809111694656', 30, 0, 0, 766, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    497, 'Лава гүзээлзгэнэ 100мл', 'Larva strawberry 100ml', '', NULL, 23, 12,
    '8809111694632', 30, 0, 0, 766, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    498, 'Лава гүзээлзгэнэ 200мл', 'Larva strawberry 200ml', '', NULL, 23, 12,
    '8809111694595', 24, 0, 0, 910, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    499, 'Лава жүрж 200мл', 'Larva orange 200ml', '', NULL, 23, 12,
    '8809111694618', 24, 0, 0, 910, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    500, 'Алое вера 500мл', 'Aloe vera 500ml', '', NULL, 22, 12,
    '8809456940180', 20, 0, 0, 726, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    501, 'Алое нэрс 500мл', 'Aloe blueberry 500ml', '', NULL, 22, 12,
    '8809125063097', 20, 0, 0, 810, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    502, 'Алое гүзээлзгэнэ 500мл', 'Aloe strawberry 500ml', '', NULL, 22, 12,
    '8718274730715', 20, 0, 0, 810, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    503, 'Угаалгын нунтаг 800гр', 'Detergent 800g', '', NULL, 27, 12,
    '8801353003821', 12, 0, 0, 1090, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    504, 'Угаалгын шингэн 800мл', 'Liquid detergent 800ml', '', NULL, 27, 12,
    '8801353003524', 12, 0, 0, 700, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    505, 'Хувцас зайлагч шар 2.1л', 'Fabric refresher yellow 2.1L', '', NULL, 27, 12,
    '8801353003487', 6, 0, 0, 2370, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    506, 'Хувцас зайлагч цэнхэр 2.1л', 'Fabric refresher blue 2.1L', '', NULL, 27, 12,
    '8801353003494', 6, 0, 0, 2370, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    507, 'Хувцас зайлагч чернил ягаан 2.1л', 'Fabric refresher pink 2.1L', '', NULL, 27, 12,
    '8801353003500', 6, 0, 0, 0, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    508, 'Хувцас зайлагч ягаан 2.1л', 'Fabric refresher purple 2.1L', '', NULL, 27, 12,
    '8801353003470', 6, 0, 0, 2370, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    509, 'Хувцас зайлагч шар 1.3л', 'Fabric refresher yellow 1.3L', '', NULL, 27, 12,
    '965013037', 12, 0, 0, 1160, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    510, 'Хувцас зайлагч цэнхэр 1.3л', 'Fabric refresher blue 1.3L', '', NULL, 27, 12,
    '8801353002534', 12, 0, 0, 1160, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    511, 'Хувцас зайлагч ягаан 1.3л', 'Fabric refresher purple 1.3L', '', NULL, 27, 12,
    '8801353002527', 12, 0, 0, 1160, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    512, 'Хувцас зайлагч чернил ягаан 1.3л', 'Fabric refresher pink 1.3L', '', NULL, 27, 12,
    '8801353003463', 12, 0, 0, 1160, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    513, 'Аяга таваг угаагч 500мл', 'Aloe cleaner', '', NULL, 27, 12,
    '8801353002626', 30, 0, 0, 800, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    514, 'Нойтон салфетка 100ш', 'Wet tissue 100', '', NULL, 27, 12,
    '8806147073974', 30, 0, 0, 930, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    515, 'Secretday big 375мм', 'Secretday big 375мм', '', NULL, 29, 12,
    '8809436961709', 30, 0, 0, 1980, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    516, 'Secretday M16 245мм', 'Secretday M16 245мм', '', NULL, 29, 12,
    '8809436961105', 32, 0, 0, 1880, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    517, 'Secretday L14 280мм', 'Secretday L14 280мм', '', NULL, 29, 12,
    '8809436961204', 32, 0, 0, 1950, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    518, 'Organic Green tea 25', 'Organic Green tea 25', '', NULL, 24, 12,
    '8801767100345', 30, 0, 0, 2723, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    519, 'Organic Green tea 50', 'Organic Green tea 50', '', NULL, 24, 12,
    '8801767333705', 20, 0, 0, 4906, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    520, 'Green tea with Brown rice 25', 'Green tea with Brown rice 25', '', NULL, 24, 12,
    '8801767200021', 30, 0, 0, 2076, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    521, 'Green tea with Brown rice 50', 'Green tea with Brown rice 50', '', NULL, 24, 12,
    '8801767900167', 30, 0, 0, 3800, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    522, 'Organic Green tea Powder', 'Organic Green tea Powder', '', NULL, 24, 12,
    '8801767270048', 20, 0, 0, 6900, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    523, 'Walnut Almond Adlai drink', 'Walnut Almond Adlai drink', '', NULL, 24, 12,
    '8801767631771', 10, 0, 0, 4320, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    524, 'Jujube tea with red ginseng', 'Jujube tea with red ginseng', '', NULL, 24, 12,
    '8801767333477', 20, 0, 0, 4043, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    525, 'Peppermint herb tea', 'Peppermint herb tea', '', NULL, 24, 12,
    '8801767500145', 20, 0, 0, 1920, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    526, 'Chamomile herb tea', 'Chamomile herb tea', '', NULL, 24, 12,
    '8801767500152', 20, 0, 0, 1920, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    527, 'Rosemary herb tea', 'Rosemary herb tea', '', NULL, 24, 12,
    '8801767500220', 12, 0, 0, 1920, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    528, 'Roolbos herb tea', 'Roolbos herb tea', '', NULL, 24, 12,
    '8801767700101', 20, 0, 0, 1920, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    529, 'Organic Mate tea', 'Organic Mate tea', '', NULL, 24, 12,
    '8801767631702', 20, 0, 0, 2716, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    530, 'Organic Mate tea 40', 'Organic Mate tea 40', '', NULL, 24, 12,
    '8801767631351', 20, 0, 0, 7520, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    531, 'Roolbos&Vanilla tea with Honey', 'Roolbos&Vanilla tea with Honey', '', NULL, 24, 12,
    '8801767633195', 12, 0, 0, 0, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    532, 'Mint&Sage tea with Honey', 'Mint&Sage tea with Honey', '', NULL, 24, 12,
    '8801767633218', 12, 0, 0, 2530, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    533, 'Chamomile tea with Honey', '', '', NULL, 24, 12,
    '8801767633201', 12, 0, 0, 2530, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    534, 'Green tea latte', 'Green tea latte', '', NULL, 24, 12,
    '8801767250057', 20, 0, 0, 3803, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    535, 'Banana Latte', 'Banana Latte', '', NULL, 24, 12,
    '8801767633225', 12, 0, 0, 3853, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    536, 'Secretday XL10 360мм', 'Secretday XL10 360мм', '', NULL, 29, 12,
    '8809436961303', 24, 0, 0, 2520, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    537, 'Secretday long 180мм', 'Secretday long 180мм', '', NULL, 29, 12,
    '8809436961501', 48, 0, 0, 1260, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    538, 'Secretday basic 150мм ', 'Secretday basic 150мм ', '', NULL, 29, 12,
    '8809436961402', 48, 0, 0, 0, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    539, 'Secretday sense 145мм', 'Secretday sense 145мм', '', NULL, 29, 12,
    '8809436961600', 60, 0, 0, 840, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    540, 'Живх наадаг S 30ш', 'Superdaddy naadag S30', '', NULL, 30, 12,
    '8809436966315', 4, 0, 0, 8200, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    541, 'Живх наадаг M 26ш', 'Superdaddy naadag M26', '', NULL, 30, 12,
    '8809436966339', 4, 0, 0, 8200, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    542, 'Живх наадаг L 22ш', 'Pampers naadag L22', '', NULL, 30, 12,
    '8809436966322', 4, 0, 0, 8200, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    543, 'Живх наадаг XL 18ш', 'Superdaddy naadag XL18', '', NULL, 30, 12,
    '8809436966346', 4, 0, 0, 8200, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    544, 'Живх өмсдөг L 22ш', 'Pampers wear L22', '', NULL, 30, 12,
    '8809436966131', 4, 0, 0, 8800, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    545, 'Живх өмсдөг XL 20ш', 'Pampers wear XL20', '', NULL, 30, 12,
    '8809436966148', 4, 0, 0, 8800, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    546, 'Живх өмсдөг BIG 18ш', 'Pampers wear BIG18', '', NULL, 30, 12,
    '8809436966155', 4, 0, 0, 8800, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    547, 'Үнэр дарагч 370мл', 'Fabric refresher', '', NULL, 27, 12,
    '8801353004194', 20, 0, 0, 1120, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    548, 'Хөгц арилгагч 370мл', 'Mold remover 370ml', '', NULL, 27, 12,
    '8801353005405', 10, 0, 0, 1140, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    549, 'Цайруулагч 1л', 'Whitener 1L', '', NULL, 27, 12,
    '8801353004866', 12, 0, 0, 1160, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    550, 'Бөглөө гаргагч 1л', 'Pipe cleaner', '', NULL, 27, 12,
    '8801353004873', 12, 0, 0, 1072, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    551, '00 үнэр дарагч', 'Superchong', '', NULL, 27, 12,
    '8801353001483', 80, 0, 0, 0, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    552, 'Sando milk 161гр', 'Sando milk 161гр', '', NULL, 20, 12,
    '8801111917469', 12, 0, 0, 1630, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    553, 'Sando strawberry 161гр', 'Sando strawberry 161гр', '', NULL, 20, 12,
    '8801111917421', 12, 0, 0, 0, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    554, 'Vic pie 216гр', 'Vic pie 216гр', '', NULL, 20, 12,
    '8801111180481', 12, 0, 0, 0, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    555, 'Butter waffles 35гр', 'Butter waffles 35гр', '', NULL, 20, 12,
    '8801111914208', 24, 0, 0, 0, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    556, 'White heim 47гр', 'White heim 47гр', '', NULL, 20, 12,
    '8801111186230', 30, 0, 0, 840, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    557, 'Choco heim 47гр', 'Choco heim 47гр', '', NULL, 20, 12,
    '8801111186209', 30, 0, 0, 840, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    558, 'Coaque dasse white 72гр', 'Coaque dasse white 72гр', '', NULL, 20, 12,
    '8801111186100', 24, 0, 0, 0, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    559, 'Coaque dasse coffee 72гр', 'Coaque dasse coffee 72гр', '', NULL, 20, 12,
    '8801111186070', 24, 0, 0, 0, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    560, 'Poteau cheese 46гр', 'Poteau cheese 46гр', '', NULL, 20, 12,
    '8801111914215', 24, 0, 0, 0, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    561, 'Poteau cream 46гр', 'Poteau cream 46гр', '', NULL, 20, 12,
    '8801111914222', 24, 0, 0, 0, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    562, 'Cheese sand 60гр', 'Cheese sand 60гр', '', NULL, 20, 12,
    '8801111614382', 24, 0, 0, 0, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    563, 'Peanut sand 70гр', 'Peanut sand 70гр', '', NULL, 20, 12,
    '8801111614344', 24, 0, 0, 725, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    564, 'Choco sand 70гр', 'Choco sand 70гр', '', NULL, 20, 12,
    '8801111614375', 24, 0, 0, 725, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    565, 'Zoo Zoo 70гр', 'Zoo Zoo 70гр', '', NULL, 20, 12,
    '8801111915946', 24, 0, 0, 0, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    566, 'Grace 85гр', 'Grace 85гр', '', NULL, 20, 12,
    '8801111183253', 24, 0, 0, 990, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    567, 'Potaeau cheese 161гр', 'Potaeau cheese 161гр', '', NULL, 20, 12,
    '8801111614139', 12, 0, 0, 1440, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    568, 'Potaeau cream 161гр', 'Potaeau cream 161гр', '', NULL, 20, 12,
    '8801111614139', 12, 0, 0, 1440, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    569, 'Тахианы цээж оригинал 90гр', 'Original chicken breast 90g', '', NULL, 13, 12,
    '8801075010985', 36, 0, 0, 0, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    570, 'Хар цуу 1.6л', 'Soy sauce 1.6L', '', NULL, 14, 12,
    '', 8, 0, 0, 6400, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    571, 'Гим 20гр', 'Gim 20g', '', NULL, 13, 12,
    '', 36, 0, 0, 1000, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    572, 'Кимбаб гим омони 20гр', 'Kimbab gim 20g', '', NULL, 13, 12,
    '', 50, 0, 0, 2150, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    575, 'Дэнжан 14кг', 'Denjang 14kg', '', 0, 13, 12,
    '8801075013030', 1, 0, 0, 32000, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    576, 'Хиам холимог 340гр', 'Heim mixed 340g', '', 0, 13, 12,
    '8801039919873', 24, 0, 0, 5000, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    577, 'Ургамлын тос 1.5л', 'Soybean oil 1.5L', '', 0, 13, 12,
    '8801039202388', 8, 0, 0, 1000, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    579, 'Шөлний цуу 1.8л', 'Soup soy sauce 1.8L', '', 0, 13, 12,
    '8801039002605', 8, 0, 0, 1000, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    581, 'Гүнжидийн тос sajo 500мл', 'Sesame oil sajo 500ml', '', 0, 13, 12,
    '8801039917978', 12, 0, 0, 1000, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    582, 'Оливын тос 900мл', 'Olive oil 900ml', '', 0, 13, 12,
    '8801039203910', 12, 0, 0, 1000, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    583, 'Миёог урт 45гр', 'Seaweed long 45g', '', 0, 13, 12,
    '8801039700013', 40, 0, 0, 2800, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    584, 'Самгетан 1кг', 'Samgetang 1kg', '', NULL, 25, 12,
    '8809409590066', 12, 0, 0, 0, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    585, 'Гамжатан 800гр', 'Gamjatang 800g', '', NULL, 25, 12,
    '8809409590103', 12, 0, 0, 0, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    586, 'Тагбугимтан 800гр', 'Dagbugimtang 800g', '', NULL, 25, 12,
    '8809409590110', 12, 0, 0, 0, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    587, 'Gaya алим 1.5л', 'Gaya apple 1.5L', '', 0, 21, 12,
    '8801861220604', 12, 0, 0, 4500, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    588, 'Gaya тоор 1.5л', 'Gaya peach 1.5L', '', 0, 21, 12,
    '8801861150062', 12, 0, 0, 4500, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    589, 'Gaya лийр 1.5л', 'Gaya pear 1.5L', '', 0, 21, 12,
    '8801861260563', 12, 0, 0, 4500, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    590, 'Gaya томато 1.5л', 'Gaya tomato 1.5L', '', 0, 21, 12,
    '8801861130439', 12, 0, 0, 4500, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    591, 'Gaya алое 1.5л', 'Gaya aloe 1.5L', '', 0, 21, 12,
    '8801861150567', 12, 0, 0, 4500, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    592, 'Gaya лууван 1.5л', 'Gaya carrot 1.5L', '', 0, 21, 12,
    '8801861130118', 12, 0, 0, 4500, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    593, 'Gaya мандарин 1.5л', 'Gaya tangerine 1.5L', '', 0, 21, 12,
    '8801861260075', 12, 0, 0, 4500, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    594, 'Дэнжан 170гр', 'Denjang 170g', '', 0, 13, 12,
    '8801075010053', 24, 0, 0, 4500, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    595, 'Дэнжан 500гр', 'Denjang 500g', '', 0, 13, 12,
    '8801075010060', 20, 0, 0, 4500, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    596, 'Гим 40гр', 'Gim 40g', '', 0, 13, 12,
    '', 20, 0, 0, 2000, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    600, 'Жижиг гим 15гр', 'Gim third 15g ', '', 0, 16, 12,
    '8804305123059', 24, 0, 0, 1000, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    601, 'Barley tea', 'Barley tea', '', 0, 24, 12,
    '8801005633444', 30, 0, 0, 1000, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    602, 'Сахаргүй чихэр', 'No sugar candy', '', 0, 20, 12,
    '', 20, 0, 0, 1000, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    603, 'Самгетан 1кг кодгүй', 'Samgetang 1kg no code', '', 0, 25, 12,
    '', 12, 0, 0, 13300, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    605, 'Тагбугимтан 800гр кодгүй', 'Dagbugimtang 800g no code', '', 0, 13, 12,
    '', 12, 0, 0, 13300, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    606, 'Гамжатан 800гр кодгүй', 'Gamjatang no code', '', 0, 25, 12,
    '', 12, 0, 0, 13300, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    607, 'Хүүхдийн угаалгын шингэн 1.3л', 'Baby liquid detergent 1.3L', '', 0, 27, 12,
    '', 12, 0, 0, 1000, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    608, '1 Кофены аяга', 'Coffee cup', '', 0, 26, 12,
    '8809069390280', 1, 0, 0, 43, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    609, '2 Хоолны аяга', 'Cup', '', 0, 26, 12,
    '8809069390273', 2, 0, 0, 111, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    610, '3 Хоолны цүнх', 'Bag', '', 0, 26, 12,
    '4573339121006', 1, 0, 0, 110, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    611, '4 Хүүхдийн угж', 'baby bag', '', 0, 26, 12,
    '8809063990808', 1, 0, 0, 54, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    612, '5 Халаагч сет 911', 'Set 911', '', 0, 26, 12,
    '8809069390419', 1, 0, 0, 355, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    613, '6 Халаагч 50гр', 'heater 50g', '', 0, 26, 12,
    '8809069390334', 12, 0, 0, 472, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    614, '7 Халаагч 20гр', 'Heater 20g', '', 0, 26, 12,
    '8809069390303', 1, 0, 0, 114, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    615, '8 Халаагч 10гр', 'heater 10g', '', 0, 26, 12,
    '8809069390389', 1, 0, 0, 117, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    616, 'Кофе машин ', 'Coffee machine', '', 0, 28, 12,
    '8809411090806', 2, 0, 0, 12, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    617, 'Кофе Лаус (хайрц', NULL, NULL, 0, NULL, 12,
    NULL, NULL, 0, 0, NULL, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    box, NULL, NULL, NULL, NULL, NULL, 12,
    NULL, NULL, 0, 0, NULL, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    618, 'Кофе Кени (хайрц', NULL, NULL, 0, NULL, 12,
    NULL, NULL, 0, 0, NULL, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    box, NULL, NULL, NULL, NULL, NULL, 12,
    NULL, NULL, 0, 0, NULL, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    619, 'Кофе Ethiopia (хайрц', NULL, NULL, 0, NULL, 12,
    NULL, NULL, 0, 0, NULL, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    box, NULL, NULL, NULL, NULL, NULL, 12,
    NULL, NULL, 0, 0, NULL, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    620, 'Кофе Indone sia (хайрц', NULL, NULL, 0, NULL, 12,
    NULL, NULL, 0, 0, NULL, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    box, NULL, NULL, NULL, NULL, NULL, 12,
    NULL, NULL, 0, 0, NULL, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    621, 'Кофе Лаус (ууттай', NULL, NULL, 0, NULL, 12,
    NULL, NULL, 0, 0, NULL, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    bag, NULL, NULL, NULL, NULL, NULL, 12,
    NULL, NULL, 0, 0, NULL, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    622, 'Кофе Кени (ууттай', NULL, NULL, 0, NULL, 12,
    NULL, NULL, 0, 0, NULL, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    bag, NULL, NULL, NULL, NULL, NULL, 12,
    NULL, NULL, 0, 0, NULL, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    623, 'Кофе Ethiopia (ууттай', NULL, NULL, 0, NULL, 12,
    NULL, NULL, 0, 0, NULL, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    bag, NULL, NULL, NULL, NULL, NULL, 12,
    NULL, NULL, 0, 0, NULL, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    624, 'Кофе Indone sia (ууттай', NULL, NULL, 0, NULL, 12,
    NULL, NULL, 0, 0, NULL, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    bag, NULL, NULL, NULL, NULL, NULL, 12,
    NULL, NULL, 0, 0, NULL, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    625, 'Дашидо жинкүүк 1кг', 'Dashida Jinqook 1kg', '', 0, 31, 12,
    '8801052742274', 10, 0, 0, 1000, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    626, 'Жижиг гим олив 3ш', 'Gim third oliv 3sh', '', 0, 16, 12,
    '8809275101489', 24, 0, 0, 1000, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    627, 'Давс сажо 500гр', 'Salt sajo 500g', '', 0, 13, 12,
    '8801039703021', 30, 0, 0, 1000, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    628, 'Дашида чонжонвон 1кг', 'Dashida chonjonwon 1kg', '', 0, 31, 12,
    '', 10, 0, 0, 9500, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    629, 'Мивон 1кг', 'Miwon 1kg', '', 0, 31, 12,
    '8801052001418', 20, 0, 0, 9900, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    630, 'Бүлгоги соус 280гр', 'Bulgogi sauce  280g', '', 0, 31, 12,
    '8801052730653', 20, 0, 0, 2600, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    631, 'Гахайн соус 280гр', 'Pork sauce 280g', '', 0, 31, 12,
    '8801052730684', 20, 0, 0, 2600, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    632, 'Тахианы соус 270гр', 'Chicken sauce 270g', '', 0, 31, 12,
    '8801052752631', 20, 0, 0, 2600, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    633, 'Тахианы соус 480гр', 'Chicken sauce 480g', '', 0, 31, 12,
    '8801052012513', 15, 0, 0, 1000, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    634, 'Гахайн соус 500гр', 'Pork sauce 500g', '', 0, 31, 12,
    '8801052012469', 15, 0, 0, 1000, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    635, 'Бүлгоги соус 500гр', 'Bulgogi sauce  500g', '', 0, 31, 12,
    '8801052012452', 15, 0, 0, 1000, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    636, 'Бүлгоги соус 2кг', 'Bulgogi sauce 2kg', '', 0, 31, 12,
    '8801052733548', 8, 0, 0, 1000, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    637, 'Гахайн соус 2кг', 'Pork sauce 2kg', '', 0, 31, 12,
    '8801052135731', 8, 0, 0, 1000, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    638, 'Мока голд 20ш', 'Mocha gold 20T', '', 0, 19, 12,
    '8809518270484', 30, 0, 0, 1000, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    639, 'Мока голд 100ш', 'Mocha gold 100T', '', 0, 19, 12,
    '8809518270460', 8, 0, 0, 1000, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    640, 'Gaya усан үзэм 1.5л', 'Gaya grape 1.5L', '', 0, 21, 12,
    '8801861140063', 12, 0, 0, 1000, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    641, 'Гучужан sajo 1кг', 'Gochujang sajo 1kg', '', 0, 13, 12,
    '8801075012620', 8, 0, 0, 1140, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    642, 'Туна mild 210гр', 'Tuna mild 210g', '', 0, 13, 12,
    '8801075015409', 36, 0, 0, 2150, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    643, 'Хар цуу 1.8л', 'Soy sauce 1.8L', '', 0, 13, 12,
    '8801039751060', 8, 0, 0, 1000, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    644, 'Гоймон 300гр', 'Noodle 300g', '', 0, 13, 12,
    '8801039923382', 40, 0, 0, 2120, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    645, 'Цагаан латте 20ш', 'White latte 20T', '', NULL, 19, 12,
    '8801353003478', 30, 0, 0, 1000, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    646, 'Цагаан латте 100ш', 'White latte 100T', '', NULL, 19, 12,
    '8801353003470', 8, 0, 0, 1000, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    647, 'Рамен үхэр 120гр', 'Ramen Beef 120g', '', 0, 32, 12,
    '8801045520084', 30, 0, 0, 1050, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    648, 'Рамен кимчи 120гр', 'Ramen kimchi 120g', '', 0, 32, 12,
    '8801045521312', 32, 0, 0, 1250, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    649, 'Рамен жин 120гр', 'Ramen Jin 120g', '', 0, 32, 12,
    '8801045999906', 40, 0, 0, 1300, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    650, 'Бүлгоги соус 840гр', 'Bulgogi sauce  840g', '', 0, 31, 12,
    '8801052993331', 12, 0, 0, 1000, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    651, 'Гахайн соус 840гр', 'Pork sauce 840g', '', 0, 31, 12,
    '8801052993348', 12, 0, 0, 1000, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    652, 'Миёог 40гр', 'Seaweed 40g', '', 0, 31, 12,
    '', 50, 0, 0, 1540, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    653, 'Хар цуу жин 200мл', 'Soy sauce jin 200ml ', '', 0, 31, 12,
    '', 40, 0, 0, 1000, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    654, 'Хар цуу жин 500мл', 'Soy sauce jin 500ml ', '', 0, 31, 12,
    '', 24, 0, 0, 1000, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    655, 'Давс 100гр', 'Salt 100g', '', 0, 31, 12,
    '', 200, 0, 0, 1000, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    656, 'Кимчи ус 500гр', 'Anchovy sauce 500g', '', 0, 31, 12,
    '', 24, 0, 0, 1000, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    657, 'Хар перц 50гр', 'Black pepper powder 50g', '', 0, 31, 12,
    '', 24, 0, 0, 1000, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    658, 'Миёог 25гр', 'Seaweed 25g', '', 0, 31, 12,
    '', 40, 0, 0, 1540, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    659, 'Бүрэгч гурил 1кг', 'FRYING BATTER MIX 1kg', '', 0, 31, 12,
    '', 10, 0, 0, 1540, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    660, 'Гим олив 23гр', 'Gim oliv 23g', '', 0, 16, 12,
    '8809275103698', 36, 0, 0, 1066, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    661, 'Maxwell оригнал 100ш', 'Maxwell original', '', 0, 33, 12,
    '8801037035643', 8, 0, 0, 1000, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    662, 'Maxwell оригнал лаазтай 200мл', 'Maxwell original can 200ml', '', 0, 33, 12,
    '8801037002157', 30, 0, 0, 1000, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    663, 'Maxwell mild лаазтай 200мл', 'Maxwell mild can 200ml', '', 0, 33, 12,
    '8801037007688', 30, 0, 0, 1000, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    664, 'Бүрэгч гурил 500гр', 'FRYING MIX 500g', '', 0, 13, 12,
    '8801039937587', 20, 0, 0, 1540, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    665, 'Hot pepper тос 1.8л', 'Hot pepper oil 1.8L', '', 0, 13, 12,
    '8801039203934', 8, 0, 0, 1260, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    666, 'Capsacin соус 550гр', 'Capsacin sauce 550g', '', 0, 13, 12,
    '8801039921548', 16, 0, 0, 2120, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    667, 'Oyster соус 2кг', 'Oyster sauce 2kg', '', 0, 13, 12,
    '8801039921340', 8, 0, 0, 2120, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    668, 'Honey mustard соус 2кг', 'Honey mustard соус 2kg', '', 0, 13, 12,
    '8801039921364', 6, 0, 0, 2120, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    669, 'Удон соус 2кг', 'Udong sauce 2kg', '', 0, 13, 12,
    '8801039929537', 8, 0, 0, 2120, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    670, 'Sweet Chili соус 2кг', 'Sweet Chili sauce 2kg', '', 0, 13, 12,
    '8801039929544', 6, 0, 0, 2120, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    671, 'Тэрияаки соус 2кг', 'Teriyaki sauce 2kg', '', 0, 13, 12,
    '8801039929551', 6, 0, 0, 2120, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    672, 'Догбуги соус 150гр', 'Hot Topokki sauce', '', 0, 13, 12,
    '8801039927212', 30, 0, 0, 2120, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    673, 'Шарвин гурил 1кг', 'Korean Pancake Mix 1kg', '', 0, 31, 12,
    '8801052017952', 10, 0, 0, 1540, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    674, 'Дунгас соус 250гр', 'Pork Cutlet sauce', '', 0, 31, 12,
    '8801052733111', 12, 0, 0, 1540, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    675, 'Honey mustard соус 320гр', 'Honey Mustard sauce 320g', '', 0, 31, 12,
    '8801052728339', 12, 0, 0, 1540, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    676, 'Стэйк соус 3.3кг', 'Steak sauce 3.3кг', '', 0, 31, 12,
    '8801052402611', 6, 0, 0, 1540, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    677, 'Томато кетчуп 3.3кг', 'Tomato Ketchup 3.3кг', '', 0, 31, 12,
    '8801052401607', 6, 0, 0, 1540, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    678, 'Мөөгтэй зутан 1кг', 'Mushroop soup 1kg', '', 0, 31, 12,
    '8801052401294', 10, 0, 0, 1540, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    679, 'Кремтэй зутан 1кг', 'Cream soup 1kg', '', 0, 31, 12,
    '8801052403458', 10, 0, 0, 1540, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    680, 'Ганари 500гр', 'Sandlance extract 500g', '', 0, 31, 12,
    '8801052773162', 24, 0, 0, 1540, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    681, 'Гахайн соус 10кг', 'Pork sauce 10kg', '', 0, 31, 12,
    '8801052135700', 1, 0, 0, 1000, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    682, 'Калби соус 10кг', 'Beef Kalbi sauce 10kg', '', 0, 31, 12,
    '8801052135595', 1, 0, 0, 1000, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    683, 'Бүлгоги соус 10кг', 'Bulgogi sauce 10kg', '', 0, 31, 12,
    '8801052733555', 1, 0, 0, 1000, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    684, 'Алое оригнал 240мл', 'Aloe original 240ml', '', 0, 34, 12,
    '', 30, 0, 0, 950, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    685, 'Алое манго 240мл', 'Aloe mango 240ml', '', 0, 34, 12,
    '', 30, 0, 0, 950, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    686, 'Алое анар 240мл', 'Aloe pomegranate 240ml', '', 0, 34, 12,
    '', 30, 0, 0, 950, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    687, 'Гучужан sajo 3кг', 'Gochujang sajo 3kg', '', 0, 13, 12,
    '8801075010961', 4, 0, 0, 1140, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    688, 'Чихрийн уусмал 8кг', 'Corn syrup 8kg', '', 0, 13, 12,
    '8801039938164', 1, 0, 0, 1893, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    689, 'Дунгас соус 2кг', 'Tonkatsu sauce 2kg', '', 0, 13, 12,
    '', 8, 0, 0, 1540, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    690, 'Гахайн соус sajo 2.2кг', 'Pork sauce sajo 2.2kg', '', 0, 13, 12,
    '8801039934388', 8, 0, 0, 2120, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    691, 'Гахайн соус sajo 10кг', 'Pork sauce sajo 10kg', '', 0, 13, 12,
    '8801039934425', 1, 0, 0, 2120, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    692, 'Бүлгоги соус sajo 2.2кг', 'Bulgogi sauce sajo 2.2kg', '', 0, 13, 12,
    '8801039934371', 8, 0, 0, 2600, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    693, 'Бүлгоги соус sajo 10кг', 'Bulgogi sauce sajo 10kg', '', 0, 13, 12,
    '8801039934418', 1, 0, 0, 2600, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    694, 'Калби соус sajo 10кг', 'Kalbi sauce sajo 10kg', '', 0, 13, 12,
    '8801039934432', 1, 0, 0, 2600, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    695, 'Шарвин гурил sajo 1кг', 'Pancake Mix 1kg', '', 0, 13, 12,
    '8801039937617', 10, 0, 0, 1540, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    696, 'Алимны цуу 900мл', 'Apple vinegar 900ml', '', 0, 14, 12,
    '8801161293070', 15, 0, 0, 1228, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    697, 'Honey Citron tea 1kg', 'Honey Citron tea 1kg', '', 0, 24, 12,
    '8801767334191', 12, 0, 0, 3853, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    698, 'Honey Lemon tea 1kg', 'Honey Lemon tea 1kg', '', 0, 24, 12,
    '8801767334382', 12, 0, 0, 3853, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    699, 'Миёог 100гр', 'Seaweed 100g', '', 0, 13, 12,
    '8801039700006', 30, 0, 0, 2340, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    701, 'Бүрэгч гурил sajo 1кг', 'FRYING BATTER MIX 1kg', '', 0, 13, 12,
    '8801039937594', 10, 0, 0, 1540, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    702, 'Гүнжидийн үр 120гр', 'Sesame seed 120g', '', 0, 13, 12,
    '8801039904183', 20, 0, 0, 5600, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    703, 'Гахайн соус sajo 280гр', 'Pork sauce sajo 280g', '', 0, 13, 12,
    '8801039938430', 16, 0, 0, 2120, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    704, 'Гахайн соус sajo 500гр', 'Pork sauce sajo 500g', '', 0, 13, 12,
    '8801039938485', 12, 0, 0, 2120, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    705, 'Бүлгоги соус sajo 280гр', 'Bulgogi sauce sajo 280g', '', 0, 13, 12,
    '8801039938447', 16, 0, 0, 2600, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    706, 'Бүлгоги соус sajo 500гр', 'Bulgogi sauce sajo 500g', '', 0, 13, 12,
    '8801039938492', 12, 0, 0, 2600, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    707, 'Калби соус sajo 2.2кг', 'Kalbi sauce sajo 2.2kg', '', 0, 13, 12,
    '8801039934395', 8, 0, 0, 2600, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    708, 'Хүйтэн гоймон шөлтэй 341гр', 'Mul naeng myeon 341g', '', 0, 18, 12,
    '', 10, 0, 0, 571, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    709, 'Хүйтэн гоймон халуун ногоотой 140гр', 'Bibim naeng myeon 140g', '', 0, 18, 12,
    '', 10, 0, 0, 571, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    710, 'Хүйтэн гоймон япон 300гр ', 'Chal momil soba 300g', '', 0, 18, 12,
    '', 10, 0, 0, 571, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    711, 'Мока кафе mild 100ш', 'Mocha cafe mild 100T', '', 0, 19, 12,
    '', 10, 0, 0, 1000, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    712, 'Сахар нэг удаагийн', 'Stick Sugar', '', 0, 37, 12,
    '8801199032085', 10, 0, 0, 1000, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    713, 'Кимбаб гим 100ш', 'Kimbab gim 100', '', 0, 39, 12,
    '8809387441053', 40, 0, 0, 1395, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    714, 'Туна 250гр 36ш', 'Tuna light 250g', '', 0, 13, 12,
    '8801075003734', 36, 0, 0, 2440, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    715, 'Гучужан sajo 2кг', 'Gochujang sajo 2kg', '', 0, 13, 12,
    '8801075011463', 6, 0, 0, 1140, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    716, 'Бүлгоги соус sajo 840гр', 'Bulgogi sauce sajo 840g', '', 0, 13, 12,
    '', 12, 0, 0, 2600, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    717, 'Калби соус sajo 840гр', 'Kalbi sauce sajo 840g', '', 0, 13, 12,
    '8801039934357', 12, 0, 0, 2600, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    718, 'Гунчи загас 400гр', 'Mackerel pike 400g', '', 0, 13, 12,
    '8801075000047', 24, 0, 0, 2120, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    719, 'Усан үзмийн тос 250мл', 'Grape seed oil 250ml', '', 0, 13, 12,
    '8801039207697', 30, 0, 0, 687, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    720, 'Усан үзмийн тос 500мл', 'Grape seed oil 500ml', '', 0, 13, 12,
    '8801039203293', 20, 0, 0, 687, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    721, 'Гахайн соус sajo 840гр', 'Pork sauce sajo 840g', '', 0, 13, 12,
    '', 12, 0, 0, 2120, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    722, 'Шар манжин 400гр', 'Shar manjin 400g', '', 0, 36, 12,
    '8809053270062', 18, 0, 0, 571, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    723, 'Туна 100гр', 'Tuna light 100g', '', 0, 13, 12,
    '8801075011630', 48, 0, 0, 1690, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    724, 'Туна 1.88кг', 'Tuna light 1.88kg', '', 0, 13, 12,
    '8801075000108', 6, 0, 0, 1690, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    725, 'Хар цуу 1л', 'Soy sauce 1L', '', 0, 13, 12,
    '', 15, 0, 0, 1000, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    726, 'Туна 150гр 24ш', 'Tuna light 150g', '', 0, 13, 12,
    '8801075011722', 24, 0, 0, 1690, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    727, 'Гудено загас 400гр', 'Mackerel 400g', '', 0, 13, 12,
    '8801075001327', 24, 0, 0, 2120, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    728, 'Дашида saehan 1кг', 'Saehan dashi 1kg', '', 0, 40, 12,
    '8809102251011', 10, 0, 0, 1000, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    729, 'Дашида saehan 100гр', 'Saehan dashi 100g', '', 0, 40, 12,
    '8809102250700', 50, 0, 0, 1000, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    730, 'Сахар бор 1кг', 'Brown Sugar 1kg', '', 0, 37, 12,
    '8801199022024', 20, 0, 0, 1000, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    731, 'Сахар хар бор 1кг', 'Dark brown sugar 1kg', '', 0, 37, 12,
    '8801199032016', 20, 0, 0, 1000, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    732, 'Кимчи 300гр', 'Kimchi 300g', '', 0, 18, 12,
    '', 10, 0, 0, 571, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    733, 'Гүнжидийн тос sajo 320мл', 'Sesame oil 320ml', '', 0, 13, 12,
    '8801039919699', 12, 0, 0, 2320, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    734, 'Beef jerky original 30g', 'Beef jerky original 30g', '', 0, 13, 12,
    '', 30, 0, 0, 2120, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    735, 'Beef jerky barbecue 30g', 'Beef jerky barbecue 30g', '', 0, 13, 12,
    '', 30, 0, 0, 2120, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    736, 'Шар манжин хэрчсэн 220гр', 'YELLOW SLICED PICKLED RADISH', '', 0, 36, 12,
    '8809053272875', 16, 0, 0, 571, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    737, 'Бүлгоги соус CJ 290гр', 'BULGOGI MARINADE 290g', '', 0, 35, 12,
    '8801007176321', 20, 0, 0, 2600, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    738, 'Бүлгоги соус CJ 500гр', 'BULGOGI MARINADE 500g', '', 0, 35, 12,
    '8801007176369', 12, 0, 0, 2600, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    739, 'Гахайн соус CJ 290гр', 'KOREAN BBQ SAUCE - SPICY BULGOGI MARINADE 290g', '', 0, 35, 12,
    '8801007176338', 20, 0, 0, 2600, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    740, 'Гахайн соус CJ 500гр', 'KOREAN BBQ SAUCE - SPICY BULGOGI MARINADE 500g', '', 0, 35, 12,
    '8801007176376', 12, 0, 0, 2600, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    741, 'Цуун ундаа анар 900мл', 'Vinegar Drink, Pomegranate', '', 0, 17, 12,
    '8801005213042', 8, 0, 0, 1181, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    742, 'Цуун ундаа бөөрөлзгөнө 900мл', 'Vinegar Drink, Rubus & Wild Grape', '', 0, 17, 12,
    '8801005212045', 8, 0, 0, 1181, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    743, 'Цуун ундаа нэрс 900мл', 'Vinegar Drink, Blackberry & Blueberry', '', 0, 17, 12,
    '8801005213073', 8, 0, 0, 1181, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    744, 'Туна mild 200гр', 'Tuna mild 200g', '', 0, 13, 12,
    '8801075015409', 36, 0, 0, 2150, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    745, 'Рамен jin hot 120гр', 'JIN RAMEN HOT 120g', '', 0, 32, 12,
    '8801045999913', 40, 0, 0, 1300, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    746, 'Шар манжин кимбаб 3кг', 'Pickled radsih kimbab', '', 0, 36, 12,
    '', 4, 0, 0, 571, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    747, 'Шар манжин хэрчсэн 3кг', 'Pickled radsih moon', '', 0, 36, 12,
    '', 4, 0, 0, 571, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    748, 'Шар манжин жижиг 220гр', 'chewy pickled radish', '', 0, 36, 12,
    '', 20, 0, 0, 571, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    749, 'Жажан соус 200гр', 'Chunjang 200g', '', 0, 14, 12,
    '8801161251704', 28, 0, 0, 1223, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    750, 'Сахар хар бор', 'Dark brown sugar 1kg', '', 0, 37, 12,
    '8801199032016', 20, 0, 0, 1000, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    751, 'Удон sempio 200гр', 'Udon 200g', '', 0, 34, 12,
    '8801068360226', 30, 0, 0, 571, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    752, 'Удон samlip 200гр', 'Udon 200g', '', 0, 34, 12,
    '8801068360226', 30, 0, 0, 571, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    753, 'Honey Jujube tea 1kg', 'Honey Jujube tea 1kg', '', 0, 24, 12,
    '8801767921704', 12, 0, 0, 3853, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    754, 'Honey Pomegranate tea 1kg', 'Honey Pomegranate tea 1kg', '', 0, 24, 12,
    '8801767922145', 12, 0, 0, 3853, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    755, 'Soy milk цагаан 190мл', 'Soy milk white 190ml', '', 0, 38, 12,
    '8806124203875', 16, 0, 0, 2120, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    756, 'Soy milk бор 190мл', 'Soy milk brown 190ml', '', 0, 38, 12,
    '8806124202854', 16, 0, 0, 2120, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    757, 'Soy milk хар 190мл', 'Soy milk black 190ml', '', 0, 38, 12,
    '8806124201192', 16, 0, 0, 2120, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    758, 'Догбуги оригнал 120гр', 'Tteokpokki original 120g', '', 0, 39, 12,
    '8809490520706', 30, 0, 0, 2120, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    759, 'Догбуги жажан 120гр', 'Tteokpokki Jjajang 120g', '', 0, 39, 12,
    '8809490520720', 30, 0, 0, 2120, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    760, 'Догбуги цагаан 120гр', 'Tteokpokki carbonara 120g', '', 0, 39, 12,
    '8809490520317', 30, 0, 0, 2120, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    761, 'Догбуги булдак 120гр', 'Tteokpokki buldak 120g', '', 0, 39, 12,
    '8809490520751', 30, 0, 0, 2120, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    762, 'Рамен jin spicy 120гр', 'JIN RAMEN HOT 120g', '', 0, 32, 12,
    '8801045999913', 40, 0, 0, 1300, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    763, 'Рамен jin mild 120гр', 'Ramen Jin 120g', '', 0, 32, 12,
    '8801045520117', 40, 0, 0, 1300, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    764, 'Удэн оригнал 121гр', 'Fish cake soup original', '', 0, 39, 12,
    '8809490520768', 16, 0, 0, 1260, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    765, 'Удэн халуун 124гр', 'Fish cake soup hot', '', 0, 39, 12,
    '8809490520775', 16, 0, 0, 1260, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    766, 'Шар манжин бүхэл 550гр', 'Whole pickled radsih', '', 0, 36, 12,
    '8809053270055', 15, 0, 0, 571, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    767, 'Чикен соус 2кг', 'Hot Chicken Sauce', '', 0, 13, 12,
    '', 8, 0, 0, 2120, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    768, 'Ганари 2.5кг', 'Sand Lance Sauce', '', 0, 13, 12,
    '8801039002827', 6, 0, 0, 2120, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    769, 'Жижиг гим sajo 16ш', 'Olive Oil-Roasted Laver 4g', '', 0, 13, 12,
    '', 8, 0, 0, 2850, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    770, 'Нунтаг гим 40гр+40гр', 'Gim powder 40g+40g', '', 0, 13, 12,
    '8801039001967', 12, 0, 0, 2225, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    771, 'Cane сахар 1кг', 'Natural cane sugar', '', 0, 37, 12,
    '8809538470024', 16, 0, 0, 1000, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    772, 'Honey Ginger tea 1kg', 'Honey Ginger tea 1kg', '', 0, 24, 12,
    '8801767335235', 12, 0, 0, 3853, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    773, 'Сардин загас 300гр', 'Fresh Sardine 300g', '', 0, 13, 12,
    '', 24, 0, 0, 1690, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    774, 'Дашида алчан 1кг', 'Monggo alchan dashi 1kg', '', 0, 15, 12,
    '8801301959989', 10, 0, 0, 4686, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    775, 'Ургамлын тос 1.8л', 'Soybean oil 1.8L', '', 0, 13, 12,
    '8801039202371', 12, 0, 0, 1000, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    776, 'Туна plus 150гр', 'Tuna plus 150g', '', 0, 13, 12,
    '8801075011722', 48, 0, 0, 1260, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    777, 'Туна vegetable 150гр', 'Tuna vegetable 150g', '', 0, 13, 12,
    '8801075012347', 48, 0, 0, 1260, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    778, 'Усан үзмийн тос 900мл', 'Grape seed oil 900ml', '', 0, 13, 12,
    '8801039203927', 12, 0, 0, 687, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    779, 'Гудено загас 300гр', 'Mackerel 300g', '', 0, 13, 12,
    '8801075001327', 24, 0, 0, 2120, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    780, 'Гунчи загас 300гр', 'Mackerel pike 300g', '', 0, 13, 12,
    '8801075000047', 24, 0, 0, 2120, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    781, 'Corn oil 900ml', 'Corn oil 900ml', '', 0, 13, 12,
    '8801039202531', 20, 0, 0, 2120, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    782, 'Canola Oil 500ml', 'Canola Oil 500ml', '', 0, 13, 12,
    '8801039203835', 20, 0, 0, 2120, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    783, 'Canola Oil 900ml', 'Canola Oil 900ml', '', 0, 13, 12,
    '8801039204276', 12, 0, 0, 2120, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    784, 'Sunflower Oil 500ml', 'Sunflower Oil 500ml', '', 0, 13, 12,
    '8801039204351', 20, 0, 0, 2120, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    785, 'Sunflower Oil 900ml', 'Sunflower Oil 900ml', '', 0, 13, 12,
    '8801039207406', 12, 0, 0, 2120, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    786, 'Perilla Oil 160ml', 'Perilla Oil 160ml', '', 0, 13, 12,
    '8801039907344', 20, 0, 0, 2120, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    787, 'Walnut Almond Adlai drink 50T', 'Walnut Almond Adlai drink 50T', '', 0, 24, 12,
    '8801767631795', 6, 0, 0, 4320, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    788, 'Honey Citron tea 480g', 'Honey Citron tea 480g', '', 0, 24, 12,
    '8801767106996', 12, 0, 0, 3853, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    789, 'Honey Lemon tea 480g', 'Honey Lemon tea 480g', '', 0, 24, 12,
    '8801767922336', 12, 0, 0, 3853, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    790, 'Honey Grapefruit tea 480g', 'Honey Grapefruit tea 480g', '', 0, 24, 12,
    '8801767336447', 12, 0, 0, 3853, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    791, 'Honey Ginger tea 480g', 'Honey Ginger tea 480g', '', 0, 24, 12,
    '8801767106934', 12, 0, 0, 3853, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    792, 'Honey jujube tea 480g', 'Honey jujube tea 480g', '', 0, 24, 12,
    '8801767921308', 12, 0, 0, 3853, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    793, 'Honey Pomegranate tea 480g', 'Honey pomegranate tea 480g', '', 0, 24, 12,
    '8801767922138', 12, 0, 0, 3853, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    794, 'Honey Quince tea 480g', 'Honey Quince tea 480g', '', 0, 24, 12,
    '8801767922121', 12, 0, 0, 3853, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    795, 'Balloonflower root & pear tea 550g', 'Balloonflower root & pear tea 550g', '', 0, 24, 12,
    '8801767337505', 12, 0, 0, 3853, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    796, 'Honey Grapefruit tea 1kg', 'Honey Grapefruit tea 1kg', '', 0, 24, 12,
    '8801767334511', 12, 0, 0, 3853, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    797, 'Honey Quince tea 1kg', 'Honey Quince tea 1kg', '', 0, 24, 12,
    '8801767103070', 12, 0, 0, 3853, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    798, 'Галби соус sajo 2.2кг', 'Galbi sauce 2.2kg', '', 0, 13, 12,
    '8801039934395', 8, 0, 0, 2600, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    799, 'Ясны шөл шингэн 1кг', 'Bone soup 1kg', '', 0, 40, 12,
    '8809102250830', 10, 0, 0, 1000, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    800, 'Ясны шөл нунтаг 500гр', 'Bone soup powder 500g', '', 0, 40, 12,
    '8809102254012', 10, 0, 0, 1000, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    801, 'Мах зөөлрүүлэгч 1кг', 'soft meat diet 1kg', '', 0, 40, 12,
    '', 10, 0, 0, 1000, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    802, 'Догбуги соус 50гр', 'dogbugi sauce 50g', '', 0, 40, 12,
    '8809102250175', 100, 0, 0, 1000, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    803, 'Туна chili 100гр', 'Tuna chili 100g', '', 0, 13, 12,
    '8801075016970', 48, 0, 0, 1690, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    804, 'Туна black bean 100гр', 'Tuna black bean', '', 0, 13, 12,
    '8801075016987', 48, 0, 0, 1690, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    805, 'Туна tomato 100гр', 'Tuna tomato 100g', '', 0, 13, 12,
    '8801075016994', 48, 0, 0, 1690, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    806, 'Туна soy sauce 100гр', 'Tuna soy sauce 100g', '', 0, 13, 12,
    '8801075016963', 48, 0, 0, 1690, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    807, 'Дашида saebom 1кг', 'Saebom dashi 1kg', '', 0, 40, 12,
    '8809102250984', 10, 0, 0, 1000, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    808, 'Рамен shin 120гр', 'Shin ramyyn 120g', '', 0, 41, 12,
    '8801043150620', 40, 0, 0, 1300, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    809, 'Рамен kimchi 120гр', 'Shin ramyun kimchi 120g', '', 0, 41, 12,
    '8801043054768', 40, 0, 0, 1300, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    810, 'Рамен shin аягатай 114гр', 'Shin ramyun big bowl 120g', '', 0, 41, 12,
    '8801043025256', 16, 0, 0, 1300, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    811, 'Рамен kimchi аягатай 112гр', 'Shin ramyun kimchi big bowl 112g', '', 0, 41, 12,
    '8801043032285', 16, 0, 0, 1300, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    812, 'Рамен shin аягатай 68гр', 'Shin ramyun cup 68g', '', 0, 41, 12,
    '8801043031011', 12, 0, 0, 1300, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    813, 'Рамен kimchi аягатай 75гр', 'Shin ramyun kimchi cup 75g', '', 0, 41, 12,
    '8801043028158', 12, 0, 0, 1300, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    814, 'Рамен chapageti 140гр', 'Chapageti 140g', '', 0, 41, 12,
    '8801043015226', 30, 0, 0, 1300, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    815, 'Рамен bowl kimchi 86g', 'Bowl ramyun kimchi 86g', '', 0, 41, 12,
    '031146250301', 12, 0, 0, 1300, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    816, 'Рамен bowl hot 86гр', 'Bowl ramyun hot 86g', '', 0, 41, 12,
    '031146250103', 12, 0, 0, 1300, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    817, 'Рамен bowl hot 86гр 24ш', 'Bowl ramyun hot 86g 24ш', '', 0, 41, 12,
    '8801043015653', 24, 0, 0, 1300, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    818, 'Рамен bowl kimchi 86g 24ш', 'Bowl ramyun kimchi 86g 24sh', '', 0, 41, 12,
    '8801043015639', 24, 0, 0, 1300, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    819, 'Самжан beef 170гр', 'Samjang beef 170g', '', 0, 13, 12,
    '8801075014457', 24, 0, 0, 2950, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    820, 'Самжан beef 500гр', 'Samjang beef 500g', '', 0, 13, 12,
    '8801075014464', 20, 0, 0, 6350, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    821, 'Хар цуу 250мл', 'Soy sauce 250ml', '', 0, 17, 12,
    '8801005002707', 24, 0, 0, 1181, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    822, 'Ганари соус 250гр', 'Ganari 250g', '', 0, 31, 12,
    '8801052730547', 24, 0, 0, 2600, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    823, 'Тэрияаки соус 250гр', 'Teriyaki sauce 250g', '', 0, 31, 12,
    '8801052024646', 12, 0, 0, 2600, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    824, 'Чили соус 365гр', 'Sweet chili sauce 356g', '', 0, 31, 12,
    '8801052742007', 12, 0, 0, 2600, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    825, 'Honey aloe tea 1kg', 'Honey aloe tea 1kg', '', 0, 24, 12,
    '8801767921711', 12, 0, 0, 3853, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    826, 'Алимны цуу sajo 15л', 'Apple vinegar 15L', '', 0, 13, 12,
    '8801039932513', 1, 0, 0, 1228, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    827, 'Hot Rapokki 414g', 'Hot Rapokki 414g', '', 0, 42, 12,
    '8809832940803', 12, 0, 0, 1260, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    828, 'Hot Topokki 256g', 'Hot Topokki 256g', '', 0, 42, 12,
    '8809061671639', 10, 0, 0, 1260, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    829, 'Holey Spicy 128g', 'Holey Spicy 128g', '', 0, 42, 12,
    '8809832941077', 16, 0, 0, 1260, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    830, 'Holey Cream 118g', 'Holey Cream 118g', '', 0, 42, 12,
    '8809832941091', 16, 0, 0, 1260, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    831, 'Baby Topokki mild spicy 230g ', 'Baby Topokki mild spicy 230g ', '', 0, 42, 12,
    '8809832941015', 15, 0, 0, 1260, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    832, 'Baby Topokki cream 235g', 'Baby Topokki cream 235g', '', 0, 42, 12,
    '8809832941022', 15, 0, 0, 1260, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    833, 'Нунтаг гим 40гр', 'Dol Laver Salted 40g', '', 0, 43, 12,
    '8809128357469', 24, 0, 0, 2225, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    834, 'Нунтаг гим kids 40гр', 'Kds Laver Salted 40g', '', 0, 43, 12,
    '8809391497459', 24, 0, 0, 2225, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    835, 'Булдак original 124гр', 'Buldak original 124g', '', 0, 44, 12,
    '8809943060162', 32, 0, 0, 1300, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    836, 'Булдак carbonara 135гр', 'Buldak carbonara 135g', '', 0, 44, 12,
    '8809943060186', 32, 0, 0, 1300, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    837, 'Булдак cheese 135гр', 'Buldak cheddar cheese 135g', '', 0, 44, 12,
    '8809943060216', 32, 0, 0, 1300, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    838, 'Булдак аяга original 124гр', 'Buldak original cup 124g', '', 0, 44, 12,
    '8809943060209', 12, 0, 0, 1300, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    839, 'Булдак аяга carbonara 135гр', 'Buldak carbonara cup 135g', '', 0, 44, 12,
    '8809943060247', 12, 0, 0, 1300, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    840, 'Булдак аяга cheese 135гр', 'Buldak cheddar cheese cup 135g', '', 0, 44, 12,
    '8809943060230', 12, 0, 0, 1300, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    841, 'Бүлгоги нонгшим 500гр', 'BULGOGI MARINADE 500g', '', 0, 42, 12,
    '8809061674869', 12, 0, 0, 2600, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    842, 'Бүлгоги нонгшим 840гр', 'BULGOGI MARINADE 840g', '', 0, 42, 12,
    '8809832941268', 12, 0, 0, 2600, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    843, 'Гахай нонгшим 500гр', 'Pork MARINADE 500g', '', 0, 42, 12,
    '8809061674876', 12, 0, 0, 2600, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    844, 'Гахай нонгшим 840гр', 'Pork MARINADE 840g', '', 0, 42, 12,
    '8809832941282', 12, 0, 0, 2600, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    845, 'Калби нонгшим 500гр', 'Kalbi MARINADE 500g', '', 0, 42, 12,
    '8809061674852', 12, 0, 0, 2600, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    846, 'Калби нонгшим 840гр', 'Kalbi MARINADE 840g', '', 0, 42, 12,
    '8809832941275', 12, 0, 0, 2600, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    847, 'Майонез 300гр', 'Mayonaise 300g', '', 0, 31, 12,
    '8801052728216', 12, 0, 0, 2600, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    848, 'Майонез 500гр', 'Mayonaise 500g', '', 0, 31, 12,
    '8801052728223', 12, 0, 0, 2600, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    849, 'Ундаа алим 1.5л', 'Nature apple 1.5L', '', 0, 21, 12,
    '8801382134909', 12, 0, 0, 4500, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    850, 'Ундаа алое 1.5л', 'Nature aloe 1.5L', '', 0, 21, 12,
    '8801382127796', 12, 0, 0, 4500, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    851, 'Ундаа будааны 1.5л', 'Morning rice 1.5L', '', 0, 21, 12,
    '8801382123446', 12, 0, 0, 4500, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    852, 'Ундаа будааны 500мл', 'Morning rice 500ml', '', 0, 21, 12,
    '8801382124528', 20, 0, 0, 4500, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    853, 'Ундаа усан үзэм 1.5л', 'Nature grape 1.5L', '', 0, 21, 12,
    '8801382127987', 12, 0, 0, 4500, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    854, 'Ундаа усан үзэм 500мл', 'Nature grape 500ml', '', 0, 21, 12,
    '8801382132240', 20, 0, 0, 4500, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    855, 'Ундаа мандарин 1.5л', 'Nature mandarin 1.5L', '', 0, 21, 12,
    '8801382127963', 12, 0, 0, 4500, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    856, 'Ундаа мандарин 500мл', 'Nature mandarin 500ml', '', 0, 21, 12,
    '8801382137917', 20, 0, 0, 4500, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    857, 'Ундаа томато 1.5л', 'Nature tomato 1.5L', '', 0, 21, 12,
    '8801382127727', 12, 0, 0, 4500, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    858, 'Ундаа томато 500мл', 'Nature tomato 500ml', '', 0, 21, 12,
    '8801382130314', 20, 0, 0, 4500, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    859, 'Ундаа лийр 1.5л', 'Nature pear 1.5L', '', 0, 21, 12,
    '8801382144236', 12, 0, 0, 4500, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    860, 'Ундаа лууван 1.5л', 'Nature carrot 1.5L', '', 0, 21, 12,
    '8801382128007', 12, 0, 0, 4500, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    861, 'Ундаа нэрс 1.5л', 'Nature blueberry 1.5L', '', 0, 21, 12,
    '8801382139478', 12, 0, 0, 4500, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    862, 'Ундаа манго 1.5л', 'Nature mango 1.5L', '', 0, 21, 12,
    '8801382137900', 12, 0, 0, 4500, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    863, 'Ундаа анар 1.5л', 'Nature pomegranate 1.5L', '', 0, 21, 12,
    '8801382131014', 12, 0, 0, 4500, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    864, 'Ундаа shine muscat 1.5л', 'Nature shine muscat 1.5L', '', 0, 21, 12,
    '8801382149286', 12, 0, 0, 4500, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    865, 'Ундаа shine muscat 340мл', 'Nature shine muscat 340ml', '', 0, 21, 12,
    '8801382149262', 24, 0, 0, 4500, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    866, 'Ундаа чавга 1.5л', 'Nature plum 1.5L', '', 0, 21, 12,
    '8801382126515', 12, 0, 0, 4500, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    867, 'Ундаа чавга 500мл', 'Nature plum 500ml', '', 0, 21, 12,
    '8801382126560', 20, 0, 0, 4500, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    868, 'Jelly манго 100мл', 'Jelly mango pouch 100ml', '', 0, 21, 12,
    '8801382146834', 40, 0, 0, 4500, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    869, 'Jelly тоор 100мл', 'Jelly peach pouch 100ml', '', 0, 21, 12,
    '8801382147299', 40, 0, 0, 4500, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    870, 'Jelly алим 100мл', 'Jelly apple pouch 100ml', '', 0, 21, 12,
    '8801382147305', 40, 0, 0, 4500, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    871, 'Cocomong strawberry 235ml', 'Cocomong strawberry 235ml', '', 0, 21, 12,
    '8801382151951', 24, 0, 0, 4500, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    872, 'Cocomong grape 200ml', 'Cocomong grape 200ml', '', 0, 21, 12,
    '8801382143000', 24, 0, 0, 4500, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    873, 'Cocomong apple 235ml', 'Cocomong apple 235ml', '', 0, 21, 12,
    '8801382151944', 24, 0, 0, 4500, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    874, 'Cocomong peach 235ml', 'Cocomong peach 235ml', '', 0, 21, 12,
    '8801382151968', 24, 0, 0, 4500, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    875, 'Cocomong milk 235ml', 'Cocomong milk 235ml', '', 0, 21, 12,
    '8801382151975', 24, 0, 0, 4500, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    876, 'Cocomong blueberry 235ml', 'Cocomong blueberry 235ml ', '', 0, 21, 12,
    '8801382151982', 24, 0, 0, 4500, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    877, 'Teenieping pineapple 200ml', 'Teenieping pineapple 200ml', '', 0, 21, 12,
    '8801382151869', 24, 0, 0, 4500, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    878, 'Teenieping grape 200ml', 'Teenieping grape 200ml', '', 0, 21, 12,
    '8801382151852', 24, 0, 0, 4500, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    879, 'Baba americano 190ml', 'Baba americano 190ml', '', 0, 21, 12,
    '8801382147503', 50, 0, 0, 4500, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    880, 'Бүлгоги соус CJ 840гр', 'BULGOGI MARINADE 840g', '', 0, 35, 12,
    '8801007247120', 12, 0, 0, 2600, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    881, 'Гахайн соус CJ 840гр', 'KOREAN BBQ SAUCE - SPICY BULGOGI MARINADE 840g', '', 0, 35, 12,
    '8801007012087', 12, 0, 0, 2600, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    882, 'Тахиа соус CJ 290гр', 'SAUCE CHICKEN SPICY 290g', '', 0, 35, 12,
    '8801007185781', 20, 0, 0, 2600, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    883, 'Тахиа соус CJ 490гр', 'SAUCE CHICKEN SPICY 490g', '', 0, 35, 12,
    '8801007185811', 12, 0, 0, 2600, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    884, 'Калби соус CJ 290гр', 'SAUCE BEEF GALBI 290g', '', 0, 35, 12,
    '8801007176307', 20, 0, 0, 2600, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    885, 'Калби соус CJ 500гр', 'SAUCE BEEF GALBI 500g', '', 0, 35, 12,
    '8801007176352', 12, 0, 0, 2600, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    886, 'Калби соус CJ 840гр', 'SAUCE BEEF GALBI 840g', '', 0, 35, 12,
    '8801007247151', 12, 0, 0, 2600, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    887, 'Калби соус CJ 2.05кг', 'SAUCE BEEF GALBI 2,05g', '', 0, 35, 12,
    '8801392108884', 6, 0, 0, 2600, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    889, 'Бүлгоги соус BIBIGO 500гр', 'BULGOGI MILD 500g', '', 0, 35, 12,
    '8801392045820', 12, 0, 0, 2600, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    890, 'Гахайн соус BIBIGO 500гр', 'BULGOGI HOT&SPICY 500g', '', 0, 35, 12,
    '8801392045905', 12, 0, 0, 2600, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    892, 'Булдак 2,3кг', 'HOT CHICKEN SAUCE 2.3KG', '', 0, 35, 12,
    '8809627596697', 18, 0, 0, 2600, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    893, 'Булдак соус 2.3кг', 'HOT CHICKEN SAUCE 2.3KG', '', 0, 45, 12,
    '8809627596697', 6, 0, 0, 2600, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    894, 'Догбуги соус 2кг', 'Tteokbokki sauce 2kg', '', 0, 45, 12,
    '8809627599247', 5, 0, 0, 2600, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    895, 'Чикен spicy соус 2.1кг', 'CHicken sauce spicy', '', 0, 45, 12,
    '8809945221998', 6, 0, 0, 2600, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    896, 'Чикен mild соус 2.1кг', 'CHicken sauce mild 2.1kg', '', 0, 45, 12,
    '8809945221981', 6, 0, 0, 2600, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    897, 'Лаазалсан тоор 410гр', 'Ecliptic slice 410g', '', 0, 45, 12,
    '8809945220304', 24, 0, 0, 2600, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    899, 'Сүү самар 190мл', 'Soybean milk(walnut almond', NULL, 0, NULL, 12,
    NULL, NULL, 0, 0, NULL, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    900, 'Сүү шош 190мл', 'Soybean milk(black bean', NULL, 0, NULL, 12,
    NULL, NULL, 0, 0, NULL, false, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    901, 'Ясны шөл 500гр', 'SOUP BEEF BONE 500G', '', 0, 35, 12,
    '8801007526492', 18, 0, 0, 2600, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    902, 'Солонтан шөл 500гр', 'SOUP OX BONE WITH MEAT 500G', '', 0, 35, 12,
    '8801007560922', 18, 0, 0, 2600, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    903, 'Юггэжан шөл 500гр', 'SOUP MEAT HOT SPICY 500G', '', 0, 35, 12,
    '8801007526515', 18, 0, 0, 2600, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    904, 'Бүлгоги соус CJ 10кг', 'BULGOGI MARINADE 10kg', '', 0, 35, 12,
    '8801007069722', 1, 0, 0, 2600, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    905, 'Тахиа соус BIBIGO 490гр', 'CHICKEN&LAMB SAUCE  490g', '', 0, 35, 12,
    '8801392045561', 12, 0, 0, 2600, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    906, 'Шарсан бүйлс 900гр', 'Baked almonds 900g', '', 0, 45, 12,
    '8801936009813', 12, 0, 0, 5000, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    908, 'Шарсан бүйлс 350гр', 'Baked almonds 350g', '', 0, 45, 12,
    '8801936009806', 20, 0, 0, 5000, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    909, 'Пистачи самар 700гр', 'Pistachio 700g', '', 0, 45, 12,
    '8801936009943', 12, 0, 0, 5000, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    910, 'Кешью самар 700гр', 'Baked cashew nuts700g', '', 0, 45, 12,
    '8801936009851', 12, 0, 0, 5000, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    911, 'Кешью самар 300гр', 'Baked cashew nuts300g', '', 0, 45, 12,
    '8801936009844', 20, 0, 0, 5000, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    912, 'Хушга 700гр', 'Walnut 700g', '', 0, 45, 12,
    '8801936009875', 12, 0, 0, 5000, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    913, 'Хушга 250гр', 'Walnut 250g', '', 0, 45, 12,
    '8801936009868', 20, 0, 0, 5000, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    914, 'Холимог самар 700гр', 'Assorted nuts 700g', '', 0, 45, 12,
    '8801936009530', 12, 0, 0, 5000, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    915, 'Холимог самар 200гр', 'Assorted nuts 200g', '', 0, 45, 12,
    '8809627594952', 8, 0, 0, 5000, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    916, 'Газрын самар 900гр', 'Stir-fried peanuts 900g', '', 0, 45, 12,
    '8801936009653', 12, 0, 0, 5000, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    917, 'Үзэм 900гр', 'Raisin 900g', '', 0, 45, 12,
    '8801936009493', 12, 0, 0, 5000, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    918, 'Үзэм 400гр', 'Raisin 400g', '', 0, 45, 12,
    '8801936009950', 20, 0, 0, 5000, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    919, 'Хулууны үр 900гр', 'Pumpkin seed 900g', '', 0, 45, 12,
    '8801936009899', 12, 0, 0, 5000, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    920, 'Бүйлсний зүсмэл 700гр', 'Almond slice700g', '', 0, 45, 12,
    '8801936009837', 12, 0, 0, 5000, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    921, 'Банана чипс 800гр', 'Banana crisps 800g', '', 0, 45, 12,
    '8801936009639', 12, 0, 0, 5000, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    922, 'Наранцэцэгийн үр 900гр', 'Sunflower seed 900g', '', 0, 45, 12,
    '8801936009929', 12, 0, 0, 5000, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    923, 'Наранцэцэгийн үр 400гр', 'Sunflower seed 400g', '', 0, 45, 12,
    '8801936009905', 20, 0, 0, 5000, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    924, 'Нэрс самар 200гр', 'Assorted nuts blueberry 200g', '', 0, 45, 12,
    '8809627594938', 8, 0, 0, 5000, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    925, 'Excellent самар 200гр', 'Assorted nuts excellent 200g', '', 0, 45, 12,
    '8809627595614', 8, 0, 0, 5000, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    926, 'Cream soup 1кг', 'Cream soup 1kg', '', 0, 45, 12,
    '8809627595331', 10, 0, 0, 5000, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    927, 'Карри 1кг', 'Curry powder 1kg', '', 0, 45, 12,
    '8809627595300', 10, 0, 0, 5000, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    928, 'Тойгны шөл 800гр', 'Crucible Dried Gomtang 800g', '', 0, 45, 12,
    '8809627591937', 15, 0, 0, 2120, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    930, 'Калбитан шөл 600гр', 'Beef rib soup 600G', '', 0, 45, 12,
    '8809945221356', 20, 0, 0, 2600, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    932, 'Тойгны шөл 500гр', 'Ox Knee soup 500g', '', 0, 45, 12,
    '8809945221950', 25, 0, 0, 2600, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    933, 'Үхрийн махтай шөл 600гр', 'Beef offal Soup 600g', '', 0, 45, 12,
    '8809627591944', 20, 0, 0, 2120, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    934, 'Үхрийн гэдэсний шөл 600гр', 'Soup of beef 600g', '', 0, 45, 12,
    '8809945221905', 20, 0, 0, 2120, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    935, 'Рамен jin mild аяга 110гр', 'Ramen Jin Big Bowl 110g', '', 0, 32, 12,
    '', 12, 0, 0, 1300, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    936, 'Рамен jin hot аяга 110гр', 'Ramen Jin hot Big Bowl 110g', '', 0, 32, 12,
    '', 12, 0, 0, 1300, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    937, 'Рамен jin hot аяга 65гр', 'Ramen Jin hot Big Bowl 65g', '', 0, 32, 12,
    '', 15, 0, 0, 1300, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    938, 'Рамен jin mild аяга 65гр', 'Ramen Jin mild Big Bowl 65g', '', 0, 32, 12,
    '', 15, 0, 0, 1300, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    939, 'Honey Ginseng tea 1kg', 'Honey Ginseng tea 1kg', '', 0, 24, 12,
    '', 12, 0, 0, 3853, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    940, 'Ginger tea 15T', 'Ginger tea 15T', '', 0, 24, 12,
    '', 12, 0, 0, 3853, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    941, 'Wild flower honey 500g', 'Wild flower honey 500g', '', 0, 24, 12,
    '', 12, 0, 0, 3853, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    942, 'Sugar fed honey 800g', 'Sugar fed honey 800g', '', 0, 24, 12,
    '', 12, 0, 0, 3853, true, 0
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
    id, name_mongolian, name_english, name_korean, product_code, supplier_id, category_id,
    barcode, units_per_box, net_weight, gross_weight, default_price, is_active, stock_quantity
) VALUES (
    943, 'Honey stick 20T', 'Honey stick 20T', '', 0, 24, 12,
    '', 12, 0, 0, 3853, true, 0
) ON CONFLICT (id) DO NOTHING;

