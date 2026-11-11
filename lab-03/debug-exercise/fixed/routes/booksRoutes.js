const express = require("express");
const router = express.Router();
const booksController = require("../controllers/booksController");
const {
  validateGetBooks,
  validateBookId,
  validateCreateBook,
  validateUpdateBook,
} = require("../middleware/validation");

// 1. GET /books - List books with filtering, sorting, pagination
router.get("/", validateGetBooks, booksController.getBooks);

// 2. GET /books/:id - Retrieve single book by ID
router.get("/:id", validateBookId, booksController.getBookById);

// 3. POST /books - Create a new book
router.post("/", validateCreateBook, booksController.createBook);

// 4. PUT /books/:id - Update an existing book
router.put("/:id", validateBookId, validateUpdateBook, booksController.updateBook);

// 5. DELETE /books/:id - Delete an existing book
router.delete("/:id", validateBookId, booksController.deleteBook);

module.exports = router;
