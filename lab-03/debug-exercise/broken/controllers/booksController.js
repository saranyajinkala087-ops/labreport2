const { getDb } = require("../db/connection");

const ORDER_BY_MAP = {
  id: "id",
  title: "title",
  author: "author",
  price: "price",
  pages: "pages",
};

const getBooks = async (req, res, next) => {
  try {
    const db = getDb();
    const {
      search_q,
      order_by,
      order,
      limit,
      offset,
      min_price,
      max_price,
    } = req.validatedQuery;

    const whereConditions = [];
    const whereParams = [];

    // Title search using SQL LIKE
    if (search_q) {
      whereConditions.push("title LIKE ?");
      whereParams.push(`%${search_q}%`);
    }

    // Price range filters
    if (min_price !== null && max_price !== null) {
      whereConditions.push("price BETWEEN ? AND ?");
      whereParams.push(min_price, max_price);
    } else if (min_price !== null) {
      whereConditions.push("price >= ?");
      whereParams.push(min_price);
    } else if (max_price !== null) {
      whereConditions.push("price <= ?");
      whereParams.push(max_price);
    }

    const whereClause =
      whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";

    // Total count for metadata
    const countQuery = `SELECT COUNT(*) AS total FROM books_typo ${whereClause};`;
    const countResult = await db.get(countQuery, whereParams);
    const total = countResult ? countResult.total : 0;

    // Whitelist lookup for column and sort direction
    const safeColumn = ORDER_BY_MAP[order_by] || "id";
    const safeDirection = order === "DESC" ? "DESC" : "ASC";

    const dataQuery = `
      SELECT
        id,
        title,
        author,
        price,
        pages
      FROM
        book
      ${whereClause}
      ORDER BY
        ${safeColumn} ${safeDirection}
      LIMIT ? OFFSET ?;
    `;

    const books = await db.all(dataQuery, [...whereParams, limit, offset]);

    res.status(200).json({
      data: books,
      total,
      limit,
      offset,
    });
  } catch (error) {
    next(error);
  }
};

const getBookById = async (req, res, next) => {
  try {
    const db = getDb();
    const bookId = req.validatedId;

    const getBookQuery = `
      SELECT
        id,
        title,
        author,
        price,
        pages
      FROM
        book
      WHERE
        id = ?;
    `;
    const book = db.get(getBookQuery, [bookId]);

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    res.status(200).json({
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

const createBook = async (req, res, next) => {
  try {
    const db = getDb();
    const { title, author, price, pages } = req.validatedBody;

    const addBookQuery = `
      INSERT INTO
        book (title, author, price, pages)
      VALUES
        (?, ?, ?, ?);
    `;

    const result = await db.run(addBookQuery, [title, author, price, pages]);

    const createdBook = await db.get(
      `SELECT id, title, author, price, pages FROM book WHERE id = ?;`,
      [result.lastID]
    );

    res.status(201).json({
      message: "Book created successfully",
      data: createdBook,
    });
  } catch (error) {
    next(error);
  }
};

const updateBook = async (req, res, next) => {
  try {
    const db = getDb();
    const bookId = req.validatedId;
    const updates = req.validatedUpdates;

    const existingBook = await db.get(
      `SELECT id, title, author, price, pages FROM book WHERE id = ?;`,
      [bookId]
    );

    if (!existingBook) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    const updatedTitle = updates.title !== undefined ? updates.title : existingBook.title;
    const updatedAuthor = updates.author !== undefined ? updates.author : existingBook.author;
    const updatedPrice = updates.price !== undefined ? updates.price : existingBook.price;
    const updatedPages = updates.pages !== undefined ? updates.pages : existingBook.pages;

    const updateQuery = `
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

    await db.run(updateQuery, [updatedTitle, updatedAuthor, updatedPrice, updatedPages, bookId]);

    const updatedBook = await db.get(
      `SELECT id, title, author, price, pages FROM book WHERE id = ?;`,
      [bookId]
    );

    res.status(200).json({
      message: "Book updated successfully",
      data: updatedBook,
    });
  } catch (error) {
    next(error);
  }
};

const deleteBook = async (req, res, next) => {
  try {
    const db = getDb();
    const bookId = req.validatedId;

    const existingBook = await db.get(
      `SELECT id FROM book WHERE id = ?;`,
      [bookId]
    );

    if (!existingBook) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    await db.run(`DELETE FROM book WHERE id = ?;`, [bookId]);

    res.status(200).json({
      message: "Book deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};
