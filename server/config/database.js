import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, '..', 'database', 'journal.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Enable WAL mode for better concurrent read/write performance
db.pragma('journal_mode = WAL');

export function initializeDatabase() {
  const schemaPath = join(__dirname, '..', 'database', 'schema.sql');
  const schema = readFileSync(schemaPath, 'utf-8');
  db.exec(schema);

  // Migration: Add entry_number column if it doesn't exist
  const columns = db.prepare("PRAGMA table_info(entries)").all();
  const hasEntryNumber = columns.some(col => col.name === 'entry_number');
  if (!hasEntryNumber) {
    db.exec('ALTER TABLE entries ADD COLUMN entry_number INTEGER DEFAULT 0');
    console.log('Migration: Added entry_number column to entries table');
  }

  console.log('Database initialized');
}

export default db;
