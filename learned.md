# ShopLite — Full-Stack E-Commerce Learning Notes

> These notes are a cleaned and reorganized version of the learning log for ShopLite.
>
> The goal is not only to remember **what was built**, but also to remember **why each technology, setting, command, and design decision exists**.
>
> Repeated transcript sections have been removed, while the important concepts, implementation decisions, testing lessons, security lessons, deployment work, and useful commands are kept.

---

# 1. What ShopLite Became

ShopLite started as a Django learning project and gradually became a fairly complete full-stack e-commerce application.

The main technologies used were:

- **Frontend:** React 19, TypeScript, Vite 8
- **Styling:** Tailwind CSS 4
- **UI components:** shadcn/ui with Radix UI
- **Frontend routing:** React Router
- **HTTP client:** Axios
- **Frontend server-state/cache:** TanStack Query
- **Backend:** Django
- **API:** Django REST Framework
- **Authentication:** JWT using SimpleJWT
- **Database:** PostgreSQL 16
- **Background jobs:** Celery
- **Message broker:** Redis
- **Local containers:** Docker / Docker Compose
- **Python dependency management:** uv
- **Frontend dependency management:** npm
- **Version control:** Git + GitHub
- **CI:** GitHub Actions
- **Payments extension:** Razorpay test mode
- **Cloud deployment:** AWS
- **Production backend server:** Gunicorn
- **Static files in production:** WhiteNoise
- **Cloud media storage:** Amazon S3
- **Container registry:** Amazon ECR
- **Container runtime:** Amazon ECS Fargate
- **Managed PostgreSQL:** Amazon RDS
- **Managed Redis:** Amazon ElastiCache
- **Edge/HTTPS/frontend delivery:** Amazon CloudFront
- **Secrets in AWS:** SSM Parameter Store
- **Production logs:** CloudWatch
- **GitHub-to-AWS authentication:** OpenID Connect (OIDC)

---

# 2. Main Architecture

This is the one main architecture diagram to remember.

```text
                                   ┌───────────────────────────────┐
                                   │        GitHub Actions         │
                                   │ CI tests + deployment         │
                                   └───────────────┬───────────────┘
                                                   │
                                             OIDC / AWS IAM
                                                   │
                                                   ▼
                                              Amazon ECR
                                            container images


Customer Browser
React + TypeScript
       │
       │ HTTPS
       ▼
Amazon CloudFront
       │
       ├── React frontend files ────────────── Amazon S3
       │
       ├── Product images ─────────────────── Amazon S3
       │
       └── API / Admin requests
                     │
                     ▼
         Application Load Balancer
                     │
                     ▼
           ECS Fargate Web Task
          Gunicorn + Django + DRF
                     │
              ┌──────┴─────────┐
              │                │
              ▼                ▼
        Amazon RDS        ElastiCache Redis
        PostgreSQL              │
                                │ Celery queue
                                ▼
                       ECS Fargate Worker
                              Celery
                                │
                                ▼
                         Background email
```

The most important architectural rule is:

**The frontend provides the user experience, but the backend enforces the real rules.**

For example, hiding an **Edit Product** button in React does not stop someone from manually calling the API. Django permissions must reject the request.

---

# 3. Web Fundamentals

## Client and server

The **client** is the browser running the React application.

The **server** is the Django application listening for network requests.

During development they may both run on the same computer, but they are still separate programs.

For example:

- React development server: `http://localhost:5173`
- Django development server: `http://127.0.0.1:8000`

They communicate using HTTP.

---

## HTTP

HTTP is a request/response protocol.

A request normally contains:

- a method
- a URL
- headers
- optionally a body

Common methods:

- `GET` — read something
- `POST` — create something or perform an action
- `PUT` — replace a complete resource
- `PATCH` — partially update a resource
- `DELETE` — delete something

Example request:

```http
POST /api/products/
Content-Type: application/json
Authorization: Bearer <token>
```

Example body:

```json
{
  "name": "Laptop",
  "price": "50000.00"
}
```

The server responds with:

- status code
- headers
- response body

Important status codes used throughout ShopLite:

- `200 OK` — successful request
- `201 Created` — new resource created
- `204 No Content` — successful request with no response body
- `400 Bad Request` — invalid input
- `401 Unauthorized` — authentication is missing or invalid
- `403 Forbidden` — user is authenticated but not allowed
- `404 Not Found` — resource is unavailable
- `405 Method Not Allowed` — HTTP method not supported
- `409 Conflict` — operation conflicts with the current resource state
- `415 Unsupported Media Type` — body format is unsupported
- `429 Too Many Requests` — rate limit reached
- `500 Internal Server Error` — unexpected server-side failure
- `502 Bad Gateway` — upstream service failed
- `503 Service Unavailable` — required service unavailable

A useful debugging rule:

**When an HTTP request fails, inspect the status code first.**

---

# 4. JSON

JSON is the main data format exchanged between React and Django.

Example:

```json
{
  "id": 7,
  "name": "Blue Ceramic Mug",
  "price": "12.50",
  "stock": 20,
  "category": {
    "id": 2,
    "name": "Kitchen",
    "slug": "kitchen"
  }
}
```

Django REST Framework serializers convert Django objects into JSON-friendly data.

Axios receives JSON responses in React.

TypeScript types describe what those objects should look like so mistakes can be caught while writing frontend code.

---

# 5. REST API

REST exposes resources through URLs.

For example:

```text
GET    /api/products/
GET    /api/products/chef-knife/
POST   /api/products/
PATCH  /api/products/chef-knife/
DELETE /api/products/chef-knife/
```

CRUD means:

- **Create**
- **Read**
- **Update**
- **Delete**

The React frontend does not need to know how Django stores the data internally.

It only needs to understand the API contract.

---

# 6. Full-Stack Responsibility

The project has three major layers.

## Frontend

React is responsible for things such as:

- rendering pages
- buttons
- forms
- navigation
- loading states
- error messages
- calling APIs
- caching responses
- showing different controls to customers and admins

## Backend

Django is responsible for:

- authentication
- permissions
- business rules
- validation
- stock checks
- checkout
- order status rules
- database operations
- background task creation

## Database

PostgreSQL permanently stores:

- users
- categories
- products
- carts
- cart items
- orders
- order items
- reviews
- wishlist entries
- payment records

The database also provides the last line of protection through constraints.

---

# 7. Git

Git is the version-control system for the project.

Three important areas exist:

- **Working directory:** files currently on disk
- **Staging area:** files selected with `git add`
- **Repository:** committed snapshots

Typical workflow:

```powershell
git status
git add .
git commit -m "Describe the change"
git push
```

A commit is a permanent snapshot with:

- author
- date
- message
- parent commit
- changed content

---

## `.gitignore`

Generated files, secrets, dependencies, and runtime files should not enter Git.

Examples:

```gitignore
.env
.venv/
node_modules/
dist/
backend/media/
backend/staticfiles/
*.sqlite3
```

Commit the recipe, not generated results.

For Python that means committing:

```text
pyproject.toml
uv.lock
```

For Node:

```text
package.json
package-lock.json
```

Do not commit:

```text
.venv/
node_modules/
```

---

## `.gitattributes` and line endings

Windows normally uses `CRLF`.

Linux normally uses `LF`.

This matters because Docker containers run Linux.

Shell scripts or Docker-related files with incorrect line endings can produce errors such as:

```text
/bin/sh^M: bad interpreter
```

The project used `.gitattributes` so files that must remain Linux-compatible use LF.

Warnings such as:

```text
LF will be replaced by CRLF
```

are usually Git informing you about line-ending conversion, not code failure.

---

# 8. Docker and Docker Compose

Docker allowed PostgreSQL and Redis to run without installing those exact versions directly into Windows.

## Image

An image is a read-only template.

Examples:

```text
postgres:16
redis
```

## Container

A container is a running instance of an image.

Deleting a container normally deletes its writable container layer.

That is why persistent database data needs a volume.

---

## Docker volume

PostgreSQL used a named volume.

The volume exists independently from the database container.

Therefore:

```powershell
docker compose down
docker compose up -d
```

does not remove PostgreSQL data.

But:

```powershell
docker compose down -v
```

also removes volumes.

That command can destroy the database data and should only be used intentionally.

---

## Port mapping

PostgreSQL listens inside the container on:

```text
5432
```

It was exposed to Windows as:

```text
localhost:5433
```

The mapping is:

```text
5433:5432
```

The left side is the host port.

The right side is the container port.

Therefore Django running on Windows connects to:

```text
localhost:5433
```

A Docker container connecting to the database uses:

```text
db:5432
```

because containers in the Compose network can find each other by service name.

---

## Docker health checks

Starting a process does not always mean the service is ready.

PostgreSQL used:

```text
pg_isready
```

Redis used:

```text
redis-cli ping
```

A healthy Redis response is:

```text
PONG
```

Useful commands:

```powershell
docker compose up -d
docker compose ps
docker compose logs db
docker compose exec redis redis-cli ping
docker volume ls
```

---

# 9. PostgreSQL

PostgreSQL was chosen instead of SQLite because this shop needs a real multi-user database.

Important PostgreSQL advantages used in the project:

- proper concurrency
- row-level locking
- database constraints
- transactions
- reliable relational integrity
- production-like development environment

SQLite is useful for smaller applications, but checkout concurrency is much better demonstrated using PostgreSQL.

---

## Basic relational database concepts

A database contains tables.

A table contains rows.

A row represents one object.

Columns store individual fields.

A primary key uniquely identifies each row.

A foreign key references another table.

For example, the product table contains:

```text
category_id
```

which points at:

```text
catalog_category.id
```

---

## Useful `psql` commands

Open PostgreSQL inside Docker:

```powershell
docker compose exec db psql -U shoplite -d shoplite
```

Inside `psql`:

```text
\l
\du
\dt
\conninfo
\d catalog_product
```

Exit:

```text
\q
```

Useful SQL:

```sql
SELECT version();
SELECT * FROM catalog_product;
```

