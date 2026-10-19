-- ============================================
-- MIGRATION PART 1: ROLES, CATEGORIES, CUSTOMER TYPES, EMPLOYEES
-- Source: aguulah (2) (1).sql
-- Generated: 2026-10-15
-- ============================================

BEGIN;

-- ============================================
-- ROLES
-- ============================================
INSERT INTO roles (id, name) VALUES (1, 'Admin') ON CONFLICT (id) DO NOTHING;
INSERT INTO roles (id, name) VALUES (2, 'Manager') ON CONFLICT (id) DO NOTHING;
INSERT INTO roles (id, name) VALUES (3, 'Agent') ON CONFLICT (id) DO NOTHING;

-- ============================================
-- CATEGORIES
-- ============================================
INSERT INTO categories (id, name_mongolian, name_english)
VALUES (12, 'Бүх бараа', 'All Products')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- CUSTOMER TYPES (from turul_hariltsagch in original)
-- ============================================
INSERT INTO customer_types (id, type_name) VALUES (1, 'Зах') ON CONFLICT (id) DO NOTHING;
INSERT INTO customer_types (id, type_name) VALUES (2, 'Дэлгүүр') ON CONFLICT (id) DO NOTHING;
INSERT INTO customer_types (id, type_name) VALUES (3, 'Хоум плаза') ON CONFLICT (id) DO NOTHING;
INSERT INTO customer_types (id, type_name) VALUES (4, 'Зах 2') ON CONFLICT (id) DO NOTHING;
INSERT INTO customer_types (id, type_name) VALUES (5, 'Борлуулалт') ON CONFLICT (id) DO NOTHING;
INSERT INTO customer_types (id, type_name) VALUES (6, 'Макс') ON CONFLICT (id) DO NOTHING;
INSERT INTO customer_types (id, type_name) VALUES (7, 'Наран') ON CONFLICT (id) DO NOTHING;
INSERT INTO customer_types (id, type_name) VALUES (8, 'Номин') ON CONFLICT (id) DO NOTHING;
INSERT INTO customer_types (id, type_name) VALUES (9, 'Оргил') ON CONFLICT (id) DO NOTHING;
INSERT INTO customer_types (id, type_name) VALUES (10, 'Сансар') ON CONFLICT (id) DO NOTHING;
INSERT INTO customer_types (id, type_name) VALUES (11, 'Марал') ON CONFLICT (id) DO NOTHING;
INSERT INTO customer_types (id, type_name) VALUES (12, 'Efes') ON CONFLICT (id) DO NOTHING;
INSERT INTO customer_types (id, type_name) VALUES (13, 'Тэнгэр') ON CONFLICT (id) DO NOTHING;
INSERT INTO customer_types (id, type_name) VALUES (14, 'Янта зах') ON CONFLICT (id) DO NOTHING;
INSERT INTO customer_types (id, type_name) VALUES (15, 'Эко ивээл') ON CONFLICT (id) DO NOTHING;
INSERT INTO customer_types (id, type_name) VALUES (16, 'Жавхлант') ON CONFLICT (id) DO NOTHING;
INSERT INTO customer_types (id, type_name) VALUES (17, 'TV5') ON CONFLICT (id) DO NOTHING;
INSERT INTO customer_types (id, type_name) VALUES (18, 'Үнэгүй') ON CONFLICT (id) DO NOTHING;
INSERT INTO customer_types (id, type_name) VALUES (19, 'Тэнгэр хайпер') ON CONFLICT (id) DO NOTHING;
INSERT INTO customer_types (id, type_name) VALUES (20, 'Миний дэлгүүр') ON CONFLICT (id) DO NOTHING;
INSERT INTO customer_types (id, type_name) VALUES (21, 'МИАТ') ON CONFLICT (id) DO NOTHING;
INSERT INTO customer_types (id, type_name) VALUES (22, 'Ресторан') ON CONFLICT (id) DO NOTHING;
INSERT INTO customer_types (id, type_name) VALUES (23, 'Амархан') ON CONFLICT (id) DO NOTHING;
INSERT INTO customer_types (id, type_name) VALUES (24, 'CU') ON CONFLICT (id) DO NOTHING;
INSERT INTO customer_types (id, type_name) VALUES (25, 'Наш') ON CONFLICT (id) DO NOTHING;

-- ============================================
-- EMPLOYEES / AGENTS (from borluulagch in original)
-- Admin user (password: admin123 - must be changed in production)
-- ============================================
INSERT INTO employees (id, name, email, phone_number, password_hash, role_id, is_active)
VALUES (1, 'Admin User', 'admin@warehouse.com', '+97699999999', '$2a$10$DWcInF146WIYO2kwkNPVC.RWLeM33CGPmkRT0PuD12O2k5B17qhvq',
        (SELECT id FROM roles WHERE name = 'Admin'), true)
ON CONFLICT (id) DO NOTHING;

