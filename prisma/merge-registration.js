/**
 * Merge hariltsagch_id from aguulah.sql into migration_part3_customers_COMPLETE.sql
 * Replaces NULL registration_number with hariltsagch_id from aguulah.sql
 */

const fs = require('fs');

const aguulahFile = 'C:/Users/User/OneDrive/Desktop/diplom/aguulah (3).sql';
const migrationFile = 'C:/Users/User/OneDrive/Desktop/diplom/warehouse-service/migration_part3_customers_COMPLETE.sql';

// 1. Parse hariltsagch_id from aguulah.sql (id -> hariltsagch_id)
const aguulahContent = fs.readFileSync(aguulahFile, 'utf8');
const idMap = new Map();

function parseAllRows(valuesBlock) {
  const rows = [];
  let depth = 0;
  let currentRow = '';
  let inString = false;
  let escapeNext = false;

  for (let i = 0; i < valuesBlock.length; i++) {
    const char = valuesBlock[i];
    if (escapeNext) { currentRow += char; escapeNext = false; continue; }
    if (char === '\\') { escapeNext = true; currentRow += char; continue; }
    if (char === "'") { inString = !inString; currentRow += char; continue; }
    if (!inString) {
      if (char === '(') { depth++; if (depth === 1) { currentRow = ''; continue; } }
      else if (char === ')') { depth--; if (depth === 0 && currentRow.trim()) { rows.push(currentRow.trim()); currentRow = ''; continue; } }
    }
    if (depth > 0) currentRow += char;
  }
  return rows;
}

function parseRowValues(rowContent) {
  const values = [];
  let current = '';
  let inString = false;
  let escapeNext = false;
  for (let i = 0; i < rowContent.length; i++) {
    const char = rowContent[i];
    if (escapeNext) { current += char; escapeNext = false; continue; }
    if (char === '\\') { escapeNext = true; continue; }
    if (char === "'") { inString = !inString; continue; }
    if (!inString && char === ',') { values.push(current.trim()); current = ''; continue; }
    current += char;
  }
  if (current) values.push(current.trim());
  return values;
}

const aguulahRegex = /INSERT INTO\s+`?hariltsagch`?\s*\([^)]+\)\s*VALUES\s*(.*?);/gis;
for (const match of aguulahContent.matchAll(aguulahRegex)) {
  const rows = parseAllRows(match[1]);
  for (const row of rows) {
    const vals = parseRowValues(row);
    if (vals.length >= 5) {
      const id = parseInt(vals[0]);
      const hariltsagchId = String(vals[4]).trim();
      if (id && hariltsagchId && hariltsagchId !== 'NULL' && hariltsagchId !== '') {
        idMap.set(id, hariltsagchId);
      }
    }
  }
}

console.log(`Parsed ${idMap.size} hariltsagch_id values from aguulah.sql`);

// 2. Fix migration file - process line by line, finding and replacing field 12 (registration_number)
let content = fs.readFileSync(migrationFile, 'utf8');
let fixedCount = 0;
let skippedCount = 0;
let notFoundCount = 0;

const lines = content.split('\n');
const newLines = [];

for (const line of lines) {
  // Extract id from VALUES (id, ...)
  const idMatch = line.match(/VALUES\s*\(\s*(\d+)/);
  if (!idMatch) {
    newLines.push(line);
    continue;
  }

  const id = parseInt(idMatch[1]);
  const hariltsagchId = idMap.get(id);

  if (!hariltsagchId) {
    newLines.push(line);
    notFoundCount++;
    continue;
  }

  // We'll manually find and replace the registration_number field
  // Fields: id(0), name(1), real_name(2), name_2(3), legacy_customer_id(4),
  //         address(5), phone_number(6), location_latitude(7), location_longitude(8),
  //         customer_type_id(9), assigned_agent_id(10), registration_number(11),
  //         is_vat_payer(12), payment_terms(13), direction(14)
  // We want field 12 (registration_number, index 11)

  const valsStart = line.indexOf('VALUES (');
  if (valsStart === -1) {
    newLines.push(line);
    continue;
  }

  // Walk through the VALUES (...) section counting fields
  let fieldIdx = 0;
  let inString = false;
  let escapeNext = false;
  let i = valsStart + 7; // start after "VALUES ("
  let newLine = line;
  let replaced = false;

  while (i < line.length) {
    const char = line[i];

    if (escapeNext) { escapeNext = false; i++; continue; }
    if (char === '\\') { escapeNext = true; i++; continue; }
    if (char === "'" && !escapeNext) { inString = !inString; i++; continue; }

    if (!inString) {
      if (char === '(') { i++; continue; }

      if (char === ',') {
        fieldIdx++;
        // After comma 11 (field 11 done), the next field is field 12 (registration_number)
        // We need to find the start and end of field 12
        if (fieldIdx === 11) {
          // fieldIdx=11 means we just passed comma 11, now at start of field 12 (registration_number)
          // Find the end of field 12 (comma 12 or closing paren)
          const fieldStart = i + 1;
          let depth = 0;
          let isStr = false;
          let esc = false;
          let fieldEnd = -1;

          for (let j = i + 1; j < line.length; j++) {
            const c = line[j];
            if (esc) { esc = false; continue; }
            if (c === '\\') { esc = true; continue; }
            if (c === "'" && !esc) { isStr = !isStr; continue; }
            if (isStr) continue;
            if (c === '(') depth++;
            if (c === ')') {
              if (depth === 0) { fieldEnd = j; break; }
              depth--;
            }
            if (c === ',') {
              if (depth === 0) { fieldEnd = j; break; }
            }
          }

          if (fieldEnd !== -1) {
            const currentVal = line.substring(fieldStart, fieldEnd).trim();
            if (currentVal === 'NULL' || currentVal === '') {
              // Replace with hariltsagch_id
              newLine = line.substring(0, fieldStart) + "'" + hariltsagchId.replace(/'/g, "''") + "'" + line.substring(fieldEnd);
              replaced = true;
            } else {
              // Already has value - skip
            }
          }
          break;
        }
      }
    }
    i++;
  }

  if (replaced) fixedCount++;
  else if (hariltsagchId) skippedCount++;

  newLines.push(newLine);
}

const outputFile = migrationFile.replace('.sql', '_with_reg_fixed.sql');
fs.writeFileSync(outputFile, newLines.join('\n'));

console.log(`Fixed ${fixedCount} NULL registration_number values`);
console.log(`Skipped (already has value or not in aguulah): ${skippedCount + notFoundCount}`);
console.log(`\nSaved to: ${outputFile}`);
console.log('\nRun: podman exec -i warehouse-db-dev psql -U warehouse_user -d warehouse_db < migration_part3_customers_COMPLETE_with_reg_fixed.sql');