---

# 10. Database Errors Worth Recognising

## Connection refused

Usually means:

- server is down
- wrong host
- wrong port

First check:

```powershell
docker compose ps
```

## Password authentication failed

Something answered the connection, but rejected the login.

Possible causes:

- wrong database password
- wrong PostgreSQL server
- wrong port

## Database does not exist

The server and user may be correct, but `DB_NAME` is wrong.

---

# 11. `uv` and Python Dependency Management

`uv` manages the Python side of the project.

It handles:

- Python versions
- virtual environments
- dependencies
- `pyproject.toml`
- `uv.lock`
- reproducible installs

The project used Python 3.12.

---

## Virtual environment

A virtual environment keeps one project's Python dependencies isolated from other projects.

It lives in:

```text
backend/.venv/
```

Traditional use:

```powershell
.venv\Scripts\Activate.ps1
python manage.py ...
deactivate
```

The project normally used:

```powershell
uv run python manage.py ...
```

This avoids forgetting to activate the correct environment.

---

## `pyproject.toml`

This describes direct project dependencies.

Example idea:

```toml
django==5.1.7
djangorestframework
psycopg[binary]
python-dotenv
```

---

## `uv.lock`

`uv.lock` records the exact resolved dependency graph.

That includes:

- exact versions
- transitive dependencies
- package hashes

It should be committed.

Never edit `uv.lock` manually.

---

## Important commands

```powershell
uv venv
uv add package-name
uv add --dev package-name
uv sync
uv tree
uv run python --version
uv run python manage.py check
```

---

# 12. Django Project Structure

The backend contains a Django project and multiple Django apps.

Main configuration:

```text
backend/
├── manage.py
├── config/
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
├── accounts/
├── catalog/
├── cart/
├── orders/
└── core/
```

The project-level `config/` package contains global configuration.

Individual apps contain one area of responsibility.

Examples:

- `accounts` — users and authentication
- `catalog` — products and categories
- `cart` — shopping carts
- `orders` — checkout and order history

---

# 13. Django Request Handling

Django receives an HTTP request, applies middleware, matches a URL, runs a view, optionally accesses the database, and produces an HTTP response.

Important parts:

## `manage.py`

Sets:

```python
DJANGO_SETTINGS_MODULE = "config.settings"
```

and starts Django management commands.

Examples:

```powershell
uv run python manage.py runserver
uv run python manage.py migrate
uv run python manage.py shell
uv run python manage.py test
```

## `settings.py`

Contains configuration such as:

- installed apps
- middleware
- database
- authentication
- secret key
- allowed hosts
- timezone
- static/media configuration
- Django REST Framework settings

## `urls.py`

Determines which view handles each URL.

---

# 14. Environment Variables

Sensitive and environment-specific configuration was removed from source code.

The backend uses:

```text
backend/.env
```

The real file is ignored by Git.

A safe template is committed:

```text
backend/.env.example
```

`python-dotenv` loads the `.env` file.

Important behavior:

**Real operating-system environment variables override `.env` values.**

That became useful later because:

- Django on Windows used `DB_HOST=localhost`
- Docker Celery worker used `DB_HOST=db`
- AWS containers later used completely different values

The code did not need to change.

---

## Fail-fast configuration

A critical setting such as the Django secret key should fail immediately if missing.

Example:

```python
SECRET_KEY = os.environ["DJANGO_SECRET_KEY"]
```

This raises an error if the value is absent.

For values with safe defaults:

```python
DEBUG = env_bool("DJANGO_DEBUG", False)
```

One important Python trap:

```python
bool("False")
```

is `True`.

Environment variables are strings, so boolean settings need explicit parsing.

---

# 15. Important Django Security Settings

## `SECRET_KEY`

Used for cryptographic signing.

It must never be committed.

## `DEBUG`

Development:

```text
True
```

Production:

```text
False
```

`DEBUG=True` can expose:

- tracebacks
- source code
- settings
- local variables

## `ALLOWED_HOSTS`

Controls which host names Django accepts.

Example development values:

```text
localhost
127.0.0.1
```

Production later used the CloudFront host.

---

# 16. Connecting Django to PostgreSQL

Django's database settings used:

```python
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.environ["DB_NAME"],
        "USER": os.environ["DB_USER"],
        "PASSWORD": os.environ["DB_PASSWORD"],
        "HOST": os.getenv("DB_HOST", "localhost"),
        "PORT": os.getenv("DB_PORT", "5432"),
    }
}
```

Locally, the `.env` supplied port `5433`.

Three important layers exist:

## ORM

Python code such as:

```python
Product.objects.filter(price__lt=20)
```

## Django database backend

Translates the ORM expression into PostgreSQL-flavoured SQL.

## Psycopg

Opens the actual network connection and sends SQL to PostgreSQL.

Changing the database configuration normally does not change model/query code.

---

# 17. Custom User Model

A custom user model was created before the first migration.

This was important because changing Django's user model after database tables already depend on it is difficult.

The model extends:

```python
AbstractUser
```

and changes email into the login identifier.

Important configuration:

```python
USERNAME_FIELD = "email"
REQUIRED_FIELDS = ["username"]
```

The email is unique.

Everything that refers to the user uses:

```python
settings.AUTH_USER_MODEL
```

or:

```python
get_user_model()
```

instead of importing Django's default `User` directly.

---

# 18. Password Hashing

Passwords are never stored as readable text.

Django stores a password hash.

The stored value looks conceptually like:

```text
algorithm$iterations$salt$hash
```

Django methods include:

```python
user.set_password(...)
user.check_password(...)
```

Registration must use:

```python
User.objects.create_user(...)
```

not:

```python
User.objects.create(...)
```

because `create_user()` hashes the password correctly.

---

# 19. Django Migrations

Models are Python definitions.

Migrations record database schema changes.

Two commands have different responsibilities.

## Create migrations

```powershell
uv run python manage.py makemigrations
```

This compares model definitions against migration history and creates migration files.

## Apply migrations

```powershell
uv run python manage.py migrate
```

This executes the required database changes.

Migration files must be committed.

PostgreSQL tracks executed migrations in:

```text
django_migrations
```

Useful commands:

```powershell
uv run python manage.py showmigrations
uv run python manage.py sqlmigrate accounts 0001
uv run python manage.py makemigrations --check --dry-run
```

The final command is especially useful in CI because it catches:

> “I changed a model but forgot to create the migration.”

---

# 20. Catalog Data Model

## Category

Important fields:

- name
- slug
- description
- created timestamp
- updated timestamp

## Product

Important fields:

- category
- name
- slug
- description
- price
- stock
- image
- active/hidden status
- timestamps

---

# 21. Choosing Correct Field Types

## Money

Prices use:

```python
DecimalField
```

not:

```python
FloatField
```

A float can produce:

```python
0.1 + 0.2
# 0.30000000000000004
```

`Decimal` is appropriate for financial values.

Create decimals from strings:

```python
Decimal("19.99")
```

not:

```python
Decimal(19.99)
```

---

## Stock

Stock uses:

```python
PositiveIntegerField
```

and PostgreSQL also receives a non-negative database check.

---

## Slugs

A slug is a URL-friendly identifier.

Example:

```text
Blue Ceramic Mug
```

becomes:

```text
blue-ceramic-mug
```

This allows readable URLs such as:

```text
/products/blue-ceramic-mug
```

The model generates a slug automatically when one is not supplied.

---

# 22. Model Relationships and `on_delete`

A product belongs to a category.

That is represented with:

```python
ForeignKey
```

Conceptually:

- one category
- many products

Important deletion behaviors:

## `PROTECT`

Used for Product to Category.

A category cannot be deleted while products still reference it.

## `CASCADE`

Used where deleting the parent should also delete its child records.

Example:

Cart to CartItems.

## `SET_NULL`

Useful when historical records must survive.

OrderItem keeps the copied product information even if the original Product is later deleted.

---

# 23. Validation at Two Levels

ShopLite deliberately used both Python validation and database constraints.

## Python validator

Provides friendly errors.

Example:

```text
Price must be at least 0.01
```

## Database constraint

Protects the database even if Django validation is bypassed.

Examples:

- price must be positive
- stock cannot be negative
- foreign key must point to a valid category
- email must be unique

A good design uses both.

---

# 24. Django Admin

The Django admin became the first back-office interface.

`ModelAdmin` controls things such as:

- columns
- filters
- search
- editable fields
- autocomplete
- read-only fields
- bulk actions

Useful options included:

```python
list_display
list_filter
search_fields
list_editable
prepopulated_fields
autocomplete_fields
readonly_fields
actions
```

The admin also keeps an audit history in:

```text
django_admin_log
```

---

# 25. Avoiding N+1 Queries

Suppose 21 products are loaded and the code accesses each product's category.

Without optimisation this can produce:

```text
1 query for products
21 additional queries for categories
```

That is the **N+1 query problem**.

The fix used:

```python
select_related("category")
```

This fetches the related category in the same SQL query.

The experiment showed:

```text
without select_related: 22 queries
with select_related:     1 query
```

This became important later when the API nested category information inside product JSON.

---

# 26. Product Images

Products use:

```python
ImageField
```

Pillow verifies that uploaded files are real images.

The system does not trust only the file extension.

For example, renaming a text file to:

```text
fake.jpg
```

does not make it a valid image.

---

## Where images live

The database does not store the actual image bytes.

The database stores a path such as:

```text
products/2026/09/mug.jpg
```

Development files are stored under:

```text
backend/media/
```

In production the project later changed this to S3 storage because container disks are temporary.

---

# 27. Static Files vs Media Files vs React Build

These are three different concepts.

## Django static files

Examples:

- Django admin CSS
- Django admin JavaScript
- DRF browsable API assets

Production collection:

```powershell
uv run python manage.py collectstatic --noinput
```

Destination:

```text
backend/staticfiles/
```

## Media

Uploaded runtime data such as:

- product photos

Development location:

```text
backend/media/
```

Production location later became S3.

## React production build

