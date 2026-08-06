@AGENTS.md

# Landing + Login Template

Catalog site with a static landing page, session-based auth and an admin panel.
Read `README.md` for the user-facing overview; this file covers the conventions
that are easy to break without noticing.

## Shape

| Part | Stack | Port |
|---|---|---|
| `frontend/` | Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4 | 3030 |
| `backend/` | FastAPI, SQLAlchemy 2, Alembic, PyJWT, bcrypt | 3031 |
| `db` | PostgreSQL 16 — one table, `users` | 5432 |

`docker compose up --build` runs all three. Seed account: `admin@example.com` /
`admin1234`.

## Language rule

Code, comments, commit messages, identifiers and docs: **English**.
Text a visitor reads on the page: **Spanish**.

A file mixing the two in the wrong direction is a bug, not a style preference.

## Commands

```bash
cd frontend && npm run dev      # 3030
cd frontend && npm test         # 26 Jest tests
cd frontend && npm run build    # also typechecks
cd backend && pytest            # 11 tests, including the migrations
cd backend && alembic upgrade head
cd backend && alembic check     # models vs migrations
```

## Conventions that are easy to break

**Styling is Tailwind only.** The CSS Modules were removed deliberately; do not
reintroduce them, and do not add a `tailwind.config.js` — v4 is configured in
`app/globals.css`.

**Theme colors are runtime custom properties**, exposed to Tailwind through
`@theme inline`. Do not add `dark:` variants for color. A theme swap must stay a
variable swap, otherwise `--brand` can no longer be overridden per element, which
is what lets each brand color its own card.

**Three project utilities** live in `globals.css`: `page-container`, `eyebrow`,
`brand-ink`. Use them instead of repeating the same class strings.

**`brand-ink`, not `text-brand`, for brand-colored text.** Raw brand colors fail
contrast on light backgrounds (Renault yellow lands at 1.4:1). The utility mixes
in black by `--brand-ink-strength`, which is 100% on dark and 45% on light.

**Alembic owns the schema.** No `create_all` anywhere. Write a migration, review
what autogenerate produced — it reports a rename as a drop plus an add, which is
data loss in production — and let the container entrypoint apply it.

**Tests query by role and text, never by class.** That is why the whole Tailwind
migration touched zero test files. Keep it that way.

**The landing page is `force-static` and free of client components** apart from
the theme toggle. It is verified at 100/100/100/100 on desktop Lighthouse and
99/100/100/100 on mobile. Adding request-time data fetching or a client component
to it will cost those numbers — measure again if you do.

## Security invariants

**Authorization belongs on the FastAPI endpoint.** Not in the middleware, not in
whether a button renders. Anyone can send the request with curl.

**`middleware.ts` is a UX redirect, not a boundary.** It only checks that a
cookie exists. `app/admin/page.tsx` does the real validation by calling
`getCurrentUser()` before rendering.

**The session token never reaches client JavaScript.** Login goes through the
Next route handler, which stores the JWT in an httpOnly cookie. Do not move that
call into the browser.

**Client-side validation is a courtesy.** Anything that reaches the database must
be re-validated server-side.

## Known gaps

These are deliberate, and each is a trap if you build on top of it without
closing it first:

- **Brands and products never reach the server.** The admin panel mutates React
  state, which is why edits vanish on reload. When adding real endpoints, every
  write needs a server-side authorization check.
- **`users` has no role column.** Every authenticated user can do everything.
- **`logout` does not revoke the token**; it only clears the cookie. Sessions
  last 7 days by default (`SESSION_TTL_MINUTES`).

The README's authorization section spells out the order to close these in.

## Do not commit

`howtobuild.md` and `Propuesta-don-Hector.pdf` are client business documents and
are gitignored. **This repository is public.** Keep credentials, pricing and
client data out of it — including in commit messages.
