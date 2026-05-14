# Como en Casa — Internal Operations App

Internal management tool for a small food business. Handles inventory, work schedules, tip distribution, and purchase lists. Built as a mobile-first PWA for staff phones, with a full desktop view for admins.

---

## The Problem

Day-to-day operations were tracked manually — inventory counts in notebooks, work schedules in WhatsApp groups, tip calculations on paper. This caused errors, inconsistencies, and friction for a team of ~10 people working across kitchen, floor, and pastry stations.

The app replaces that with a single, role-aware tool accessible from any phone.

---

## Features

- **Inventory** — track current stock vs ideal stock per item; auto-generates a "to buy" list; admin can edit names and ideal levels
- **Purchase list** — combines auto-generated inventory needs with manually added items; group by category or supplier; mark as bought (sets stock to ideal)
- **Work schedule** — weekly grid per employee; toggle worked days; supports multiple weeks and week navigation
- **Tip distribution** — enter daily totals; automatically distributes proportionally by days worked; tracks payment status
- **Team management** — add/edit/deactivate employees with role assignment
- **Role-based access** — admin has full write access; employee role can only update current stock levels
- **Mobile-first PWA** — installable on iPhone/Android; consistent nav position across all routes; safe-area support
- **Supabase backend** — live data with Row Level Security; mock data fallback for demo/offline

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Backend | Supabase (PostgreSQL + Auth + RLS) |
| Hosting | Vercel |
| PWA | Web App Manifest + Apple meta tags |

---

## Roles & Permissions

| Permission | `admin` | `employee` / `equipo` |
|---|---|---|
| Edit inventory stock | ✅ | ✅ |
| Edit ideal stock / item names | ✅ | ❌ |
| Reset all stock | ✅ | ❌ |
| Manage purchases | ✅ | ❌ (read-only view) |
| Edit work schedule | ✅ | ❌ |
| Edit tip amounts | ✅ | ❌ |
| Manage team (add/edit/remove) | ✅ | ❌ |

Permissions are centralized in [`src/lib/permissions.ts`](src/lib/permissions.ts) and derived from the user's `role` field in the `profiles` table.

---

## Architecture

```
src/
├── app/
│   ├── admin/          # Admin routes (dashboard, inventory, purchases, team)
│   ├── empleado/       # Employee routes (inventory via /admin/inventario, own purchases view)
│   └── login/          # Auth page
├── components/
│   └── admin/          # AdminShell, EmployeeShell (layout + nav)
└── lib/
    ├── mock-data.ts     # Types, helpers, demo fallback data
    ├── permissions.ts   # Role → permissions map
    └── supabase/        # Server client, browser client, read/write modules per domain
```

**Data flow:**
- Server Components (`page.tsx`) fetch from Supabase via server client (cookie-based session)
- Client Components (`client.tsx`) receive initial data as props and write changes via browser client (debounced, optimistic)
- Middleware (`src/proxy.ts`) handles session refresh and auth redirects

**Mock fallback:**
When Supabase returns no rows (empty DB, RLS blocking reads), functions return demo data from `mock-data.ts` with a console warning. This lets the app run as a demo without a live database.

---

## Supabase Schema

```sql
profiles          -- id (uuid, FK auth.users), role ('admin' | 'employee' | 'equipo')
employees         -- id, name, short_name, role, phone, active, created_at
inventory         -- id, name, category, supplier, unit, current_stock, ideal_stock
manual_shopping_items -- id, name, quantity, unit, category, status
tip_weeks         -- id, start_date, end_date, status ('abierta' | 'cerrada')
tip_daily_amounts -- id, week_id, tip_date, amount
work_schedule     -- id, week_id, employee_id, work_date, worked
tip_payments      -- id, week_id, employee_id, status
```

**RLS policies needed (minimum for authenticated users):**
```sql
-- Read
create policy "auth read employees"  on employees  for select to authenticated using (true);
create policy "auth read inventory"  on inventory  for select to authenticated using (true);

-- Write (admin only in production; use role check or service role for tighter control)
create policy "auth update inventory" on inventory for update to authenticated using (true) with check (true);
create policy "auth write schedule"   on work_schedule for all to authenticated using (true) with check (true);
create policy "auth write tips"       on tip_daily_amounts for all to authenticated using (true) with check (true);
create policy "auth write tip_weeks"  on tip_weeks for all to authenticated using (true) with check (true);
create policy "auth write employees"  on employees for all to authenticated using (true) with check (true);
```

---

## Setup

**Prerequisites:** Node 20+, a Supabase project

```bash
git clone <repo>
cd como-en-casa-admin
npm install
cp .env.example .env.local
# fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Without Supabase credentials or an empty DB, the app renders with mock/demo data.

---

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL      # Your Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY # Your Supabase anon/public key (not the service role key)
```

See `.env.example` for the template.

---

## Scripts

```bash
npm run dev    # Dev server with Turbopack
npm run build  # Production build
npm run start  # Start production server
npm run lint   # ESLint
```

---

## Deploy

The app is deployed on Vercel. Push to `main` triggers a deploy.

1. Connect repo to Vercel
2. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel environment settings
3. Deploy

---

## Current Status

Core features are complete and in active use. Known open items:

- RLS policies need to be tightened per role (currently blanket authenticated-user access)
- Employee `canAdd` on purchases view needs an explicit permission prop
- Tip payment status updates (mark as paid) not yet wired to DB writes
- Some mock data still uses hardcoded demo employee names as fallback

---

## Screenshots

> _Add screenshots here_

| Mobile — Inicio | Mobile — Inventario | Desktop — Equipo |
|---|---|---|
| _(screenshot)_ | _(screenshot)_ | _(screenshot)_ |

---

## Portfolio Note

Built as a real internal tool for a small restaurant/café business, not a demo project. The main technical challenges were:

- **iOS PWA layout**: getting `position: fixed` nav to sit consistently across routes required switching to a `h-[100svh] flex flex-col` shell with in-flow nav to prevent iOS dynamic toolbar from causing positional drift
- **Role-based data access**: Supabase RLS enforced at the DB layer, permissions map in one place, Server Components decide which props to pass to Client Components
- **Optimistic writes**: stock/schedule edits are debounced and written to Supabase in the background; UI updates immediately with local state
