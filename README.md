# TinyApp

A tiny URL shortener built with **Next.js 15**, **Auth.js**, **Drizzle ORM**, and **Neon Postgres**, deployed on **Vercel**.

## Features

- Register and log in with email and password
- Create, edit, and delete short URLs
- Public redirects at `/u/:shortURL`
- Portfolio-friendly UI preserved from the original TinyApp

## Local development

### Prerequisites

- Node.js 20+
- A [Neon](https://neon.tech) database (free tier)

### Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy environment variables:

   ```bash
   cp .env.example .env.local
   ```

3. Set values in `.env.local`:

   - `DATABASE_URL` — Neon connection string
   - `AUTH_SECRET` — run `openssl rand -base64 32`
   - `AUTH_URL` — `http://localhost:3000`

4. Push the schema to your database:

   ```bash
   npm run db:push
   ```

   This runs `scripts/db-setup.mjs` (node-postgres), which is reliable on Windows. Use Neon’s **direct** connection string (not the `-pooler` host) in `.env` or `.env.local`. Optional: `npm run db:push:drizzle` uses drizzle-kit (needs WebSockets).

5. Start the dev server:

   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Run production server locally |
| `npm run lint` | ESLint |
| `npm test` | Vitest unit tests |
| `npm run db:push` | Apply Drizzle schema to the database |
| `npm run db:generate` | Generate SQL migrations |
| `npm run db:migrate` | Run migrations |

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. Add environment variables in the Vercel project settings:

   | Variable | Value |
   |----------|--------|
   | `DATABASE_URL` | Neon connection string |
   | `AUTH_SECRET` | Long random secret |
   | `AUTH_URL` | `https://your-app.vercel.app` |

4. Deploy. After the first deploy, run `npm run db:push` locally against your production Neon branch (or use Neon's SQL editor with `drizzle/migrations/0000_initial.sql`).

Vercel will run `next build` automatically on each push.

## Project structure

```text
app/           # App Router pages and API routes
components/    # React UI components
drizzle/       # Schema and migrations
lib/           # Database helpers and auth utilities
auth.ts        # Auth.js configuration
middleware.ts  # Protects /urls/*
```

## License

ISC
