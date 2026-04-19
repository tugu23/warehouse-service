-- ============================================
-- COMPLETE MIGRATION SCRIPT
-- Old MySQL Database -> New PostgreSQL Schema
-- Generated: 2026-04-19
-- ============================================

-- Run this script in order, table by table
-- Each section can be run independently


-- ============================================
-- 1. ROLES
-- ============================================
-- Create default role for agents
INSERT INTO roles (name) VALUES ('Agent') ON CONFLICT (name) DO NOTHING;
INSERT INTO roles (name) VALUES ('Admin') ON CONFLICT (name) DO NOTHING;
INSERT INTO roles (name) VALUES ('Manager') ON CONFLICT (name) DO NOTHING;


-- ============================================
-- 2. CUSTOMER TYPES (turul_hariltsagch -> customer_types)
-- ============================================

INSERT INTO customer_types (id, type_name) VALUES (1, 'Зах') ON CONFLICT (id) DO NOTHING;
INSERT INTO customer_types (id, type_name) VALUES (2, 'Дэлгүүр') ON CONFLICT (id) DO NOTHING;
INSERT INTO customer_types (id, type_name) VALUES (3, 'Хоум плаза') ON CONFLICT (id) DO NOTHING;
INSERT INTO customer_types (id, type_name) VALUES (4, 'Зах2') ON CONFLICT (id) DO NOTHING;
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


-- ============================================
-- 3. CATEGORIES (turul -> categories)
-- ============================================

INSERT INTO categories (id, name_mongolian, name_english) VALUES (12, 'all', 'all') ON CONFLICT (id) DO NOTHING;


-- ============================================
-- 4. EMPLOYEES/AGENTS (borluulagch -> employees)
-- ============================================
-- Note: Using default password hash for all migrated users
-- Users should reset their passwords after migration

INSERT INTO employees (id, name, email, phone_number, password_hash, role_id, is_active) 
VALUES (6, 'Мөнхцэцэг', 'agent6@warehouse.mn', '88048350', '$2b$10$rKzZvFJwWqKqZQQqZQQqZeJ5vZQqZQqZQqZQqZQqZQqZQqZQqZQ', (SELECT id FROM roles WHERE name = 'Agent'), true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO employees (id, name, email, phone_number, password_hash, role_id, is_active) 
VALUES (7, 'Зоригтбаатар', 'agent7@warehouse.mn', '80829207', '$2b$10$rKzZvFJwWqKqZQQqZQQqZeJ5vZQqZQqZQqZQqZQqZQqZQqZQqZQ', (SELECT id FROM roles WHERE name = 'Agent'), true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO employees (id, name, email, phone_number, password_hash, role_id, is_active) 
VALUES (8, 'Мөнгөншагай', 'agent8@warehouse.mn', '88049870', '$2b$10$rKzZvFJwWqKqZQQqZQQqZeJ5vZQqZQqZQqZQqZQqZQqZQqZQqZQ', (SELECT id FROM roles WHERE name = 'Agent'), true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO employees (id, name, email, phone_number, password_hash, role_id, is_active) 
VALUES (9, 'Батзаяа', 'agent9@warehouse.mn', '80830869', '$2b$10$rKzZvFJwWqKqZQQqZQQqZeJ5vZQqZQqZQqZQqZQqZQqZQqZQqZQ', (SELECT id FROM roles WHERE name = 'Agent'), true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO employees (id, name, email, phone_number, password_hash, role_id, is_active) 
VALUES (10, 'Цээгий', 'agent10@warehouse.mn', '90199746', '$2b$10$rKzZvFJwWqKqZQQqZQQqZeJ5vZQqZQqZQqZQqZQqZQqZQqZQqZQ', (SELECT id FROM roles WHERE name = 'Agent'), true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO employees (id, name, email, phone_number, password_hash, role_id, is_active) 
VALUES (11, 'Билэгээ', 'agent11@warehouse.mn', '80064009', '$2b$10$rKzZvFJwWqKqZQQqZQQqZeJ5vZQqZQqZQqZQqZQqZQqZQqZQqZQ', (SELECT id FROM roles WHERE name = 'Agent'), true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO employees (id, name, email, phone_number, password_hash, role_id, is_active) 
VALUES (12, 'Туяа', 'agent12@warehouse.mn', '88048350', '$2b$10$rKzZvFJwWqKqZQQqZQQqZeJ5vZQqZQqZQqZQqZQqZQqZQqZQqZQ', (SELECT id FROM roles WHERE name = 'Agent'), true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO employees (id, name, email, phone_number, password_hash, role_id, is_active) 
VALUES (13, 'Хандаа', 'agent13@warehouse.mn', '88470141', '$2b$10$rKzZvFJwWqKqZQQqZQQqZeJ5vZQqZQqZQqZQqZQqZQqZQqZQqZQ', (SELECT id FROM roles WHERE name = 'Agent'), true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO employees (id, name, email, phone_number, password_hash, role_id, is_active) 
VALUES (14, 'Буянжаргал', 'agent14@warehouse.mn', '86228821', '$2b$10$rKzZvFJwWqKqZQQqZQQqZeJ5vZQqZQqZQqZQqZQqZQqZQqZQqZQ', (SELECT id FROM roles WHERE name = 'Agent'), true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO employees (id, name, email, phone_number, password_hash, role_id, is_active) 
VALUES (15, 'Баясаа', 'agent15@warehouse.mn', '80283840', '$2b$10$rKzZvFJwWqKqZQQqZQQqZeJ5vZQqZQqZQqZQqZQqZQqZQqZQqZQ', (SELECT id FROM roles WHERE name = 'Agent'), true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO employees (id, name, email, phone_number, password_hash, role_id, is_active) 
VALUES (16, 'Уугий', 'agent16@warehouse.mn', '88049870', '$2b$10$rKzZvFJwWqKqZQQqZQQqZeJ5vZQqZQqZQqZQqZQqZQqZQqZQqZQ', (SELECT id FROM roles WHERE name = 'Agent'), true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO employees (id, name, email, phone_number, password_hash, role_id, is_active) 
VALUES (17, 'Соогий', 'agent17@warehouse.mn', '88299870', '$2b$10$rKzZvFJwWqKqZQQqZQQqZeJ5vZQqZQqZQqZQqZQqZQqZQqZQqZQ', (SELECT id FROM roles WHERE name = 'Agent'), true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO employees (id, name, email, phone_number, password_hash, role_id, is_active) 
VALUES (18, 'Баясах', 'agent18@warehouse.mn', '80524728', '$2b$10$rKzZvFJwWqKqZQQqZQQqZeJ5vZQqZQqZQqZQqZQqZQqZQqZQqZQ', (SELECT id FROM roles WHERE name = 'Agent'), true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO employees (id, name, email, phone_number, password_hash, role_id, is_active) 
VALUES (19, 'Пүрэвдорж', 'agent19@warehouse.mn', '86868291', '$2b$10$rKzZvFJwWqKqZQQqZQQqZeJ5vZQqZQqZQqZQqZQqZQqZQqZQqZQ', (SELECT id FROM roles WHERE name = 'Agent'), true)
ON CONFLICT (id) DO NOTHING;