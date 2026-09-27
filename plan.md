# Learning & Development Plan — Django + React E-commerce ("ShopLite")

## Context
You're new to Django and want to learn it by building a small but realistic full-stack store: users, products, categories, cart, orders, and a basic checkout. The project folder `C:\Users\subin\OneDrive\Desktop\django-ecommerce` is empty, so we start from zero. Nothing gets built all at once. Each lesson follows the same loop, and we only move on after you've run and tested the result.

**Decisions already made**
- The project stays in the OneDrive folder, as you chose. To keep that workable, we'll pause OneDrive sync while running `uv add` / `npm install`, and set the folder to "Always keep on this device". (Lesson 0.3 explains why.)
- The Celery worker runs **inside Docker** next to Postgres and Redis. Django's dev server and Vite run on Windows.
- Django is pinned to **5.1.7** as you asked. Note that Django 5.1 no longer gets security support (as of 2026). That's fine for learning, and Phase 16 includes an upgrade lesson to Django 5.2 LTS.
- Python **3.12**, managed by `uv`.
- Before each library-specific lesson, I'll check the current docs (via ctx7) for Vite 8, Tailwind 4, shadcn/ui, React Router, TanStack Query, DRF, SimpleJWT, and Celery, so the commands match today's versions.

---

## How every lesson works (the teaching loop)
1. **What & why**: what we're building and why a store needs it.
2. **Concept explanations**, each in two layers:
   - 🧒 *Simple*: a real-world analogy (restaurant, warehouse, library card…)
   - 🛠️ *Developer*: how it actually works in Django/React/Postgres/etc.
3. **Files involved** and how they connect (a small diagram or list).
4. **Small code change**, with the important lines explained.
5. **You run it** using PowerShell commands, and we check the expected output together.
6. **Checkpoint**: a quick test (browser, `Invoke-RestMethod`, admin panel, or an automated test).
7. **When errors happen**: we look at the root cause, how to debug it (read the traceback, check logs, isolate the problem), then fix it.
8. I stop and wait for you to say "continue".

---

## Final architecture (where we're heading)

```
Browser (React 19 + Vite 8, :5173)
   │  Axios (JWT in Authorization header), TanStack Query cache
   ▼
Django 5.1.7 + DRF (runserver on Windows, :8000)  ── CORS allows :5173
   │  psycopg                         │ .delay() via transaction.on_commit
   ▼                                  ▼
PostgreSQL 16 (Docker, :5432)     Redis 7 (Docker, :6379)  ← broker
   ▲                                  │
   └──────── Celery worker (Docker container, runs backend code with uv) ──┘
                 sends the order-confirmation email (console backend → docker logs)
```

### Final folder structure
```
django-ecommerce/
├── docker-compose.yml          # db, redis, worker
├── .env                        # compose variables (POSTGRES_USER…) — git-ignored
├── .env.example
├── .gitignore
├── backend/
│   ├── pyproject.toml          # uv: project + dependencies
│   ├── uv.lock                 # uv: exact pinned versions
│   ├── .python-version         # uv: 3.12
│   ├── .venv/                  # uv venv (Windows) — git-ignored
│   ├── .env / .env.example     # Django settings via env vars
│   ├── Dockerfile              # used only by the Celery worker container
│   ├── manage.py
│   ├── config/                 # project package: settings.py, urls.py, celery.py, wsgi/asgi
│   ├── accounts/               # custom User, register/me endpoints
│   ├── catalog/                # Category, Product, image upload, search/filter
│   ├── cart/                   # Cart, CartItem
│   ├── orders/                 # Order, OrderItem, checkout service, tasks.py
│   ├── core/                   # shared permissions, pagination
│   └── media/                  # uploaded product images — git-ignored
└── frontend/
    ├── package.json, vite.config.ts, tsconfig*.json, components.json (shadcn)
    ├── .env                    # VITE_API_URL=http://localhost:8000/api
    └── src/
        ├── main.tsx, App.tsx, index.css (Tailwind 4)
        ├── lib/api.ts          # Axios instance + JWT interceptors
        ├── lib/utils.ts        # shadcn cn()
        ├── api/                # products.ts, auth.ts, cart.ts, orders.ts (typed request fns)
        ├── hooks/              # useProducts, useCart, useCheckout… (TanStack Query)
        ├── context/AuthContext.tsx
        ├── components/ui/      # shadcn components (Button, Card, Input, Dialog, Select…)
        ├── components/         # Navbar, ProductCard, Pagination, ProtectedRoute, AdminRoute
        ├── pages/              # Home, ProductDetail, Login, Register, Cart, Checkout, Orders, OrderDetail, admin/*
        └── types/              # Product, Category, Cart, Order TS types
```

