-- Create the 'book' table
CREATE TABLE IF NOT EXISTS book (
  id INTEGER PRIMARY KEY,
  title TEXT,
  author TEXT,
  price INTEGER,
  pages INTEGER
);

-- Insert 10 sample book records
INSERT INTO book (id, title, author, price, pages)
VALUES
  (1, 'The Great Gatsby', 'F. Scott Fitzgerald', 350, 180),
  (2, 'To Kill a Mockingbird', 'Harper Lee', 420, 281),
  (3, '1984', 'George Orwell', 299, 328),
  (4, 'Pride and Prejudice', 'Jane Austen', 250, 279),
  (5, 'The Catcher in the Rye', 'J.D. Salinger', 310, 214),
  (6, 'The Hobbit', 'J.R.R. Tolkien', 450, 310),
  (7, 'Fahrenheit 451', 'Ray Bradbury', 280, 256),
  (8, 'The Alchemist', 'Paulo Coelho', 299, 208),
  (9, 'Brave New World', 'Aldous Huxley', 340, 268),
  (10, 'Crime and Punishment', 'Fyodor Dostoevsky', 499, 430);

