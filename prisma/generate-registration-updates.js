/**
 * Parse legacy SQL file and generate UPDATE statements for registration_number
 * Usage: node generate-registration-updates.js "path/to/file.sql"
 */

const fs = require('fs');
const path = require('path');

const filePath = process.argv[2];
if (!filePath) {
  console.error('Usage: node generate-registration-updates.js <sql-file-path>');
  process.exit(1);
}

const content = fs.readFileSync(filePath, 'utf8');

// Find all INSERT INTO `hariltsagch` blocks
const insertRegex = /INSERT INTO\s+`?hariltsagch`?\s*\([^)]+\)\s*VALUES\s*(.*?);/gis;
const matches = content.matchAll(insertRegex);

let updates = [];

for (const match of matches) {
  const valuesBlock = match[1];

  // Find all row tuples
  let depth = 0;
  let currentRow = '';
  let inString = false;
  let escapeNext = false;
  let rows = [];

  for (let i = 0; i < valuesBlock.length; i++) {
    const char = valuesBlock[i];

    if (escapeNext) {
      currentRow += char;
      escapeNext = false;
      continue;
    }

    if (char === '\\') {
      escapeNext = true;
      currentRow += char;
      continue;
    }

    if (char === "'") {
      inString = !inString;
      currentRow += char;
      continue;
    }

    if (!inString) {
      if (char === '(') {
        depth++;
        if (depth === 1) {
          currentRow = '';
          continue;
        }
      } else if (char === ')') {
        depth--;
        if (depth === 0 && currentRow.trim()) {
          rows.push(currentRow.trim());
          currentRow = '';
          continue;
        }
      }
    }

    if (depth > 0) {
      currentRow += char;
    }
  }

  // Parse each row: id (0), ner (1), realname (2), ner2 (3), hariltsagch_id (4)
  for (const row of rows) {
    const values = parseRow(row);
    if (values.length < 5) continue;

    const legacyId = values[0];   // id
    const name = values[1];        // ner
    const hariltsagchId = values[4]; // hariltsagch_id

    if (legacyId && hariltsagchId) {
      const cleanValue = String(hariltsagchId).trim();
      if (cleanValue && cleanValue !== 'NULL' && cleanValue !== '') {
        updates.push({
          legacyId: parseInt(legacyId),
          hariltsagchId: cleanValue,
          name: name
        });
      }
    }
  }
}

function parseRow(rowContent) {
  const values = [];
  let current = '';
  let inString = false;
  let escapeNext = false;

  for (let i = 0; i < rowContent.length; i++) {
    const char = rowContent[i];

    if (escapeNext) {
      current += char;
      escapeNext = false;
      continue;
    }

    if (char === '\\') {
      escapeNext = true;
      continue;
    }

    if (char === "'") {
      inString = !inString;
      continue;
    }

    if (!inString && char === ',') {
      values.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  if (current) {
    values.push(current.trim());
  }

  return values;
}

// Output SQL
console.log(`-- Generated ${updates.length} registration number updates`);
console.log('-- Run this in PostgreSQL to update registration_number from legacy hariltsagch_id\n');

for (const update of updates) {
  console.log(`UPDATE customers SET registration_number = '${update.hariltsagchId.replace(/'/g, "''")}' WHERE legacy_customer_id = ${update.legacyId};`);
}

// Also save to file
const outputPath = path.join(__dirname, 'registration-updates.sql');
fs.writeFileSync(outputPath, `-- Generated ${updates.length} updates\n\n`);
for (const update of updates) {
  fs.appendFileSync(outputPath, `UPDATE customers SET registration_number = '${update.hariltsagchId.replace(/'/g, "''")}' WHERE legacy_customer_id = ${update.legacyId};\n`);
}

console.log(`\nSaved to: ${outputPath}`);
console.log('\nRun: podman exec -i warehouse-db-dev psql -U warehouse_user -d warehouse_db < registration-updates.sql');