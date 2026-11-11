const { initializeDB } = require("./connection");

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
  { id: 10, title: "Crime and Punishment", author: "Fyodor Dostoevsky", price: 499, pages: 430 },
  { id: 11, title: "Clean Code", author: "Robert C. Martin", price: 650, pages: 464 },
  { id: 12, title: "The Pragmatic Programmer", author: "Andrew Hunt", price: 720, pages: 352 },
  { id: 13, title: "Design Patterns", author: "Erich Gamma", price: 850, pages: 395 },
  { id: 14, title: "Introduction to Algorithms", author: "Thomas H. Cormen", price: 950, pages: 1312 },
  { id: 15, title: "JavaScript: The Good Parts", author: "Douglas Crockford", price: 320, pages: 176 },
  { id: 16, title: "You Don't Know JS", author: "Kyle Simpson", price: 380, pages: 278 },
  { id: 17, title: "Node.js Design Patterns", author: "Mario Casciaro", price: 580, pages: 520 },
  { id: 18, title: "Database System Concepts", author: "Abraham Silberschatz", price: 890, pages: 1376 }
];

const seedDatabase = async () => {
  try {
    const db = await initializeDB();
    console.log("Connected to database. Resetting 'book' table...");

    await db.exec(`
      DROP TABLE IF EXISTS book;
      DROP VIEW IF EXISTS books;

      CREATE TABLE book (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        price INTEGER NOT NULL,
        pages INTEGER
      );

      CREATE VIEW books AS SELECT id, title, author, price, pages FROM book;
    `);

    for (const book of sampleBooks) {
      await db.run(
        `INSERT INTO book (id, title, author, price, pages) VALUES (?, ?, ?, ?, ?);`,
        [book.id, book.title, book.author, book.price, book.pages]
      );
    }

    const count = await db.get("SELECT COUNT(*) AS total FROM book;");
    console.log(`Seeded ${count.total} realistic books into the database successfully.`);
    return count.total;
  } catch (error) {
    console.error("Error seeding database:", error.message);
    process.exit(1);
  }
};

if (require.main === module) {
  seedDatabase().then(() => {
    process.exit(0);
  });
}

module.exports = { seedDatabase, sampleBooks };
