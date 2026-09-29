# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

ShopLite is a learning full-stack store: Django 5.2 + DRF backend (`backend/`, managed with uv), React 19 + TypeScript + Vite frontend (`frontend/`), PostgreSQL 16 + Redis + a Celery worker in Docker. The developer is on Windows with **PowerShell 5.1**; give commands in PowerShell syntax.

## Commands

Run uv commands from `backend/` and npm commands from `frontend/`. From the repo root, npm walks up to an unrelated `package.json` in the user's home folder, and uv picks the wrong Python.

```powershell
# Infrastructure (repo root). Postgres is published on host port 5433 (5432 is taken by a native PostgreSQL).
docker compose up -d
docker compose restart worker          # required after changing any Celery task code (no autoreload)
docker compose logs -f worker          # dev emails are printed here (console backend unless SMTP set in backend/.env)

# Backend (backend/)
uv sync
uv run python manage.py runserver
uv run python manage.py makemigrations; uv run python manage.py migrate
uv run python manage.py seed_catalog                          # idempotent sample data
uv run python manage.py test                                  # needs the db container; Redis not needed
uv run python manage.py test orders                           # one app
uv run python manage.py test accounts.tests.PasswordResetTests.test_invalid_link_is_refused   # one test
uv run coverage run manage.py test; uv run coverage report
uv run python manage.py makemigrations --check --dry-run      # CI fails if a migration is missing

# Frontend (frontend/)
npm run dev          # :5173
npm run lint         # oxlint; the only-export-components warnings in components/ui are expected
npm test             # vitest run
npx vitest run src/components/products/ProductCard.test.tsx   # one file
npx vitest run -t "out of stock"                              # by (part of) the test name
npm run build        # tsc -b + vite build
```

CI (`.github/workflows/ci.yml`) runs the same backend checks against a Postgres service and the frontend lint/test/build as two parallel jobs on every push to `main` and every PR. It sets `DJANGO_DEBUG=True` because `DEBUG=False` turns on the HTTPS redirect (see the end of `config/settings.py`), which breaks every test request.

## Architecture

### Processes and the two environments
Django `runserver` and Vite run on Windows and read `backend/.env` / `frontend/.env` (`DB_HOST=localhost`, `DB_PORT=5433`). The Celery worker runs in Docker with the same `backend/` code bind-mounted, but `docker-compose.yml` overrides `DB_HOST=db`, `DB_PORT=5432` and the broker URL. The worker's clock is **UTC** while Windows runs in local time. Anything time-based that the web process later verifies must be created in the web process and passed to the task. Password-reset links are built by `password_reset_link()` in `accounts/views.py` and passed to `send_password_reset_email(user_id, link)`, because a token made in the worker looked hours old to Django on Windows.

### Settings
Everything comes from env vars via the `env_bool` / `env_list` helpers in `config/settings.py`. `DJANGO_SECRET_KEY` and `DB_NAME/USER/PASSWORD` are required (they use `os.environ[...]`). When the command is `test`, a fast MD5 password hasher is used. `backend/.env.example` documents every variable.

### DRF defaults that affect every view
- Default permission is `IsAuthenticated`. Public endpoints must set `AllowAny` or `core.permissions.IsAdminOrReadOnly` explicitly. Public auth views also set `authentication_classes = []` so a stale token can't cause a 401.
- JWT auth first (SimpleJWT: 15 min access, 7 day refresh, email-based login that lowercases the email), then session auth for the browsable API.
- Global pagination `core.pagination.StandardPagination` (12 per page). Global filter backends: django-filter, SearchFilter and `core.filters.StableOrderingFilter` (adds an `-id` tie-breaker so pages are stable).
- `accounts.User` uses `email` as `USERNAME_FIELD`; emails are normalized to lowercase.

### Business logic lives in `orders/services.py`, not in views
- `place_order(user, shipping)` is `@transaction.atomic`. It locks the cart, then the products (`select_for_update`, ordered by id to avoid deadlocks), checks stock, and copies name and price into `OrderItem` (price snapshot; `OrderItem.product` is `SET_NULL`). It then decrements stock, empties the cart, and queues the confirmation email with `transaction.on_commit(..., robust=True)` so a Redis outage never breaks checkout. `tools/race_demo.py` demonstrates the locking.
- `change_status(order_id, new_status, customer=None)` locks the order, validates against `Order.ALLOWED_TRANSITIONS`, and returns stock on cancel. When `customer` is passed, only the owner may cancel.
- The allowed transitions are **mirrored in the frontend** (the next-step buttons in `frontend/src/pages/admin/AdminOrdersPage.tsx`); keep both in sync.
- Catalog resources are looked up by `slug`. Deleting a category that still has products returns 409 (`ProtectedError`). The category list is annotated with `product_count` and is not paginated.

