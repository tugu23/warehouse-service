const fs = require('fs');
const path = require('path');

const inputPath = process.argv[2] || 'C:\\Users\\User\\Downloads\\aguulah (4).sql';
const outputPath = process.argv[3] || path.resolve(__dirname, '..', 'migration_part10.sql');

function parseMysqlRows(block) {
  const valuesIndex = block.indexOf('VALUES');
  if (valuesIndex === -1) {
    return [];
  }

  const text = block.slice(valuesIndex + 6);
  const rows = [];
  let row = [];
  let field = '';
  let inString = false;
  let escaped = false;
  let started = false;

  function pushField() {
    const raw = field.trim();
    if (!started && raw === '') {
      field = '';
      return;
    }
    if (/^NULL$/i.test(raw)) {
      row.push(null);
    } else if (/^-?\d+(?:\.\d+)?$/.test(raw)) {
      row.push(Number(raw));
    } else {
      row.push(raw);
    }
    field = '';
  }

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];

    if (!started) {
      if (ch === '(') {
        started = true;
        row = [];
        field = '';
      }
      continue;
    }

    if (inString) {
      if (escaped) {
        field += ch;
        escaped = false;
        continue;
      }
      if (ch === '\\') {
        escaped = true;
        continue;
      }
      if (ch === "'") {
        if (text[i + 1] === "'") {
          field += "'";
          i += 1;
          continue;
        }
        inString = false;
        continue;
      }
      field += ch;
      continue;
    }

    if (ch === "'") {
      inString = true;
      continue;
    }

    if (ch === ',') {
      pushField();
      continue;
    }

    if (ch === ')') {
      pushField();
      rows.push(row);
      row = [];
      field = '';
      started = false;
      continue;
    }

    if (!/\s/.test(ch) || field.length > 0) {
      field += ch;
    }
  }

  return rows;
}

function extractBlocks(sql, tableName) {
  const blocks = [];
  const marker = `INSERT INTO \`${tableName}\``;
  const lines = sql.split(/\r?\n/);
  let collecting = false;
  let current = [];

  for (const line of lines) {
    if (!collecting) {
      if (line.startsWith(marker)) {
        collecting = true;
        current = [line];
      }
      continue;
    }

    current.push(line);
    if (line.trim().endsWith(';')) {
      blocks.push(current.join('\n'));
      collecting = false;
      current = [];
    }
  }

  return blocks;
}

function normalizeText(value) {
  if (value == null) return null;
  const s = String(value).trim();
  return s === '' ? null : s;
}

function toBool(value) {
  if (value == null) return false;
  const s = String(value).trim().toLowerCase();
  return s === '1' || s === 'true' || s === 'yes' || s === 'тийм';
}

function toNumber(value) {
  if (value == null || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function sqlValue(value) {
  if (value === null || value === undefined) {
    return 'NULL';
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value);
  }
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }
  return `'${String(value).replace(/'/g, "''")}'`;
}

function mapCustomer(row) {
  const [
    id,
    name,
    realName,
    name2,
    hariltsagchId,
    tulburHelber,
    borluulagchId,
    dvvreg,
    hayg,
    utas,
    noatTulugch,
    kordinatX,
    kordinatY,
    turul,
    zvg,
  ] = row;

  return {
    id: Number(id),
    name: normalizeText(name),
    real_name: normalizeText(realName),
    name_2: normalizeText(name2),
    legacy_customer_id: null,
    address: normalizeText(hayg),
    phone_number: normalizeText(utas),
    location_latitude: toNumber(kordinatY),
    location_longitude: toNumber(kordinatX),
    customer_type_id: toNumber(turul),
    assigned_agent_id: toNumber(borluulagchId),
    registration_number: normalizeText(hariltsagchId),
    is_vat_payer: toBool(noatTulugch),
    payment_terms: normalizeText(tulburHelber),
    direction: normalizeText(zvg),
  };
}

function renderCustomerInsert(customer) {
  return [
    'INSERT INTO customers (',
    '    id, name, real_name, name_2, legacy_customer_id, address, phone_number,',
    '    location_latitude, location_longitude, customer_type_id, assigned_agent_id,',
    '    registration_number, is_vat_payer, payment_terms, direction',
    `) VALUES (${[
      customer.id,
      sqlValue(customer.name),
      sqlValue(customer.real_name),
      sqlValue(customer.name_2),
      sqlValue(customer.legacy_customer_id),
      sqlValue(customer.address),
      sqlValue(customer.phone_number),
      sqlValue(customer.location_latitude),
      sqlValue(customer.location_longitude),
      sqlValue(customer.customer_type_id),
      sqlValue(customer.assigned_agent_id),
      sqlValue(customer.registration_number),
      sqlValue(customer.is_vat_payer),
      sqlValue(customer.payment_terms),
      sqlValue(customer.direction),
    ].join(', ')}) ON CONFLICT (id) DO NOTHING;`,
    '',
  ].join('\n');
}

function main() {
  const sql = fs.readFileSync(inputPath, 'utf8');
  const blocks = extractBlocks(sql, 'hariltsagch');
  const customers = [];

  for (const block of blocks) {
    for (const row of parseMysqlRows(block)) {
      customers.push(mapCustomer(row));
    }
  }

  const output = [];
  output.push('-- Auto-generated customers-only migration from aguulah (4).sql');
  output.push('BEGIN;');
  output.push('');
  output.push('TRUNCATE TABLE customers RESTART IDENTITY CASCADE;');
  output.push('');
  for (const customer of customers) {
    output.push(renderCustomerInsert(customer));
  }
  output.push('COMMIT;');
  output.push('');

  fs.writeFileSync(outputPath, output.join('\n'), 'utf8');
  console.log(`Wrote ${outputPath} with ${customers.length} customers.`);
}

main();
