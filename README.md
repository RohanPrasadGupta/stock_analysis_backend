# stock_analysis_backend

The investment-side REST API behind [MoneyMgr](https://github.com/RohanPrasadGupta/moneyMgr) — an Express + MongoDB backend that stores the per-trade stock ledger, stock capital, coin/crypto capital, and SIP capital. It is one of two sibling backends the frontend talks to; the other, [`moneyMgrBackend`](../moneyMgrBackend), handles transactions, categories, and the shared currency list.

This is a **single-user, unauthenticated API** — there is no login system anywhere in the stack, by design.

## Tech stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js, [Express](https://expressjs.com/) 5 |
| Database | MongoDB via [Mongoose](https://mongoosejs.com/) 8 |
| Middleware | `cors`, `cookie-parser`, `dotenv` |
| Dev tooling | `nodemon` (used for both `start` and `dev`) |

`bcrypt`, `bcryptjs`, `jsonwebtoken`, and `redis` are installed as dependencies but never imported anywhere in the code — leftover/planned scaffolding, not active functionality. `xlsx` is likewise installed but unused today.

## How it works

### Startup (`server.js`)

1. Loads environment variables from `config.env`.
2. Connects to MongoDB Atlas using a connection string built from `USER_NAME` and `PASSWORD` (host/cluster/db name are hardcoded in `server.js`, not read from `MONGODB_URI`).
3. Wraps the Express app in `http.createServer(app)` and listens on `process.env.PORT` (falls back to `5000`; `config.env` sets it to `8001`).

### Request pipeline (`app.js`)

- `express.json()` body parsing, `cookie-parser` (registered but nothing reads/sets auth cookies today)
- CORS with an explicit origin allow-list (localhost dev ports, the deployed Netlify stock-analysis and moneyMgr frontends), `credentials: true`
- `GET /` — plain-text health check (`"API is running..."`)
- Four routers, all mounted under `/api`: `stockRoutes`, `stockCapitalRoutes`, `coinCapitalRoutes`, `sipCapitalRoutes`

## Data models

All four schemas use `{ timestamps: true }` (adds `createdAt`/`updatedAt`) and are indexed on `date: -1` where a `date` field exists.

### `StockTransaction` (per-trade ledger) — `model/model.js`

| Field | Type | Notes |
|-------|------|-------|
| `stockSymbol` | String | required, uppercase, trimmed |
| `stockName` | String | required, trimmed |
| `type` | String | required, `enum: ["BUY", "SELL"]`, uppercase |
| `price` | Number | required, min `0` |
| `quantity` | Number | required, min `1` |
| `totalAmount` | Number | required, min `0` — auto-computed as `price * quantity` in a `pre("save")` hook if not supplied |
| `investedDate` | Date | required |
| `currency` | String | required, uppercase, trimmed, **default `"NPR"`** |
| `useForAvgPrice` | Boolean | default `false` — controls whether a BUY row feeds the frontend's displayed average price; the average-price math itself lives client-side, this field is just persisted state |

### `StockCapital` — `model/stockModel.js`

`date` (Date, required), `amount` (Number, required, min `0`), `currency` (String, required, uppercase, trimmed, **default `"NPR"`**).

### `SipCapital` — `model/sipModel.js`

`name` (String, required, trimmed — the SIP fund name), `date` (Date, required), `amount` (Number, required, min `0`), `currency` (String, required, uppercase, trimmed, **default `"NPR"`**).

### `CoinCapital` — `model/coinModel.js`

`date` (Date, required), `amount` (Number, required, min `0`), `transactionCharge` (Number, required, min `0`, default `0`), `totalAmount` (Number, required, min `0` — auto-computed as `amount + transactionCharge` in a `pre("save")` hook if not supplied), `currency` (String, required, uppercase, trimmed, **default `"THB"`** — Coin capital is always Baht, by design; the frontend doesn't even show a currency picker for it).

None of these models reference or populate a currency/exchange-rate collection — `currency` is a plain string with only a static schema default. This backend has no knowledge of `moneyMgrBackend`'s `Currency` collection; it simply persists whatever currency code the frontend sends.

## API reference

All routes are mounted under `/api`. Responses follow a consistent envelope: `{ success, data/message/error, ...extras }` — `201` on create, `200` on success, `400`/`404` on business errors, `500` on unhandled exceptions.

### Stock transaction ledger — `routes/stockRoutes.js` → `services/stockdata.js`

| Method | Path | Description |
|--------|------|--------------|
| `POST` | `/api/transactions` | Create a BUY/SELL transaction |
| `GET` | `/api/transactions` | List, with optional `stockSymbol`, `type`, `startDate`, `endDate` filters |
| `GET` | `/api/transactions/:id` | Get one transaction |
| `PUT` | `/api/transactions/:id` | Full update — `totalAmount` is recalculated server-side if `price` or `quantity` changed |
| `PATCH` | `/api/transactions/:id` | Partial update, same recalculation behavior |
| `PATCH` | `/api/transactions/use-for-avg-price/:id` | Toggle only the `useForAvgPrice` flag — body `{ useForAvgPrice: boolean }` |
| `DELETE` | `/api/transactions/:id` | Delete a transaction |
| `GET` | `/api/portfolio/summary` | Aggregates every transaction by `stockSymbol` (BUY adds to quantity/invested, SELL subtracts) and returns per-symbol totals plus the raw list |

### Stock capital — `routes/stockCapitalRoutes.js` → `services/stockCapitalService.js`

| Method | Path | Description |
|--------|------|--------------|
| `POST` | `/api/capital` | Create a capital entry |
| `GET` | `/api/capital` | List, optional `startDate`/`endDate`, returns a `totalAmount` sum alongside the records |
| `GET` | `/api/capital/:id` | Get one |
| `PUT` / `PATCH` | `/api/capital/:id` | Update |
| `DELETE` | `/api/capital/:id` | Delete |
| `GET` | `/api/capital/summary/total` | `totalCapital`, `recordCount`, `firstInvestmentDate`, `lastInvestmentDate`, `averageInvestment` |

### SIP capital — `routes/sipCapitalRoutes.js` → `services/sipCapitalService.js`

| Method | Path | Description |
|--------|------|--------------|
| `POST` | `/api/sip-capital` | Create a SIP contribution |
| `GET` | `/api/sip-capital` | List, optional `startDate`/`endDate`, returns a `totalAmount` sum |
| `GET` | `/api/sip-capital/:id` | Get one |
| `PUT` | `/api/sip-capital/:id` | Update |
| `DELETE` | `/api/sip-capital/:id` | Delete |
| `GET` | `/api/sip-capital/summary/total` | `totalAmount`, `count`, `records` |

Unlike the other three resources, SIP capital has no `PATCH` route — only `PUT` for updates.

### Coin capital — `routes/coinCapitalRoutes.js` → `services/coinCapitalService.js`

| Method | Path | Description |
|--------|------|--------------|
| `POST` | `/api/coin-capital` | Create — body example `{ date, amount, transactionCharge }` |
| `GET` | `/api/coin-capital` | List, optional `startDate`/`endDate`, returns `summary: { totalAmount, totalTransactionCharge, grandTotal }` |
| `GET` | `/api/coin-capital/:id` | Get one |
| `PUT` / `PATCH` | `/api/coin-capital/:id` | Update — `totalAmount` recalculated server-side if `amount` or `transactionCharge` changed |
| `DELETE` | `/api/coin-capital/:id` | Delete |
| `GET` | `/api/coin-capital/summary/total` | `totalAmount`, `totalTransactionCharge`, `grandTotal`, `recordCount`, first/last dates, `averageAmount`, `averageTransactionCharge` |

## Business logic worth knowing

- **Average price is a frontend concern.** This backend has no average-price calculation endpoint — it only stores `useForAvgPrice` per transaction; the moneyMgr frontend decides which BUY rows to include when computing the displayed average price for a symbol.
- **`totalAmount` auto-computation** happens in `pre("save")` hooks on both `StockTransaction` (`price * quantity`) and `CoinCapital` (`amount + transactionCharge`), and is re-derived on update if the underlying fields change — callers can supply `totalAmount` explicitly, but it will be overwritten if the inputs it depends on are also present in the update payload.
- **Currency defaults are per-collection, not global**: NPR for the stock ledger, stock capital, and SIP capital; THB for coin capital. There is no currency validation against a known list — any string the frontend sends is accepted, uppercased, and trimmed.
- **No cross-collection joins** — `portfolio/summary` only reads from `StockTransaction`; it doesn't touch `StockCapital`, `SipCapital`, or `CoinCapital`.

## Environment variables

Create a `config.env` file in the project root (gitignored, never commit real values):

```env
PORT=8001
USER_NAME=your-mongodb-atlas-username
PASSWORD=your-mongodb-atlas-password
```

| Variable | Used for |
|----------|----------|
| `USER_NAME` | MongoDB Atlas username, interpolated into the connection string in `server.js` |
| `PASSWORD` | MongoDB Atlas password, interpolated into the connection string in `server.js` |
| `PORT` | HTTP server port (defaults to `5000` if unset) |

`config.env` may also define `MONGODB_URI`, `PASSWORD_rohg505`, `JWT_SECRET`, `NODE_ENV`, `REDIS_HOST`, `REDIS_PORT`, `REDIS_URL`, and `REDIS_PASSWORD` — none of these are read by any code path today (reserved/unused, likely copied from `moneyMgrBackend`'s config as a template).

## Getting started

### Prerequisites

- Node.js 18+
- A MongoDB Atlas cluster (or any MongoDB instance — update the connection logic in `server.js` if not using Atlas)

### Install and run

```bash
git clone <this-repo-url>
cd stock_analysis_backend
npm install
# create config.env with PORT, USER_NAME, PASSWORD
npm start
```

`npm start` and `npm run dev` are identical — both run `nodemon server.js`, which restarts on file changes and is used for both development and the currently-configured production start.

The API listens on `http://localhost:<PORT>` (default `5000`, or `8001` per the example `config.env`). Point moneyMgr's `NEXT_PUBLIC_API_URL_STOCK`, `NEXT_PUBLIC_API_URL_STOCK_CAPITAL`, and `NEXT_PUBLIC_API_URL_COIN_CAPITAL` at this same server — they're separate frontend env vars but usually the same deployment.

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Run the server via `nodemon server.js` |
| `npm run dev` | Same as `npm start` |
| `npm test` | Not implemented (placeholder script) |

## Project structure

```
stock_analysis_backend/
├── app.js                       # Express app: middleware, CORS, route mounting
├── server.js                     # Entry point: env loading, DB connect, HTTP listen
├── config.env                     # Local env vars (gitignored)
├── model/
│   ├── model.js                  # StockTransaction schema (per-trade ledger)
│   ├── stockModel.js             # StockCapital schema
│   ├── sipModel.js               # SipCapital schema
│   └── coinModel.js              # CoinCapital schema
├── routes/
│   ├── stockRoutes.js
│   ├── stockCapitalRoutes.js
│   ├── sipCapitalRoutes.js
│   └── coinCapitalRoutes.js
└── services/
    ├── stockdata.js               # Transaction CRUD + portfolio summary aggregation
    ├── stockCapitalService.js
    ├── sipCapitalService.js
    └── coinCapitalService.js
```

## Related repos

- **[moneyMgr](https://github.com/RohanPrasadGupta/moneyMgr)** — the Next.js frontend that consumes this API (and `moneyMgrBackend`)
- **`moneyMgrBackend`** — sibling backend for transactions, categories, and the shared currency list; entirely separate database, no shared code or knowledge between the two backends

## Known gaps

- No authentication — anything that can reach the API and pass the CORS check has full read/write access
- No currency validation against a canonical list — any string is accepted
- Several `package.json` dependencies (`bcrypt`, `bcryptjs`, `jsonwebtoken`, `redis`, `xlsx`) and `config.env` variables are unused leftovers, not active functionality