### Emails
- **Sending:** every email goes through `core.emails.send_email()`. It renders `backend/templates/emails/<name>.txt` and `.html` (both are required) and sends them as one multipart message.
- **Templates:** the HTML templates extend `emails/base.html` and reuse `_items`, `_address` and `_button`. They use tables and inline styles only, because mail clients ignore most CSS. The `.txt` templates wrap their content in `{% autoescape off %}`.
- **Product pictures:** they are inline CID attachments, built by `InlineImages`: small JPEG thumbnails made with Pillow, and a letter placeholder when a product has no picture. They aren't URLs, because Gmail can't load `localhost` images.
- **Order emails:** they are the `ORDER_EMAILS` table in `orders/tasks.py` (`'confirmation'` plus the `Order.Status` values except pending), sent by `send_order_email(order_id, kind, cancelled_by_customer=False)`. `place_order()` and `change_status()` queue them via `transaction.on_commit(..., robust=True)`, so every status-change path (API, customer cancel, Django admin actions) emails the customer.
- **Previews:** `uv run python manage.py preview_emails [--order ID]` writes every design to `backend/email-previews/` (git-ignored) and sends nothing.

### Backend tests
Each app has a `tests.py` using the helpers in `core/testing.py`:
- `make_user`, `make_category`, `make_product`, the shared `PASSWORD`
- `client_for(user)`, which uses `force_authenticate`
- `make_picture()`, plus `TemporaryMediaMixin`: put it first in a test class's bases so saved files go to a temporary `MEDIA_ROOT`

Emails sent by a task that the test calls directly land in `mail.outbox`. Celery tasks are never really queued in tests: patch `.delay` **where it is imported**, e.g. `mock.patch('accounts.views.send_password_reset_email.delay')`. The password-reset rate limit is counted in the cache, so those tests call `cache.clear()` in `setUp`.

### Frontend data flow
- `src/lib/api.ts` has the single Axios instance. The request interceptor attaches the Bearer token. The response interceptor handles a 401 with a **single-flight** refresh (one refresh shared by all concurrent failures, each request retried once), then calls the session-expired handler registered by `auth/AuthProvider.tsx`. It also has error helpers (`getErrorMessage`, `getFieldErrors`) that read DRF error shapes.
- `src/lib/tokens.ts`: the access token lives in memory only; the refresh token is in localStorage (`shoplite.refresh`). On load, `AuthProvider` tries a refresh to restore the session. Logout clears the whole query cache.
- Layers: `src/api/*.ts` (typed request functions; types in `src/types/api.ts` mirror the DRF serializers) → `src/hooks/*.ts` (TanStack Query) → pages. Query keys: `['products', filters]`, `['product', slug]`, `['categories']`, `CART_KEY = ['cart']`, plus order keys in `useOrders.ts`. Cart mutations write the returned cart with `setQueryData`. Admin mutations invalidate every key whose data they change (products, product, cart, categories).
- Product list filters live in the URL search params and are part of the query key (`placeholderData: keepPreviousData`).
- `src/router.tsx`: Home, Products, ProductDetail and NotFound load eagerly; every other page is a lazy route. `RequireAuth` / `RequireAdmin` in `components/auth/RouteGuards.tsx` wrap route groups. Login/register redirects go through `safeNext()` (`lib/redirect.ts`) to prevent open redirects.
- UI is shadcn/ui (Radix) in `src/components/ui` (generated code) plus Tailwind 4 via `@tailwindcss/vite`; the `@/` alias points to `src/`.
- Frontend tests use Vitest + jsdom + Testing Library. Mock the API module (`vi.mock('@/api/catalog', ...)`) and render with the providers from `src/test/render.tsx`, using the data builders in `src/test/fixtures.ts`.

## Conventions
- Code comments are plain-English explanations of *why* (this is a learning project); match that style.
- Commit messages must not contain `Co-Authored-By: Claude` or "Generated with Claude Code" lines.
- `backend/.env` holds real SMTP credentials: don't print its secret values.
- `learned.md`, `plan.md`, `IDEAS-NEXT.md` and `django-commands-so-far-used.md` are the developer's course notes, not documentation of the code.