Created using:

```powershell
npm run build
```

Output:

```text
frontend/dist/
```

These are the customer-facing React files.

---

# 28. Django ORM

ORM means **Object-Relational Mapper**.

Example:

```python
Product.objects.filter(price__lt=20)
```

instead of manually writing SQL.

---

## Manager

```python
Product.objects
```

is the model's manager.

---

## QuerySet

Methods such as:

```python
.all()
.filter()
.exclude()
.order_by()
```

produce QuerySets.

QuerySets are lazy.

The database query usually runs only when the results are actually needed.

---

## Immediate database operations

Methods such as these normally access the database immediately:

```python
.get()
.count()
.exists()
.first()
.create()
.update()
.delete()
.aggregate()
```

---

## Relationship lookups

Double underscores allow traversing relationships:

```python
Product.objects.filter(category__slug="kitchen")
```

---

## `F()` expressions

Instead of loading stock into Python and then updating it:

```python
product.stock = product.stock + 10
product.save()
```

the database can update its own current value:

```python
Product.objects.filter(...).update(
    stock=F("stock") + 10
)
```

The calculation happens inside PostgreSQL.

If a Python object was already loaded, it does not magically update after a bulk query.

Use:

```python
product.refresh_from_db()
```

to reload it.

---

# 29. Management Commands and Seeding

A custom Django management command created demo catalog data.

Django discovers commands under:

```text
app/
└── management/
    └── commands/
        └── command_name.py
```

The catalog command used:

```text
seed_catalog
```

Run it with:

```powershell
uv run python manage.py seed_catalog
```

The seeding was designed to be idempotent.

Running it again does not duplicate the products.

It used:

```python
update_or_create(...)
```

so existing products were updated and missing products were created.

---

# 30. Django REST Framework

Django REST Framework added API-specific tools:

- serializers
- API request parsing
- API responses
- generic views
- ViewSets
- routers
- authentication
- permissions
- pagination
- filtering
- search
- browsable API

---

# 31. Serializers

A serializer performs two major jobs.

For output:

```text
Django model object becomes JSON-friendly data.
```

For input:

```text
JSON becomes validated Python data.
```

`ModelSerializer` reads information from the model and automatically creates many validation rules.

The project explicitly listed serializer fields instead of using:

```python
fields = "__all__"
```

This prevents a future sensitive model field from accidentally appearing in the API.

---

# 32. Nested Category Output

Originally product JSON contained:

```json
{
  "category": 2
}
```

That forced the frontend to perform another lookup.

The improved output became:

```json
{
  "category": {
    "id": 2,
    "name": "Kitchen",
    "slug": "kitchen"
  }
}
```

For writing, the client could still send:

```json
{
  "category_id": 2
}
```

This used a `PrimaryKeyRelatedField`.

It is a common REST pattern:

- detailed nested representation for reads
- simple foreign-key ID for writes

---

# 33. Computed Serializer Fields

`in_stock` was not stored in PostgreSQL.

It was computed:

```python
return obj.stock > 0
```

using a `SerializerMethodField`.

Computed API fields are useful when the frontend needs a convenient value derived from database data.

---

# 34. Serializer Validation

Validation happens before saving.

Different layers include:

- field type validation
- model validators
- `validate_<field>()`
- object-level `validate()`

An important custom rule generated a slug before saving so a duplicate slug could produce:

```text
400 Bad Request
```

rather than reaching PostgreSQL and causing an unexpected `500`.

A useful API principle:

**Anything the client can reasonably get wrong should return a useful 4xx error, not a 500.**

---

# 35. ViewSets

The API moved from separate read-only views to:

```python
ModelViewSet
```

A ModelViewSet provides standard actions:

- list
- create
- retrieve
- update
- partial update
- destroy

`PATCH` became the common update method because the frontend normally changes only a few fields.

---

# 36. Routers

A DRF router automatically creates the standard URLs for a ViewSet.

Example:

```python
router.register("products", ProductViewSet)
```

This reduces repetitive URL configuration and keeps API routing consistent.

---

# 37. Authentication vs Authorization

These are different questions.

## Authentication

**Who are you?**

Examples:

- session
- JWT

## Authorization

**What are you allowed to do?**

For catalog resources:

- everyone can read public products
- only staff can create/update/delete

The custom permission was effectively:

```python
if request.method in SAFE_METHODS:
    return True

return request.user.is_staff
```

The API remains the real security layer.

---

# 38. Hidden Products

Customers only receive products where:

```text
is_active = true
```

Staff users can receive hidden products as well.

A customer requesting a hidden product gets `404`.

This avoids revealing that a hidden product exists.

---

# 39. Category Deletion Conflict

Because products use `PROTECT`, deleting a category with products raises a protected-object error.

Instead of returning an internal server error, the API catches this situation and returns:

```text
409 Conflict
```

That status means:

> The request itself is understandable, but it conflicts with the current state of the data.

---

# 40. Product Filtering, Searching, Sorting, and Pagination

The product API gained query parameters for:

- search
- category
- minimum price
- maximum price
- in-stock state
- ordering
- page
- page size

Example:

```text
/api/products/?category=kitchen&min_price=10&max_price=50&ordering=price&page=2
```

Filtering used `django-filter`.

Search used DRF's search facilities before the later advanced PostgreSQL search extension.

Pagination response shape:

```json
{
  "count": 20,
  "next": "...",
  "previous": null,
  "results": []
}
```

React must therefore use:

```ts
response.data.results
```

not the complete object as if it were an array.

Stable ordering used an ID tie-breaker so rows with the same price do not jump randomly between pages.

---

# 41. API Image Upload

The product ViewSet supports:

```text
multipart/form-data
```

for image upload.

React later sends this using:

```ts
FormData
```

Django's parser stack can accept:

- JSON
- regular form bodies
- multipart forms

Image rules included:

- real image validation
- maximum file size
- `null` can remove the image reference

One detail learned:

Removing the database reference does not automatically delete the old physical image file.

---

# 42. JWT Authentication

ShopLite uses JSON Web Tokens.

Login endpoint:

```text
POST /api/auth/token/
```

Successful login returns:

- access token
- refresh token

Refresh endpoint:

```text
POST /api/auth/token/refresh/
```

---

## Access token

Short-lived.

Used with ordinary API requests.

Header:

```http
Authorization: Bearer <access-token>
```

---

## Refresh token

Longer-lived.

Used to obtain a new access token.

---

# 43. JWT Structure

A JWT has three Base64URL-encoded parts:

```text
header.payload.signature
```

The payload can be decoded and read.

Therefore JWT payloads are **not encrypted**.

Never put secrets inside them.

The signature protects against modification.

It does not protect a valid token from being stolen and replayed.

---

# 44. Access Token vs Refresh Token Security

A stolen valid access token can be used until it expires.

A stolen refresh token is more serious because it can create new access tokens until it expires or is revoked.

That is why:

- access tokens are short-lived
- refresh tokens live longer
- token storage matters

---

# 45. Registration API

Registration validates:

- email
- username
- password
- first name
- last name

The password is write-only.

The API uses Django's normal password validators.

Examples of rejected passwords:

- too short
- too common
- entirely numeric
- too similar to the username/email

Email comparisons were made case-insensitive.

The email is also normalized before storing.

A client attempting to send:

```json
{
  "is_staff": true
}
```

cannot promote itself to administrator.

That field is not writable.

---

# 46. `/auth/me/`

The profile endpoint works on:

```python
request.user
```

instead of accepting a target user ID.

That is safer because there is no URL parameter that could be changed to another customer's user ID.

The profile exposes `is_staff` so React can decide whether to show admin navigation, but `is_staff` is read-only.

---

# 47. CORS

CORS means **Cross-Origin Resource Sharing**.

An origin contains:

- scheme
- hostname
- port

Therefore these are different origins:

```text
http://localhost:5173
http://127.0.0.1:8000
```

The browser's same-origin policy prevents frontend JavaScript from freely reading responses from another origin.

`django-cors-headers` was added to allow the React development origin.

Example allowed origins:

```text
http://localhost:5173
http://127.0.0.1:5173
```

---

## Important CORS lesson

The server can successfully receive and answer a request while the browser refuses to expose the response to JavaScript.

For a simple request Django may log:

```text
200
```

while the browser shows a CORS error.

PowerShell, curl, and Postman do not enforce browser CORS rules.

---

## Preflight

Some cross-origin requests first send:

```text
OPTIONS
```

Examples include requests containing:

```text
Authorization
```

or many JSON write requests.

The browser asks the server whether the real request is permitted.

If the preflight fails, the real request may not be sent.

---

# 48. Cart Design

Every user has one Cart.

The relationship is effectively:

```python
OneToOneField(User)
```

A Cart contains CartItems.

A CartItem stores:

- product
- quantity

If quantity is `3`, that is one database row with quantity three, not three rows.

The combination:

```text
cart + product
```

is unique.

---

# 49. Cart Pricing

Cart prices are intentionally not frozen.

The total uses the product's current price.

So if staff changes a product's price, the cart reflects the new value.

Prices become permanent only when checkout creates the OrderItem snapshot.

---

# 50. Cart API

Important endpoints support:

- view cart
- add item
- update quantity
- remove item
- empty cart

The API decides which cart to use from:

```python
request.user
```

The customer does not send a cart ID.

That prevents them from choosing another customer's cart.

Trying to access another customer's CartItem produces `404`.

---

# 51. Cart Issues

A product can change after entering the cart.

Examples:

- admin hides it
- stock becomes zero
- available stock drops below requested quantity

The CartItem remains visible, but the API supplies an issue message.

Checkout refuses a cart containing unresolved issues.

This is better than silently deleting something the customer previously selected.

---

# 52. Orders

A cart is temporary.

An order is permanent history.

The Order contains things such as:

- customer
- status
- shipping information
- total
- timestamps

OrderItem stores snapshots of:

- product name
- unit price
- quantity

The snapshot is critical.

If a product costs `49.99` at checkout and staff changes its current price tomorrow, the old order still says `49.99`.