### Data model
| Model | Key fields | Relationships |
|---|---|---|
| `accounts.User` (extends `AbstractUser`) | email (unique), username | `is_staff` = administrator |
| `catalog.Category` | name, slug | 1 → many Products |
| `catalog.Product` | name, slug, description, price (Decimal), stock, image (ImageField), is_active, timestamps | FK → Category (`PROTECT`) |
| `cart.Cart` | created/updated | OneToOne → User |
| `cart.CartItem` | quantity | FK → Cart, FK → Product; unique (cart, product) |
| `orders.Order` | status (PENDING/PAID/SHIPPED/DELIVERED/CANCELLED), shipping name/address/city/postal code/country, total, timestamps | FK → User |
| `orders.OrderItem` | product_name, unit_price (**snapshot**), quantity | FK → Order, FK → Product (`SET_NULL`) |

### API endpoints (all under `/api/`)
| Endpoint | Who | Purpose |
|---|---|---|
| `POST auth/register/`, `POST auth/token/`, `POST auth/token/refresh/`, `GET/PATCH auth/me/` | public / logged-in | signup, JWT login/refresh, profile |
| `categories/` (CRUD) | read: anyone · write: admin | categories |
| `products/?search=&category=&min_price=&max_price=&ordering=&page=` | read: anyone · write: admin | list with search, filtering, pagination |
| `products/{slug}/` (multipart upload for image) | read: anyone · write: admin | detail / edit / image upload |
| `cart/`, `cart/items/`, `cart/items/{id}/` | customer | view cart, add / change quantity / remove items |
| `orders/`, `orders/{id}/` | customer: own orders · admin: all | order history |
| `POST orders/checkout/` | customer | cart → order (atomic) |
| `POST orders/{id}/cancel/` | owner (only if PENDING) | cancel an order |
| `PATCH orders/{id}/status/` | admin | move an order through its statuses |

---

## The phases & lessons

### PART A — Foundations

**Phase 0 — Big picture & tools** *(no project code yet)*
- 0.1 How a web app works: client/server, HTTP, JSON, REST, and what "full-stack" means. A tour of the architecture diagram.
- 0.2 Checking tools in PowerShell: `docker --version`, `docker compose version`, `node -v` (Node 20.19+/22.12+ is required by Vite 8), `git --version`. Installing `uv` (`winget install astral-sh.uv` or the official PowerShell installer), then `uv --version`. PowerShell execution policy (`Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`) and why it matters.
- 0.3 Setting up the repo: `git init`, root `.gitignore`. Handling OneDrive: "Always keep on this device", pausing sync during installs, and why `.venv`/`node_modules` cause trouble.
- *Connects to →* Phase 1, since the database has to exist before Django can use it.

**Phase 1 — Docker, PostgreSQL 16, Redis**
- 1.1 Concepts: image vs. container vs. volume vs. port mapping, and Docker Desktop's WSL2 backend.
- 1.2 Writing `docker-compose.yml` with `db` (postgres:16, named volume `pgdata`, healthcheck) and `redis` (redis:7-alpine). Root `.env` holds `POSTGRES_*` values.
- 1.3 Running it: `docker compose up -d`, `docker compose ps`, `docker compose logs db`, `docker compose exec db psql -U shop -d shop`, `docker compose exec redis redis-cli ping`.
- 1.4 PostgreSQL basics in psql: databases, tables, `\dt`, `\l`. Why Postgres fits here better than SQLite. Debugging: port 5432 already in use (a local Postgres install), and how to remap it.
- *Connects to →* Phase 2, where Django connects to this database.

