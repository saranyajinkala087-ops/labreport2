const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
require("dotenv").config();

const dbPath = process.env.DB_PATH
  ? path.resolve(process.env.DB_PATH)
  : path.join(__dirname, "..", "books.db");

let dbInstance = null;

const initializeDB = async () => {
  if (!dbInstance) {
    dbInstance = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    // Ensure table and view exist
    await dbInstance.exec(`
      CREATE TABLE IF NOT EXISTS book (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        price INTEGER NOT NULL,
        pages INTEGER
      );
      CREATE VIEW IF NOT EXISTS books AS SELECT id, title, author, price, pages FROM book;
    `);
  }
  return dbInstance;
};

const getDb = () => {
  if (!dbInstance) {
    throw new Error("Database has not been initialized yet. Call initializeDB() first.");
  }
  return dbInstance;
};

module.exports = {
  initializeDB,
  getDb,
  dbPath,
};
