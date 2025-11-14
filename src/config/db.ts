// config/db.ts
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";

const dbPath = path.resolve(__dirname, "devApi.db");

// ⚠️ Ne crée pas la promesse tout de suite
export const getDb = async () => {
  return open({
    filename: dbPath,
    driver: sqlite3.Database,
  });
};

export const query = async (sql: string, params: any[] = []) => {
  const db = await getDb();
  return db.all(sql, params);
};

export const run = async (sql: string, params: any[] = []) => {
  const db = await getDb();
  return db.run(sql, params);
};
