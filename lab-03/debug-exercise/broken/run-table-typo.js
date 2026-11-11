const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
(async () => {
  const db = await open({ filename: process.env.DB_PATH || "../../books.db", driver: sqlite3.Database });
  try {
    await db.get("SELECT * FROM books_typo LIMIT 1;");
  } catch (error) {
    console.error(`${error.code}: ${error.message}`);
    process.exitCode = 1;
  } finally { await db.close(); }
})();
