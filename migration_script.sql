-- Migration Script from Old MySQL Database to New PostgreSQL Schema
-- Generated: 2026-04-19
-- This script maps old system tables to new schema

-- ============================================
-- STEP 1: Create temporary mapping tables
-- ============================================

-- Store old IDs for reference mapping
CREATE TEMP TABLE IF NOT EXISTS temp_product_mapping (
    old_id INT,
    new_id INT
);

CREATE TEMP TABLE IF NOT EXISTS temp_customer_mapping (
    old_id INT,
    new_id INT
);

CREATE TEMP TABLE IF NOT EXISTS temp_agent_mapping (
    old_id INT,
    new_id INT
);

CREATE TEMP TABLE IF NOT EXISTS temp_supplier_mapping (
    old_id INT,
    new_id INT
);

CREATE TEMP TABLE IF NOT EXISTS temp_category_mapping (
    old_id INT,
    new_id INT
);

-- ============================================
-- STEP 2: Extract and prepare data from backup
-- ============================================
-- Note: This script will be generated table by table
-- Run each section separately to handle dependencies