---

# 53. Deleting Products Without Destroying Order History

OrderItem keeps a nullable reference to Product using `SET_NULL`.

If the Product is deleted:

- the link becomes `NULL`
- copied product name remains
- copied unit price remains
- order history remains readable

This is why permanent business records should not depend completely on mutable catalog data.

---

# 54. Order Status Rules

Orders start as:

```text
pending
```

Important statuses include:

- pending
- paid
- shipped
- delivered
- cancelled

Staff controls the forward lifecycle.

Customers may cancel their own order while it is still pending.

Invalid transitions return a clear error.

Examples of invalid operations:

- pending directly to delivered
- reopening a cancelled order
- customer changing their own order to paid

`delivered` and `cancelled` are final states.

---

# 55. Stock and Order Status

Stock decreases during checkout.

That reserves the purchased goods for the order.

If a valid pending order is cancelled, stock is returned.

Changing:

```text
paid
shipped
delivered
```

does not decrease stock again.

The cancellation code must also guarantee that stock is restored only once.

---

# 56. Checkout Must Be Atomic

Checkout performs several database operations:

1. confirm the cart is not empty
2. re-check product availability
3. re-check stock
4. create the order
5. create OrderItems
6. copy current prices
7. reduce stock
8. empty the cart

These operations must behave as one unit.

They run inside:

```python
transaction.atomic()
```

If everything succeeds, PostgreSQL commits.

If anything fails, PostgreSQL rolls everything back.

This prevents states such as:

- order exists but stock was not reduced
- stock reduced but order does not exist
- only half the order items were created

---

# 57. Race Conditions

The classic test was:

> Bob and Ana both want the last Bamboo Cutting Board.

Without locking, both requests could read:

```text
stock = 1
```

and both could believe they are allowed to buy it.

ShopLite prevents this using database row locks with:

```python
select_for_update()
```

Only one transaction can obtain the relevant exclusive lock first.

The other waits.

After the winner commits, the waiting transaction sees the updated stock.

The loser receives the out-of-stock error.

Important lesson:

**Which person wins is nondeterministic.**

It is not decided by Ana or Bob having special priority.

It depends on which database transaction obtains the lock first.

The guaranteed result is:

- exactly one successful purchase
- stock ends at zero
- stock never becomes negative
- the same final item is never sold twice

---

# 58. Double Checkout Protection

The customer's cart is also protected during checkout.

If the same customer double-clicks Place Order:

- first checkout obtains the relevant lock
- second checkout waits
- first checkout completes and empties the cart
- second checkout continues and finds an empty cart

Therefore a double click does not create two orders.

---

# 59. Real Payments and Database Transactions

One important architecture lesson:

**Do not keep a database transaction and product row locks open while waiting for an external payment provider.**

A real payment call can take seconds.

The safer pattern is to keep database transactions short and use payment state changes after the external provider responds.

The original course deliberately used pending orders with staff marking them paid before the later Razorpay extension was added.

---

# 60. Celery and Redis

Sending email directly inside checkout would make the customer wait.

It could also make checkout appear to fail because the mail server failed.

Instead the project uses background jobs.

Redis acts as the message broker.

Celery workers consume jobs from Redis.

The important design rule was:

**Queue the email only after the database transaction successfully commits.**

This prevents sending an email about an order that was later rolled back.

---

# 61. Worker Failure

If the Celery worker is temporarily stopped:

- checkout still succeeds
- the Redis queue keeps the task
- restarting the worker lets it consume the waiting task

However, Redis in the development Compose configuration did not have durable volume storage.

Therefore:

- worker down while Redis stays alive: task waits
- Redis itself disappears: queued tasks may be lost

For more critical jobs, a production system may use stronger durability or an outbox pattern.

---

# 62. Celery Worker in Docker

The worker ran in Linux Docker because Celery is much more naturally supported there than directly on Windows.

Inside Docker it connects using service names:

```text
db
redis
```

instead of:

```text
localhost
```

The same Django code works because environment variables override local `.env` values.

When application code changes, restart the worker so it loads the new code.

When dependencies change, rebuild its Docker image.

Example:

```powershell
docker compose up -d --build worker
```

---

# 63. Backend Automated Tests

Manual testing was useful while learning each feature, but it does not scale.

Django automated tests became the safety net.

The test runner creates a separate database:

```text
test_shoplite
```

The normal development data is not modified.

Each test prepares only the data it needs.

After the test, its changes are removed.

---

## Backend tests covered

Examples included:

- catalog
- authentication
- permissions
- registration
- cart ownership
- stock validation
- successful checkout
- insufficient stock
- order snapshots
- cancellation
- stock restoration
- invalid status transitions
- simulated checkout crash
- last-item concurrency race
- confirmation email behavior

At the original course milestone:

```text
41 backend tests
about 90% backend coverage
```

Later extensions increased that number substantially.

---

# 64. Coverage

Coverage asks:

> Which parts of my code were actually executed by the test suite?

Commands:

```powershell
uv run coverage run manage.py test
uv run coverage report
```

Coverage is useful, but a high percentage does not automatically mean good tests.

The important part is testing meaningful behavior.

---

# 65. React Frontend with Vite

The frontend was created with Vite:

```powershell
npm create vite@latest frontend -- --template react-ts --no-interactive
```

Then:

```powershell
cd frontend
npm install
npm run dev
```

Development URL:

```text
http://localhost:5173
```

Vite provides:

- fast startup
- TypeScript integration
- hot module replacement
- production builds

---

# 66. Vite Development vs Preview

Development:

```powershell
npm run dev
```

normally uses:

```text
localhost:5173
```

Production build:

```powershell
npm run build
```

creates:

```text
dist/
```

Preview:

```powershell
npm run preview
```

normally uses:

```text
localhost:4173
```

The preview server is only for checking the built `dist` files locally.

It is not the normal development server.

---

# 67. `npm install` Must Run in the Correct Folder

An important mistake happened early:

```powershell
npm i
```

was run from the project root instead of:

```text
frontend/
```

npm found a different `package.json` higher in the filesystem and displayed vulnerabilities from that unrelated project.

Lesson:

**Always check your current directory before running package-manager commands.**

For ShopLite:

```text
uv commands  → backend/
npm commands → frontend/
```

---

# 68. Tailwind CSS

Tailwind is the styling system.

Instead of creating custom CSS for every small thing, React elements receive utility classes.

Example:

```tsx
<div className="grid gap-6 md:grid-cols-3">
```

Tailwind handles:

- spacing
- typography
- colors
- responsive design
- borders
- sizing
- layouts

Only utilities used by the project are included in the final build.

---

# 69. shadcn/ui

shadcn/ui provides reusable UI components.

Examples:

- Button
- Card
- Input
- Dialog
- Select
- Badge
- Table
- Skeleton
- notifications

shadcn/ui is different from a normal black-box component package.

Its component source code is copied into:

```text
src/components/ui/
```

Those files become part of the application and can be edited.

---

## Why Tailwind is still required

shadcn components are styled using Tailwind.

Think of the responsibilities as:

- **Radix UI:** accessible behavior
- **shadcn/ui:** reusable component implementation
- **Tailwind:** styling system

Radix handles difficult details such as:

- keyboard navigation
- focus management
- Escape behavior
- screen-reader semantics

---

# 70. React Router

React Router gives each React screen its own address.

Examples:

```text
/
 /products
 /products/chef-knife
 /login
 /register
 /cart
 /checkout
 /orders
 /orders/15
 /admin/products
```

The application remains a Single Page Application.

Navigation changes the rendered React components without downloading a brand-new HTML document for every page.

Benefits:

- browser Back/Forward works
- product links can be shared
- refreshing keeps the same route
- pages feel faster

---

# 71. Axios

Axios handles API requests from React.

The API base URL is configured once.

Development example:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

Frontend environment variables exposed to Vite must begin with:

```text
VITE_
```

Anything bundled into the frontend is visible to users.

Therefore:

**Never put passwords or server secrets in Vite environment variables.**

---

# 72. TanStack Query

TanStack Query manages data that lives on the server.

Examples:

- products
- categories
- cart
- orders

It provides:

- fetching
- loading states
- errors
- caching
- refetching
- mutations
- cache invalidation
- background updates

---

# 73. Query Keys and Remembering Data

TanStack Query identifies cached data using a query key.

Example:

```ts
[
  "products",
  {
    search,
    category,
    minPrice,
    maxPrice,
    ordering,
    page,
  },
]
```

Each unique combination has a separate cache entry.

Therefore:

- page 1 can remain cached
- page 2 can remain cached
- kitchen page 1 has a different cache entry
- a search has another cache entry

Returning to a previously loaded page can feel instant.

The cached value can still be refreshed in the background when it becomes stale.

---

# 74. TanStack Packages

Runtime dependency:

```powershell
npm install @tanstack/react-query
```

Development debugging tool:

```powershell
npm install -D @tanstack/react-query-devtools
```

`-D` means:

```text
devDependency
```

React Query is part of the application's normal runtime behavior.

React Query Devtools is mainly for developers to inspect the cache.

---

# 75. Product List Page

The React product list supports:

- search
- category
- minimum price
- maximum price
- sorting
- pagination

The filters are stored in the browser URL using query parameters.

Example:

```text
/products?category=kitchen&ordering=price&page=2
```

Benefits:

- refresh keeps filters
- Back works properly
- links can be bookmarked
- filtered pages can be shared

---

# 76. Loading, Error, Empty and Refresh States

A proper browser application must handle more than the success state.

## Loading

Grey skeleton cards are shown.

## Error

A readable error and **Try again** button appear.

## Empty search

The UI explains that no products matched.

## Page change

The previous results can stay on screen while the next page loads, avoiding flashing.

## Cached result

Previously fetched data can appear immediately while TanStack Query quietly checks for a newer version.

---

# 77. Product Detail Page

The product page contains:

- image
- product name
- category
- description
- price
- stock information
- quantity selector
- add-to-cart/sign-in action

