# Lab 3: REST API, query parameters, validation, debugging

**Live link: <PASTE PUBLIC URL HERE>**

SARANYA · 252U1R6102 · AIML - 2B

## How to run

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and set the environment variables you need: `PORT`, `DB_PATH`.
3. Seed the database: `npm run seed` (creates 18 sample books).
4. Start the API: `npm start` (or `npm run dev` while developing).

The default port is 3001 and the default database is `books.db` in this folder. The database file is ignored by Git.

## Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/books` | List books; `search_q` defaults to empty, `order_by` to `id`, `order` to `ASC`, `limit` to `10` (maximum 100), and `offset` to `0`; optional `min_price` and `max_price` filter prices. |
| GET | `/books/:id` | Return one book or a 404 message. |
| POST | `/books` | Create a book; title, author and numeric price are required. |
| PUT | `/books/:id` | Update one or more valid book fields. |
| DELETE | `/books/:id` | Delete a book. |

List responses use `{ "data": [...], "total": n, "limit": n, "offset": n }`; one-book responses use `{ "data": {...} }`. Create and update return `{ "message": "...", "data": {...} }`; delete returns `{ "message": "..." }`. Every error response is `{ "message": "..." }`.

## Postman checks

Import `postman/Lab3-Books-API.postman_collection.json` and `postman/Lab3.postman_environment.json`, select **Lab 3 Local**, and run the collection after seeding. The environment uses `baseUrl`. The collection includes 21 requests with status and response-shape assertions. Newman recorded **21 requests, 63 assertions passed, 0 failed** in `postman/TEST_LIST.md` and `postman/report.html`.

## Screenshots

These screenshots are from a real run in Postman and the terminal. Use the exact filenames and run instructions in [SCREENSHOTS_TODO.md](screenshots/SCREENSHOTS_TODO.md).

### Server

<!-- ![Server running in terminal](screenshots/01-server-running.png) -->

### Postman requests

![GET books defaults](screenshots/02-postman-get-books-default.png)

![GET books search_q](screenshots/03-postman-get-books-search-q.png)

![GET books order_by and order](screenshots/04-postman-get-books-order-by-order.png)

![GET books limit and offset](screenshots/05-postman-get-books-limit-offset.png)

![GET books price range](screenshots/06-postman-get-books-price-range.png)

![GET books combined filters](screenshots/34-postman-get-books-combined-filters.png)

![GET books ascending order](screenshots/35-postman-get-books-order-asc.png)

![GET books with maximum limit](screenshots/36-postman-get-books-limit-max.png)

![GET books price range 100 to 500](screenshots/37-postman-get-books-price-range-100-500.png)

![GET book by id 200](screenshots/07-postman-get-book-by-id-200.png)

![GET book by id 404](screenshots/08-postman-get-book-by-id-404.png)

![POST book 201](screenshots/09-postman-post-book-201.png)

<!-- ![POST missing title 400](screenshots/10-postman-post-missing-title-400.png) -->

<!-- ![POST missing author 400](screenshots/11-postman-post-missing-author-400.png) -->

<!-- ![POST non-numeric price 400](screenshots/12-postman-post-nonnumeric-price-400.png) -->

![PUT book 200](screenshots/13-postman-put-book-200.png)

![PUT book 404](screenshots/14-postman-put-book-404.png)

![PUT invalid body 400](screenshots/15-postman-put-book-400.png)

<!-- ![DELETE book 200](screenshots/16-postman-delete-book-200.png) -->

![DELETE book 404](screenshots/17-postman-delete-book-404.png)

<!-- ![GET invalid order 400](screenshots/18-postman-get-invalid-order-400.png) -->

<!-- ![GET invalid limit 400](screenshots/19-postman-get-invalid-limit-400.png) -->

<!-- ![GET invalid price range 400](screenshots/20-postman-get-invalid-price-range-400.png) -->

### Postman runner summary

<!-- ![Postman collection runner summary](screenshots/21-postman-runner-summary.png) -->

### Database views

<!-- ![Database after seeding](screenshots/22-db-after-seed.png) -->

<!-- ![Database after create](screenshots/23-db-after-create.png) -->

<!-- ![Database after update](screenshots/24-db-after-update.png) -->

<!-- ![Database after delete](screenshots/25-db-after-delete.png) -->

### Debug errors and fixes

<!-- ![Debug port conflict error](screenshots/26-debug-port-conflict-error.png) -->

<!-- ![Debug port conflict fix](screenshots/27-debug-port-conflict-fixed.png) -->

<!-- ![Debug wrong import error](screenshots/28-debug-wrong-import-error.png) -->

<!-- ![Debug wrong import fix](screenshots/29-debug-wrong-import-fixed.png) -->

<!-- ![Debug table typo error](screenshots/30-debug-table-typo-error.png) -->

<!-- ![Debug table typo fix](screenshots/31-debug-table-typo-fixed.png) -->

<!-- ![Debug missing await behavior](screenshots/32-debug-missing-await-error.png) -->

<!-- ![Debug missing await fix](screenshots/33-debug-missing-await-fixed.png) -->

## Notes

I carried the Lab 2 `book` table and Node.js, Express, and SQLite stack forward, then added input parsing and a single JSON error format. Sorting only uses a whitelist of known column names, and every user-provided SQL value is bound through a parameterized query. The seed script replaces the sample rows each time so the Postman run is repeatable.

### Debugging exercise

- **Port conflict:** I saw `EADDRINUSE` when a second server tried to listen on the same port. Both processes wanted the same address. I stopped the extra listener or selected a free `PORT`, then started one server.
- **Wrong import path:** Node reported `Cannot find module ...` while loading the app. The require path pointed to a file that did not exist. I corrected the relative path and reran the app.
- **Table-name typo:** SQLite returned `SQLITE_ERROR: no such table: books_typo`. The query used a misspelled table name. I changed it back to the schema's `book` table.
- **Missing `await`:** The query returned a Promise before SQLite had returned the row, so the response did not contain the expected book data. I added `await` before the async database call and verified the result.

The broken examples live in `debug-exercise/broken/`; the corrected copies and run commands are in `debug-exercise/fixed/`. Each defect is isolated so it can be reproduced and compared with its correction.

## Viva prep

**Query parameter vs path parameter:** A query parameter follows `?` and filters or changes a collection request, such as `?limit=10`. A path parameter is part of the route and identifies a specific resource, such as `/books/4`.

**What does stateless mean?** Each request carries what the server needs to handle it, so the server does not rely on remembered client conversation state between requests. The database still stores book records.

**400 vs 404:** I return 400 when the request input is invalid, such as a non-numeric price. I return 404 when the request is valid but the requested book ID does not exist.




