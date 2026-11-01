const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const dbPath = path.join(__dirname, "books.db");

const setupDatabase = async () => {
  try {
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    console.log("Connected to SQLite database.");

    // Create 'book' table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS book (
        id INTEGER PRIMARY KEY,
        title TEXT,
        author TEXT,
        price INTEGER,
        pages INTEGER
      );
    `);
    console.log("Table 'book' verified/created.");

    // Clear existing data to ensure clean state
    await db.run("DELETE FROM book;");

    // Insert 10 sample book records
    const sampleBooks = [
      { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", price: 350, pages: 180 },
      { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee", price: 420, pages: 281 },
      { id: 3, title: "1984", author: "George Orwell", price: 299, pages: 328 },
      { id: 4, title: "Pride and Prejudice", author: "Jane Austen", price: 250, pages: 279 },
      { id: 5, title: "The Catcher in the Rye", author: "J.D. Salinger", price: 310, pages: 214 },
      { id: 6, title: "The Hobbit", author: "J.R.R. Tolkien", price: 450, pages: 310 },
      { id: 7, title: "Fahrenheit 451", author: "Ray Bradbury", price: 280, pages: 256 },
      { id: 8, title: "The Alchemist", author: "Paulo Coelho", price: 299, pages: 208 },
      { id: 9, title: "Brave New World", author: "Aldous Huxley", price: 340, pages: 268 },
      { id: 10, title: "Crime and Punishment", author: "Fyodor Dostoevsky", price: 499, pages: 430 }
    ];

    for (const book of sampleBooks) {
      await db.run(
        `INSERT INTO book (id, title, author, price, pages) VALUES (?, ?, ?, ?, ?);`,
        [book.id, book.title, book.author, book.price, book.pages]
      );
    }

    const count = await db.get("SELECT COUNT(*) AS total FROM book;");
    console.log(`Inserted ${count.total} sample records into 'book' table.`);

    await db.close();
    console.log("Database setup completed successfully.");
  } catch (error) {
    console.error("Error setting up database:", error.message);
    process.exit(1);
  }
};

setupDatabase();

