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

Everything runs in containers. Node, Python and Postgres are **not** installed on
the host, so `npm` and `pytest` typed directly into a shell will not be found —
that is expected, not a broken machine.

```bash
docker compose up -d --build                # the three services
docker compose logs -f frontend             # or backend / db
docker compose down                         # stop (keeps the database)

docker compose run --rm frontend-test               # 26 Jest tests
docker compose run --rm backend-test                # 11 pytest tests, migrations included
docker compose run --rm frontend-test npm run build # production build, also typechecks
docker compose run --rm frontend-test npm run lint
docker compose exec backend alembic check           # models vs migrations
docker compose exec backend alembic upgrade head
```

The two `*-test` services mount the working tree, so a run picks up edits with no
rebuild. Rebuild only when `package.json` or `requirements.txt` changes.

`docker compose down -v` also deletes the database volume — every user, including
the seed admin. Do not reach for it to "restart cleanly".

## Definition of done

**New code ships with its tests, and the suite is green before the work is called
done.** Not "should pass", not "unrelated failure" — run it and read the output.

- New behavior gets a new test; changed behavior gets its test updated. A change
  that adds no test needs a reason stated out loud, and "it is only styling" is
  one — the tests query by role and text precisely so styling does not touch
  them.
- Green is both suites plus the build: `frontend-test`, `backend-test`, and
  `npm run build` for the typecheck. Touching models or migrations adds
  `alembic check`.
- **Never buy a green by weakening the test.** No deleted assertions, no `.skip`,
  no `--passWithNoTests`, no loosening a matcher, and above all no editing the
  expected value to match what the code currently returns. A failing test is a
  finding. If the test itself is genuinely wrong, say why before changing it.
- If a suite was already failing before the change, say so explicitly instead of
  absorbing it into the result.

**The baseline is silence.** Lint reports zero errors and zero warnings, so any
output at all belongs to the change being made. Do not restore a green by adding
an `eslint-disable`: the rule that fires is usually pointing at something real.
`react-hooks/set-state-in-effect` on the theme toggle was, and the fix was to
read the applied theme instead of deriving it a second time.

## Working with a non-technical author

The person prompting may not read code. They describe what they see on the page,
in Spanish, and they cannot check whether the result is right by reading a diff.
That changes what a good answer looks like, not what a good change looks like —
the conventions and invariants below hold regardless of who asked.

**Answer in the language they wrote in; the code stays English.** The language
rule above is about files, not about conversation. Explaining a change in Spanish
and then naming a variable in Spanish are two different things, and only the
second is a bug.

**Restate the request before touching anything ambiguous.** One sentence naming
the page and the visible change. "Cambio el título de la sección de marcas en la
página principal" gives them something to correct; "Entendido, lo hago" does not.
Ask only when two readings produce genuinely different work — then ask once, with
concrete options, rather than a list of clarifying questions.

**Their words map to these files:**

| They say | It lives in |
|---|---|
| la página principal, el inicio, la landing | `app/page.tsx` |
| el menú de arriba, la cabecera | `components/SiteHeader.tsx` |
| el pie de página | `components/SiteFooter.tsx` |
| el botón de día/noche, el tema, los colores oscuros | `components/ThemeToggle.tsx` |
| la pantalla de ingreso, iniciar sesión | `app/login/page.tsx`, `app/login/LoginForm.tsx` |
| el panel, el administrador | `app/admin/page.tsx`, `app/admin/AdminDashboard.tsx` |
| la página de una marca | `app/brands/[brand]/page.tsx` |
| las marcas, los modelos, los precios, los datos | `data/catalog.ts` |
| los colores, los tamaños de letra, los espacios | `app/globals.css` |
| la página de error, "no encontrado" | `app/not-found.tsx` |
| usuarios, contraseñas, el ingreso por detrás | `backend/app/routers/auth.py` |

**When a request collides with an invariant, neither comply nor refuse.** Explain
the consequence in one non-technical sentence and deliver the version that holds
the line. The three that come up most:

- *"Pon el texto en amarillo Renault"* — raw brand yellow reads at 1.4:1 on light
  backgrounds, which is illegible for many people. Use `brand-ink`.
- *"Esconde el botón de borrar para los que no son admin"* — hiding a button
  hides nothing; the request still works from a terminal. The check belongs on
  the FastAPI endpoint.
- *"Haz que la página traiga los datos del servidor"* — the landing page is
  static and measured at 100/100/100/100. Say what it costs, then confirm.

**"Ya quedó" is not a report.** Say what changed, at which URL they can see it,
and what to look for once there. Then the suite result. They are verifying in a
browser, so give them the browser steps.

**Edits in the admin panel vanish on reload — that is the known gap below, not a
bug to patch.** If they report it as broken, name it as the missing backend and
point at the README's order for closing it. Do not paper over it with
`localStorage`.

**Change what was asked and nothing else.** No drive-by renames, refactors or
dependency bumps riding along in someone else's change — they cannot review what
they cannot read. Spot something else broken, mention it separately.

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
