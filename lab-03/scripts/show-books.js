const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
(async () => {
  const file = process.env.DB_PATH ? path.resolve(process.env.DB_PATH) : path.join(__dirname, "..", "books.db");
  const db = await open({ filename: file, driver: sqlite3.Database });
  const rows = await db.all("SELECT id, title, author, price, pages FROM book ORDER BY id;");
  console.log("SELECT id, title, author, price, pages FROM book ORDER BY id;");
  console.table(rows);
  await db.close();
})().catch((error) => { console.error(error.message); process.exit(1); });