Stock-related UI can say:

- In stock
- Only N left
- Out of stock

The frontend prevents obviously invalid quantities, but Django still performs the real stock validation.

Frontend validation is convenience.

Backend validation is security and correctness.

---

# 78. Prefetching

When a user hovers or focuses a product card, the product detail query can begin in advance.

If they click shortly afterwards, the data may already be in TanStack Query's cache.

This makes the product page appear nearly instantly.

---

# 79. Frontend Authentication

React eventually gained:

- login
- registration
- current-user state
- protected routes
- admin-only routes
- sign out
- token refresh

The frontend uses the same Django API that was previously tested with PowerShell.

---

# 80. `?next=` After Login

Suppose the customer is on:

```text
/products/noise-cancelling-headphones
```

and needs to sign in.

React sends them to:

```text
/login?next=%2Fproducts%2Fnoise-cancelling-headphones
```

The URL-decoded `next` value is:

```text
/products/noise-cancelling-headphones
```

After successful login, React returns the user to that page.

A safety check ensures `next` remains inside the shop so it cannot become an open-redirect vulnerability.

---

# 81. Token Storage Decision

The course frontend used:

## Access token

Stored only in JavaScript memory.

Advantages:

- not stored permanently
- disappears on reload/tab close
- smaller exposure window

## Refresh token

Stored in:

```text
localStorage
```

Advantages:

- survives reload
- allows silent re-authentication

Trade-off:

JavaScript running on the page can read localStorage.

Therefore an XSS vulnerability could potentially steal the refresh token.

---

# 82. What Happens on Ctrl+R / F5

When the page reloads:

- the access token in memory disappears
- the refresh token remains in localStorage
- React sends the refresh token to the refresh endpoint
- Django returns a new access token
- React calls `/auth/me/`
- the user remains signed in

While this restoration is happening, the UI shows a placeholder so the header does not briefly flash the wrong login state.

---

# 83. Sign Out

Signing out clears:

- in-memory access token
- refresh token from localStorage
- current user state
- user-specific frontend caches

After reload, no refresh token is available, so React stays signed out.

One important nuance:

Removing the refresh token from the browser does not automatically make that JWT invalid server-side unless token blacklisting/revocation is implemented.

---

# 84. HttpOnly Cookie Alternative

A stronger refresh-token setup could use an HttpOnly cookie.

That would require custom backend behavior:

- login puts refresh token into the cookie
- refresh endpoint reads the cookie
- logout endpoint deletes the cookie
- Axios uses credentials
- Django CORS credentials settings change
- cookie `Secure` and `SameSite` settings must be configured
- Cross-Site Request Forgery protection must be considered

The course kept localStorage to keep the first JWT implementation easier to understand.

---

# 85. Protected and Admin Routes

React had route guards.

A protected page requires a signed-in user.

An admin page additionally requires:

```text
is_staff = true
```

This improves UX.

It is not a replacement for Django permissions.

A normal customer manually calling an admin endpoint must still receive `403`.

---

# 86. Cart UI

The React cart added:

- cart badge in the navigation
- add item
- update quantity
- remove item
- cart totals
- issue messages
- empty-cart state

Mutations invalidate the cart query.

For example, after adding a product, React tells TanStack Query:

> The cached cart may now be outdated.

That is what:

```ts
queryClient.invalidateQueries({
  queryKey: ["cart"],
})
```

means.

It does **not** delete the cart from PostgreSQL.

It marks the frontend cache stale so the current server version can be fetched.

---

# 87. Checkout UI

The checkout page collects shipping information.

On success it receives the newly created Order and moves the customer to the order page.

Related caches are invalidated because:

- cart became empty
- a new order exists
- product stock may have changed

The backend still owns all checkout rules.

---

# 88. My Orders

Customers can view:

- their own order list
- order details
- status
- order items
- shipping address
- totals
- cancellation controls when allowed

Customers cannot retrieve another customer's order simply by changing the ID.

That ownership rule is enforced by Django.

---

# 89. Frontend Admin

ShopLite eventually gained its own React admin screens in addition to the Django admin.

Admin functions included:

## Products

- list
- create
- edit
- upload image
- hide/show
- delete with confirmation

Product image upload uses:

```ts
FormData
```

because it is multipart data.

## Categories

- create
- edit
- delete

Deleting a category containing products shows the backend's conflict message.

## Orders

Staff can:

- view all orders
- filter by status
- update valid order statuses

Normal customers were tested against these endpoints and received `403`.

---

# 90. Frontend Testing

The frontend test stack used:

- Vitest
- React Testing Library

Tests covered components and hooks.

Examples included:

- ProductCard behavior
- API hooks with mocked requests
- route behavior
- auth-related behavior
- later review/wishlist/payment components

The original Phase 15 milestone had:

```text
12 frontend tests
```

Later extensions increased this number.

---

# 91. End-to-End Manual Test

The full application was manually tested as one system.

It included:

- register
- login
- browse/search/filter products
- add to cart
- checkout
- background confirmation email
- admin status update
- customer seeing updated status

This verified that the frontend, backend, database and worker actually worked together.

---

# 92. Production Readiness

Development settings are not appropriate for an internet-facing application.

When:

```text
DJANGO_DEBUG=False
```

the project enables stronger production behavior.

Examples included:

- redirect HTTP to HTTPS
- secure cookies
- HSTS
- plain error pages
- trusted CSRF origins
- real email configuration
- static collection

Django's production check:

```powershell
uv run python manage.py check --deploy
```

was used to verify security configuration.

Two optional HSTS-related warnings remained deliberately configurable.

---

# 93. `collectstatic`

Django owns some frontend assets even though the customer store is React.

Examples:

- Django admin CSS/JS
- DRF browsable API assets

Production command:

```powershell
uv run python manage.py collectstatic --noinput
```

It collects them under:

```text
backend/staticfiles/
```

They are separate from React's:

```text
frontend/dist/
```

---

# 94. Code Splitting

Originally the frontend production build was roughly:

```text
644 kB
```

because many pages were bundled together.

The project changed less-frequently-used pages to lazy loading.

Common pages remained in the main bundle:

- home
- product list
- product detail

Pages such as:

- admin
- checkout
- account-related screens

became separate JavaScript files.

The main bundle fell to roughly:

```text
486 kB
```

A customer who never visits admin pages never downloads those files.

---

# 95. Django 5.2 LTS Upgrade

The project originally used:

```text
Django 5.1.7
```

It was later upgraded to:

```text
Django 5.2.17
```

with:

```powershell
uv add "django>=5.2,<5.3"
```

Helper packages were also updated:

```text
Django REST Framework 3.18.1
django-filter 26.1
```

The version restriction:

```text
>=5.2,<5.3
```

allows future Django 5.2 security updates without unexpectedly jumping to Django 6.

---

## Upgrade verification

The safety sequence was:

```powershell
uv run python manage.py check
uv run python manage.py makemigrations --check --dry-run
uv run python manage.py test
```

Then the worker image was rebuilt because it installs from `uv.lock`.

This demonstrated one of the biggest benefits of automated tests:

**upgrades become measurable rather than guesswork.**

---

# 96. Password Reset Extension

The first major post-course extension added password reset by email.

The public reset-request page always gives the same answer:

> If an account exists for this email, we have sent a reset link.

This prevents attackers from discovering which email addresses have accounts.

---

## Reset link security

The reset link:

- identifies the user in a URL-safe form
- contains a signed token
- cannot be forged without the Django signing secret
- expires after one hour
- stops working after the password changes

Therefore it effectively works once.

---

## Password reset rate limiting

A visitor can request a limited number of reset emails per hour.

The recorded implementation used:

```text
5 per hour
```

The sixth request returns:

```text
429 Too Many Requests
```

The development implementation used Django's in-memory cache.

A real multi-process production setup would use shared storage such as Redis for the rate-limit state.

---

# 97. HTML Email Extension

Email support was expanded beyond the checkout confirmation.

Emails were created for:

- order confirmed
- payment received
- shipped
- delivered
- cancelled
- password reset

Status-related emails are queued only after the new order status has successfully committed.

A preview management command allowed all email designs to be opened locally.

One important cloud-storage adjustment came later:

Instead of relying on:

```python
product.image.path
```

email image handling was changed to work through Django's storage abstraction.

That allows images to work when the storage backend is S3.

---

# 98. Product Reviews and Ratings

A separate `reviews` Django app was created.

A review stores:

- customer
- product
- rating
- optional comment
- visibility/moderation flag

Database rules include:

- one review per customer per product
- rating must be from 1 to 5

---

## Who may review

A customer may review a product only after they have a **delivered** order containing that product.

Paid or shipped is not enough.

Therefore the **Verified purchase** badge has a real backend rule behind it.

---

## Review privacy

Public reviews do not expose email addresses.

The display name uses a reduced form such as:

```text
Ana S.
```

or the username.

---

## Product ratings

Products expose:

- average rating
- review count

The database calculates them efficiently.

A later sort option allowed:

```text
Top rated
```

Products without ratings are handled separately so they do not incorrectly outrank reviewed products.

---

## Review moderation

Staff can:

- search reviews
- hide reviews
- show reviews
- delete reviews

Staff does not edit the customer's review text.

Hidden reviews disappear from public averages.

The author can still see their own hidden review with a note explaining its status.

---

# 99. Wishlist

A separate wishlist feature was added.

A wishlist item is unique for:

```text
user + product
```

Operations were intentionally idempotent.

Saving an already-saved product does not create duplicates.

Removing something already removed does not create an unnecessary failure.

---

## Wishlist behavior

The frontend added hearts to:

- product cards
- product page

Signed-out users are sent to login and then returned to the original page.

The navigation shows a wishlist count.

The wishlist page supports:

- add product to cart
- remove from wishlist

Adding to cart does not automatically remove the product from the wishlist.

Hidden products remain visible in the wishlist as:

```text
No longer available
```

but cannot be added to cart.

---

# 100. Razorpay Payment Extension

