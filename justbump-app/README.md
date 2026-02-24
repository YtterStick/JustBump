# justbump-app (Next.js)

Next.js (TypeScript) scaffold for the JustBump application. The raw DB queries / schema remain in `../justbump-db/queries/schema.sql`.

Key points
- Framework: `Next.js` (App Router, TypeScript)
- Database access: **raw SQL** via `mysql2` (no querybuilder)

Quick start
1. Copy environment example and edit DB creds:
   - `cp .env.example .env.local` (Windows: copy/rename) and update values
2. Install dependencies:
   - `npm install`
3. Run dev server:
   - `npm run dev`
4. Apply DB schema (if not applied):
   - `mysql -u <user> -p < ../justbump-db/queries/schema.sql`

Files of interest
- `lib/db.ts` — mysql2 pool + `query(sql, params)` helper (raw SQL only)
- `app/api/cards/route.ts` — example API route using raw SQL
- `components/CardList.tsx` — client component that calls the API

Notes
- No querybuilder is used anywhere — all server-side DB code uses parameterized SQL with `mysql2`.
- Tell me if you want Prisma ORM instead, or prefer the Pages Router instead of App Router.

Running backend tests
1. Make sure dev server is running: `npm run dev` (app listens on http://localhost:3000)
2. Run the API test suite (integration tests against the running server):
   - `npm run test:api`

Postman collection
- `postman/JustBump.postman_collection.json` — import into Postman and set `{{baseUrl}}` to `http://localhost:3000`.


## Auth & protected CRUD API 🔐
- `POST /api/auth/register` — create user (body: `{ email, password, phone_number? }`) → returns `201`.
- `POST /api/auth/login` — returns a JWT and sets an HttpOnly `token` cookie (body: `{ email, password }`).
- `GET /api/auth/me` — returns current user (requires token in `Authorization: Bearer <token>` or cookie).
- `POST /api/cards` — create a calling card (requires auth).
- `GET /api/cards` — list public cards (existing route).
- `GET|PUT|DELETE /api/cards/:id` — read/update/delete a single card (update/delete require owner auth).

Example (login + get current user):
```bash
curl -X POST /api/auth/login -d '{"email":"you@example.com","password":"pass"}' -H 'Content-Type: application/json'
curl -H 'Authorization: Bearer <token>' /api/auth/me
```