# Geparco — online fish & seafood ordering

A full-stack storefront for **Geparco Inc.** (Poissons & fruits de mer, Montréal)
where customers browse fish & seafood, build a cart, and check out with online
card payment. Built with Next.js 16 (App Router), Prisma + PostgreSQL, Tailwind
CSS, and Stripe Checkout.

> The business name, address, phone, and hours in `src/lib/store-config.ts` are
> Geparco's public details. **The catalog in `prisma/products.mjs` is placeholder
> data** — prices are made up; swap in the real price sheet and run
> `npm run db:seed`. The admin password is also a placeholder.

## What's included

| Area | Route | Notes |
| --- | --- | --- |
| Storefront | `/` | Marketing landing (hero, live "today at the counter" board, about + visit) above the shop — category filter, search, add to cart |
| Cart | `/cart` | Quantities, subtotal, minimum-order check (persisted in `localStorage`) |
| Checkout | `/checkout` | Delivery or pickup, customer details, order summary |
| Payment | `/api/checkout` | Re-prices from the DB, creates a Stripe Checkout Session |
| Confirmation | `/order/success` | Reads the order, confirms payment |
| Stripe webhook | `/api/stripe/webhook` | Marks orders `PAID` / `CANCELLED` |
| Staff dashboard | `/admin` | Password-gated order list, revenue, status changes |

## Prerequisites

- Node.js 20+ (this project was built with Node 24)
- A PostgreSQL database. [Neon](https://neon.tech) has a free tier; on Vercel,
  create one from **Storage → Create Database**.
- A [Stripe](https://stripe.com) account for real payments (optional — see Demo mode)

## Setup

```bash
npm install
cp .env.example .env      # then set DATABASE_URL to your Postgres string
npm run setup             # prisma generate + db push + seed sample catalog
npm run dev               # http://localhost:3000
```

`npm run setup` is a one-time convenience. Individual steps:

```bash
npm run db:push     # create / update the schema on the database
npm run db:seed     # load the sample seafood catalog (matched by slug, so re-runnable)
npm run db:studio   # browse the database in Prisma Studio
npm run db:reset    # wipe and re-seed
```

`npm run build` also runs `db push` + `db:seed` before `next build`, so a deploy
keeps the database schema and the catalogue in sync with the code.

## Demo mode (no Stripe account needed)

If `STRIPE_SECRET_KEY` is blank in `.env`, checkout runs in **demo mode**: it
creates the order and marks it paid immediately, skipping Stripe. The whole
browse → cart → checkout → confirmation → admin flow works out of the box.

## Enabling real card payments

1. In the [Stripe dashboard](https://dashboard.stripe.com/test/apikeys) (test mode),
   copy the **Secret key** into `STRIPE_SECRET_KEY` in `.env`.
2. Forward webhook events to your local server:
   ```bash
   npm i -g stripe        # or: https://stripe.com/docs/stripe-cli
   stripe login
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
   Copy the `whsec_...` signing secret it prints into `STRIPE_WEBHOOK_SECRET`.
3. Restart `npm run dev`. Checkout now redirects to Stripe; use test card
   `4242 4242 4242 4242`, any future expiry, any CVC.

The confirmation page also verifies payment directly from the Stripe session, so
it still works if the webhook isn't running — the webhook is what keeps order
status correct in production.

## Store settings

`src/lib/store-config.ts`:

- `name`, `address`, `hours`, contact details
- `deliveryFeeCents`, `freeDeliveryThresholdCents`, `minOrderCents`

`prisma/products.mjs` is the catalog. Edit it and run `npm run db:seed`
(products are matched by `slug`, so re-seeding updates existing rows).

## Admin dashboard

Visit `/admin` and enter `ADMIN_PASSWORD` from `.env` (default `changeme` —
**change it**). You can filter orders by status and move an order between
`PENDING`, `PAID`, `FULFILLED`, and `CANCELLED`.

## Deploying to Vercel

1. **Create a database.** Vercel dashboard → **Storage** → *Create Database* →
   **Neon / Postgres** → connect it to the project. Vercel injects `DATABASE_URL`
   automatically. (Use the direct/unpooled URL if you're offered a choice.)
2. **Set environment variables** (Settings → Environment Variables):
   - `NEXT_PUBLIC_BASE_URL` — e.g. `https://geparco.vercel.app`
   - `ADMIN_PASSWORD` — a real password
   - `STORE_CURRENCY` — `cad`
   - `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` — optional; blank = demo mode
3. **Redeploy.** The `build` script runs `prisma db push` (creates the tables)
   and `db:seed` (loads the catalogue) before `next build`, so the database is
   ready on first deploy. Pushing to `main` deploys automatically after that.
4. For real payments, add a Stripe webhook pointing at
   `https://your-domain/api/stripe/webhook` and paste its signing secret.

> `build` uses `prisma db push --accept-data-loss` for simplicity. Before you
> have real order data, switch to migrations (`prisma migrate`) so schema
> changes can't silently drop columns.

## Notes & next steps

- Prices are stored as integer cents everywhere to avoid float rounding.
- Checkout always re-prices from the database — client-supplied prices are ignored.
- Not yet built: customer accounts, order history, product images (emoji stand-ins
  are used), inventory decrement on purchase, email receipts (Stripe sends its own).