A payment extension was developed on a separate feature branch.

It used Razorpay in test mode.

The important rule:

**The server decides the amount. Never trust an amount sent by the browser.**

ShopLite converts exact Decimal values to paise.

Example:

```text
₹49.99 = 4999 paise
```

---

# 101. Payment Records

A Payment record stores information such as:

- ShopLite order
- Razorpay order ID
- Razorpay payment ID
- amount
- currency
- status
- which confirmation arrived first
- error description

A WebhookEvent table stores handled event IDs so duplicate deliveries do not repeat work.

---

# 102. Starting a Payment

Endpoint:

```text
POST /api/payments/start/
```

It verifies:

- customer owns the order
- order is pending
- amount meets Razorpay's minimum
- payment integration is configured

The amount comes from the ShopLite database.

The response contains the public information required by Razorpay Checkout.

The Razorpay secret key never reaches React.

If the customer closes the payment window and tries again, the existing Razorpay order can be reused.

---

# 103. Payment Confirmation from the Browser

After payment, Razorpay's checkout window returns:

- payment ID
- Razorpay order ID
- signature

The browser forwards those values to Django.

Django recalculates the signature using the server-side secret.

A fake:

> “I paid”

request without a valid signature is rejected.

---

# 104. Payment Webhook

The webhook provides the more reliable payment path.

Endpoint:

```text
POST /api/payments/webhook/
```

Razorpay's server calls this directly.

Therefore payment can still be recorded if:

- user closes the browser
- user's network fails
- React crashes after payment

---

## Webhook signature

The webhook signature is calculated over the **raw request body**.

The server verifies it before trusting the event.

A missing or invalid signature returns an error.

---

## Duplicate webhook handling

Razorpay can deliver the same event multiple times.

Each event contains an event ID.

ShopLite records the event ID.

If the same event arrives again, it is acknowledged but not processed a second time.

This is called **idempotency**.

---

# 105. Two Payment Confirmations, One Effect

There are two independent confirmation paths:

- browser receipt
- Razorpay webhook

Whichever valid one arrives first marks the order paid.

The second sees the payment is already processed and does nothing.

Therefore the **Payment received** email is sent once.

This is an important distributed-systems lesson:

**multiple delivery paths are okay when the state-changing operation is idempotent.**

---

# 106. Development Webhook Tunnel

During local development, Razorpay cannot call:

```text
localhost
```

directly.

A zrok public tunnel was used so Razorpay could call the local Django server.

Production later used the real CloudFront address, so the tunnel was unnecessary there.

---

# 107. Smart Search Extension

Search was later improved using PostgreSQL instead of simple substring matching.

Features included:

- word-form matching
- relevance ranking
- typo fallback
- “Did you mean?”
- matching-text highlights
- quoted phrases
- exclusion terms
- live suggestions

---

## Relevance

Matches in different fields receive different importance.

Product name matters more than category or description.

When search is active, **Best match** becomes the natural default ordering.

---

## Typo handling

PostgreSQL's trigram extension was used.

The extension:

```text
pg_trgm
```

helps compare strings using small groups of characters.

One useful lesson from testing real data:

Always mixing fuzzy matches into normal results created noise.

The implementation therefore uses typo matching mainly as a fallback when normal search does not find useful results.

---

## Search suggestions

Typing briefly pauses before the frontend requests suggestions.

Suggestions include up to a small number of products and support:

- mouse click
- Up/Down keys
- Enter
- Escape

Accessibility semantics were also included for screen readers.

---

# 108. Continuous Integration

GitHub Actions was added under:

```text
.github/workflows/ci.yml
```

CI means:

**Automatically verify that the code is healthy whenever changes are pushed or proposed.**

The workflow runs on:

- pushes to `main`
- pull requests

---

# 109. Backend CI Job

The backend CI machine performs roughly:

- start PostgreSQL 16
- install Python 3.12
- install uv
- install exact locked dependencies
- run Django system check
- check for forgotten migrations
- run tests
- produce coverage report

Redis was not needed for the automated test suite because background task calls were mocked where appropriate.

---

# 110. Frontend CI Job

The frontend machine performs:

- install Node.js 22
- `npm ci`
- lint
- Vitest tests
- TypeScript check
- production build

The backend and frontend jobs run independently and can run at the same time.

---

# 111. CI Does Not Copy the Local `.env`

A GitHub Actions runner is a fresh temporary Linux machine.

It receives committed repository files.

Because `.env` is ignored, your Windows `.env` does not magically appear there.

CI gets configuration another way.

For tests, the workflow supplies temporary environment variables such as:

- test Django secret key
- test database name
- test database username
- test database password

These values exist only inside the CI run.

Real production secrets should never be committed merely to make CI work.

---

# 112. What Happens When CI Fails

The Git push already happened.

A failed test does not automatically undo the push.

Instead:

- commit receives a red failure status
- GitHub identifies which step failed
- developer fixes the problem
- developer pushes another commit

When all checks pass, the commit receives a green status.

---

# 113. CI vs CD

**CI — Continuous Integration**

Checks whether the software is good.

Examples:

- tests
- lint
- build
- migration checks

**CD — Continuous Deployment**

Takes verified software and deploys it.

Originally only CI existed.

CD was later implemented during the AWS work.

---

# 114. Production Credentials

A useful distinction from the earlier non-AWS deployment plan:

## GitHub

GitHub should only contain the credentials needed for the deployment mechanism itself.

## Production runtime

Application secrets should live in the production environment, not in Git.

The final AWS design improved this further by storing application secrets in:

```text
AWS SSM Parameter Store
```

and by using OIDC instead of a permanent AWS access key in GitHub.

---

# 115. AWS Deployment Goal

The AWS deployment was built as a learning and interview exercise.

Requirements included:

- production-style architecture
- proper security boundaries
- real CI/CD
- HTTPS
- logging
- secrets management
- managed database and Redis
- low cost
- easy teardown
- no reuse of unrelated AWS credentials

Region:

```text
us-east-1
```

CloudFront's default HTTPS domain was used instead of purchasing a domain.

---

# 116. Cost-Safety Rules

Before creating expensive resources:

- obtain account-owner approval
- configure AWS Budget alerts
- enable MFA
- tag all ShopLite resources
- create expensive components only for the testing period
- delete them the same day

Tags included:

```text
Project = shoplite-demo
Owner   = ...
```

The notes used:

```text
1 USD = ₹95.90
```

for approximate learning estimates.

---

# 117. Recorded AWS Cost Estimates

These numbers were the estimates recorded during the exercise and should be rechecked against current AWS pricing before repeating the deployment.

Approximate hourly items included:

- NAT Gateway and networking traffic
- Application Load Balancer
- public IPv4 addresses
- ECS Fargate web task
- ECS Fargate worker
- RDS PostgreSQL
- ElastiCache Redis

The overall running architecture was estimated at roughly:

```text
$0.17/hour
≈ ₹16/hour
```

An eight-hour learning session was estimated around:

```text
$1.40
≈ ₹135
```

The important lesson was not the exact number.

It was that resources such as:

- NAT Gateway
- ALB
- RDS
- ElastiCache

continue generating costs while they exist.

---

# 118. AWS Networking

The VPC was designed with:

- 2 Availability Zones
- 2 public subnets
- 2 private subnets
- Internet Gateway
- NAT Gateway
- route tables
- security groups

Public-facing infrastructure such as the ALB lives in public subnets.

Application containers, database and Redis live in private subnets.

---

# 119. Internet Gateway vs NAT Gateway

The Internet Gateway enables internet connectivity for the VPC.

The NAT Gateway is primarily used so private resources can start outbound internet connections without accepting unsolicited inbound internet traffic.

Examples of things private containers needed internet access for:

- ECR image pulls
- email delivery
- Razorpay
- external package/service calls

The NAT Gateway does not act as the public entrance to Django.

Inbound application traffic uses the ALB.

---

# 120. Security Groups

Five main security groups were created.

## ALB security group

Accepts HTTP only from the AWS-managed CloudFront origin-facing prefix list.

## Web security group

Accepts port `8000` only from the ALB security group.

## Worker security group

No inbound rules.

The Celery worker only initiates outbound connections.

## Database security group

Accepts PostgreSQL `5432` only from:

- web tasks
- worker tasks

## Redis security group

Accepts Redis `6379` only from:

- web tasks
- worker tasks

Security groups reference other security groups instead of public IP ranges whenever possible.

This is more maintainable and expresses the intended architecture directly.

---

# 121. RDS PostgreSQL

Production PostgreSQL used Amazon RDS.

Learning configuration included:

- PostgreSQL 16
- `db.t4g.micro`
- private subnet
- not publicly accessible
- encryption
- short backup retention
- single Availability Zone to reduce cost

A production system requiring higher availability would normally consider Multi-AZ.

---

# 122. ElastiCache

Redis moved from the local Docker container to Amazon ElastiCache.

It remained private.

Only the application services could connect.

This continued to serve as Celery's broker.

---

# 123. S3

Two private buckets were created.

## Frontend bucket

Stores React's built production assets.

## Media bucket

Stores uploaded product images.

Both used:

- Block Public Access
- private ownership
- server-side encryption
- no unnecessary versioning for this short test

CloudFront received controlled access using Origin Access Control.

The buckets themselves were not made public.

---

# 124. ECR

Amazon Elastic Container Registry stores Docker images.

Two repositories were created:

```text
shoplite/web
shoplite/worker
```

Images were tagged using the Git commit.

This makes deployment traceable.

Image scanning was enabled.

A lifecycle policy retained only a limited number of images to avoid unlimited storage growth.

---

# 125. Production Django Container

The backend Docker image gained a web target.

The production server became:

```text
Gunicorn
```

instead of:

```text
manage.py runserver
```

`runserver` is only for development.

Production dependencies also included:

- Gunicorn
- WhiteNoise
- django-storages with S3 support

The container continued to run as a non-root user.

---

# 126. WhiteNoise

WhiteNoise serves Django's collected static files from the application container.

