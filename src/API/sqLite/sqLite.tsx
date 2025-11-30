import { app } from "electron";
import fs from "fs";
import path from "path";

// Use sql.js with asm.js fallback (no WASM needed)
// eslint-disable-next-line @typescript-eslint/no-var-requires
const initSqlJs = require("sql.js/dist/sql-asm.js");

type Database = {
  run: (sql: string, params?: unknown[]) => void;
  exec: (sql: string) => { columns: string[]; values: unknown[][] }[];
  prepare: (sql: string) => {
    bind: (params: unknown[]) => void;
    step: () => boolean;
    getAsObject: () => Record<string, unknown>;
    free: () => void;
  };
  export: () => Uint8Array;
};

const appPath = app.getAppPath();
const dbPath = path.join(appPath, "dataResources", "database", "database.db");

const dirName = "dataResources";

const targetPath = path.join(appPath, dirName);
if (!fs.existsSync(targetPath)) {
  fs.mkdirSync(targetPath, { recursive: true });
}

if (!fs.existsSync(path.join(targetPath, "database"))) {
  fs.mkdirSync(path.join(targetPath, "database"));
}

let db: Database;

// Helper function to save database to file
function saveDatabase() {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  }
}

// Initialize database
async function initDatabase(): Promise<Database> {
  let SQL: any;
  try {
    // sql-asm.js doesn't need WASM binary, it uses asm.js
    SQL = await initSqlJs();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("Failed to initialize sql.js:", e);
    throw e;
  }
  
  let existingData: Buffer | null = null;
  if (fs.existsSync(dbPath)) {
    const fileContent = fs.readFileSync(dbPath);
    if (fileContent.length > 0) {
      existingData = fileContent;
    }
  }
  
  if (existingData) {
    db = new SQL.Database(new Uint8Array(existingData));
  } else {
    db = new SQL.Database();
  }

  // Create tables
  db.run(`CREATE TABLE if not exists decks (
    deck_id INTEGER PRIMARY KEY AUTOINCREMENT,
    deck_name TEXT NOT NULL,
    deck_img TEXT,
    deck_position INTEGER
  )`);

  db.run(`CREATE TABLE if not exists vocabulary (
    vocabulary_id INTEGER PRIMARY KEY AUTOINCREMENT,
    deck_id INTEGER NOT NULL,
    front_word TEXT NOT NULL,
    back_word TEXT NOT NULL,
    audio_name TEXT,
    front_word_html TEXT,
    back_word_html  TEXT,
    front_desc_html TEXT,
    back_desc_html  TEXT,
    FOREIGN KEY (deck_id) REFERENCES decks (deck_id) 
  )`);

  db.run(`CREATE TABLE if not exists reviews (
    review_id INTEGER PRIMARY KEY AUTOINCREMENT,
    vocabulary_id INTEGER NOT NULL,
    review_date TEXT NOT NULL,
    ease_factor NUMERIC NOT NULL DEFAULT 2.5,
    repetition INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (vocabulary_id) REFERENCES vocabulary(vocabulary_id)
  )`);

  db.run(`CREATE TABLE if not exists reviews_history (
    review_history_id INTEGER PRIMARY KEY AUTOINCREMENT,
    vocabulary_id INTEGER REFERENCES vocabulary (vocabulary_id) NOT NULL,
    ease_factor NUMERIC NOT NULL,
    quality INTEGER NOT NULL,
    repetition INTEGER NOT NULL DEFAULT 1,
    review_date TEXT NOT NULL
  )`);

  // Create triggers
  db.run(`CREATE TRIGGER if not exists after_vocabulary_delete_reviews
  AFTER DELETE ON vocabulary
  FOR EACH ROW
  BEGIN
      DELETE FROM reviews WHERE reviews.vocabulary_id = OLD.vocabulary_id;
  END`);

  db.run(`CREATE TRIGGER if not exists after_vocabulary_delete_history
  AFTER DELETE ON vocabulary
  FOR EACH ROW
  BEGIN
      DELETE FROM reviews_history WHERE reviews_history.vocabulary_id = OLD.vocabulary_id;
  END`);

  db.run(`CREATE TRIGGER if not exists after_vocabulary_insert
  AFTER INSERT ON vocabulary FOR EACH ROW
  BEGIN
    INSERT INTO reviews (vocabulary_id, review_date, ease_factor, repetition)
    VALUES (NEW.vocabulary_id, datetime('now'), 2.5, 1);
  END`);

  // Create indexes
  db.run(`CREATE INDEX IF NOT EXISTS idx_deck_position ON decks(deck_position DESC)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_vocabulary_deck_id ON vocabulary(deck_id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_vocabulary_front_word ON vocabulary(front_word)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_vocabulary_audio_content ON vocabulary(audio_name, front_desc_html, back_desc_html)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_reviews_vocabulary_id ON reviews(vocabulary_id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_reviews_date_repetition ON reviews(review_date, repetition)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_reviews_ease_repetition ON reviews(ease_factor, repetition)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_reviews_history_vocabulary ON reviews_history(vocabulary_id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_reviews_history_date ON reviews_history(review_date)`);

  // Save initial database
  saveDatabase();

  return db;
}

// Promise that resolves when database is ready
const dbReady = initDatabase();

// Helper to get database instance
export async function getDb(): Promise<Database> {
  await dbReady;
  return db;
}

// Export save function for use after modifications
export { saveDatabase };

export default dbReady;
