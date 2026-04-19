-- ============================================
-- MASTER MIGRATION SCRIPT
-- Old MySQL Database -> New PostgreSQL Schema
-- Generated: 2026-04-19
-- ============================================
-- 
-- INSTRUCTIONS:
-- 1. Backup your current database before running this script
-- 2. Run each part in order (part1 -> part2 -> part3 -> part4 -> part5 -> part6)
-- 3. Check for errors after each part
-- 4. Verify data integrity after migration
--
-- IMPORTANT NOTES:
-- - All migrated employees will have default password: 'password123'
-- - Users should reset their passwords after migration
-- - Foreign key constraints may cause some records to be skipped if referenced data doesn't exist
-- - Check the logs for any "ON CONFLICT" skipped records
--
-- ============================================

-- Part 1: Roles, Customer Types, Categories, Employees/Agents
\i migration_part1_roles_agents.sql

-- Part 2: Suppliers
\i migration_part6_suppliers.sql

-- Part 3: Customers
\i migration_part2_customers.sql

-- Part 4: Products and Product Prices
\i migration_part3_products.sql

-- Part 5: Agent Locations
\i migration_part4_locations.sql

-- Part 6: Returns
\i migration_part5_returns.sql

-- ============================================
-- POST-MIGRATION TASKS
-- ============================================

-- Reset sequences to avoid ID conflicts
SELECT setval('roles_id_seq', (SELECT MAX(id) FROM roles));
SELECT setval('customer_types_id_seq', (SELECT MAX(id) FROM customer_types));
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));
SELECT setval('suppliers_id_seq', (SELECT MAX(id) FROM suppliers));
SELECT setval('employees_id_seq', (SELECT MAX(id) FROM employees));
SELECT setval('customers_id_seq', (SELECT MAX(id) FROM customers));
SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));
SELECT setval('agent_locations_id_seq', (SELECT MAX(id) FROM agent_locations));
SELECT setval('returns_id_seq', (SELECT MAX(id) FROM returns));
SELECT setval('product_prices_id_seq', (SELECT MAX(id) FROM product_prices));

-- Verify migration counts
SELECT 'Roles' as table_name, COUNT(*) as count FROM roles
UNION ALL
SELECT 'Customer Types', COUNT(*) FROM customer_types
UNION ALL
SELECT 'Categories', COUNT(*) FROM categories
UNION ALL
SELECT 'Suppliers', COUNT(*) FROM suppliers
UNION ALL
SELECT 'Employees', COUNT(*) FROM employees
UNION ALL
SELECT 'Customers', COUNT(*) FROM customers
UNION ALL
SELECT 'Products', COUNT(*) FROM products
UNION ALL
SELECT 'Product Prices', COUNT(*) FROM product_prices
UNION ALL
SELECT 'Agent Locations', COUNT(*) FROM agent_locations
UNION ALL
SELECT 'Returns', COUNT(*) FROM returns;

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
-- Next steps:
-- 1. Verify all data has been migrated correctly
-- 2. Update employee passwords
-- 3. Test application functionality
-- 4. Update any application configuration if needed
-- ============================================
