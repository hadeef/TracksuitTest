import { Database } from "jsr:@db/sqlite@0.12.0";
import { assertThrows } from "https://deno.land/std@0.224.0/assert/mod.ts";
import deleteInsight from "./delete-insight.ts";

// Helper to set up a fresh in-memory DB
function setupDB() {
  const db = new Database(":memory:");
  db.exec(`
    CREATE TABLE insights (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      brandId INTEGER NOT NULL,
      createdAt TEXT NOT NULL,
      text TEXT NOT NULL
    );
  `);
  // Insert a test row
  db.exec(`
    INSERT INTO insights (brandId, createdAt, text)
    VALUES (1, '2024-06-18T00:00:00.000Z', 'Test insight');
  `);
  return db;
}

Deno.test("deleteInsight throws if db is missing or id is invalid", () => {
  const db = setupDB();

  // Missing db
  assertThrows(
    () => deleteInsight({ id: 1 } as any),
    Error,
    "Failed to delete insight",
  );

  // Invalid id
  assertThrows(
    () => deleteInsight({ db, id: undefined as any }),
    Error,
    "Failed to delete insight",
  );
});