### PART B — Backend (Django + DRF)

**Phase 2 — uv project, virtual environment, Django skeleton**
- 2.1 `uv` concepts: what a package manager, lockfile, and virtual environment are, and uv vs. pip. Commands, each explained as we use it:
  - `uv init backend --app`: creates `pyproject.toml`, `.python-version`, and a sample `main.py`
  - `uv python pin 3.12` / `uv python install 3.12`
  - `uv venv`: creates `backend\.venv` (and how `uv run` uses it automatically, vs. activating with `.venv\Scripts\Activate.ps1`)
  - `uv add "django==5.1.7" djangorestframework psycopg[binary] python-dotenv`: updates `pyproject.toml` + `uv.lock` and installs
  - Later: `uv add --dev …`, `uv sync`, `uv lock`, `uv tree`, `uv remove`
- 2.2 `uv run django-admin startproject config .`: project vs. apps, what `manage.py`, `settings.py`, `urls.py`, `wsgi/asgi` do, and the request → URL → view → response cycle.
- 2.3 Environment variables: `backend/.env` + `python-dotenv`, `.env.example`, keeping `SECRET_KEY`/`DEBUG`/DB credentials out of code.
- 2.4 Connecting Django to Postgres through `DATABASES` settings.
- 2.5 **Custom User model before the first migration** (`accounts` app, `AUTH_USER_MODEL`), and why it's painful to change later.
- 2.6 Migrations explained (`makemigrations` vs. `migrate`, the `django_migrations` table), then `uv run python manage.py migrate`, `createsuperuser`, `runserver`. A tour of the Django admin. We'll look at the new tables in psql.

