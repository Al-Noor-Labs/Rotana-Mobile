# Rotana Store — API Reference (v2.0 — Kits, Offers, Payments, Counts, Notifications, Variants, Reviews, Wishlist, Scheduled Orders)

> **Base URL:** `http://localhost:3000/api/v1`
>
> **Postman Collection:** Import [rotana-api.postman_collection.json](./rotana-api.postman_collection.json) into Postman.

---

## Table of Contents

- [Authentication](#authentication)
- [Response Format](#response-format)
- [Role-Based Access Control](#role-based-access-control)
- [Endpoints](#endpoints)
  - [Auth](#1-auth)
  - [Auth — OTP](#1b-auth--otp-phone-verification)
  - [Users](#2-users)
  - [Products](#3-products)
  - [Categories](#4-categories)
  - [Orders](#5-orders)
  - [Deliveries](#6-deliveries)
  - [Inventory](#7-inventory)
  - [Locations](#8-locations)
  - [Suppliers](#9-suppliers)
  - [GRN](#10-grn-goods-received-notes)
  - [Transfers](#11-stock-transfers)
  - [Finance](#12-finance)
  - [Payroll](#13-payroll)
  - [Dashboard](#14-dashboard)
  - [Analytics](#15-analytics)
  - [Media](#16-media-file-storage)
  - [Rider App](#17-rider-app)
  - [Riders & Admin Management](#18-riders--admin-management)
  - [Returns & Credit Notes](#19-returns--credit-notes)
  - [B2B Pricing Tiers](#20-b2b-pricing-tiers)
  - [PO Export](#21-po-export)
  - [Kits & Bundles](#22-kits--bundles)
  - [Offers & Promotions](#23-offers--promotions)
  - [Payments — Razorpay](#24-payments--razorpay)
  - [Inventory Counts](#25-inventory-counts-cycle-count)
  - [Notifications](#26-notifications)
  - [Product Variant CRUD](#27-product-variant-crud)
  - [Reviews](#28-product-reviews)
  - [Wishlist](#29-wishlist)
  - [Scheduled Orders](#30-scheduled-orders)
  - [Health](#31-health)
  - [Rider GPS Location](#32-rider-gps-location)
  - [Payments — Status Polling](#33-payments--status-polling)
  - [B2B Customers](#34-b2b-customers)

---

## Authentication

All protected endpoints require either:

**Option A — Cookie (web app):** The `access_token` HttpOnly cookie is set automatically by `POST /auth/login` and `POST /auth/otp/verify`. Browsers send it on every same-origin request.

**Option B — Bearer Token (mobile app):**

```
Authorization: Bearer <accessToken>
```

Tokens are obtained via `POST /auth/login` or `POST /auth/otp/verify`. Access tokens expire in **15 minutes**; use `POST /auth/refresh` to rotate.

### CSRF Protection

All `POST`, `PATCH`, `DELETE`, and `PUT` requests are protected by an Edge middleware that validates the `Origin` header. Requests with an `Origin` that does not match the server's own host are rejected with `403 FORBIDDEN`. This applies to browser requests only — Postman, curl, and the mobile app (which send no `Origin`) are unaffected.

---

## Response Format

### Success (single resource)

```json
{
  "success": true,
  "data": { ... }
}
```

### Success (paginated list)

```json
{
  "success": true,
  "data": [ ... ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### Error

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "The requested resource was not found.",
    "details": null
  }
}
```

**Common Error Codes:** `VALIDATION_ERROR` (400/422) · `UNAUTHENTICATED` (401) · `FORBIDDEN` (403) · `NOT_FOUND` (404) · `CONFLICT` (409) · `INSUFFICIENT_STOCK` (422) · `OTP_COOLDOWN` (429) · `OTP_RATE_LIMIT` (429) · `INTERNAL_ERROR` (500)

> **Architecture Note:** The warehouse is the central fulfillment hub. All B2C/B2B online orders are queued, packed, and dispatched from the warehouse. Stores operate as franchise outlets handling walk-in POS only.

---

## Role-Based Access Control

| Group                  | Roles                                                                        | Used By                                                                       |
| ---------------------- | ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| **ADMIN_ROLES**        | `SUPER_ADMIN`                                                                | User management, ledger account creation, category delete                     |
| **PRODUCT_ROLES**      | `SUPER_ADMIN`, `WAREHOUSE_MANAGER`                                           | Product create/edit/delete, barcode lookup, B2B pricing tier configuration    |
| **WAREHOUSE_ROLES**    | `SUPER_ADMIN`, `WAREHOUSE_MANAGER`                                           | GRN mutations, transfer approve/reject/dispatch, PO mutations                 |
| **MANAGER_ROLES**      | `SUPER_ADMIN`, `WAREHOUSE_MANAGER`, `STORE_MANAGER`                          | Categories, suppliers, transfer request (all roles), GRN read, PO export      |
| **FRANCHISE_ROLES**    | `SUPER_ADMIN`, `STORE_MANAGER`, `CASHIER`                                    | Franchise POS, orders, returns, transfer complete                             |
| **STAFF_ROLES**        | `SUPER_ADMIN`, `WAREHOUSE_MANAGER`, `STORE_MANAGER`, `CASHIER`, `ACCOUNTANT` | Orders (POST), dashboard, finance ledger, inventory queries, B2B pricing view |
| **DELIVERY_ROLES**     | `SUPER_ADMIN`, `WAREHOUSE_MANAGER`, `DELIVERY_DRIVER`                        | Delivery management                                                           |
| **ORDER_VIEWER_ROLES** | All of `STAFF_ROLES` + `SALESMAN` + `CUSTOMER`                               | `GET /orders` — scoped server-side per role                                   |

**All Roles:** `SUPER_ADMIN` · `WAREHOUSE_MANAGER` · `STORE_MANAGER` · `CASHIER` · `SALESMAN` · `DELIVERY_DRIVER` · `ACCOUNTANT` · `CUSTOMER`

> **Role scoping on GET /orders:** `SALESMAN` sees only their assigned orders. `CUSTOMER` sees only their own orders. All other roles see all orders (with optional filters).

---

## Endpoints

### 1. Auth

| Method | Endpoint         | Auth   | Description                    |
| ------ | ---------------- | ------ | ------------------------------ |
| `POST` | `/auth/register` | Public | Register a new user            |
| `POST` | `/auth/login`    | Public | Login with email/password      |
| `POST` | `/auth/refresh`  | Public | Rotate access + refresh tokens |
| `GET`  | `/auth/me`       | Bearer | Get current user profile       |
| `POST` | `/auth/me`       | Bearer | Logout (delete refresh tokens) |

<details>
<summary><strong>POST /auth/register</strong></summary>

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "<your-password>",
  "phone": "9876543210",
  "role": "CUSTOMER"
}
```

**Allowed roles for self-registration:** `CUSTOMER`, `CASHIER`, `SALESMAN`, `DELIVERY_DRIVER`

**Response (201):** `{ success, data: { user, accessToken, refreshToken } }`

Sets `access_token` HttpOnly cookie (`SameSite=Strict`, 15 min).

</details>

<details>
<summary><strong>POST /auth/login</strong></summary>

```json
{
  "email": "admin@rotana.com",
  "password": "<your-password>"
}
```

**Response (200):** `{ success, data: { user, accessToken, refreshToken } }`

Sets `access_token` HttpOnly cookie (`SameSite=Strict`, 15 min).

</details>

<details>
<summary><strong>POST /auth/refresh</strong></summary>

```json
{
  "refreshToken": "eyJhbG..."
}
```

**Response (200):** `{ success, data: { accessToken, refreshToken } }`

Old refresh token is immediately invalidated. Sets new `access_token` cookie.

</details>

---

### 1b. Auth — OTP (Phone Verification)

> **Phase 1:** OTP is hardcoded to `123456`. No SMS is actually sent — the code is logged server-side.
>
> **Phase 2:** Plug in a real SMS provider (Twilio, MSG91, etc.) by implementing the `ISmsProvider` interface.

| Method | Endpoint           | Auth   | Description                          |
| ------ | ------------------ | ------ | ------------------------------------ |
| `POST` | `/auth/otp/send`   | Public | Send OTP to phone (with cooldown)    |
| `POST` | `/auth/otp/verify` | Public | Verify OTP and get tokens            |
| `POST` | `/auth/otp/resend` | Public | Resend OTP (cooldown + hourly limit) |

**Eligible roles:** `CUSTOMER`, `DELIVERY_DRIVER` only.

**Phone format:** Defaults to `+91` (India) if no country code is provided. Accepts E.164 format (`+971501234567`) or local format (`9876543210`).

<details>
<summary><strong>POST /auth/otp/send</strong></summary>

```json
{
  "phone": "9876543210"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "message": "OTP sent successfully",
    "otpToken": "uuid-correlation-id",
    "expiresInSeconds": 300
  }
}
```

The `otpToken` is a UUID that correlates send/verify/resend. The phone is never exposed through the token.

**Error responses:**

| Code                 | HTTP | When                                                    |
| -------------------- | ---- | ------------------------------------------------------- |
| `PHONE_NOT_FOUND`    | 404  | No active user with this phone                          |
| `OTP_ROLE_FORBIDDEN` | 403  | User role is not CUSTOMER or DELIVERY_DRIVER            |
| `OTP_COOLDOWN`       | 429  | Must wait 60s since the last OTP was sent to this phone |
| `OTP_RATE_LIMIT`     | 429  | More than 5 OTP requests in the last hour               |
| `VALIDATION_ERROR`   | 422  | Invalid phone format                                    |

> **Note:** `OTP_COOLDOWN` now applies to initial `/send` requests as well as `/resend`. This prevents OTP flooding from a fresh phone number.

</details>

<details>
<summary><strong>POST /auth/otp/verify</strong></summary>

```json
{
  "otpToken": "uuid-from-send-response",
  "code": "123456"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "user": { "id": "...", "name": "...", "email": "...", "phone": "...", "role": "..." },
    "accessToken": "eyJ...",
    "refreshToken": "eyJ..."
  }
}
```

Sets `access_token` HttpOnly cookie. Tokens work with `/auth/refresh` and `/auth/me`.

**Error responses:**

| Code               | HTTP | When                                     |
| ------------------ | ---- | ---------------------------------------- |
| `NOT_FOUND`        | 404  | Invalid or unknown `otpToken`            |
| `OTP_EXPIRED`      | 401  | OTP has expired (>5 min) or already used |
| `INVALID_OTP`      | 401  | Wrong code entered                       |
| `OTP_MAX_ATTEMPTS` | 429  | 5+ failed attempts — request a new OTP   |

</details>

<details>
<summary><strong>POST /auth/otp/resend</strong></summary>

```json
{
  "otpToken": "uuid-from-send-response"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "message": "OTP resent successfully",
    "expiresInSeconds": 300
  }
}
```

The same `otpToken` is reused. Code and expiry refresh. Attempt counter resets to 0.

**Error responses:**

| Code             | HTTP | When                                      |
| ---------------- | ---- | ----------------------------------------- |
| `NOT_FOUND`      | 404  | Invalid `otpToken` or already verified    |
| `OTP_COOLDOWN`   | 429  | Must wait 60s between resend requests     |
| `OTP_RATE_LIMIT` | 429  | More than 5 OTP requests in the last hour |

</details>

**Security Controls:**

| Control               | Value         | Purpose                             |
| --------------------- | ------------- | ----------------------------------- |
| OTP expiry            | 5 minutes     | Limits window of validity           |
| Max verify attempts   | 5 per token   | Prevents brute-force                |
| Send cooldown         | 60 seconds    | Prevents OTP flooding on new phones |
| Resend cooldown       | 60 seconds    | Prevents SMS bombing                |
| Max OTPs per phone/hr | 5             | Abuse prevention                    |
| Code storage          | bcrypt hashed | Production-ready from day one       |
| Expired OTP cleanup   | On every send | Keeps table clean automatically     |

---

### 2. Users

| Method   | Endpoint     | Auth        | Description                |
| -------- | ------------ | ----------- | -------------------------- |
| `GET`    | `/users`     | ADMIN_ROLES | List all users             |
| `PATCH`  | `/users/:id` | ADMIN_ROLES | Update user                |
| `DELETE` | `/users/:id` | ADMIN_ROLES | Soft-delete (disable) user |

**Query params (GET):** `role` — filter by role enum

<details>
<summary><strong>PATCH /users/:id</strong></summary>

```json
{
  "name": "Updated Name",
  "phone": "9876543210",
  "role": "CASHIER",
  "isActive": true,
  "password": "<new-password>"
}
```

</details>

---

### 3. Products

| Method   | Endpoint                     | Auth          | Description                                                    |
| -------- | ---------------------------- | ------------- | -------------------------------------------------------------- |
| `GET`    | `/products`                  | **Public**    | List active products (paginated, `locationId` for POS scoping) |
| `GET`    | `/products/:id`              | **Public**    | Get single product (UUID validated)                            |
| `GET`    | `/products/barcode/:barcode` | STAFF_ROLES   | Look up variant by barcode or SKU (warehouse scanner + POS)    |
| `POST`   | `/products`                  | PRODUCT_ROLES | Create product with variants                                   |
| `PATCH`  | `/products/:id`              | PRODUCT_ROLES | Update product (Zod allowlist enforced)                        |
| `DELETE` | `/products/:id`              | PRODUCT_ROLES | Soft-delete (sets status → DISCONTINUED)                       |
| `POST`   | `/products/bulk`             | PRODUCT_ROLES | Bulk create products                                           |

> **Permission change (v2.0):** Product create/edit/delete is restricted to `PRODUCT_ROLES` (`SUPER_ADMIN`, `WAREHOUSE_MANAGER`). `STORE_MANAGER` cannot modify the product catalogue.

**Query params (GET list):** `categoryId`, `search`, `locationId` (UUID — scope stock to a specific store/franchise), `page`, `limit`

> Product listings are cached by the CDN for 60 seconds (`Cache-Control: public, s-maxage=60, stale-while-revalidate=300`). This reduces DB load on high-traffic catalogue pages.
>
> Product listings include **warehouse stock availability** per variant (`inventoryBalances` with `available`, `onHand`, `reserved`).
>
> **Barcode is on `ProductVariant`**, not on `Product`. Each variant has its own EAN/UPC barcode. Lookup by barcode or SKU via `GET /products/barcode/:barcode`.
>
> **POS stock scoping:** Pass `locationId=<store-uuid>` to scope `inventoryBalances` to a specific store/franchise — used by the POS to show accurate on-shelf stock instead of warehouse totals. Each variant's `inventoryBalances` array has one entry per matched location.

<details>
<summary><strong>GET /products/barcode/:barcode — Barcode scanner lookup</strong></summary>

Searches by `ProductVariant.barcode` first, then falls back to `ProductVariant.sku`. Used by the warehouse barcode scanner and POS terminal.

| Response | Meaning           | Frontend action                                                 |
| -------- | ----------------- | --------------------------------------------------------------- |
| `200`    | Barcode/SKU found | Open product in edit/view mode (warehouse) or add to cart (POS) |
| `404`    | Not registered    | Show "Register new product" form, pre-fill the barcode field    |

</details>

<details>
<summary><strong>POST /products</strong></summary>

```json
{
  "categoryId": "uuid",
  "name": "Basmati Rice",
  "description": "Premium aged basmati",
  "brand": "Daawat",
  "imageUrl": "https://cdn.rotana.com/products/...",
  "images": [],
  "isPerishable": false,
  "tags": ["rice", "staples"],
  "variants": [
    {
      "sku": "RICE-BAS-1KG",
      "barcode": "8901234001001",
      "name": "1 Kg Pack",
      "unitValue": 1,
      "unitLabel": "kg",
      "costPrice": 80,
      "sellingPrice": 120,
      "mrp": 130,
      "taxRate": 5,
      "reorderLevel": 10
    }
  ]
}
```

**Required:** `categoryId`, `name`, `variants` (min 1)

> `imageUrl` should be obtained from `POST /media/upload-binary` (binary upload) or `POST /media/upload` (presigned URL flow). Use `context: "product"`.

</details>

<details>
<summary><strong>PATCH /products/:id</strong></summary>

Only the following fields are accepted. Any other field in the body is silently ignored (allowlist enforced by Zod — no mass assignment risk):

```json
{
  "name": "Updated Name",
  "description": "Updated description",
  "imageUrl": "https://...",
  "barcode": "8901234567890",
  "status": "ACTIVE",
  "categoryId": "uuid"
}
```

**`status` values:** `ACTIVE` · `INACTIVE` · `DISCONTINUED`

Returns `400 VALIDATION_ERROR` if `:id` is not a valid UUID.

</details>

---

### 4. Categories

| Method   | Endpoint          | Auth          | Description                              |
| -------- | ----------------- | ------------- | ---------------------------------------- |
| `GET`    | `/categories`     | **Public**    | List categories (paginated, searchable)  |
| `GET`    | `/categories/:id` | **Public**    | Get single category with product count   |
| `POST`   | `/categories`     | MANAGER_ROLES | Create category                          |
| `PATCH`  | `/categories/:id` | MANAGER_ROLES | Update category (Zod allowlist enforced) |
| `DELETE` | `/categories/:id` | ADMIN_ROLES   | Soft-delete (sets isActive → false)      |

**Query params (GET list):** `search` (name/description), `status` (active/inactive/all), `page`, `limit`

<details>
<summary><strong>POST /categories</strong></summary>

```json
{
  "name": "Beverages",
  "description": "All drinks",
  "imageUrl": "https://...",
  "parentId": "parent-category-uuid"
}
```

</details>

<details>
<summary><strong>PATCH /categories/:id</strong></summary>

Only the following fields are accepted. Any other field in the body is silently ignored (allowlist enforced by Zod — no mass assignment risk):

```json
{
  "name": "Updated Beverages",
  "description": "Updated description",
  "imageUrl": "https://...",
  "parentId": "parent-category-uuid",
  "isActive": true
}
```

Returns `400 VALIDATION_ERROR` if `:id` is not a valid UUID.

</details>

---

### 5. Orders

| Method  | Endpoint      | Auth               | Description                              |
| ------- | ------------- | ------------------ | ---------------------------------------- |
| `GET`   | `/orders`     | ORDER_ACCESS_ROLES | List orders (paginated, role-scoped)     |
| `GET`   | `/orders/:id` | Any authenticated  | Get order details                        |
| `POST`  | `/orders`     | ORDER_ACCESS_ROLES | Create order (atomic: stock + inventory) |
| `PATCH` | `/orders/:id` | STAFF_ROLES        | Update status/payment                    |

**ORDER_ACCESS_ROLES:** `SUPER_ADMIN`, `WAREHOUSE_MANAGER`, `STORE_MANAGER`, `CASHIER`, `ACCOUNTANT`, `CUSTOMER`

**Query params (GET list):** `status`, `orderType`, `customerId`, `orderNumber` (exact match), `page`, `limit`

> **Role scoping on GET:** `SALESMAN` sees only orders assigned to them. `CUSTOMER` sees only their own orders (server-enforced — cannot filter by another customerId). Other roles see all orders.
>
> **Warehouse-centric fulfillment:** If `sourceLocationId` is omitted, orders default to the primary active warehouse. If provided, it must be a `WAREHOUSE`-type location.
>
> **Atomicity guarantee:** The stock availability check and inventory reservation happen inside a single `Serializable` transaction — concurrent requests for the same last-in-stock item cannot both succeed.
>
> **Order numbers:** Format `ORD-<timestamp36>-<8 hex chars>`. The suffix uses `crypto.randomBytes` — collision-safe under concurrent load.

<details>
<summary><strong>POST /orders</strong></summary>

```json
{
  "customerId": "uuid",
  "orderType": "B2C_ONLINE",
  "paymentMethod": "CASH",
  "sourceLocationId": "warehouse-uuid",
  "deliveryAddressId": "address-uuid",
  "items": [{ "variantId": "uuid", "quantity": 2 }],
  "notes": "Deliver before 5 PM",
  "discountAmount": 0,
  "deliveryCharge": 50,
  "couponCode": "SAVE20",
  "loyaltyPointsToRedeem": 500
}
```

**`orderType` values:** `B2C_STORE` · `B2C_ONLINE` · `B2B_WHOLESALE` · `INTERNAL_TRANSFER`

**`paymentMethod` values:** `CASH` · `CARD` · `UPI` · `BANK_TRANSFER` · `CREDIT`

**Customer constraints (mobile app):** When called by a `CUSTOMER` role:

- `customerId` is automatically set to the authenticated user's ID — field is ignored if provided
- `orderType: B2B_WHOLESALE` is blocked (returns `403 FORBIDDEN`)
- `discountAmount` is forced to `0` regardless of what is sent
- `sourceLocationId` should be omitted — defaults to the primary active warehouse

**Coupon + loyalty discount errors (all 422):**

| Code                            | When                                               |
| ------------------------------- | -------------------------------------------------- |
| `COUPON_NOT_FOUND`              | Code does not exist                                |
| `COUPON_EXPIRED`                | Past end date                                      |
| `COUPON_PAUSED`                 | Admin has paused the coupon                        |
| `COUPON_DEPLETED`               | Usage limit reached                                |
| `COUPON_BELOW_MIN_ORDER`        | Order subtotal below the coupon minimum            |
| `COUPON_USAGE_LIMIT_EXCEEDED`   | Customer has already used this coupon max times    |
| `COUPON_NOT_APPLICABLE`         | No eligible items in the cart for this coupon      |
| `LOYALTY_BELOW_MIN_REDEEM`      | Fewer points than the minimum redemption           |
| `LOYALTY_INSUFFICIENT_POINTS`   | Customer balance is lower than requested           |
| `LOYALTY_EXCEEDS_MAX_PER_ORDER` | Exceeds the per-order cap                          |
| `LOYALTY_EXCEEDS_BILL_PERCENT`  | Would discount more than the allowed % of the bill |
| `LOYALTY_NOT_ELIGIBLE`          | Order type or customer not eligible                |

> **Loyalty atomicity:** Loyalty point deduction is applied inside the same database transaction as order creation and inventory reservation. If any step fails, all are rolled back — no free discounts from partial failures.

</details>

<details>
<summary><strong>PATCH /orders/:id</strong></summary>

```json
{
  "status": "DELIVERED",
  "paymentStatus": "PAID",
  "paidAmount": 500,
  "gatewayRef": "txn_123",
  "notes": "Payment collected",
  "assignedToId": "salesman-uuid"
}
```

> On `DELIVERED`: inventory fulfilled, ledger entries posted, invoice auto-generated, loyalty points credited.
> On `CANCELLED`: reserved inventory released, loyalty/coupon refunded if applicable.

</details>

---

### 6. Deliveries

| Method  | Endpoint          | Auth           | Description                 |
| ------- | ----------------- | -------------- | --------------------------- |
| `GET`   | `/deliveries`     | DELIVERY_ROLES | List deliveries (paginated) |
| `POST`  | `/deliveries`     | MANAGER_ROLES  | Assign delivery to order    |
| `PATCH` | `/deliveries/:id` | DELIVERY_ROLES | Update delivery status      |

**Query params (GET):** `status`, `driverId`, `page`, `limit`

> **Pagination:** GET /deliveries is paginated (default 20 per page). Previous versions returned all records unbounded — this was a performance and memory issue.
>
> Drivers automatically see only their own deliveries.

<details>
<summary><strong>POST /deliveries</strong></summary>

```json
{
  "orderId": "order-uuid",
  "driverId": "driver-uuid",
  "estimatedAt": "2026-03-10T15:00:00Z",
  "routeOrder": 1
}
```

**Required:** `orderId`, `driverId`

> **`driverId` is now required.** Deliveries must be assigned to a driver at creation time. Use `PATCH /deliveries/:id` to change the driver later. This prevents deliveries in `ASSIGNED` status with no driver.

Returns `409 CONFLICT` if a delivery already exists for this order.

</details>

<details>
<summary><strong>PATCH /deliveries/:id</strong></summary>

```json
{
  "status": "DELIVERED",
  "latitude": 12.9716,
  "longitude": 77.5946,
  "deliveryProof": "https://...",
  "failureReason": "",
  "notes": "Left with security"
}
```

**`status` values:** `ASSIGNED` · `PICKED_UP` · `IN_TRANSIT` · `DELIVERED` · `FAILED` · `RETURNED`

> On `DELIVERED`: triggers full fulfillment (order → inventory → ledger → invoice).

</details>

---

### 7. Inventory

| Method | Endpoint     | Auth          | Description                                  |
| ------ | ------------ | ------------- | -------------------------------------------- |
| `GET`  | `/inventory` | STAFF_ROLES   | Query stock levels (cached 10s)              |
| `POST` | `/inventory` | MANAGER_ROLES | Apply manual inventory event (atomic upsert) |

**Query params (GET):** `locationId`, `variantId`, `lowStock` (true/false)

> When `locationId` is omitted, inventory defaults to **warehouse locations** — the primary stock source.
>
> **Caching:** GET /inventory returns `Cache-Control: private, max-age=10`. Clients can avoid re-fetching within a 10-second window.
>
> **Performance:** The response enriches each balance with variant and product data in a single DB query (no N+1). Low-stock filtering is applied in the same query pass.
>
> **Atomicity:** Balance updates use `upsert` with `increment` operators — concurrent events for the same SKU/location cannot create duplicate rows or lose updates.

<details>
<summary><strong>POST /inventory</strong></summary>

```json
{
  "variantId": "uuid",
  "locationId": "uuid",
  "eventType": "STOCK_IN",
  "quantity": 100,
  "referenceId": "optional-uuid",
  "referenceType": "MANUAL",
  "notes": "Manual adjustment"
}
```

**Event types:** `STOCK_IN` · `STOCK_OUT` · `ADJUSTMENT` · `ORDER_RESERVED` · `ORDER_RELEASED` · `ORDER_FULFILLED` · `TRANSFER_IN` · `TRANSFER_OUT` · `DAMAGE_WRITE_OFF` · `RETURN_IN`

</details>

---

### 8. Locations

| Method   | Endpoint         | Auth          | Description                            |
| -------- | ---------------- | ------------- | -------------------------------------- |
| `GET`    | `/locations`     | **Public**    | List active locations with bins        |
| `POST`   | `/locations`     | MANAGER_ROLES | Create location                        |
| `PATCH`  | `/locations/:id` | SUPER_ADMIN   | Update location name/code/type/address |
| `DELETE` | `/locations/:id` | SUPER_ADMIN   | Soft-deactivate location               |

**Query params (GET):** `type` — `WAREHOUSE` · `STORE` · `FRANCHISE` · `TRANSIT`

<details>
<summary><strong>POST /locations</strong></summary>

```json
{
  "name": "Main Warehouse",
  "type": "WAREHOUSE",
  "code": "WH-001",
  "address": "123 Street",
  "city": "Riyadh",
  "parentWarehouseId": "warehouse-uuid"
}
```

`parentWarehouseId` is required for `FRANCHISE` type locations.

</details>

<details>
<summary><strong>PATCH /locations/:id</strong></summary>

All fields optional. `code` is uppercased automatically. Returns 409 if `code` is already in use by another location.

```json
{
  "name": "North Warehouse",
  "code": "WH-002",
  "type": "WAREHOUSE",
  "address": "456 Industrial Rd",
  "city": "Jeddah",
  "parentWarehouseId": null,
  "isActive": true
}
```

Emits `LOCATION_UPDATED` audit event.

</details>

<details>
<summary><strong>DELETE /locations/:id</strong></summary>

Soft-delete only — sets `isActive: false`. Does not remove the row or its linked staff.

```json
{ "success": true }
```

Emits `LOCATION_DEACTIVATED` audit event.

</details>

---

### 9. Suppliers

| Method   | Endpoint         | Auth          | Description                                |
| -------- | ---------------- | ------------- | ------------------------------------------ |
| `GET`    | `/suppliers`     | STAFF_ROLES   | List active suppliers                      |
| `POST`   | `/suppliers`     | MANAGER_ROLES | Create supplier                            |
| `GET`    | `/suppliers/:id` | MANAGER_ROLES | Get supplier detail with financial summary |
| `PATCH`  | `/suppliers/:id` | MANAGER_ROLES | Update supplier fields                     |
| `DELETE` | `/suppliers/:id` | ADMIN_ROLES   | Soft-delete (set status → INACTIVE)        |

**Query params (GET list):** `search` — name or contact name

> **`GET /suppliers/:id` requires `MANAGER_ROLES`** (upgraded from STAFF_ROLES). The detail response includes sensitive financial data: `creditLimit`, `paymentTerms`, `totalInvoiced`, `totalPaid`, `outstandingBalance`. Delivery drivers and cashiers should not have access to supplier financials.

<details>
<summary><strong>POST /suppliers</strong></summary>

```json
{
  "name": "Al Marai Foods",
  "contactName": "Ahmed Khan",
  "phone": "+966501234567",
  "email": "ahmed@almarai.com",
  "address": "123 Supply St",
  "city": "Jeddah",
  "gstNumber": "GST12345",
  "panNumber": "PAN12345",
  "paymentTerms": 30,
  "creditLimit": 50000
}
```

</details>

<details>
<summary><strong>GET /suppliers/:id — Response shape</strong></summary>

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Al Marai Foods",
    "contactName": "Ahmed Khan",
    "paymentTerms": 30,
    "creditLimit": 50000,
    "totalPOs": 12,
    "totalGRNs": 10,
    "totalInvoices": 8,
    "totalInvoiced": 480000,
    "totalPaid": 420000,
    "outstandingBalance": 60000
  }
}
```

Financial totals are computed from `SupplierInvoice` in a single `groupBy` query.

</details>

---

### 10. GRN (Goods Received Notes)

| Method  | Endpoint   | Auth            | Description                                    |
| ------- | ---------- | --------------- | ---------------------------------------------- |
| `GET`   | `/grn`     | STAFF_ROLES     | List GRNs (paginated)                          |
| `GET`   | `/grn/:id` | STAFF_ROLES     | Single GRN                                     |
| `POST`  | `/grn`     | MANAGER_ROLES   | Create GRN + auto stock-in                     |
| `PATCH` | `/grn/:id` | WAREHOUSE_ROLES | Partial update (status, notes, items, invoice) |

**Query params (GET `/grn`):** `status`, `supplierId`, `page`, `limit` — pagination uses the shared helper: `page` ≥ 1, `limit` between 1 and **100** (default 20).

**Invoice / challan (direct-to-R2):** After `POST /media/upload` with context `invoice` (or another allowed context) and a successful `PUT` to the presigned URL, send the returned object **`key`** as optional **`invoiceMediaKey`** on **POST `/grn`**. It is stored on `GoodsReceivedNote`. List and single-GRN responses also include **`invoicePublicUrl`**: the CDN URL derived from `invoiceMediaKey` when `CLOUDFLARE_R2_PUBLIC_URL` is set (otherwise `null`). Line items include **`variant.product.imageUrl`** when present.

**PATCH `/grn/:id` (allowlist):** `status`, `notes`, `invoiceRef`, **`invoiceMediaKey`** (non-empty string to set, or **`null`** to clear the stored key), and `items[]` with `itemId` plus optional quantity/cost fields — unchanged from before, plus the invoice fields above.

<details>
<summary><strong>POST /grn</strong></summary>

```json
{
  "supplierId": "uuid",
  "locationId": "uuid",
  "purchaseOrderId": "uuid",
  "invoiceRef": "INV-2026-001",
  "invoiceMediaKey": "invoices/2026/05/<uuid>.pdf",
  "notes": "Weekly shipment",
  "items": [
    {
      "variantId": "uuid",
      "orderedQty": 100,
      "receivedQty": 95,
      "damagedQty": 3,
      "costPrice": 50.0,
      "expiryDate": "2026-12-31T00:00:00Z",
      "batchNumber": "BATCH-001"
    }
  ]
}
```

**Optional body fields:** `purchaseOrderId`, `invoiceRef`, `invoiceMediaKey`, `notes`. **`invoiceMediaKey`** must be the `key` returned from `POST /media/upload` (not the presigned URL).

Usable qty (`receivedQty - damagedQty`) is stocked in. Damaged items are written off. GRN transitions `RECEIVED → STOCKED` atomically.

</details>

---

### 11. Stock Transfers

**New in v1.7:** Full request → approve → dispatch → receive flow for franchises.

| Method | Endpoint                  | Auth            | Description                                                        |
| ------ | ------------------------- | --------------- | ------------------------------------------------------------------ |
| `GET`  | `/transfers`              | STAFF_ROLES     | List transfers (paginated, filterable)                             |
| `POST` | `/transfers`              | MANAGER_ROLES   | Create transfer request (franchise) or direct dispatch (warehouse) |
| `POST` | `/transfers/:id/approve`  | WAREHOUSE_ROLES | Approve a REQUESTED transfer                                       |
| `POST` | `/transfers/:id/reject`   | WAREHOUSE_ROLES | Reject a REQUESTED or APPROVED transfer (with reason)              |
| `POST` | `/transfers/:id/dispatch` | WAREHOUSE_ROLES | Dispatch APPROVED transfer — fires TRANSFER_OUT                    |
| `POST` | `/transfers/:id/complete` | STAFF_ROLES     | Confirm receipt — fires TRANSFER_IN, status → COMPLETED            |

**Query params (GET):** `status`, `fromLocationId`, `toLocationId`, `page`, `limit`

**Transfer status flow:**

```
Franchise request:  REQUESTED → APPROVED → DISPATCHED → COMPLETED
                                         ↘ REJECTED
Warehouse direct:   (created as DISPATCHED directly) → COMPLETED
```

**`TransferStatus` values:** `REQUESTED` · `APPROVED` · `REJECTED` · `DISPATCHED` · `COMPLETED` · `CANCELLED`

<details>
<summary><strong>POST /transfers — Franchise request</strong></summary>

```json
{
  "fromLocationId": "warehouse-uuid",
  "toLocationId": "franchise-uuid",
  "notes": "Weekly replenishment",
  "items": [{ "variantId": "uuid", "requestedQty": 50 }]
}
```

When called by `STORE_MANAGER` or `CASHIER`: creates with `status: REQUESTED` — no stock movement.

When called by `WAREHOUSE_MANAGER` with `"warehouseDirect": true`: creates as `DISPATCHED` and fires `TRANSFER_OUT` immediately (old behavior).

</details>

<details>
<summary><strong>POST /transfers/:id/reject</strong></summary>

```json
{ "reason": "Insufficient warehouse stock this week" }
```

`reason` required, min 5 chars.

</details>

<details>
<summary><strong>POST /transfers/:id/dispatch</strong></summary>

```json
{
  "items": [{ "variantId": "uuid", "sentQty": 48 }]
}
```

`items` optional — if omitted, sends the full `requestedQty` per item. Fires `TRANSFER_OUT`. Returns `422 INSUFFICIENT_STOCK` if warehouse stock is short.

</details>

<details>
<summary><strong>POST /transfers/:id/complete</strong></summary>

```json
{
  "items": [{ "variantId": "uuid", "receivedQty": 46 }]
}
```

Adds to destination via `TRANSFER_IN`. Supports partial receipt (receivedQty may differ from sentQty). Marks transfer `COMPLETED`.

</details>

---

### 12. Finance

| Method | Endpoint            | Auth        | Description                     |
| ------ | ------------------- | ----------- | ------------------------------- |
| `GET`  | `/finance/accounts` | STAFF_ROLES | List ledger accounts            |
| `POST` | `/finance/accounts` | ADMIN_ROLES | Create ledger account           |
| `GET`  | `/finance/ledger`   | STAFF_ROLES | View ledger entries (paginated) |

**Ledger query params:** `page`, `limit`, `from` (ISO date), `to` (ISO date), `referenceType`

<details>
<summary><strong>POST /finance/accounts</strong></summary>

```json
{
  "code": "2001",
  "name": "Accounts Payable",
  "type": "LIABILITY",
  "description": "Money owed"
}
```

**`type` values:** `ASSET` · `LIABILITY` · `EQUITY` · `REVENUE` · `EXPENSE`

</details>

---

### 13. Payroll

| Method   | Endpoint                | Auth          | Description                   |
| -------- | ----------------------- | ------------- | ----------------------------- |
| `GET`    | `/payroll/commissions`  | MANAGER_ROLES | List sales commissions        |
| `GET`    | `/payroll/payslips`     | MANAGER_ROLES | List payslips                 |
| `POST`   | `/payroll/payslips`     | MANAGER_ROLES | Create/bulk payslips (upsert) |
| `GET`    | `/payroll/payslips/:id` | MANAGER_ROLES | Get payslip detail            |
| `PUT`    | `/payroll/payslips/:id` | MANAGER_ROLES | Update payslip                |
| `DELETE` | `/payroll/payslips/:id` | MANAGER_ROLES | Delete payslip                |

**Commission query params:** `userId`, `isPaid`
**Payslip query params:** `userId`, `month`, `year`

<details>
<summary><strong>POST /payroll/payslips</strong> (single or array)</summary>

```json
{
  "userId": "employee-uuid",
  "month": 3,
  "year": 2026,
  "basicSalary": 5000,
  "allowances": 1000,
  "deductions": 500,
  "commissions": 800,
  "paidAt": null
}
```

Net pay auto-calculated: `basicSalary + allowances + commissions - deductions`. Upserts on `(userId, month, year)`.

</details>

---

### 14. Dashboard

| Method | Endpoint            | Auth        | Description             |
| ------ | ------------------- | ----------- | ----------------------- |
| `GET`  | `/dashboard`        | STAFF_ROLES | Business summary (KPIs) |
| `GET`  | `/dashboard/charts` | STAFF_ROLES | Full BI chart data      |

**Summary returns:** orders (today/month/pending), revenue (total/monthly/growth%), warehouse inventory alerts, delivery stats, top 5 products.

**Charts data returns:** P&L (revenue, COGS, salaries, margins), 30-day sales trends, category distribution, stock per location, payroll history, stock value.

---

### 15. Analytics

| Method | Endpoint               | Auth          | Description                  |
| ------ | ---------------------- | ------------- | ---------------------------- |
| `GET`  | `/analytics/employees` | MANAGER_ROLES | Employee performance metrics |
| `GET`  | `/analytics/suppliers` | MANAGER_ROLES | Supplier performance metrics |

**Query params:** `startDate`, `endDate` (ISO dates, defaults to current month)

**Employee metrics:** orders handled, revenue generated, deliveries completed, commissions earned.

**Supplier metrics:** total GRNs, invoices, spend, discrepancy rate, reliability score.

---

### 16. Media (File Storage)

Media files are stored in **Cloudflare R2**. Files never pass through the Next.js server — the client receives a presigned PUT URL and uploads directly to R2, eliminating Vercel bandwidth costs.

**Upload flow:**

1. `POST /media/upload` → receive `uploadUrl`, `key`, `publicUrl`
2. `PUT <uploadUrl>` with raw file binary and correct `Content-Type` header
3. Persist `key` + `publicUrl` in your DB record

| Method   | Endpoint               | Auth          | Description                                               |
| -------- | ---------------------- | ------------- | --------------------------------------------------------- |
| `POST`   | `/media/upload`        | Any auth user | Generate presigned PUT URL for direct R2 upload           |
| `POST`   | `/media/upload-binary` | Any auth user | Upload file directly through server (multipart/form-data) |
| `DELETE` | `/media/:key`          | MANAGER_ROLES | Permanently delete an object from R2                      |

> **Note:** The `:key` may contain slashes (e.g. `products/2026/03/uuid.webp`). URL-encode it: `encodeURIComponent(key)`.

<details>
<summary><strong>POST /media/upload</strong></summary>

```json
{
  "context": "product",
  "mimeType": "image/webp",
  "fileSizeBytes": 204800
}
```

**Supported `context` values:**

| Context        | Bucket prefix       |
| -------------- | ------------------- |
| `product`      | `products/`         |
| `supplier_doc` | `suppliers/docs/`   |
| `invoice`      | `invoices/`         |
| `payslip`      | `payroll/payslips/` |
| `grn`          | `grn/attachments/`  |
| `avatar`       | `users/avatars/`    |
| `other`        | `misc/`             |

**Max file size:** 50 MB

**Response (200):**

```json
{
  "success": true,
  "data": {
    "uploadUrl": "https://<bucket>.r2.cloudflarestorage.com/...",
    "key": "products/2026/03/<uuid>.webp",
    "publicUrl": "https://cdn.rotana.com/products/2026/03/<uuid>.webp",
    "expiresAt": "2026-03-29T14:15:00.000Z"
  }
}
```

`uploadUrl` valid for **15 minutes**. PUT binary body directly to this URL.

</details>

---

---

## 17. Rider App

> **Auth note:** All `/rider/*` endpoints except `POST /rider/register` and `GET /rider/application` require a valid `DELIVERY_DRIVER` Bearer token (obtained via `POST /auth/login` after the application is approved).

---

### POST `/rider/register` _(unauthenticated)_

Submits a rider onboarding **application**. Does **not** create a login account immediately — the application is `PENDING` until an admin approves it. After approval, the rider logs in via `POST /auth/login`.

**Mandatory fields:**

| Field           | Description                                        |
| --------------- | -------------------------------------------------- |
| `name`          | Full name (min 2 chars)                            |
| `phone`         | Mobile number (unique)                             |
| `password`      | Min 6 chars — stored hashed, activated on approval |
| `aadhaarNumber` | Exactly 12 digits                                  |
| `vehicleType`   | `MOTORCYCLE` \| `BICYCLE` \| `CAR` \| `SCOOTER`    |
| `vehicleNumber` | Registration plate (e.g. `TS 09 AB 1234`)          |
| `addressLine1`  | Street address                                     |
| `city`          | City                                               |
| `state`         | State                                              |
| `pincode`       | 6 digits                                           |

Optional: `email`, `addressLine2`

**Body:**

```json
{
  "name": "Ahmed Khan",
  "phone": "+919876543210",
  "password": "securepass123",
  "aadhaarNumber": "123456789012",
  "vehicleType": "MOTORCYCLE",
  "vehicleNumber": "TS 09 AB 1234",
  "addressLine1": "Flat 302, Green Towers",
  "city": "Hyderabad",
  "state": "Telangana",
  "pincode": "500081"
}
```

**Response:** `201` — `{ application: { id, name, phone, status: "PENDING" }, message }`

**Errors:** `409 CONFLICT` — phone already has an application or a live user account.

---

### GET `/rider/application?phone={phone}` _(unauthenticated)_

Check application status before login credentials exist.

**Response:** `{ id, name, phone, status, rejectionReason, reviewedAt, createdAt }`

---

### PATCH `/rider/documents`

Upload Aadhaar card photo URL after account is activated. Get a signed upload URL first via `POST /media/upload`, upload the image, then pass the CDN URL here.

**Body:** `{ "aadhaarPhotoUrl": "https://cdn.rotana.com/aadhaar/abc.jpg" }`

**Response:** `{ id, aadhaarPhotoUrl, isAadhaarVerified, updatedAt }`

---

### PATCH `/rider/status`

Toggle rider online/offline. Automatically accrues `onlineMinutes` when going offline.

**Body:** `{ "isOnline": true }`

**Response:** `{ isOnline, onlineMinutes, riderCode }`

---

### GET `/rider/profile`

Returns rider user + profile (riderCode, vehicleType, vehicleNumber, stats, preferences).

### PATCH `/rider/profile`

Update vehicle details or notification preferences.

**Body (all optional):**

```json
{
  "vehicleType": "MOTORCYCLE",
  "vehicleNumber": "TS 09 AB 1234",
  "pushNotifications": true,
  "locationSharing": true
}
```

---

### GET `/rider/orders/incoming`

Returns `READY_FOR_DISPATCH` orders available for acceptance. Returns `[]` if rider is offline.

**Response:** Array of orders with `customer`, `deliveryAddress`, `sourceLocation`, `items`.

---

### POST `/rider/orders/{orderId}/accept`

Atomically assigns the order to this rider. Prevents duplicate acceptance — if another rider already accepted, returns `409 CONFLICT`. Also returns `409` if rider already has an active delivery.

**Response:** `201` — full delivery with nested order details.

---

### POST `/rider/orders/{orderId}/reject`

Rider dismisses an incoming order. Order stays `READY_FOR_DISPATCH` for other riders.

**Body (optional):** `{ "reason": "Too far" }`

**Response:** `{ orderId, riderId, action: "rejected" }`

---

### GET `/rider/orders/active`

Returns the rider's current active delivery (status in ASSIGNED, PICKED_UP, IN_TRANSIT), or `null` if none.

---

### PATCH `/rider/orders/{orderId}/delivery-status`

Advance the delivery through its lifecycle. Enforced state machine:

| From       | Allowed `status` values |
| ---------- | ----------------------- |
| ASSIGNED   | PICKED_UP               |
| PICKED_UP  | IN_TRANSIT              |
| IN_TRANSIT | DELIVERED, FAILED       |
| FAILED     | RETURNED                |

**Body:**

```json
{
  "status": "DELIVERED",
  "latitude": 17.4401,
  "longitude": 78.3489,
  "distanceKm": 2.5,
  "deliveryProof": "https://cdn.rotana.com/proof/abc.jpg",
  "notes": "Left at door"
}
```

On `DELIVERED`: fulfills inventory, posts ledger entries, generates invoice, records `RiderEarning`, and updates rider stats.

---

### GET `/rider/earnings?period=today|week|month`

Returns earnings summary and delivery history for the requested period.

**Response:**

```json
{
  "summary": {
    "totalEarnings": 5420,
    "totalDeliveries": 142,
    "totalDistanceKm": 245.2,
    "onlineHours": 118,
    "avgRating": 4.8
  },
  "period": { "label": "month", "total": 1200, "count": 48 },
  "deliveries": [
    {
      "orderNumber": "ORD-45231",
      "orderAmount": 279.5,
      "deliveryFee": 25,
      "distanceKm": 2.5,
      "completedAt": "2026-05-13T14:30:00Z"
    }
  ]
}
```

---

## 18. Riders & Admin Management

All endpoints in this section require SUPER_ADMIN, WAREHOUSE_MANAGER, or STORE_MANAGER role.

---

### Rider Application Flow

#### GET `/admin/rider-applications?status=PENDING|APPROVED|REJECTED`

List rider applications, paginated. Omit `status` to return all.

**Response:** `{ data: [...], meta: { page, limit, total, totalPages } }`

Each item includes: `id, name, phone, email, vehicleType, vehicleNumber, city, state, aadhaarPhotoUrl, status, rejectionReason, reviewedAt, createdAt`

---

#### POST `/admin/rider-applications/{id}/approve`

Approves a PENDING application. In one transaction:

1. Marks application `APPROVED`
2. Creates `User` with `DELIVERY_DRIVER` role
3. Creates `RiderProfile` linked back to the application (generates `riderCode`)

Rider can now log in via `POST /auth/login`.

**Response:** `{ user, profile }`

**Errors:** `409 CONFLICT` — application not PENDING, or phone already has a user account.

---

#### POST `/admin/rider-applications/{id}/reject`

Rejects a PENDING application with a mandatory reason. Rider sees the reason via `GET /rider/application`.

**Body:** `{ "reason": "Aadhaar number could not be verified" }` (min 5 chars)

**Response:** `{ id, name, phone, status, rejectionReason, reviewedAt }`

---

### Direct Rider Creation (Admin)

#### POST `/admin/riders`

Admin creates a rider directly — bypasses the application flow. Account is live immediately.

Same mandatory fields as `POST /rider/register` plus optional `salaryConfigId`.

**Response:** `201` — `{ user, profile }`

---

### Rider Management

#### GET `/riders`

List all active riders with `riderProfile` and current active delivery.

#### GET `/riders/{id}`

Rider detail: profile (including Aadhaar verification status), last 20 earnings, stats.

#### POST `/riders/{id}/verify-aadhaar`

Mark a rider's Aadhaar document as verified after manual review. Returns `409` if the rider has not yet uploaded their photo.

**Response:** `{ id, riderCode, isAadhaarVerified, aadhaarPhotoUrl }`

#### PATCH `/riders/{id}/salary-config`

Assign or unassign a salary config to a rider.

**Body:** `{ "salaryConfigId": "uuid" }` — pass `null` to unassign.

**Response:** updated `RiderProfile` with nested `salaryConfig`.

---

### Salary Configuration

#### GET `/rider-salary-configs`

List all salary configs ordered by default-first, then newest. Each includes `_count.riders`.

#### POST `/rider-salary-configs`

Create a new salary config.

**Body:**

```json
{
  "name": "Standard Rider Package",
  "fixedSalary": 12000,
  "incentiveType": "FLAT_PER_RIDE",
  "flatIncentivePerRide": 25,
  "isDefault": true
}
```

For tiered incentive:

```json
{
  "name": "Performance Package",
  "fixedSalary": 10000,
  "incentiveType": "TIERED",
  "tiers": [
    { "minRides": 0, "maxRides": 50, "ratePerRide": 20 },
    { "minRides": 51, "maxRides": 100, "ratePerRide": 25 },
    { "minRides": 101, "maxRides": null, "ratePerRide": 30 }
  ]
}
```

`maxRides: null` means unlimited (open-ended top tier).

**Response:** `201` — created config. If `isDefault: true`, any previous default is unset.

#### GET `/rider-salary-configs/{id}`

Config detail with list of assigned riders.

#### PATCH `/rider-salary-configs/{id}`

Update any fields. Same body shape as POST (all fields optional).

---

### Order Dispatch

#### POST `/orders/{id}/dispatch`

Mark an order `READY_FOR_DISPATCH`, making it visible to online riders. Order must be `PAID` or `PACKING` and must not already have a delivery assigned.

**Response:** Updated order object.

---

---

### 19. Returns & Credit Notes

> Returns follow a two-step approval flow:
>
> 1. Staff creates a return → status `PENDING` (no inventory movement yet)
> 2. Manager approves → status `COMPLETED`, inventory restocked, refund/credit note issued
>
> Returns are only allowed for orders in `PAID` or `DELIVERED` status.
> Prior return quantities are checked — you cannot return more than the original ordered quantity across all return requests for an item.
>
> **Customers** can only return their own orders (ownership check enforced).

| Method | Endpoint               | Auth            | Description                                                              |
| ------ | ---------------------- | --------------- | ------------------------------------------------------------------------ |
| `GET`  | `/returns`             | STAFF_ROLES     | List returns (paginated)                                                 |
| `GET`  | `/returns/:id`         | STAFF_ROLES     | Get single return with credit note                                       |
| `POST` | `/returns`             | FRANCHISE_ROLES | Create a PENDING return for an existing order                            |
| `POST` | `/returns/:id/approve` | MANAGER_ROLES   | Approve a PENDING return — restocks inventory, issues refund/credit note |

**FRANCHISE_ROLES:** `SUPER_ADMIN`, `STORE_MANAGER`, `CASHIER`
**MANAGER_ROLES:** `SUPER_ADMIN`, `WAREHOUSE_MANAGER`, `STORE_MANAGER`

**`refundMethod` values:** `CASH` · `CREDIT_NOTE` · `RAZORPAY` (triggers Razorpay refund API on approval)

**Query params (GET list):** `orderId`, `status`, `refundMethod`, `page`, `limit`

<details>
<summary><strong>POST /returns</strong></summary>

```json
{
  "orderId": "uuid",
  "items": [
    {
      "orderItemId": "uuid",
      "variantId": "uuid",
      "quantity": 2,
      "reason": "DEFECTIVE",
      "notes": "Packaging damaged"
    }
  ],
  "refundMethod": "CREDIT_NOTE",
  "notes": "Customer complaint — product arrived defective"
}
```

**`reason` values:** `DEFECTIVE` · `WRONG_ITEM` · `CUSTOMER_CHANGE` · `EXPIRED` · `OTHER`

**Response (201):** Return is created with `status: "PENDING"`. A manager must call `POST /returns/:id/approve` to complete it.

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "returnNumber": "RTN-2026-00001",
    "orderId": "uuid",
    "totalRefundAmount": 250.0,
    "refundMethod": "CREDIT_NOTE",
    "status": "PENDING",
    "processedById": "uuid",
    "notes": "...",
    "createdAt": "...",
    "items": [
      {
        "id": "uuid",
        "orderItemId": "uuid",
        "variantId": "uuid",
        "quantity": 2,
        "unitPrice": 125.0,
        "reason": "DEFECTIVE",
        "notes": "Packaging damaged"
      }
    ],
    "creditNote": {
      "id": "uuid",
      "creditNoteNumber": "CN-2605141030-A3B1",
      "customerId": "uuid",
      "amount": 250.0,
      "usedAmount": 0.0,
      "balance": 250.0,
      "isActive": true,
      "expiresAt": "2027-05-14T10:30:00Z",
      "createdAt": "..."
    }
  }
}
```

**Error responses:**

| Code                          | HTTP | When                                                          |
| ----------------------------- | ---- | ------------------------------------------------------------- |
| `RETURN_ORDER_NOT_FOUND`      | 404  | `orderId` does not exist                                      |
| `RETURN_ORDER_NOT_RETURNABLE` | 422  | Order status is not `PAID` or `DELIVERED`                     |
| `RETURN_ITEM_NOT_IN_ORDER`    | 400  | `orderItemId` is not part of the specified order              |
| `RETURN_QTY_EXCEEDED`         | 422  | Return quantity exceeds the original order item quantity      |
| `RETURN_NEEDS_CUSTOMER`       | 422  | `CREDIT_NOTE` refund but the order has no associated customer |
| `VALIDATION_ERROR`            | 422  | Request body failed schema validation                         |

</details>

---

---

### 20. B2B Pricing Tiers

Quantity-based wholesale pricing per `ProductVariant`. When a `B2B_WHOLESALE` order is created, the system automatically selects the applicable tier price based on the ordered quantity.

| Method   | Endpoint                                     | Auth            | Description                             |
| -------- | -------------------------------------------- | --------------- | --------------------------------------- |
| `GET`    | `/products/:id/pricing-tiers`                | STAFF_ROLES     | List all B2B tiers across variants      |
| `POST`   | `/products/:id/pricing-tiers`                | WAREHOUSE_ROLES | Replace tier set for a variant (atomic) |
| `DELETE` | `/products/:id/pricing-tiers?variantId=uuid` | WAREHOUSE_ROLES | Remove all tiers from a variant         |

<details>
<summary><strong>POST /products/:id/pricing-tiers — Set tiers for a variant</strong></summary>

```json
{
  "variantId": "uuid",
  "tiers": [
    { "minQty": 1, "maxQty": 9, "price": 120 },
    { "minQty": 10, "maxQty": 99, "price": 100 },
    { "minQty": 100, "maxQty": null, "price": 85 }
  ]
}
```

**Rules:**

- Tiers must be contiguous — each tier's `maxQty + 1` must equal the next tier's `minQty`
- The last tier must have `maxQty: null` (open-ended)
- A variant with no tiers uses its `sellingPrice` for B2B orders

**Response (201):** `{ variantId, sku, tiers: [...] }`

</details>

---

### 21. PO Export

Download a Purchase Order as a formatted document.

| Method | Endpoint                                  | Auth          | Description                  |
| ------ | ----------------------------------------- | ------------- | ---------------------------- |
| `GET`  | `/purchase-orders/:id/export?format=pdf`  | MANAGER_ROLES | Download PO as PDF           |
| `GET`  | `/purchase-orders/:id/export?format=docx` | MANAGER_ROLES | Download PO as Word document |

**Query params:** `format` — `pdf` (default) or `docx`

**Response:** Binary file download with appropriate `Content-Type` and `Content-Disposition: attachment` headers.

**Document contents:**

- Rotana Distribution letterhead (company name, address, contact)
- PO number, date, expected delivery, status
- Supplier details block (name, contact, address, GST)
- Payment terms
- Line items table: `#` · `Product/Variant` · `SKU` · `HSN Code` · `Qty` · `Unit Price` · `Total`
- Grand total row
- Notes / terms section (if present on the PO)

---

### Media — Binary Upload

In addition to the presigned URL flow, images can be uploaded directly through the server:

| Method | Endpoint               | Auth          | Description                                  |
| ------ | ---------------------- | ------------- | -------------------------------------------- |
| `POST` | `/media/upload-binary` | Any auth user | Upload file binary via `multipart/form-data` |

**Form fields:**

- `file` — the binary file (required)
- `context` — one of: `product`, `supplier_doc`, `invoice`, `payslip`, `grn`, `avatar`, `other`

**Response (201):**

```json
{
  "success": true,
  "data": {
    "key": "products/2026/05/<uuid>.webp",
    "publicUrl": "https://cdn.rotana.com/products/2026/05/<uuid>.webp"
  }
}
```

Use this flow for product image uploads from the warehouse panel. The returned `publicUrl` is stored as `product.imageUrl`.

---

---

### 22. Kits & Bundles

| Method   | Endpoint                            | Auth          | Description                                |
| -------- | ----------------------------------- | ------------- | ------------------------------------------ |
| `GET`    | `/kits`                             | STAFF_ROLES   | List kits with component summary           |
| `POST`   | `/kits`                             | MANAGER_ROLES | Create kit with components                 |
| `GET`    | `/kits/:id`                         | STAFF_ROLES   | Kit detail + stock availability            |
| `PATCH`  | `/kits/:id`                         | MANAGER_ROLES | Update kit price, status, dates            |
| `POST`   | `/kits/:id/components`              | MANAGER_ROLES | Add component to kit                       |
| `PATCH`  | `/kits/:id/components/:componentId` | MANAGER_ROLES | Update component quantity                  |
| `DELETE` | `/kits/:id/components/:componentId` | MANAGER_ROLES | Remove component from kit                  |
| `GET`    | `/kits/active`                      | **Public**    | Storefront: active kits within date window |

`stockAvailable` on GET `:id` = `min(componentQty / variant.available)` across all components.

---

### 23. Offers & Promotions

| Method   | Endpoint               | Auth          | Description                         |
| -------- | ---------------------- | ------------- | ----------------------------------- |
| `GET`    | `/offers`              | STAFF_ROLES   | List offers (filter: status, type)  |
| `POST`   | `/offers`              | MANAGER_ROLES | Create offer                        |
| `GET`    | `/offers/:id`          | STAFF_ROLES   | Offer detail with redemption count  |
| `PATCH`  | `/offers/:id`          | MANAGER_ROLES | Update offer fields                 |
| `POST`   | `/offers/:id/pause`    | MANAGER_ROLES | Pause ACTIVE offer                  |
| `POST`   | `/offers/:id/activate` | MANAGER_ROLES | Re-activate PAUSED offer            |
| `DELETE` | `/offers/:id`          | ADMIN_ROLES   | Hard delete (0 redemptions only)    |
| `GET`    | `/offers/active`       | **Public**    | Storefront: currently active offers |

**Offer types:** `PERCENTAGE_DISCOUNT` · `FLAT_DISCOUNT` · `BUY_X_GET_Y` · `FREE_DELIVERY` · `BUNDLE_PRICE`

---

### 24. Payments — Razorpay

> All endpoints are currently **stubs** — they build the database records but do not call the real Razorpay API. Set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in `.env` to wire real payments.

| Method | Endpoint                          | Auth          | Description                              |
| ------ | --------------------------------- | ------------- | ---------------------------------------- |
| `POST` | `/payments/create-order`          | STAFF_ROLES   | Create Razorpay order for an app Order   |
| `POST` | `/payments/verify`                | STAFF_ROLES   | Verify signature + mark order PAID       |
| `POST` | `/payments/webhook`               | Public (HMAC) | Razorpay webhook — idempotent on eventId |
| `POST` | `/payments/refund`                | MANAGER_ROLES | Initiate refund (stub)                   |
| `GET`  | `/payments/:orderId/transactions` | STAFF_ROLES   | All payment attempts for an order        |

---

### 25. Inventory Counts (Cycle Count)

| Method  | Endpoint                              | Auth          | Description                                     |
| ------- | ------------------------------------- | ------------- | ----------------------------------------------- |
| `GET`   | `/inventory/counts`                   | STAFF_ROLES   | List count sessions                             |
| `POST`  | `/inventory/counts`                   | MANAGER_ROLES | Start count session for a location              |
| `GET`   | `/inventory/counts/:id`               | STAFF_ROLES   | Count detail with items and progress            |
| `PATCH` | `/inventory/counts/:id/items/:itemId` | STAFF_ROLES   | Enter counted qty for one SKU                   |
| `POST`  | `/inventory/counts/:id/complete`      | MANAGER_ROLES | Finalize — auto-applies COUNT_ADJUSTMENT events |

**Workflow:** Start → staff counts each SKU → enter counted quantities → Complete. On complete, every item with `variance != 0` fires a `COUNT_ADJUSTMENT` inventory event that adjusts `InventoryBalance.onHand` by the signed variance.

<details>
<summary>GET /inventory/counts — Query params</summary>

| Param        | Type   | Description                                 |
| ------------ | ------ | ------------------------------------------- |
| `locationId` | string | Filter by location                          |
| `status`     | string | `IN_PROGRESS` \| `COMPLETED` \| `CANCELLED` |
| `page`       | int    | Default `1`                                 |
| `limit`      | int    | Default `20`                                |

**Response 200:**

```json
{
  "success": true,
  "data": [
    {
      "id": "cnt_abc123",
      "countNumber": "CNT-2026-00001",
      "status": "IN_PROGRESS",
      "notes": "Monthly count — Zone A",
      "startedAt": "2026-05-18T09:00:00.000Z",
      "completedAt": null,
      "location": { "id": "loc_wh1", "name": "Main Warehouse", "code": "WH-01" },
      "itemCount": 42
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 5, "totalPages": 1 }
}
```

</details>

<details>
<summary>POST /inventory/counts — Start a count session</summary>

Seeds one `InventoryCountItem` per `InventoryBalance` row at the location, capturing current `onHand` as `systemQty`. If `variantIds` is omitted, all variants at the location are included.

**Request body:**

```json
{
  "locationId": "loc_wh1",
  "variantIds": ["var_abc", "var_def"],
  "notes": "Monthly count — Zone A"
}
```

| Field        | Required | Description                                              |
| ------------ | -------- | -------------------------------------------------------- |
| `locationId` | Yes      | Must have at least one InventoryBalance row              |
| `variantIds` | No       | Subset of variants to count; omit for full location scan |
| `notes`      | No       | Free text label for this session                         |

**Response 201:** Full `InventoryCount` object with `items[]` pre-populated.

**Error 400 `VALIDATION_ERROR`:** No inventory found at location for the given variants.

</details>

<details>
<summary>GET /inventory/counts/:id — Count detail with progress</summary>

**Response 200:**

```json
{
  "success": true,
  "data": {
    "id": "cnt_abc123",
    "countNumber": "CNT-2026-00001",
    "status": "IN_PROGRESS",
    "location": { "id": "loc_wh1", "name": "Main Warehouse", "code": "WH-01" },
    "progress": {
      "total": 42,
      "counted": 30,
      "remaining": 12,
      "discrepancies": 3
    },
    "items": [
      {
        "id": "cci_xyz",
        "variantId": "var_abc",
        "systemQty": 100,
        "countedQty": 97,
        "variance": -3,
        "notes": null,
        "variant": {
          "id": "var_abc",
          "sku": "SKU-001",
          "barcode": "8901234567890",
          "name": "500ml",
          "product": { "name": "Orange Juice", "imageUrl": null }
        }
      }
    ]
  }
}
```

</details>

<details>
<summary>PATCH /inventory/counts/:id/items/:itemId — Enter counted qty</summary>

Can be called multiple times to revise. Variance is computed server-side: `variance = countedQty - systemQty`.

**Request body:**

```json
{ "countedQty": 97, "notes": "One carton damaged" }
```

**Error 409 `CONFLICT`:** Count session is no longer `IN_PROGRESS`.

</details>

<details>
<summary>POST /inventory/counts/:id/complete — Finalize</summary>

All items must have `countedQty` set before calling complete. Items with zero variance are skipped.

**Error 422 `ITEMS_NOT_COUNTED`:** Returns count of uncounted items.

**Response 200:**

```json
{
  "success": true,
  "data": {
    "id": "cnt_abc123",
    "countNumber": "CNT-2026-00001",
    "status": "COMPLETED",
    "completedAt": "2026-05-18T12:30:00.000Z",
    "adjustmentsApplied": 3,
    "totalDiscrepancyUnits": 7
  }
}
```

</details>

---

### 26. Notifications

| Method  | Endpoint                             | Auth          | Description                                 |
| ------- | ------------------------------------ | ------------- | ------------------------------------------- |
| `GET`   | `/notifications`                     | Authenticated | My notifications (`status=unread/read/all`) |
| `PATCH` | `/notifications/:id/read`            | Authenticated | Mark one notification as read               |
| `PATCH` | `/notifications/read-all`            | Authenticated | Mark all as read                            |
| `GET`   | `/admin/notification-templates`      | MANAGER_ROLES | List all templates                          |
| `PATCH` | `/admin/notification-templates/:key` | ADMIN_ROLES   | Update template body/subject or toggle      |

Default template keys: `ORDER_CREATED` · `ORDER_PAID` · `ORDER_DELIVERED` · `ORDER_CANCELLED` · `RETURN_PROCESSED` · `POINTS_EARNED` · `POINTS_EXPIRY_WARNING` · `LOW_STOCK_ALERT`

---

### 27. Product Variant CRUD

| Method   | Endpoint                            | Auth          | Description                                   |
| -------- | ----------------------------------- | ------------- | --------------------------------------------- |
| `PATCH`  | `/products/:id/variants/:variantId` | PRODUCT_ROLES | Update price, barcode, HSN, compliance fields |
| `DELETE` | `/products/:id/variants/:variantId` | PRODUCT_ROLES | Soft-delete (409 if reserved inventory)       |
| `GET`    | `/products/:id/price-history`       | PRODUCT_ROLES | Paginated price change audit trail            |

PATCH automatically writes a `ProductPriceHistory` row when `sellingPrice` or `wholesalePrice` changes.

---

### 28. Product Reviews

| Method  | Endpoint                     | Auth          | Description                              |
| ------- | ---------------------------- | ------------- | ---------------------------------------- |
| `POST`  | `/products/:id/reviews`      | CUSTOMER      | Submit review (verified delivered order) |
| `GET`   | `/products/:id/reviews`      | **Public**    | Approved reviews (user name anonymised)  |
| `PATCH` | `/admin/reviews/:id/approve` | MANAGER_ROLES | Approve or reject a review               |

---

### 29. Wishlist

| Method   | Endpoint               | Auth     | Description                   |
| -------- | ---------------------- | -------- | ----------------------------- |
| `GET`    | `/wishlist`            | CUSTOMER | My wishlist with stock status |
| `POST`   | `/wishlist`            | CUSTOMER | Add `{ variantId }` to list   |
| `DELETE` | `/wishlist/:variantId` | CUSTOMER | Remove from wishlist          |

---

### 30. Scheduled Orders

| Method | Endpoint            | Auth        | Description                                     |
| ------ | ------------------- | ----------- | ----------------------------------------------- |
| `POST` | `/scheduled-orders` | CUSTOMER    | Place a future-dated order (stock not reserved) |
| `GET`  | `/scheduled-orders` | STAFF_ROLES | List (customers see own, staff see all)         |

A nightly cron (`POST /api/v1/cron/convert-scheduled-orders`) checks orders where `deliveryDate = tomorrow` and converts them to live `Order` records, reserving stock at conversion time.

---

### 31. Health

Lightweight liveness + DB readiness probe. No authentication required. Use for load balancer health checks and uptime monitors.

> **Base path:** `http://localhost:3000/api` (no `/v1` prefix)

| Method | Endpoint  | Auth | Description                    |
| ------ | --------- | ---- | ------------------------------ |
| `GET`  | `/health` | None | Returns DB connectivity status |

**Response 200 (healthy):**

```json
{ "status": "ok", "db": "ok", "ts": 1747500000000 }
```

**Response 503 (DB unreachable):**

```json
{ "status": "error", "db": "unreachable", "ts": 1747500000000 }
```

---

---

### 34. B2B Customers

Warehouse-staff-facing view of B2B (wholesale) customer accounts, aggregated from `User` records with `role=CUSTOMER` and their `B2B_WHOLESALE` orders.

| Method | Endpoint     | Auth        | Description                             |
| ------ | ------------ | ----------- | --------------------------------------- |
| `GET`  | `/customers` | STAFF_ROLES | Paginated list of B2B customer accounts |

**Query params:** `search` (name/email/phone), `page`, `limit`

**Response 200:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Acme Retail Ltd",
      "email": "buyer@acme.com",
      "phone": "+91-9876543210",
      "isActive": true,
      "createdAt": "2026-01-10T09:00:00.000Z",
      "b2bOrderCount": 12,
      "totalOrderValue": 284500.0,
      "lastOrderAt": "2026-05-14T11:30:00.000Z"
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 47, "totalPages": 3 }
}
```

> Credit limits and payment terms are not yet modelled in schema — exposes order count, total value, last order date. Full order list: `GET /orders?customerId=:id&orderType=B2B_WHOLESALE`.

---

_Last updated: 2026-05-18 — v2.3: Customer order creation — CUSTOMER role allowed on POST /orders and GET /orders (scoped to own orders); B2B_WHOLESALE blocked for customers; GET /orders/:id now ANY_AUTH with ownership check._

---

## 32. Rider GPS Location

> **Base URL:** `POST /api/v1/rider/location` | `GET /api/v1/riders/active`
>
> The Rider GPS feature enables real-time dispatcher map view using [LocationIQ](https://locationiq.com) tiles.
> The rider mobile app pushes coordinates every ~30 seconds while online.

---

### POST `/rider/location`

Updates the rider's current GPS position. Called by the rider app every ~30 s while `isOnline = true` and `locationSharing = true`.

**Auth:** `DELIVERY_DRIVER`

**Request Body:**

```json
{
  "lat": 12.9716,
  "lon": 77.5946
}
```

| Field | Type   | Required | Description             |
| ----- | ------ | -------- | ----------------------- |
| lat   | number | Yes      | Latitude (−90 to 90)    |
| lon   | number | Yes      | Longitude (−180 to 180) |

**Response `200 OK`:**

```json
{
  "success": true,
  "data": { "stored": true, "lat": 12.9716, "lon": 77.5946 }
}
```

Returns `{ "stored": false }` if rider is offline or location sharing is disabled.

**Schema Change:** Migration `20260517030000_add_rider_gps_location` adds `last_lat`, `last_lon`, `last_location_at` to `rider_profiles`. Location is stale after 5 minutes (filtered by `riders/active`).

---

### GET `/riders/active`

Returns all online riders with a fresh GPS ping (within the last 5 minutes), for the dispatcher map view.

**Auth:** `SUPER_ADMIN`, `WAREHOUSE_MANAGER`

**Response `200 OK`:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "riderCode": "R-001",
      "vehicleType": "MOTORCYCLE",
      "name": "Ravi Kumar",
      "phone": "+91 98765 43210",
      "lat": 12.9716,
      "lon": 77.5946,
      "lastLocationAt": "2026-05-17T10:30:00Z",
      "activeDelivery": {
        "id": "uuid",
        "status": "IN_TRANSIT",
        "order": {
          "orderNumber": "ORD-00123",
          "deliveryAddress": {
            "line1": "42 MG Road",
            "city": "Bangalore",
            "latitude": 12.9719,
            "longitude": 77.5937
          }
        }
      }
    }
  ]
}
```

`activeDelivery` is `null` when the rider has no in-progress delivery.

**Frontend:** `components/warehouse/rider-map.tsx` — LocationIQ tiles rendered with `react-leaflet`. Dynamic import (`ssr: false`) to avoid SSR issues. Configured via `NEXT_PUBLIC_LOCATIONIQ_API_KEY`; falls back to OpenStreetMap if key is absent.

---

## 33. Payments — Status Polling

> **Base URL:** `GET /api/v1/payments/:orderId/status`
>
> Used by the B2C checkout page to poll for payment confirmation after Razorpay dismissal
> (covers async flows: UPI, net-banking, QR codes).

---

### GET `/payments/:orderId/status`

Returns the current payment and order status for a given order. The checkout page polls this every 3 seconds for up to 90 seconds after the Razorpay modal closes.

**Auth:** `STAFF_ROLES` or the order-owning `CUSTOMER`

**Path Params:**

| Param   | Type | Description       |
| ------- | ---- | ----------------- |
| orderId | UUID | Internal order ID |

**Response `200 OK`:**

```json
{
  "success": true,
  "data": {
    "orderId": "uuid",
    "orderNumber": "ORD-00456",
    "status": "PAID",
    "paymentStatus": "PAID",
    "totalAmount": 499.0,
    "paidAmount": 499.0,
    "isPaid": true,
    "gatewayRef": "pay_XYZ123"
  }
}
```

**`isPaid: true`** triggers an immediate redirect to the success page. If polling times out (30 × 3 s = 90 s) without confirmation, the checkout shows a "Payment not confirmed" banner with a **Retry Payment** button.

**Frontend Changes:**

- `app/(storefront)/shop/checkout/page.tsx` — `pollPaymentStatus()` function, `paymentFailed` state, retry UI banner
- Retry opens a new Razorpay session for the same `orderId`

---

---

## 34. Products — New Query Params (v2.1)

> **Base URL:** `GET /api/v1/products`
>
> The products endpoint now supports server-side sort, status filter, and date range.
> The warehouse products page no longer uses `limit=200` with client-side filtering.

### New query params

| Param   | Type                        | Default     | Description                                 |
| ------- | --------------------------- | ----------- | ------------------------------------------- |
| status  | `ACTIVE\|INACTIVE\|all`     | `ACTIVE`    | Filter by product status                    |
| sortBy  | `name\|category\|createdAt` | `createdAt` | Sort column                                 |
| sortDir | `asc\|desc`                 | `desc`      | Sort direction                              |
| from    | ISO date string             | —           | `createdAt >=` filter                       |
| to      | ISO date string             | —           | `createdAt <=` filter (inclusive, EOD)      |
| search  | string                      | —           | Searches name, brand, tags, and variant SKU |

**Existing params unchanged:** `categoryId`, `locationId`, `page`, `limit` (max 100).

**Example:**

```
GET /api/v1/products?status=ACTIVE&sortBy=name&sortDir=asc&page=1&limit=15&search=rice
```

---

## 35. Inventory — New Query Params (v2.1)

> **Base URL:** `GET /api/v1/inventory`
>
> The inventory endpoint now supports server-side search, pagination, and sorting
> for the regular (non-lowStock) path. The warehouse inventory page no longer
> fetches all rows client-side.

### New query params (non-lowStock path)

| Param   | Type                                                          | Default      | Description                                                    |
| ------- | ------------------------------------------------------------- | ------------ | -------------------------------------------------------------- |
| search  | string                                                        | —            | Case-insensitive search across SKU, variant name, product name |
| page    | number                                                        | 1            | Page number                                                    |
| limit   | number                                                        | 20 (max 100) | Items per page                                                 |
| sortBy  | `sku\|product\|variant\|onHand\|reserved\|available\|reorder` | `sku`        | Sort column                                                    |
| sortDir | `asc\|desc`                                                   | `asc`        | Sort direction                                                 |

**Response shape changes:** The regular path now returns paginated format:

```json
{
  "success": true,
  "data": {
    "data": [...],
    "meta": { "page": 1, "limit": 15, "total": 320, "totalPages": 22 }
  }
}
```

The `lowStock=true` path is unchanged (returns a flat array).

### CSV Import — Bulk Product Import

> **Base URL:** `POST /api/v1/products/bulk`
>
> The existing bulk API is unchanged. A new CSV import UI in the warehouse
> products page (`components/warehouse/csv-import-dialog.tsx`) parses and
> submits CSV files to this endpoint.

**CSV template columns:**

```
name, category_name, brand, is_perishable, tags, sku, variant_name,
unit_value, unit_label, cost_price, selling_price, mrp, tax_rate,
reorder_level, barcode
```

**Rules:**

- Rows sharing the same `name` + `category_name` are grouped as variants of one product
- `category_name` is resolved to `categoryId` from the categories list
- Required: `name`, `category_name`, `sku`, `variant_name`, `unit_value`, `unit_label`, `cost_price`, `selling_price`
- Template CSV is downloadable from the import dialog header

---

## 36. Admin — Audit Log

> **Base URL:** `GET /api/v1/admin/audit-log`
>
> **Auth:** Bearer Token · **Role:** `SUPER_ADMIN` only
>
> Immutable log of every privileged action on users and locations. Records are never updated or deleted.

**Query params:**

| Param        | Type   | Description                                       |
| ------------ | ------ | ------------------------------------------------- |
| `page`       | int    | Page number (default 1)                           |
| `limit`      | int    | Records per page (default 50, max 200)            |
| `action`     | string | Filter by action type (see table below)           |
| `targetType` | string | `USER` or `LOCATION`                              |
| `actorId`    | string | Filter by the user who performed the action       |
| `from`       | ISO    | Start of date range (e.g. `2026-01-01T00:00:00Z`) |
| `to`         | ISO    | End of date range                                 |

**Action types:**

| Action                 | Meaning                            |
| ---------------------- | ---------------------------------- |
| `USER_CREATED`         | New staff user registered          |
| `USER_DEACTIVATED`     | Staff account disabled             |
| `USER_REACTIVATED`     | Staff account re-enabled           |
| `ROLE_CHANGED`         | User's role updated                |
| `LOCATION_ASSIGNED`    | User's assigned location changed   |
| `LOCATION_CREATED`     | New warehouse/store location added |
| `LOCATION_UPDATED`     | Location name/code/address updated |
| `LOCATION_DEACTIVATED` | Location soft-deleted              |

**Response:**

```json
{
  "success": true,
  "data": {
    "rows": [
      {
        "id": "aud_uuid",
        "action": "ROLE_CHANGED",
        "actorId": "user_uuid",
        "actorRole": "SUPER_ADMIN",
        "targetType": "USER",
        "targetId": "target_user_uuid",
        "meta": { "from": "CASHIER", "to": "STORE_MANAGER" },
        "createdAt": "2026-05-17T10:00:00.000Z",
        "actor": {
          "id": "user_uuid",
          "name": "Mohammed Admin",
          "email": "admin@rotana.com"
        }
      }
    ],
    "total": 142,
    "page": 1,
    "pages": 3
  }
}
```

---
