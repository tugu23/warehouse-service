# Database Migration Guide

## Overview
This migration converts your old MySQL database backup to the new PostgreSQL schema.

## Migration Files Generated

1. **migration_master.sql** - Main script that orchestrates all parts
2. **migration_part1_roles_agents.sql** - Roles, Customer Types, Categories, Employees
3. **migration_part6_suppliers.sql** - Suppliers (31 records)
4. **migration_part2_customers.sql** - Customer data (332 records)
5. **migration_part3_products.sql** - Products and pricing (372 products)
6. **migration_part4_locations.sql** - Agent location history (1,873 records)
7. **migration_part5_returns.sql** - Product returns (103 records)

## Table Mapping

| Old Table (MySQL) | New Table (PostgreSQL) | Records |
|-------------------|------------------------|---------|
| turul_hariltsagch | customer_types | 23 |
| turul | categories | 1 |
| borluulagch | employees | 14 |
| uildwerlegch | suppliers | 31 |
| hariltsagch | customers | 332 |
| baraa | products | 372 |
| baraa (prices) | product_prices | ~1,116 |
| position | agent_locations | 1,873 |
| butsaalt | returns | 103 |

## Field Mapping

### Products (baraa -> products)
- `mon_ner` → `name_mongolian`
- `eng_ner` → `name_english`
- `ko_ner` → `name_korean`
- `code` → `product_code`
- `bar_code` → `barcode`
- `company` → `supplier_id`
- `turul` → `category_id`
- `khairtsag` → `units_per_box`
- `tsewer_jin` → `net_weight`
- `bohir_jin` → `gross_weight`
- `price_sh_t` → `default_price` + product_prices (customer_type_id=1)
- `price_sh_w` → product_prices (customer_type_id=2)
- `price_sh_d` → product_prices (customer_type_id=3)
- `status` → `is_active`

### Customers (hariltsagch -> customers)
- `ner` → `name`
- `realname` → `real_name`
- `ner2` → `name_2`
- `hariltsagch_id` → `legacy_customer_id`
- `hayg` → `address`
- `utas` → `phone_number`
- `kordinat_x` → `location_latitude`
- `kordinat_y` → `location_longitude`
- `turul` → `customer_type_id`
- `borluulagch_id` → `assigned_agent_id`
- `dvvreg` → `registration_number`
- `noat_tulugch` → `is_vat_payer` (Тийм=true, else=false)
- `tulbur_helber` → `payment_terms`
- `zvg` → `direction`

### Employees (borluulagch -> employees)
- `b_ner` → `name`
- `b_utas` → `phone_number`
- `name` → (username, not stored)
- `pass` → (replaced with default hash)
- Auto-generated: `email` = agent{id}@warehouse.mn

### Suppliers (uildwerlegch -> suppliers)
- `ner` → `name`
- `eng_name`, `hayg`, `utas`, `mail`, `websait` → `contact_info` (combined as text)

### Agent Locations (position -> agent_locations)
- `borluulagch_id` → `agent_id`
- `x` → `latitude`
- `y` → `longitude`
- `timestamp` → NOW()

### Returns (butsaalt -> returns)
- `baraanii_id` → `product_id`
- `baiguullgin_id` → `customer_id`
- `too` → `quantity`
- `negj_une` → `unit_price`
- `ognoo` → `return_date`
- `not_dun` → `notes`

## How to Run

### Option 1: Using Podman Container (Recommended for Development)
```bash
# Run all migrations at once
cat migration_master.sql | podman exec -i warehouse-db-dev psql -U warehouse_user -d warehouse_db

# Or run step by step
cat migration_part1_roles_agents.sql | podman exec -i warehouse-db-dev psql -U warehouse_user -d warehouse_db
cat migration_part6_suppliers.sql | podman exec -i warehouse-db-dev psql -U warehouse_user -d warehouse_db
cat migration_part2_customers.sql | podman exec -i warehouse-db-dev psql -U warehouse_user -d warehouse_db
cat migration_part3_products.sql | podman exec -i warehouse-db-dev psql -U warehouse_user -d warehouse_db
cat migration_part4_locations.sql | podman exec -i warehouse-db-dev psql -U warehouse_user -d warehouse_db
cat migration_part5_returns.sql | podman exec -i warehouse-db-dev psql -U warehouse_user -d warehouse_db
```

**Note:** Use `-i` flag (not `<`) when piping to `podman exec` to pass SQL through stdin.

### Option 2: Direct PostgreSQL Connection
```bash
# Run all migrations at once
psql -U warehouse_user -d warehouse_db -f migration_master.sql

# Or run step by step
psql -U warehouse_user -d warehouse_db -f migration_part1_roles_agents.sql
psql -U warehouse_user -d warehouse_db -f migration_part6_suppliers.sql
psql -U warehouse_user -d warehouse_db -f migration_part2_customers.sql
psql -U warehouse_user -d warehouse_db -f migration_part3_products.sql
psql -U warehouse_user -d warehouse_db -f migration_part4_locations.sql
psql -U warehouse_user -d warehouse_db -f migration_part5_returns.sql
```

