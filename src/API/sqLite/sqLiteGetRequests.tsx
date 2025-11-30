import { ipcMain } from "electron";

import {
  GetDeckWithCountType,
  GetVocabularyToReview,
  ReviewsHistory,
  VocabularyType,
} from "../../types/APITypes";
import { getDb } from "./sqLite";

// Helper function to convert sql.js result to array of objects
function resultToObjects<T>(result: { columns: string[]; values: unknown[][] }[]): T[] {
  if (!result || result.length === 0) return [];
  const { columns, values } = result[0];
  return values.map((row) => {
    const obj: Record<string, unknown> = {};
    columns.forEach((col, i) => {
      obj[col] = row[i];
    });
    return obj as T;
  });
}

export default function sqLiteGetRequests() {
  ipcMain.handle("get-decks", async () => {
    try {
      const db = await getDb();
      const result = db.exec(`SELECT decks.*,
        CASE 
          WHEN COALESCE(SUM(CASE WHEN reviews.repetition = 1 THEN 1 ELSE 0 END), 0) > 999 
          THEN '+999'
          ELSE CAST(COALESCE(SUM(CASE WHEN reviews.repetition = 1 THEN 1 ELSE 0 END), 0) AS CHAR)
        END AS new,
        CASE 
          WHEN COALESCE(SUM(CASE WHEN reviews.repetition > 1 AND julianday('now') >= julianday(reviews.review_date) THEN 1 ELSE 0 END), 0) > 999 
          THEN '+999'
          ELSE CAST(COALESCE(SUM(CASE WHEN reviews.repetition > 1 AND julianday('now') >= julianday(reviews.review_date) THEN 1 ELSE 0 END), 0) AS CHAR)
        END AS review,
        COUNT(vocabulary.vocabulary_id) AS total_words,
        CAST(COALESCE(SUM(CASE WHEN reviews.repetition >= 3 AND reviews.ease_factor >= 2.5 THEN 1 ELSE 0 END), 0) AS CHAR) AS learned_words
      FROM decks
      LEFT JOIN vocabulary ON vocabulary.deck_id = decks.deck_id 
      LEFT JOIN reviews ON reviews.vocabulary_id = vocabulary.vocabulary_id
      GROUP BY decks.deck_id
      ORDER BY deck_position DESC`);
      return resultToObjects<GetDeckWithCountType>(result);
    } catch (err) {
      throw new Error("Database error: " + (err as Error).message);
    }
  });

  ipcMain.handle("get-vocabulary-to-delete-deck", async (_event, data) => {
    try {
      const db = await getDb();
      const { deckId } = data;
      const stmt = db.prepare(`SELECT vocabulary.* FROM vocabulary 
        WHERE vocabulary.deck_id = ?`);
      stmt.bind([deckId]);
      const rows: VocabularyType[] = [];
      while (stmt.step()) {
        rows.push(stmt.getAsObject() as unknown as VocabularyType);
      }
      stmt.free();
      return rows;
    } catch (err) {
      throw new Error("Database error: " + (err as Error).message);
    }
  });

  ipcMain.handle("get-vocabulary-to-browse", async (_event, data) => {
    try {
      const db = await getDb();
      const { deckId, limit, offset, search } = data;
      const stmt = db.prepare(`SELECT vocabulary.*, decks.deck_name FROM vocabulary
        JOIN decks ON decks.deck_id = vocabulary.deck_id
        WHERE (vocabulary.deck_id = ? OR ? = 0) AND (vocabulary.front_word LIKE ?)
        LIMIT ? OFFSET ?`);
      stmt.bind([deckId, deckId, search, limit, offset]);
      const rows: VocabularyType[] = [];
      while (stmt.step()) {
        rows.push(stmt.getAsObject() as unknown as VocabularyType);
      }
      stmt.free();
      return rows;
    } catch (err) {
      throw new Error("Database error: " + (err as Error).message);
    }
  });

  ipcMain.handle("get-vocabulary-to-remove-deck", async (_event, data) => {
    try {
      const db = await getDb();
      const { deckId } = data;
      const stmt = db.prepare(`SELECT vocabulary.* FROM vocabulary
        JOIN decks ON decks.deck_id = vocabulary.deck_id
        WHERE vocabulary.deck_id = ?`);
      stmt.bind([deckId]);
      const rows: VocabularyType[] = [];
      while (stmt.step()) {
        rows.push(stmt.getAsObject() as unknown as VocabularyType);
      }
      stmt.free();
      return rows;
    } catch (err) {
      throw new Error("Database error: " + (err as Error).message);
    }
  });

  ipcMain.handle("check-if-img-or-audio-exists", async (_event, data) => {
    try {
      const db = await getDb();
      const { vocabularyId, html } = data;
      const stmt = db.prepare(`SELECT IIF(COUNT(vocabulary.vocabulary_id) > 0, 1, 0) AS count FROM vocabulary 
        WHERE vocabulary.vocabulary_id != ? AND (
        vocabulary.audio_name LIKE ? OR 
        vocabulary.front_desc_html LIKE ? OR 
        vocabulary.back_desc_html LIKE ?)`);
      stmt.bind([vocabularyId, html, html, html]);
      const rows: unknown[] = [];
      while (stmt.step()) {
        rows.push(stmt.getAsObject());
      }
      stmt.free();
      return rows;
    } catch (err) {
      throw new Error("Database error: " + (err as Error).message);
    }
  });

  ipcMain.handle("get-vocabulary-to-review", async (_event, data) => {
    try {
      const db = await getDb();
      const { deckId, limit, type } = data;
      let stmt;
      if (type === "new-reviews") {
        stmt = db.prepare(`SELECT reviews.*, vocabulary.* FROM reviews  
          JOIN vocabulary ON vocabulary.vocabulary_id = reviews.vocabulary_id
          WHERE deck_id = ? AND julianday('now') >= julianday(reviews.review_date) AND reviews.repetition > 1 LIMIT ?`);
      } else {
        stmt = db.prepare(`SELECT reviews.*, vocabulary.* FROM reviews  
          JOIN vocabulary ON vocabulary.vocabulary_id = reviews.vocabulary_id
          WHERE deck_id = ? AND reviews.repetition = 1 LIMIT ?`);
      }
      stmt.bind([deckId, limit]);
      const rows: GetVocabularyToReview[] = [];
      while (stmt.step()) {
        rows.push(stmt.getAsObject() as unknown as GetVocabularyToReview);
      }
      stmt.free();
      return rows;
    } catch (err) {
      throw new Error("Database error: " + (err as Error).message);
    }
  });

  ipcMain.handle("get-reviews-history", async (_event, data) => {
    try {
      const db = await getDb();
      const { vocabularyId } = data;
      const stmt = db.prepare(`SELECT * FROM reviews_history 
        WHERE reviews_history.vocabulary_id = ?`);
      stmt.bind([vocabularyId]);
      const rows: ReviewsHistory[] = [];
      while (stmt.step()) {
        rows.push(stmt.getAsObject() as unknown as ReviewsHistory);
      }
      stmt.free();
      return rows;
    } catch (err) {
      throw new Error("Database error: " + (err as Error).message);
    }
  });

  ipcMain.handle("get-revies-and-new-count-per-date", async () => {
    try {
      const db = await getDb();
      const result = db.exec(`SELECT
        date(review_date) AS review_date,
        COUNT(CASE WHEN repetition = 1 THEN 1 END) AS new_count,
        COUNT(CASE WHEN repetition > 1 THEN 1 END) AS review_count
        FROM REVIEWS_HISTORY
        GROUP BY date(review_date)
        ORDER BY date(review_date)`);
      return resultToObjects<ReviewsHistory>(result);
    } catch (err) {
      throw new Error("Database error: " + (err as Error).message);
    }
  });
}
