/**
 * SQL Parser for Legacy Database Migration
 * Extracts INSERT statements from MySQL dump and converts to structured data
 */

import * as fs from 'fs';
import * as readline from 'readline';

interface ParsedTable {
  name: string;
  columns: string[];
  rows: any[][];
}

class SQLParser {
  private tables: Map<string, ParsedTable> = new Map();
  private currentTable: string | null = null;
  private currentColumns: string[] = [];
  private buffer: string = '';

  async parseFile(filePath: string): Promise<Map<string, ParsedTable>> {
    const fileStream = fs.createReadStream(filePath, { encoding: 'utf8' });
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    let lineNumber = 0;
    for await (const line of rl) {
      lineNumber++;
      if (lineNumber % 10000 === 0) {
        console.log(`Processing line ${lineNumber}...`);
      }
      this.processLine(line);
    }

    // Process any remaining buffer
    if (this.buffer) {
      this.processBuffer();
    }

    console.log(`\nParsing complete. Found ${this.tables.size} tables.`);
    for (const [name, table] of this.tables) {
      console.log(`  - ${name}: ${table.rows.length} rows`);
    }

    return this.tables;
  }

  private processLine(line: string): void {
    const trimmed = line.trim();

    // Check for INSERT INTO statement start
    const insertMatch = trimmed.match(/^INSERT INTO `(\w+)` \((.*?)\) VALUES$/);
    if (insertMatch) {
      this.currentTable = insertMatch[1];
      this.currentColumns = insertMatch[2].split(',').map(col => 
        col.trim().replace(/`/g, '')
      );
      
      if (!this.tables.has(this.currentTable)) {
        this.tables.set(this.currentTable, {
          name: this.currentTable,
          columns: this.currentColumns,
          rows: []
        });
      }
      this.buffer = '';
      return;
    }

    // If we're in an INSERT statement, accumulate the line
    if (this.currentTable) {
      this.buffer += line + '\n';

      // Check if this line ends the INSERT statement
      if (trimmed.endsWith(';')) {
        this.processBuffer();
        this.currentTable = null;
        this.buffer = '';
      }
    }
  }

  private processBuffer(): void {
    if (!this.currentTable || !this.buffer) return;

    const table = this.tables.get(this.currentTable);
    if (!table) return;

    try {
      // Parse VALUES clause
      const rows = this.parseValues(this.buffer);
      table.rows.push(...rows);
    } catch (error) {
      console.error(`Error parsing ${this.currentTable}:`, error);
    }
  }

  private parseValues(buffer: string): any[][] {
    const rows: any[][] = [];
    
    // Remove the trailing semicolon and whitespace
    let content = buffer.trim().replace(/;$/, '');
    
    // Find all row tuples (...)
    let depth = 0;
    let currentRow = '';
    let inString = false;
    let escapeNext = false;
    
    for (let i = 0; i < content.length; i++) {
      const char = content[i];
      
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
      
      if (char === "'" && !escapeNext) {
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
          if (depth === 0) {
            // Parse the row
            const values = this.parseRow(currentRow);
            rows.push(values);
            currentRow = '';
            continue;
          }
        } else if (depth === 0 && char === ',') {
          // Skip commas between rows
          continue;
        }
      }
      
      if (depth > 0) {
        currentRow += char;
      }
    }
    
    return rows;
  }

  private parseRow(rowContent: string): any[] {
    const values: any[] = [];
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
        values.push(this.parseValue(current.trim()));
        current = '';
        continue;
      }
      
      current += char;
    }
    
    // Don't forget the last value
    if (current) {
      values.push(this.parseValue(current.trim()));
    }
    
    return values;
  }

  private parseValue(value: string): any {
    if (value === 'NULL' || value === '') {
      return null;
    }
    
    // Remove surrounding quotes if present
    if (value.startsWith("'") && value.endsWith("'")) {
      return value.slice(1, -1);
    }
    
    // Try to parse as number
    if (/^-?\d+$/.test(value)) {
      return parseInt(value, 10);
    }
    
    if (/^-?\d+\.\d+$/.test(value)) {
      return parseFloat(value);
    }
    
    return value;
  }

  saveToJSON(outputDir: string): void {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    for (const [name, table] of this.tables) {
      const filePath = `${outputDir}/${name}.json`;
      fs.writeFileSync(
        filePath,
        JSON.stringify(table, null, 2),
        'utf8'
      );
      console.log(`Saved ${name} to ${filePath}`);
    }
  }
}

// Main execution
async function main() {
  const sqlFilePath = process.argv[2] || '/Users/tuguldur.tu/Downloads/data/127_0_0_1.sql';
  const outputDir = process.argv[3] || '/Users/tuguldur.tu/warehouse-service/prisma/parsed-data';

  console.log('Starting SQL parse...');
  console.log(`Input: ${sqlFilePath}`);
  console.log(`Output: ${outputDir}\n`);

  const parser = new SQLParser();
  await parser.parseFile(sqlFilePath);
  parser.saveToJSON(outputDir);

  console.log('\nParsing complete!');
}

main().catch(console.error);