This handles files such as:

- Django admin CSS
- Django admin JavaScript

Uploaded product media still goes to S3.

React itself is served separately from S3 through CloudFront.

---

# 127. Health Endpoint

A lightweight endpoint:

```text
/healthz/
```

was added.

The Application Load Balancer checks it regularly.

If a web task stops responding correctly, the target becomes unhealthy.

ECS can replace unhealthy tasks.

---

# 128. ECS Fargate

ECS runs application containers.

Fargate means AWS manages the underlying servers.

You specify:

- Docker image
- CPU
- memory
- networking
- environment variables
- secrets
- IAM roles

and AWS schedules the containers.

Main task definitions:

- `shoplite-web`
- `shoplite-worker`
- `shoplite-migrate`

---

# 129. Migration Task

Database migrations run as a short-lived ECS task.

It executes:

```text
python manage.py migrate
```

and exits.

This is preferable to manually exposing the database or running migration commands from random developer machines against production.

---

# 130. ECS Services

Two persistent services were created.

## Web service

Keeps the Django/Gunicorn task running.

## Worker service

Keeps the Celery worker running.

The web service uses rolling deployment.

New healthy tasks are started before old tasks are removed.

A deployment circuit breaker can roll back a failed deployment.

---

# 131. Application Load Balancer

The ALB receives requests destined for Django.

Its target group uses Fargate task IP addresses.

Health-check path:

```text
/healthz/
```

The ALB is protected in two ways.

First, its security group accepts only CloudFront-origin addresses.

Second, the forwarding listener requires a private custom header:

```text
X-Origin-Verify
```

CloudFront adds that header.

Requests without it receive `403`.

This is defense in depth.

---

# 132. CloudFront

CloudFront became the single public HTTPS address.

It has different origins depending on the requested content.

Conceptually:

- React files from frontend S3
- media from media S3
- Django API/admin/static through ALB

Benefits:

- HTTPS
- caching
- one public host
- no custom domain required for the learning exercise
- React and Django use the same public origin

Because the same CloudFront hostname serves both frontend and API, production no longer has the same cross-origin problem as local development.

---

# 133. SPA Routing

React Router expects URLs such as:

```text
/products/chef-knife
```

to load the React application.

S3 itself would normally search for an object literally named:

```text
products/chef-knife
```

A CloudFront Function handles SPA routing for frontend page requests so React receives `index.html`.

The rule is limited to the frontend behavior so genuine API 404 responses are not accidentally converted into React pages.

---

# 134. AWS Secrets with Parameter Store

Local development used:

```text
backend/.env
```

AWS production used:

```text
SSM Parameter Store
```

Sensitive parameters included things such as:

```text
/shoplite/DJANGO_SECRET_KEY
/shoplite/DB_PASSWORD
/shoplite/EMAIL_HOST_PASSWORD
/shoplite/RAZORPAY_KEY_SECRET
/shoplite/RAZORPAY_WEBHOOK_SECRET
```

They were stored as:

```text
SecureString
```

using AWS-managed encryption.

ECS injects them into the containers when tasks start.

The values do not need to be stored in:

- Git
- Docker images
- GitHub workflow files

---

# 135. IAM Roles

Different responsibilities use different roles.

## ECS execution role

Allows ECS to:

- pull images from ECR
- write logs
- retrieve parameters required at startup

## Web/worker task role

Allows the application itself to access only the AWS resources it needs, such as the media bucket.

## GitHub deployment role

Allows the deployment pipeline to:

- push ECR images
- register task definitions
- run migration tasks
- update ECS services
- upload frontend files
- invalidate the correct CloudFront distribution

The permission scope is limited rather than giving permanent administrator rights.

---

# 136. GitHub OIDC to AWS

One of the most important AWS security lessons was:

**GitHub does not need a permanent AWS Access Key ID and Secret Access Key.**

Instead GitHub and AWS use OpenID Connect.

The workflow requests a short-lived GitHub-signed identity token.

AWS Security Token Service verifies:

- GitHub's signature
- repository identity
- GitHub environment
- audience

If the IAM role's trust policy matches, AWS returns temporary credentials.

Those credentials:

- exist only for the workflow run
- expire automatically
- have only the deployment role's permissions

This is safer than storing permanent AWS keys in GitHub Secrets.

---

# 137. GitHub Production Environment

Deployment used a GitHub Environment:

```text
production
```

It held:

- non-secret deployment variables
- deployment protection rules
- reviewer approval

The deployment could wait for human approval before production changes were applied.

This is similar to a real team's deployment gate.

---

# 138. AWS CI/CD Deployment

The deployment workflow was added separately from ordinary CI.

The deployment performs tasks such as:

- authenticate to AWS using OIDC
- build web image
- build worker image
- push images to ECR
- run database migration task
- register/update task definitions
- update ECS services
- wait for healthy deployment
- build React
- upload frontend files to S3
- invalidate CloudFront

Images are tagged with the Git commit so the running version can be traced back to source control.

---

# 139. GitHub Configuration vs AWS Secrets

Non-sensitive deployment identifiers can live in GitHub environment variables.

Examples:

- cluster name
- service name
- ECR repository
- S3 bucket
- CloudFront distribution ID
- subnet IDs
- security-group ID

Application secrets remain in Parameter Store.

This separation is important:

**GitHub knows where to deploy. AWS runtime storage knows the application's secret values.**

---

# 140. One-Off Production Commands

Management commands such as:

```text
seed_catalog
createsuperuser
```

were run as short-lived ECS tasks inside the private network.

This avoids opening PostgreSQL to the internet just so a developer can execute setup commands.

---

# 141. Production Observability

AWS services used or planned for monitoring included:

- CloudWatch Logs
- ECS service events
- ALB health
- ALB HTTP 5xx metrics
- RDS CPU/connections
- alarms
- SNS email notifications

Useful failure exercises included:

- kill a web task and watch ECS replace it
- deploy a broken health check and observe rollback behavior

---

# 142. Manual Deployment Verification

The deployment checklist included testing:

- HTTPS frontend
- direct React route refresh
- API
- Django admin
- static admin styling
- registration
- login
- catalog
- search
- wishlist
- reviews
- cart
- checkout
- Razorpay test payment
- Celery worker
- password reset
- S3 image upload

The goal was not merely:

> “The page opens.”

It was to prove every infrastructure component did its job.

---

# 143. AWS Teardown

Because the deployment used a company AWS account and was intended for short-term learning, teardown was treated as part of the deployment exercise.

The order matters because AWS resources depend on each other.

The recorded teardown sequence was:

1. Disable further GitHub deployments.
2. Remove the Razorpay CloudFront webhook.
3. Scale ECS web and worker services to zero.
4. Delete ECS services and the cluster.
5. Deregister/delete web, worker and migration task definitions.
6. Disable and delete CloudFront.
7. Remove CloudFront-related WAF resources if present.
8. Delete the SPA CloudFront Function and Origin Access Control.
9. Delete the Application Load Balancer.
10. Delete its target group.
11. Delete the NAT Gateway.
12. Release the NAT Gateway's Elastic IP.
13. Delete RDS without an unnecessary final snapshot for this disposable test.
14. Delete the RDS subnet group.
15. Delete ElastiCache without an unnecessary final backup.
16. Delete the ElastiCache subnet group.
17. Delete the VPC after dependent networking resources are gone.
18. Empty and delete both S3 buckets.
19. Delete ECR repositories and their images.
20. Delete `/shoplite/...` Parameter Store entries.
21. Delete CloudWatch log groups.
22. Delete ShopLite IAM roles/policies.
23. Delete the GitHub OIDC provider if nothing else uses it.
24. Delete the GitHub production environment.

---

# 144. Zero-Cost Verification

Deleting obvious resources is not enough.

Final verification should include:

## Tag Editor

Search all regions for:

```text
Project = shoplite-demo
```

Expected result:

```text
nothing remaining
```

## EC2/VPC resources

Verify there are no forgotten:

- Elastic IPs
- NAT Gateways
- load balancers
- target groups
- volumes

## RDS

Verify there are no unwanted:

- database instances
- retained backups
- snapshots

## Storage

Verify S3 and ECR resources are gone if no longer needed.

## Billing

Check Billing and Cost Explorer later because AWS charges can take time to appear.

The notes expected up to roughly 24 hours before all cost information becomes visible.

---

# 145. Terraform Phase

Terraform was planned after the manual AWS deployment.

This order was deliberate.

First understand the infrastructure manually.

Then automate the infrastructure you already understand.

---

# 146. Terraform Project Structure

The planned infrastructure folder was:

```text
infra/
└── terraform/
    ├── versions.tf
    ├── backend.tf
    ├── variables.tf
    ├── terraform.tfvars.example
    ├── outputs.tf
    └── files/modules for:
        network
        security
        data
        ecs
        edge
        iam
        observability
```

A real `terraform.tfvars` containing sensitive values should remain ignored by Git.

---

# 147. Terraform State

Terraform state remembers which real resources correspond to Terraform configuration.

The plan used remote S3 state with locking.

State must be treated carefully because it can contain sensitive values.

---

# 148. Main Terraform Commands

```powershell
terraform init
terraform fmt
terraform validate
terraform plan
terraform apply
terraform destroy
```

## `init`

Initializes providers and backend.

## `fmt`

Formats Terraform source files.

## `validate`

Checks configuration structure.

## `plan`

Shows proposed infrastructure changes before applying them.

## `apply`

Creates/updates resources.

## `destroy`

Deletes Terraform-managed infrastructure.

The intended learning rule was:

**Always inspect the plan before applying it.**

---

# 149. Why Infrastructure as Code Matters

Terraform makes infrastructure:

- repeatable
- version-controlled
- reviewable
- reproducible
- easier to document
- easier to destroy cleanly

Manual deployment teaches what each component means.

Infrastructure as Code teaches how to express that architecture declaratively.

---

# 150. Interview Documentation

Two learning documents were planned.

