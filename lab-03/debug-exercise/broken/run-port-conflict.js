const http = require("http");
const app = require("./app");
const PORT = Number(process.env.PORT || 3001);
const dummy = http.createServer();
dummy.listen(PORT, "127.0.0.1", () => {
  console.log(`My dummy listener is using port ${PORT}.`);
  const second = app.listen(PORT, "127.0.0.1");
  second.on("error", (error) => {
    console.error(`${error.code}: ${error.message}`);
    dummy.close(() => {
      console.log("Stopped only my dummy listener.");
      process.exitCode = error.code === "EADDRINUSE" ? 0 : 1;
    });
  });
});

