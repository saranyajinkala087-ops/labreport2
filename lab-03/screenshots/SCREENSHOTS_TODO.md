# Screenshot checklist

Save each genuine capture under this directory using the exact filename below. For Postman cases, show the request URL, status, response body, and passing tests where available. Run `npm install`, `npm run seed`, and `npm start` from `lab-03` before the API requests; the base URL is `http://127.0.0.1:3001`. Stop the API before the port-conflict reproduction.

| Done | Filename | Run this first |
|---|---|---|
| [ ] | `01-server-running.png` | In the lab-03 directory, run `npm start` with the server on port 3001. |
| [x] | `02-postman-get-books-default.png` | Postman request: `GET {{baseUrl}}/books`. |
| [x] | `03-postman-get-books-search-q.png` | Postman request: `GET {{baseUrl}}/books?search_q=the`. |
| [x] | `04-postman-get-books-order-by-order.png` | Postman request: `GET {{baseUrl}}/books?order_by=price&order=DESC`. |
| [x] | `05-postman-get-books-limit-offset.png` | Postman request: `GET {{baseUrl}}/books?limit=5&offset=5`. |
| [x] | `06-postman-get-books-price-range.png` | Postman request: `GET {{baseUrl}}/books?min_price=200&max_price=500`. |
| [x] | `34-postman-get-books-combined-filters.png` | Postman request: `GET {{baseUrl}}/books?search_q=a&order_by=title&order=ASC&limit=5&min_price=100`. |
| [x] | `07-postman-get-book-by-id-200.png` | Postman request: `GET {{baseUrl}}/books/1`. |
| [x] | `08-postman-get-book-by-id-404.png` | Postman request: `GET {{baseUrl}}/books/9999`. |
| [x] | `09-postman-post-book-201.png` | Postman request: `POST {{baseUrl}}/books` with `{ "title": "Clean Code", "author": "Robert C. Martin", "price": 450, "pages": 464 }`. |
| [ ] | `10-postman-post-missing-title-400.png` | Postman request: `POST {{baseUrl}}/books` with `{ "author": "Test Author", "price": 425 }`. |
| [ ] | `11-postman-post-missing-author-400.png` | Postman request: `POST {{baseUrl}}/books` with `{ "title": "Missing Author", "price": 425 }`. |
| [ ] | `12-postman-post-nonnumeric-price-400.png` | Postman request: `POST {{baseUrl}}/books` with `{ "title": "Invalid Price", "author": "Test Author", "price": "free" }`. |
| [x] | `13-postman-put-book-200.png` | Postman request: `PUT {{baseUrl}}/books/1` with `{ "title": "Clean Code", "author": "Robert C. Martin", "price": 450, "pages": 464 }`. |
| [x] | `14-postman-put-book-404.png` | Postman request: `PUT {{baseUrl}}/books/9999`; the screenshot shows the 404 response. |
| [x] | `15-postman-put-book-400.png` | Postman request: `PUT {{baseUrl}}/books/1` with an invalid body that omits the required title. |
| [ ] | `16-postman-delete-book-200.png` | After seeding and creating id 19, Postman request: `DELETE {{baseUrl}}/books/19`. |
| [x] | `17-postman-delete-book-404.png` | Postman request: `DELETE {{baseUrl}}/books/19` after that ID is absent; the screenshot shows 404. |
| [ ] | `18-postman-get-invalid-order-400.png` | Postman request: `GET {{baseUrl}}/books?order=SIDEWAYS`. |
| [ ] | `19-postman-get-invalid-limit-400.png` | Postman request: `GET {{baseUrl}}/books?limit=abc`. |
| [ ] | `20-postman-get-invalid-price-range-400.png` | Postman request: `GET {{baseUrl}}/books?min_price=500&max_price=300`. |
| [ ] | `21-postman-runner-summary.png` | Seed and start the API, then run the full Lab 3 collection in Postman Runner; confirm 21 requests and 63 assertions pass. |
| [ ] | `22-db-after-seed.png` | Run `npm run seed`, then `node scripts/show-books.js` in lab-03. |
| [ ] | `23-db-after-create.png` | Run `npm run seed`; in Postman send `POST {{baseUrl}}/books` with the valid body from item 09, then run `node scripts/show-books.js` in lab-03. |
| [ ] | `24-db-after-update.png` | Run `npm run seed`; in Postman send `PUT {{baseUrl}}/books/1` with `{ "title": "Updated by Postman", "price": 355 }`, then run `node scripts/show-books.js` in lab-03. |
| [ ] | `25-db-after-delete.png` | Run `npm run seed`; send the valid POST from item 09 to create id 19, then send `DELETE {{baseUrl}}/books/19` and run `node scripts/show-books.js` in lab-03. |
| [ ] | `26-debug-port-conflict-error.png` | Stop the lab-03 server if it is running; from `lab-03/debug-exercise/broken`, run `node run-port-conflict.js` (its dummy listener uses 3001 and closes itself). |
| [ ] | `27-debug-port-conflict-fixed.png` | After the dummy listener closes, from `lab-03/debug-exercise/fixed`, run `npm start`; capture the server starting on 3001. |
| [ ] | `28-debug-wrong-import-error.png` | From `lab-03/debug-exercise/broken`, run `node server.js`. |
| [ ] | `29-debug-wrong-import-fixed.png` | From `lab-03/debug-exercise/fixed`, run `npm start`; capture successful startup on 3001. |
| [ ] | `30-debug-table-typo-error.png` | Seed the main DB, then from `lab-03/debug-exercise/broken`, run `node run-table-typo.js`. |
| [ ] | `31-debug-table-typo-fixed.png` | From `lab-03/debug-exercise/fixed`, run `node run-table-typo.js`; capture the successful query. |
| [ ] | `32-debug-missing-await-error.png` | Seed the main DB, then from `lab-03/debug-exercise/broken`, run `node run-missing-await.js`. |
| [ ] | `33-debug-missing-await-fixed.png` | From `lab-03/debug-exercise/fixed`, run `node run-missing-await.js`; capture the returned book row. |
| [x] | `35-postman-get-books-order-asc.png` | Postman request: `GET {{baseUrl}}/books?order=ASC`. |
| [x] | `36-postman-get-books-limit-max.png` | Postman request: `GET {{baseUrl}}/books?limit=50`. |
| [x] | `37-postman-get-books-price-range-100-500.png` | Postman request: `GET {{baseUrl}}/books?min_price=100&max_price=500`. |
| [x] | `38-postman-post-book-201-id-21.png` | Postman request: `POST {{baseUrl}}/books` with `{ "title": "Clean Code", "author": "Robert C. Martin", "price": 450, "pages": 464 }`. |
| [x] | `39-postman-post-book-201-id-22.png` | Postman request: `POST {{baseUrl}}/books` with `{ "title": "Clean Code", "author": "Robert C. Martin", "price": 450, "pages": 464 }`. |
| [x] | `40-postman-post-book-201-id-23.png` | Postman request: `POST {{baseUrl}}/books` with `{ "title": "Clean Code", "author": "Robert C. Martin", "price": 450, "pages": 464 }`. |


