import { ipcMain } from "electron";

import { getDb, saveDatabase } from "./sqLite";

export default function sqLitePostRequests() {
  ipcMain.handle("add-flashcard", async (_event, data) => {
    try {
      const db = await getDb();
      const {
        deckId,
        frontWord,
        backWord,
        audioName,
        frontWordHTML,
        backWordHTML,
        frontDescHTML,
        backDescHTML,
      } = data;

      db.run(
        `INSERT INTO vocabulary (
        deck_id,
        front_word, 
        back_word,
        audio_name,
        front_word_html, 
        back_word_html, 
        front_desc_html, 
        back_desc_html
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          deckId,
          frontWord,
          backWord,
          audioName,
          frontWordHTML,
          backWordHTML,
          frontDescHTML,
          backDescHTML,
        ],
      );

      const result = db.exec("SELECT last_insert_rowid() as id");
      const lastId = result[0]?.values[0]?.[0] as number;

      saveDatabase();
      return { flashcardId: lastId };
    } catch (err) {
      throw new Error("Database error: " + (err as Error).message);
    }
  });

  ipcMain.handle("create-deck", async (_event, data) => {
    try {
      const db = await getDb();
      const { deck_name, deck_img, deck_position } = data;

      db.run(
        `INSERT INTO decks (
        deck_name, deck_img, deck_position
      ) VALUES (?, ?, ?)`,
        [deck_name, deck_img, deck_position],
      );

      const result = db.exec("SELECT last_insert_rowid() as id");
      const lastId = result[0]?.values[0]?.[0] as number;

      saveDatabase();
      return { deck_id: lastId, deck_name };
    } catch (err) {
      throw new Error("Database error: " + (err as Error).message);
    }
  });

  ipcMain.handle("create-review", async (_event, data) => {
    try {
      const db = await getDb();
      const { vocabularyId } = data;

      db.run(
        `INSERT INTO reviews (
        vocabulary_id, review_date
      ) VALUES (?, datetime('now'))`,
        [vocabularyId],
      );

      const result = db.exec("SELECT last_insert_rowid() as id");
      const lastId = result[0]?.values[0]?.[0] as number;

      saveDatabase();
      return { vocabularyId: lastId };
    } catch (err) {
      throw new Error("Database error: " + (err as Error).message);
    }
  });

  ipcMain.handle("create-reviews-history", async (_event, data) => {
    try {
      const db = await getDb();
      const { vocabularyId, easeFactor, quality, repetition, reviewDate } =
        data;

      db.run(
        `INSERT INTO reviews_history (
        vocabulary_id, ease_factor, quality, repetition, review_date
      ) VALUES (?, ?, ?, ?, ?)`,
        [vocabularyId, easeFactor, quality, repetition, reviewDate],
      );

      const result = db.exec("SELECT last_insert_rowid() as id");
      const lastId = result[0]?.values[0]?.[0] as number;

      saveDatabase();
      return { vocabularyId: lastId };
    } catch (err) {
      throw new Error("Database error: " + (err as Error).message);
    }
  });
}
