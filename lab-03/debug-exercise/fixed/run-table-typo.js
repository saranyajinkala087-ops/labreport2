const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
(async () => {
  const db = await open({ filename: process.env.DB_PATH || "../../books.db", driver: sqlite3.Database });
  try { await db.get("SELECT * FROM book LIMIT 1;"); console.log("Correct table query succeeded."); }
  finally { await db.close(); }
})();
