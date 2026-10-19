-- ============================================
-- MASTER MIGRATION SCRIPT
-- aguulah (2) (1).sql -> New PostgreSQL Schema
-- ============================================
-- This script runs all migration parts in the correct order
-- Generated: 2026-10-15
--
-- ⚠️  IMPORTANT: READ BEFORE EXECUTING ⚠️
--
-- 1. BACKUP YOUR DATABASE FIRST!
--    pg_dump -U postgres warehouse_db > backup_$(date +%Y%m%d_%H%M%S).sql
--
-- 2. Run this script from /tmp directory:
--    psql -U postgres -d warehouse_db -f /path/to/MIGRATION_MASTER.sql
--
-- 3. Execution order:
--    Part 1: Roles, Categories, Customer Types, Employees (14 agents)
--    Part 2: Suppliers (33 suppliers)
--    Part 3: Products (517 products)
--    Part 4: Customers (3765 customers)
--    Part 5: Product Prices (1624 prices)
--
-- 4. All migrated users have placeholder password hashes
--    Users MUST reset passwords after migration!
--
-- 5. Execution time: ~2-5 minutes depending on hardware
--
-- ============================================

\timing on

BEGIN;

-- ============================================
-- PART 1: ROLES, CATEGORIES, CUSTOMER TYPES, EMPLOYEES
-- ============================================
\echo 'Running Part 1: Roles, Categories, Customer Types, Employees...'
\i 001_migration_part1_roles_agents.sql

-- ============================================
-- PART 2: SUPPLIERS
-- ============================================
\echo 'Running Part 2: Suppliers...'
\i 002_migration_part2_suppliers.sql

-- ============================================
-- PART 3: PRODUCTS
-- ============================================
\echo 'Running Part 3: Products...'
\i 003_migration_part3_products.sql

-- ============================================
-- PART 4: CUSTOMERS
-- ============================================
\echo 'Running Part 4: Customers...'
\i 004_migration_part4_customers.sql

-- ============================================
-- PART 5: PRODUCT PRICES
-- ============================================
\echo 'Running Part 5: Product Prices...'
\i 005_migration_part5_product_prices.sql

-- ============================================
-- FINAL SEQUENCE RESET
-- ============================================
\echo 'Resetting all sequences...'
SELECT setval('roles_id_seq', (SELECT MAX(id) FROM roles));
SELECT setval('customer_types_id_seq', (SELECT MAX(id) FROM customer_types));
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));
SELECT setval('suppliers_id_seq', (SELECT MAX(id) FROM suppliers));
SELECT setval('employees_id_seq', (SELECT MAX(id) FROM employees));
SELECT setval('customers_id_seq', (SELECT MAX(id) FROM customers));
SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));
SELECT setval('product_prices_id_seq', (SELECT MAX(id) FROM product_prices));

COMMIT;

-- ============================================
-- VALIDATION QUERIES
-- ============================================

\echo ''
\echo '============================================'
\echo 'MIGRATION VALIDATION'
\echo '============================================'

\echo ''
\echo 'Record Counts (Expected):'
\echo '  Roles: 3'
\echo '  Customer Types: 25'
\echo '  Categories: 1'
\echo '  Suppliers: 33'
\echo '  Employees: 15 (1 admin + 14 agents)'
\echo '  Customers: 3765'
\echo '  Products: 517'
\echo '  Product Prices: 1624'

\echo ''
\echo 'Actual Counts:'
SELECT 'Roles' as table_name, COUNT(*) as count FROM roles
UNION ALL SELECT 'Customer Types', COUNT(*) FROM customer_types
UNION ALL SELECT 'Categories', COUNT(*) FROM categories
UNION ALL SELECT 'Suppliers', COUNT(*) FROM suppliers
UNION ALL SELECT 'Employees', COUNT(*) FROM employees
UNION ALL SELECT 'Customers', COUNT(*) FROM customers
UNION ALL SELECT 'Products', COUNT(*) FROM products
UNION ALL SELECT 'Product Prices', COUNT(*) FROM product_prices;

\echo ''
\echo 'Checking for orphaned foreign keys...'

\echo '  Checking customer_type_id orphans...'
SELECT COUNT(*) as orphaned_customers_by_type
FROM customers
WHERE customer_type_id NOT IN (SELECT id FROM customer_types);

\echo '  Checking assigned_agent_id orphans...'
SELECT COUNT(*) as orphaned_customers_by_agent
FROM customers
WHERE assigned_agent_id IS NOT NULL
  AND assigned_agent_id NOT IN (SELECT id FROM employees);

\echo '  Checking supplier_id orphans...'
SELECT COUNT(*) as orphaned_products_by_supplier
FROM products
WHERE supplier_id IS NOT NULL
  AND supplier_id NOT IN (SELECT id FROM suppliers);

\echo '  Checking category_id orphans...'
SELECT COUNT(*) as orphaned_products_by_category
FROM products
WHERE category_id IS NOT NULL
  AND category_id NOT IN (SELECT id FROM categories);

\echo ''
\echo '============================================'
\echo 'CUSTOMER TYPE DISTRIBUTION'
\echo '============================================'
SELECT ct.type_name, COUNT(c.id) as customer_count
FROM customer_types ct
LEFT JOIN customers c ON c.customer_type_id = ct.id
GROUP BY ct.id, ct.type_name
ORDER BY customer_count DESC;

\echo ''
\echo '============================================'
\echo 'PRODUCT SUPPLIER DISTRIBUTION'
\echo '============================================'
SELECT s.name as supplier_name, COUNT(p.id) as product_count
FROM suppliers s
LEFT JOIN products p ON p.supplier_id = s.id
GROUP BY s.id, s.name
ORDER BY product_count DESC;

\echo ''
\echo '============================================'
\echo 'MIGRATION COMPLETE'
\echo '============================================'
\echo ''
\echo 'Next steps:'
\echo '1. Review validation results above'
\echo '2. All orphaned counts should be 0'
\echo '3. Notify users to reset their passwords'
\echo '4. Test application functionality'
\echo ''
\echo 'Default login credentials:'
\echo '  Admin: admin@warehouse.com'
\echo '  Agents: agent{id}@warehouse.com'
\echo ''
