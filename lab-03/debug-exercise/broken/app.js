const express = require("express");
const booksRoutes = require("./routes/booksRoutes");
const { notFoundHandler, centralErrorHandler } = require("./middleware/errorHandler");

const app = express();

// Body parser middleware
app.use(express.json());

// Mount Books resource routes
app.use("/books", booksRoutes);

// Fallback 404 for unknown routes
app.use(notFoundHandler);

// Centralized error handler
app.use(centralErrorHandler);

module.exports = app;
