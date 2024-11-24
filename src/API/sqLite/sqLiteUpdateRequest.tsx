import { ipcMain } from "electron";

import { Statement } from "../../types/APITypes";
import db from "./sqLite";

export default function sqLiteUpdateRequests() {
  ipcMain.handle("update-deck", async (_event, data) => {
    return new Promise((resolve, reject) => {
      const { deckId, deckName, deckPosition } = data;

      const sql = `UPDATE decks
        SET deck_name = ?, deck_position = ?
        WHERE deck_id = ?`;

      db.run(
        sql,
        [deckName, deckPosition, deckId],
        function (this: Statement, err: Error) {
          if (err) {
            reject(new Error("Database error: " + err.message));
          } else {
            //Get id of updated item
            resolve({ deckId: this.lastID });
          }
        },
      );
    });
  });

  ipcMain.handle("update-vocabulary", async (_event, data) => {
    return new Promise((resolve, reject) => {
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

      const sql = `UPDATE vocabulary SET 
            front_word = ?,
            back_word = ?,
            audio_name = ?,
            front_word_html = ?,
            back_word_html = ?,
            front_desc_html = ?,
            back_desc_html = ? 
            WHERE vocabulary_id = ?`;

      db.run(
        sql,
        [
          front_word,
          back_word,
          audio_name,
          front_word_html,
          back_word_html,
          front_desc_html,
          back_desc_html,
          vocabulary_id,
        ],
        function (this: Statement, err: Error) {
          if (err) {
            reject(new Error("Database error: " + err.message));
          } else {
            //Get id of updated item
            resolve({
              front_word,
              back_word,
              audio_name,
              front_word_html,
              back_word_html,
              front_desc_html,
              back_desc_html,
              vocabulary_id,
            });
          }
        },
      );
    });
  });

  ipcMain.handle("update-review", async (_event, data) => {
    return new Promise((resolve, reject) => {
      const { reviewId, vocabularyId, reviewDate, easeFactor, repetition } =
        data;

      const sql = `UPDATE reviews
        SET vocabulary_id = ?, review_date = ?, ease_factor = ?, repetition = ?
        WHERE review_id = ?`;

      db.run(
        sql,
        [vocabularyId, reviewDate, easeFactor, repetition, reviewId],
        function (this: Statement, err: Error) {
          if (err) {
            reject(new Error("Database error: " + err.message));
          } else {
            //Get id of updated item
            resolve({ deckId: this.lastID });
          }
        },
      );
    });
  });

  ipcMain.handle("update-deck-img", async (_event, data) => {
    return new Promise((resolve, reject) => {
      const { deck_id, deck_img } = data;

      const sql = `UPDATE decks
        SET deck_img = ?
        WHERE deck_id = ?`;

      db.run(sql, [deck_img, deck_id], function (this: Statement, err: Error) {
        if (err) {
          reject(new Error("Database error: " + err.message));
        } else {
          //Get id of updated item
          resolve({ deckId: this.lastID });
        }
      });
    });
  });
}