## `INTERVIEW-DEPLOYMENT.md`

For the manual AWS deployment.

Topics included:

- architecture
- AWS services
- networking
- IAM
- OIDC
- secrets
- CI/CD
- logging
- monitoring
- cost
- teardown
- alternatives
- trade-offs
- interview questions
- how to explain the project in two minutes

## `INTERVIEW-TERRAFORM.md`

For the Infrastructure as Code phase.

Topics included:

- Terraform structure
- providers
- variables
- resources
- outputs
- state
- dependencies
- security
- `init`
- `plan`
- `apply`
- `destroy`
- mapping Terraform back to manually created AWS resources
- interview questions

---

# 151. Main API Areas

The important API groups built during the project were:

## Authentication

```text
POST /api/auth/register/
POST /api/auth/token/
POST /api/auth/token/refresh/
GET  /api/auth/me/
PATCH /api/auth/me/
```

Later:

```text
password reset request
password reset confirmation
```

## Products and Categories

```text
/api/products/
/api/products/<slug>/
/api/categories/
/api/categories/<slug>/
```

## Cart

```text
/api/cart/
/api/cart/items/
/api/cart/items/<id>/
```

## Orders

```text
/api/orders/
/api/orders/<id>/
/api/orders/checkout/
/api/orders/<id>/cancel/
/api/orders/<id>/status/
```

## Reviews

Product-specific review endpoints were added under the product URLs.

## Wishlist

Wishlist endpoints allowed listing, adding, and deleting saved products.

## Payments

```text
POST /api/payments/start/
POST /api/payments/verify/
POST /api/payments/webhook/
```

---

# 152. Important Security Lessons

## Never trust the frontend

React is controlled by the customer.

Every permission and business rule must also exist in Django.

## Never store passwords directly

Use Django's password hashing.

## Never commit secrets

Use `.env` locally and a proper secret/configuration service in production.

## Never trust payment amounts from the browser

Read the amount from the server's order.

## Verify payment signatures

A payment provider response must be cryptographically verified.

## Verify webhook signatures before processing the body

Do not trust unsigned events.

## Make webhook processing idempotent

Providers can deliver the same event more than once.

## Use database transactions around multi-step state changes

Partially completed checkout is unacceptable.

## Use database locks for limited-stock concurrency

Application-level “check then save” logic alone is not safe.

## Use HTTPS in production

Tokens and passwords must not travel unencrypted.

## Prefer short-lived cloud credentials

OIDC with temporary AWS credentials is safer than permanent deploy access keys.

## Keep databases and application containers private

Only the required public entry points should be internet reachable.

---

# 153. Important Performance Lessons

## N+1 queries

Use `select_related` or appropriate prefetching.

## Pagination

Do not send an entire large product catalog in one response.

## TanStack Query cache

Avoid fetching the same browser data unnecessarily.

## Background work

Do not make the customer wait for email delivery.

## Code splitting

Do not make a casual customer download admin code.

## CDN

CloudFront can serve static/frontend/media content efficiently.

## Database search

Use PostgreSQL's search/index capabilities instead of moving large catalogs into Python.

---

# 154. Important Reliability Lessons

## Transaction atomicity

A checkout must be all-or-nothing.

## Locking

Concurrency bugs happen even when they are difficult to reproduce manually.

## Idempotency

Repeated requests should not always create repeated effects.

This appeared in:

- wishlist
- payment confirmation
- webhooks

## After-commit tasks

Do not email about database changes that may still roll back.

## Health checks

A running process is not automatically a healthy application.

## Automated tests

The faster the test suite is, the more likely it is to be used constantly.

## CI

Every push should prove the code still works.

## Deployment health

A deployment should wait for healthy containers instead of assuming startup means success.

---

# 155. Important Debugging Habits Learned

1. Read Python tracebacks from the bottom first.
2. Check the current working directory before running `npm` or `uv`.
3. Check which Python interpreter is being used.
4. Check which PostgreSQL server and port are being used.
5. Distinguish `401`, `403`, `404`, and `409`.
6. Remember that CORS is enforced by browsers, not by curl.
7. Check whether `.env` changes require process restart.
8. Check whether Docker workers need restart/rebuild after code/dependency changes.
9. Use `git diff` before committing.
10. Use `manage.py check`.
11. Use `makemigrations --check --dry-run`.
12. Run tests before trusting a change.
13. Inspect server logs, browser Network tab, Celery logs and cloud logs at the correct layer.
14. When a cloud deployment fails, identify whether the problem is networking, IAM, health checks, secrets or application code instead of treating everything as one “AWS error”.

---

# 156. Useful Local Commands

## Start infrastructure

```powershell
docker compose up -d
docker compose ps
```

## Backend

```powershell
cd backend
uv run python manage.py runserver
```

## Frontend

```powershell
cd frontend
npm run dev
```

## Worker logs

```powershell
docker compose logs -f worker
```

## Django checks

```powershell
uv run python manage.py check
uv run python manage.py makemigrations --check --dry-run
```

## Backend tests

```powershell
uv run python manage.py test
```

## Frontend tests

```powershell
npm test
```

## Frontend lint

```powershell
npm run lint
```

## Production frontend build

```powershell
npm run build
```

## Production Django static files

```powershell
uv run python manage.py collectstatic --noinput
```

## Watch GitHub CI

```powershell
gh run watch
```

---

# 157. Local Development Mental Model

During normal development:

- PostgreSQL runs in Docker.
- Redis runs in Docker.
- Celery runs in Docker.
- Django runs from Windows using `uv`.
- React/Vite runs from Windows using `npm`.
- Django talks to PostgreSQL through the mapped host port.
- Docker services talk to each other through Compose service names.
- React talks to Django using HTTP.
- CORS allows the browser development origin.
- Django controls real authorization and validation.

---

# 158. Production Mental Model

In AWS:

- CloudFront is the public HTTPS address.
- S3 stores React and uploaded media.
- ALB forwards dynamic Django traffic.
- ECS Fargate runs Django/Gunicorn.
- ECS Fargate runs Celery.
- RDS stores PostgreSQL data.
- ElastiCache provides Redis.
- SSM Parameter Store contains secrets.
- CloudWatch stores logs.
- ECR stores container images.
- GitHub Actions uses OIDC for temporary AWS credentials.
- CI verifies code before deployment.
- the production environment requires approval.
- migrations run as a temporary ECS task.
- ECS performs rolling deployments.
- CloudFront is invalidated after a frontend deployment.

---

# 159. The Most Important Concepts to Remember

If I forget everything else, I should remember these ideas:

### HTTP
The frontend and backend are separate programs communicating through requests and responses.

### ORM
Django lets Python code express database operations while PostgreSQL remains the source of persistent truth.

### Migrations
Models describe desired schema; migration files record schema history; `migrate` applies that history.

### Validation
Friendly application validation is useful, but database constraints remain the final safety net.

### Authentication
Authentication determines who the user is.

### Authorization
Authorization determines what that user may do.

### JWT
The access token proves identity for API calls; the refresh token is used to obtain new access tokens.

### CORS
CORS is a browser cross-origin rule, not an authorization mechanism.

### Transactions
Related database operations that must succeed together belong in a transaction.

### Row locking
Transactions alone do not automatically solve every concurrency race; `select_for_update()` protects contested rows.

### Snapshotting
Orders copy mutable product information so history does not change later.

### Background jobs
Slow work such as emails should not block the customer's HTTP request.

### Cache invalidation
When server data changes, tell TanStack Query which cached data may be stale.

### Frontend security
React can improve the user experience, but cannot be trusted to enforce permissions.

### Automated testing
Tests make refactoring, upgrades and deployment safer.

### CI
Every change should automatically prove that old behavior still works.

### CD
Only verified code should move into production.

### Cloud networking
Public entry points and private workloads should have clearly separated responsibilities.

### IAM
Give every service only the permissions it actually needs.

### OIDC
Deployment systems can prove their identity and receive temporary cloud credentials instead of storing permanent keys.

### Infrastructure as Code
Once infrastructure is understood manually, Terraform makes it reproducible and reviewable.

### Teardown
Deleting cloud infrastructure and verifying costs are part of deployment engineering, not an afterthought.

---

# 160. Final Summary

ShopLite was not simply a Django CRUD exercise.

It gradually covered most of the important layers of a modern web application:

- HTTP and REST fundamentals
- Git
- Docker
- PostgreSQL
- Redis
- Python environments
- Django configuration
- custom users
- migrations
- ORM
- database constraints
- Django admin
- product images
- serializers
- ViewSets
- API permissions
- filtering and pagination
- JWT authentication
- CORS
- carts
- orders
- transactions
- row locking
- race conditions
- Celery background work
- automated backend tests
- React
- TypeScript
- Vite
- Tailwind
- shadcn/ui
- React Router
- Axios
- TanStack Query
- frontend authentication
- cart/checkout/order interfaces
- admin interfaces
- frontend tests
- production security settings
- Django LTS upgrades
- password reset
- HTML emails
- ratings/reviews
- wishlist
- payment gateway integration
- signed webhooks
- idempotency
- PostgreSQL full-text/fuzzy search
- GitHub Actions CI
- AWS production deployment
- ECS
- Fargate
- RDS
- ElastiCache
- S3
- CloudFront
- ECR
- ALB
- VPC networking
- IAM
- OIDC
- Parameter Store
- CloudWatch
- CI/CD
- cost control
- cloud teardown
- Terraform planning

The biggest lesson is that building a production-style application is not only about making a page work.

A reliable application also has to answer:

- Is the data correct?
- Can two users break it by acting at the same time?
- Can unauthorized users bypass the frontend?
- What happens when a dependency fails?
- What happens when a process crashes?
- Can I safely upgrade dependencies?
- Can I prove old behavior still works?
- Can I deploy without exposing secrets?
- Can I understand which exact version is running?
- Can I roll it back?
- Can I monitor it?
- Can I delete everything safely when I no longer need it?

ShopLite was built step by step to answer those questions, not just to display products in a browser.