# CrewBoard — Supabase SaaS demo

A multi-tenant team task board that shows a real Supabase build: **Auth**, a
relational **Postgres** schema, database-level **Row Level Security**, and
**Realtime** sync — with a Next.js 14 frontend. Sign up → get a private, seeded
workspace with a live kanban board.

**Stack:** Next.js 14 · TypeScript · Tailwind · Motion · `@supabase/ssr`.

---

## Setup (you do steps 1–4; the code is ready)

### 1. Create the Supabase project
supabase.com → **New project** (free). Region: Singapore (closest to ID).

### 2. Run the schema + RLS
Supabase dashboard → **SQL Editor** → paste all of
[`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql) → **Run**.
This creates the tables, RLS policies, the `create_org` RPC, the signup trigger
that seeds a workspace, and turns on Realtime for `tasks`.

### 3. Make demo signups instant
Authentication → **Sign In / Providers → Email** → turn **OFF** "Confirm email".
(So a sign-up logs straight into a seeded board — ideal for a demo.)

### 4. Add your keys
```
cp .env.local.example .env.local
```
Then paste from Supabase → **Project Settings → API**:
- `NEXT_PUBLIC_SUPABASE_URL` = Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon public key

(The anon key is browser-safe — RLS is what protects the data.)

### 5. Run
```
npm install
npm run dev        # http://localhost:3000
```
Sign up → you land on a seeded board. **Open a second browser / incognito** and
sign up with a different email to see (a) RLS isolation — you can't see the other
workspace — and (b) drag a card and watch it move live in the other tab.

---

## Deploy (Vercel)
1. Push to GitHub (`ciel-vin/crewboard`).
2. Import to Vercel → add the two `NEXT_PUBLIC_*` env vars.
3. In Supabase → Authentication → **URL Configuration**: set **Site URL** to the
   Vercel domain (and add it to Redirect URLs).

## What to point clients at
- Live URL (after deploy) + this repo.
- The RLS section of `0001_init.sql` — the part clients scrutinize most.

_Built by Alvin Salim._
