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

### Deployment (AWS; branch `feature/aws-deploy`)
- **Images:** `backend/Dockerfile` has three stages: `base` (uv deps), `web` (Gunicorn; `collectstatic` runs at build time with placeholder env vars) and `worker` (Celery; the last stage, so it's the default). `docker-compose.yml` builds `target: worker`.
- **Cloud features are environment-driven, and local stays the default:**
  - WhiteNoise middleware always serves static files; `CompressedManifestStaticFilesStorage` is used only when `DEBUG` is off.
  - `STORAGES['default']` becomes `storages.backends.s3.S3Storage` only when `AWS_STORAGE_BUCKET_NAME` is set (`location='media'`, `custom_domain` = the CloudFront domain, no querystring auth, credentials from the ECS task role).
  - `DJANGO_SECURE_PROXY_SSL_HEADER` (`HTTP_CLOUDFRONT_FORWARDED_PROTO` on AWS), `DB_SSLMODE`, `DB_CONN_MAX_AGE`, and `LOGGING` to stdout (Django's own logger at ERROR, so expected 5xx in tests are wrapped in `assertLogs('django.request', 'ERROR')`).
- **Health check:** `core.middleware.HealthCheckMiddleware` is **first** in `MIDDLEWARE` and answers `/healthz/` before the ALLOWED_HOSTS check and the SSL redirect (the ALB health checks use the task's IP as host). It never touches the DB.
- **Django admin path:** `DJANGO_ADMIN_URL` (default `admin/`; `django-admin/` on AWS). The React app has its own `/admin` staff pages, and on AWS both sit behind one CloudFront address, so the Django admin must not use `/admin`.
- **AWS layout (us-east-1, built by hand in the console, since torn down):** CloudFront is the single HTTPS address. Default behaviour → private S3 frontend bucket (OAC) + the SPA-routing function; `/media/*` → the media bucket; `/api/*`, `/api-auth/*`, `/django-admin/*` (caching disabled, `AllViewerAndCloudFrontHeaders-2022-06`) and `/static/*` (cached) → the ALB. The ALB accepts only the CloudFront prefix list and requests carrying the secret `X-Origin-Verify` header (default action 403). ECS Fargate web + worker, RDS PostgreSQL and ElastiCache Valkey sit in private subnets behind one NAT gateway; secrets come from SSM `/shoplite/*`.
- **Email thumbnails:** they open images via `product.image.open()` (storage-agnostic, works with S3), never `.path`.
- **CD:** `.github/workflows/deploy.yml`.
  - **Trigger:** `workflow_run` after CI on `main`, or `workflow_dispatch` with `images_only`. It's gated by the repo variable `DEPLOY_ENABLED` and the `production` environment approval.
  - **Steps:** OIDC → ECR push (tag = commit SHA; skipped via `ecr:DescribeImages` when that tag already exists, because tags are immutable, so re-runs and rollbacks to older commits work) → migrate one-off task, which must exit 0 → rolling deploy of the web and worker services → frontend built with `VITE_API_URL=/api` → S3 sync and `index.html` invalidation.
  - **Task definitions:** the families and container names (`web`, `worker`, `migrate`) must match the ones in AWS. The pipeline downloads the **current** revision and only swaps the image, so it owns the image tag; a revision edited by hand must start from the latest one.
  - **OIDC:** the repository uses GitHub's immutable subject, so the deploy role's trust policy `sub` has the form `repo:<owner>@<owner-id>/<repo>@<repo-id>:environment:production`.
  - **Feature branches:** `deploy.yml` is on `main`, so a feature branch is deployed with "Run workflow" (choose the branch); there is no push trigger.
  - **Checks:** validate the workflow with `docker run --rm -v "${PWD}:/repo" -w /repo rhysd/actionlint`.
- **Console pieces** live in `deploy/aws/`: IAM policy and task-definition templates with `<PLACEHOLDERS>`, and the CloudFront Function for SPA routing (default behaviour only, so API 404s stay 404s). Filled copies are `*.local.*` and git-ignored; the repository is public, so the AWS account ID, the origin-verify secret and other real IDs must never be committed.
- **Docs:** `INTERVIEW-DEPLOYMENT.md` explains the manual deployment (architecture, IAM, CI/CD, costs, the problems hit, interview Q&A). Keep it in sync when the deployment design changes.

### Terraform (`infra/terraform/`, branch `feature/terraform`)
- **What:** the same AWS architecture as code: a flat root module, one file per area (`network.tf`, `security_groups.tf`, `database.tf`, `storage.tf`, `secrets.tf`, `iam.tf`, `github_oidc.tf`, `alb.tf`, `ecs.tf`, `cdn.tf`, `monitoring.tf`). It uses no community modules. `bootstrap/` creates the S3 state bucket (with local state); the main configuration uses the S3 backend with `use_lockfile = true` (bucket and profile in the git-ignored `backend.hcl`).
- **Who runs it:** the developer runs `plan` / `apply` / `destroy` in their own terminal with the AWS profile `shoplite-terraform`. The provider pins `profile` and `allowed_account_ids`, so other keys or accounts are refused. Never ask for or print the key. I only run `terraform fmt -recursive` and `terraform init -backend=false` + `terraform validate`; CI runs the same checks in the `terraform` job.
- **Secrets never touch the state:**
  - The Django secret key and the DB password are `ephemeral "random_password"`; the superuser and Razorpay secrets are ephemeral `TF_VAR_*` variables.
  - All of them are written via write-only arguments (`value_wo`, `password_wo`). They're only re-sent when `secrets_version` changes.
  - The origin-verify header secret is a normal `random_password` (CloudFront needs it as a plain argument).
- **The pipeline owns the image:** the ECS services have `lifecycle { ignore_changes = [task_definition] }`. The task definitions start with the tag `not-built-yet` and `app_desired_count = 0`. The first pipeline run pushes the images, then `app_desired_count = 1`.
- **Teardown:** `force_destroy` / `force_delete` on the buckets and ECR, and RDS `skip_final_snapshot`, so `terraform destroy` removes everything. Task-definition revisions registered by the pipeline aren't in the state; deregister them by hand.
- **Drift (keep this behaviour when changing the code):**
  - `terraform plan` reports hand-made console changes to managed resources, and `apply` reverts them. The demo is the `/ecs/shoplite-web` retention changed to 3 days, which plans as `retention_in_days = 3 -> 1`.
  - Pipeline deploys must **not** show as drift: that's what `ignore_changes = [task_definition]` is for. After a deploy, the plan should not touch the services.
  - Avoid making IAM policy documents depend on attributes of resources that change often. Referencing `aws_ecs_service.*.id` made the deploy policy show "known after apply" whenever a service changed, so the service ARNs are built from names in `github_oidc.tf`.
  - Security-group rules are separate `aws_vpc_security_group_*_rule` resources, so a rule added by hand is **not** detected. Only resources in the state are compared.
- **Docs:** `INTERVIEW-TERRAFORM.md` explains the code and the real apply/test/destroy run. Keep it in sync when the Terraform design changes.
- **Real values:** `terraform.tfvars` (git-ignored; it holds the account ID). The `.example` files show the shape. Commit `.terraform.lock.hcl` (locked for windows_amd64 and linux_amd64).

### Search (`catalog/search.py`)
- **One place:** all search rules live in `catalog/search.py`. `ProductViewSet.filter_backends = [DjangoFilterBackend, ProductSearchFilter, ProductOrderingFilter]` (`catalog/filters.py`); DRF's `SearchFilter` is no longer used for products.
- **Matching:** PostgreSQL full-text search (`SearchQuery(search_type='websearch', config='english')`, so `"phrase"` / `-word` work) over name (weight A) + category name (B) + description (C). **Typo tolerance is a fallback:** `TrigramWordSimilarity` on the name (≥ `TYPO_SIMILARITY` 0.35) counts only when nothing matches exactly, and `-words` are excluded in both modes.
- **Ordering:** products are annotated with `relevance` (rank + 0.5 × similarity). While `?search=` is present without `?ordering=`, the default is `-relevance`. Without a search, `relevance` is a constant 0, so `?ordering=-relevance` never errors.
- **Highlights:** `search_snippet` is a `SearchHeadline` of the description with matches wrapped in the control characters `\x02`/`\x03`. The serializer returns it only if it contains a match. The frontend renders it with `components/products/HighlightedText.tsx`: no HTML, no `dangerouslySetInnerHTML`.
- **`did_you_mean`:** added to list responses only while searching. It's offered only when nothing matches the words exactly; each unknown word is corrected with `difflib` against the words of active product and category names, and the correction must itself match. A large catalog would cache this vocabulary or use `ts_stat`, and would store a precomputed `search_vector` column with a GIN index instead of computing vectors per query.
- **Suggest:** `GET /api/products/suggest/?q=` (a list-route `@action`, unpaginated, active products only, 2+ characters, contains-matches first, max 6) feeds `components/products/SearchBox.tsx`, an ARIA combobox that debounces via `hooks/useDebouncedValue.ts`.
- **Database:** migration `catalog/0003_search` runs `TrigramExtension()` (the DB user needs permission to create extensions) and adds a `gin_trgm_ops` index on `Product.name`. `django.contrib.postgres` is in `INSTALLED_APPS`.

### Reviews (`reviews` app)
- **Who may review:** `Review` has one row per (user, product), enforced by a `UniqueConstraint`, and a 1–5 `CheckConstraint`. `reviews/services.can_review()` is the rule: the user has an `OrderItem` for the product in an order with status `delivered`. The POST view returns 403 without a delivered order and 400 for a second review; an `IntegrityError` from the unique constraint is caught as the safety net.
- **Routes:** `reviews/urls.py` has plain paths under `products/<slug>/reviews/` (public list, POST) and `products/<slug>/reviews/me/` (GET `{can_review, review}`, PATCH, DELETE). The "me" route makes ownership implicit. It's included in `config/urls.py` **before** `catalog.urls`.
- **Visibility:** hidden reviews (`is_visible=False`, set only in the Django admin) are excluded from the public list and from ratings, but returned to their author by `me`. `author` is "First L." or the username, never the email.
- **Ratings on products:** `ProductViewSet.get_queryset` annotates `review_count` and `average_rating` (visible reviews only) plus `rating` (`Coalesce(avg, 0)`): the `?ordering=-rating` sort key, so unrated products sort last instead of NULLs first. `ProductSerializer` reads the annotations with `getattr` defaults.
- **Frontend:** `hooks/useReviews.ts`. The list is a `useInfiniteQuery` (key `['reviews', slug]`, "Show more"); the "me" data is `['my-review', slug]`. Mutations update `['my-review', slug]` and invalidate the review list, `['product', slug]` and `['products']`. The UI is in `components/reviews/` (`MyReviewBox` picks sign-in / form / own review / not-eligible). `ProductReviews` (lazy-loaded by `ProductDetailPage`) scrolls to `#reviews` when the address has that hash.

### Wishlist (`wishlist` app)
- **Backend:** `WishlistItem` is unique per (user, product). The endpoints are `wishlist/` (GET a plain, unpaginated list, newest first; POST `{product_id}`) and `wishlist/<product_id>/` (DELETE, **addressed by product id**). Both writes are idempotent: POST returns 201, or 200 if the product was already saved (with an `IntegrityError` fallback); DELETE always returns 204 and only touches the signed-in user's rows. Only active products can be saved, but items stay listed with `is_active: false` if the product is hidden later.
- **Frontend:** `hooks/useWishlist.ts` holds `WISHLIST_KEY`. `useIsInWishlist(id)` reads the one cached list, so every heart shares it. `useToggleWishlist` is an **optimistic** mutation (`onMutate` writes the cache, `onError` rolls back, `onSettled` refetches); its toasts live in the hook because removing a row unmounts the component.
- **`ProductCard` layout:** it is a `div.relative` wrapping the `<Link>` card, with `WishlistButton` as a sibling positioned over it. Never put buttons inside the link.
- **Main bundle size:** the product page's reviews section (`components/reviews/ProductReviews.tsx`) is `React.lazy`-loaded to keep the main bundle under Vite's 500 kB warning.

### Payments (`payments` app, Razorpay test mode)
- **Git rule (for every feature):** work on a `feature/*` branch with a draft PR. Never merge into `main` (or commit/push to `main`) without the developer's explicit permission; the developer usually runs the merge themselves.
- **Gateway:** `payments/gateway.py` is the only code that talks to Razorpay (`create_razorpay_order`) or knows its signature formulas: HMAC-SHA256 with `hmac.compare_digest`; payment receipts sign `order_id|payment_id` with the key secret, and webhooks sign the **raw body** with the webhook secret. Tests mock `payments.gateway.create_razorpay_order` and sign with dummy secrets via `override_settings(**PAYMENT_SETTINGS)`; they never reach Razorpay.
- **Money:** amounts are integers in paise (`services.amount_in_paise`, exact via `Decimal`) and always come from the database, never from the browser. The currency is `SHOP_CURRENCY` (default INR; keep `VITE_CURRENCY` equal).
- **Starting a payment:** `start_payment(order)` requires a pending order of at least ₹1 and reuses a waiting (`created`/`failed`) `Payment` with the same amount.
- **Two confirmations, one effect:** `POST payments/verify/` (the browser forwards the Checkout receipt; `via='checkout'`) and `POST payments/webhook/` (`AllowAny`, `authentication_classes = []`; `payment.captured`/`order.paid` → paid, `payment.failed` → failed; `via='webhook'`) both call `services.mark_paid()`. It locks the `Payment`, is a no-op if already paid, refuses a mismatched amount, and only calls `orders.services.change_status(PAID)` (which queues the "Payment received" email) while the order is pending. Paid-but-cancelled is logged and shown as `needs_refund` in the admin.
- **Webhook dedup:** `WebhookEvent` (unique `x-razorpay-event-id`) is created in a savepoint inside the same transaction as the handling. A duplicate returns 200 "already handled"; a handling error rolls back the record so Razorpay's retry works.
- **Settings:** `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` / `RAZORPAY_WEBHOOK_SECRET` come from `backend/.env` (never print them); `PAYMENTS_ENABLED` is false without keys, and then start returns 503.
- **Frontend:** `lib/razorpay.ts` loads `checkout.js` once, on demand. `hooks/usePayment.ts` runs start → open window → verify. `components/orders/PayButton.tsx` is shown on `OrderDetailPage` for the owner's pending order. Checkout navigates to `/orders/:id?placed=1&pay=1`, which auto-opens the window once and strips `pay=1`.
- **Dev webhooks:** they arrive through a zrok tunnel (`zrok2 share public http://localhost:8000 -n public:shoplitesubin` → `https://shoplitesubin.shares.zrok.io/api/payments/webhook/`); that host must be in `DJANGO_ALLOWED_HOSTS`.

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
- `src/router.tsx`: Home, Products, ProductDetail and NotFound load eagerly; every other page is a lazy route. After a deploy, the old fingerprinted chunk files are gone; `lib/newVersion.ts` (installed in `main.tsx`) listens for Vite's `vite:preloadError` and reloads the page once. A 10-second sessionStorage guard prevents reload loops. This relies on `index.html` being served `no-cache` (done by `deploy.yml`). `RequireAuth` / `RequireAdmin` in `components/auth/RouteGuards.tsx` wrap route groups. Login/register redirects go through `safeNext()` (`lib/redirect.ts`) to prevent open redirects.
- UI is shadcn/ui (Radix) in `src/components/ui` (generated code) plus Tailwind 4 via `@tailwindcss/vite`; the `@/` alias points to `src/`.
- Frontend tests use Vitest + jsdom + Testing Library (and `userEvent`).
  - Mock the API module (`vi.mock('@/api/catalog', ...)`).
  - Render with `renderWithProviders(ui, { route, auth })` from `src/test/render.tsx`. It supplies Query, the router and an `AuthContext`, signed out by default; pass `auth: signedIn()` from `src/test/fixtures.ts` for a signed-in customer.
  - Anything that calls `useAuth()` needs this, because it throws without a provider.
  - Data builders: `makeProduct`, `makeUser`, `makeOrder`, `makeWishlistItem`, `makeSuggestion`, `page`.
  - The providers are passed as a `wrapper`, so `rerender()` keeps them.
  - Browser-only globals (`window.Razorpay`) are faked with a small class that records its options (see `PayButton.test.tsx`).

## Not built yet (future features)

### Live stock updates with WebSockets
- **Status:** postponed by the developer; nothing is implemented yet. Treat this as a design sketch, and build it only when asked.
- **Goal:** stock numbers (and "Out of stock") change on open product pages and cards instantly, without reloading, when someone buys, cancels, or staff edit a product.
- **Backend sketch:**
  - Django Channels with an ASGI server. Gunicorn would run `uvicorn` workers, or Daphne would be used; `config/asgi.py` routes `ws/` to a consumer.
  - A Redis channel layer; Valkey on AWS works the same.
  - One group per product (or one "stock" group).
  - Broadcast `{product_id, stock}` from `orders/services.place_order()` / `change_status()` (on cancel) and from product saves, via `transaction.on_commit` so only committed stock is sent.
  - Read-only for clients, with no authentication needed for public stock.
- **Frontend sketch:** one shared WebSocket connection (a hook such as `useLiveStock`) that reconnects with backoff. It updates the TanStack Query cache (`['product', slug]` and the matching entries in `['products', …]`) with `setQueryData` instead of refetching.
- **Deployment notes:**
  - ALB and CloudFront both support WebSockets. The `/ws/*` behaviour needs caching disabled and all viewer headers forwarded (the `Upgrade` / `Connection` handshake).
  - The web container must run the ASGI server.
  - Locally, `runserver` serves ASGI once `daphne` is in `INSTALLED_APPS`. The browser connects straight to `ws://localhost:8000/ws/` (derived from `VITE_API_URL`, as there's no Vite proxy), and on AWS to `wss://<cloudfront domain>/ws/`.
- **Tests:** Channels' `WebsocketCommunicator` for the consumer and the broadcast-on-commit; on the frontend, a fake WebSocket class like the fake `window.Razorpay` in `PayButton.test.tsx`.

## Conventions
- Code comments are plain-English explanations of *why* (this is a learning project); match that style.
- Commit messages must not contain `Co-Authored-By: Claude` or "Generated with Claude Code" lines.
- `backend/.env` holds real SMTP credentials: don't print its secret values.
- `learned.md`, `plan.md`, `IDEAS-NEXT.md` and `django-commands-so-far-used.md` are the developer's course notes, not documentation of the code.
