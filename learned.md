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