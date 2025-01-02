import { app } from "electron";
import fs from "fs";
import path from "path";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const sqlite3 = require("sqlite3").verbose();

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

if (!fs.existsSync(path.join(targetPath, "database/database.db"))) {
  fs.writeFileSync(path.join(targetPath, "database/database.db"), "");
}

const db = new sqlite3.Database(dbPath);

db.serialize(function () {
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
  );`);

  // Create triggers
  db.run(`CREATE TRIGGER if not exists after_vocabulary_delete
  AFTER DELETE ON vocabulary
  FOR EACH ROW
  BEGIN
      DELETE FROM reviews WHERE reviews.vocabulary_id = OLD.vocabulary_id;
  END;`);

  db.run(`CREATE TRIGGER if not exists after_vocabulary_delete
    AFTER DELETE ON vocabulary
    FOR EACH ROW
    BEGIN
        DELETE FROM reviews_history WHERE reviews_history.vocabulary_id = OLD.vocabulary_id;
    END;`);

  db.run(
    `CREATE TRIGGER if not exists after_vocabulary_insert
    AFTER INSERT ON vocabulary FOR EACH ROW
  BEGIN
    INSERT INTO reviews (vocabulary_id, review_date, ease_factor, repetition)
    VALUES (NEW.vocabulary_id, datetime('now'), 2.5, 1);
  END;`,
  );

  // Create indexes
  db.run(
    `CREATE INDEX IF NOT EXISTS idx_deck_position ON decks(deck_position DESC)`,
  );

  db.run(
    `CREATE INDEX IF NOT EXISTS idx_vocabulary_deck_id ON vocabulary(deck_id)`,
  );

  db.run(
    `CREATE INDEX IF NOT EXISTS idx_vocabulary_front_word ON vocabulary(front_word)`,
  );

  db.run(
    `CREATE INDEX IF NOT EXISTS idx_vocabulary_audio_content ON vocabulary(audio_name, front_desc_html, back_desc_html)`,
  );

  db.run(
    `CREATE INDEX IF NOT EXISTS idx_reviews_vocabulary_id ON reviews(vocabulary_id)`,
  );

  db.run(
    `CREATE INDEX IF NOT EXISTS idx_reviews_date_repetition ON reviews(review_date, repetition)`,
  );

  db.run(
    `CREATE INDEX IF NOT EXISTS idx_reviews_ease_repetition ON reviews(ease_factor, repetition)`,
  );

  db.run(
    `CREATE INDEX IF NOT EXISTS idx_reviews_history_vocabulary ON reviews_history(vocabulary_id)`,
  );

  db.run(
    `CREATE INDEX IF NOT EXISTS idx_reviews_history_date ON reviews_history(review_date)`,
  );
});

export default db;
