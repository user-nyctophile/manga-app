# manga. — starter scaffold

A Next.js manga browser/reader on the MangaDex API: real login, server-saved favorites and
reading history, a dedicated mobile layout, and a print-inspired design system.

## What's included

- **Home** — search, "Surprise Me", Continue Reading rail with real last-read-page markers
- **Browse** — popular / latest / top-rated
- **Search** — live MangaDex title search
- **Manga detail** — cover, tags, description, full chapter list, Add to Favorites
- **Reader** — dedicated dark reading surface, prev/next chapter, progress auto-saved
- **Login / Register** — email + password accounts (NextAuth + Prisma + SQLite)
- **Library** — Favorites and History tabs; server-backed when signed in, localStorage when not
- **Separate mobile UI** — compact top bar + fixed bottom tab bar (`components/MobileTopBar.tsx`,
  `components/BottomNav.tsx`) instead of a squeezed-down desktop nav; `components/Header.tsx` is
  desktop-only

## Design system

- **Palette**: warm screentone paper (`#ece4d3`), near-black ink (`#1c1712`), a single
  spine-red accent (`#c31f26`) referencing manga volume spines, plus a muted gold for secondary
  accents. The reader is a dedicated dark surface (`#121212`) since chrome and long-form reading
  have different needs.
- **Type**: Shippori Mincho (display) + Inter (body) + IBM Plex Mono (chapter numbers, dates,
  metadata — a print-catalog feel for data).
- **Signature elements**: manga cards use a corner "spine tab" instead of a generic badge;
  Continue Reading / History cards show the actual last-read page number rather than a fabricated
  progress bar.

All tokens live in `tailwind.config.ts` and `app/globals.css` — change the palette there and it
propagates everywhere.

## Architecture

- `app/api/mangadex/[...path]/route.ts` — proxy to `api.mangadex.org` (MangaDex blocks direct
  browser CORS requests); caches responses 5 minutes.
- `lib/mangadex.ts` — typed MangaDex client functions.
- `lib/auth.ts` + `app/api/auth/[...nextauth]/route.ts` — NextAuth credentials provider.
- `prisma/schema.prisma` — `User`, `Favorite`, `HistoryEntry` models (SQLite by default; swap
  the `DATABASE_URL` for Postgres/MySQL in production, schema is compatible).
- `app/api/favorites/route.ts`, `app/api/history/route.ts` — per-user CRUD, auth-gated via
  `getServerSession`.
- `lib/useFavorites.ts`, `lib/useHistory.ts` — the single hook every page calls; it checks the
  session and talks to the server API when signed in, or `lib/store.ts` (Zustand + localStorage)
  as a guest. Pages don't need to know which mode they're in.

## Setup

```bash
npm install
cp .env.example .env
# edit .env: set NEXTAUTH_SECRET to a real value (openssl rand -base64 32)

npx prisma generate
npx prisma db push   # creates dev.db and the tables

npm run dev
```

Open http://localhost:3000, register an account, and favorites/history will persist across
sessions and devices (once you deploy with a real DATABASE_URL — SQLite is local-file-only,
fine for dev, not for multi-instance production).

## Verified

This scaffold has been installed and built (`npm run build`) end-to-end in a sandboxed
environment; all 13 routes compile and typecheck cleanly. Two things could **not** be verified
in that sandbox specifically because it has restricted network access (not because of a code
issue), so double-check them in your own environment:

- `npx prisma generate` downloads a native query-engine binary from Prisma's CDN — needs open
  internet access once, then it's cached.
- `next/font/google` fetches font files at build time — same story.
- The actual login → save favorite → sign out → sign back in → favorite still there flow wasn't
  runtime-tested (compile-verified only). Worth clicking through once after your first
  `npm run dev`.

## MangaDex API compliance (still applies)

- No ads or paid features on top of it.
- Credit scanlation groups where chapter content is shown (fetched via
  `includes[]=scanlation_group` in `lib/mangadex.ts` but not yet displayed in the UI — add this
  before showing this to real users).
- Respect rate limits — don't remove the 5-minute proxy cache without adding your own throttling.

Docs: https://api.mangadex.org/docs/

## Where to go from here

- Display scanlation group credit in the reader.
- Long-strip/webtoon reading mode + data-saver image toggle.
- Move off SQLite (`DATABASE_URL`) for real deployment.
- Loading skeletons on Browse/Search (Manga detail already has one).
