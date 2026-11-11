const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
(async () => {
  const db = await open({ filename: process.env.DB_PATH || "../../books.db", driver: sqlite3.Database });
  try {
    const row = await db.get("SELECT id, title FROM book WHERE id = ?;", [1]);
    console.log("response body:", JSON.stringify({ data: row }));
  } finally { await db.close(); }
})();
