const fs = require('fs');
const content = fs.readFileSync('C:/Users/User/OneDrive/Desktop/diplom/aguulah (3).sql', 'utf8');

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

const regex = /INSERT INTO\s+`?hariltsagch`?\s*\([^)]+\)\s*VALUES\s*(.*?);/gis;
let blockCount = 0;
let totalRows = 0;
let nonEmptyHariltsagchId = 0;
let nonEmptyExamples = [];
let emptyExamples = [];

for (const match of content.matchAll(regex)) {
  blockCount++;
  const rows = parseAllRows(match[1]);
  totalRows += rows.length;
  for (const row of rows) {
    const vals = parseRowValues(row);
    if (vals.length >= 5) {
      const hid = String(vals[4]).trim();
      if (hid && hid !== 'NULL' && hid !== '') {
        nonEmptyHariltsagchId++;
        if (nonEmptyExamples.length < 5) nonEmptyExamples.push({ id: vals[0], hid });
      } else {
        if (emptyExamples.length < 3) emptyExamples.push({ id: vals[0], hid: vals[1] });
      }
    }
  }
}

console.log('Blocks:', blockCount);
console.log('Total rows:', totalRows);
console.log('Non-empty hariltsagch_id:', nonEmptyHariltsagchId);
console.log('Empty examples:', emptyExamples.slice(0,3));
console.log('Non-empty examples:', nonEmptyExamples.slice(0,5));