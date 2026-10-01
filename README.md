# ShopLite

[![CI](https://github.com/makaveli006/shoplite/actions/workflows/ci.yml/badge.svg)](https://github.com/makaveli006/shoplite/actions/workflows/ci.yml)

A small but realistic full-stack online store, built step by step to learn Django and React.
Customers browse products, fill a cart and check out; staff manage products, categories and orders.

## Features

- **Catalog**: categories and products with images, filters (category, price range), sorting and pagination
- **Smart search** (PostgreSQL full-text search): finds other forms of a word ("mugs" → Mug), ranks results by best match (name before category before description), forgives typos ("headphnes" → Headphones) with a "Did you mean …?" link, highlights the matching words, understands `"exact phrase"` and `-exclude`, and suggests products while you type
- **Accounts**: registration, login with JWT (short-lived access token, automatic silent refresh), profile page
- **Password reset by email**: one-time signed links that expire, with a rate limit against inbox flooding
- **Cart**: server-side cart per customer, with stock checks
- **Wishlist**: a heart on every product card and product page to save it for later, a "My wishlist" page with a count in the header (saved on your account; adding to the cart keeps it saved; products the shop hides later show as "no longer available")
- **Reviews and ratings**: 1–5 stars with an optional comment, only from customers whose order with the product was delivered (one review each, editable). Average stars on product cards and pages, a "Top rated" sort, and moderation (hide/show) in the Django admin
- **Checkout**: turns the cart into an order in one database transaction; stock is locked so two customers can't buy the last item at the same time
- **Online payments with Razorpay** (test mode): the payment window opens right after placing the order (card, UPI, netbanking). The order becomes paid by itself when Razorpay confirms it, through a signed receipt from the browser *and* a signed webhook from Razorpay's servers (works even if the customer closes the tab). Whichever arrives first counts, so the "Payment received" email goes out once
- **Orders**: status lifecycle (pending → paid → shipped → delivered, or cancelled), customers can cancel pending orders, cancelling returns the stock
- **HTML emails with product pictures**: order confirmation, payment received, shipped, delivered, cancelled, and password reset, each with a plain-text version. They are sent by a Celery worker, so the website never waits for the mail server
- **Admin area** in the React app (and the Django admin): product create/edit with image upload, categories, all orders with status changes
- **Permissions enforced by the API**, not only hidden in the UI: customers get `403` on every admin action
- **Tests**: Django tests for the API and the frontend tested with Vitest + React Testing Library, run on every push by GitHub Actions
- **Deployed to AWS** as a production-style exercise (ECS Fargate, RDS, ElastiCache, S3, CloudFront), with a CD pipeline that deploys after CI passes and a person approves. It was built by hand in the AWS Console, tested, then deleted to stop the costs; [`INTERVIEW-DEPLOYMENT.md`](INTERVIEW-DEPLOYMENT.md) explains every piece

## Tech stack

| Part | Tools |
|---|---|
| Backend | Python 3.12, Django 5.2 LTS, Django REST Framework, SimpleJWT, django-filter, django-cors-headers, Pillow |
| Database | PostgreSQL 16 |
| Background jobs | Celery 5 with Redis 7 as the message broker |
| Payments | Razorpay (Standard Checkout + webhooks, official `razorpay` Python package); zrok tunnel for webhooks in development |
| Frontend | React 19, TypeScript, Vite 8, React Router, TanStack Query, Axios |
| UI | Tailwind CSS 4, shadcn/ui (Radix UI), lucide icons, sonner toasts |
| Tooling | uv (Python packages), npm, Docker Compose, oxlint, coverage.py, Vitest |
| CI/CD | GitHub Actions (CI on every push; CD to AWS with OIDC sign-in and an approval step) |
| Production | Docker images (Gunicorn + WhiteNoise for the web, Celery for the worker), django-storages for S3 |
| AWS | VPC with a NAT gateway, ECS Fargate, Application Load Balancer, RDS PostgreSQL, ElastiCache (Valkey), S3, CloudFront, ECR, SSM Parameter Store, IAM, CloudWatch Logs |

## How it fits together

```
Browser (React app, Vite dev server :5173)
   │  HTTP + JSON, JWT in the Authorization header
   ▼
Django + DRF API (:8000)
   │                                  │ queues jobs after the database commit
   ▼                                  ▼
PostgreSQL 16 (Docker)            Redis 7 (Docker)
   ▲                                  │
   └──── Celery worker (Docker) ◄─────┘  sends the emails
```

## Project structure

```
shoplite/
├── docker-compose.yml       # PostgreSQL, Redis and the Celery worker
├── .github/workflows/
│   ├── ci.yml               # tests on every push
│   └── deploy.yml           # deployment to AWS after CI passes on main
├── deploy/aws/              # pieces pasted into the AWS Console: IAM policies, task definitions, CloudFront Function
├── infra/terraform/         # the same AWS setup as code (Terraform), plus bootstrap/ for the state bucket
├── INTERVIEW-DEPLOYMENT.md  # the AWS deployment explained (architecture, security, costs, problems, Q&A)
├── INTERVIEW-TERRAFORM.md   # the Terraform rebuild explained (state, secrets, pipeline split, drift, Q&A)
├── backend/                 # Django project (managed with uv)
│   ├── config/              # settings, URLs, Celery app
│   ├── accounts/            # custom user (email login), JWT, password reset
│   ├── catalog/             # categories, products, images, search and filters
│   ├── cart/                # cart and cart items
│   ├── orders/              # orders, checkout service, status changes, email tasks
│   ├── reviews/             # product reviews and ratings, who may review, moderation
│   ├── wishlist/            # saved-for-later products (the heart button)
│   ├── payments/            # Razorpay: start a payment, verify the receipt, webhook
│   └── core/                # shared permissions, pagination, filters, test helpers
├── frontend/                # React + TypeScript app (Vite)
│   └── src/
│       ├── api/             # typed functions that call the API
│       ├── hooks/           # TanStack Query hooks (products, cart, orders, admin)
│       ├── auth/            # login state, token refresh
│       ├── components/      # layout, product cards, dialogs, shadcn/ui components
│       └── pages/           # one file per page, admin pages in pages/admin/
└── tools/                   # PowerShell helpers for trying the API, a race-condition demo
```

## Getting started (Windows, PowerShell)

### Requirements

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (running)
- [uv](https://docs.astral.sh/uv/) — it installs Python 3.12 for you
- [Node.js](https://nodejs.org/) 20.19+ or 22.12+
- Git

### 1. Clone and create the settings files

```powershell
git clone https://github.com/makaveli006/shoplite.git
cd shoplite
Copy-Item .env.example .env
Copy-Item backend\.env.example backend\.env
Copy-Item frontend\.env.example frontend\.env
```

Open `.env` and `backend\.env` and fill them in: the database password must be the same in both,
and `DJANGO_SECRET_KEY` needs a new random value. You can generate one with:

```powershell
cd backend
uv run python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
cd ..
```

> PostgreSQL is published on port **5433** on Windows (not 5432), so it doesn't clash with a
> PostgreSQL installed directly on the PC. Change `POSTGRES_HOST_PORT` and `DB_PORT` together if needed.

### 2. Start PostgreSQL, Redis and the worker

```powershell
docker compose up -d --build
docker compose ps        # db and redis should be "healthy", worker "running"
```

### 3. Backend

```powershell
cd backend
uv sync                                     # creates .venv and installs the locked packages
uv run python manage.py migrate             # creates the tables (and switches on PostgreSQL's pg_trgm for search)
uv run python manage.py seed_catalog        # sample categories and products
uv run python manage.py createsuperuser     # a staff account for the admin area
uv run python manage.py runserver
```

- API: <http://127.0.0.1:8000/api/>
- Django admin: <http://127.0.0.1:8000/admin/>

### 4. Frontend (in a second terminal)

```powershell
cd frontend
npm install
npm run dev
```

Open <http://localhost:5173>. Sign in with the staff account to see the **Admin** link, or register a customer account.

### Emails

In development, emails are printed by the worker instead of being sent. Watch them with:

```powershell
docker compose logs -f worker
```

To send real emails, set the SMTP settings in `backend\.env` (see the comments in `backend\.env.example`),
then restart Django and the worker (`docker compose restart worker`).

To look at every email design in the browser without sending anything:

```powershell
cd backend
uv run python manage.py preview_emails            # uses the newest order; or --order 12
```

It saves the files in `backend/email-previews/` and prints a link to each one.

### Payments (Razorpay test mode)

Test mode moves no real money and needs no KYC or bank account. Without keys the shop still works;
"Pay now" just answers that online payment isn't set up.

1. In the [Razorpay Dashboard](https://dashboard.razorpay.com/), switch to **Test Mode** →
   **Account & Settings → API Keys → Generate Test Key**.
2. In `backend\.env` set `RAZORPAY_KEY_ID` (the `rzp_test_…` key) and `RAZORPAY_KEY_SECRET`, plus
   `SHOP_CURRENCY=INR`; in `frontend\.env` set `VITE_CURRENCY=INR`. Restart Django and Vite.
3. **Webhooks** need a public address, because Razorpay's servers can't reach `localhost`. In development,
   open a tunnel with [zrok](https://zrok.io) and keep it running:

   ```powershell
   zrok2 create name <yourname>                                    # once
   zrok2 share public http://localhost:8000 -n public:<yourname>   # each session
   ```

   Add the printed host (e.g. `<yourname>.shares.zrok.io`) to `DJANGO_ALLOWED_HOSTS`, make a secret with
   `uv run python -c "import secrets; print(secrets.token_urlsafe(32))"` and put it in `RAZORPAY_WEBHOOK_SECRET`.
4. In the Dashboard (Test mode) → **Webhooks → Add New Webhook**: URL `https://<your host>/api/payments/webhook/`,
   the same secret, events `payment.captured`, `payment.failed`, `order.paid`.

Pay with a [test card](https://razorpay.com/docs/payments/payments/test-card-upi-details/), e.g. Visa
`4100 2800 0000 1007`, any future expiry and CVV; an OTP of 4–10 digits succeeds, fewer than 4 fails.
The Django admin's **Payments** page shows each attempt and whether the browser receipt or the webhook confirmed it;
**Webhook events** lists what Razorpay delivered.

In production there's no tunnel: use live keys and add a live-mode webhook for the real domain.

## Running the tests

```powershell
# Backend (needs the database container running)
cd backend
uv run python manage.py test
uv run coverage run manage.py test; uv run coverage report   # with coverage

# Frontend
cd frontend
npm test          # run once
npm run lint
npm run build     # type check + production build
```

GitHub Actions runs all of these on every push to `main` and on pull requests (see the next section).

## CI/CD

- **CI (Continuous Integration)** = check that the code is good, automatically, on every push.
- **CD (Continuous Deployment)** = take the code that passed CI and put it on the real server, automatically.

### CI: set up ✅

Defined in [`.github/workflows/ci.yml`](.github/workflows/ci.yml). It runs on every push to `main` and on every pull request:

```
git push
   ↓
GitHub starts two temporary Ubuntu machines, at the same time
   ↓                                          ↓
Backend machine                            Frontend machine
  start PostgreSQL 16                        install Node.js 22
  install Python 3.12 + locked packages      install locked packages (npm ci)
    (uv sync --locked)                       lint (oxlint)
  Django system check                        tests (Vitest)
  every model change has a migration?        type check + production build
  tests + coverage report
   ↓                                          ↓
both pass → green ✅ next to the commit on GitHub
anything fails → red ❌ and an email saying which step failed
   ↓
the temporary machines are deleted
```

A failed CI run doesn't undo or block the push: the code is already on GitHub. It warns you
that something is broken, so you fix it and push again.

### CD: set up for AWS ✅ (switched off while the AWS resources are deleted)

Defined in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). It starts by itself when CI
finishes on `main` (GitHub's `workflow_run` trigger), and does nothing unless CI passed:

```
git push to main
   ↓
CI runs (backend tests, frontend tests + build)
   ↓
CI passes ✅   (if CI fails, nothing is deployed)
   ↓
Deploy workflow starts, then waits: a person must click "Approve" on the "production" environment
   ↓
GitHub Actions signs in to AWS with a short-lived OIDC token (no AWS keys stored in GitHub)
   ↓
build two Docker images (web = Gunicorn + Django, worker = Celery),
tag them with the commit id, push them to Amazon ECR
   ↓
run the database migrations once, as a one-off container
(if they fail, the deploy stops here and the old version keeps running)
   ↓
rolling update of the web and worker services on ECS Fargate:
new containers start, must pass the /healthz/ check, then the old ones stop → no downtime
(if the new containers keep failing, ECS rolls back by itself)
   ↓
frontend:
  npm ci, npm run build (VITE_API_URL=/api)
  upload the files to the S3 bucket
  tell CloudFront to fetch the new index.html
   ↓
deployment complete ✅, the new version is live
```

It only runs while the repository variable `DEPLOY_ENABLED` is `true`. After the AWS resources were
deleted, that variable was removed too, so pushes don't try to deploy to nothing.

#### Where the production credentials are stored

They are split between two places, and neither of them is the code in this repository:

| Where | What is stored there | Why there |
|---|---|---|
| **GitHub** (repo → Settings → Environments → `production`) | only the *address* of an AWS role (`AWS_ROLE_ARN`, saved as a secret so it's hidden in the public logs) plus non-secret names: cluster, services, bucket, subnets | GitHub needs no password for AWS: AWS trusts GitHub's short-lived OIDC token, but only for this repository and only for the `production` environment, which needs a person's approval |
| **In AWS, in SSM Parameter Store** (encrypted `SecureString` values under `/shoplite/`) | the app's own secrets: `DJANGO_SECRET_KEY`, the database password, the Razorpay secrets | ECS reads them when a container starts and hands them to Django as environment variables. They never pass through GitHub, so a leaked GitHub account or workflow log can't expose them |

The non-secret settings (`DJANGO_ALLOWED_HOSTS`, the database address, the bucket name, …) are plain
environment variables in the ECS task definitions; templates are in `deploy/aws/task-definitions/`.
`VITE_API_URL` is not a secret (every visitor's browser can see it), so the workflow sets it while building.

## API overview

All addresses start with `/api/`. Send the access token as `Authorization: Bearer <token>`.

| Endpoint | Who | What it does |
|---|---|---|
| `POST auth/register/` | anyone | create a customer account |
| `POST auth/token/`, `POST auth/token/refresh/` | anyone | log in with email + password, renew the access token |
| `GET/PATCH auth/me/` | signed in | your profile |
| `POST auth/password-reset/`, `POST auth/password-reset/confirm/` | anyone | email a reset link, set the new password |
| `GET categories/`, `GET categories/{slug}/` | anyone | categories with product counts |
| `POST/PATCH/DELETE categories/…` | staff | manage categories |
| `GET products/?search=&category=&min_price=&max_price=&ordering=&page=` | anyone | product list (12 per page) with `average_rating` and `review_count`; `ordering=-rating` = top rated. With `search` (full-text, typo-tolerant, `"phrase"` and `-word` allowed) the default order is `-relevance` (best match), each product gets a `search_snippet`, and the answer adds `did_you_mean` |
| `GET products/suggest/?q=` | anyone | up to 6 products for the search box while typing (2+ characters, typo-tolerant) |
| `GET products/{slug}/` | anyone | one product |
| `POST/PATCH/DELETE products/…` | staff | manage products (multipart for images) |
| `GET products/{slug}/reviews/` | anyone | the product's reviews (5 per page, newest first) |
| `POST products/{slug}/reviews/` | signed in, order delivered | write a review (`rating` 1–5, optional `comment`) |
| `GET/PATCH/DELETE products/{slug}/reviews/me/` | signed in | may I review (`can_review`), and my own review: read, change, delete |
| `GET cart/`, `POST cart/items/`, `PATCH/DELETE cart/items/{id}/` | signed in | the cart |
| `GET wishlist/`, `POST wishlist/` (`{"product_id": 7}`) | signed in | my saved products (newest first); save one (201, or 200 if already saved) |
| `DELETE wishlist/{product_id}/` | signed in | take a product off my wishlist (204, also if it wasn't there) |
| `POST payments/start/` (`{"order_id": 15}`) | order owner | open a Razorpay payment for a pending order; returns what the payment window needs (public key, Razorpay order id, amount in paise) |
| `POST payments/verify/` | order owner | the payment window's signed receipt; a genuine one marks the order paid |
| `POST payments/webhook/` | Razorpay's servers | signed payment events (`payment.captured`, `order.paid`, `payment.failed`); repeated deliveries are skipped |
| `POST orders/checkout/` | signed in | turn the cart into an order |
| `GET orders/`, `GET orders/{id}/` | signed in | your orders (staff: all orders) |
| `POST orders/{id}/cancel/` | order owner | cancel a pending order |
| `PATCH orders/{id}/status/` | staff | change an order's status (only allowed next steps) |

Every endpoint can also be explored in the browser (DRF's browsable API): open an address such as <http://127.0.0.1:8000/api/products/>.

## Production notes

Setting `DJANGO_DEBUG=False` switches on HTTPS redirects, secure cookies and HSTS. Before deploying:
use a new secret key and strong passwords, set `DJANGO_ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`,
`DJANGO_CSRF_TRUSTED_ORIGINS` and `VITE_API_URL` to the real domains, and run
`uv run python manage.py check --deploy`.

**Production images.** `backend/Dockerfile` builds two images from the same code:

```powershell
cd backend
docker build --target web -t shoplite-web .        # Django behind Gunicorn; static files collected, served by WhiteNoise
docker build --target worker -t shoplite-worker .  # the Celery worker (also what docker-compose.yml runs)
```

Everything cloud-specific is switched on by environment variables only, so the same code runs on a
laptop and on a server (see the "On AWS" block in `backend\.env.example`):
uploads go to Amazon S3 when `AWS_STORAGE_BUCKET_NAME` is set, the load balancer's health check is
answered at `/healthz/`, logs go to the container output, `DB_SSLMODE=require` encrypts the
database connection, and `DJANGO_ADMIN_URL` moves the Django admin (on AWS it is `/django-admin/`,
because the React app's own staff pages use `/admin` on the same address).

**Deployment to AWS.** CloudFront is the one HTTPS address: it serves the React app from S3 and sends
`/api/*`, `/django-admin/*` and `/static/*` to a load balancer in front of the ECS Fargate containers.
The database (RDS PostgreSQL) and the Celery queue (ElastiCache) have no public address. The CD pipeline
is described in the [CI/CD](#cicd) section. `deploy/aws/` holds the pieces pasted into the AWS Console:
IAM policies, task-definition templates (with `<PLACEHOLDERS>`; filled copies are named `*.local.json`
and git-ignored) and the CloudFront Function for React page addresses.

The full walkthrough is in [`INTERVIEW-DEPLOYMENT.md`](INTERVIEW-DEPLOYMENT.md): the architecture,
networking, security, costs (about ₹16 an hour while running), the problems found on the way and how
they were fixed, the teardown, and interview questions.

### The same setup with Terraform (`infra/terraform/`)

The console build was rebuilt as code. Terraform reads the `.tf` files, creates everything in the
right order, remembers what it made (its *state*, kept in an S3 bucket created by `bootstrap/`), and
deletes all of it again with one command.

```powershell
cd infra\terraform
terraform init "-backend-config=backend.hcl"   # quotes needed: PowerShell splits the argument at the dot
terraform plan                                  # preview only: what would be created / changed / deleted
terraform apply                                 # do it (type yes)
terraform destroy                               # delete everything Terraform created (type yes)
```

Real values (account number, emails) go in `terraform.tfvars` and `backend.hcl`, both git-ignored;
the `.example` files show the shape. Passwords are generated during the run or typed into hidden
prompts, and are never saved in the state file.

It was applied (about 80 resources in about 20 minutes), deployed to by the CI/CD pipeline, tested
end to end, and destroyed again. [`INTERVIEW-TERRAFORM.md`](INTERVIEW-TERRAFORM.md) explains the code,
the state and locking, how secrets stay out of the state, how Terraform and the pipeline share ECS,
the real run step by step, and interview questions.

#### Drift: when AWS and the code disagree

*Drift* is a change made by hand in the AWS Console that the code doesn't know about. `terraform plan`
compares the real resources with the code, lists every difference, and `terraform apply` puts the
code's version back. The code is the source of truth.

Try it: change the retention of the log group `/ecs/shoplite-web` from 1 day to 3 days in the
CloudWatch console, then run `terraform plan`:

```
~ resource "aws_cloudwatch_log_group" "app" {
    ~ retention_in_days = 3 -> 1
Plan: 0 to add, 1 to change, 0 to destroy.
```

`terraform apply` sets it back to 1 day. Scaling the web service to 2 containers in the ECS console
works the same way (`desired_count = 2 -> 1`).

Two things that are **not** reported as drift, on purpose or by design:

- **New app versions from the deploy pipeline.** Every deploy registers a new ECS task-definition
  revision with the new image. The services have `lifecycle { ignore_changes = [task_definition] }`,
  so `terraform plan` stays quiet and never rolls the shop back to an older image. Terraform owns the
  infrastructure; the pipeline owns which version of the app runs on it.
- **Things added beside Terraform's resources.** An extra inbound rule added by hand to a security
  group shows *nothing* in the plan, because Terraform only checks what is in its state, and that rule
  never was. Teams catch those with AWS Config rules, or by making all changes go through code.
