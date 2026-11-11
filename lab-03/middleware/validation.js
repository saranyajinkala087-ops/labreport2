const ALLOWED_ORDER_BY = ["id", "title", "author", "price", "pages"];
const ALLOWED_ORDER = ["ASC", "DESC"];

const validateGetBooks = (req, res, next) => {
  const {
    search_q = "",
    order_by = "id",
    order = "ASC",
    limit = 10,
    offset = 0,
    min_price,
    max_price,
  } = req.query;

  // Validate order_by whitelist
  const normalizedOrderBy = String(order_by).trim().toLowerCase();
  if (!ALLOWED_ORDER_BY.includes(normalizedOrderBy)) {
    return res.status(400).json({
      message: `Invalid order_by column. Allowed: ${ALLOWED_ORDER_BY.join(", ")}`,
    });
  }

  // Validate order direction
  const normalizedOrder = String(order).trim().toUpperCase();
  if (!ALLOWED_ORDER.includes(normalizedOrder)) {
    return res.status(400).json({
      message: `Invalid order direction. Allowed: ${ALLOWED_ORDER.join(", ")}`,
    });
  }

  // Validate limit
  const parsedLimit = Number(limit);
  if (!Number.isInteger(parsedLimit) || parsedLimit <= 0 || parsedLimit > 100) {
    return res.status(400).json({
      message: "Invalid limit. Must be an integer between 1 and 100",
    });
  }

  // Validate offset
  const parsedOffset = Number(offset);
  if (!Number.isInteger(parsedOffset) || parsedOffset < 0) {
    return res.status(400).json({
      message: "Invalid offset. Must be a non-negative integer",
    });
  }

  // Validate min_price
  let parsedMinPrice = null;
  if (min_price !== undefined) {
    if (min_price === "" || isNaN(Number(min_price)) || Number(min_price) < 0) {
      return res.status(400).json({
        message: "min_price must be a valid non-negative number",
      });
    }
    parsedMinPrice = Number(min_price);
  }

  // Validate max_price
  let parsedMaxPrice = null;
  if (max_price !== undefined) {
    if (max_price === "" || isNaN(Number(max_price)) || Number(max_price) < 0) {
      return res.status(400).json({
        message: "max_price must be a valid non-negative number",
      });
    }
    parsedMaxPrice = Number(max_price);
  }

  // Validate price range if both are present
  if (parsedMinPrice !== null && parsedMaxPrice !== null && parsedMinPrice > parsedMaxPrice) {
    return res.status(400).json({
      message: "min_price cannot be greater than max_price",
    });
  }

  // Attach sanitized and parsed values
  req.validatedQuery = {
    search_q: String(search_q).trim(),
    order_by: normalizedOrderBy,
    order: normalizedOrder,
    limit: parsedLimit,
    offset: parsedOffset,
    min_price: parsedMinPrice,
    max_price: parsedMaxPrice,
  };

  next();
};

const validateBookId = (req, res, next) => {
  const { id } = req.params;
  const parsedId = Number(id);

  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    return res.status(400).json({
      message: "Invalid book ID. Must be a positive integer",
    });
  }

  req.validatedId = parsedId;
  next();
};

const validateCreateBook = (req, res, next) => {
  const { title, author, price, pages } = req.body || {};

  if (!title || typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({
      message: "Field 'title' is required and must be a non-empty string",
    });
  }

  if (!author || typeof author !== "string" || author.trim() === "") {
    return res.status(400).json({
      message: "Field 'author' is required and must be a non-empty string",
    });
  }

  if (price === undefined || price === null || typeof price === "boolean" || isNaN(Number(price)) || Number(price) < 0) {
    return res.status(400).json({
      message: "Field 'price' is required and must be a non-negative number",
    });
  }

  if (pages !== undefined && pages !== null) {
    const parsedPages = Number(pages);
    if (!Number.isInteger(parsedPages) || parsedPages <= 0) {
      return res.status(400).json({
        message: "Field 'pages' must be a positive integer",
      });
    }
  }

  req.validatedBody = {
    title: title.trim(),
    author: author.trim(),
    price: Number(price),
    pages: pages !== undefined && pages !== null ? Number(pages) : null,
  };

  next();
};

const validateUpdateBook = (req, res, next) => {
  const { title, author, price, pages } = req.body || {};

  if (
    title === undefined &&
    author === undefined &&
    price === undefined &&
    pages === undefined
  ) {
    return res.status(400).json({
      message: "At least one valid field (title, author, price, pages) must be provided for update",
    });
  }

  const updates = {};

  if (title !== undefined) {
    if (typeof title !== "string" || title.trim() === "") {
      return res.status(400).json({
        message: "Field 'title' must be a non-empty string",
      });
    }
    updates.title = title.trim();
  }

  if (author !== undefined) {
    if (typeof author !== "string" || author.trim() === "") {
      return res.status(400).json({
        message: "Field 'author' must be a non-empty string",
      });
    }
    updates.author = author.trim();
  }

  if (price !== undefined) {
    if (price === null || typeof price === "boolean" || isNaN(Number(price)) || Number(price) < 0) {
      return res.status(400).json({
        message: "Field 'price' must be a non-negative number",
      });
    }
    updates.price = Number(price);
  }

  if (pages !== undefined) {
    if (pages !== null) {
      const parsedPages = Number(pages);
      if (!Number.isInteger(parsedPages) || parsedPages <= 0) {
        return res.status(400).json({
          message: "Field 'pages' must be a positive integer",
        });
      }
      updates.pages = parsedPages;
    } else {
      updates.pages = null;
    }
  }

  req.validatedUpdates = updates;
  next();
};

module.exports = {
  validateGetBooks,
  validateBookId,
  validateCreateBook,
  validateUpdateBook,
};
