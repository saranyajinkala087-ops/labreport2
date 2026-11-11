# Debug reproductions

From this directory, run `npm install` first if you need an isolated installation. The four defects are kept in the broken copy:

- `node run-port-conflict.js` starts a dummy listener on port 3001, attempts to start a second listener, prints the real `EADDRINUSE` error, then stops only the dummy listener it created.
- `node server.js` shows the wrong relative import error.
- `node run-table-typo.js` shows SQLite's missing-table error.
- `node run-missing-await.js` shows the response serialized before the row is available.

The corrected source is in `../fixed/`. `run-table-typo.js` and `run-missing-await.js` show the corrected results. `server.js` uses the right import, and port conflict is resolved by using one listener or changing `PORT`.
