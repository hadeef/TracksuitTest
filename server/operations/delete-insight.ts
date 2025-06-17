import type { HasDBClient } from "../shared.ts";

export type DeleteInsightInput = HasDBClient & { id: number };

export default function deleteInsight(input: DeleteInsightInput): boolean {
  try {
    const sql = `DELETE FROM insights WHERE id = ${input.id}`;
    input.db.exec(sql);
    return true;
  } catch (err) {
    console.error("Failed to delete insight:", err);
    throw new Error(
      "Failed to delete insight: " +
        (err instanceof Error ? err.message : String(err)),
    );
  }
}
