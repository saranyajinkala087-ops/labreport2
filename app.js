const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "books.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

// 1. GET /books/ - Retrieve and display all books
app.get("/books/", async (request, response) => {
  try {
    const getBooksQuery = `
      SELECT
        *
      FROM
        book;
    `;
    const booksArray = await db.all(getBooksQuery);
    response.status(200).send(booksArray);
  } catch (error) {
    response.status(500).send({ error: error.message });
  }
});

// 2. GET /books/:bookId/ - Retrieve one book using its ID
app.get("/books/:bookId/", async (request, response) => {
  try {
    const { bookId } = request.params;
    const getBookQuery = `
      SELECT
        *
      FROM
        book
      WHERE
        id = ?;
    `;
    const book = await db.get(getBookQuery, [bookId]);

    if (!book) {
      return response.status(404).send("Book Not Found");
    }

    response.status(200).send(book);
  } catch (error) {
    response.status(500).send({ error: error.message });
  }
});

// 3. POST /books/ - Add a new book
app.post("/books/", async (request, response) => {
  try {
    const { title, author, price, pages } = request.body;
    const addBookQuery = `
      INSERT INTO
        book (title, author, price, pages)
      VALUES
        (?, ?, ?, ?);
    `;
    await db.run(addBookQuery, [title, author, price, pages]);
    response.status(201).send("Book Added Successfully");
  } catch (error) {
    response.status(500).send({ error: error.message });
  }
});

// 4. PUT /books/:bookId/ - Update an existing book using its ID
app.put("/books/:bookId/", async (request, response) => {
  try {
    const { bookId } = request.params;
    const { title, author, price, pages } = request.body;

    const checkBookQuery = `
      SELECT
        *
      FROM
        book
      WHERE
        id = ?;
    `;
    const existingBook = await db.get(checkBookQuery, [bookId]);

    if (!existingBook) {
      return response.status(404).send("Book Not Found");
    }

    const updatedTitle = title !== undefined ? title : existingBook.title;
    const updatedAuthor = author !== undefined ? author : existingBook.author;
    const updatedPrice = price !== undefined ? price : existingBook.price;
    const updatedPages = pages !== undefined ? pages : existingBook.pages;

    const updateBookQuery = `
      UPDATE
        book
      SET
        title = ?,
        author = ?,
        price = ?,
        pages = ?
      WHERE
        id = ?;
    `;
    await db.run(updateBookQuery, [
      updatedTitle,
      updatedAuthor,
      updatedPrice,
      updatedPages,
      bookId,
    ]);
    response.status(200).send("Book Updated Successfully");
  } catch (error) {
    response.status(500).send({ error: error.message });
  }
});

// 5. DELETE /books/:bookId/ - Delete a book using its ID
app.delete("/books/:bookId/", async (request, response) => {
  try {
    const { bookId } = request.params;
    const checkBookQuery = `
      SELECT
        *
      FROM
        book
      WHERE
        id = ?;
    `;
    const existingBook = await db.get(checkBookQuery, [bookId]);

    if (!existingBook) {
      return response.status(404).send("Book Not Found");
    }

    const deleteBookQuery = `
      DELETE FROM
        book
      WHERE
        id = ?;
    `;
    await db.run(deleteBookQuery, [bookId]);
    response.status(200).send("Book Deleted Successfully");
  } catch (error) {
    response.status(500).send({ error: error.message });
  }
});

module.exports = app;
