# Lab 3 Postman test list

This is the fresh seeded Newman run recorded for the screenshots, using the checked-in Postman collection and local environment at `http://127.0.0.1:3001`. It completed **21 requests; 63 assertions passed; 0 failed**.

| Test case | Method | URL | Input | Expected status and response | Actual result |
|---|---|---|---|---|---|
| GET all (defaults) | GET | `/books` | — | 200; JSON {data[], total, limit, offset} | PASS — 200; list + pagination metadata |
| GET search_q partial title | GET | `/books?search_q=Gatsby` | — | 200; JSON {data[], total, limit, offset} | PASS — 200; list + pagination metadata |
| GET order_by + order | GET | `/books?order_by=price&order=DESC` | — | 200; JSON {data[], total, limit, offset} | PASS — 200; list + pagination metadata |
| GET limit + offset | GET | `/books?limit=3&offset=3` | — | 200; JSON {data[], total, limit, offset} | PASS — 200; list + pagination metadata |
| GET min_price + max_price | GET | `/books?min_price=300&max_price=450` | — | 200; JSON {data[], total, limit, offset} | PASS — 200; list + pagination metadata |
| GET combined filters | GET | `/books?search_q=The&order_by=price&order=ASC&limit=3&offset=0&min_price=200&max_price=500` | — | 200; JSON {data[], total, limit, offset} | PASS — 200; list + pagination metadata |
| GET by id (exists) | GET | `/books/1` | — | 200; JSON {data: book} | PASS — 200; book object |
| GET by id (404) | GET | `/books/9999` | — | 404; JSON {message} | PASS — 404; JSON message |
| POST valid (201) | POST | `/books` | {"title":"Postman Collection Book","author":"Test Author","price":425,"pages":210} | 201; JSON {message, data: book} | PASS — 201; created book |
| POST missing title (400) | POST | `/books` | {"author":"Test Author","price":425} | 400; JSON {message} | PASS — 400; JSON message |
| POST missing author (400) | POST | `/books` | {"title":"Missing Author","price":425} | 400; JSON {message} | PASS — 400; JSON message |
| POST non-numeric price (400) | POST | `/books` | {"title":"Invalid Price","author":"Test Author","price":"free"} | 400; JSON {message} | PASS — 400; JSON message |
| PUT valid (200) | PUT | `/books/1` | {"title":"Updated by Postman","price":355} | 200; JSON {message, data: book} | PASS — 200; updated book |
| PUT non-existent id (404) | PUT | `/books/9999` | {"title":"Missing Record"} | 404; JSON {message} | PASS — 404; JSON message |
| PUT invalid body (400) | PUT | `/books/1` | {} | 400; JSON {message} | PASS — 400; JSON message |
| DELETE valid (200) | DELETE | `/books/19` | — | 200; JSON {message} | PASS — 200; message |
| DELETE non-existent id (404) | DELETE | `/books/9999` | — | 404; JSON {message} | PASS — 404; JSON message |
| GET invalid order (400) | GET | `/books?order=SIDEWAYS` | — | 400; JSON {message} | PASS — 400; JSON message |
| GET invalid limit (400) | GET | `/books?limit=abc` | — | 400; JSON {message} | PASS — 400; JSON message |
| GET invalid price range (400) | GET | `/books?min_price=500&max_price=300` | — | 400; JSON {message} | PASS — 400; JSON message |
| GET invalid order_by (400) | GET | `/books?order_by=secret_column` | — | 400; JSON {message} | PASS — 400; JSON message |