-- Agent users (from borluulagch table, IDs 6-19)
INSERT INTO employees (id, name, email, phone_number, password_hash, role_id, is_active)
VALUES (6, 'Батцэцэг', 'agent6@warehouse.mn', '+97689354008', '$2b$10$rKzZvFJwWqKqZQQqZQQqZeJ5vZQqZQqZQqZQqZQqZQqZQqZQqZQ',
        (SELECT id FROM roles WHERE name = 'Agent'), true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO employees (id, name, email, phone_number, password_hash, role_id, is_active)
VALUES (7, 'Зоригтбаатар', 'agent7@warehouse.mn', '+97680829207', '$2b$10$rKzZvFJwWqKqZQQqZQQqZeJ5vZQqZQqZQqZQqZQqZQqZQqZQqZQ',
        (SELECT id FROM roles WHERE name = 'Agent'), true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO employees (id, name, email, phone_number, password_hash, role_id, is_active)
VALUES (8, 'Мөнгөншагай', 'agent8@warehouse.mn', '+97688049870', '$2b$10$rKzZvFJwWqKqZQQqZQQqZeJ5vZQqZQqZQqZQqZQqZQqZQqZQqZQ',
        (SELECT id FROM roles WHERE name = 'Agent'), true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO employees (id, name, email, phone_number, password_hash, role_id, is_active)
VALUES (9, 'Батзаяа', 'agent9@warehouse.mn', '+97680830869', '$2b$10$rKzZvFJwWqKqZQQqZQQqZeJ5vZQqZQqZQqZQqZQqZQqZQqZQqZQ',
        (SELECT id FROM roles WHERE name = 'Agent'), true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO employees (id, name, email, phone_number, password_hash, role_id, is_active)
VALUES (10, 'Багабанди', 'agent10@warehouse.mn', '+97680098540', '$2b$10$rKzZvFJwWqKqZQQqZQQqZeJ5vZQqZQqZQqZQqZQqZQqZQqZQqZQ',
        (SELECT id FROM roles WHERE name = 'Agent'), true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO employees (id, name, email, phone_number, password_hash, role_id, is_active)
VALUES (11, 'Энхзул', 'agent11@warehouse.mn', '+97696194546', '$2b$10$rKzZvFJwWqKqZQQqZQQqZeJ5vZQqZQqZQqZQqZQqZQqZQqZQqZQ',
        (SELECT id FROM roles WHERE name = 'Agent'), true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO employees (id, name, email, phone_number, password_hash, role_id, is_active)
VALUES (12, 'Туяа', 'agent12@warehouse.mn', '+97688048350', '$2b$10$rKzZvFJwWqKqZQQqZQQqZeJ5vZQqZQqZQqZQqZQqZQqZQqZQqZQ',
        (SELECT id FROM roles WHERE name = 'Agent'), true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO employees (id, name, email, phone_number, password_hash, role_id, is_active)
VALUES (13, 'Одончимэг', 'agent13@warehouse.mn', '+97689208111', '$2b$10$rKzZvFJwWqKqZQQqZQQqZeJ5vZQqZQqZQqZQqZQqZQqZQqZQqZQ',
        (SELECT id FROM roles WHERE name = 'Agent'), true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO employees (id, name, email, phone_number, password_hash, role_id, is_active)
VALUES (14, 'Буянжаргал', 'agent14@warehouse.mn', '+97686228821', '$2b$10$rKzZvFJwWqKqZQQqZQQqZeJ5vZQqZQqZQqZQqZQqZQqZQqZQqZQ',
        (SELECT id FROM roles WHERE name = 'Agent'), true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO employees (id, name, email, phone_number, password_hash, role_id, is_active)
VALUES (15, 'Баясаа', 'agent15@warehouse.mn', '+97680283840', '$2b$10$rKzZvFJwWqKqZQQqZQQqZeJ5vZQqZQqZQqZQqZQqZQqZQqZQqZQ',
        (SELECT id FROM roles WHERE name = 'Agent'), true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO employees (id, name, email, phone_number, password_hash, role_id, is_active)
VALUES (16, 'Уугий', 'agent16@warehouse.mn', '+97688049870', '$2b$10$rKzZvFJwWqKqZQQqZQQqZeJ5vZQqZQqZQqZQqZQqZQqZQqZQqZQ',
        (SELECT id FROM roles WHERE name = 'Agent'), true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO employees (id, name, email, phone_number, password_hash, role_id, is_active)
VALUES (17, 'Соогий', 'agent17@warehouse.mn', '+97688299870', '$2b$10$rKzZvFJwWqKqZQQqZQQqZeJ5vZQqZQqZQqZQqZQqZQqZQqZQqZQ',
        (SELECT id FROM roles WHERE name = 'Agent'), true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO employees (id, name, email, phone_number, password_hash, role_id, is_active)
VALUES (18, 'Баясах', 'agent18@warehouse.mn', '+97680524728', '$2b$10$rKzZvFJwWqKqZQQqZQQqZeJ5vZQqZQqZQqZQqZQqZQqZQqZQqZQ',
        (SELECT id FROM roles WHERE name = 'Agent'), true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO employees (id, name, email, phone_number, password_hash, role_id, is_active)
VALUES (19, 'Пүрэвдорж', 'agent19@warehouse.mn', '+97686868291', '$2b$10$rKzZvFJwWqKqZQQqZQQqZeJ5vZQqZQqZQqZQqZQqZQqZQqZQqZQ',
        (SELECT id FROM roles WHERE name = 'Agent'), true)
ON CONFLICT (id) DO NOTHING;

-- Reset sequences
SELECT setval('roles_id_seq', (SELECT MAX(id) FROM roles));
SELECT setval('customer_types_id_seq', (SELECT MAX(id) FROM customer_types));
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));
SELECT setval('employees_id_seq', (SELECT MAX(id) FROM employees));

COMMIT;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- SELECT 'Roles' as table_name, COUNT(*) as count FROM roles
-- UNION ALL SELECT 'Customer Types', COUNT(*) FROM customer_types
-- UNION ALL SELECT 'Categories', COUNT(*) FROM categories
-- UNION ALL SELECT 'Employees', COUNT(*) FROM employees;
