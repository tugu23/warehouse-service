-- ============================================
-- PRODUCTION-READY MASTER MIGRATION SCRIPT
-- Old MySQL Database -> New PostgreSQL Schema
-- Generated: 2026-04-21
-- ============================================
--
-- ⚠️  CRITICAL: READ BEFORE EXECUTING ⚠️
--
-- 1. BACKUP YOUR DATABASE FIRST!
--    pg_dump -U postgres warehouse_db > backup_$(date +%Y%m%d_%H%M%S).sql
--
-- 2. This script contains ALL data from the old system:
--    - 14 Agents
--    - 33 Suppliers
--    - 25 Customer Types
--    - 3,686 Customers
--    - 515 Products
--    - 1,669 Product Prices
--
-- 3. All migrated users have default password hash
--    Users MUST reset passwords after migration!
--
-- 4. Execution time: ~2-5 minutes depending on hardware
--
-- 5. Run validation queries after completion (see end of file)
--
-- ============================================

\timing on

BEGIN;

-- Part 1: Roles, Categories, Customer Types, Agents
\i /tmp/migration_part1_roles_agents_COMPLETE.sql

-- Part 2: Suppliers
\i /tmp/migration_part2_suppliers_COMPLETE.sql

-- Part 3: Customers (3,686 records)
\i /tmp/migration_part3_customers_COMPLETE.sql

-- Part 4: Products (515 records)
\i /tmp/migration_part4_products_COMPLETE.sql

-- Part 5: Product Prices (1,669 records)
\i /tmp/migration_part5_prices_COMPLETE.sql

-- Reset sequences
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
\echo 'Record Counts:'
SELECT 'Roles' as table_name, COUNT(*) as count FROM roles
UNION ALL SELECT 'Customer Types', COUNT(*) FROM customer_types
UNION ALL SELECT 'Categories', COUNT(*) FROM categories
UNION ALL SELECT 'Suppliers', COUNT(*) FROM suppliers
UNION ALL SELECT 'Employees', COUNT(*) FROM employees
UNION ALL SELECT 'Customers', COUNT(*) FROM customers
UNION ALL SELECT 'Products', COUNT(*) FROM products
UNION ALL SELECT 'Product Prices', COUNT(*) FROM product_prices;

\echo ''
\echo 'Expected Counts:'
\echo 'Roles: 3'
\echo 'Customer Types: 25'
\echo 'Categories: 1'
\echo 'Suppliers: 33'
\echo 'Employees: 14'
\echo 'Customers: 3686'
\echo 'Products: 515'
\echo 'Product Prices: 1669'

\echo ''
\echo 'Checking for orphaned foreign keys...'

SELECT COUNT(*) as orphaned_customers_by_type
FROM customers
WHERE customer_type_id NOT IN (SELECT id FROM customer_types);

SELECT COUNT(*) as orphaned_customers_by_agent
FROM customers
WHERE assigned_agent_id IS NOT NULL
  AND assigned_agent_id NOT IN (SELECT id FROM employees);

SELECT COUNT(*) as orphaned_products_by_supplier
FROM products
WHERE supplier_id IS NOT NULL
  AND supplier_id NOT IN (SELECT id FROM suppliers);

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
