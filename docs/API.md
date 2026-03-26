# TwinSouq API — Reference Documentation

REST API base path: **`/api`**. All routes below are relative to that prefix unless stated otherwise.

**Example:** `GET /api/categories` → full URL `https://<host>/api/categories`.

---

## Table of contents

1. [Conventions](#conventions)
2. [Authentication](#authentication)
3. [Success & error responses](#success--error-responses)
4. [Pagination & sorting](#pagination--sorting)
5. [Health](#health)
6. [Users](#users)
7. [Admins](#admins)
8. [Files](#files)
9. [Settings](#settings)
10. [Providers](#providers)
11. [Categories](#categories)
12. [Options](#options)
13. [Products](#products)
14. [Carts](#carts)
15. [Reviews](#reviews)
16. [Addresses](#addresses)
17. [Earnings & payouts](#earnings--payouts)
18. [Orders](#orders)
19. [Favorites](#favorites)
20. [Notifications](#notifications)
21. [Payment module](#payment-module)
22. [Operational notes](#operational-notes)

---

## Conventions

### HTTP headers

| Header | Usage |
|--------|--------|
| **`Authorization`** | `Bearer <jwt>` for protected routes. Token is issued at login/verify and must exist in the `Token` collection. |
| **`Accept-Language`** | `en` or `ar`. Drives `req.language` and i18n message resolution. Invalid values fall back to `en` in `languageMiddleware`. |
| **`Content-Type`** | Many **user** and **admin** routes use **`multipart/form-data`** (`upload.any()` / `upload.fields(...)`), not raw JSON. Send text fields as form fields alongside files. |

### User object on `req.user` (after auth)

| `type` | Fields (typical) |
|--------|-------------------|
| `user` | `id`, `email`, `name` |
| `admin` | `id`, `email`, `name` |
| `provider` | `id`, `email`, `name`, **`providerId`** |

---

## Authentication

- **JWT** payload includes at least `{ id, iat }`, signed with `JWT_SECRET`.
- Server stores **`Bearer <token>`** in MongoDB; requests must send the raw JWT in `Authorization: Bearer <jwt>`; lookup uses `Bearer ` + token.
- **User** routes use `UserAuthMiddleware` (or `authenticateWithProviderRole` where noted).
- **Admin** routes use `AdminAuthMiddleware`.
- **Provider** routes use `ProviderAuthMiddleware` (user must have `provider` role and a **Provider** profile).

---

## Success & error responses

### Success (`res.sendSuccess`)

```json
{
  "success": true,
  "message": "<translated string>",
  "data": {},
  "statusCode": 200
}
```

`message` is usually a translation key resolved via i18n (e.g. `req.t("cart.fetched")`).

### Errors

Handled by `errorHandler`:

- **`BaseError`** subclasses → `statusCode` from error; body includes `message: req.t("errors.<key>")` where `<key>` is the error’s `message` string.
- **Zod** → `422`, `message` from `validation.*` keys.
- **Multer** → `400` for size / unexpected field issues.

---

## Pagination & sorting

Where **`paginationMiddleware`** is attached, query parameters:

| Param | Default | Description |
|-------|---------|----------------|
| `page` | `1` | Page number (≥ 1). |
| `limit` | `10` | Page size. |

`page` and `limit` are **removed** from `req.query` after processing; remaining query keys are passed through as filters (module-specific).

---

## Health

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/health` | No | Liveness check; echoes success with body. |

---

## Users

Base: **`/api/users`**

Most routes use **`multipart/form-data`** (`upload.any()` or fields as configured).

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/register` | No | Register user (name, email, password, phone, etc. — validated per Zod in register flow). |
| `POST` | `/verify` | No | Verify email/OTP after registration. |
| `POST` | `/resend-otp` | No | Resend OTP. |
| `POST` | `/login` | No | Login. Body: **`email`**, **`password`**, **`role`** (`"user"` \| `"provider"`). Returns token (`Bearer ...`). |
| `POST` | `/update-password` | User | Change password for authenticated user. |
| `POST` | `/request-password-reset` | No | Start password reset flow. |
| `POST` | `/verify-reset-password-otp` | No | Verify OTP for reset. |
| `POST` | `/reset-password` | No | Complete password reset. |
| `PUT` | `/be-provider` | User | Request provider role / upgrade flow (business logic in service). |
| `PUT` | `/` | User | Update profile. **Multipart** with optional **`photo`** (processed images). |
| `DELETE` | `/` | User | Delete own account (cascades provider data per service logic). |

---

## Admins

Base: **`/api/admins`**

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/login` | No | Admin login; returns admin JWT. |
| `POST` | `/create` | Admin | Create another admin account. Multipart form. |

---

## Files

Base: **`/api/files`**

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/test-cloudinary` | User | Dev/test upload: fields **`mainImage`** (1), **`images`** (up to 6). Returns processed body. |
| `DELETE` | `/delete-image/:fileId` | User | Delete file by id. |

---

## Settings

Base: **`/api/settings`**

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/` | No | Public app settings (bilingual app name, description, logos URLs, contact, social, etc.). |
| `GET` | `/admin` | Admin | Settings payload for admin UI. |
| `PUT` | `/` | Admin | Update settings. **Multipart**: optional **`headerLogo`**, **`footerLogo`**. |

---

## Providers

Base: **`/api/providers`**

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/requests` | User (must have **provider role**) | Submit provider application. **Multipart**: **`photo`**, **`idImageFront`**, **`idImageBack`**. |
| `GET` | `/requests` | Admin | Paginated list of provider requests. |
| `GET` | `/requests/:providerRequestId` | Admin | Single provider request. |
| `POST` | `/requests/:providerRequestId/accept` | Admin | Approve request. |
| `DELETE` | `/requests/:providerRequestId/reject` | Admin | Reject request. |
| `GET` | `/stats` | Provider | Dashboard stats (views, ratings, product counts, etc.). |
| `GET` | `/home-page` | Provider | Provider home / summary payload. |

---

## Categories

Base: **`/api/categories`**

### Public

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/` | No | List categories. **Pagination** middleware — use `page`, `limit`; additional filters per service. |
| `GET` | `/:slug` | No | Category by slug. |

### Admin

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/admin` | Admin | Create category. **Multipart**: **`image`**. |
| `GET` | `/admin` | Admin | List categories (paginated). |
| `GET` | `/admin/:id` | Admin | Category by id. |
| `PUT` | `/admin/:id` | Admin | Update category. **Multipart**: optional **`image`**. |
| `DELETE` | `/admin/:slug` | Admin | Delete category by **slug** (note: param name is `slug`). |

---

## Options

Base: **`/api/options`**

### Public

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/categories/:categoryId` | No | List options for a category. |

### Admin

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/admin` | Admin | Create option. |
| `GET` | `/admin/:id` | Admin | Option by id. |
| `PUT` | `/admin/:id` | Admin | Update option. |
| `DELETE` | `/admin/:id` | Admin | Delete option. |
| `GET` | `/admin/categories/:categoryId` | Admin | Options for category (admin view). |

---

## Products

Base: **`/api/products`**

### Public / optional user

Routes use **`CheckUser`**: if `Authorization` is present and valid, **`req.user`** is set (for favorites/`isFavorite` style fields in listings).

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/` | Optional user | List products. **Pagination** + query filters (category, price, sale, installments, sort, etc. — see `user/list/query-parser`). |
| `GET` | `/:id` | Optional user | Product detail by id. |

### Provider

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/provider` | Provider | Create product. **Multipart** + **`productUpload`** pipeline (complex nested product + variants payload — see provider create logic). |
| `GET` | `/provider` | Provider | List own products (paginated). |
| `GET` | `/provider/:id` | Provider | Product detail for owner. |
| `DELETE` | `/provider/:id` | Provider | Soft/archive delete per business rules. |
| `PATCH` | `/provider/:id/publish` | Provider | Publish / unarchive product. |
| `GET` | `/provider/:id/variants` | Provider | Paginated variants for product. |
| `POST` | `/provider/:id/variants` | Provider | Create variant. **Multipart**: **`images`** (up to 6). |
| `PUT` | `/provider/:id/variants/:variantId` | Provider | Update variant. **Multipart**: **`images`**. |
| `PUT` | `/provider/:productId` | Provider | Update product. **Multipart** + **`productUpload`**. |

---

## Carts

Base: **`/api/carts`**

All routes: **User** auth.

| Method | Path | Description |
|--------|------|-------------|
| `PUT` | `/` | Add/update line items in main cart (body: product, variant, quantity, options — per cart service). |
| `GET` | `/` | Get current user’s cart. |
| `GET` | `/installment` | Get installment-plan cart. |
| `PUT` | `/installment` | Add item to installment cart. |
| `DELETE` | `/installment/:product` | Remove product from installment cart. |

---

## Reviews

Base: **`/api/reviews`**

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/` | No | List reviews. Expects **`pagination`** (`page`, `limit`, `skip`) and **`query`** (`item` ObjectId optional, `sort`, `details`) in controller input — **the router currently does not mount `paginationMiddleware` on this route**; callers may need `page`/`limit` on the URL once middleware is aligned, or the handler may error if `req.pagination` is missing. |
| `POST` | `/` | User | Create product review. Body: **`item`**, **`rating`**, **`comment`**, **`itemType`**: `"product"`. |
| `GET` | `/stats` | No | Aggregated stats for reviews; **`query.item`** should be the product id. |

---

## Addresses

Base: **`/api/addresses`**

### User

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/user` | User | Create address. |
| `PUT` | `/user/:id` | User | Update address. |
| `GET` | `/user` | User | List addresses. |
| `GET` | `/user/:id` | User | Get one address. |
| `DELETE` | `/user/:id` | User | Delete address. |

### Provider

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/provider` | Provider | Create provider address. |
| `PUT` | `/provider/:id` | Provider | Update. |
| `GET` | `/provider` | Provider | List. |
| `GET` | `/provider/:id` | Provider | Get one. |
| `DELETE` | `/provider/:id` | Provider | Delete. |

---

## Earnings & payouts

Base: **`/api/earnings`**

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/wallet` | Provider | Wallet balances (available, pending, withdrawn, last updated). |
| `POST` | `/withdraw` | Provider | Request withdrawal (IBAN, etc. — see Zod in service). |
| `GET` | `/admin/payouts` | Admin | Paginated payout requests. |
| `PATCH` | `/admin/payout/:id` | Admin | Mark payout as paid / confirm processing. |

Earnings records move from **pending** to **available** after a scheduled job (`UPDATE_EARNING_STATUS`, ~5 days) — see main README scheduler section.

---

## Orders

Base: **`/api/orders`**

### User

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/` | User | **Checkout** from cart. Body includes **`address`** (Mongo id of user address). **Currently returns `400`** with `errors.online_payment_not_configured` until a payment gateway is integrated. |
| `POST` | `/installments` | User | Create **installment purchase application**. **Multipart**: **`accountStatement`**, **`salaryCertificate`**, **`contract`**. |
| `GET` | `/user` | User | Paginated list of user’s paid/normal orders. |
| `GET` | `/user/installments` | User | Paginated installment orders. |
| `GET` | `/user/installments/:id` | User | Single installment order (user). |
| `POST` | `/user/installments/pay` | User | Pay next installment. **Currently returns `400`** `online_payment_not_configured`. |

### Provider

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/provider` | Provider | Paginated orders for vendor’s products. |
| `GET` | `/provider/installments` | Provider | Paginated installment applications. |
| `GET` | `/provider/installments/:id` | Provider | Single installment order. |
| `PATCH` | `/provider/installments/:id` | Provider | Update installment application (approve/reject, etc. — per body schema). |
| `DELETE` | `/provider/installments/:id` | Provider | Cancel installment application. |

### Admin

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/admin` | Admin | Paginated orders; filters e.g. payment/shipping status in query. |
| `PATCH` | `/admin/:id` | Admin | Update shipping status (and related side effects). |

---

## Favorites

Base: **`/api/favorites`**

All routes: **User** auth + **pagination** on list.

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/` | List favorites (product-only). |
| `PUT` | `/` | Add favorite. Body: **`item`** (product id), **`itemType`**: `"product"`. |
| `DELETE` | `/` | Remove favorite. Same body shape as add. |

---

## Notifications

Base: **`/api/notifications`**

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/user/token` | User | Pusher Beams (or similar) token for push notifications. |
| `GET` | `/provider/token` | Provider | Provider push token. |

Requires `PUSHER_INSTANCE_ID` and `PUSHER_SECRET_KEY` in environment.

---

## Payment module

Base: **`/api/payment`**

The router is mounted but **defines no HTTP routes** today. Internal **`PaymentService`** supports **`noRespondGateway`** for Agenda timeout jobs. Integrate new gateways here when checkout is restored.

---

## Operational notes

1. **Static files:** `GET /uploads/...` serves local upload directory.
2. **CORS:** Configured to allow credentials; origin callback currently allows all origins (review for production).
3. **Agenda jobs** use the same MongoDB URI; collection **`agendaJobs`**.
4. **i18n files:** `locales/en.json`, `locales/ar.json` — keys must exist for `errors.*` and `validation.*` used in code.
5. **Reviews list + pagination:** Consider adding `paginationMiddleware` to `GET /api/reviews` in `review.router.ts` if clients receive validation errors.

---

## Quick reference — all prefixes

| Prefix | Purpose |
|--------|---------|
| `/api/health` | Health |
| `/api/users` | Customers |
| `/api/admins` | Admins |
| `/api/files` | Uploads / file cleanup |
| `/api/providers` | Vendor onboarding & dashboard |
| `/api/settings` | Global settings |
| `/api/categories` | Categories |
| `/api/options` | Product options |
| `/api/products` | Catalog & provider catalog |
| `/api/carts` | Carts |
| `/api/reviews` | Reviews |
| `/api/payment` | (Reserved) |
| `/api/addresses` | Addresses |
| `/api/earnings` | Wallet & payouts |
| `/api/orders` | Orders & installments |
| `/api/favorites` | Favorites |
| `/api/notifications` | Push tokens |

For architecture, jobs, and env vars, see **[README.md](../README.md)** in the repository root.
