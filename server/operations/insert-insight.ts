import type { Insight } from "$models/insight.ts";
import type { HasDBClient } from "../shared.ts";
import type {
  insertInsight as _insertInsightSQL,
  Row,
} from "../tables/insights.ts";

import type * as insightsTable from "$tables/insights.ts";

// Input type: all fields except id and createdAt
export type InsertInsightInput =
  & HasDBClient
  & Omit<insightsTable.Row, "id" | "createdAt">;

export default function insertInsight(input: InsertInsightInput): Insight {
  const createdAt = new Date().toISOString();

  // Direct SQL string instead of insertInsightSQL
  const sql =
    `INSERT INTO insights (brand, createdAt, text) VALUES (${input.brandId}, '${createdAt}', '${input.text}')`;

  input.db.exec(sql);

  // Fetch the inserted row (assuming SQLite and last_insert_rowid())
  const [row] = input.db.sql<Row>`
    SELECT * FROM insights WHERE rowid = last_insert_rowid()
  `;

  if (!row) throw new Error("Failed to insert insight");
  return { ...row, createdAt: new Date(row.createdAt) };
}
