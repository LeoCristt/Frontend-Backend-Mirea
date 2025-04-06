import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Создание и подключение к базе данных
export const initDb = async () => {
    const db = await open({
        filename: './users.db',
        driver: sqlite3.Database
    });

    await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT
    );
  `);

    return db;
};
