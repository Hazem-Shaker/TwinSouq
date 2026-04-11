# TwinSouq Backend

REST API for a **multi-vendor, bilingual (English / Arabic) e-commerce** platform: customer accounts, vendor (provider) storefronts, catalog, cart, orders, installment purchases, reviews, favorites, addresses, platform settings, notifications, and provider earnings with payouts.

---

## Table of contents

1. [Tech stack](#tech-stack)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Environment variables](#environment-variables)
5. [Scripts](#scripts)
6. [Running the server](#running-the-server)
7. [API overview](#api-overview)
8. [Swagger API Documentation](#swagger-api-documentation)
9. [Authentication (JWT)](#authentication-jwt)
10. [Internationalization (i18n)](#internationalization-i18n)
11. [Responses & errors](#responses--errors)
12. [Background jobs (Agenda)](#background-jobs-agenda)
13. [Payment & checkout status](#payment--checkout-status)
14. [Logging & uploads](#logging--uploads)
15. [Project structure](#project-structure)

---

## Tech stack

| Layer                | Technology                                                               |
| -------------------- | ------------------------------------------------------------------------ |
| Runtime              | Node.js                                                                  |
| Language             | TypeScript                                                               |
| HTTP                 | Express 4                                                                |
| Database             | MongoDB (Mongoose 8)                                                     |
| Auth                 | JWT (`jsonwebtoken`) + persisted session tokens in MongoDB               |
| Validation           | Zod, express-validator                                                   |
| Scheduling           | [Agenda](https://github.com/agenda/agenda) (job queue backed by MongoDB) |
| i18n                 | i18next + `i18next-fs-backend` + `i18next-http-middleware`               |
| Password hashing     | bcrypt / bcryptjs                                                        |
| Email                | Nodemailer + Handlebars templates (`email-templates/`)                   |
| File handling        | Multer, Sharp, HEIC convert, optional Cloudinary                         |
| Real-time (optional) | Pusher / Beams                                                           |
| Logging              | Winston + daily rotate files                                             |

---

## Prerequisites

- **Node.js** 18+ recommended (aligned with `@types/node` in the project)
- **MongoDB** instance (local or Atlas)
- **npm** (or compatible package manager)

---

## Installation

```bash
# Clone or copy the project, then:
cd E-Commerce

# Install dependencies
npm install

# Create environment file (see next section)
cp .env.example .env   # if you maintain an example file; otherwise create .env manually

# Build TypeScript → dist/
npm run build

# Start production server
npm start
```

For development with auto-reload:

```bash
npm run dev
```

The dev server loads `src/server.ts` via `ts-node-dev`. Production uses `node dist/server.js` after `npm run build`.

---

## Environment variables

Configure a `.env` file in the project root. The app loads it via `dotenv` (`src/shared/config.ts`).

| Variable                                                          | Purpose                                        | Default (if unset)                       |
| ----------------------------------------------------------------- | ---------------------------------------------- | ---------------------------------------- |
| `NODE_ENV`                                                        | Environment name                               | `development`                            |
| `PORT`                                                            | HTTP port                                      | `3000`                                   |
| `MONGODB_URI`                                                     | MongoDB connection string                      | `mongodb://localhost:27017/ecommerce`    |
| `JWT_SECRET`                                                      | Secret for signing JWTs                        | `your-secret-key` (change in production) |
| `JWT_EXPIRES_IN`                                                  | JWT expiry passed to `jwt.sign` when used      | `7d`                                     |
| `API_URL`                                                         | Public base URL of this API (links, callbacks) | `http://localhost:3000`                  |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_SECURE` | Outbound email                                 | Mailtrap-style defaults in code          |
| `UPLOAD_PATH`                                                     | Local upload directory                         | `./uploads`                              |
| `PUSHER_INSTANCE_ID`, `PUSHER_SECRET_KEY`                         | Push notifications (Beams)                     | Required where notifications use Pusher  |

**Security:** Use a strong, unique `JWT_SECRET` in production. Never commit real `.env` values to version control.

---

## Scripts

| Script      | Command         | Description                      |
| ----------- | --------------- | -------------------------------- |
| Development | `npm run dev`   | `ts-node-dev` on `src/server.ts` |
| Build       | `npm run build` | `tsc` → `dist/`                  |
| Production  | `npm start`     | `node dist/server.js`            |
| Tests       | `npm test`      | Jest (configure as needed)       |

---

## Running the server

1. Ensure MongoDB is reachable (`MONGODB_URI`).
2. Run `npm run dev` or `npm run build && npm start`.
3. Default URL: `http://localhost:3000` (or your `PORT`).
4. Health check: `POST /api/health` — returns a success payload via `res.sendSuccess`.

Static files under `./uploads` are served at `/uploads` (see `src/app.ts`).

---

## API overview

**Full endpoint reference:** [docs/API.md](docs/API.md) — methods, paths, auth, multipart fields, pagination, and operational notes.

All JSON routes are mounted under **`/api`** unless noted.

| Prefix               | Module        | Role / purpose                                                            |
| -------------------- | ------------- | ------------------------------------------------------------------------- |
| `/api/files`         | File          | Uploads & file metadata                                                   |
| `/api/users`         | Users         | Registration, login, OTP, profile, provider onboarding                    |
| `/api/admins`        | Admins        | Admin authentication & admin-only operations                              |
| `/api/providers`     | Providers     | Vendor profile, stats, dashboard data (provider auth)                     |
| `/api/settings`      | Settings      | Public / admin app settings (bilingual names, SEO, contact)               |
| `/api/categories`    | Categories    | Product taxonomy                                                          |
| `/api/options`       | Options       | Product options tied to categories                                        |
| `/api/products`      | Products      | CRUD (provider), listing & detail (user), variants, installments metadata |
| `/api/carts`         | Carts         | Cart per user, tied to products/variants                                  |
| `/api/reviews`       | Reviews       | Product reviews                                                           |
| `/api/payment`       | Payment       | Payment module router (extend when a gateway is integrated)               |
| `/api/addresses`     | Addresses     | User shipping / billing addresses                                         |
| `/api/earnings`      | Earnings      | Provider wallet, withdrawals, admin payouts                               |
| `/api/orders`        | Orders        | Order creation, user/provider/admin order lists, installment orders       |
| `/api/favorites`     | Favorites     | User product favorites                                                    |
| `/api/notifications` | Notifications | User notifications (incl. Pusher where configured)                        |

Individual routers apply **User**, **Provider**, or **Admin** JWT middleware on protected routes. Open routes (e.g. some product listing, login) omit auth as defined per router.

---

## Swagger API Documentation

We use `swagger-jsdoc` and `swagger-ui-express` to auto-generate fully interactive API documentation based on OpenAPI 3.0 JSDoc comments placed in our router files (`src/modules/**/*.ts`).

### Viewing the Docs

Once the server is running, the documentation URI is logged in the console. You can view it by hitting:
**`http://localhost:3000/api-docs`**

### Global Exception Schemas

To keep the JSDoc comments clean and maintainable, global exception schemas and error payloads have been created in `src/shared/utils/swagger.ts`. When documenting an endpoint, you can simply reference these reusable responses instead of writing them out manually:

- **`400 Bad Request`**: `$ref: '#/components/responses/BadRequest'` (Includes validation arrays)
- **`401 Unauthorized`**: `$ref: '#/components/responses/Unauthorized'`
- **`403 Forbidden`**: `$ref: '#/components/responses/Forbidden'`
- **`404 Not Found`**: `$ref: '#/components/responses/NotFound'`
- **`500 Internal Server Error`**: `$ref: '#/components/responses/InternalServerError'`

### Example JSDoc usage

Check out `src/modules/users/user.router.ts` for a complete reference on how inputs, outputs, payload examples, and the above `$ref` schemas are cleanly configured for routes like `/register` or `/login`.

---

## Authentication (JWT)

### Token format

- Clients send: **`Authorization: Bearer <jwt>`** (the middleware splits on space and takes the second part).
- On **login** (user or admin), the API:
  1. Signs a JWT with payload `{ id, iat }` using `JWT_SECRET` (`src/shared/utils/auth/tokenUtils.ts`).
  2. Persists the full string **`Bearer <jwt>`** in the **`Token`** collection (`src/shared/models/Token.ts`), linked to the account id.
- On **each request**, `validateToken`:
  1. Looks up `Token` by `Bearer ` + raw token.
  2. Verifies the JWT with `jwt.verify`.

Logging out or invalidating sessions should remove the corresponding `Token` document (see `deleteToken` in `tokenUtils.ts`).

### Middleware classes (`src/shared/middlewares/auth/`)

| Middleware                                            | Typical use                                            | Behavior                                                                                                                                                                                                            |
| ----------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`UserAuthMiddleware.authenticate`**                 | Customer routes                                        | Validates JWT + token row; loads **User**; sets `req.user` with `id`, `email`, `name`, `type: "user"`.                                                                                                              |
| **`UserAuthMiddleware.authenticateWithProviderRole`** | Steps that require a user who has applied for provider | Same as user auth, but requires `roles` to include `"provider"`.                                                                                                                                                    |
| **`AdminAuthMiddleware.authenticate`**                | Admin routes                                           | Validates JWT + token; loads **Admin**; sets `req.user` with `type: "admin"`.                                                                                                                                       |
| **`ProviderAuthMiddleware.authenticate`**             | Vendor API                                             | User must have provider role; **Provider** profile must exist; sets `req.user` including `providerId`, `type: "provider"`. If profile is missing, responds with **`IncompleteUserData`** (`complete_your_profile`). |

Tokens for admins are also created via `generateToken(admin._id)`; the `Token` model’s `user` field still stores that id (admin user document id).

### TypeScript

`req.user` is extended on Express `Request` (see `src/shared/types/express.d.ts` if present).

---

## Internationalization (i18n)

- **i18next** loads JSON dictionaries from **`locales/en.json`** and **`locales/ar.json`**.
- **`languageMiddleware`** (`src/shared/middlewares/languageCheck.ts`) reads **`Accept-Language`** and sets `req.language` to `en` or `ar` (defaults to `en`).
- **i18next-http-middleware** also detects language from header, query, and cookie (see `src/shared/middlewares/i18n.ts`).
- Error messages often use **`req.t(\`errors.${key}\`)`** (`src/shared/middlewares/errorHandler.ts`) — ensure matching keys exist under `errors` in both locale files.

---

## Responses & errors

### Success

`successMiddleware` attaches **`res.sendSuccess(message, data, statusCode)`** (`src/shared/middlewares/successResponse.ts`). Typical shape:

```json
{
  "success": true,
  "message": "...",
  "data": null,
  "statusCode": 200
}
```

### Errors

Global **`errorHandler`** maps:

- **`BaseError`** subclasses → HTTP status from the error + `message: req.t('errors.<key>')` using the error’s `message` string as the translation key.
- **Zod** validation errors → `422` with `validation.*` keys.
- **Multer** errors → `400` with file-related error keys.

---

## Background jobs (Agenda)

Agenda uses the **same MongoDB** as the app and stores job definitions in the **`agendaJobs`** collection (`src/shared/scheduler/agenda.ts`). Jobs are processed on an interval (`processEvery: "60 seconds"`).

### 1. `clean_files` (file housekeeping)

| Property         | Value                                                                                                                                     |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **Job name**     | `clean_files`                                                                                                                             |
| **Registration** | `src/shared/scheduler/jobs/cleanFilesJob.ts`                                                                                              |
| **Schedule**     | **Recurring daily at midnight** — cron `0 0 * * *` (registered once if no existing job) in `src/shared/scheduler/jobRegistery.ts`         |
| **Behavior**     | Finds up to **500** `File` documents with `used: false`, then deletes them via shared file utilities (cleans orphaned uploads / DB rows). |

### 2. `ORDERS_NO_PAYMENT_RESPONSE` (order payment timeout)

| Property           | Value                                                                                                                                                                                                                                                                                                                                                                                                     |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Job name**       | `ORDERS_NO_PAYMENT_RESPONSE`                                                                                                                                                                                                                                                                                                                                                                              |
| **Class**          | `CancelOrderJob` (`src/modules/orders/jobs/cancelOrderJob.ts`)                                                                                                                                                                                                                                                                                                                                            |
| **Registration**   | `OrderModule` (`src/modules/orders/index.ts`) — `agenda.define(...)`                                                                                                                                                                                                                                                                                                                                      |
| **When scheduled** | **One-shot** — designed to run **30 minutes** after checkout creates a pending **`PaymentTransaction`** and links orders to it (e.g. `scheduleJob(CANCEL_ORDER_JOB_NAME, "in 30 minutes", { transaction })`). **With online checkout currently disabled**, this job is **not enqueued** by `CreateOrderLogic`, but the **handler stays registered** so you can wire it again when payment is implemented. |
| **Payload**        | `{ transaction: string }` — MongoDB id of **`PaymentTransaction`**.                                                                                                                                                                                                                                                                                                                                       |
| **Behavior**       | 1) Calls `PaymentService.noRespondGateway` to mark the transaction **`no-respond`** if still **`pending`**. 2) If updated: frees the user’s cart, **rolls back product stock** for all order line items, sets related **`Order`** documents’ **`paymentStatus`** to **`failed`**.                                                                                                                         |

### 3. `CANCEL_INSTALLMENTS_ORDER` (installment payment timeout)

| Property           | Value                                                                                                                                                                                                                                                                                                       |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Job name**       | `CANCEL_INSTALLMENTS_ORDER`                                                                                                                                                                                                                                                                                 |
| **Class**          | `CancelInstallmentsOrderJob` (`src/modules/orders/jobs/cancelInstallmentsOderJob.ts`)                                                                                                                                                                                                                       |
| **Registration**   | `OrderModule`                                                                                                                                                                                                                                                                                               |
| **When scheduled** | **One-shot**, **30 minutes** after installment pay would attach a **`transactionId`** to an **`InstallmentsOrder`**. **Currently** `PayInstallmentsLogic` returns before creating a payment session, so this job is **not enqueued** until a real gateway is added; the **handler remains** for future use. |
| **Payload**        | `{ transaction: string }`                                                                                                                                                                                                                                                                                   |
| **Behavior**       | Marks the **`PaymentTransaction`** as **`no-respond`** if still pending; if an **`InstallmentsOrder`** holds that `transactionId`, **`$unset`** the `transactionId` so the user can retry payment.                                                                                                          |

### 4. `UPDATE_EARNING_STATUS` (provider earnings release)

| Property           | Value                                                                                                                                                                |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Job name**       | `UPDATE_EARNING_STATUS`                                                                                                                                              |
| **Class**          | `UpdateEarningStatusJob` (`src/modules/earnings/jobs/updateEarningStatusJob.ts`)                                                                                     |
| **Registration**   | `EarningModule` (`src/modules/earnings/index.ts`)                                                                                                                    |
| **When scheduled** | **One-shot**, **`in 5 days`** after **`createOrderEarning`** or **`createInstallmentEarning`** (`src/modules/earnings/earning.service.ts`).                          |
| **Payload**        | `{ earningId: string }`                                                                                                                                              |
| **Behavior**       | Sets the **`Earning`** document’s **`status`** to **`available`** and moves the amount from **`pendingBalance`** to **`availableBalance`** on **`ProviderBalance`**. |

### Scheduler helpers

`src/shared/scheduler/scheduler.ts` exports:

- **`scheduleJob(name, when, data)`** — one-off schedule.
- **`scheduleRecurringJob(name, cron, data)`** — recurring.
- **`cancelJobs(name)`**, **`now(name, data)`** — utility wrappers.

---

## Payment & checkout status

The previous third-party **simulator / checkout integration has been removed**. **`POST /api/orders`** (standard cart checkout) and **`POST /api/orders/user/installments/pay`** currently respond with **`400`** and the i18n key **`online_payment_not_configured`** until you plug in a real payment provider.

- **`PaymentService`** still exposes **`noRespondGateway`** for the timeout jobs above.
- **`PaymentTransaction`** / **`Transaction`** models support gateway enums such as `hyperpay`, `stripe`, `paypal`, `bank_transfer` (no simulator gateway in schema).

To restore checkout: create pending transactions, return your provider’s payment URL to the client, implement webhooks or admin confirmation, and mark orders paid / failed consistently with stock and cart rules.

---

## Logging & uploads

- **Winston** logger (`src/shared/utils/logger.ts`) — logs API errors and DB connection events.
- **Uploads** default to `UPLOAD_PATH` (`./uploads`); the app serves them at **`/uploads`**.
- Email templates live under **`email-templates/`** (e.g. welcome email).

---

## Project structure (high level)

```
src/
  app.ts                 # Express app factory, middleware, route mounting
  server.ts              # HTTP listen
  modules/               # Feature modules (users, orders, products, …)
  shared/
    config.ts            # Central configuration
    database/            # Mongo connection
    middlewares/         # auth, i18n, language, errors, upload, …
    scheduler/           # Agenda instance, job registry, clean files job
    utils/               # auth (JWT), logger, aggregations, email, …
    models/              # Token, …
locales/
  en.json, ar.json       # i18n strings
email-templates/         # Handlebars emails
dist/                    # Compiled JS (after npm run build)
```

---

## Contributing & operations

- Run **`npm run build`** before release to ensure TypeScript compiles.
- Keep **`locales/en.json`** and **`locales/ar.json`** in sync when adding new error or validation keys.
- Monitor **`agendaJobs`** and application logs for failed jobs.
- Rotate secrets (`JWT_SECRET`, SMTP, Pusher) per environment.

---

## License

Specify your license in this repository (e.g. MIT, proprietary) — not set in this README by default.
