export const createTable = `
 CREATE TABLE IF NOT EXISTS insights (
    id INTEGER PRIMARY KEY ASC NOT NULL,
    brand INTEGER NOT NULL,
    createdAt TEXT NOT NULL,
    text TEXT NOT NULL
  )
`;

export type Row = {
  id: number;
  brandId: number;
  createdAt: string;
  text: string;
};

export type Insert = {
  brandId: number;
  createdAt: string;
  text: string;
};

export const insertInsight = (item: Insert) =>
  `INSERT INTO insights (brand, createdAt, text) VALUES (${item.brandId}, '${item.text}, '${item.createdAt}'')`;
