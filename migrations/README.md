# Migration SQL Files Summary

## Overview
Migration files generated from `aguulah (2) (1).sql` (MySQL) to new PostgreSQL schema.

## Files Created

| File | Description | Records |
|------|-------------|---------|
| `001_migration_part1_roles_agents.sql` | Roles, Categories, Customer Types, Employees | 3 roles + 25 types + 15 employees |
| `002_migration_part2_suppliers.sql` | Suppliers | 33 suppliers |
| `003_migration_part3_products.sql` | Products | 517 products |
| `004_migration_part4_customers.sql` | Customers | 3765 customers |
| `005_migration_part5_product_prices.sql` | Product Prices | 1624 prices |
| `MIGRATION_MASTER.sql` | Master script (runs all parts) | - |

## Data Mapping

### Products (baraa -> products)
| Original (MySQL) | New (PostgreSQL) |
|-----------------|------------------|
| id | id |
| mon_ner | name_mongolian |
| eng_ner | name_english |
| ko_ner | name_korean |
| code | product_code |
| company | supplier_id |
| turul | category_id |
| bar_code | barcode |
| khairtsag | units_per_box |
| tsewer_jin | net_weight |
| bohir_jin | gross_weight |
| price_sh_d | default_price |
| status | is_active |

### Customers (hariltsagch -> customers)
| Original (MySQL) | New (PostgreSQL) |
|-----------------|------------------|
| id | id (legacy) |
| ner | name |
| realname | real_name |
| ner2 | name_2 |
| hariltsagch_id | registration_number |
| hayg | address |
| utas | phone_number (with +976 prefix) |
| noat_tulugch | is_vat_payer |
| tulbur_helber | payment_terms |
| borluulagch_id | assigned_agent_id |
| turul | customer_type_id |
| dvvreg | district |
| kordinat_x | location_latitude |
| kordinat_y | location_longitude |
| zvg | direction |

### Product Prices (vne -> product_prices)
| Original (MySQL) | New (PostgreSQL) |
|-----------------|------------------|
| baraanii_id | product_id |
| turul_id | customer_type_id |
| vne | price |

## Schema Mapping

### Original MySQL Tables
1. `ajilchin` - Employee/staff (not migrated - legacy table)
2. `baraa` - Products -> migrated to `products`
3. `borluulagch` - Agents -> migrated to `employees`
4. `hariltsagch` - Customers -> migrated to `customers`
5. `vne` - Prices -> migrated to `product_prices`

### New PostgreSQL Tables
1. `roles` - Role definitions (Admin, Manager, Agent)
2. `categories` - Product categories (only "All" category migrated)
3. `customer_types` - Customer type definitions (25 types)
4. `employees` - System users (1 admin + 14 agents)
5. `suppliers` - Product suppliers (33 suppliers)
6. `products` - Product catalog (517 products)
7. `customers` - Customer database (3765 customers)
8. `product_prices` - Customer-type specific pricing (1624 records)

## Known Issues

### 1. Missing Products
Some products from the original `baraa` table may not have been migrated due to:
- Missing or invalid IDs
- Missing product names

### 2. Category Mapping
Only category_id 12 ("Бүх бараа"/"All Products") was migrated. Other categories in the original system were not extracted.

### 3. Agent IDs
Agent IDs in the new system match the original `borluulagch.id` values (6-19), not sequential IDs.

### 4. Customer IDs
Customer IDs match the original `hariltsagch.id` values (10903-14672).

## Usage

### Prerequisites
1. Ensure PostgreSQL database is created
2. Run Prisma migrations first to create schema:
   ```bash
   cd /path/to/warehouse-service
   npx prisma migrate deploy
   ```

### Running Migration
```bash
cd /path/to/warehouse-service/migrations

# Run master script
psql -U postgres -d warehouse_db -f MIGRATION_MASTER.sql

# Or run parts individually
psql -U postgres -d warehouse_db -f 001_migration_part1_roles_agents.sql
psql -U postgres -d warehouse_db -f 002_migration_part2_suppliers.sql
psql -U postgres -d warehouse_db -f 003_migration_part3_products.sql
psql -U postgres -d warehouse_db -f 004_migration_part4_customers.sql
psql -U postgres -d warehouse_db -f 005_migration_part5_product_prices.sql
```

### Verification
After migration, run the verification queries in `MIGRATION_MASTER.sql` to check:
- Record counts match expected values
- No orphaned foreign keys
- Customer type distribution
- Supplier distribution

## Default Credentials
- Admin: `admin@warehouse.com` (password: admin123 - MUST BE CHANGED)
- Agents: `agent{id}@warehouse.com` (password: agent123 - MUST BE CHANGED)

## Files Generated (JSON - for reference)
- `products_raw.json` - 517 parsed products
- `customers_raw.json` - 3765 parsed customers
- `prices_raw.json` - 1700 parsed prices
