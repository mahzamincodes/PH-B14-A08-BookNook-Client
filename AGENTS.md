<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# BookNook client

Next.js 16 App Router front end in plain JavaScript (no TypeScript). Auth is implemented in-app with Better Auth + MongoDB; this repository contains only the client. The Express/Mongo API is a separate project at `../booknook-server` (port 5000), outside this git repository.

## Commands

- `npm install` — use npm; `package-lock.json` is the only lockfile.
- `npm run dev` — Turbopack dev server on `http://localhost:3000`.
- `npm run build` — production build; `npm start` serves it.
- `npm run lint` — runs bare `eslint` (Next 16 removed `next lint`). Verify with lint + build.

## Layout and wiring

- `src/app/` — App Router pages and layouts (`layout.js`, `page.js`).
- `src/components/` — shared UI:
  - `Navbar.jsx` — controls auth-aware navigation; `publicLinks` (Home, All Books) vs `privateLinks` (adds Add Book, My Books, My Borrows).
  - `HomeSlider.jsx` — Swiper fade slider (3 slides, autoplay, dots, arrows). CTAs point to `/all-books`; backgrounds in `public/images/banner/`.
  - `NewArrivals.jsx` — fetches latest 6 books from `NEXT_PUBLIC_API_URL/books?limit=6`; shows skeletons, error/retry, empty state.
  - `Footer.jsx` — static footer with explore links, contact email, social icons.
- `@/*` resolves to `src/*` (`jsconfig.json`).

Key routing:
- `/all-books` — simple list (Navbar link).
- `/books?category=<Name>` — category-filterable (category cards link here).

## Gotchas (critical)

- `src/lib/auth-client.js` hardcodes `baseURL: "http://localhost:3000"`; must change (or move to env var) for any other host/port.
- Tailwind v4 is wired through the Turbopack CSS rule in `next.config.mjs` (`@tailwindcss/turbopack`), **not** the usual `@tailwindcss/postcss` plugin. Do not "fix" this by switching plugins.
- Custom theme tokens live in `src/app/globals.css` under `@theme` (`brand`, `brand-soft`, `surface`, `ink`, `muted`). If those colors or the Poppins font suddenly stop applying after a hot reload, restart `next dev`; the dev server can serve a stale theme bundle.
- `reactCompiler` and `experimental.agentFeedback` are enabled in `next.config.mjs`. `next dev` rewrites the managed Next.js blocks in this file; commit them rather than deleting them.
- Swiper's own CSS wins on equal specificity, so slider overrides are scoped as `section .home-slider …`. If the dots/arrows jump back to default after a hot reload, restart `next dev`; the CSS bundle can go stale.
- `NEXT_PUBLIC_API_URL` defaults to `http://localhost:5000`. Multiple components (`NewArrivals`, `AllBooksPage`, `BooksPage`, `BookDetailsPage`, `AddBookPage`) read this env var and expect `/books` endpoint returning array with `createdAt`, `_id`, `title`, `author`, `category`, `totalCopies`, `availableCopies`, `image`.
- `add-book/page.jsx` POSTs to `NEXT_PUBLIC_API_URL/books` with JSON body: `title`, `author`, `category`, `totalCopies`, `description`, `image`, `addedBy`. Image upload attempted via `NEXT_PUBLIC_API_URL/upload-image` first; not yet implemented server-side (image field sent as empty string).
- Two "all books" pages exist: `/all-books` (simple list) and `/books` (supports `?category=` filter). Navbar "All Books" links to `/all-books`; category cards link to `/books?category=<Name>`.
- `src/lib/auth.js` database name is hardcoded to `booknook`.

## Environment

Required `.env` variables (gitignored):

```
BETTER_AUTH_SECRET=<random string>
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_DB_URL=mongodb+srv://...
NEXT_PUBLIC_API_URL=http://localhost:5000
GOOGLE_CLIENT_ID=<from Google Cloud Console>
GOOGLE_CLIENT_SECRET=<from Google Cloud Console>
```

No `.env.example` exists.

## Key files to watch

- `next.config.mjs` — Turbopack Tailwind rule, React Compiler, agentFeedback.
- `src/lib/auth.js` — DB name hardcoded to `booknook`; Google OAuth config.
- `src/lib/auth-client.js` — baseURL hardcoded to localhost:3000.
- `src/app/globals.css` — `@theme` tokens, Swiper overrides.
- `src/components/HomeSlider.jsx` — slide content, CTA targets.
- `src/components/Navbar.jsx` — `publicLinks` / `privateLinks` arrays for navigation.
- `src/components/NewArrivals.jsx` — API_BASE, LIMIT, fetch logic.
- `src/app/add-book/page.jsx` — validation rules, toast system, form fields, image upload flow.
- `src/app/books/page.jsx` — category filtering via searchParams.
- `src/app/all-books/[id]/page.jsx` — book detail view, borrow button.