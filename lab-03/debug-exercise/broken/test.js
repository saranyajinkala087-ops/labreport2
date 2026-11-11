process.env.NODE_ENV = "test";
const assert = require("assert");
const http = require("http");
const app = require("./app");
const { initializeDB } = require("./db/connection");
const { seedDatabase } = require("./db/seed");

let server = null;
let baseUrl = "";

const makeRequest = (method, path, body = null) => {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        Accept: "application/json",
      },
    };

    let payload = null;
    if (body !== null) {
      payload = typeof body === "string" ? body : JSON.stringify(body);
      options.headers["Content-Type"] = "application/json";
      options.headers["Content-Length"] = Buffer.byteLength(payload);
    }

    const req = http.request(options, (res) => {
      let responseData = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => {
        responseData += chunk;
      });
      res.on("end", () => {
        let json = null;
        try {
          json = JSON.parse(responseData);
        } catch (e) {
          json = null;
        }
        resolve({
          status: res.statusCode,
          statusCode: res.statusCode,
          text: responseData,
          json,
        });
      });
    });

    req.on("error", (err) => {
      reject(err);
    });

    if (payload) {
      req.write(payload);
    }
    req.end();
  });
};

const runTests = async () => {
  console.log("=== Starting Automated Test Suite for Lab 3 API ===");
  await initializeDB();
  await seedDatabase();

  // Start HTTP server on dynamic port
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });

  let passed = 0;
  let total = 0;

  const test = async (description, testFn) => {
    total++;
    try {
      await testFn();
      console.log(`  ✓ PASS: ${description}`);
      passed++;
    } catch (err) {
      console.error(`  ✗ FAIL: ${description}`);
      console.error(`    ${err.message}`);
    }
  };

  try {
    // 1. GET /books default query
    await test("GET /books returns 10 books with default parameters and total count", async () => {
      const res = await makeRequest("GET", "/books");
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.json.limit, 10);
      assert.strictEqual(res.json.offset, 0);
      assert.strictEqual(res.json.total, 18);
      assert.strictEqual(res.json.data.length, 10);
      assert.strictEqual(res.json.data[0].id, 1);
    });

    // 2. GET /books with search_q
    await test("GET /books?search_q=Gatsby filters by title", async () => {
      const res = await makeRequest("GET", "/books?search_q=Gatsby");
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.json.total, 1);
      assert.strictEqual(res.json.data[0].title, "The Great Gatsby");
    });

    // 3. GET /books with sorting
    await test("GET /books?order_by=price&order=ASC sorts ascending by price", async () => {
      const res = await makeRequest("GET", "/books?order_by=price&order=ASC");
      assert.strictEqual(res.status, 200);
      const prices = res.json.data.map((b) => b.price);
      for (let i = 1; i < prices.length; i++) {
        assert(prices[i] >= prices[i - 1], "Prices must be ascending");
      }
    });

    await test("GET /books?order_by=price&order=DESC sorts descending by price", async () => {
      const res = await makeRequest("GET", "/books?order_by=price&order=DESC");
      assert.strictEqual(res.status, 200);
      const prices = res.json.data.map((b) => b.price);
      for (let i = 1; i < prices.length; i++) {
        assert(prices[i] <= prices[i - 1], "Prices must be descending");
      }
    });

    // 4. GET /books with limit and offset
    await test("GET /books?limit=5&offset=5 paginates correctly", async () => {
      const res = await makeRequest("GET", "/books?limit=5&offset=5");
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.json.data.length, 5);
      assert.strictEqual(res.json.data[0].id, 6);
    });

    // 5. GET /books with min_price and max_price (BETWEEN)
    await test("GET /books?min_price=300&max_price=450 filters price range", async () => {
      const res = await makeRequest("GET", "/books?min_price=300&max_price=450");
      assert.strictEqual(res.status, 200);
      for (const book of res.json.data) {
        assert(book.price >= 300 && book.price <= 450, `Price ${book.price} out of range 300-450`);
      }
    });

    // 6. GET /books single boundary price filters
    await test("GET /books?min_price=700 filters minimum price", async () => {
      const res = await makeRequest("GET", "/books?min_price=700");
      assert.strictEqual(res.status, 200);
      for (const book of res.json.data) {
        assert(book.price >= 700, `Price ${book.price} should be >= 700`);
      }
    });

    await test("GET /books?max_price=300 filters maximum price", async () => {
      const res = await makeRequest("GET", "/books?max_price=300");
      assert.strictEqual(res.status, 200);
      for (const book of res.json.data) {
        assert(book.price <= 300, `Price ${book.price} should be <= 300`);
      }
    });

    // 7. GET /books combined filters
    await test("GET /books combined search, sort, pagination, and price range", async () => {
      const res = await makeRequest("GET", "/books?search_q=The&order_by=price&order=DESC&min_price=200&max_price=500&limit=3&offset=0");
      assert.strictEqual(res.status, 200);
      assert(res.json.data.length <= 3);
      for (const b of res.json.data) {
        assert(b.title.includes("The"), "Title must contain 'The'");
        assert(b.price >= 200 && b.price <= 500, "Price must be in range 200-500");
      }
    });

    // 8. GET /books query parameter validation errors (400)
    await test("GET /books rejects invalid order_by column with 400", async () => {
      const res = await makeRequest("GET", "/books?order_by=nonexistent");
      assert.strictEqual(res.status, 400);
      assert(res.json.message.includes("Invalid order_by column"));
    });

    await test("GET /books rejects invalid order direction with 400", async () => {
      const res = await makeRequest("GET", "/books?order=RANDOM");
      assert.strictEqual(res.status, 400);
      assert(res.json.message.includes("Invalid order direction"));
    });

    await test("GET /books rejects non-numeric limit with 400", async () => {
      const res = await makeRequest("GET", "/books?limit=abc");
      assert.strictEqual(res.status, 400);
      assert(res.json.message.includes("Invalid limit"));
    });

    await test("GET /books rejects negative offset with 400", async () => {
      const res = await makeRequest("GET", "/books?offset=-5");
      assert.strictEqual(res.status, 400);
      assert(res.json.message.includes("Invalid offset"));
    });

    await test("GET /books rejects non-numeric min_price with 400", async () => {
      const res = await makeRequest("GET", "/books?min_price=free");
      assert.strictEqual(res.status, 400);
      assert(res.json.message.includes("min_price must be a valid non-negative number"));
    });

    await test("GET /books rejects min_price > max_price with 400", async () => {
      const res = await makeRequest("GET", "/books?min_price=500&max_price=300");
      assert.strictEqual(res.status, 400);
      assert(res.json.message.includes("min_price cannot be greater than max_price"));
    });

    // 9. GET /books/:id
    await test("GET /books/:id returns single book when found", async () => {
      const res = await makeRequest("GET", "/books/1");
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.json.data.id, 1);
      assert.strictEqual(res.json.data.title, "The Great Gatsby");
    });

    await test("GET /books/:id returns 404 when book not found", async () => {
      const res = await makeRequest("GET", "/books/9999");
      assert.strictEqual(res.status, 404);
      assert.strictEqual(res.json.message, "Book not found");
    });

    await test("GET /books/:id rejects invalid ID format with 400", async () => {
      const res = await makeRequest("GET", "/books/invalid-id");
      assert.strictEqual(res.status, 400);
      assert(res.json.message.includes("Invalid book ID"));
    });

    // 10. POST /books
    let createdBookId = null;
    await test("POST /books creates new book successfully (201)", async () => {
      const newBook = {
        title: "Mastering Node.js",
        author: "Sandro Pasquali",
        price: 520,
        pages: 412,
      };
      const res = await makeRequest("POST", "/books", newBook);
      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.json.message, "Book created successfully");
      assert.strictEqual(res.json.data.title, newBook.title);
      assert.strictEqual(res.json.data.author, newBook.author);
      assert.strictEqual(res.json.data.price, newBook.price);
      createdBookId = res.json.data.id;
    });

    await test("POST /books rejects missing title with 400", async () => {
      const res = await makeRequest("POST", "/books", {
        author: "Jane Doe",
        price: 300,
      });
      assert.strictEqual(res.status, 400);
      assert(res.json.message.includes("Field 'title' is required"));
    });

    await test("POST /books rejects missing author with 400", async () => {
      const res = await makeRequest("POST", "/books", {
        title: "Untitled",
        price: 300,
      });
      assert.strictEqual(res.status, 400);
      assert(res.json.message.includes("Field 'author' is required"));
    });

    await test("POST /books rejects non-numeric price with 400", async () => {
      const res = await makeRequest("POST", "/books", {
        title: "Sample Title",
        author: "Sample Author",
        price: "expensive",
      });
      assert.strictEqual(res.status, 400);
      assert(res.json.message.includes("Field 'price' is required"));
    });

    // 11. PUT /books/:id
    await test("PUT /books/:id updates existing book (200)", async () => {
      const updatePayload = {
        title: "Mastering Node.js (2nd Edition)",
        price: 550,
      };
      const res = await makeRequest("PUT", `/books/${createdBookId}`, updatePayload);
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.json.message, "Book updated successfully");
      assert.strictEqual(res.json.data.title, updatePayload.title);
      assert.strictEqual(res.json.data.price, updatePayload.price);
    });

    await test("PUT /books/:id returns 404 for non-existent ID", async () => {
      const res = await makeRequest("PUT", "/books/9999", { title: "Phantom" });
      assert.strictEqual(res.status, 404);
      assert.strictEqual(res.json.message, "Book not found");
    });

    await test("PUT /books/:id rejects empty body with 400", async () => {
      const res = await makeRequest("PUT", `/books/${createdBookId}`, {});
      assert.strictEqual(res.status, 400);
      assert(res.json.message.includes("At least one valid field"));
    });

    // 12. DELETE /books/:id
    await test("DELETE /books/:id deletes book successfully (200)", async () => {
      const res = await makeRequest("DELETE", `/books/${createdBookId}`);
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.json.message, "Book deleted successfully");

      // Verify deletion
      const verifyRes = await makeRequest("GET", `/books/${createdBookId}`);
      assert.strictEqual(verifyRes.status, 404);
    });

    await test("DELETE /books/:id returns 404 for non-existent ID", async () => {
      const res = await makeRequest("DELETE", "/books/9999");
      assert.strictEqual(res.status, 404);
      assert.strictEqual(res.json.message, "Book not found");
    });

    await test("DELETE /books/:id rejects invalid ID with 400", async () => {
      const res = await makeRequest("DELETE", "/books/abc");
      assert.strictEqual(res.status, 400);
      assert(res.json.message.includes("Invalid book ID"));
    });

    // 13. Route not found 404
    await test("Unknown route returns 404 with JSON message", async () => {
      const res = await makeRequest("GET", "/nonexistent");
      assert.strictEqual(res.status, 404);
      assert(res.json.message.includes("Cannot GET /nonexistent"));
    });
  } finally {
    if (server) {
      server.close();
    }
  }

  console.log(`\n=== Test Suite Results: ${passed}/${total} passed ===`);
  if (passed !== total) {
    process.exit(1);
  }
};

runTests().catch((err) => {
  console.error("Test execution error:", err);
  process.exit(1);
});
