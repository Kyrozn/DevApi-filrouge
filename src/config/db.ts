// db.ts
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";

const dbPath = path.resolve(__dirname, "devApi.db");

const dbPromise = open({
  filename: dbPath,
  driver: sqlite3.Database,
});

export const query = async (sql: string, params: any[] = []) => {
  const db = await dbPromise;
  return db.all(sql, params);
};

export const run = async (sql: string, params: any[] = []) => {
  const db = await dbPromise;
  return db.run(sql, params);
};

export default dbPromise;
