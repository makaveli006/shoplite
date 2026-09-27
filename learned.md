Concept 1: Client and server

🧒 Simple: Think of a restaurant. You (the client) sit at a table and ask for things. The kitchen (the server) prepares them. You never walk into the kitchen; you only see what comes out.

🛠️ Developer: The client is the browser running our React app. The server is the Django process listening on a network port (localhost:8000). They are separate programs, and they only talk by sending messages over the network. During development both run on your PC, but they are still two separate programs.


Concept 2: HTTP, the language they speak

🧒 Simple: The waiter's order pad has a fixed format: table number, what you want, any special notes. The kitchen always answers the same way too: "here's your dish" or "sorry, we're out of that."

🛠️ Developer: HTTP is a request/response protocol.

- A request has four parts:
  - a method: what action you want to perform GET reads, POST creates, PUT/PATCH updates, DELETE removes
  - a URL is where the request should go for example /api/products/
  - headers are extra information about the request, such as Authorization: Bearer <token> or Content-Type: application/json
  - an optional body, the actual data you send usually with POST, PUT or PATCH for example {"name":"laptop","price":500000}
- A response has a status code, headers, and a body. The status codes you'll see most:

## 1xx — Informational

| Code | Status | Meaning |
|---|---|---|
| 100 | Continue | Continue sending the request |
| 101 | Switching Protocols | Server is switching protocols |
| 102 | Processing | Request is being processed |
| 103 | Early Hints | Preliminary response before final response |
| 104 | Upload Resumption Supported | Server supports resumable uploads |

---

## 2xx — Success

| Code | Status | Meaning |
|---|---|---|
| 200 | OK | Request completed successfully |
| 201 | Created | New resource created successfully |
| 202 | Accepted | Request accepted for processing |
| 203 | Non-Authoritative Information | Information came from another source |
| 204 | No Content | Successful request with no response body |
| 205 | Reset Content | Client should reset the current view/form |
| 206 | Partial Content | Only part of the resource was returned |
| 207 | Multi-Status | Multiple status results returned |
| 208 | Already Reported | Resource was already reported |
| 226 | IM Used | Instance manipulation was applied |

---

## 3xx — Redirection

| Code | Status | Meaning |
|---|---|---|
| 300 | Multiple Choices | Multiple possible resources |
| 301 | Moved Permanently | Resource permanently moved |
| 302 | Found | Temporary redirect |
| 303 | See Other | Retrieve another resource |
| 304 | Not Modified | Cached version can be used |
| 305 | Use Proxy | Resource should be accessed through proxy |
| 306 | Unused | Reserved / unused |
| 307 | Temporary Redirect | Temporary redirect while preserving HTTP method |
| 308 | Permanent Redirect | Permanent redirect while preserving HTTP method |

---

## 4xx — Client Errors

| Code | Status | Meaning |
|---|---|---|
| 400 | Bad Request | Invalid request or input |
| 401 | Unauthorized | Authentication required or failed |
| 402 | Payment Required | Reserved for payment-related use |
| 403 | Forbidden | Request understood, but access is not allowed |
| 404 | Not Found | Resource not found |
| 405 | Method Not Allowed | HTTP method not supported |
| 406 | Not Acceptable | Server cannot return an acceptable representation |
| 407 | Proxy Authentication Required | Proxy authentication required |
| 408 | Request Timeout | Request took too long |
| 409 | Conflict | Request conflicts with current resource state |
| 410 | Gone | Resource permanently removed |
| 411 | Length Required | Content-Length is required |
| 412 | Precondition Failed | Request condition failed |
| 413 | Content Too Large | Request body is too large |
| 414 | URI Too Long | Uniform Resource Identifier is too long |
| 415 | Unsupported Media Type | Unsupported content type |
| 416 | Range Not Satisfiable | Requested range is invalid |
| 417 | Expectation Failed | Server cannot satisfy request expectation |
| 418 | Unused / I'm a Teapot | Historically known as "I'm a teapot" |
| 421 | Misdirected Request | Request was sent to the wrong server |
| 422 | Unprocessable Content | Request syntax is valid but data cannot be processed |
| 423 | Locked | Resource is locked |
| 424 | Failed Dependency | Required dependent operation failed |
| 425 | Too Early | Request was received too early to process safely |
| 426 | Upgrade Required | Client must upgrade to another protocol |
| 428 | Precondition Required | Conditional request is required |
| 429 | Too Many Requests | Rate limit exceeded |
| 431 | Request Header Fields Too Large | Request headers are too large |
| 451 | Unavailable For Legal Reasons | Resource unavailable because of legal restrictions |

---

## 5xx — Server Errors

| Code | Status | Meaning |
|---|---|---|
| 500 | Internal Server Error | Generic server-side error |
| 501 | Not Implemented | Server does not support the requested functionality |
| 502 | Bad Gateway | Invalid response received from an upstream server |
| 503 | Service Unavailable | Server is temporarily unavailable |
| 504 | Gateway Timeout | Upstream server did not respond in time |
| 505 | HTTP Version Not Supported | HTTP version is unsupported |
| 506 | Variant Also Negotiates | Content negotiation configuration error |
| 507 | Insufficient Storage | Server does not have enough storage |
| 508 | Loop Detected | Infinite processing loop detected |
| 510 | Not Extended | Additional extensions are required |
| 511 | Network Authentication Required | Network authentication is required |

---

# HTTP Status Code Categories

