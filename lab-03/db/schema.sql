-- Schema for books table
CREATE TABLE IF NOT EXISTS book (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  price INTEGER NOT NULL,
  pages INTEGER
);

-- Backward-compatibility view for queries targeting 'books'
CREATE VIEW IF NOT EXISTS books AS SELECT id, title, author, price, pages FROM book;
