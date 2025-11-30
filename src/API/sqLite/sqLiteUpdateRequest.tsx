import { ipcMain } from "electron";

import { getDb, saveDatabase } from "./sqLite";

export default function sqLiteUpdateRequests() {
  ipcMain.handle("update-deck", async (_event, data) => {
    try {
      const db = await getDb();
      const { deckId, deckName, deckPosition } = data;

      db.run(`UPDATE decks
        SET deck_name = ?, deck_position = ?
        WHERE deck_id = ?`, [deckName, deckPosition, deckId]);

      saveDatabase();
      const changesRes = db.exec("SELECT changes() AS changes");
      const changes = (changesRes[0]?.values[0]?.[0] as number) || 0;
      return { deckId, changes };
    } catch (err) {
      throw new Error("Database error: " + (err as Error).message);
    }
  });

  ipcMain.handle("update-vocabulary", async (_event, data) => {
    try {
      const db = await getDb();
      const {
        front_word,
        back_word,
        audio_name,
        front_word_html,
        back_word_html,
        front_desc_html,
        back_desc_html,
        vocabulary_id,
      } = data;

      db.run(`UPDATE vocabulary SET 
        front_word = ?,
        back_word = ?,
        audio_name = ?,
        front_word_html = ?,
        back_word_html = ?,
        front_desc_html = ?,
        back_desc_html = ? 
        WHERE vocabulary_id = ?`, [
        front_word,
        back_word,
        audio_name,
        front_word_html,
        back_word_html,
        front_desc_html,
        back_desc_html,
        vocabulary_id,
      ]);

      saveDatabase();
      return {
        front_word,
        back_word,
        audio_name,
        front_word_html,
        back_word_html,
        front_desc_html,
        back_desc_html,
        vocabulary_id,
      };
    } catch (err) {
      throw new Error("Database error: " + (err as Error).message);
    }
  });

  ipcMain.handle("update-review", async (_event, data) => {
    try {
      const db = await getDb();
      const { reviewId, vocabularyId, reviewDate, easeFactor, repetition } =
        data;

      db.run(`UPDATE reviews
        SET vocabulary_id = ?, review_date = ?, ease_factor = ?, repetition = ?
        WHERE review_id = ?`, [
        vocabularyId,
        reviewDate,
        easeFactor,
        repetition,
        reviewId,
      ]);

      saveDatabase();
      const changesRes = db.exec("SELECT changes() AS changes");
      const changes = (changesRes[0]?.values[0]?.[0] as number) || 0;
      return { reviewId, changes };
    } catch (err) {
      throw new Error("Database error: " + (err as Error).message);
    }
  });

  ipcMain.handle("update-deck-img", async (_event, data) => {
    try {
      const db = await getDb();
      const { deck_id, deck_img } = data;

      db.run(`UPDATE decks
        SET deck_img = ?
        WHERE deck_id = ?`, [deck_img, deck_id]);

      saveDatabase();
      const changesRes = db.exec("SELECT changes() AS changes");
      const changes = (changesRes[0]?.values[0]?.[0] as number) || 0;
      return { deckId: deck_id, changes };
    } catch (err) {
      throw new Error("Database error: " + (err as Error).message);
    }
  });
}