```text
1xx → Informational
      Request received and processing continues

2xx → Success
      Request completed successfully

3xx → Redirection
      Client needs to take another action

4xx → Client Error
      Problem with the request

5xx → Server Error
      Problem while the server processed the request

When something breaks, the status code is the first clue you check.



Concept 3: JSON, the data format

🧒 Simple: A shipping label with labelled boxes ("Name: …, Price: …") that any computer can read, whatever language it's written in.

🛠️ Developer: JSON is text-based key/value data:
{ "id": 7, "name": "Blue Mug", "price": "12.50", "stock": 3, "category": { "slug": "kitchen" } }
In the backend, Django REST Framework serializers turn Python objects into JSON and back again, and check incoming data while doing so. In the frontend, Axios parses the JSON, and our TypeScript types describe its shape so the editor can catch mistakes.




Concept 4: REST API, the menu

🧒 Simple: A menu lists what you're allowed to order and how to ask for it. You can't order something that isn't on it.

🛠️ Developer: A REST API is a set of URLs that each represent a resource. Each HTTP method maps to a CRUD operation (Create, Read, Update, Delete):

┌───────────────┬────────────────────────────────┐
│    Action     │            Request             │
├───────────────┼────────────────────────────────┤
│ Read the list │ GET /api/products/             │
├───────────────┼────────────────────────────────┤
│ Read one      │ GET /api/products/blue-mug/    │
├───────────────┼────────────────────────────────┤
│ Create        │ POST /api/products/            │
├───────────────┼────────────────────────────────┤
│ Update        │ PATCH /api/products/blue-mug/  │
├───────────────┼────────────────────────────────┤
│ Delete        │ DELETE /api/products/blue-mug/ │
└───────────────┴────────────────────────────────┘

Concept 4: REST API, the menu

🧒 Simple: A menu lists what you're allowed to order and how to ask for it. You can't order something that isn't on it.

🛠️ Developer: A REST API is a set of URLs that each represent a resource. Each HTTP method maps to a CRUD operation (Create, Read, Update, Delete):

┌───────────────┬────────────────────────────────┐
│    Action     │            Request             │
├───────────────┼────────────────────────────────┤
│ Read the list │ GET /api/products/             │
├───────────────┼────────────────────────────────┤
│ Read one      │ GET /api/products/blue-mug/    │
├───────────────┼────────────────────────────────┤
│ Create        │ POST /api/products/            │
├───────────────┼────────────────────────────────┤
│ Update        │ PATCH /api/products/blue-mug/  │
├───────────────┼────────────────────────────────┤
│ Delete        │ DELETE /api/products/blue-mug/ │
└───────────────┴────────────────────────────────┘

The endpoint table in the plan is our store's complete "menu."




Concept 5: Frontend, backend, database = "full-stack"

🧒 Simple:
- Frontend = the shop floor customers walk around (shelves, signs, checkout counter).
- Backend = the back office that checks prices, stock, and who's allowed to do what.
- Database = the warehouse ledger that remembers everything permanently.
- Full-stack = building all three.

🛠️ Developer:

┌─────────────────┬─────────────────────────────────────────────────────────┬───────────────────────────────────────────────────────┐
│      Layer      │                        Our tech                         │               Job                      │
├─────────────────┼─────────────────────────────────────────────────────────┼───────────────────────────────────────────────────────┤
│ Frontend        │ React 19 + TypeScript + Vite, Tailwind/shadcn for looks │ Draws the UI and reacts to clicks                     │
├─────────────────┼─────────────────────────────────────────────────────────┼───────────────────────────────────────────────────────┤
│ Routing         │ React Router                                            │ Picks which page component matches the browser URL    │
├─────────────────┼─────────────────────────────────────────────────────────┼───────────────────────────────────────────────────────┤
│ Data fetching   │ Axios + TanStack Query                                  │ Sends HTTP requests and caches the responses          │
├─────────────────┼─────────────────────────────────────────────────────────┼───────────────────────────────────────────────────────┤
│ Backend         │ Django + DRF                                            │ URL → view → permission check → serializer → database │
├─────────────────┼─────────────────────────────────────────────────────────┼───────────────────────────────────────────────────────┤
│ Database        │ PostgreSQL 16 (in Docker)                               │ Stores users, products, and orders as tables          │
├─────────────────┼─────────────────────────────────────────────────────────┼───────────────────────────────────────────────────────┤
│ Background jobs │ Celery + Redis (in Docker)                              │ Runs slow work (emails) outside the request           │
└─────────────────┴─────────────────────────────────────────────────────────┴───────────────────────────────────────────────────────┘

Golden rule: the frontend is only for convenience, and the backend is where rules are enforced. Hiding an "Edit product" button doesn't stop anyone. Django's permission check does.





Concept 6: Background jobs (a preview)

🧒 Simple: When you pay at a café, the cashier doesn't personally bake your croissant while you wait. They drop a ticket in a tray and serve the next customer, and a baker picks up the ticket.

🛠️ Developer:
- Django puts a task message ("email confirmation for order #42") into Redis. Redis acts as the ticket tray, called a broker.
- It then returns the HTTP response immediately.
- A separate Celery worker process takes the message and runs the task.



Concept 2: The tools, each in one sentence

Docker / Docker Compose
- 🧒 Simple: Docker runs pre-packaged "appliances" (a database, Redis) in sealed boxes, so you don't install them into Windows itself. Compose is the recipe card that says "start these boxes together."
- 🛠️ Developer: Docker Desktop runs a Linux VM through WSL2, and containers run inside it. docker compose reads docker-compose.yml and manages several containers as one app. (Details in Phase 1.)

Node.js / npm
- 🧒 Simple: Node lets JavaScript run outside the browser, which our frontend build tools need. npm is its app store for code libraries.
- 🛠️ Developer: Vite, TypeScript, and the shadcn CLI are all Node programs. npm installs packages listed in package.json into node_modules and records exact versions in package-lock.json.

Git
- 🧒 Simple: A "save game" system for code. You can go back to any earlier save.
- 🛠️ Developer: A version control system. It stores snapshots (commits) of your files in .git/. It's also our real backup, since OneDrive isn't a good backup for code.

uv
- 🧒 Simple: A very fast personal assistant for Python. It fetches the right Python version, sets up an isolated workspace for this project, and installs exactly the libraries we list.
- 🛠️ Developer: A Rust-based replacement for pip + venv + pip-tools + pyenv. It manages Python installs, virtual environments, pyproject.toml dependencies, and a cross-platform uv.lock. It's much faster than pip and gives reproducible installs. (Deep dive in Phase 2.)


Concept 1: Git repository, staging, commit

🧒 Simple: Think of a photo album for your project. git add puts photos on the table ("I want these in the next page"). git commit glues them onto a new page with a caption. You can always flip back to any page.

🛠️ Developer:
- git init creates a hidden .git/ folder: the database of every snapshot.
- Files move through three areas:
  - Working directory: your actual files
  - Staging area (index): what you've chosen for the next snapshot, with git add
  - Repository: saved snapshots, with git commit
- Each commit stores who, when, a message, and a pointer to its parent commit. That chain is the history you see in git log.
- -b main names the first branch main. Your Git has no default set, so otherwise it would use the older name master.

Your Git identity is already configured (name + email), so commits will work.


Concept 2: .gitignore

🧒 Simple: A "do not pack" list for moving house. The house key (passwords) and rubbish bags (generated junk) stay behind. Only the real furniture (your code) goes into the album.

🛠️ Developer: Git checks each untracked file against the patterns in .gitignore. Matching files never show up in git status and can't be added by accident.

Rule of thumb: commit the recipe (pyproject.toml, uv.lock, package.json, package-lock.json), never the cooked result (.venv, node_modules). Note that uv.lock must be committed, because it's what makes installs reproducible.

Concept 3: Line endings (.gitattributes)

🧒 Simple: Windows and Linux mark "end of line" differently. It's like two countries writing dates differently (27/09 vs. 09/27). Usually harmless, but a Linux program reading a Windows-style script gets confused and fails.

🛠️ Developer:
- Windows uses CRLF (\r\n), while Linux uses LF (\n).
- Your Git has core.autocrlf=true, so it converts files to CRLF when it writes them to disk on Windows.
- Our Celery worker runs in a Linux container. A shell script with CRLF there fails with confusing errors like /bin/sh^M: bad interpreter or exec format error.
- .gitattributes overrides this per file type:
  - * text=auto: Git normalises line endings for all text files in the repo.
  - *.sh text eol=lf and Dockerfile text eol=lf: these always stay LF on disk, even on Windows.

Setting this now, before those files exist, means the bug never happens.




What & why

Our store needs a database (PostgreSQL 16) to remember users, products, and orders, and a message broker (Redis) for background jobs. Rather than installing them into Windows, we run them in Docker containers described by one file.

Files involved
django-ecommerce/
├── docker-compose.yml   ← NEW: which containers to run and how
├── .env                 ← NEW: real values (password etc.), git-ignored
└── .env.example         ← NEW: same keys with placeholder values, committed
How they connect: when you run docker compose up, Compose automatically reads .env from the same folder, replaces every ${POSTGRES_…} in docker-compose.yml with those values, then asks Docker to create the containers.


Concept 1: Image vs. container

🧒 Simple: An image is like a frozen ready-meal in the supermarket: sealed, identical for everyone, and it never changes. A container is one of those meals heated up and on your plate. You can heat up several from the same box, and eating one doesn't change the box.

🛠️ Developer:
- An image (e.g. postgres:16) is a read-only, layered filesystem plus a default start command, downloaded from Docker Hub. postgres is the repository and 16 is the tag (version).
- A container is a running process started from an image, with its own thin writable layer, network interface, and environment variables.
- Delete the container and its writable layer is gone. That's why database files need a volume (Concept 2).

On Windows, Docker Desktop runs these Linux containers inside a lightweight Linux VM (WSL2). Your docker info showed kernel ...microsoft-standard-WSL2.


Concept 2: Volume

🧒 Simple: The container is a rented flat you might move out of any time. A volume is your personal storage unit down the street. Even if you move out and a new flat is set up, your boxes (the data) are still in storage.

🛠️ Developer:
- A named volume (pgdata) is storage managed by Docker that lives independently of any container.
- We mount it at /var/lib/postgresql/data, where Postgres keeps its files. So docker compose down then up keeps all your tables.
- Only docker compose down -v (the -v means "delete volumes") wipes the data. We'll use that deliberately later when we want a fresh database.
- Redis gets no volume. It's our "ticket tray" for task messages, so losing it on restart is fine for development.


Concept 3: Port mapping

🧒 Simple: The container lives in its own building with its own internal phone extensions. Port mapping is the building's receptionist: "calls to our public number 5433 get forwarded to the container's internal extension 5432."

🛠️ Developer:
- "5433:5432" means HOST:CONTAINER. Docker listens on Windows port 5433 and forwards traffic to port 5432 inside the container, where Postgres listens by default.
- Programs on Windows (Django, psql, DBeaver) connect to localhost:5433.
- Containers in the same Compose project talk to each other over an internal network by service name, using the container port: db:5432, redis:6379. That's why the Celery worker container (Phase 8) will use db:5432, while Django on Windows uses localhost:5433.

---


Concept 4: Docker Compose, services, and healthchecks

🧒 Simple: Compose is a recipe card for a whole dinner: "a database, a Redis, cooked this way, served together." One command cooks everything. A healthcheck is the chef poking the dish every few seconds: "is it actually ready, or only on the stove?"

🛠️ Developer:
- Compose reads a YAML file that declares services. It creates one container per service, a shared network, and the named volumes.
- A healthcheck is a command Docker runs inside the container on an interval. Exit code 0 = healthy.
  - pg_isready checks whether Postgres accepts connections. That's different from "the process started," because Postgres needs a few seconds to initialise on first boot.
  - redis-cli ping expects PONG.
- docker compose ps shows (healthy). In Phase 8 the worker will wait for that with depends_on: condition: service_healthy.


Step 0: Make sure Docker Desktop is running (the whale icon in the taskbar says "Engine running").

Step 1: See the final config with the .env values filled in
docker compose config
Look for published: "5433" and POSTGRES_USER: shoplite. This is the best debugging command when you suspect a variable isn't being picked up.

Step 2: Start everything in the background
docker compose up -d
-d = detached, which means run in the background and give the terminal back. The first run downloads the images (about 150 MB). You should see db and redis reach Started or Healthy.

Step 3: Check status and health
docker compose ps
Wait about 10 seconds and run it again. Both should show Up ... (healthy), and db should show 0.0.0.0:5433->5432/tcp.

Step 4: Read the database logs
docker compose logs db
Near the end, look for: database system is ready to accept connections.

Step 5: Talk to Redis
docker compose exec redis redis-cli ping
Expected: PONG. exec runs a command inside an already-running container. Here that's the redis-cli program living in the Redis container, so you don't need Redis installed on Windows.

Step 6: See the volume
docker volume ls
You should see shoplite_pgdata next to your other projects' volumes.

Step 7: Commit
git status
git add docker-compose.yml .env.example
git commit -m "Add Docker Compose for PostgreSQL 16 and Redis"
In git status, notice that .env does not appear. It's protected.


## Django will talk to PostgreSQL for us through its ORM, so we'll rarely write SQL by hand. But when something goes wrong ("did my migration create the table?", "why is this order missing?"), you need to look directly at the database. Today you learn to do that, and we prove which Postgres server we're really talking to.


Concept 1: Database, table, row, column, primary key

🧒 Simple: A database is a filing cabinet. Each table is a drawer for one kind of thing (Products, Orders). Each row is one card in the drawer (one product). Each column is a field printed on every card (name, price). The primary key is the unique number stamped on each card, so you can never mix up two "Blue Mug" cards.

🛠️ Developer:
- PostgreSQL is a relational database server. One server holds many databases, each database holds schemas (by default public), and each schema holds tables.
- A table has typed columns (integer, varchar(100), numeric(10,2), timestamp, …) and rows.
- A primary key (id) uniquely identifies a row.
- A foreign key column stores another table's primary key. That's how "this product belongs to category 3" is represented.
- In Phase 3 each Django model becomes one table, each model field becomes a column, and ForeignKey becomes a foreign-key column like category_id.


Concept 2: Server vs. client (psql)

🧒 Simple: The database server is the librarian sitting in the back room. psql is the counter window where you type requests on a slip and the librarian answers.

🛠️ Developer:
- The server is the postgres process inside the container, listening on port 5432.
- psql is a command-line client that sends SQL over a network connection and prints the results. Django uses a client too: the psycopg driver.
- The client and server versions can differ. You'll see this below when your Windows psql 15 client talks to the Docker Postgres 16 server.


Concept 3: Why PostgreSQL instead of SQLite?

🧒 Simple: SQLite is a personal notebook: great for one person, but awkward when 50 cashiers need to write in it at the same moment. PostgreSQL is a proper bank vault with a staff who make sure everyone can write safely at the same time.

🛠️ Developer:
- SQLite is a single file with coarse locking, so only one writer at a time. PostgreSQL is a server with row-level locking and MVCC (readers never block writers).
- Our checkout uses SELECT … FOR UPDATE to lock product rows, so two customers can't buy the last item. That behaves properly only on a real server database.
- Postgres also enforces types and constraints strictly, which makes it the usual choice for Django in production. Developing on the same database you deploy on avoids "works on my machine" surprises.

Step 1: Open psql inside the container

docker compose exec db psql -U shoplite -d shoplite
- exec db runs a command inside the running db container.
- psql -U shoplite -d shoplite connects as user shoplite to the database shoplite.
- No password is asked because connections from inside the container are trusted by the image's default configuration.

Your prompt changes to shoplite=#. The # means you're a superuser. (The POSTGRES_USER becomes a superuser in this image.)



Step 2: Explore with meta-commands

Commands starting with \ are psql shortcuts, not SQL:
SELECT version();
\l
\du
\dt
\conninfo

┌───────────────────┬─────────────────────────────────────────────────────────────────────────────────────────────┐
│      Command      │                                     What you should see                                     │
├───────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────┤
│ SELECT version(); │ PostgreSQL 16.x .... This proves it's the Docker server. (Every SQL statement ends with ;.) │
├───────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────┤
│ \l                │ List of databases: shoplite, plus the built-in postgres, template0, and template1           │
├───────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────┤
│ \du               │ List of users/roles: shoplite with Superuser, Create role, ...                              │
├───────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────┤
│ \dt               │ Did not find any relations. The database is empty, and Django will fill it in Phase 2.      │
├───────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────┤
│ \conninfo         │ Which user, database, and connection you're on                                              │
└───────────────────┴─────────────────────────────────────────────────────────────────────────────────────────────┘




Step 3: Practice SQL CRUD on a throw-away table

Type these one at a time and read each result:
CREATE TABLE practice_product (
    id    SERIAL PRIMARY KEY,
    name  VARCHAR(100) NOT NULL,
    price NUMERIC(10, 2) NOT NULL
);

INSERT INTO practice_product (name, price) VALUES ('Blue Mug', 12.50), ('Red Pen', 1.99);

SELECT * FROM practice_product;

UPDATE practice_product SET price = 10.00 WHERE name = 'Blue Mug';

SELECT * FROM practice_product WHERE price < 11;

DELETE FROM practice_product WHERE name = 'Red Pen';

\d practice_product

DROP TABLE practice_product;
What each part teaches:
- SERIAL PRIMARY KEY: Postgres auto-numbers id (1, 2, 3…). Django does the same for every model.
- NUMERIC(10, 2): exact decimals, 10 digits in total and 2 after the dot. This is what Django's DecimalField becomes, and it's why money never uses floating point (0.1 + 0.2 ≠ 0.3 in floats).
- NOT NULL: the database itself refuses empty values.
- Create = INSERT, Read = SELECT, Update = UPDATE, Delete = DELETE. These are the same four operations our API exposes as POST/GET/PATCH/DELETE.
- \d table_name describes a table: its columns, types, and indexes. You'll use it after migrations.
- DROP TABLE removes our practice table so Django starts with a clean database.

⚠️ Always use WHERE with UPDATE/DELETE. Without it, the command changes every row.

Leave psql with:
\q

Step 4: Connect from Windows through port 5433 (prove the port mapping)

You already have a psql client on Windows from your PostgreSQL 15 install. Use it to connect to the Docker server the way Django will: over localhost:5433, with a password.
& "C:\Program Files\PostgreSQL\15\bin\psql.exe" -h localhost -p 5433 -U shoplite -d shoplite -c "SELECT version();"
- & is PowerShell's call operator. It's needed to run a program whose path is in quotes (because of the space in Program Files).
- It asks for a password: enter shoplite_dev_pw (from your .env). Nothing appears while you type, which is normal.
- Expected: a warning like psql: WARNING: psql major version 15, server major version 16. followed by PostgreSQL 16.x. That shows a client 15 talking to server 16, which proves port 5433 reaches the container and not your Windows service.

Now compare with port 5432:
& "C:\Program Files\PostgreSQL\15\bin\psql.exe" -h localhost -p 5432 -U shoplite -d shoplite -c "SELECT version();"
Expected: an error like FATAL: password authentication failed for user "shoplite" (or role "shoplite" does not exist). This is exactly the confusing error you'd get if Django pointed at the wrong port. You've now seen it once on purpose, so you'll recognise it.



Step 5 (bonus, 1 minute): Peek at Redis

docker compose exec redis redis-cli
SET greeting "hello"
GET greeting
KEYS *
DEL greeting
exit
🧒 Redis is a super-fast whiteboard: you write a value under a name and read it back instantly.
🛠️ It's an in-memory key-value store. Celery will use Redis lists as queues: Django pushes task messages in, and the worker pops them out. In Phase 8 you'll run KEYS * again and see Celery's queue key.


Concept 1: Packages and dependencies

🧒 Simple: Nobody builds a car from raw metal. You buy an engine, tyres, and seats from specialists. Packages are those ready-made parts (Django is the engine). Dependencies are the parts list, including the parts inside your parts: Django itself needs asgiref, sqlparse, and tzdata.

🛠️ Developer: Python packages are published on PyPI (pypi.org). Your direct dependencies (Django, DRF…) declare their own requirements, which are transitive dependencies. A package manager must resolve one set of versions that satisfies every constraint at once (e.g. DRF says django>=4.2, and you say django==5.1.7), then download and install them.


Concept 2: Virtual environment

🧒 Simple: Imagine every project gets its own private toolbox. Project A can use hammer v1 while project B uses hammer v2, and they never fight. Without toolboxes, everything is thrown into one shared garage and projects break each other.

🛠️ Developer: A virtual environment (.venv/) is a folder containing:
- a python.exe that points to a base interpreter (here, uv's CPython 3.12.12)
- its own Lib\site-packages\ where packages get installed
- pyvenv.cfg recording which base Python it uses

When you run that python.exe, imports resolve from its own site-packages, so nothing collides with the other Pythons on your machine. You have five (system 3.11, pyenv, uv 3.10–3.13), so isolation really matters here.


Concept 3: pyproject.toml and uv.lock

🧒 Simple: pyproject.toml is your shopping list: "Django exactly 5.1.7, and any DRF from 3.17.2 up." uv.lock is the receipt: the exact brand and version of every item that was actually bought, including things you didn't list yourself. Anyone with the receipt can rebuild exactly the same toolbox.

🛠️ Developer:
- pyproject.toml is the Python-standard project file. The [project] dependencies list holds version specifiers: ==5.1.7 means exactly this version, and >=3.17.2 means this or newer.
- uv.lock records the fully resolved dependency graph: exact versions, download URLs, and file hashes for every platform. Hashes mean a tampered download is rejected.
- uv sync rebuilds .venv exactly from the lock. A teammate does this, and so will our Docker worker in Phase 8.
- Commit both files. Never edit uv.lock by hand.



Concept 4: Why uv instead of pip

🧒 Simple: With pip, you're the one juggling everything: create the toolbox, open it, buy parts, remember to write down the list. uv is an assistant who does all of it with one instruction, and does it very fast.

🛠️ Developer:

┌───────────────────────────┬─────────────────────────────────────────────────────────┬────────────────────────────────────────────────────────┐
│            Job            │                     Traditional way                     │                                                                                                     uvway                │
├───────────────────────────┼─────────────────────────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ Install a Python version  │ download the installer / pyenv                          │ uv python install 3.12 (automatic when needed)         │
├───────────────────────────┼─────────────────────────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ Create a venv             │ python -m venv .venv                                    │ uv venv                                                │
├───────────────────────────┼─────────────────────────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ Add a dependency          │ pip install x, then remember to update requirements.txt │ uv add x (installs and records it in pyproject + lock) │
├───────────────────────────┼─────────────────────────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ Reproducible installs     │ pip freeze > requirements.txt (no hashes, one platform) │ uv.lock, automatically, cross-platform                 │
├───────────────────────────┼─────────────────────────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ Run a command in the venv │ activate first, then run                                │ uv run <cmd> (checks the env is in sync, then runs it) │
└───────────────────────────┴─────────────────────────────────────────────────────────┴────────────────────────────────────────────────────────┘

uv is written in Rust, installs packages in parallel, and caches downloads globally. Installs are often 10–100× faster than pip.




Step 1: Create the project

From the project root:
cd "$env:USERPROFILE\OneDrive\Desktop\django-ecommerce"
uv init backend --app --no-package --python 3.12

┌────────────────┬────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│      Part      │                                                              Meaning                                                               │
├────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ uv init        │ create a new project in a new folder called backend                                                                                │
│ backend        │                                                                                                                                    │
├────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ --app          │ it's an application (something you run), not a library others import                                                               │
├────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ --no-package   │ don't make it an installable package: no src/ folder, no build system. Django projects are just folders of Python code run by      │
│                │ manage.py.                                                                                                                         │
├────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ --python 3.12  │ sets requires-python = ">=3.12" and writes 3.12 into .python-version                                                               │
└────────────────┴────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

Because the folder is already inside a Git repo, uv doesn't create a second .git. Look at what it made:
Get-ChildItem -Force backend
Get-Content backend\pyproject.toml
Get-Content backend\.python-version
Expected: .python-version, main.py, pyproject.toml, README.md. The pyproject has requires-python = ">=3.12" and dependencies = [] (an empty shopping list for now).




Step 2: Check the Python pin

cd backend
uv python pin
uv python find
- uv python pin with no argument prints the current pin: 3.12. (uv python pin 3.13 would change it, but don't do that.)
- uv python find shows the exact interpreter uv will use: something like C:\Users\subin\AppData\Roaming\uv\python\cpython-3.12.12-...\python.exe. If 3.12 weren't installed, uv would download it automatically.



Step 3: Create the virtual environment

uv venv
Expected: Using CPython 3.12.12 … Creating virtual environment at: .venv, followed by an Activate with: .venv\Scripts\activate hint.

Look inside:
Get-ChildItem .venv
Get-Content .venv\pyvenv.cfg
.venv\Scripts\python.exe --version
pyvenv.cfg shows which base Python the venv is built on, and the last command prints Python 3.12.12.

Two ways to use a venv (try both):

(a) Activation (the traditional way):
.venv\Scripts\Activate.ps1
python --version
Get-Command python | Select-Object Source
deactivate
While activated, your prompt starts with (backend) and plain python means this venv's Python. Get-Command proves it. deactivate switches back.

(b) uv run (what we'll use):
uv run python --version
uv run main.py
uv run finds the project's .venv, makes sure it matches pyproject.toml/uv.lock (syncing it if needed), and runs the command inside it. There's no activation to forget and no chance of accidentally using your system Python 3.11. You should see Hello from backend!.





Step 4: Add the dependencies

uv add "django==5.1.7" djangorestframework "psycopg[binary]" python-dotenv

┌─────────────────────┬────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│       Package       │                                                         Why we need it                                                         │
├─────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ django==5.1.7       │ The web framework, pinned exactly to the version you chose. Quotes are needed so PowerShell doesn't misread ==.                │
├─────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ djangorestframework │ DRF: serializers, API views, permissions, and the browsable API                                                                │
├─────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ psycopg[binary]     │ The PostgreSQL driver (psycopg 3). [binary] is an extra that brings a precompiled version, so you don't need a C compiler on   │
│                     │ Windows. Quoted because PowerShell treats [ ] specially.                                                                       │
├─────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ python-dotenv       │ Reads backend/.env into environment variables (Lesson 2.3)                                                                     │
└─────────────────────┴────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

Expected output: Resolved 10 packages, a download progress, then the list + django==5.1.7, + djangorestframework==3.17.x, + psycopg==3.3.x, …

What uv add just did, in order:
1. added the four entries to pyproject.toml
2. resolved compatible versions for all packages, including transitive ones
3. wrote uv.lock
4. installed everything into .venv


Step 4: Add the dependencies
uv add "django==5.1.7" djangorestframework "psycopg[binary]" python-dotenv

Expected output: Resolved 10 packages, a download progress, then the list + django==5.1.7, + djangorestframework==3.17.x, + psycopg==3.3.x, …

What uv add just did, in order:
1. added the four entries to pyproject.toml
2. resolved compatible versions for all packages, including transitive ones
3. wrote uv.lock
4. installed everything into .venv


Step 5: Inspect the result

Get-Content pyproject.toml
uv tree
uv run python -c "import django; print(django.get_version())"
uv run django-admin --version
- pyproject.toml now lists "django==5.1.7", "djangorestframework>=3.17.2", and so on. uv writes >= (a minimum) for the packages you didn't pin.
- uv tree draws the dependency tree. You'll see Django needs asgiref, sqlparse, and tzdata, and that DRF depends on Django itself.
- Both version checks print 5.1.7. django-admin is Django's command-line tool, installed into .venv\Scripts\. We use it in Lesson 2.2.

Optionally, open uv.lock in your editor and scroll through it. You'll find each package's exact version and hash = "sha256:..." lines. Just look; don't edit.




What & why

Django is installed, but we have no Django project yet. Today django-admin startproject generates the skeleton: the settings file, the main URL list, and manage.py. We start the development server and see the first page. Then we trace what happened for that one request.

Files that will appear (inside backend\)
backend/
├── manage.py          ← NEW: your command centre (runserver, migrate, shell, test...)
├── config/            ← NEW: the project's configuration package
│   ├── __init__.py    ←   marks the folder as a Python package
│   ├── settings.py    ←   ALL configuration: installed apps, database, security...
│   ├── urls.py        ←   the root URL table: which URL goes to which view
│   ├── asgi.py        ←   entry point for async servers (production)
│   └── wsgi.py        ←   entry point for classic servers like gunicorn (production)
├── main.py            ← DELETE: uv's sample, not needed with Django
└── pyproject.toml, uv.lock, .python-version, README.md  (from Lesson 2.1)


Concept 1: Framework

🧒 Simple: Building a website from scratch is like building a restaurant from bare land: plumbing, electrics, fire exits, a till system. A framework is a pre-built restaurant shell with all of that installed and inspected. You only design the menu and decorate.

🛠️ Developer: Django gives you, ready-made:
- an HTTP request/response layer and URL routing
- an ORM (Python classes ↔ SQL tables) and a migration system
- authentication, sessions, and password hashing
- an auto-generated admin site
- forms and validation, security protections (CSRF, XSS, clickjacking, SQL injection), and a test runner

The framework calls your code at the right moments. That's "inversion of control": you write views and models, and Django decides when to run them.

Concept 2: Project vs. app

🧒 Simple: The project is the whole shopping mall: building rules, opening hours, security desk, the directory board at the entrance. Apps are the individual shops inside it: the product catalogue shop, the cart shop, the orders shop. Each shop is self-contained, but they all follow the mall's rules.

🛠️ Developer:
- an auto-generated admin site
- forms and validation, security protections (CSRF, XSS, clickjacking, SQL injection), and a test runner

The framework calls your code at the right moments. That's "inversion of control": you write views and models, and Django decides when to run them.

Concept 2: Project vs. app

🧒 Simple: The project is the whole shopping mall: building rules, opening hours, security desk, the directory board at the entrance. Apps are the individual shops inside it: the product catalogue shop, the cart shop, the orders shop. Each shop is self-contained, but they all follow the mall's rules.

🛠️ Developer:
- The project (config/) is global configuration: settings.py plus the root urls.py. We named it config rather than ecommerce because that says what it is: configuration.
- An app is a Python package with one responsibility (models, views, serializers, admin, tests), registered in INSTALLED_APPS.
- We'll create accounts, catalog, cart, orders, and core apps. Django's own features are apps too: django.contrib.admin, django.contrib.auth, and so on.

Concept 3: The request → response cycle

🧒 Simple: A letter arrives at the mall. Security checks it (mard says which shop it's for (URLs). The shopkeeper writes a
reply (view). The reply goes back out through security, which , and it's sent to the customer.

🛠️ Developer: For GET http://127.0.0.1:8000/admin/:
Browser ──HTTP──▶ runserver (WSGI server)
                    │ builds an HttpRequest object
                    ▼
               MIDDLEWARE (top → bottom)   security headers, sessions, CSRF, auth (sets request.user)...
                    ▼
               ROOT_URLCONF = config/urls.py   urlpatterns matched top → bottom
                    ▼
               view function / class        your code: may query the DB via the ORM
                    ▼ returns HttpResponse
               MIDDLEWARE (bottom → top)    may add headers / cookies
                    ▼
Browser ◀──HTTP── status code + headers + body
Every Django feature we add plugs into one of these stages. For example, CORS (Phase 5) is a middleware, and DRF API views are views.

Concept 4: manage.py and settings

🧒 Simple: manage.py is the mall manager's walkie-talkie: "start the doors," "update the floor plan," "run a safety drill." settings.py is the mall's rulebook that the manager reads first.

🛠️ Developer:
- manage.py sets the environment variable DJANGO_SETTINGS_MODULE=config.settings, then hands your command (runserver, migrate, shell, test, …) to Django's management framework.
- Django imports settings.py once at startup. Every setting is a plain Python constant. That's why we can compute values from environment variables in Lesson 2.3.
- django-admin is the same tool without a project attached. It's used only this once, to create the project.




▶️ Your turn (PowerShell)

Step 1: Leave the activated venv and go to backend\

deactivate
cd "$env:USERPROFILE\OneDrive\Desktop\django-ecommerce\backend"

Step 2: Generate the project

uv run django-admin startproject config .

┌───────────────────────┬─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│         Part          │                                                           Meaning                                                           │
├───────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ uv run                │ run inside backend\.venv (where Django is installed)                                                                        │
├───────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ django-admin          │ Django's project generator                                                                                                  │
│ startproject          │                                                                                                                             │
├───────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ config                │ name of the project package, so the folder is config/                                                                       │
├───────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ .                     │ put it in the current folder. Without the dot, Django creates config/config/settings.py (an extra nesting level), which     │
│                       │ confuses beginners and adds nothing.                                                                                        │
└───────────────────────┴─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

Then remove uv's sample file and look at the result:
Remove-Item main.py
Get-ChildItem
Get-ChildItem config
Expected: manage.py and config\ next to pyproject.toml; inside config\: __init__.py, asgi.py, settings.py, urls.py, wsgi.py.



Step 3: Read the generated files

Open backend\ in your editor. In VS Code, code . works from this folder. Read these files while checking the notes below.

manage.py, the key line:
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
→ "if nobody said otherwise, the settings live in config/settings.py."

config/settings.py, the important settings:

┌──────────────────────────────────┬────────────────────────────────────────────────────────────────────────────────────┬─────────────────────────────┐
│             Setting              │                                    What it does                                    │      What we'll change      │
├──────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────┼─────────────────────────────┤
│ BASE_DIR                         │ Path of backend\, computed from this file's location. Used to build other paths.   │ Nothing                     │
├──────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────┼─────────────────────────────┤
│ SECRET_KEY =                     │ Signs sessions, password-reset tokens, and (later) JWTs. Anyone who has it can     │ Move to .env (Lesson 2.3)   │
│ 'django-insecure-...'            │ forge them.                                                                        │                             │
├──────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────┼─────────────────────────────┤
│ DEBUG = True                     │ Shows detailed error pages. Never in production, because it leaks code and         │ From .env                   │
│                                  │ settings.                                                                          │                             │
├──────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────┼─────────────────────────────┤
│ ALLOWED_HOSTS = []               │ Which domain names this server answers to. With DEBUG=True, localhost is allowed   │ From .env                   │
│                                  │ automatically.                                                                     │                             │
├──────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────┼─────────────────────────────┤
│ INSTALLED_APPS                   │ Every app Django loads: admin, auth, sessions, etc.                                │ Add DRF, our apps, and more │
├──────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────┼─────────────────────────────┤
│ MIDDLEWARE                       │ The security/session/auth pipeline from Concept 3, in order                        │ Add CORS (Phase 5)          │
├──────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────┼─────────────────────────────┤
│ ROOT_URLCONF = 'config.urls'     │ Where URL matching starts                                                          │ Nothing                     │
├──────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────┼─────────────────────────────┤
│ DATABASES                        │ Currently SQLite (db.sqlite3 file)                                                 │ Switch to Postgres (Lesson  │
│                                  │                                                                                    │ 2.4)                        │
├──────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────┼─────────────────────────────┤
│ AUTH_PASSWORD_VALIDATORS         │ Rules like "min 8 chars" and "not too common"                                      │ Reused by our register API  │
├──────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────┼─────────────────────────────┤
│ TIME_ZONE = 'UTC', USE_TZ = True │ Store times in UTC and convert for display. Best practice.                         │ Keep                        │
├──────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────┼─────────────────────────────┤
│ STATIC_URL, DEFAULT_AUTO_FIELD   │ CSS/JS file URLs; primary keys become 64-bit BigAutoField                          │ Keep                        │
└──────────────────────────────────┴────────────────────────────────────────────────────────────────────────────────────┴─────────────────────────────┘

config/urls.py:
urlpatterns = [
    path('admin/', admin.site.urls),
]
→ right now the site knows exactly one URL prefix: admin/.

Step 4: Start the development server

uv run python manage.py runserver
Expected output:
Watching for file changes with StatReloader
Performing system checks...

System check identified no issues (0 silenced).

You have 18 unapplied migration(s). Your project may not work properly until you apply the migrations for app(s): admin, auth, contenttypes, sessions.
Run 'python manage.py migrate' to apply them.
...
Django version 5.1.7, using settings 'config.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.

▎ 🛑 IMPORTANT: do not run migrate yet, even though Django suggests it
▎
▎ Migrating now would create the built-in auth_user table. We're going to replace Django's default User with our own custom User model (Lesson 2.5), and Django's docs warn that switching the user model after the first migration is very painful. We'll migrate once, properly, in Lesson 2.6. The warning is safe to ignore until then.





Step 5: Visit it in the browser

1. Open http://127.0.0.1:8000/. You'll see Django's rocket 🚀 "The install worked successfully!" page. It only appears because DEBUG=True and you have no URL for /.
2. Open http://127.0.0.1:8000/nothing-here/. You'll see a yellow 404 debug page listing the URL patterns Django tried (admin/). This is Concept 3 in action: URL matching failed, so there's no view and the result is 404.
3. Look at the PowerShell window. Every request is logged:
[27/Sep/2026 13:05:10] "GET / HTTP/1.1" 200 12068
[27/Sep/2026 13:05:21] "GET /nothing-here/ HTTP/1.1" 404 2261
   That's the method, path, status code, and response size in bytes, the same parts of HTTP you studied in Lesson 0.1.
4. Don't open /admin/ yet. It needs the tables we haven't migrated, so you'd get a no such table error.

Auto-reload: "Watching for file changes with StatReloader" means that when you save a .py file, the server restarts itself. You'll rely on this constantly.

Stop the server with Ctrl+C.

Step 6: A side effect to notice

Get-ChildItem
You'll probably see a new db.sqlite3 file. The migration check at startup opened the default SQLite database, and SQLite creates the file on first connection. It's empty and harmless, and .gitignore already ignores *.sqlite3. We delete it in Lesson 2.4 when we switch to Postgres.


1. Open http://127.0.0.1:8000/. You'll see Django's rocket 🚀 "The install worked successfully!" page. It only appears because DEBUG=True and you have no URL for /.
2. Open http://127.0.0.1:8000/nothing-here/. You'll see a yellow 404 debug page listing the URL patterns Django tried (admin/). This is Concept 3 in action: URL matching failed, so there's no view and the result is 404.
3. Look at the PowerShell window. Every request is logged:
[27/Sep/2026 13:05:10] "GET / HTTP/1.1" 200 12068
[27/Sep/2026 13:05:21] "GET /nothing-here/ HTTP/1.1" 404 2261
   That's the method, path, status code, and response size in bytes, the same parts of HTTP you studied in Lesson 0.1.
4. Don't open /admin/ yet. It needs the tables we haven't migrated, so you'd get a no such table error.

Auto-reload: "Watching for file changes with StatReloader" means that when you save a .py file, the server restarts itself. You'll rely on this constantly.

Stop the server with Ctrl+C.






What & why

Right now settings.py contains SECRET_KEY = 'django-insecure-...', DEBUG = True, and ALLOWED_HOSTS = [] written directly in code, and that file is committed to Git. Today we move these values into backend\.env, a git-ignored file. The same code can then run with different values on your laptop, in the Docker worker, and on a real server.

Files involved
backend/
├── .env            ← NEW (I created it, git-ignored): YOUR real values, including a freshly generated secret key
├── .env.example    ← NEW (committed): the same keys with placeholders, plus how to generate a key
└── config/
    └── settings.py ← CHANGED: reads SECRET_KEY / DEBUG / ALLOWED_HOSTS from the environment
How they connect:
manage.py → imports config/settings.py → load_dotenv(BASE_DIR / '.env')
                                            │ copies each KEY=value into os.environ
                                            ▼          (unless that KEY already exists there)
                    SECRET_KEY = os.environ['DJANGO_SECRET_KEY']
                    DEBUG      = env_bool('DJANGO_DEBUG')
                    ALLOWED_HOSTS = env_list('DJANGO_ALLOWED_HOSTS')

---

Concept 1: Environment variables

🧒 Simple: Think of a hotel. The building (your code) is the same for every guest. But each guest gets their own key card with their room number and access rights (the configuration). You don't rebuild the hotel for a new guest. You program a new card.

🛠️ Developer: Every running process has a set of key/value strings called environment variables, inherited from whatever started it (PowerShell, Docker, a server). Python reads them through os.environ. The "12-factor app" principle says configuration that changes between environments (secrets, debug flags, hostnames, database addresses) belongs in env vars, not in code. Then:
- the same code runs in dev, in Docker, and in production;
- secrets never enter Git;
- changing configuration doesn't require a code change.

Concept 2: .env files and python-dotenv

🧒 Simple: Typing all your key-card settings by hand every morning would be tedious. A .env file is a sticky note next to the door with all the settings written down. load_dotenv reads the sticky note and programs the card for you.

🛠️ Developer: load_dotenv(path) parses KEY=value lines and inserts them into os.environ. I checked the python-dotenv docs: by default override=False, so a variable that already exists in the real environment wins over the file. That's deliberate. In Phase 8, Docker Compose will set DB_HOST=db for the worker, and that must beat DB_HOST=localhost from .env. In the file, a value in single quotes is taken literally, so characters like $ and # in the secret key can't be misread as variables or comments.

Concept 3: SECRET_KEY, DEBUG, ALLOWED_HOSTS

🧒 Simple:
- SECRET_KEY is the wax seal stamp the shop uses on receipts. If a thief copies the stamp, they can forge receipts ("this person is logged in as the admin").
- DEBUG=True is the workshop mode where the walls are made of glass: great for the builder, a disaster if customers can see the wiring.
- ALLOWED_HOSTS is the list of addresses this shop answers to. Letters addressed to other names get thrown away.

🛠️ Developer:
- SECRET_KEY is used for cryptographic signing: session cookies, password-reset tokens, and the signing module. In Phase 5 SimpleJWT signs tokens with it by default. The old key in settings.py is in Git history now (commit c9bd276), so treat it as leaked. That's why I generated a new one with Django's get_random_secret_key() for your .env.
- DEBUG=True shows full tracebacks with local variables and settings, serves static files, and keeps extra data in memory. In production that leaks internals. Our code defaults to False, so forgetting to set it is the safe mistake.
- ALLOWED_HOSTS: Django rejects requests whose Host header isn't listed. This protects against Host-header attacks such as poisoned password-reset links. When DEBUG=False, Django refuses to start without it.

Concept 4: "Fail fast"

🧒 Simple: A car that refuses to start with no oil is annoying. A car that starts and seizes on the motorway is dangerous.

🛠️ Developer: os.environ['DJANGO_SECRET_KEY'] (square brackets) raises KeyError right at startup if the variable is missing. Compare os.getenv('X', 'some-default'), which silently continues. A missing secret key must be a loud error, never a silent fallback to a known value. For DEBUG/ALLOWED_HOSTS, safe defaults are fine, so we use os.getenv.

---

The code, explained (config/settings.py)

import os
from pathlib import Path

from dotenv import load_dotenv            # from the python-dotenv package we added with uv

BASE_DIR = Path(__file__).resolve().parent.parent   # = backend\

load_dotenv(BASE_DIR / '.env')           # an absolute path, so it works no matter which folder you run from

written down. load_dotenv reads the sticky note and programs the card for you.

🛠️ Developer: load_dotenv(path) parses KEY=value lines and inserts them into os.environ. I checked the python-dotenv docs: by default override=False, so a variable that already exists in the real environment wins over the file. That's deliberate. In Phase 8, Docker Compose will set DB_HOST=db for the worker, and that must beat DB_HOST=localhost from .env. In the file, a value in single quotes is taken literally, so characters like $ and # in the secret key can't be misread as variables or comments.

Concept 3: SECRET_KEY, DEBUG, ALLOWED_HOSTS

🧒 Simple:
- SECRET_KEY is the wax seal stamp the shop uses on receipts. If a thief copies the stamp, they can forge receipts ("this person is logged in as the admin").
- DEBUG=True is the workshop mode where the walls are made of glass: great for the builder, a disaster if customers can see the wiring.
- ALLOWED_HOSTS is the list of addresses this shop answers to. Letters addressed to other names get thrown away.

🛠️ Developer:
- SECRET_KEY is used for cryptographic signing: session cookies, password-reset tokens, and the signing module. In Phase 5 SimpleJWT signs tokens with it by default. The old key in settings.py is in Git history now (commit c9bd276), so treat it as leaked. That's why I generated a new one with Django's get_random_secret_key() for your .env.
- DEBUG=True shows full tracebacks with local variables and settings, serves static files, and keeps extra data in memory. In production that leaks internals. Our code defaults to False, so forgetting to set it is the safe mistake.
- ALLOWED_HOSTS: Django rejects requests whose Host header isn't listed. This protects against Host-header attacks such as poisoned password-reset links. When DEBUG=False, Django refuses to start without it.

Concept 4: "Fail fast"

🧒 Simple: A car that refuses to start with no oil is annoying. A car that starts and seizes on the motorway is dangerous.

🛠️ Developer: os.environ['DJANGO_SECRET_KEY'] (square brackets) raises KeyError right at startup if the variable is missing. Compare os.getenv('X', 'some-default'), which silently continues. A missing secret key must be a loud error, never a silent fallback to a known value. For DEBUG/ALLOWED_HOSTS, safe defaults are fine, so we use os.getenv.

---

The code, explained (config/settings.py)

import os
from pathlib import Path

from dotenv import load_dotenv            # from the python-dotenv package we added with uv

BASE_DIR = Path(__file__).resolve().parent.parent   # = backend\

load_dotenv(BASE_DIR / '.env')           # an absolute path, so it works no matter which folder you run from


def env_bool(name, default=False):
    # env vars are ALWAYS strings: "False" is a non-empty string, which Python treats as True!

from dotenv import load_dotenv            # from the python-dotenv package we added with uv

BASE_DIR = Path(__file__).resolve().parent.parent   # = backend\

load_dotenv(BASE_DIR / '.env')           # an absolute path, so it works no matter which folder you run from


def env_bool(name, default=False):
    # env vars are ALWAYS strings: "False" is a non-empty string, which Python treats as True!
    # So we convert explicitly: only "1/true/yes/on" count as True.
    return os.getenv(name, str(default)).strip().lower() in ('1', 'true', 'yes', 'on')


def env_list(name, default=''):
    # "localhost, 127.0.0.1" → ['localhost', '127.0.0.1']  (ignores spaces and empty items)
    return [item.strip() for item in os.getenv(name, default).split(',') if item.strip()]


SECRET_KEY = os.environ['DJANGO_SECRET_KEY']                        # required: crash if missing
DEBUG = env_bool('DJANGO_DEBUG', False)                             # safe default: off
ALLOWED_HOSTS = env_list('DJANGO_ALLOWED_HOSTS', 'localhost,127.0.0.1')
The #1 beginner bug this code avoids: DEBUG = os.getenv('DJANGO_DEBUG') gives the string "False", and bool("False") is True. Environment variables are always text, so you must convert them yourself.

backend\.env (yours, ignored by Git):
DJANGO_SECRET_KEY='8h3p…'   # 50 random characters, generated for you
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
I already ran manage.py check and read the settings back. Django starts, the key loads with all 50 characters, and git status shows .env.example but not .env.

---


BASE_DIR = Path(__file__).resolve().parent.parent   # = backend\





▶️ Your turn (PowerShell, in backend\)

cd "$env:USERPROFILE\OneDrive\Desktop\django-ecommerce\backend"

Step 1: See exactly what changed

git diff config/settings.py
Lines starting with - (red) were removed and lines with + (green) were added. Reviewing a diff before committing is a habit worth building now.

Step 2: Ask Django which values it actually loaded

uv run python manage.py shell -c "from django.conf import settings; print(settings.DEBUG, settings.ALLOWED_HOSTS, settings.SECRET_KEY[:4])"
Expected: True ['localhost', '127.0.0.1'] 8h3p
manage.py shell -c "..." runs one Python snippet with Django fully loaded. django.conf.settings is the final, computed settings object. This is the most reliable way to answer "what value is Django really using?"

Step 3: Prove "real environment beats .env"

$env:DJANGO_DEBUG = "False"
uv run python manage.py shell -c "from django.conf import settings; print(settings.DEBUG)"
Expected: False. $env:NAME = "..." sets an env var for this PowerShell window only, and it beat the True in .env.

With it still set, start the server:
uv run python manage.py runserver
Open http://127.0.0.1:8000/nothing-here/. Instead of the yellow debug page you now get a plain "Not Found", which is what visitors would see in production. Even / now returns "Not Found", because the rocket page only exists in debug mode. Stop the server (Ctrl+C) and clean up:
Remove-Item Env:DJANGO_DEBUG
uv run python manage.py shell -c "from django.conf import settings; print(settings.DEBUG)"
Back to True, from the .env file.

Step 4: Watch "fail fast" happen, and practise reading a traceback

Temporarily hide the .env file:
Rename-Item .env .env.hidden
uv run python manage.py check
You'll get a long traceback. Read Python tracebacks from the bottom up. The last line is what went wrong, and the lines just above it show where:
  File "...\backend\config\settings.py", line 35, in <module>
    SECRET_KEY = os.environ['DJANGO_SECRET_KEY']
  ...
KeyError: 'DJANGO_SECRET_KEY'
Diagnosis: "settings.py line 35 needed DJANGO_SECRET_KEY and tt, so the .env file wasn't loaded." Put it back and confirm:
Rename-Item .env.hidden .env
uv run python manage.py check
Expected: System check identified no issues (0 silenced).




What & why

Django is still configured for SQLite (the empty db.sqlite3 file). Our store needs PostgreSQL, and it's already running in Docker from Phase 1. Today we point Django at it. We still don't run migrate, because the custom User model comes first (Lesson 2.5).

Files involved
django-ecommerce/
├── .env                    ← (unchanged) POSTGRES_* : Docker Compose uses these to CREATE the database
└── backend/
    ├── .env                ← CHANGED: added DB_NAME / DB_USER / DB_PASSWORD / DB_HOST / DB_PORT
    ├── .env.example        ← CHANGED: the same keys with a placeholder password
    ├── config/settings.py  ← CHANGED: DATABASES now uses the postgresql engine
    └── db.sqlite3          ← DELETE: no longer used
How the pieces connect:
root .env ──(compose, first boot)──▶ Postgres container creates user "shoplite", password, database "shoplite"
                                          ▲  listening on container port 5432
                                          │  Docker forwards Windows localhost:5433 → container 5432
backend/.env ──load_dotenv──▶ settings.DATABASES ──psycopg──▶ localhost:5433
The two .env files are read by different programs: Compose reads the root one, and Django reads backend\.env. That's why the name, user, and password appear in both, and they must match.

---

Concept 1: Database connection settings

🧒 Simple: To phone a company's accounts department you need the company's number (host), the extension (port), which department (database name), and your staff ID and PIN (user and password). Get any one wrong and you don't get through.

🛠️ Developer: Django's DATABASES['default'] holds exactly those five values, plus ENGINE, which says which backend to use.

┌─────────────────┬───────────────────────────────┬─────────────────────────────────────────────────────────────────────────┐
│       Key       │           Our value           │                                 Meaning                                 │
├─────────────────┼───────────────────────────────┼─────────────────────────────────────────────────────────────────────────┤
│ ENGINE          │ django.db.backends.postgresql │ Django's PostgreSQL backend. It uses the psycopg 3 driver we installed. │
├─────────────────┼───────────────────────────────┼─────────────────────────────────────────────────────────────────────────┤
│ HOST            │ localhost                     │ the machine to connect to (your PC, where Docker forwards the port)     │
├─────────────────┼───────────────────────────────┼─────────────────────────────────────────────────────────────────────────┤
│ PORT            │ 5433                          │ the forwarded port (5432 would reach your Windows Postgres 15)          │
├─────────────────┼───────────────────────────────┼─────────────────────────────────────────────────────────────────────────┤
│ NAME            │ shoplite                      │ which database on that server                                           │
├─────────────────┼───────────────────────────────┼─────────────────────────────────────────────────────────────────────────┤
│ USER / PASSWORD │ shoplite / shoplite_dev_pw    │ the login created by the container on first boot                        │
└─────────────────┴───────────────────────────────┴─────────────────────────────────────────────────────────────────────────┘

Concept 2: ORM, database backend, and driver

🧒 Simple: You speak English (Python). The database only understands its own language (SQL). The ORM is your translator: you say "give me all products under $20," and it writes the SQL. The driver is the phone line that carries the translated words to the database.

🛠️ Developer: There are three layers:
1. ORM: Product.objects.filter(price__lt=20) builds a query object.
2. Database backend (django.db.backends.postgresql): compiles it into Postgres-flavoured SQL, e.g. SELECT ... WHERE "price" < 20.
3. Driver (psycopg): opens the TCP connection, sends the SQL, and returns rows as Python values.

Swapping SQLite for Postgres only changes layers 2 and 3. Your model code stays exactly the same. Django connects lazily: nothing connects at import time. The first query opens a connection, and by default it's closed at the end of each request.

---

The code, explained

config/settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',  # uses the psycopg (v3) driver
        'NAME': os.environ['DB_NAME'],              # required → fail fast if missing
        'USER': os.environ['DB_USER'],
        'PASSWORD': os.environ['DB_PASSWORD'],
        'HOST': os.getenv('DB_HOST', 'localhost'),  # optional, with sensible defaults
        'PORT': os.getenv('DB_PORT', '5432'),
    }
}
- Name, user, and password have no defaults. A missing credential should crash loudly (Lesson 2.3's fail-fast rule).
- Host and port have the standard Postgres defaults, but our .env sets DB_PORT=5433. In Phase 8 the worker container gets DB_HOST=db and DB_PORT=5432 from Compose, which override .env because real env vars win. That's why these are variables and not fixed values.

backend/.env (new part):
DB_NAME=shoplite
DB_USER=shoplite
DB_PASSWORD='shoplite_dev_pw'
DB_HOST=localhost
DB_PORT=5433

I already verified the connection (read-only). Django reached PostgreSQL 16.15 on port 5433, and \dt in the container still says "Did not find any relations". Connecting doesn't create tables. Only migrate does.

---

▶️ Your turn (PowerShell)

cd "$env:USERPROFILE\OneDrive\Desktop\django-ecommerce\backend"
docker compose ps
Both db and redis should be (healthy). The database must be running before Django can connect. (docker compose finds the compose file in the parent folder automatically.)

Step 1: Remove the SQLite file

Remove-Item db.sqlite3

Step 2: Ask Django which database it's really talking to

uv run python manage.py shell -c "from django.db import connection; c = connection.cursor(); c.execute('SELECT version()'); print(connection.vendor, connection.settings_dict['PORT'], c.fetchone()[0])"
Expected: postgresql 5433 PostgreSQL 16.15 (Debian ...) ...
- connection is Django's database connection object, and .cursor() opens the real connection.
- c.execute('SELECT version()') runs raw SQL through Django: the same query you typed in psql in Lesson 1.4.

Step 3: See what migrate would do, without doing it

uv run python manage.py showmigrations
Expected: lists for admin, auth, contenttypes, and sessions, every line with an empty [ ].
- Each line is one migration file that ships with Django. [ ] means not applied, and [X] will mean applied.
- Django stores applied migrations in a table called django_migrations. It doesn't exist yet, so everything is [ ].

(We'll dig into migrations properly in Lesson 2.6.)

Step 4: Debugging practice, two classic failures

(a) Wrong port. You'd reach the other Postgres:
$env:DB_PORT = "5432"
uv run python manage.py showmigrations
Read the last line of the traceback:
django.db.utils.OperationalError: connection failed: ... port 5432 failed: FATAL:  password authentication failed for user "shoplite"
This is the same message you saw with psql in Lesson 1.4. Diagnosis: the server answered, so the network is fine, but it doesn't know our user, so it's the wrong server. Undo it:
Remove-Item Env:DB_PORT

(b) Database not running:
docker compose stop db
uv run python manage.py showmigrations
Last line, roughly:
django.db.utils.OperationalError: connection failed: connection to server at "127.0.0.1", port 5433 failed: Connection refused
    Is the server running on that host and accepting TCP/IP connections?
Diagnosis: nobody answered on 5433, so the server is down or on a different port. Start it again and wait for healthy:
docker compose start db
docker compose ps
uv run python manage.py showmigrations

Learn to tell these three database errors apart:

┌────────────────────────────────┬─────────────────────────────────────────────┬──────────────────────────────────────────────┐
│           Error text           │                   Meaning                   │             First thing to check             │
├────────────────────────────────┼─────────────────────────────────────────────┼──────────────────────────────────────────────┤
│ Connection refused             │ Nothing listening on that host:port         │ docker compose ps, and DB_PORT               │
├────────────────────────────────┼─────────────────────────────────────────────┼──────────────────────────────────────────────┤
│ password authentication failed │ Something answered but rejected the login   │ Wrong server/port, or wrong password in .env │
├────────────────────────────────┼─────────────────────────────────────────────┼──────────────────────────────────────────────┤
│ database "xyz" does not exist  │ Right server and login, wrong database name │ DB_NAME vs. POSTGRES_DB                      │
└────────────────────────────────┴─────────────────────────────────────────────┴──────────────────────────────────────────────┘

Step 5: Start the server once more

uv run python manage.py runserver
It starts as before, still with the "18 unapplied migrations" warning, but this time the check ran against Postgres. Stop it with Ctrl+C.



What & why

Every store needs users. Django ships with a built-in User model, but Django's own documentation recommends that every new project define its own User model from the start, even if it's identical at first. Our version also changes one thing a store needs: customers log in with their email, and each email can be used only once.

This must happen before the first migrate. That's why you've been ignoring the "18 unapplied migrations" warning.

About who ran what

I ran uv run python manage.py startapp accounts this time, so the model code could go straight into the generated files in one lesson. You'll create the next apps (catalog, cart, orders) yourself.

Files involved
backend/
├── accounts/                    ← NEW app (generated by startapp)
│   ├── __init__.py              ←   makes it a Python package
│   ├── apps.py                  ←   AccountsConfig: the app's name/label for Django
│   ├── models.py                ←   ✏️ our User model
│   ├── forms.py                 ←   ✏️ NEW: admin forms pointed at our User
│   ├── admin.py                 ←   ✏️ registers User in the admin site
│   ├── migrations/__init__.py   ←   migration files will be generated here (Lesson 2.6)
│   ├── tests.py, views.py       ←   empty for now (used in Phases 5 and 9)
└── config/settings.py           ← ✏️ 'accounts' in INSTALLED_APPS, AUTH_USER_MODEL, connect_timeout
How they connect:
settings.INSTALLED_APPS includes 'accounts' ─▶ Django loads accounts/models.py (User) and accounts/admin.py
settings.AUTH_USER_MODEL = 'accounts.User'   ─▶ everything that needs "the user model" uses OUR class:
                                                 admin login, createsuperuser, sessions, request.user,
                                                 JWT login (Phase 5), and ForeignKeys from Cart/Order (Phases 6-7)

---

Concept 1: What an "app" is (in practice)

🧒 Simple: A new shop moving into the mall. It gets its own storefront, with a stockroom (models), a counter (views), a display window in the manager's office (admin), and a filing drawer for its floor-plan changes (migrations). It only opens once it's on the mall's official list (INSTALLED_APPS).

🛠️ Developer: startapp creates a Python package with conventional modules. Django discovers things by convention: models in models.py, admin registrations in admin.py, migrations in migrations/. Adding 'accounts' to INSTALLED_APPS activates all of that. The app's label (accounts) is used in references like 'accounts.User' and in table names (accounts_user).

Concept 2: Model and inheritance (AbstractUser)

🧒 Simple: A model is a blueprint for one kind of record, like a form template "Customer: name, email, password." AbstractUser is a professionally designed template that already has every standard box. We copy it and change one box: "Email: must be filled in, and nobody else may use the same one."

🛠️ Developer:
- A model is a Python class inheriting from models.Model. Each class attribute that's a Field becomes a column.
- AbstractUser is an abstract model (class Meta: abstract = True), which means it creates no table of its own. It only provides fields and methods to subclasses:
  - username, password (stored as a hash, never plain text), first_name, last_name, email
  - is_staff, is_active, is_superuser, date_joined, last_login
  - groups and user_permissions
  - methods like set_password() and check_password()
- Our User(AbstractUser) inherits all of it and gets one real table: accounts_user.
- Redefining email in the subclass replaces the inherited field. The original has blank=True (optional); ours has unique=True.

Concept 3: AUTH_USER_MODEL, and why "before the first migrate"

🧒 Simple: Picture building a mall where the plumbing (sessions, admin logs, permissions, orders) is pipe-welded to the "customer records" room. If you decide after opening to move that room, you must cut and re-weld every pipe while the mall is full of shoppers. Deciding before the first brick is laid costs nothing.

🛠️ Developer:
- AUTH_USER_MODEL = 'accounts.User' tells Django (and third-party apps) which model is "the user."
- Other tables point at the user with foreign keys: django_admin_log.user_id, the permission/group link tables, and later our cart_cart.user_id and orders_order.user_id.
- Those foreign keys are created by migrations, which depend on settings.AUTH_USER_MODEL. If you migrate first with auth.User and switch later, every existing foreign key and migration already points at auth_user. Django can't automatically rewrite that history, and the Django docs describe the fix as a manual, error-prone database surgery.
- Doing it now means everything is built pointing at accounts_user from day one.
- Rule for the rest of the project: in models, refer to the user as settings.AUTH_USER_MODEL (e.g. ForeignKey(settings.AUTH_USER_MODEL, ...)). In other code, use get_user_model(). Never import django.contrib.auth.models.User directly.

Concept 4: USERNAME_FIELD, email login, and uniqueness

🧒 Simple: At the shop's door, the guard asks "What's your membership ID?" We're changing the question to "What's your email?", and making sure no two members share an email. Otherwise the guard wouldn't know who's who.

🛠️ Developer:
- USERNAME_FIELD = 'email' makes email the identifier used by authenticate(), the admin login form, createsuperuser, and (in Phase 5) SimpleJWT's token endpoint.
- A login identifier must be unique, so unique=True makes Postgres create a unique index. The database itself then rejects duplicates, even if two sign-up requests arrive at the same millisecond.
- REQUIRED_FIELDS = ['username']: extra prompts for createsuperuser. We keep username (still unique) as a display name.

---

The code, explained

accounts/models.py

from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    email = models.EmailField('email address', unique=True)  # override: required + unique

    USERNAME_FIELD = 'email'         # log in with email
    REQUIRED_FIELDS = ['username']   # createsuperuser also asks for a username

    def __str__(self):
        return self.email            # how a user is shown in the admin, shell, and dropdowns
- EmailField is a VARCHAR(254) column plus email-format validation.
- 'email address' is the human-readable label (the verbose_name) shown in forms.
- __str__ controls how an object prints. Without it you'd see User object (1).

accounts/forms.py

class CustomUserCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = User                    # point at OUR model, not django.contrib.auth's User
        fields = ('email', 'username')  # the password fields come from the parent form

class CustomUserChangeForm(UserChangeForm):
    class Meta(UserChangeForm.Meta):
        model = User
I checked the Django docs: UserCreationForm and UserChangeForm are tied to the default User and "need to be rewritten or extended" for a custom model. Extending them like this is the documented pattern. class Meta(UserCreationForm.Meta) inherits the parent's settings and overrides only model and fields.

accounts/admin.py

@admin.register(User)                    # decorator = admin.site.register(User, UserAdmin)
class UserAdmin(DjangoUserAdmin):        # reuse Django's full user admin
    add_form = CustomUserCreationForm    # form for "Add user"
    form = CustomUserChangeForm          # form for editing a user
    add_fieldsets = ((None, {'classes': ('wide',),
                             'fields': ('email', 'username', 'password1', 'password2')}),)
    list_display = ('email', 'username', 'is_staff', 'is_active', 'date_joined')  # table columns
    search_fields = ('email', 'username', 'first_name', 'last_name')              # search box
    ordering = ('email',)
The built-in UserAdmin gives us password hashing, the "change password" form, and the permissions/groups UI for free. We only adjust it for email login. Without the add_fieldsets change, the "Add user" page wouldn't ask for an email. The first user would save with an empty email, and the second would crash on the unique constraint.

config/settings.py (three small changes)

INSTALLED_APPS = [
    ...,
    'django.contrib.staticfiles',
    # Our apps
    'accounts',
]

DATABASES = {'default': {
    ...,
    'OPTIONS': {'connect_timeout': 5},   # passed straight to psycopg: stop waiting after 5 seconds
}}

AUTH_USER_MODEL = 'accounts.User'        # format: '<app_label>.<ModelName>'

I verified it (read-only): manage.py check reports no issues, and makemigrations --dry-run says it would create accounts\migrations\0001_initial.py with + Create model User. No migration file has been written yet. You do that in Lesson 2.6.

---

▶️ Your turn (PowerShell)

cd "$env:USERPROFILE\OneDrive\Desktop\django-ecommerce\backend"

Step 1: Read the new code

Open accounts\models.py, accounts\forms.py, accounts\admin.py, and look at the new lines in config\settings.py. Then look at what changed:
git status
git diff config/settings.py
(Relative path, because you're inside backend\.)

Step 2: Run Django's system check

uv run python manage.py check
Expected: System check identified no issues (0 silenced). The check framework validates models, admin classes, and settings without touching the database. It's the fastest way to catch configuration mistakes.

Step 3: Ask Django which user model it uses now

uv run python manage.py shell -c "from django.contrib.auth import get_user_model; U = get_user_model(); print(U, U._meta.db_table, U.USERNAME_FIELD, U.REQUIRED_FIELDS)"
Expected: <class 'accounts.models.User'> accounts_user email ['username']
- get_user_model() returns whatever AUTH_USER_MODEL points to. This is how all code should get "the user model."
- _meta.db_table is the table Postgres will get.

Step 4: Preview the migration (without writing it)

uv run python manage.py makemigrations --dry-run --verbosity 3
--verbosity 3 prints the full Python code of the migration Django would generate: a CreateModel with every field, including the inherited ones (password, last_login, is_superuser, username, …) and our unique email. Scroll through it, since we'll study migration files in the next lesson. Nothing is written to disk.

Step 5 (optional, 30 seconds): See connect_timeout work

docker compose stop db
Measure-Command { uv run python manage.py showmigrations 2>$null } | Select-Object TotalSeconds
docker compose start db
Measure-Command times the command. You should see a result of roughly 5–10 seconds and then an error, instead of an endless hang. (It can be up to 10 because psycopg tries both ::1 and 127.0.0.1, each with its own 5-second limit.)











What & why

Our models exist only as Python classes. The database is still empty (\dt → no tables). Migrations turn model code into real tables. Today we:
1. generate our first migration file,
2. read the SQL it will run,
3. apply all migrations (Django's built-in ones plus ours),
4. create an administrator account and log in to the admin site.

After this lesson Phase 2 is complete, and you have a working Django + PostgreSQL backend with email login.

Files involved
backend/accounts/migrations/
└── 0001_initial.py      ← NEW (you generate it): "create the accounts_user table"
Plus many tables in Postgres (not files), created by migrate.

How it connects:
models.py ──makemigrations──▶ migrations/0001_initial.py ──migrate──▶ SQL executed in Postgres
 (what you WANT)               (a recorded, versioned change)          (what EXISTS)
                                                                      + a row in django_migrations

---

Concept 1: Migrations

🧒 Simple: Your building's architect doesn't knock down the building every time you want a new room. Each change becomes a numbered work order: "#1: build the customer records room," "#2: add a phone-number cabinet." The builders keep a logbook of which work orders are finished. When a new builder arrives (a teammate's laptop, a production server), they read the logbook and do only the missing work orders, in order.

🛠️ Developer: A migration is a Python file with:
- dependencies: which migrations must run first. Ours depends on ('auth', '0012_...') because our User links to auth.Group and auth.Permission.
- operations: database-independent instructions such as CreateModel, AddField, AlterField.

Two commands, two different jobs:

┌────────────────┬─────────────────────────────────────────────────────────────┬────────────────────────────────────────────────────┬────────────────┐
│    Command     │                        What it reads                        │                   What it writes                   │  Touches the   │
│                │                                                             │                                                    │      DB?       │
├────────────────┼─────────────────────────────────────────────────────────────┼────────────────────────────────────────────────────┼────────────────┤
│ makemigrations │ your models.py vs. the state built from existing migration  │ a new migration file                               │ ❌ No          │
│                │ files                                                       │                                                    │                │
├────────────────┼─────────────────────────────────────────────────────────────┼────────────────────────────────────────────────────┼────────────────┤
│ migrate        │ migration files vs. the django_migrations table             │ SQL executed in the DB + a record in               │ ✅ Yes         │
│                │                                                             │ django_migrations                                  │                │
└────────────────┴─────────────────────────────────────────────────────────────┴────────────────────────────────────────────────────┴────────────────┘

Other things worth knowing:
- The autodetector in makemigrations compares your models against the migration history, not against the live database. That's why migration files must be committed. They're part of your code, and every environment replays the same history.
- migrate runs each migration inside a transaction on Postgres. If one fails halfway, it's rolled back as if it never started.
- django_migrations is the builders' logbook: one row per applied migration.

Concept 2: Password hashing

🧒 Simple: The shop never writes your PIN in its notebook. It runs your PIN through a special meat grinder and keeps only the ground-up result. When you log in, it grinds what you typed and compares the results. A thief who steals the notebook only gets ground meat, and you can't un-grind meat back into a PIN.

🛠️ Developer: Django stores algorithm$iterations$salt$hash, e.g. pbkdf2_sha256$870000$<salt>$<hash>.
- PBKDF2-SHA256 is run 870,000 times (Django 5.1's default), so guessing passwords is slow for attackers.
- A random salt per user means two users with the same password get different hashes.
- user.set_password() hashes a password, and user.check_password() compares one. You never store or compare raw passwords yourself.

Concept 3: Superuser, staff, and the admin site

🧒 Simple: The admin site is the shop's back office. is_staff is a key card that opens the back office door. is_superuser is the master key that opens every cabinet inside. Regular customers have neither.

🛠️ Developer:
- django.contrib.admin auto-generates CRUD screens for every registered model.
- Access requires is_active=True and is_staff=True. What a staff user can do inside depends on permissions (view/add/change/delete per model), except is_superuser=True, which passes every permission check.
- createsuperuser creates a user with all three flags set.
- In Phase 5 we reuse is_staff as our API's "administrator" role.

---

▶️ Your turn (PowerShell)

cd "$env:USERPROFILE\OneDrive\Desktop\django-ecommerce\backend"
docker compose ps
Make sure db is (healthy). You restarted it after the timeout test.

Step 1: Generate the migration file

uv run python manage.py makemigrations
Expected:
Migrations for 'accounts':
  accounts\migrations\0001_initial.py
    + Create model User
Open accounts\migrations\0001_initial.py. It's the same code you saw in the dry run. Things to notice:
- initial = True: this is the app's first migration.
- dependencies = [('auth', '0012_alter_user_first_name_max_length')]: auth's tables must exist first, because of the groups and user_permissions links.
- Every field is listed, including the ones inherited from AbstractUser, and email has unique=True.
- managers=[('objects', UserManager())]: User.objects gets helper methods like create_user() and create_superuser(), which hash passwords for you.

Run it again:
uv run python manage.py makemigrations
→ No changes detected. Models and migration history now match.

Step 2: See the actual SQL, before running it

uv run python manage.py sqlmigrate accounts 0001
sqlmigrate prints the SQL a migration would execute, without running it. Look for:
- CREATE TABLE "accounts_user" ("id" bigint NOT NULL PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY, "password" varchar(128) NOT NULL, ..., "email" varchar(254) NOT NULL UNIQUE);: model → table, and field → column with a type.
- CREATE TABLE "accounts_user_groups" (... "user_id" bigint NOT NULL, "group_id" integer NOT NULL);: each ManyToMany field gets its own link table (one row per user–group pair).
- ALTER TABLE ... ADD CONSTRAINT ... FOREIGN KEY ("user_id") REFERENCES "accounts_user" ("id") DEFERRABLE INITIALLY DEFERRED;: foreign keys, enforced by Postgres.
- CREATE INDEX "accounts_user_email_..._like" ON "accounts_user" ("email" varchar_pattern_ops);: an extra index so LIKE 'abc%' searches on email are fast.
- BEGIN; ... COMMIT;: the whole migration is one transaction.

Step 3: Compare before and after

uv run python manage.py showmigrations
There's a new accounts [ ] 0001_initial section, and everything is still [ ].

Step 4: The first migrate 🎉

uv run python manage.py migrate
Expected (the order is decided by the dependencies):
Operations to perform:
  Apply all migrations: accounts, admin, auth, contenttypes, sessions
Running migrations:
  Applying contenttypes.0001_initial... OK
  Applying contenttypes.0002_remove_content_type_name... OK
  Applying auth.0001_initial... OK
  ...
  Applying auth.0012_alter_user_first_name_max_length... OK
  Applying accounts.0001_initial... OK
  Applying admin.0001_initial... OK
  ...
  Applying sessions.0001_initial... OK
Notice that accounts.0001 runs after auth.0012 (its dependency) and before admin.0001, because the admin log table has a foreign key to our user table.

uv run python manage.py showmigrations
Now everything shows [X].

Step 5: Look inside Postgres

docker compose exec db psql -U shoplite -d shoplite
\dt
SELECT id, app, name, applied FROM django_migrations ORDER BY id;
\d accounts_user
- \dt lists 10 tables. Check that there's accounts_user and no auth_user. That's the proof AUTH_USER_MODEL worked. You'll also see accounts_user_groups, accounts_user_user_permissions, auth_group, auth_group_permissions, auth_permission, django_admin_log, django_content_type, django_migrations, and django_session.
- The django_migrations query shows the logbook: one row per applied migration, with a timestamp.
- \d accounts_user shows the columns, plus Indexes: with accounts_user_email_key UNIQUE CONSTRAINT. That's the database enforcing unique emails.

Leave psql with \q.

Step 6: Create your administrator account

uv run python manage.py createsuperuser
Because USERNAME_FIELD = 'email' and REQUIRED_FIELDS = ['username'], it asks:
Email address: (your email)
Username: admin
Password:            ← nothing shows while typing; that's normal
Password (again):
Superuser created successfully.
If you type a weak password, the password validators from settings.py complain (This password is too short, too common, entirely numeric) and offer Bypass password validation and create user anyway? [y/N]. Use a real password instead, since it's good practice.

Step 7: Log in to the admin

uv run python manage.py runserver
1. Open http://127.0.0.1:8000/admin/. The login form now says "Email address" instead of "Username", because of USERNAME_FIELD. Log in.
2. Under ACCOUNTS → Users you'll see yourself with the columns from list_display: Email, Username, Staff status, Active, Date joined.
3. Add a test customer: click Add user +. The form asks for Email, Username, Password, Password confirmation (our add_fieldsets + CustomUserCreationForm). Create, for example:
   - Email: customer@example.com
   - Username: customer1
   - Password: any strong password

   After saving, Django shows the full edit page. Notice that Staff status and Superuser status are unticked, so this is a regular customer. Click Save.
4. Test uniqueness: try Add user again with the same email customer@example.com. You get "User with this Email address already exists." Django checked this because the field is unique=True, and the database would refuse it anyway.
5. Try the search box on the Users list: search customer.

Stop the server with Ctrl+C.

Step 8: See the password hashes

docker compose exec db psql -U shoplite -d shoplite -c "SELECT id, email, username, is_staff, is_superuser, left(password, 40) AS password_start FROM accounts_user;"
Two rows. The password column starts with pbkdf2_sha256$870000$.... There are no readable passwords anywhere in the database.

Step 9: Commit the migration

Migration files are code, so they always get committed:
cd ..
git status
git add backend/accounts/migrations/0001_initial.py
git commit -m "Add initial migration for custom User and apply all migrations"

Password:            ← nothing shows while typing; that's normal
Password (again):
Superuser created successfully.
If you type a weak password, the password validators from settings.py complain (This password is too short, too common, entirely numeric) and offer Bypass password validation and create user anyway? [y/N]. Use a real password instead, since it's good practice.

Step 7: Log in to the admin

uv run python manage.py runserver
1. Open http://127.0.0.1:8000/admin/. The login form now says "Email address" instead of "Username", because of USERNAME_FIELD. Log in.
2. Under ACCOUNTS → Users you'll see yourself with the columns from list_display: Email, Username, Staff status, Active, Date joined.
3. Add a test customer: click Add user +. The form asks for Email, Username, Password, Password confirmation (our add_fieldsets + CustomUserCreationForm). Create, for example:
   - Email: customer@example.com
   - Username: customer1
   - Password: any strong password

   After saving, Django shows the full edit page. Notice that Staff status and Superuser status are unticked, so this is a regular customer. Click Save.
4. Test uniqueness: try Add user again with the same email customer@example.com. You get "User with this Email address already exists." Django checked this because the field is unique=True, and the database would refuse it anyway.
5. Try the search box on the Users list: search customer.

Stop the server with Ctrl+C.

Step 8: See the password hashes

docker compose exec db psql -U shoplite -d shoplite -c "SELECT id, email, username, is_staff, is_superuser, left(password, 40) AS password_start FROM accounts_user;"
Two rows. The password column starts with pbkdf2_sha256$870000$.... There are no readable passwords anywhere in the database.


What & why

A shop needs things to sell. In this lesson we design the two catalog models and create the catalog app. You create the app yourself. In the next lesson I write the model code into it, and we generate and apply the migration.

What we're building:
- Category: "Kitchen", "Stationery"… used for browsing and filtering.
- Product: name, description, price, stock, active/hidden flag, and the category it belongs to. (The product image is added in Lesson 3.5 as a second migration, so you'll also see how Django changes an existing table.)

Files involved
backend/
├── catalog/                 ← NEW app: YOU create it with startapp (this lesson)
│   ├── models.py            ←   Category + Product (I write it: next lesson)
│   ├── admin.py             ←   admin screens (Lesson 3.4)
│   └── migrations/          ←   0001_initial.py (next lesson), 0002 for the image (Lesson 3.5)
└── config/settings.py       ← YOU add 'catalog' to INSTALLED_APPS (this lesson)

---

Concept 1: Field types, choosing the right "box" for each piece of data

🧒 Simple: A paper form has different boxes: a short line for a name, a big box for a description, a box with "$ ." for money, a tick-box for yes/no. Using the wrong box causes trouble. Imagine writing a price in the "name" line.

🛠️ Developer: Each Django field maps to a Postgres column type and brings validation:

┌──────────────────────────────────────────────┬─────────────────────────────┬─────────────┬─────────────────────────────────────────────────────────┐
│                    Field                     │        Postgres type        │  Used for   │                      Why this one                       │
├──────────────────────────────────────────────┼─────────────────────────────┼─────────────┼─────────────────────────────────────────────────────────┤
│ CharField(max_length=200)                    │ varchar(200)                │ name        │ short text with a length limit                          │
├──────────────────────────────────────────────┼─────────────────────────────┼─────────────┼─────────────────────────────────────────────────────────┤
│ TextField(blank=True)                        │ text                        │ description │ unlimited text; blank=True = may be left empty in forms │
├──────────────────────────────────────────────┼─────────────────────────────┼─────────────┼─────────────────────────────────────────────────────────┤
│ SlugField(unique=True)                       │ varchar + index             │ slug        │ URL-safe identifier, e.g. blue-ceramic-mug              │
├──────────────────────────────────────────────┼─────────────────────────────┼─────────────┼─────────────────────────────────────────────────────────┤
│ DecimalField(max_digits=10,                  │ numeric(10,2)               │ price       │ exact money (see Concept 2)                             │
│ decimal_places=2)                            │                             │             │                                                         │
├──────────────────────────────────────────────┼─────────────────────────────┼─────────────┼─────────────────────────────────────────────────────────┤
│ PositiveIntegerField(default=0)              │ integer + CHECK (stock >=   │ stock       │ stock can't be negative, and Postgres itself enforces   │
│                                              │ 0)                          │             │ it                                                      │
├──────────────────────────────────────────────┼─────────────────────────────┼─────────────┼─────────────────────────────────────────────────────────┤
│ BooleanField(default=True)                   │ boolean                     │ is_active   │ hide products without deleting them                     │
├──────────────────────────────────────────────┼─────────────────────────────┼─────────────┼─────────────────────────────────────────────────────────┤
│ DateTimeField(auto_now_add=True)             │ timestamptz                 │ created_at  │ set once when the row is created                        │
├──────────────────────────────────────────────┼─────────────────────────────┼─────────────┼─────────────────────────────────────────────────────────┤
│ DateTimeField(auto_now=True)                 │ timestamptz                 │ updated_at  │ updated on every save                                   │
└──────────────────────────────────────────────┴─────────────────────────────┴─────────────┴─────────────────────────────────────────────────────────┘

blank vs. null is a classic confusion:
- blank=True is a validation rule ("the form may be empty").
- null=True is a database rule ("the column may store NULL").
- For text fields, Django's convention is blank=True without null=True, so "empty" is always stored as '' and never as two different kinds of nothing.

Concept 2: Why prices must be DecimalField, never FloatField

🧒 Simple: Floats are like a ruler with slightly blurry markings. 0.1 + 0.2 comes out as "0.30000000000000004". One blurry cent doesn't matter for a physics game, but a shop whose receipts are off by a fraction of a cent fails its accounting.

🛠️ Developer:
- A float is binary floating point, so 0.1 can't be represented exactly.
- Python's Decimal and Postgres's numeric are exact base-10 numbers. Decimal('0.1') + Decimal('0.2') == Decimal('0.3') is True.
- DecimalField(max_digits=10, decimal_places=2) holds prices up to 99,999,999.99.
- Always build Decimals from strings: Decimal('19.99'), never Decimal(19.99), which inherits the float's blur. You'll try this in the shell in Lesson 3.6.

Concept 3: Slugs

🧒 Simple: A product's "nickname" for web addresses. Instead of /products/7/, you get /products/blue-ceramic-mug/. It's readable, it's shareable, and search engines like it.

🛠️ Developer:
- A slug contains only lowercase letters, digits, hyphens, and underscores. Django's slugify("Blue Ceramic Mug!") → "blue-ceramic-mug".
- unique=True gives the slug a unique index, so it can be used to look products up (/api/products/<slug>/ in Phase 4).
- We'll auto-fill it from the name when it's left blank, by overriding the model's save().

Concept 4: Relationships (ForeignKey, on_delete, related_name)

🧒 Simple: Each product card has a line "Shelf: Kitchen." Many products point to the same shelf, but each product sits on exactly one shelf. That's a one-to-many relationship: one category, many products.

Now, what happens if someone tries to remove the Kitchen shelf while mugs are still on it?
- CASCADE: throw away all the mugs too 😱
- PROTECT: refuse. "Move or delete the products first." ✅ Our choice.
- SET_NULL: the mugs stay, with "Shelf: (none)."

🛠️ Developer:
- category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name='products') creates a column category_id bigint with a FOREIGN KEY constraint pointing to catalog_category(id), plus an index on it for fast "all products in category X" queries.
- on_delete is what Django does when the referenced row is deleted:

| Option   | Behaviour                            | Where we'll use it                                                                |
|----------|--------------------------------------|-----------------------------------------------------------------------------------|
| CASCADE  | delete the dependents too            | CartItem → Cart (Phase 6)                                                         |
| PROTECT  | raise ProtectedError, delete nothing | Product → Category                                                                |
| SET_NULL | set the FK to NULL (needs null=True) | OrderItem → Product (Phase 7), so deleting a product never destroys order history |

- related_name='products' names the reverse direction. From a category you write kitchen.products.all(). Without it, Django would call it product_set.

Concept 5: Two layers of protection (validators and constraints)

🧒 Simple: A shop has a polite cashier who says "sorry, price can't be zero" (a validator), and a locked safe that physically won't accept wrong entries (a database constraint). The cashier gives nice explanations. The safe is the last line of defence if someone bypasses the cashier.

🛠️ Developer:
- validators=[MinValueValidator(Decimal('0.01'))] runs in model/form/serializer validation, which gives friendly error messages in the admin and API.
- models.CheckConstraint(condition=models.Q(price__gt=0), name='product_price_positive') becomes a real Postgres CHECK constraint. Even raw SQL, a bug, or a script can't store a price ≤ 0.

(condition= is the Django 5.1 spelling. The older check= argument is deprecated.)

---

The planned model code (I'll write this in the next lesson)

Read it now, so nothing surprises you later:
from decimal import Decimal

from django.core.validators import MinValueValidator
from django.db import models
from django.utils.text import slugify


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']                  # default sort order (remember: SQL has none by itself!)
        verbose_name_plural = 'categories'   # otherwise the admin would say "Categorys"

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:                    # auto-fill the slug from the name if it was left blank
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)        # then do the normal save


class Product(models.Model):
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name='products')
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2,
                                validators=[MinValueValidator(Decimal('0.01'))])
    stock = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    # image = models.ImageField(...)  ← added in Lesson 3.5

    class Meta:
        ordering = ['-created_at']           # newest first ("-" = descending)
        constraints = [
            models.CheckConstraint(condition=models.Q(price__gt=0), name='product_price_positive'),
        ]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
Questions to think about while reading (we'll check your answers in the next lessons):
1. Which line creates the category_id column?
2. What happens in the database if you try to delete a Category that still has products?
3. Why is is_active better than deleting a product that has already been ordered?

---

▶️ Your turn (PowerShell)

Step 1: Create the app yourself

cd "$env:USERPROFILE\OneDrive\Desktop\django-ecommerce\backend"
uv run python manage.py startapp catalog
Get-ChildItem catalog
Expected: migrations\, __init__.py, admin.py, apps.py, models.py, tests.py, views.py. It's the same structure as accounts.

Step 2: Register the app (your first manual settings edit)

Open backend\config\settings.py, find INSTALLED_APPS, and add 'catalog', under our accounts line:
    # Our apps
    'accounts',
    'catalog',
]
Watch out for the comma and the quotes. A missing comma between two strings is a classic Python bug: 'accounts' 'catalog' silently becomes 'accountscatalog'. That's a mistake worth knowing about.

Step 3: Verify

uv run python manage.py check
uv run python manage.py shell -c "from django.apps import apps; print([a.label for a in apps.get_app_configs()])"
- check → System check identified no issues (0 silenced).
- The second command lists every installed app's label. You should see 'accounts' and 'catalog' at the end.
1. Which line creates the category_id column?
2. What happens in the database if you try to delete a Category that still has products?
3. Why is is_active better than deleting a product that has already been ordered?

---

▶️ Your turn (PowerShell)

Step 1: Create the app yourself

cd "$env:USERPROFILE\OneDrive\Desktop\django-ecommerce\backend"
uv run python manage.py startapp catalog
Get-ChildItem catalog
Expected: migrations\, __init__.py, admin.py, apps.py, models.py, tests.py, views.py. It's the same structure as accounts.

Step 2: Register the app (your first manual settings edit)

Open backend\config\settings.py, find INSTALLED_APPS, and add 'catalog', under our accounts line:
    # Our apps
    'accounts',
    'catalog',
]
Watch out for the comma and the quotes. A missing comma between two strings is a classic Python bug: 'accounts' 'catalog' silently becomes 'accountscatalog'. That's a mistake worth knowing about.

Step 3: Verify

uv run python manage.py check
uv run python manage.py shell -c "from django.apps import apps; print([a.label for a in apps.get_app_configs()])"
- check → System check identified no issues (0 silenced).
- The second command lists every installed app's label. You should see 'accounts' and 'catalog' at the end.

Don't commit yet. We'll commit the app together with its models in the next lesson.



What & why

You approved the design in Lesson 3.1. Now I've written it into catalog/models.py, and you'll turn it into real Postgres tables: generate the migration, read its SQL, apply it, and prove the database enforces our rules.

Files involved
backend/catalog/
├── models.py                   ← ✏️ WRITTEN: Category + Product (exactly the code from Lesson 3.1, plus comments)
└── migrations/0001_initial.py  ← YOU generate it with makemigrations
I verified it (read-only): check → no issues, and makemigrations --dry-run → + Create model Category, + Create model Product.

---

The code parts we haven't explained yet

class Meta: settings about the model, not fields

class Meta:
    ordering = ['-created_at']      # default ORDER BY for queries: newest first
    constraints = [...]             # database-level rules
🧒 Simple: fields are the boxes on the form, while Meta is the printing instructions for the form: how to sort the stack, what to call it in the plural, which rules the filing cabinet itself must enforce.
🛠️ Developer: Meta holds model options. ordering adds an ORDER BY to queries that don't specify their own order. Remember Lesson 1.4: without ORDER BY, SQL row order isn't guaranteed. verbose_name_plural fixes the admin label ("categories", not "categorys").

Overriding save() and super()

def save(self, *args, **kwargs):
    if not self.slug:
        self.slug = slugify(self.name)
    super().save(*args, **kwargs)
🧒 Simple: before the clerk files the card, we add one step: "if the nickname box is empty, write one based on the name." Then we hand the card to the normal filing process.
🛠️ Developer:
- save() is the method that writes the row (INSERT or UPDATE). We run our own code first.
- super().save(*args, **kwargs) then calls the parent class's original save, which does the actual database write.
- *args, **kwargs pass along any options callers gave, like update_fields=[...].
- Forgetting super().save() is a classic bug: nothing is saved, and there's no error.

__str__

How an object prints in the admin, the shell, and dropdowns. You'll see Blue Mug instead of Product object (1).

---

▶️ Your turn (PowerShell, in backend\)

cd "$env:USERPROFILE\OneDrive\Desktop\django-ecommerce\backend"

Step 1: Read the model file

Open catalog\models.py and compare it with the design in Lesson 3.1. The only additions are comments.

Step 2: Generate the migration

uv run python manage.py makemigrations catalog
Expected:
Migrations for 'catalog':
  catalog\migrations\0001_initial.py
    + Create model Category
    + Create model Product
Open catalog\migrations\0001_initial.py. Find these:
- ('category', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='products', to='catalog.category'))
- validators=[django.core.validators.MinValueValidator(Decimal('0.01'))] on price
- 'constraints': [models.CheckConstraint(condition=models.Q(('price__gt', 0)), name='product_price_positive')] in the options
- dependencies = []: this app doesn't depend on any other app's migrations yet. (Compare accounts, which depended on auth.)

Step 3: Read the SQL Django will run

uv run python manage.py sqlmigrate catalog 0001
Find each rule from our model in the SQL:

┌─────────────────────────────────────┬───────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│            In models.py             │                                                  In the SQL                                                   │
├─────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ PositiveIntegerField                │ "stock" integer NOT NULL CHECK ("stock" >= 0). Postgres itself rejects negative stock.                        │
├─────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ DecimalField(10, 2)                 │ "price" numeric(10, 2) NOT NULL                                                                               │
├─────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ CheckConstraint(price > 0)          │ ADD CONSTRAINT "product_price_positive" CHECK ("price" > 0)                                                   │
├─────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ ForeignKey(Category)                │ "category_id" bigint NOT NULL + FOREIGN KEY ("category_id") REFERENCES "catalog_category" ("id") DEFERRABLE   │
│                                     │ INITIALLY DEFERRED                                                                                            │
├─────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ (automatic)                         │ CREATE INDEX "catalog_product_category_id_..." ON "catalog_product" ("category_id"). Django indexes every FK  │
│                                     │ so "products in category X" stays fast.                                                                       │
├─────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ unique=True on slug                 │ a UNIQUE constraint + a ..._like index for prefix searches                                                    │
├─────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ MinValueValidator(0.01)             │ nothing! Validators live only in Python. That's why we also added the constraint.                             │
├─────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ ordering, related_name,             │ nothing! These are Django-side behaviour too.                                                                 │
│ on_delete=PROTECT                   │                                                                                                               │
└─────────────────────────────────────┴───────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

A surprising detail: the FK's SQL has no ON DELETE PROTECT. Django implements on_delete in Python. Before deleting a category it looks for related products and raises ProtectedError. The database FK is still a safety net: its default behaviour refuses to delete a row that others still reference, checked at COMMIT because of DEFERRABLE INITIALLY DEFERRED.

Step 4: Apply it

uv run python manage.py migrate
uv run python manage.py showmigrations catalog
Expected: Applying catalog.0001_initial... OK, then [X] 0001_initial.

Step 5: Prove the database guards the data

Open psql:
docker compose exec db psql -U shoplite -d shoplite
Look at the table:
\d catalog_product
At the bottom, find the Check constraints: section (product_price_positive, catalog_product_stock_check) and Foreign-key constraints:.

Now try to break the rules on purpose with raw SQL, bypassing Django completely:
INSERT INTO catalog_category (name, slug, description, created_at, updated_at)
VALUES ('Test', 'test', '', now(), now());

INSERT INTO catalog_product (category_id, name, slug, description, price, stock, is_active, created_at, updated_at)
VALUES ((SELECT id FROM catalog_category WHERE slug = 'test'), 'Free thing', 'free-thing', '', 0, 5, true, now(), now());

INSERT INTO catalog_product (category_id, name, slug, description, price, stock, is_active, created_at, updated_at)
VALUES ((SELECT id FROM catalog_category WHERE slug = 'test'), 'Negative stock', 'negative-stock', '', 9.99, -1, true, now(), now());

INSERT INTO catalog_product (category_id, name, slug, description, price, stock, is_active, created_at, updated_at)
VALUES (999999, 'Orphan', 'orphan', '', 9.99, 1, true, now(), now());
Expected, one error each:
1. The category insert → INSERT 0 1 ✅
2. Price 0 → ERROR: new row for relation "catalog_product" violates check constraint "product_price_positive"
3. Stock −1 → ERROR: ... violates check constraint "catalog_product_stock_check"
4. A category that doesn't exist → ERROR: insert or update on table "catalog_product" violates foreign key constraint ...

Each rule is enforced by PostgreSQL itself, not just by Django. That's the "locked safe" from Lesson 3.1, Concept 5.

Clean up the test category, check it's gone, and leave:
DELETE FROM catalog_category WHERE slug = 'test';
SELECT count(*) FROM catalog_category;
SELECT count(*) FROM catalog_product;
\q
Both counts should be 0.





What & why

The models and tables exist, but there's no convenient way to add products yet. The Django admin gives shop staff a complete back office for free. Today we configure it for the catalog, and you add real categories and products through the browser. You'll also see the model rules (validators, unique, PROTECT) show up as friendly messages.

Files involved
backend/
├── catalog/admin.py   ← ✏️ WRITTEN: CategoryAdmin + ProductAdmin
└── config/urls.py     ← ✏️ small change: admin site title "ShopLite administration"
I verified it with manage.py check, which reports no issues. The check framework also validates admin options (e.g. that autocomplete_fields targets an admin with search_fields).

---

Concept 1: ModelAdmin, a configurable back-office screen

🧒 Simple: The admin is a ready-made back-office program. For each kind of record you fill in a settings card: which columns to show in the list, which filters to put on the side, which boxes may be edited directly in the list. Django builds the screens from that card.

🛠️ Developer: @admin.register(Product) connects a model to a ModelAdmin subclass. Its class attributes configure auto-generated views:

┌─────────────────────┬─────────────────────────────────────────────────────────────────┐
│       Option        │                      Effect in the browser                      │
├─────────────────────┼─────────────────────────────────────────────────────────────────┤
│ list_display        │ columns of the list page (fields or methods)                    │
├─────────────────────┼─────────────────────────────────────────────────────────────────┤
│ list_filter         │ the filter sidebar (booleans, FKs, and dates get smart filters) │
├─────────────────────┼─────────────────────────────────────────────────────────────────┤
│ search_fields       │ a search box: WHERE name ILIKE '%term%' OR ...                  │
├─────────────────────┼─────────────────────────────────────────────────────────────────┤
│ list_editable       │ edit these columns directly in the list                         │
├─────────────────────┼─────────────────────────────────────────────────────────────────┤
│ prepopulated_fields │ JavaScript fills the slug while you type the name               │
├─────────────────────┼─────────────────────────────────────────────────────────────────┤
│ autocomplete_fields │ a search-as-you-type dropdown instead of a giant <select>       │
├─────────────────────┼─────────────────────────────────────────────────────────────────┤
│ readonly_fields     │ shown but not editable (timestamps)                             │
├─────────────────────┼─────────────────────────────────────────────────────────────────┤
│ actions             │ bulk operations on selected rows                                │
└─────────────────────┴─────────────────────────────────────────────────────────────────┘

Access follows the permissions from Lesson 2.6: staff users need view/add/change/delete permissions per model, and superusers pass everything.

Concept 2: The "N+1 queries" problem

🧒 Simple: You need the category name for 25 products. The slow way is to walk to the warehouse 25 separate times, once per product. The smart way is one trip with a list.

🛠️ Developer: Showing category in the product list means reading product.category for every row. By default each access fires its own SQL query: 1 query for the list + 25 for categories = N+1. Two fixes are used in our admin:
- list_select_related = ('category',) makes Django use a SQL JOIN, so products and their categories come back in one query. (It's the admin's version of Product.objects.select_related('category'), which we'll use in the API.)
- annotate(_product_count=Count('products')) makes the database count the products per category inside the same query, with LEFT JOIN ... GROUP BY, instead of running category.products.count() once per row.

N+1 is the most common performance bug in Django apps, so it's worth recognising early.

Concept 3: Bulk actions and queryset.update()

🧒 Simple: Instead of opening 20 product cards one by one to tick "hidden", you select them all and press one button, and the warehouse updates all 20 in one go.

🛠️ Developer:
- queryset.update(is_active=False) sends one SQL UPDATE ... WHERE id IN (...). It's fast, but it skips Model.save().
- That means our slug logic doesn't run (fine here), and auto_now doesn't update updated_at. That's why the actions also pass updated_at=timezone.now() explicitly.
- timezone.now() returns a timezone-aware UTC datetime, which matches USE_TZ = True. Never use datetime.now() in Django.

---

The code, explained (catalog/admin.py, key parts)

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'product_count', 'created_at')  # 'product_count' is a METHOD below
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}

    def get_queryset(self, request):                     # the query behind the list page
        return super().get_queryset(request).annotate(_product_count=Count('products'))
        #                                    'products' = the related_name from Product.category

    @admin.display(description='Products', ordering='_product_count')   # column title + sortable
    def product_count(self, obj):
        return obj._product_count


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'stock', 'is_active', 'updated_at')
    list_filter = ('is_active', 'category', 'created_at')
    list_editable = ('price', 'stock', 'is_active')      # edit in the list itself
    autocomplete_fields = ('category',)                  # requires CategoryAdmin.search_fields
    list_select_related = ('category',)                  # the N+1 fix
    actions = ('make_active', 'make_inactive')

    @admin.action(description='Hide selected products from the shop')
    def make_inactive(self, request, queryset):          # queryset = the rows you ticked
        updated = queryset.update(is_active=False, updated_at=timezone.now())
        self.message_user(request, f'{updated} product(s) are now hidden from the shop.')

---

▶️ Your turn

cd "$env:USERPROFILE\OneDrive\Desktop\django-ecommerce\backend"
uv run python manage.py runserver
Open http://127.0.0.1:8000/admin/ and log in with your email. The header now says "ShopLite administration", and a new CATALOG section has Categories and Products.

Step 1: Create categories (and watch the slug fill itself)

Categories → Add category +. Type the name slowly and watch the Slug box fill as you type. That's prepopulated_fields. Create:
- Kitchen
- Stationery
- Home & Garden → the slug becomes home-garden, because & isn't URL-safe and is dropped.

Try to add Kitchen a second time → "Category with this Name already exists." (unique=True).

Step 2: Create products (and trigger the validators)

Products → Add product +. Click the Category box and type kit. That's autocomplete_fields searching as you type. Create these four:

┌──────────────────────┬───────────────┬───────┬───────┐
│         Name         │   Category    │ Price │ Stock │
├──────────────────────┼───────────────┼───────┼───────┤
│ Blue Ceramic Mug     │ Kitchen       │ 12.50 │ 20    │
├──────────────────────┼───────────────┼───────┼───────┤
│ Chef Knife           │ Kitchen       │ 49.99 │ 5     │
├──────────────────────┼───────────────┼───────┼───────┤
│ Gel Pen Set          │ Stationery    │ 7.99  │ 100   │
├──────────────────────┼───────────────┼───────┼───────┤
│ Terracotta Plant Pot │ Home & Garden │ 15.00 │ 0     │
└──────────────────────┴───────────────┴───────┴───────┘

While doing this, break the rules on purpose:
- Price 0 → "Ensure this value is greater than or equal to 0.01." That's the Python-side MinValueValidator, the "polite cashier."
- Price 12.505 → "Ensure that there are no more than 2 decimal places." That's DecimalField(decimal_places=2).
- Stock -3 → "Ensure this value is greater than or equal to 0." That's PositiveIntegerField.
- A second product with slug blue-ceramic-mug → "Product with this Slug already exists."

The form never reaches the database with bad data. Django validates first and shows friendly errors, and the Postgres constraints you tested in Lesson 3.3 stay as the safety net behind it.

Step 3: Use the list page features

On Products:
- Filters (right side): click By is active → Yes, then By category → Kitchen. Watch the URL change to ?category__id__exact=1&is_active__exact=1. Filters are just URL query parameters, the same idea our API will use in Phase 4.
- Search: type pen.
- Inline editing: change the Terracotta pot's stock from 0 to 8 directly in the list, then click Save at the bottom.
- Bulk action: tick Gel Pen Set and Chef Knife, choose "Hide selected products from the shop", and click Go. You get the message "2 product(s) are now hidden...", the Active column shows ❌, and updated_at changed. Then show them again with the other action.
- Sorting: click the Price column header.

Step 4: See PROTECT in action

Categories: the Products column shows the counts (Kitchen 2, Stationery 1, Home & Garden 1). That's our annotate(Count(...)).

Tick Kitchen → action "Delete selected categories" → Go. Django refuses:

▎ Deleting the selected category would require deleting the following protected related objects: Product: Blue Ceramic Mug, Product: Chef Knife

That's on_delete=models.PROTECT answering the question from Lesson 3.1. Click No, take me back.

Step 5: The admin keeps an audit log

Open any product. The top right has a History button that shows who changed what and when. The admin home page also has a Recent actions box. It's stored in the django_admin_log table:
docker compose exec db psql -U shoplite -d shoplite -c "SELECT action_time, object_repr, action_flag, change_message FROM django_admin_log ORDER BY action_time DESC LIMIT 5;"
action_flag: 1 = added, 2 = changed, 3 = deleted.

Stop the server with Ctrl+C.




Part B: Product images

What & why

A shop without pictures doesn't sell much. We add an image to each product, uploaded through the admin (and in Phase 4 through the API). This is also your first "change an existing table" migration.

Files involved (all written, but not yet working, on purpose)
backend/
├── catalog/models.py   ← ✏️ image = models.ImageField(upload_to='products/%Y/%m/', blank=True)
├── catalog/admin.py    ← ✏️ thumbnail column + preview on the edit page (and the order_by fix)
├── config/settings.py  ← ✏️ MEDIA_URL = 'media/', MEDIA_ROOT = BASE_DIR / 'media'
├── config/urls.py      ← ✏️ serve /media/... in development
├── pyproject.toml      ← YOU: uv add pillow
├── catalog/migrations/0002_product_image.py  ← YOU generate it
└── media/products/2026/09/*.jpg              ← uploaded files land here (git-ignored)
How they connect:
Admin form (multipart upload) ──▶ ImageField validates with Pillow ("is this really an image?")
     │                                     │
     │   file bytes ──▶ saved to disk: MEDIA_ROOT / products/2026/09/mug.jpg
     │   path string ──▶ saved in DB:  catalog_product.image = 'products/2026/09/mug.jpg'
     ▼
Browser <img src="/media/products/2026/09/mug.jpg"> ──▶ config/urls.py static() ──▶ file from MEDIA_ROOT

Concept 1: Where uploaded files live (files on disk, path in the database)

🧒 Simple: A library doesn't glue books into its catalogue drawer. The drawer card only says "Shelf 3, row 2." The book sits on the shelf. Our database is the card drawer and stores only the image's location. The picture itself sits in a folder.

🛠️ Developer:
- ImageField is a FileField subclass. The column is a varchar(100) holding a path relative to MEDIA_ROOT.
- The file is written by Django's storage backend: FileSystemStorage by default, which writes to MEDIA_ROOT. In production you'd swap that for S3 or another cloud storage without changing model code.
- Storing images in the database (as blobs) bloats backups and makes every image request hit Postgres.
- upload_to='products/%Y/%m/' uses date placeholders to spread files over folders.
- If a file name already exists, Django adds a random suffix (mug_a8Kx2Lp.jpg), so it never overwrites.

Concept 2: Static files vs. media files

🧒 Simple: Static files are the shop's own posters and signs, installed by the shopfitters (the developers). Media files are things customers or staff bring in, like product photos. They come from different places, so they get different storerooms.

🛠️ Developer:

┌──────────────────┬──────────────────────────────────────────────────────────────┬───────────────────────────────────────────────────────────┐
│                  │                     Static (STATIC_URL)                      │                     Media (MEDIA_URL)                     │
├──────────────────┼──────────────────────────────────────────────────────────────┼───────────────────────────────────────────────────────────┤
│ What             │ CSS/JS/images that ship with the code (e.g. the admin's CSS) │ files uploaded at runtime                                 │
├──────────────────┼──────────────────────────────────────────────────────────────┼───────────────────────────────────────────────────────────┤
│ Who creates them │ developers, in Git                                           │ users/staff, never in Git (backend/media/ is ignored)     │
├──────────────────┼──────────────────────────────────────────────────────────────┼───────────────────────────────────────────────────────────┤
│ Dev serving      │ automatic via django.contrib.staticfiles                     │ not automatic, which is why we add static(...) in urls.py │
├──────────────────┼──────────────────────────────────────────────────────────────┼───────────────────────────────────────────────────────────┤
│ Production       │ collectstatic → web server/CDN                               │ web server or cloud storage                               │
└──────────────────┴──────────────────────────────────────────────────────────────┴───────────────────────────────────────────────────────────┘

static() only adds URL patterns when DEBUG=True. Serving user uploads through Django is fine for development but slow and risky in production.

Concept 3: Pillow, and why the check will fail first

🧒 Simple: Before accepting a photo, the shop wants an expert to look at it and confirm it's really a picture, not a renamed virus or a text file. Pillow is that expert. Django refuses to use ImageField until the expert is hired.

🛠️ Developer: Pillow is Python's image library. ImageField uses it to open the uploaded file and verify it's a real image, and to read its dimensions. Without Pillow, Django's system check raises fields.E210. I ran check after writing the code, and it fails exactly like that right now. You'll see this error first, on purpose, and fix it with uv.

Concept 4: A migration that changes an existing table (AddField)

🧒 Simple: Adding a new "photo" box to every card that's already in the drawer. The old cards need something in the new box, so they get "no photo" (empty).

🛠️ Developer: makemigrations will create 0002_product_image.py:
- dependencies = [('catalog', '0001_initial')], because it builds on the first migration.
- operations = [migrations.AddField(model_name='product', name='image', field=...)]

For existing rows, Postgres needs a value, so the SQL is ADD COLUMN "image" varchar(100) DEFAULT '' NOT NULL, followed by ALTER COLUMN "image" DROP DEFAULT. Existing products get '', meaning "no image", which matches blank=True.

The code, explained

catalog/models.py
image = models.ImageField(upload_to='products/%Y/%m/', blank=True)   # optional image
config/settings.py
MEDIA_URL = 'media/'             # URL prefix: /media/...
MEDIA_ROOT = BASE_DIR / 'media'  # folder on disk: backend\media\
config/urls.py
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
catalog/admin.py (the new parts)
list_display = ('thumbnail', 'name', ...)   # thumbnail column first
list_display_links = ('name',)              # the NAME is the clickable link, not the picture
readonly_fields = ('thumbnail', 'created_at', 'updated_at')   # preview on the edit page too

@admin.display(description='Image')
def thumbnail(self, obj):
    if not obj.image:
        return '-'
    return format_html('<img src="{}" alt="{}" style="height:48px;...">', obj.image.url, obj.name)
- obj.image.url builds MEDIA_URL + path → /media/products/2026/09/mug.jpg.
- format_html escapes every {} value before inserting it into HTML. If a product were named <script>..., it would show as text instead of running. Never build HTML with f-strings from data. That's how XSS attacks happen.

---

▶️ Your turn (PowerShell, in backend\)

cd "$env:USERPROFILE\OneDrive\Desktop\django-ecommerce\backend"

Step 1: See the expected failure

uv run python manage.py check
Expected:
ERRORS:
catalog.Product.image: (fields.E210) Cannot use ImageField because Pillow is not installed.
        HINT: Get Pillow at https://pypi.org/project/Pillow/ or run command "python -m pip install Pillow".
The hint suggests pip install. In our project we translate that to uv, because pip would install Pillow without recording it in pyproject.toml/uv.lock, so the Docker worker and teammates would never get it.

Step 2: Add Pillow with uv

(Pause OneDrive syncing first if you like.)
uv add pillow
uv run python manage.py check
git diff pyproject.toml
- uv add → + pillow==12.x.x
- check → System check identified no issues (0 silenced).
- The diff shows the new line "pillow>=..." in dependencies. uv.lock changed too.

Step 3: Generate and read the migration

uv run python manage.py makemigrations catalog
uv run python manage.py sqlmigrate catalog 0002
Expected: catalog\migrations\0002_product_image.py → + Add field image to product. Open the file and find dependencies = [('catalog', '0001_initial')] and migrations.AddField(...).

In the SQL, look for ADD COLUMN "image" varchar(100) DEFAULT '' NOT NULL and DROP DEFAULT.

Step 4: Apply it and check the existing rows

uv run python manage.py migrate
docker compose exec db psql -U shoplite -d shoplite -c "SELECT id, name, image FROM catalog_product ORDER BY id;"
Your 4 products now have an image column containing an empty string. No image yet.

Step 5: Upload images in the admin

Find 2–3 pictures on your PC (any .jpg/.png/.webp: photos, downloads, even screenshots).
uv run python manage.py runserver
1. Products → open Blue Ceramic Mug → the new Image field → Choose file → Save.
2. The product list now shows the thumbnail column. Open the product again, and there's also a preview near the timestamps.
3. Right-click the thumbnail → Open image in new tab. The URL looks like http://127.0.0.1:8000/media/products/2026/09/yourfile.jpg. In the runserver log you'll see GET /media/products/2026/09/... 200, served by our static() URL pattern.
4. Validation test: make a fake image:
Set-Content $env:TEMP\fake.jpg "this is not an image"
   Upload fake.jpg (it's in %TEMP%: type %TEMP% in the file dialog's path bar). Expected: "Upload a valid image. The file you uploaded was either not an image or a corrupted image." That's Pillow inspecting the actual bytes, not trusting the .jpg extension.
5. Name collision test: upload the same picture to a second product. Then look at the folder:
Get-ChildItem -Recurse media
   The second copy got a random suffix like mug_Xy12AbC.jpg.

Stop the server with Ctrl+C.

Step 6: See the database side

docker compose exec db psql -U shoplite -d shoplite -c "SELECT id, name, image FROM catalog_product ORDER BY id;"
The image column contains only paths like products/2026/09/mug.jpg. The image bytes live in backend\media\.
