#!/usr/bin/env python3
"""
Comprehensive Migration Data Cleanup Script v2
Handles all edge cases for PostgreSQL compatibility
"""

import re
import sys
from pathlib import Path

def clean_migration_file(filename):
    """Clean a single migration SQL file"""
    print(f"\n{'='*60}")
    print(f"Processing: {filename}")
    print('='*60)
    
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_size = len(content)
        changes = []
        
        # 1. Fix Cyrillic+number patterns in legacy_customer_id (invalid integers)
        pattern1 = r"'[А-ЯЁа-яё]{2,}[0-9]+'"
        matches1 = len(re.findall(pattern1, content))
        if matches1 > 0:
            content = re.sub(pattern1, 'NULL', content)
            changes.append(f"  ✓ Replaced {matches1} Cyrillic+number IDs with NULL")
        
        # 2. Fix single character values that are not valid (like ',', 'X', 'Y', 'x', 'y')
        # But preserve valid single characters in text fields
        invalid_single_chars = [',', 'X', 'Y', 'x', 'y']
        for char in invalid_single_chars:
            pattern = f"'{char}'"
            count = content.count(pattern)
            if count > 0:
                content = content.replace(pattern, 'NULL')
                changes.append(f"  ✓ Replaced {count} '{char}' values with NULL")
        
        # 3. Fix empty strings in VALUES clauses
        # Process line by line to avoid breaking SQL structure
        lines = content.split('\n')
        result = []
        in_values = False
        empty_string_count = 0
        
        for line in lines:
            # Track if we're in a VALUES clause
            if 'VALUES (' in line:
                in_values = True
            elif ');' in line and in_values:
                in_values = False
            
            # Only process lines within VALUES clauses
            if in_values or 'VALUES (' in line:
                # Count empty strings before replacement
                before_count = line.count("''")
                
                # Replace empty strings with NULL, but be careful with commas
                # Pattern: , '', or ('', or , '') but not inside other strings
                line = re.sub(r",\s*''\s*,", ', NULL,', line)
                line = re.sub(r"\(\s*''\s*,", '(NULL,', line)
                line = re.sub(r",\s*''\s*\)", ', NULL)', line)
                
                after_count = line.count("''")
                empty_string_count += (before_count - after_count)
            
            result.append(line)
        
        if empty_string_count > 0:
            changes.append(f"  ✓ Replaced {empty_string_count} empty strings with NULL")
        
        content = '\n'.join(result)
        
        # 4. Fix NULL names in required fields
        if 'customers' in filename:
            # Pattern: (id, NULL, where NULL is the name field
            pattern4 = r"(\(\s*\d+\s*,\s*)NULL(\s*,)"
            matches4 = len(re.findall(pattern4, content))
            if matches4 > 0:
                content = re.sub(pattern4, r"\1'Unknown Customer'\2", content)
                changes.append(f"  ✓ Fixed {matches4} NULL customer names")
        
        if 'products' in filename:
            pattern5 = r"(\(\s*\d+\s*,\s*)NULL(\s*,)"
            matches5 = len(re.findall(pattern5, content))
            if matches5 > 0:
                content = re.sub(pattern5, r"\1'Unknown Product'\2", content)
                changes.append(f"  ✓ Fixed {matches5} NULL product names")
        
        # 5. Fix customer_types with NULL type_name
        if 'customer_types' in filename or 'part1' in filename:
            pattern6 = r"(customer_types\s*\([^)]+\)\s*VALUES\s*\(\d+,\s*)NULL(\s*\))"
            matches6 = len(re.findall(pattern6, content))
            if matches6 > 0:
                content = re.sub(pattern6, r"\1'Unknown Type'\2", content)
                changes.append(f"  ✓ Fixed {matches6} NULL customer type names")
        
        # Write cleaned content
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)
        
        new_size = len(content)
        size_diff = original_size - new_size
        
        print(f"\n📊 Summary:")
        if changes:
            for change in changes:
                print(change)
        else:
            print("  ℹ️  No changes needed")
        
        print(f"\n📏 File size: {original_size:,} → {new_size:,} bytes ({size_diff:+,})")
        print(f"✅ Successfully cleaned: {filename}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error processing {filename}: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    """Main cleanup process"""
    print("\n" + "="*60)
    print("🧹 MIGRATION DATA CLEANUP SCRIPT V2")
    print("="*60)
    
    # Define migration files to clean
    migration_files = [
        'migration_part1_roles_agents_COMPLETE.sql',
        'migration_part2_suppliers_COMPLETE.sql',
        'migration_part3_customers_COMPLETE.sql',
        'migration_part4_products_COMPLETE.sql',
        'migration_part5_prices_COMPLETE.sql',
    ]
    
    # Check if files exist
    existing_files = []
    missing_files = []
    
    for filename in migration_files:
        if Path(filename).exists():
            existing_files.append(filename)
        else:
            missing_files.append(filename)
    
    if missing_files:
        print("\n⚠️  Warning: Some files not found:")
        for f in missing_files:
            print(f"  - {f}")
    
    if not existing_files:
        print("\n❌ No migration files found!")
        print("Make sure you're running this script from the warehouse-service directory.")
        return 1
    
    print(f"\n📁 Found {len(existing_files)} migration files to clean")
    
    # Process each file
    success_count = 0
    for filename in existing_files:
        if clean_migration_file(filename):
            success_count += 1
    
    # Final summary
    print("\n" + "="*60)
    print("🎉 CLEANUP COMPLETE")
    print("="*60)
    print(f"✅ Successfully cleaned: {success_count}/{len(existing_files)} files")
    
    if success_count == len(existing_files):
        print("\n✨ All migration files are now ready!")
        print("\n📋 Next steps:")
        print("  1. Copy files to container:")
        print("     cd ~/warehouse-service")
        print("     podman cp migration_part*.sql warehouse-db:/tmp/")
        print("\n  2. Run the migration:")
        print("     podman exec -w /tmp warehouse-db psql -U warehouse_user -d warehouse_db -f migration_PRODUCTION_READY.sql")
        return 0
    else:
        print(f"\n⚠️  {len(existing_files) - success_count} file(s) had errors")
        return 1

if __name__ == '__main__':
    sys.exit(main())