**Phase 3 — Catalog models, relationships, admin, image uploads**
- 3.1 Models & fields (CharField, SlugField, DecimalField and why prices aren't floats, ImageField) and model → table mapping.
- 3.2 Relationships: ForeignKey (one-to-many), `on_delete` options, `related_name`. The query side: `category.products.all()`, `select_related`.
- 3.3 Migrations for the catalog, and reading the generated migration file and the SQL (`sqlmigrate`).
- 3.4 `admin.py`: list_display, search_fields, list_filter, prepopulated slugs.
- 3.5 Image uploads: `uv add pillow`, `MEDIA_ROOT`/`MEDIA_URL`, serving media in dev, `upload_to`. Uploading through the admin.
- 3.6 Django shell & ORM CRUD (`uv run python manage.py shell`): create, filter, update, delete. A `seed_catalog` management command for sample data.

**Phase 4 — REST API for the catalog (DRF)**
- 4.1 What an API is, REST verbs ↔ CRUD, status codes, JSON.
- 4.2 Serializers (ModelSerializer, nested/read-only fields, `category` id for writes vs. a nested object for reads, validation).
- 4.3 Views: APIView → generics → ViewSets, and Routers → URLs. `lookup_field = "slug"`.
- 4.4 Permissions: custom `IsAdminOrReadOnly` (in `core/permissions.py`). Customers can read; admins can write.
- 4.5 Search, filtering, ordering, pagination: `uv add django-filter`, `SearchFilter`, `OrderingFilter`, a `ProductFilter` (category slug, min/max price), and `PageNumberPagination` (`core/pagination.py`).
- 4.6 Image upload through the API (MultiPartParser), and absolute image URLs in responses.
- 4.7 Testing with the Browsable API and PowerShell `Invoke-RestMethod` / `curl.exe`.

**Phase 5 — Authentication (JWT), CORS, customer vs. admin**
- 5.1 Authentication vs. authorization. Sessions vs. tokens. What's inside a JWT (header.payload.signature), access vs. refresh tokens.
- 5.2 `uv add djangorestframework-simplejwt`: token/refresh endpoints, lifetimes from env vars, `DEFAULT_AUTHENTICATION_CLASSES`.
- 5.3 Register serializer (password hashing, `validate_password`) and a `me` endpoint.
- 5.4 Permission matrix: anonymous / customer / admin, with `IsAuthenticated`, `IsAdminUser`, and ownership through queryset filtering.
- 5.5 CORS: what the browser's same-origin policy is and why it blocks :5173 → :8000. `uv add django-cors-headers`, middleware order, `CORS_ALLOWED_ORIGINS` from `.env`. We'll debug a real CORS error on purpose.

**Phase 6 — Cart**
- 6.1 Cart design: a server-side cart per user (OneToOne) and a unique (cart, product) constraint.
- 6.2 Serializers with computed fields (line subtotal, cart total) and stock validation.
- 6.3 Endpoints: get-or-create the cart, add an item (or bump its quantity), update quantity, remove. Only the owner has access.
- 6.4 Testing the whole flow with a JWT from PowerShell.

**Phase 7 — Orders, statuses, checkout**
- 7.1 Order status lifecycle (`TextChoices`), allowed transitions, and who can trigger each.
- 7.2 Price snapshots in OrderItem, and why an order must not change when a product's price changes later.
- 7.3 The checkout service (`orders/services.py`): `transaction.atomic()`, `select_for_update()` on products, stock checks, creating Order + items, reducing stock, clearing the cart. What a database transaction is and why it matters here.
- 7.4 Endpoints: checkout, list/detail (own vs. all), customer cancel (restocks items), admin status update. Admin panel inlines for orders.
- 7.5 "Checkout basics" scope: no real payment gateway. Orders start PENDING and an admin marks them PAID/SHIPPED. We'll talk about where Stripe etc. would plug in.

**Phase 8 — Background jobs: Celery + Redis (worker in Docker)**
- 8.1 Why background jobs exist: don't make the user wait for an email. Broker, worker, task, result backend.
- 8.2 `uv add celery redis`, `config/celery.py`, `config/__init__.py`, and `CELERY_*` settings from env.
- 8.3 `orders/tasks.py`: `send_order_confirmation(order_id)` with `send_mail`, a console email backend, and retries. Triggered by `transaction.on_commit(...)`, and why `on_commit` matters (race condition).
- 8.4 `backend/Dockerfile` using the official uv image: `uv sync --frozen`, keeping the container's venv separate from the Windows `.venv`, `.dockerignore`, and CRLF line-ending pitfalls.
- 8.5 A `worker` service in compose: bind-mounted code, `DB_HOST=db` / `CELERY_BROKER_URL=redis://redis:6379/0` overrides (containers reach each other by service name, while Windows uses `localhost`), `depends_on` with healthchecks.
- 8.6 Running it: `docker compose up -d --build worker`, then placing an order and watching `docker compose logs -f worker` print the email. Debugging a worker that can't reach the DB or broker.

**Phase 9 — Backend testing**
- 9.1 Why test. Django's test runner, the test database, `APITestCase`, `APIClient.force_authenticate`.
- 9.2 Tests for: product list/search/filter, admin-only writes (403 for customers), register/login, cart add/update, checkout (stock decremented, cart cleared, insufficient stock → 400), and the task being queued (mock `.delay` / `captureOnCommitCallbacks`).
- 9.3 `uv run python manage.py test`, reading failures, and optional coverage via `uv add --dev coverage`.

### PART C — Frontend (React 19 + TypeScript)

**Phase 10 — Frontend setup**
- 10.1 Concepts: what React, components, props, state, TypeScript, and Vite (dev server, HMR, build) are.
- 10.2 `npm create vite@latest frontend -- --template react-ts`, then a tour of the generated files.
- 10.3 Tailwind CSS 4 with the `@tailwindcss/vite` plugin and `@import "tailwindcss"`. Utility-first CSS explained.
- 10.4 The `@/` path alias, then `npx shadcn@latest init`. What shadcn/ui is (copied code, not a library) and how it relates to Radix UI (accessible primitives). Adding Button, Card, Input, Label, Badge, Select, Dialog, Sonner (toasts), Table, Skeleton.
- 10.5 `frontend/.env` → `import.meta.env.VITE_API_URL`, and `src/types` for API types.

**Phase 11 — Routing, Axios, TanStack Query: browsing the catalog**
- 11.1 React Router: `createBrowserRouter`, a layout route with Navbar + `<Outlet/>`, URL params (`/products/:slug`), 404 page.
- 11.2 Axios instance (`lib/api.ts`): baseURL, JSON, and typed request functions in `src/api/`.
- 11.3 TanStack Query: `QueryClientProvider`, `useQuery`, query keys, caching, staleTime, loading/error states, Devtools.
- 11.4 Product list page: search box, category filter, price filter, and pagination, all kept in URL search params (`useSearchParams`) and included in the query key. `placeholderData: keepPreviousData`.
- 11.5 Product detail page with the image, stock, and an "Add to cart" button (disabled until login).
- *Checkpoint:* the browser talks to Django over CORS.

**Phase 12 — Frontend authentication**
- 12.1 `useMutation` for login/register, form handling, and showing validation errors from DRF.
- 12.2 Token storage trade-offs (memory vs. localStorage vs. httpOnly cookie). We'll use access in memory + refresh in localStorage, and I'll explain the risks.
- 12.3 Axios interceptors: attach `Authorization: Bearer`, catch a 401, refresh once, retry, and log out on failure.
- 12.4 `AuthContext` (current user via `auth/me/`), `ProtectedRoute`, `AdminRoute`, and a Navbar that changes by role.

**Phase 13 — Cart, checkout, orders UI**
- 13.1 Cart queries + mutations (add/update/remove), `invalidateQueries`, a cart badge in the Navbar, and an optional optimistic update.
- 13.2 Checkout page: shipping form, a `checkout` mutation, navigating to the order confirmation page, and invalidating the cart and orders.
- 13.3 My Orders list/detail with status badges, plus cancelling a pending order.

**Phase 14 — Admin UI**
- 14.1 Admin products table with create/edit dialogs, **image upload with `FormData`** (multipart), and delete with confirmation.
- 14.2 Admin categories CRUD.
- 14.3 Admin orders: a list of all orders and a status change `Select` → PATCH.
- *Checkpoint:* the same actions are blocked (403) for a customer account, so the backend enforces permissions, not only the UI.

**Phase 15 — Frontend testing & end-to-end walkthrough**
- 15.1 Vitest + React Testing Library basics: testing a component (ProductCard) and a hook with a mocked API.
- 15.2 A full manual run-through: register → browse/search → cart → checkout → email in worker logs → admin marks it SHIPPED → the customer sees the new status.

**Phase 16 — Wrap-up**
- Review of what each layer does, `npm run build`, and a production-readiness checklist (DEBUG off, static/media hosting, gunicorn, secrets, HTTPS).
- Upgrade exercise: Django 5.1.7 → 5.2 LTS with `uv add "django>=5.2,<5.3"`, then run the tests.
- Ideas for next steps: payments (Stripe), product reviews, wishlist, deployment.

---

## Environment variables (planned)
- **Root `.env`** (compose): `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`
- **`backend/.env`**: `DJANGO_SECRET_KEY`, `DJANGO_DEBUG`, `DJANGO_ALLOWED_HOSTS`, `DB_NAME/USER/PASSWORD/HOST/PORT` (HOST=`localhost` on Windows; the compose worker overrides it to `db`), `CELERY_BROKER_URL`, `CORS_ALLOWED_ORIGINS=http://localhost:5173`, `JWT_ACCESS_MINUTES`, `JWT_REFRESH_DAYS`, `EMAIL_BACKEND`
- **`frontend/.env`**: `VITE_API_URL=http://localhost:8000/api`

## Windows gotchas we'll handle when they come up
PowerShell execution policy for `Activate.ps1` · OneDrive file locks during installs · port 5432 already taken by a local Postgres · CRLF line endings in files used by Linux containers · `localhost` vs. compose service names · Docker Desktop must be running · using `curl.exe` instead of PowerShell's `curl` alias.

## Verification (end of course)
- `docker compose ps` shows `db`, `redis`, and `worker` healthy/running.
- `uv run python manage.py test` passes all backend tests.
- `npm run test` (Vitest) passes, and `npm run build` succeeds.
- The manual flow in 15.2 works, including the confirmation email appearing in `docker compose logs worker`.

## Next step
When you approve this plan, we start with **Phase 0, Lesson 0.1** (the big picture, no code). After that I'll stop and wait for you to say "continue".
