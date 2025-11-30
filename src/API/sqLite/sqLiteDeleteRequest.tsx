import { ipcMain } from "electron";

import { getDb, saveDatabase } from "./sqLite";

export default function sqLiteDeleteRequests() {
  ipcMain.handle("delete-deck", async (_event, data) => {
    try {
      const db = await getDb();
      const { deckId } = data;

      db.run(`DELETE FROM decks WHERE deck_id = ?`, [deckId]);

      saveDatabase();
      const changesRes = db.exec("SELECT changes() AS changes");
      const changes = (changesRes[0]?.values[0]?.[0] as number) || 0;
      return { deckId, changes };
    } catch (err) {
      throw new Error("Database error: " + (err as Error).message);
    }
  });

  ipcMain.handle("delete-vocabulary", async (_event, data) => {
    try {
      const db = await getDb();
      const { vocabularyId } = data;

      db.run(`DELETE FROM vocabulary WHERE vocabulary_id = ?`, [vocabularyId]);

      saveDatabase();
      const changesRes = db.exec("SELECT changes() AS changes");
      const changes = (changesRes[0]?.values[0]?.[0] as number) || 0;
      return { vocabularyId, changes };
    } catch (err) {
      throw new Error("Database error: " + (err as Error).message);
    }
  });
}
