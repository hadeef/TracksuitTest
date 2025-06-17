import { Database } from "jsr:@db/sqlite@0.12.0";
import { assertThrows } from "https://deno.land/std@0.224.0/assert/mod.ts";
import insertInsight from "./insert-insight.ts";

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
  return db;
}

Deno.test("insertInsight throws if required fields are missing", () => {
  const db = setupDB();

  // Missing brandId
  assertThrows(
    () => insertInsight({ db, text: "Missing brandId" } as any),
    Error,
  );

  // Missing text
  assertThrows(
    () => insertInsight({ db, brandId: 1 } as any),
    Error,
  );
});
