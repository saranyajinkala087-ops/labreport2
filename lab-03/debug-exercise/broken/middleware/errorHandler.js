const notFoundHandler = (req, res) => {
  res.status(404).json({
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
};

const centralErrorHandler = (err, req, res, next) => {
  console.error("Central Error Handler:", err.stack || err.message || err);
  res.status(500).json({
    message: "Internal server error",
  });
};

module.exports = {
  notFoundHandler,
  centralErrorHandler,
};
