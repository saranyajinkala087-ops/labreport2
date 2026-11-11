require("dotenv").config();
const app = require("./app");
const { initializeDB } = require("./db/connections");

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    await initializeDB();
    console.log("Connected to SQLite Database.");
    app.listen(PORT, () => {
      console.log(`Server Running at http://localhost:${PORT}/`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