### Option 3: Copy Files into Container
```bash
# Copy all migration files into container
podman cp migration_master.sql warehouse-db-dev:/tmp/
podman cp migration_part1_roles_agents.sql warehouse-db-dev:/tmp/
podman cp migration_part6_suppliers.sql warehouse-db-dev:/tmp/
podman cp migration_part2_customers.sql warehouse-db-dev:/tmp/
podman cp migration_part3_products.sql warehouse-db-dev:/tmp/
podman cp migration_part4_locations.sql warehouse-db-dev:/tmp/
podman cp migration_part5_returns.sql warehouse-db-dev:/tmp/

# Execute inside container
podman exec -it warehouse-db-dev psql -U warehouse_user -d warehouse_db -f /tmp/migration_master.sql
```

## Important Notes

### Security
- **All migrated employees have default password hash**
- Users must reset passwords after migration
- Default email format: `agent{id}@warehouse.mn`

### Data Integrity
- Foreign key constraints are enforced
- Records with invalid foreign keys will be skipped (ON CONFLICT DO NOTHING)
- Check PostgreSQL logs for skipped records

### Sequences
- The script automatically resets all ID sequences after migration
- This prevents ID conflicts when inserting new records

### Missing Data
- Some old tables were not migrated (no data or not applicable):
  - `zahialga` (orders) - complex structure, needs manual review
  - `ajilchin` (employees detail) - no data in backup
  - `container`, `cost`, `vldegdel` - not in new schema
  - `niilvvlegch` - appears to be duplicate of `uildwerlegch` (suppliers)

## Verification

After migration, verify the data:

```bash
# Using Podman
podman exec -it warehouse-db-dev psql -U warehouse_user -d warehouse_db -c "
SELECT 'Roles' as table_name, COUNT(*) as count FROM roles
UNION ALL SELECT 'Customer Types', COUNT(*) FROM customer_types
UNION ALL SELECT 'Categories', COUNT(*) FROM categories
UNION ALL SELECT 'Suppliers', COUNT(*) FROM suppliers
UNION ALL SELECT 'Employees', COUNT(*) FROM employees
UNION ALL SELECT 'Customers', COUNT(*) FROM customers
UNION ALL SELECT 'Products', COUNT(*) FROM products
UNION ALL SELECT 'Product Prices', COUNT(*) FROM product_prices
UNION ALL SELECT 'Agent Locations', COUNT(*) FROM agent_locations
UNION ALL SELECT 'Returns', COUNT(*) FROM returns;
"

-- Check for orphaned records (should return 0)
podman exec -it warehouse-db-dev psql -U warehouse_user -d warehouse_db -c "
SELECT COUNT(*) FROM customers WHERE assigned_agent_id IS NOT NULL 
  AND assigned_agent_id NOT IN (SELECT id FROM employees);
"

podman exec -it warehouse-db-dev psql -U warehouse_user -d warehouse_db -c "
SELECT COUNT(*) FROM products WHERE supplier_id IS NOT NULL 
  AND supplier_id NOT IN (SELECT id FROM suppliers);
"
```

### Expected Counts
After successful migration, you should see:
- Roles: 3
- Customer Types: 23
- Categories: 1
- Suppliers: 31
- Employees: 14
- Customers: 332
- Products: 372
- Product Prices: ~1,116
- Agent Locations: 1,873
- Returns: 103

## Troubleshooting

### Foreign Key Violations
If you see foreign key errors:
1. Check that referenced records exist (e.g., agent_id exists in employees)
2. Run parts in order (employees before customers)
3. Review skipped records in PostgreSQL logs

### Encoding Issues
If you see character encoding errors:
- Ensure your database is UTF-8: `SHOW SERVER_ENCODING;`
- The backup file is UTF-8 encoded

### Duplicate Key Errors
If you see duplicate key errors:
- The script uses `ON CONFLICT DO NOTHING` to skip duplicates
- This is safe and expected for re-runs

## Post-Migration Tasks

1. **Update Employee Passwords**
   - All employees need to reset passwords
   - Consider sending password reset emails

2. **Verify Data**
   - Check sample records in each table
   - Verify foreign key relationships
   - Test application functionality

3. **Update Application Config**
   - Update database connection strings
   - Verify environment variables

4. **Backup**
   - Create a backup of the migrated database
   - Keep the old backup for reference

## Support

If you encounter issues:
1. Check PostgreSQL logs: `tail -f /var/log/postgresql/postgresql-*.log`
2. Review the generated SQL files for specific errors
3. Verify your current schema matches the expected schema in `prisma/schema.prisma`
