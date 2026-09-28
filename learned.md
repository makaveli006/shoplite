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



What & why

Everything so far went through the admin. But all our future code, from API views to the cart and checkout, talks to the database through the ORM in Python. Today you practise the ORM directly in the Django shell, learn to see the SQL it generates, and write a management command (seed_catalog) that fills the database with 21 sample products. We'll need that data for search, filtering, and pagination in Phase 4.

Files involved
backend/catalog/management/
├── __init__.py                 ← NEW (empty): makes "management" a Python package
└── commands/
    ├── __init__.py             ← NEW (empty)
    └── seed_catalog.py         ← NEW: `manage.py seed_catalog`
Django discovers commands by this exact folder structure: <app>/management/commands/<name>.py becomes manage.py <name>. I verified that manage.py help seed_catalog finds it and that all 21 product slugs are unique. I did not run it; you do that.

---

Concept 1: The ORM, QuerySets, and laziness

🧒 Simple: Instead of writing SQL letters to the database, you speak Python: "Products, please, cheaper than 20, sorted by price." The ORM translates. And it's lazy, like writing a shopping list without going to the shop. The trip happens only when you actually need the items (loop over them, print them, count them).

🛠️ Developer:
- Product.objects is the model's Manager. .all(), .filter(), .exclude(), and .order_by() return a QuerySet, a description of a query, not results.
- QuerySets are chainable and lazy: Product.objects.filter(...).order_by(...) runs no SQL until it's evaluated by iteration, list(), slicing with a step, len(), bool(), or printing.
- Some methods hit the database immediately:
  - .get(), .count(), .exists(), .first()
  - .create(), .update(), .delete(), .aggregate()
- str(qs.query) shows the SQL a QuerySet would run. It's great for learning and debugging.

Field lookups use double underscores:

┌──────────────────────────┬────────────────────────────────────┐
│          Lookup          │              Meaning               │
├──────────────────────────┼────────────────────────────────────┤
│ price__lt=20             │ price < 20                         │
├──────────────────────────┼────────────────────────────────────┤
│ name__icontains='mug'    │ case-insensitive ILIKE '%mug%'     │
├──────────────────────────┼────────────────────────────────────┤
│ id__in=[6, 7]            │ IN (6, 7)                          │
├──────────────────────────┼────────────────────────────────────┤
│ category__slug='kitchen' │ follows the ForeignKey with a JOIN │
└──────────────────────────┴────────────────────────────────────┘

Concept 2: The ways to change data (and their side effects)

🧒 Simple: There's editing one card carefully (the clerk checks everything and stamps the time), and there's one instruction for the whole drawer ("add 5 to every stock count"): fast, but no per-card stamping.

🛠️ Developer:

┌─────────────────────────────────┬──────────────────────────────────────────────────────────┬──────────────────────────┐
│              Code               │                           SQL                            │      Calls save()?       │
├─────────────────────────────────┼──────────────────────────────────────────────────────────┼──────────────────────────┤
│ Product.objects.create(...)     │ one INSERT                                               │ ✅ (our slug logic runs) │
├─────────────────────────────────┼──────────────────────────────────────────────────────────┼──────────────────────────┤
│ p.price = ...; p.save()         │ UPDATE all columns of that row                           │ ✅                       │
├─────────────────────────────────┼──────────────────────────────────────────────────────────┼──────────────────────────┤
│ p.save(update_fields=['price']) │ UPDATE only price (add updated_at if you want it bumped) │ ✅                       │
├─────────────────────────────────┼──────────────────────────────────────────────────────────┼──────────────────────────┤
│ qs.update(stock=F('stock') + 5) │ one UPDATE ... SET stock = stock + 5                     │ ❌                       │
├─────────────────────────────────┼──────────────────────────────────────────────────────────┼──────────────────────────┤
│ p.delete() / qs.delete()        │ DELETE (plus on_delete handling)                         │ ❌ (it calls delete())   │
└─────────────────────────────────┴──────────────────────────────────────────────────────────┴──────────────────────────┘

F('stock') means "the value currently in the database column," so the maths happens inside Postgres. Compare:
- p.stock = p.stock - 1; p.save() reads a value into Python and writes it back. Two customers doing that at the same moment can both read 5 and both write 4, losing a sale. That's a race condition.
- F('stock') - 1 is atomic in the database. We'll rely on this idea at checkout in Phase 7.

Concept 3: Management commands, and "idempotent" seeding

🧒 Simple: A management command is a custom button on the control panel. Ours is "stock the demo shop." It's idempotent: pressing it twice doesn't create duplicate products. The second press just refreshes what's already there, like a "reset to showroom" button.

🛠️ Developer:
- A command is a BaseCommand subclass with handle(). self.stdout.write(self.style.SUCCESS(...)) prints green text.
- update_or_create(slug=..., defaults={...}) does a SELECT by slug, then an UPDATE if found or an INSERT if not. It returns (obj, created).
- Fields not in defaults (like image) are left alone, so your uploaded photos survive re-seeding.
- @transaction.atomic wraps the whole run in one database transaction: all 21 products are saved, or (if anything fails) none are.
- Prices are built with Decimal('12.50') from strings, never floats.
- ⚠️ Seeding resets price/stock/description of the 4 products you made in the admin to the seed values. That's expected.

---

▶️ Your turn, Part A: the Django shell (on your 4 products)

cd "$env:USERPROFILE\OneDrive\Desktop\django-ecommerce\backend"
uv run python manage.py shell
You're now in a Python prompt >>> with Django loaded. (Django 5.1's shell doesn't auto-import models, so we import them.) Type the lines one at a time and read each result.

1. Imports
from decimal import Decimal
from django.db.models import F, Count, Sum, Avg
from catalog.models import Category, Product

2. Read: laziness and SQL
qs = Product.objects.filter(price__lt=20).order_by('price')
print(qs.query)
qs
qs.count()
- print(qs.query) shows SELECT ... WHERE "catalog_product"."price" < 20 ORDER BY "catalog_product"."price" ASC, and no SQL has run yet.
- Typing qs evaluates it: <QuerySet [<Product: Gel Pen Set>, <Product: Blue Ceramic Mug>, ...]>. Those names come from __str__.

3. Following a relationship (JOIN)
print(Product.objects.filter(category__slug='kitchen').query)
Product.objects.filter(category__slug='kitchen')
kitchen = Category.objects.get(slug='kitchen')
kitchen.products.all()
kitchen.products.count()
In the first query, look for INNER JOIN "catalog_category". kitchen.products works because of related_name='products'.

4. get() and its two errors
Product.objects.get(slug='chef-knife')
Product.objects.get(slug='does-not-exist')
Product.objects.get(category__slug='kitchen')
- The first returns exactly one object.
- The second → DoesNotExist: Product matching query does not exist.
- The third → MultipleObjectsReturned: get() returned more than one Product -- it returned 2!

get() means "exactly one, otherwise it's an error." In the API we'll turn DoesNotExist into a 404.

5. Decimal vs. float
0.1 + 0.2
Decimal('0.1') + Decimal('0.2')
Decimal(0.1)
mug = Product.objects.get(slug='blue-ceramic-mug')
mug.price, type(mug.price)
mug.price * 3
- 0.30000000000000004 vs. Decimal('0.3')
- Decimal(0.1) shows the float's hidden blur: 0.1000000000000000055511151231257827.... That's why we always build Decimals from strings.
- The price comes back from Postgres as a Decimal, so maths stays exact: Decimal('37.50').

6. Create
books = Category.objects.create(name='Test Books')
books.slug
p = Product.objects.create(category=books, name='Test Novel', price=Decimal('9.99'), stock=3)
p.id, p.slug, p.created_at
The slugs test-books and test-novel were filled by our save() override. p.id comes from the sequence (ID gaps, remember).

7. Update: single object vs. bulk + F()
p.price = Decimal('11.49')
p.save(update_fields=['price', 'updated_at'])
Product.objects.filter(category=books).update(stock=F('stock') + 10)
p.stock
p.refresh_from_db()
p.stock
- update() returns how many rows changed (1).
- p.stock still says 3 after the update! The Python object is a snapshot from when it was loaded, and update() changed the database, not your object. refresh_from_db() reloads it → 13. Remember this: objects in memory don't auto-refresh.

8. Aggregation
Product.objects.aggregate(total_items=Sum('stock'), avg_price=Avg('price'))
Category.objects.annotate(n=Count('products')).values_list('name', 'n')
- aggregate gives one summary dict for the whole table.
- annotate adds a value per row, the same trick as the admin's product count.

9. Delete, and PROTECT again
books.delete()
p.delete()
books.delete()
- The first books.delete() → ProtectedError: ("Cannot delete some instances of model 'Category' because they are referenced through protected foreign keys: 'Product.category'.", ...)
- p.delete() → (1, {'catalog.Product': 1}), which is the number of rows deleted per model.
- The second books.delete() now succeeds, because nothing references it anymore.

Leave the shell:
exit()

---

▶️ Your turn, Part B: the seed command

1. Read catalog\management\commands\seed_catalog.py. It's a data dictionary, update_or_create, a counter, and a success message.

2. Run it twice:
uv run python manage.py seed_catalog
uv run python manage.py seed_catalog
Expected:
Catalog seeded: 5 categories, 17 products created, 4 products updated.
Catalog seeded: 5 categories, 0 products created, 21 products updated.
- First run: your 4 existing products were updated (matched by slug), and 17 are new. Your images are still there.
- Second run: nothing duplicated. That's idempotency.

3. Look at it in the admin (runserver → Products): 21 products, 5 categories, and one hidden product (Discontinued Travel Mug, Active ❌). Linen Cushion Cover has stock 0. We'll use both when testing the API.

---

▶️ Your turn, Part C: see the N+1 problem with your own eyes

uv run python manage.py shell
from django.db import connection, reset_queries
from catalog.models import Product

reset_queries()
names = [(p.name, p.category.name) for p in Product.objects.all()]
len(connection.queries)

reset_queries()
names = [(p.name, p.category.name) for p in Product.objects.select_related('category')]
len(connection.queries)
print(connection.queries[0]['sql'])
exit()
- The first count is 22 queries: 1 for the products and 1 per product for its category.
- With select_related, it's 1 query, and the printed SQL contains INNER JOIN "catalog_category".

connection.queries only records queries when DEBUG=True. With 21 products the difference is small, but with 10,000 products and real network latency, that's the difference between a fast page and a timeout. Our API views will use select_related from day one.

---


# select_related('category') : When you fetch the products, also fetch their related Category in the same database query.







What & why

So far only the admin (HTML pages for staff) can show products. Our React frontend, and any mobile app later, needs data, not HTML pages. Today we build the first two endpoints of our REST API:
- GET /api/products/: the list of products visible in the shop
- GET /api/products/<slug>/: one product, or 404

Everything is read-only for now. Search, pagination, and admin-only writes come in the next lessons.

Files involved (all written; I verified the endpoints respond)
backend/
├── config/settings.py       ← ✏️ 'rest_framework' added to INSTALLED_APPS
├── config/urls.py           ← ✏️ path('api/', include('catalog.urls'))
└── catalog/
    ├── serializers.py       ← NEW: ProductSerializer  (Product object ↔ JSON)
    ├── views.py             ← ✏️ ProductListView, ProductDetailView
    └── urls.py              ← NEW: the catalog's URL patterns
How a request flows through them:
GET /api/products/chef-knife/
  │
  ▼ config/urls.py      'api/'  → include('catalog.urls')        (strips "api/")
  ▼ catalog/urls.py     'products/<slug:slug>/' → ProductDetailView, with slug='chef-knife'
  ▼ catalog/views.py    ProductDetailView:
  │     queryset.get(slug='chef-knife')   → Product object   (or 404 if missing/inactive)
  │     ProductSerializer(product).data   → Python dict
  ▼ DRF Response + renderer               → JSON text (or the browsable HTML page)
Browser / React / PowerShell  ◀── 200 OK  {"id": 7, "name": "Chef Knife", "price": "49.99", ...}

---

Concept 1: API endpoints, and why JSON instead of HTML

🧒 Simple: The admin is like a shop window: nicely arranged for a person to look at. An API is the delivery hatch at the back: goods are handed out in standard boxes (JSON), so anyone can receive them (the website, a phone app, another company's system) and arrange them however they like.

🛠️ Developer: An endpoint is a URL + HTTP method that returns data. REST conventions map resources to URLs:

┌───────────────────────────────┬────────────────────────┐
│           Endpoint            │        Meaning         │
├───────────────────────────────┼────────────────────────┤
│ GET /api/products/            │ the product collection │
├───────────────────────────────┼────────────────────────┤
│ GET /api/products/chef-knife/ │ one product item       │
└───────────────────────────────┴────────────────────────┘

The response body is JSON with Content-Type: application/json. The frontend (Phase 11) fetches that JSON with Axios and renders it with React. The backend knows nothing about the page layout. That separation lets the React app, a mobile app, and scripts all share one API.

Concept 2: Django REST Framework (DRF)

🧒 Simple: Django alone can build shop windows (HTML). DRF adds a well-equipped delivery department: standard boxes, packing rules, a gatekeeper who checks who may collect what, and even a see-through test hatch where you can inspect deliveries in the browser.

🛠️ Developer: DRF adds, on top of Django:
- Serializers: convert objects to and from JSON, with validation
- Request/Response: parsing JSON, form, or multipart input; rendering JSON output
- Generic views and ViewSets: common CRUD behaviour in a few lines
- Authentication, permissions, and throttling
- Pagination, filtering, and search
- The browsable API: HTML pages for exploring endpoints

Adding 'rest_framework' to INSTALLED_APPS activates its templates and static files (for the browsable API). The package itself was already installed in Lesson 2.1.

Concept 3: Serializers

🧒 Simple: A serializer is a packing clerk with a checklist. Going out, it takes a product from the warehouse and packs the listed fields into a standard box (JSON). Coming in (later lessons), it unpacks a box sent by a customer, checks every item against the rules, and only then lets it into the warehouse.

🛠️ Developer:
- ModelSerializer inspects the model and auto-creates matching serializer fields: types, max_length, validators, read_only for auto fields.
- Output: serializer.data → to_representation() → a dict of JSON-friendly values.
- Input: serializer.is_valid() → to_internal_value() + validators → serializer.validated_data → .save().
- Meta.fields is an explicit allow-list. Always list fields explicitly rather than using '__all__', so a new sensitive field (say, cost_price) never leaks into the API by accident.

Look at a few choices DRF made in our JSON:

┌────────────┬────────────────────────────────────────────┬────────────────────────────────────────────────────────────────────────────────────────────┐
│   Field    │                 JSON value                 │                                            Why                                             │
├────────────┼────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────┤
│ price      │ "12.50", a string                          │ JSON numbers are binary floats in JavaScript, which would blur money (Lesson 3.1). DRF     │
│            │                                            │ sends Decimals as exact strings by default, and the frontend formats them for display.     │
├────────────┼────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────┤
│ created_at │ "2026-09-27T15:18:46.871330Z"              │ ISO 8601 in UTC (Z), which every language can parse                                        │
├────────────┼────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────┤
│ image      │ "http://127.0.0.1:8000/media/products/..." │ DRF builds an absolute URL from the request's host, so the React app on another port can   │
│            │                                            │ load it                                                                                    │
├────────────┼────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────┤
│ category   │ 2                                          │ just the foreign key id for now. In Lesson 4.2 we'll nest {"id": 2, "name": "Kitchen",     │
│            │                                            │ "slug": "kitchen"}.                                                                        │
└────────────┴────────────────────────────────────────────┴────────────────────────────────────────────────────────────────────────────────────────────┘

Concept 4: Generic class-based views

🧒 Simple: Instead of writing the whole "find product, pack it, send it, or say not found" procedure yourself, you hire a trained clerk (a generic view) and give them two pieces of paper: which shelf to take from (queryset) and which checklist to pack with (serializer_class).

🛠️ Developer:
- ListAPIView handles GET with get_queryset() → paginate (later) → serializer(many=True) → Response.
- RetrieveAPIView handles GET with get_object(): it filters queryset by lookup_field from the URL, returns 404 if nothing matches, runs object permission checks, then serializes.
- Every other method (POST, PUT, DELETE) gets 405 Method Not Allowed automatically, because these views only implement get.
- queryset = Product.objects.filter(is_active=True) means hidden products don't exist as far as the public API is concerned. The Discontinued Travel Mug returns 404 even though it's in the database.
- .select_related('category') is already there, so when Lesson 4.2 adds category details, we won't get N+1 queries.

Concept 5: Content negotiation (one endpoint, two formats)

🧒 Simple: The same delivery hatch gives a nicely printed report to a person in a browser, and a plain machine-readable box to a program, depending on what the visitor says they can read.

🛠️ Developer:
- DRF picks a renderer from the request's Accept header. Browsers send Accept: text/html, so they get the browsable API (HTML around the JSON). Axios and PowerShell ask for JSON, so they get raw JSON.
- ?format=json forces JSON in the browser.
- The response header Vary: Accept tells caches that the output depends on the Accept header.

---

The code, explained

catalog/serializers.py
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'slug', 'description', 'price', 'stock',
                  'image', 'is_active', 'category', 'created_at', 'updated_at']   # explicit allow-list
catalog/views.py
class ProductListView(generics.ListAPIView):
    queryset = Product.objects.filter(is_active=True).select_related('category')
    serializer_class = ProductSerializer

class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.filter(is_active=True).select_related('category')
    serializer_class = ProductSerializer
    lookup_field = 'slug'        # the URL's <slug:slug> is matched against Product.slug
catalog/urls.py
urlpatterns = [
    path('products/', views.ProductListView.as_view(), name='product-list'),
    path('products/<slug:slug>/', views.ProductDetailView.as_view(), name='product-detail'),
]
- <slug:slug> is a path converter. It only matches slug characters (letters, digits, -, _), and passes the value to the view as slug.
- .as_view() turns the class into a function Django can call once per request.

config/urls.py
path('api/', include('catalog.urls')),   # every catalog URL gets the "api/" prefix

A small debugging story from my verification

When I tested these endpoints with Django's test client, the first attempt failed with DisallowedHost: Invalid HTTP_HOST header: 'testserver'. The test client pretends to be a host called testserver, and our ALLOWED_HOSTS from Lesson 2.3 only allows localhost and 127.0.0.1. The security setting worked exactly as designed. I re-ran with HTTP_HOST='localhost': 200, 20 products (the 21st is hidden), the Discontinued mug → 404, and Chef Knife's price → "49.99". (Django's real test runner in Phase 9 handles this automatically.)

---

▶️ Your turn

You need two PowerShell windows: one runs the server, the other sends requests.

Window 1:
cd "$env:USERPROFILE\OneDrive\Desktop\django-ecommerce\backend"
uv run python manage.py check
uv run python manage.py runserver

Step 1: The browsable API

Open http://127.0.0.1:8000/api/products/
- You'll see a Product List page. The grey box at the top shows the real response headers: HTTP 200 OK, Allow: GET, HEAD, OPTIONS, Content-Type: application/json, Vary: Accept. Allow doesn't include POST, because this view is read-only.
- Below it is the JSON: a list of 20 products, newest first (Meta.ordering). Check that Discontinued Travel Mug is missing.
- Click an image URL. Your uploaded photo opens.

Open http://127.0.0.1:8000/api/products/?format=json. That's the raw JSON, exactly what React will receive.

Step 2: The detail endpoint and 404s

- http://127.0.0.1:8000/api/products/chef-knife/ → one object.
- http://127.0.0.1:8000/api/products/discontinued-travel-mug/ → 404 with {"detail": "No Product matches the given query."}. It exists in the database but is hidden from the API by the queryset.
- http://127.0.0.1:8000/api/products/nope/ → the same 404.

Step 3: Call the API from PowerShell, like a program would

Window 2:
Invoke-RestMethod http://127.0.0.1:8000/api/products/ | Select-Object name, price, stock | Format-Table
Invoke-RestMethod sends the request, sees application/json, and parses the JSON into PowerShell objects for you. That's why you can pick columns with Select-Object. React's Axios will do the same thing in JavaScript.

curl.exe -i http://127.0.0.1:8000/api/products/chef-knife/
curl.exe -i shows the raw HTTP response: the status line, headers, and body. (Use curl.exe, not curl. In Windows PowerShell 5.1, curl is an alias for Invoke-WebRequest.)

Step 4: Try the methods that aren't allowed

curl.exe -i -X POST http://127.0.0.1:8000/api/products/
curl.exe -i -X DELETE http://127.0.0.1:8000/api/products/chef-knife/
Both → HTTP/1.1 405 Method Not Allowed with {"detail":"Method \"POST\" not allowed."} (and DELETE). Nobody can change products through the API yet. In Lesson 4.4 we'll allow admins only.

Step 5: Read the server log (Window 1)

"GET /api/products/ HTTP/1.1" 200 ...
"GET /api/products/?format=json HTTP/1.1" 200 ...
Not Found: /api/products/discontinued-travel-mug/
"GET /api/products/discontinued-travel-mug/ HTTP/1.1" 404 ...
Method Not Allowed (POST): /api/products/
"POST /api/products/ HTTP/1.1" 405 ...
These are the same HTTP status codes from Lesson 0.1, now produced by your own API.




What & why

Our product JSON currently says "category": 2. The React app would need a second request to learn that 2 means "Kitchen." Today we improve the serializers:
1. Nested reads: "category": {"id": 2, "name": "Kitchen", "slug": "kitchen"}
2. Simple writes: clients send "category_id": 2 when creating or editing a product (used from Lesson 4.3)
3. A computed field: "in_stock": true/false
4. Custom validation with clear 400 messages instead of crashes
5. A new /api/categories/ endpoint, needed for the shop's category filter

Files involved (written and verified)
backend/catalog/
├── serializers.py   ← ✏️ CategorySerializer, CategorySummarySerializer, improved ProductSerializer
├── views.py         ← ✏️ + CategoryListView, CategoryDetailView
└── urls.py          ← ✏️ + categories/ and categories/<slug>/

---

Concept 1: Nested serializers (reading related objects)

🧒 Simple: Instead of a delivery note that says "shelf #2," the box now includes a small label: "Shelf #2: Kitchen (kitchen)." The receiver doesn't need to phone the warehouse to ask what shelf #2 is.

🛠️ Developer: A serializer can be used as a field inside another serializer:
category = CategorySummarySerializer(read_only=True)
DRF serializes product.category with that smaller serializer. Because the view uses .select_related('category'), all the categories arrive in the same SQL query. I measured it: 1 query for all 20 products, including the nested categories. Without select_related it would be 21 (the N+1 problem from Lesson 3.6).

Why two category serializers?
- CategorySerializer (id, name, slug, description) is used by /api/categories/.
- CategorySummarySerializer (id, name, slug) is used inside each product, so we don't repeat long descriptions in every product.

Concept 2: Different shapes for reading and writing

🧒 Simple: When the warehouse sends you a product, the label is detailed ("Kitchen"). When you order a change, you only need to write the shelf number ("2"), because the warehouse already knows its shelves.

🛠️ Developer: Two fields, each only used in one direction:
category = CategorySummarySerializer(read_only=True)       # appears in responses only
category_id = serializers.PrimaryKeyRelatedField(
    source='category',                  # writing category_id sets product.category
    queryset=Category.objects.all(),    # the id must exist in this queryset
    write_only=True,                    # never appears in responses
)
- read_only=True: ignored if a client sends it.
- write_only=True: accepted as input but never output.
- source='category' maps the JSON name category_id to the model attribute category. DRF looks up the Category and validates that it exists (Invalid pk "999" - object does not exist.).

This read-nested / write-by-id pattern is one of the most common in real APIs.

Concept 3: Computed fields (SerializerMethodField)

🧒 Simple: A sticker the packing clerk adds to each box, based on what's inside: "✅ In stock" or "❌ Sold out." It's not stored anywhere. It's worked out while packing.

🛠️ Developer: in_stock = serializers.SerializerMethodField() is read-only, and DRF calls get_in_stock(self, obj) to produce its value. It's handy for derived values the UI needs (badges, flags). The logic lives on the server, so React doesn't have to reimplement "what counts as in stock."

Concept 4: Validation layers in a serializer

🧒 Simple: Incoming boxes pass three checkpoints:
1. Each item alone: is the price a number? Is it at least 0.01?
2. Custom rules per item (optional)
3. The whole box together: "the name you chose would clash with an existing product's web address."

Only a box that passes all three gets into the warehouse. Otherwise the sender gets a list of everything wrong at once.

🛠️ Developer: serializer.is_valid() runs, in order:
1. Field validation: types, max_length, required, min_value. ModelSerializer copies these from the model, including our MinValueValidator(0.01), PositiveIntegerField's >= 0, and UniqueValidator for unique fields.
2. validate_<field>(self, value) methods, if defined (per-field custom rules).
3. validate(self, attrs): object-level rules that need several fields at once.

Errors are collected into serializer.errors, a dict of field → messages. In a view that becomes a 400 Bad Request response with that dict as JSON.

The bug our validate() prevents:
- Our model fills an empty slug from the name inside save().
- If someone creates "Chef Knife" again through the API without a slug, DRF's automatic UniqueValidator has nothing to check (the slug is empty). Then save() generates chef-knife, and Postgres rejects the duplicate → IntegrityError → an ugly 500 Internal Server Error.
- Our validate() generates the slug early and checks it, so the client gets a clear 400 instead.

Rule of thumb: anything the client can get wrong should be a 400 with a message, never a 500.

---

The code, explained (catalog/serializers.py, key parts)

class ProductSerializer(serializers.ModelSerializer):
    category = CategorySummarySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        source='category', queryset=Category.objects.all(), write_only=True)
    in_stock = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id', 'name', 'slug', 'description', 'price', 'stock', 'in_stock',
                  'image', 'is_active', 'category', 'category_id', 'created_at', 'updated_at']

    def get_in_stock(self, obj):             # "get_" + field name
        return obj.stock > 0

    def validate(self, attrs):               # attrs = already field-validated data
        if self.instance is None and not attrs.get('slug'):   # only when CREATING without a slug
            slug = slugify(attrs['name'])
            if not slug:                                        # e.g. name "!!!" → slug ""
                raise serializers.ValidationError({'name': 'The name must contain at least one letter or digit.'})
            if Product.objects.filter(slug=slug).exists():
                raise serializers.ValidationError({'slug': f'A product with the slug "{slug}" already exists. ...'})
            attrs['slug'] = slug
        return attrs                         # must return the (possibly modified) data
- self.instance is None when creating, and the existing product when updating.
- Raising ValidationError({'field': 'message'}) attaches the error to a specific field, so the React form can show it under the right input.

---

▶️ Your turn

Window 1:
cd "$env:USERPROFILE\OneDrive\Desktop\django-ecommerce\backend"
uv run python manage.py runserver

Step 1: See the new JSON shape

Window 2:
(Invoke-RestMethod http://127.0.0.1:8000/api/products/) | Select-Object name, price, stock, in_stock, @{n='category'; e={$_.category.name}} | Format-Table
- Parentheses: the PowerShell 5.1 fix.
- @{n='category'; e={$_.category.name}} is a calculated column that reaches into the nested object.

You'll see Linen Cushion Cover with in_stock = False.

In the browser, open http://127.0.0.1:8000/api/products/chef-knife/. Notice that category is now an object and category_id is not shown, because it's write-only.

Step 2: The categories endpoint

(Invoke-RestMethod http://127.0.0.1:8000/api/categories/) | Format-Table
Invoke-RestMethod http://127.0.0.1:8000/api/categories/kitchen/
Five categories, sorted by name (Meta.ordering).

Step 3: Test validation directly in the shell

There's no create endpoint yet (that's Lesson 4.3), but a serializer can be tested on its own. That's one of the nice things about keeping validation in serializers. is_valid() doesn't write anything to the database.

Stop the server (Ctrl+C) or use Window 2:
uv run python manage.py shell
from catalog.serializers import ProductSerializer

s = ProductSerializer(data={'name': 'Chef Knife', 'price': '0', 'stock': -1, 'category_id': 999})
s.is_valid()
s.errors
→ False, and three errors at once:
- price: Ensure this value is greater than or equal to 0.01.
- stock: Ensure this value is greater than or equal to 0.
- category_id: Invalid pk "999" - object does not exist.

s = ProductSerializer(data={'name': 'Chef Knife', 'price': '10.00', 'stock': 1, 'category_id': 2})
s.is_valid()
s.errors
→ False, {'slug': ['A product with the slug "chef-knife" already exists. ...']}. The fields were fine individually, so our object-level validate() caught the clash.

s = ProductSerializer(data={'name': '!!!', 'price': '10.00', 'stock': 1, 'category_id': 2})
s.is_valid()
s.errors
→ {'name': ['The name must contain at least one letter or digit.']}

s = ProductSerializer(data={'name': 'Brand New Teapot', 'price': '25.00', 'stock': 4, 'category_id': 2})
s.is_valid()
s.validated_data
exit()
→ True, and validated_data contains Python values ready for the database: 'price': Decimal('25.00'), 'category': <Category: Kitchen>, 'slug': 'brand-new-teapot'. The string "25.00" became a Decimal, the id 2 became a Category object, and the slug was filled in. Nothing is saved until .save() is called, which views will do in Lesson 4.3.

Step 4 (optional): Count the queries yourself

uv run python manage.py shell -c "from django.test import Client; from django.db import connection, reset_queries; c = Client(HTTP_HOST='localhost', HTTP_ACCEPT='application/json'); reset_queries(); r = c.get('/api/products/'); print(r.status_code, len(r.json()), 'products,', len(connection.queries), 'SQL query')"
→ 200 20 products, 1 SQL query. Try temporarily removing .select_related('category') from ProductListView and run it again: 21 queries. Then put it back.

Step 5: Commit

cd ..
git add backend/catalog'brand-new-teapot'. The string "25.00" became a Decimal, the id 2 became a Category object, and the slug was filled in. Nothing is saved until .save() is called, which views will do in Lesson 4.3.

Step 4 (optional): Count the queries yourself

uv run python manage.py shell -c "from django.test import Client; from django.db import connection, reset_queries; c = Client(HTTP_HOST='localhost', HTTP_ACCEPT='application/json'); reset_queries(); r = c.get('/api/products/'); print(r.status_code, len(r.json()), 'products,', len(connection.queries), 'SQL query')"
→ 200 20 products, 1 SQL query. Try temporarily removing .select_related('category') from ProductListView and run it again: 21 queries. Then put it back.



What & why

Our API can only read. The shop's administrators need to create, update, and delete products and categories through the API too (the React admin screens in Phase 14 will use these endpoints). Today:
1. Replace the four read-only views with two ViewSets that support full CRUD
2. Let a Router generate all the URLs
3. Add a permission: anyone can read, only staff can write
4. Make DRF deny by default (every endpoint requires login unless a view says otherwise)
5. Turn the "category still has products" crash into a clear 409 Conflict

Files involved (written, and verified in a rolled-back test, so nothing was saved)
backend/
├── core/                        ← NEW Python package for code shared by all apps
│   ├── __init__.py
│   └── permissions.py           ←   IsAdminOrReadOnly
├── catalog/views.py             ← ✏️ CategoryViewSet, ProductViewSet (replace the 4 views)
├── catalog/urls.py              ← ✏️ DefaultRouter generates the URLs
├── config/urls.py               ← ✏️ + api-auth/ (login link for the browsable API)
└── config/settings.py           ← ✏️ REST_FRAMEWORK: authentication + permission defaults
core is a plain Python package, not a Django app. It has no models, admin, or migrations, so it doesn't need startapp or INSTALLED_APPS. Any code can import from it: from core.permissions import IsAdminOrReadOnly.

---

Concept 1: ViewSets (one class, many actions)

🧒 Simple: Before, we had separate clerks: one who hands out the product list and one who hands out single products. A ViewSet is one experienced clerk who handles every request about products: listing, showing one, adding, changing, removing. You just tell them which shelf, which checklist, and who's allowed to do what.

🛠️ Developer: ModelViewSet combines mixins that implement actions, not HTTP methods:

┌────────────────┬────────┬───────────────────────┬────────────────┐
│     Action     │  HTTP  │          URL          │ Success status │
├────────────────┼────────┼───────────────────────┼────────────────┤
│ list           │ GET    │ /api/products/        │ 200            │
├────────────────┼────────┼───────────────────────┼────────────────┤
│ create         │ POST   │ /api/products/        │ 201 Create
├────────────────┼────────┼───────────────────────┼────────────────┤
│ retrieve       │ GET    │ /api/products/<slug>/ │ 200            │
├────────────────┼────────┼───────────────────────┼────────────────┤
│ update         │ PUT    │ /api/products/<slug>/ │ 200
├────────────────┼────────┼───────────────────────┼────────────────┤
│ partial_update │ PATCH  │ /api/products/<slug>/ │ 200            │
├────────────────┼────────┼───────────────────────┼────────────────┤
│ destroy        │ DELETE │ /api/products/<slug>/ │ 204 No Content │
└────────────────┴────────┴───────────────────────┴────────────────┘

Each action uses the same get_queryset(), serializer_class, and permission_classes. So create runs serializer.is_valid() (our validation from Lesson 4.2) and then serializer.save(), and a failed validation automatically becomes a 400 with serializer.errors as JSON.

PUT vs. PATCH:
- PUT = "replace the whole thing." Every required field must be sent, otherwise 400.
- PATCH = "change only these fields."
- The React app will mostly use PATCH.

Concept 2: Routers (URLs generated for you)

🧒 Simple: Instead of painting every door sign by hand, you tell the sign-maker "this corridor is products," and it produces all the standard signs (list
door, item door) consistently.

🛠️ Developer: router.register('products', ProductViewSet) generates:
- products/ → {get: list, post: create}
- products/<slug>/ → {get: retrieve, put: update, patch: parti

The URL names are product-list and product-detail, derived from the queryset's model. DefaultRouter also adds an API root at /api/ that links to every registered resource.

Concept 3: Authentication vs. permissions (who are you? / what may you do?)

🧒 Simple: At the staff entrance, the ID check (authentication) asks who are you?, and the access list (permission) asks are you allowed in here? A customer with a valid ID is still turned away from the stockroom.

🛠️ Developer: For every request DRF runs, in order:
1. Authentication classes (DEFAULT_AUTHENTICATION_CLASSES) try to identify the user and set request.user. Nobody identified → AnonymousUser.
   - SessionAuthentication: the browser's login cookie (after logging in to /admin/ or /api-auth/login/)
   - BasicAuthentication: Authorization: Basic base64(email:password) on every request. Temporary, only so you can test from PowerShell. Phase 5 replaces it with JWT.
2. Permission classes decide yes or no with has_permission(request, view):
   - Globally (DEFAULT_PERMISSION_CLASSES = [IsAuthenticated]): deny by default. Any endpoint we forget to configure requires login instead of being wide open.
   - Per view (permission_classes = [IsAdminOrReadOnly]): overrides the default for the catalog.
3. On failure you get 403 Forbidden. (With session authenticatswers 403 for "not logged in at all". With JWT in Phase 5 that
   becomes 401 Unauthorized, and I'll explain the difference t

Our permission:
class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:          # ('GET', 'HEAD', 'OPTIONS'): reading
            return True
        return bool(request.user and request.user.is_staff)   # writing: staff only

Concept 4: The same data looks different to different users

🧒 Simple: Customers only see goods on the shop floor. Staff can also see what's in the back room (hidden items), so they can fix and restore them.

🛠️ Developer:
def get_queryset(self):
    queryset = super().get_queryset()
    if self.request.user.is_staff:
        return queryset                        # all products
    return queryset.filter(is_active=True)    # only visible ones
get_queryset() runs per request, so it can depend on who's asking. Because retrieve, update, and destroy also use it, a customer asking for a hidden product gets 404, not 403. The API doesn't even reveal that the product exists.

Concept 5: Turning crashes into meaningful status codes

🧒 Simple: If you ask to remove a shelf that still has goods on it, the clerk should say "please empty it first," not faint.

🛠️ Developer: on_delete=PROTECT raises ProtectedError. Uncaught, that's a 500 Internal Server Error. We catch it in destroy() and return 409 Conflict, which is the HTTP status for "the request conflicts with the current state of the resource."

---

Status codes you'll see today

┌─────────────────┬──────────────────────────────┬───────────────────────────────────────┐
│      Code       │           Meaning            │
├─────────────────┼──────────────────────────────┼───────────────────────────────────────┤
│ 200 OK          │ success with a body          │ GET, PUT, PATCH                       │
├─────────────────┼──────────────────────────────┼───────────────────────────────────────┤
│ 201 Created     │ a new resource was created   │ POST                                  │
├─────────────────┼──────────────────────────────┼───────────────────────────────────────┤
│ 204 No Content  │ success, nothing to return   │ DELETE
├─────────────────┼──────────────────────────────┼───────────────────────────────────────┤
│ 400 Bad Request │ invalid data                 │ validation errors, incomplete PUT     │
├─────────────────┼──────────────────────────────┼────────────
│ 403 Forbidden   │ not logged in / not allowed  │ anonymous or customer writing         │
├─────────────────┼──────────────────────────────┼────────────
│ 404 Not Found   │ doesn't exist for you        │ hidden product as a customer          │
├─────────────────┼──────────────────────────────┼───────────────────────────────────────┤
│ 409 Conflict    │ conflicts with current state │ deleting a category that has products │
└─────────────────┴──────────────────────────────┴───────────────────────────────────────┘

---

▶️ Your turn

Window 1:
cd "$env:USERPROFILE\OneDrive\Desktop\django-ecommerce\backend"
uv run python manage.py check
uv run python manage.py runserver

Step 1: Deny by default, in the browser

Open http://127.0.0.1:8000/api/ in a private/incognito window (so you're not logged in from the admin).
→ 403 "Authentication credentials were not provided." The router's API root has no permission_classes of its own, so it inherited our global IsAuthenticated. That's deny by default working.

Now open http://127.0.0.1:8000/api/products/. It's public (IsAdminOrReadOnly allows GET), and there's no form at the bottom, because anonymous users can't POST.

Click Log in (top right), log in with your admin email, and look again:
- http://127.0.0.1:8000/api/ now lists categories and products.
- http://127.0.0.1:8000/api/products/ now has a form at the bottom (HTML form / Raw data) for creating products. The browsable API only shows what you are allowed to do.
- http://127.0.0.1:8000/api/products/discontinued-travel-mug/ → 200 for you as staff (it's 404 in the private window).

Step 2: Prepare PowerShell for authenticated requests

Window 2. Put your real passwords in place of the placeholders:
$admin    = "subin@ontash.net:YOUR_ADMIN_PASSWORD"
$customer = "customer@example.com:YOUR_CUSTOMER_PASSWORD"
$api      = "http://127.0.0.1:8000/api"

@{ name = 'Brand New Teapot'; price = '25.00'; stock = 4; category_id = 2 } | ConvertTo-Json | Set-Content -Encoding ascii "$env:TEMP\teapot.json"
@{ price = '19.99' } | ConvertTo-Json | Set-Content -Encoding
Get-Content "$env:TEMP\teapot.json"
- curl.exe -u "email:password" sends Basic authentication.
- We write the JSON bodies to files and send them with --data-binary "@file", because Windows PowerShell 5.1 mangles double quotes inside arguments passed to programs like curl.exe. Files avoid that problem entirely.
- ⚠️ Passwords typed like this end up in your PowerShell histo own dev machine with dev passwords, and it's one reason Basicauth is temporary.

Step 3: The permission matrix

Each command prints the status line first. Read it before the body.

(a) Anonymous create → 403
curl.exe -i -X POST -H "Content-Type: application/json" --data-binary "@$env:TEMP\teapot.json" "$api/products/"
→ 403 Forbidden {"detail":"Authentication credentials were not provided."}

(b) Customer create → 403
curl.exe -i -u $customer -X POST -H "Content-Type: application/json" --data-binary "@$env:TEMP\teapot.json" "$api/products/"
→ 403 Forbidden {"detail":"You do not have permission to perform this action."}. The customer was identified, but isn't allowed. Compare the two messages.

(c) Admin create → 201
curl.exe -i -u $admin -X POST -H "Content-Type: application/json" --data-binary "@$env:TEMP\teapot.json" "$api/products/"
→ 201 Created, with the new product in the body: "slug":"brand-new-teapot" (from our validate()) and "category":{"id":2,"name":"Kitchen",...}.

(d) Same request again → 400
curl.exe -i -u $admin -X POST -H "Content-Type: application/json" --data-binary "@$env:TEMP\teapot.json" "$api/products/"
→ 400 Bad Request {"slug":["A product with the slug \"brand-ne."]}

(e) Update one field with PATCH → 200
curl.exe -i -u $admin -X PATCH -H "Content-Type: application/json" --data-binary "@$env:TEMP\patch.json" "$api/products/brand-new-teapot/"
→ 200 OK, "price":"19.99", and updated_at changed.

(f) PUT with only one field → 400
curl.exe -i -u $admin -X PUT -H "Content-Type: application/json" --data-binary "@$env:TEMP\patch.json" "$api/products/brand-new-teapot/"
→ 400 listing the required fields that are missing (name, category_id). That's PUT's "replace everything" rule.

(g) Delete a category that has products → 409
curl.exe -i -u $admin -X DELETE "$api/categories/kitchen/"
→ 409 Conflict {"detail":"This category still has products. Move or delete them first."}

(h) Delete the teapot → 204, then → 404
curl.exe -i -u $admin -X DELETE "$api/products/brand-new-teapot/"
curl.exe -i "$api/products/brand-new-teapot/"
→ 204 No Content (empty body), then 404 Not Found.

(i) Hidden product: anonymous vs. admin
curl.exe -s -o NUL -w "anonymous: %{http_code}`n" "$api/products/discontinued-travel-mug/"
curl.exe -s -o NUL -w "admin:     %{http_code}`n" -u $admin "$api/products/discontinued-travel-mug/"
→ anonymous: 404, admin: 200. The same URL gives a different answer for a different user (get_queryset).
(-s = silent, -o NUL = discard the body, -w = print just the s

Step 4: Read the server log (Window 1)

You'll see Django logging each non-2xx response with its reason: Forbidden: /api/products/, Bad Request: /api/products/, Conflict: /api/categories/kitchen/, Not Found: /api/products/brand-new-teapot/. It's a handy one-line summary of what went wrong.




What & why

The product list returns everything at once, with no way to search or filter. A real shop page needs:
- Search: "mug"
- Filtering: category = Kitchen, price between 15 and 45, only in-stock items
- Sorting: cheapest first
- Pagination: 12 products per page instead of thousands in one response

All of these are driven by URL query parameters, which is exactly what the React product page will send in Phase 11.

Files involved (written and verified; details below)
backend/
├── pyproject.toml / uv.lock     ← YOU: uv add django-filter
├── config/settings.py           ← ✏️ 'django_filters' app; pagination + filter backends in REST_FRAMEWORK
├── core/pagination.py           ← NEW: StandardPagination (12 per page, ?page_size= up to 100)
├── core/filters.py              ← NEW: StableOrderingFilter (a tie-breaker so pages never overlap)
├── catalog/filters.py           ← NEW: ProductFilter (category, min_price, max_price, in_stock)
└── catalog/views.py             ← ✏️ filterset_class, search_fields, ordering_fields; categories not paginated

A dependency-resolution story from my verification (a real-world lesson)

To test the code before you install anything, I first used uv run --with django-filter, which adds a package temporarily without touching pyproject.toml. It crashed: ImportError: cannot import name 'cc_delim_re' from 'django.utils.cache'.

Root cause:
- The newest django-filter requires Django 5.2 or newer.
- My temporary overlay therefore pulled in a newer Django, which shadowed your 5.1.7.
- DRF then tried to import something that Django version no longer has.

How I checked what you will get: I asked uv's resolver with your pin (django==5.1.7), and it picks django-filter 25.1, the newest version compatible with Django 5.1. Re-running the tests with exactly those versions p

Why this matters to you: it's the resolver's job, from Lesson v add django-filter respects your django==5.1.7 pin andautomatically chooses an older compatible django-filter. This is also a preview of Phase 16: upgrading to Django 5.2 will let django-filter move forward
too.

---

Concept 1: Query parameters (the customer's "requests slip")

🧒 Simple: The URL path says which shelf (/api/products/). Thehed to your request: "only kitchen items, under $45, cheapestfirst, show me page 2." The same shelf answers differently depending on the note.

🛠️ Developer:
- The query string ?category=kitchen&max_price=45&ordering=priue pairs separated by &. DRF exposes it asrequest.query_params.
- Query parameters are for reading/narrowing (GET). They're bo in Phase 11 React will keep them in the browser's URL, so"Back" and "copy link" work naturally.

Concept 2: The filter-backend pipeline

🧒 Simple: Your request passes through a line of helpers. The first removes everything that isn't in your category or price range. The second keeps only
items matching your search words. The third sorts what's left.ges and hands you one page.

🛠️ Developer: For list, DRF runs:
get_queryset()                         Product.objects.select_related('category') [+ is_active for non-staff]
  → DjangoFilterBackend                ?category= ?min_price= alog/filters.py)
  → SearchFilter                       ?search=                                         (search_fields)
  → StableOrderingFilter               ?ordering=             dering_fields)
  → StandardPagination                 ?page= ?page_size=                               → LIMIT / OFFSET
  → ProductSerializer(many=True)       → JSON
Every step only adds to the SQL (WHERE, ORDER BY, LIMIT/OFFSET). Nothing is filtered in Python, and the database does all the work in one query plus one
COUNT(*) for pagination.

The backends are enabled globally in settings.py, but each doegures it (filterset_class, search_fields, ordering_fields).

Concept 3: Filtering with django-filter (exact rules)

🧒 Simple: Filters are tick-boxes and ranges in a shop's sidebce: 15–45", "☑ In stock only."

🛠️ Developer: A FilterSet declares which parameters exist and
category  = filters.CharFilter(field_name='category__slug')                   # WHERE category.slug = %s  (JOIN)
min_price = filters.NumberFilter(field_name='price', lookup_ex >= %s
max_price = filters.NumberFilter(field_name='price', lookup_expr='lte')       # WHERE price <= %s
in_stock  = filters.BooleanFilter(method='filter_in_stock')   c
- django-filter validates the values with Django forms. ?min_price=abc returns a 400 {"min_price": ["Enter a number."]} instead of crashing.
- Parameters that aren't declared are ignored.
- method='filter_in_stock' calls our function for rules that don't map to one field lookup (true → stock > 0, false → stock = 0).

Concept 4: Search (fuzzy words) vs. filters (exact rules)

🧒 Simple: A filter is a precise tick-box. Search is typing into the shop's search bar: "mug" should find the Blue Ceramic Mug even though you didn't type
the full name.

🛠️ Developer:
- search_fields = ['name', 'description', 'category__name'] plus ?search=mug produces WHERE (name ILIKE '%mug%' OR description ILIKE '%mug%' OR
  category.name ILIKE '%mug%').
- Several words (?search=blue mug) must each match somewhere (AND between words, OR between fields).
- It's simple and works well for a small catalogue. Big shops  or a search engine, which is a possible "next step" after thecourse.

Concept 5: Ordering, and why pages need a stable order

🧒 Simple: "Sort by price." But if two items cost exactly the same, which comes first? If the answer can change between page loads, an item could show up
on page 1 and page 2, or on neither.

🛠️ Developer:
- ?ordering=price (ascending) or ?ordering=-price (descending). Only fields in ordering_fields are allowed. ?ordering=stock is silently ignored, falling
  back to the default, so clients can't sort by arbitrary (may.
- Pagination uses ORDER BY price LIMIT 12 OFFSET 12. When prices tie, Postgres may return tied rows in any order (Lesson 1.4 again).
- StableOrderingFilter appends -id as a final tie-breaker. id tal and every product appears on exactly one page.

Concept 6: Pagination

🧒 Simple: A catalogue with 10,000 products isn't handed over ge 1 of 834 with "next page" and "previous page" buttons.

🛠️ Developer: PageNumberPagination runs a COUNT(*) plus a LIMI results:
{
  "count": 20,
  "next": "http://127.0.0.1:8000/api/products/?page=2",
  "previous": null,
  "results": [ ... 12 products ... ]
}
- next/previous are complete URLs that keep your other parameters (?ordering=-price&page=2&page_size=3). The frontend just follows them, or reads count to
  draw page numbers.
- page_size_query_param = 'page_size' lets clients ask for a different size, and max_page_size = 100 stops someone from requesting a million rows.
- A page beyond the end → 404 {"detail": "Invalid page."}.
- Categories: pagination_class = None on CategoryViewSet, because 5 categories are simpler for a dropdown as a plain list.

⚠️ The response shape changed from a list [...] to an object {count, next, previous, results}. Anything reading /api/products/ must now look inside
results. React will be written for this shape from the start.

---

▶️ Your turn

Window 1:
cd "$env:USERPROFILE\OneDrive\Desktop\django-ecommerce\backend"

Step 1: Install django-filter and watch the resolver pick a compatible version

uv add django-filter
uv tree --depth 1
uv run python manage.py check
- Expect + django-filter==25.1, not the newest release, becaus
- uv tree --depth 1 shows only your direct dependencies.
- check → no issues. (Before uv add, it would fail with Moduled 'django_filters', because settings and views import it.)

uv run python manage.py runserver

Step 2: The browsable API's filter form

Open http://127.0.0.1:8000/api/products/
- The response is now {"count": 20, "next": ".../?page=2", "previous": null, "results": [...]} with 12 products.
- There's a Filters button (top right). It shows forms for the, and ordering. That's why django_filters is in INSTALLED_APPS(its templates). Try a few combinations and watch the URL change.

Step 3: Query the API from PowerShell

Window 2. The response is now a single object, not an array, so the PowerShell 5.1 parentheses trick isn't needed:
$api = "http://127.0.0.1:8000/api"

$r = Invoke-RestMethod "$api/products/"
$r.count; $r.next; $r.results.Count
→ 20, http://127.0.0.1:8000/api/products/?page=2, 12

(Invoke-RestMethod "$api/products/?page=2").results | Select-Oble
→ the remaining 8 products, and next on that page is empty.

(Invoke-RestMethod "$api/products/?search=mug").results | Select-Object name
→ only Blue Ceramic Mug (the hidden Discontinued mug stays hid

(Invoke-RestMethod "$api/products/?category=kitchen&min_price=e").results | Select-Object name, price
→ Bamboo Cutting Board 18.00, Glass Storage Jars 22.00, Cast Iron Skillet 39.90: kitchen, in range, cheapest first.

(Invoke-RestMethod "$api/products/?in_stock=false").results | Select-Object name, stock
→ Linen Cushion Cover, 0

$r = Invoke-RestMethod "$api/products/?ordering=-price&page_si
$r.results | Select-Object name, price; $r.next
→ the 3 most expensive, and next keeps all your parameters: .._size=3.

(Invoke-RestMethod "$api/categories/") | Select-Object name, s
→ still a plain list of 5 (pagination_class = None).

Step 4: The error cases (status codes)                                                                                                           
curl.exe -s -w "  <- %{http_code}`n" "$api/products/?page=99"                                                                                    curl.exe -s -w "  <- %{http_code}`n" "$api/products/?min_price
curl.exe -s "$api/products/?ordering=stock" | Select-String -Pattern '"count":\d+' -AllMatches | ForEach-Object { $_.Matches.Value }             - {"detail":"Invalid page."}  <- 404
- {"min_price":["Enter a number."]}  <- 400: django-filter validated the input.                                                                  - "count":20: ordering=stock was ignored because it's not in oe normal list.
                                                                                                                                                 Step 5: See the SQL the pipeline builds (optional)
                                                                                                                                                 uv run python manage.py shell -c "from django.test import Clienection, reset_queries; c = Client(HTTP_HOST='localhost',HTTP_ACCEPT='application/json'); reset_queries(); c.get('/api/products/?category=kitchen&min_price=15&search=board&ordering=price&page_size=2'); [print(q['sql'], '\n') for q in connection.queries]"
Two queries: a SELECT COUNT(*) ... for count, and the page query with every step visible: INNER JOIN catalog_category, WHERE is_active AND category.slug = 'kitchen' AND price >= 15 AND (name ILIKE '%board%' OR ...), Ohe tie-breaker), LIMIT 2.




psycopg-binary v3.3.6 (extra: binary)
tzdata v2026.4
  ├── django-filter v25.1
  │   └── django v5.1.7 (*)
  ├── djangorestframework v3.17.2
  │   └── django v5.1.7 (*)

utting Board          18.00
  Terracotta Plant Pot          15.00
  Gel Pen Set                   7.99
  Chef Knife                    49.99
  Blue Ceramic Mug              12.50
                      price
            stock
  ----                -----
  Linen Cushion Cover     0


What & why

In Lesson 3.5 images could only be uploaded through the Django admin. The React admin screens (Phase 14) need to upload product photos through the API. JSON can't carry files, so we use a different request format: multipart/form-data.

Good news: ModelViewSet already accepts multipart uploads. Today we test that, and add the protections a real shop needs:
- a 2 MB size limit (a field-level validator)
- the ability to remove an image ({"image": null})

Files involved
backend/catalog/serializers.py   ← ✏️ validate_image() (2 MB limit); image may be null (to remove it)

What my verification found (and fixed)

I tested uploads inside a rolled-back transaction and deleted the test file afterwards, so your data and media\ folder are unchanged. Results:

┌──────────────────┬──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│       Test       │                                                              Result                                                              │
├──────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Small PNG        │ 200, with an absolute image URL                                                                                                  │
├──────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 4.1 MB image     │ 400 The image is 4.1 MB. The maximum is 2 MB. (our new validator)                                                                │
├──────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Text file named  │ 400 Upload a valid image... (Pillow)                                                                                             │
│ .jpg             │                                                                                                     │
├──────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ {"image": null}  │ ❌ 400 This field may not be null. There was no way to remove an image through the API. Fixed with extra_kwargs = {'image':      │
│                  │ {'allow_null': True}}, and now 200, with the column stored as ''.                                                                │
└──────────────────┴──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

My first test attempt also returned 415 Unsupported Media Type. My test tool had sent the file with the wrong Content-Type, so DRF had no parser for it. You'll meet 415 in Concept 2.

  PS C:\Users\subin\OneDrive\Desktop\django-ecommerce\backend> (cts/?page=2").results | Select-Object name, price |Format-Table

  name                          price
  ----                          -----
  A5 Dotted Notebook            9.50
  Glass Storage Jars (Set of 3) 22.00
  Cast Iron Skillet             39.90
  Bamboo Cutting Board          18.00
  Terracotta Plant Pot          15.00
  Gel Pen Set                   7.99
  Chef Knife                    49.99
  Blue Ceramic Mug              12.50


  PS C:\Users\subin\OneDrive\Desktop\django-ecommerce\backend> (Invoke-RestMethod "$api/products/?search=mug").results | Select-Object name

  name
  ----
  Blue Ceramic Mug


  PS C:\Users\subin\OneDrive\Desktop\django-ecommerce\backend> (Invoke-RestMethod
  "$api/products/?category=kitchen&min_price=15&max_price=45&ordt-Object name, price

  name                          price
  ----                          -----
  Bamboo Cutting Board          18.00
  Glass Storage Jars (Set of 3) 22.00
  Cast Iron Skillet             39.90


  PS C:\Users\subin\OneDrive\Desktop\django-ecommerce\backend> (Invoke-RestMethod "$api/products/?in_stock=false").results | Select-Object name, stock

  name                stock
  ----                -----
  Linen Cushion Cover     0


  PS C:\Users\subin\OneDrive\Desktop\django-ecommerce\backend> $r = Invoke-RestMethod "$api/products/?ordering=-price&page_size=3"
  PS C:\Users\subin\OneDrive\Desktop\django-ecommerce\backend> $r.results | Select-Object name, price; $r.next

  name                        price
  ----                        -----
  Noise-Cancelling Headphones 149.00
  Bluetooth Speaker           59.00
  Chef Knife                  49.99
  http://127.0.0.1:8000/api/products/?ordering=-price&page=2&page_size=3


  PS C:\Users\subin\OneDrive\Desktop\django-ecommerce\backend> (Invoke-RestMethod "$api/categories/") | Select-Object name, slug

  name          slug
  ----          ----
  Books         books
  Electronics   electronics
  Home & Garden home-garden
  Kitchen       kitchen
  Stationery    stationery


  PS C:\Users\subin\OneDrive\Desktop\django-ecommerce\backend> curl.exe -s -w "  <- %{http_code}`n" "$api/products/?page=99"
  {"detail":"Invalid page."}  <- 404
  PS C:\Users\subin\OneDrive\Desktop\django-ecommerce\backend> curl.exe -s -w "  <- %{http_code}`n" "$api/products/?min_price=abc"
  {"min_price":["Enter a number."]}  <- 400
  PS C:\Users\subin\OneDrive\Desktop\django-ecommerce\backend> curl.exe -s "$api/products/?ordering=stock" | Select-String -Pattern '"count":\d+' -AllMatches | ForEach-Object { $_.Matches.Value }
  "count":20
  PS C:\Users\subin\OneDrive\Desktop\django-ecommerce\backend> uv run python manage.py shell -c "from django.test import Client; from django.db import connection, reset_queries; c = Client(HTTP_HOST='localhost', HTTP_ACCEPT='application/json'); reset_queries(); c.get('/api/products/?category=kitchen&min_price=15&search=board&ordering=price&page_size=2'); [print(q['sql'], '\n') for q in connection.queries]"
  SELECT COUNT(*) AS "__count" FROM "catalog_product" INNER JOIN "catalog_category" ON ("catalog_product"."category_id" = "catalog_category"."id") WHERE ("catalog_product"."is_active" AND "catalog_category"."slug" = 'kitchen' AND "catalog_product"."price" >= 15 AND (UPPER("catalog_product"."name"::text) LIKE UPPER('%board%') OR UPPER("catalog_product"."description"::text) LIKE UPPER('%board%') OR UPPER("catalog_category"."name"::text) LIKE UPPER('%board%')))

  SELECT "catalog_product"."id", "catalog_product"."category_id"catalog_product"."slug", "catalog_product"."description","catalog_product"."price", "catalog_product"."stock", "catalog_product"."image", "catalog_product"."is_active", "catalog_product"."created_at",
  "catalog_product"."updated_at", "catalog_category"."id", "catag_category"."slug", "catalog_category"."description","catalog_category"."created_at", "catalog_category"."updated_at" FROM "catalog_product" INNER JOIN "catalog_category" ON ("catalog_product"."category_id" = "catalog_category"."id") WHERE ("catalog_product"."is_active" AND "catalog_category"."slug" = 'kitchen' AND "catalog_product"."price" >= 15 AND (UPPER("catalog_product"."name"::text) LIKE UPPER('%board%') OR UPPER("catalog_product"."description"::text) LIKE UPPER('%board%') OR UPPER("catalog_category"."name"::text) LIKE UPPER('%board%'))) ORDER BY "catalog_product"."price" ASC, "catalog_product"."id" DESC LIMIT 1

  PS C:\Users\subin\OneDrive\Desktop\django-ecommerce\backend> c
  PS C:\Users\subin\OneDrive\Desktop\django-ecommerce> git add .
  warning: in the working copy of 'backend/catalog/views.py', LF will be replaced by CRLF the next time Git touches it
  warning: in the working copy of 'backend/pyproject.toml', LF will be replaced by CRLF the next time Git touches it
  warning: in the working copy of 'backend/uv.lock', LF will be replaced by CRLF the next time Git touches it
  warning: in the working copy of 'backend/catalog/filters.py', LF will be replaced by CRLF the next time Git touches it
  warning: in the working copy of 'backend/core/filters.py', LF will be replaced by CRLF the next time Git touches it
  warning: in the working copy of 'backend/core/pagination.py', LF will be replaced by CRLF the next time Git touches it
  PS C:\Users\subin\OneDrive\Desktop\django-ecommerce> git commit -m "Product search, filtering, stable ordering and pagination with django-filter"
  [main 8ff578d] Product search, filtering, stable ordering and pagination with django-filter
   8 files changed, 271 insertions(+)
   create mode 100644 backend/catalog/filters.py
   create mode 100644 backend/core/filters.py
   create mode 100644 backend/core/pagination.py
  continue

● Update(catalog\serializers.py)
Added 9 lines
    def get_in_stock(self, obj):
        return obj.stock > 0

    def validate_image(self, value):
        """Field-level validation: runs for the "image" field only (after DRF/Pillow
        have already checked that the upload is a real image)."""
        if value and value.size > MAX_IMAGE_SIZE:
            raise serializers.ValidationError(
                f'The image is {value.size / 1024 / 1024:.1f} MB. The maximum is 2 MB.'
            )
        return value

    def validate(self, attrs):
        """Object-level validation: runs after every field has been validated on its own."""
        # When creating a product without a slug, Product.save() would build one from

● Update(catalog\serializers.py)
Added 2 lines

from .models import Category, Product

MAX_IMAGE_SIZE = 2 * 1024 * 1024  # 2 MB


class CategorySerializer(serializers.ModelSerializer):
    """Full category, used by the /api/categories/ endpoints."""


  Ran 2 shell commands

● Update(catalog\serializers.py)
Added 2 lines
            'created_at',
            'updated_at',
        ]
        # Allow {"image": null} to remove a product's image.
        extra_kwargs = {'image': {'allow_null': True}}

    def get_in_stock(self, obj):
        return obj.stock > 0

  Ran 1 shell command

Quick status: Lesson 4.6 is ready and verified. Image upload through the API works, there's a new 2 MB size limit, fake images are rejected, and {"image": null} now removes an image. That last one needed a small fix I found during testing. Here's the lesson.

Phase 4, Lessons 4.6–4.7: Image uploads through the API, and an API review

Lesson 4.5 checkpoint passed. uv add chose django-filter 25.1, just as the resolver predicted, and all queries and error codes match. Commit 8ff578d is in.

Two corrections and details from your SQL output:
1. I said search uses ILIKE. On PostgreSQL, Django actually generates UPPER(name::text) LIKE UPPER('%board%'), which is visible in your output. The effect is the same (case-insensitive "contains"), but your output shows the real implementation. Always trust the actual SQL over anyone's description, including mine. (Note that a leading % means Postgres can't use a normal index for this. That's fine for 21 products, and it's why big shops use full-text search.)
2. LIMIT 1 instead of LIMIT 2: the COUNT(*) query ran first and found only 1 match (Bamboo Cutting Board). Django's paginator then knew fetching 2 rows was pointless and asked for exactly 1. That's why pagination always runs the count first.

---

What & why

In Lesson 3.5 images could only be uploaded through the Django admin. The React admin screens (Phase 14) need to upload product photos through the API. JSON can't carry files, so we use a different request format: multipart/form-data.

Good news: ModelViewSet already accepts multipart uploads. Today we test that, and add the protections a real shop needs:
- a 2 MB size limit (a field-level validator)
- the ability to remove an image ({"image": null})

Files involved
backend/catalog/serializers.py   ← ✏️ validate_image() (2 MB limit); image may be null (to remove it)

What my verification found (and fixed)

I tested uploads inside a rolled-back transaction and deleted the test file afterwards, so your data and media\ folder are unchanged. Results:

┌──────────────────┬──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│       Test       │                                                              Result                                                              │
├──────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Small PNG        │ 200, with an absolute image URL                                                                                                  │
├──────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 4.1 MB image     │ 400 The image is 4.1 MB. The maximum is 2 MB. (our new validator)                                                                │
├──────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Text file named  │ 400 Upload a valid image... (Pillow)                                                                │
│ .jpg             │                                                                                                                                  │
├──────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ {"image": null}  │ ❌ 400 This field may not be null. There was no way to remove an image through the API. Fixed with extra_kwargs = {'image':      │
│                  │ {'allow_null': True}}, and now 200, with the column stored as ''.                                                                │
└──────────────────┴──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

My first test attempt also returned 415 Unsupported Media Type. My test tool had sent the file with the wrong Content-Type, so DRF had no parser for it. You'll meet 415 in Concept 2.

---

Concept 1: multipart/form-data vs. JSON

🧒 Simple: JSON is a letter. It can only contain text. To send a photo, you need a parcel with compartments: one compartment holds the photo, another holds a note saying "price: 19.99." That parcel format is called multipart.

🛠️ Developer: A multipart request body is split into parts separated by a random boundary string. Each part has its own headers:
Content-Type: multipart/form-data; boundary=----X1y2Z3

------X1y2Z3
Content-Disposition: form-data; name="image"; filename="mouse.png"
Content-Type: image/png

<raw binary bytes of the PNG>
------X1y2Z3
Content-Disposition: form-data; name="price"

19.99
------X1y2Z3--
- Files travel as raw bytes. Encoding them inside JSON (as base64) would make them about 33% bigger and is awkward for servers.
- HTML <form enctype="multipart/form-data">, curl's -F, and JavaScript's FormData (which React uses in Phase 14) all produce this format.

Concept 2: Parsers and 415 Unsupported Media Type

🧒 Simple: The mail room has specialists: one opens letters (JSON), one opens parcels (multipart), one opens simple form envelopes. The sticker on the outside (Content-Type) says which specialist to call. An unknown sticker → "we can't open this" (415).

🛠️ Developer:
- DRF's default parser_classes are JSONParser, FormParser, and MultiPartParser. On the first access to request.data, DRF picks the parser whose media type matches the request's Content-Type.
- MultiPartParser stores uploaded files in request.data as UploadedFile objects. Small ones are kept in memory; big ones are streamed to a temp file.
- No match → 415. You also saw this in Lesson 4.3 if you forgot the JSON header.

Concept 3: Field-level validation (validate_<field>)

🧒 Simple: Besides the general rules, the image checkpoint has its own inspector: "Is it really a photo? Is it too heavy to carry?"

🛠️ Developer: The order of checks for image is:
1. DRF's ImageField asks Pillow to open the bytes, so non-images are rejected regardless of the file extension. That includes SVG, which could contain scripts.
2. Our validate_image(self, value), called automatically because of its name, checks value.size in bytes:
MAX_IMAGE_SIZE = 2 * 1024 * 1024  # 2 MB

def validate_image(self, value):
    if value and value.size > MAX_IMAGE_SIZE:
        raise serializers.ValidationError(f'The image is {value.size / 1024 / 1024:.1f} MB. The maximum is 2 MB.')
    return value
- if value: the value can now be None (image removal), and there's nothing to check then.
- Why limit the size at all? Huge uploads fill the disk, slow down every product page, and waste customers' mobile data.

Allowing removal is one line in Meta:
extra_kwargs = {'image': {'allow_null': True}}   # {"image": null} removes the image
extra_kwargs tweaks the auto-generated serializer field without redefining it. Django stores a "removed" image as '', matching blank=True. (The old file stays on disk, as a known limitation from Lesson 3.5.)

---

▶️ Your turn

Window 1:
cd "$env:USERPROFILE\OneDrive\Desktop\django-ecommerce\backend"
uv run python manage.py check
uv run python manage.py runserver

Window 2: set up variables (use your passwords again) and crea
cd "$env:USERPROFILE\OneDrive\Desktop\django-ecommerce\backend"                                                                                          $admin    = "subin@ontash.net:YOUR_ADMIN_PASSWORD"
$customer = "customer@example.com:YOUR_CUSTOMER_PASSWORD"
$api      = "http://127.0.0.1:8000/api"

uv run python -c "from PIL import Image, ImageDraw; im = Image.new('RGB', (400, 400), '#3b82f6'); ImageDraw.Draw(im).text((170, 190), 'MOUSE',           fill='white'); im.save(r'$env:TEMP\mouse.png')"
uv run python -c "import os; from PIL import Image; Image.frombytes('RGB', (1200, 1200), os.urandom(1200*1200*3)).save(r'$env:TEMP\big.png')"
Get-ChildItem "$env:TEMP\mouse.png", "$env:TEMP\big.png", "$env:TEMP\fake.jpg" | Select-Object Name, Length
- The first line draws a blue placeholder image with the text "MOUSE".
- The second fills a 1200×1200 image with random noise. Noise can't be compressed, so the PNG is about 4 MB.
- fake.jpg is the text file from Lesson 3.5. If it's missing, run Set-Content $env:TEMP\fake.jpg "this is not an image".
- PowerShell expands $env:TEMP inside the double-quoted string before Python runs, and r'...' makes Python read the Windows backslashes literally.

Step 1: Upload an image with multipart (-F)

curl.exe -i -u $admin -X PATCH -F "image=@$env:TEMP\mouse.png" "$api/products/wireless-mouse/"
- -F "image=@path" builds a multipart body, and the @ means "attach the contents of this file." curl sets Content-Type: multipart/form-data; boundary=... for you. Don't add a JSON header here.
- Expect 200, with "image":"http://127.0.0.1:8000/media/products/2026/09/mouse.png". Open that URL in the browser to see your blue square.

Send a file and normal fields together (both travel as parts of one parcel):
curl.exe -s -u $admin -X PATCH -F "image=@$env:TEMP\mouse.png" -F "stock=40" "$api/products/wireless-mouse/"
→ stock is 40 and the image URL gets a random suffix (mouse_AbC123x.png), because the file name already existed (Lesson 3.5).
                                                                                                                                                         Step 2: The validation cases
                                                                                                                                                         curl.exe -s -w "  <- %{http_code}`n" -u $admin -X PATCH -F "im/products/wireless-mouse/"
curl.exe -s -w "  <- %{http_code}`n" -u $admin -X PATCH -F "image=@$env:TEMP\fake.jpg" "$api/products/wireless-mouse/"
curl.exe -s -w "  <- %{http_code}`n" -u $customer -X PATCH -F "image=@$env:TEMP\mouse.png" "$api/products/wireless-mouse/"
curl.exe -s -w "  <- %{http_code}`n" -u $admin -X PATCH -H "Content-Type: text/plain" --data-binary "@$env:TEMP\mouse.png" "$api/products/wireless-mouse/"
Expected:                                                                                                                                                1. {"image":["The image is 4.1 MB. The maximum is 2 MB."]}  <-
2. {"image":["Upload a valid image. ..."]}  <- 400: Pillow
3. {"detail":"You do not have permission to perform this action."}  <- 403: permissions run before parsing or validation
4. {"detail":"Unsupported media type \"text/plain\" in request."}  <- 415: no parser for that Content-Type

Step 3: Remove the image with JSON null, then put it back

@{ image = $null } | ConvertTo-Json | Set-Content -Encoding ascii "$env:TEMP\noimage.json"
Get-Content "$env:TEMP\noimage.json"
curl.exe -s -u $admin -X PATCH -H "Content-Type: application/json" --data-binary "@$env:TEMP\noimage.json" "$api/products/wireless-mouse/"
→ "image":null. The same endpoint accepted JSON this time, because DRF picked the parser from the Content-Type.

Put the picture back (the React shop will look nicer with it):
curl.exe -s -o NUL -w "%{http_code}`n" -u $admin -X PATCH -F "image=@$env:TEMP\mouse.png" "$api/products/wireless-mouse/"

Step 4 (Lesson 4.7): Ask the API to describe itself with OPTIONS

$meta = curl.exe -s -u $admin -X OPTIONS "$api/products/" | ConvertFrom-Json                                                                             $meta.name; $meta.parses
$meta.actions.POST.price                                                                                                                                 $meta.actions.POST.category_id
- parses lists the Content-Types this endpoint accepts: application/json, application/x-www-form-urlencoded, multipart/form-data.
- actions.POST.price shows the rules DRF derived from the model: type: decimal, required: True, max_digits: 10, decimal_places: 2, min_value: 0.01.

This is DRF's metadata feature. The browsable API uses it to build its forms. React won't need it, but it's a handy way to check "what exactly does this endpoint expect?"

Step 5 (Lesson 4.7): The API so far, in one table

┌───────────────────────────────────────────────────────────────────────────────────────────────┬─────────────────┬───────────────┬────────────────────┐
│                                           Endpoint                                            │    Anonymous    │   Customer    │       Admin        │
├───────────────────────────────────────────────────────────────────────────────────────────────┼─────────────────┼───────────────┼────────────────────┤
│ GET /api/categories/ (plain list)                                                             │ ✅              │ ✅            │ ✅                 │
├───────────────────────────────────────────────────────────────────────────────────────────────┼─────────────────┼───────────────┼────────────────────┤
│ POST/PUT/PATCH/DELETE /api/categories/<slug>/                                                 │ 403             │ 403           │ ✅ (409 if it has  │
│                                                                                               │                 │               │ products)          │
├───────────────────────────────────────────────────────────────────────────────────────────────┼─────────────────┼───────────────┼────────────────────┤
│ GET                                                                                           │ ✅ active only  │ ✅ active     │ ✅ incl. hidden    │
│ /api/products/?search=&category=&min_price=&max_price=&in_stock=&ordering=&page=&page_size=   │                 │ only          │                    │
├───────────────────────────────────────────────────────────────────────────────────────────────┼─────────────────┼───────────────┼────────────────────┤
│ GET /api/products/<slug>/                                                                     │ ✅ / 404 if     │ ✅ / 404 if   │ ✅                 │
│                                                                                               │ hidden          │ hidden        │                    │
├───────────────────────────────────────────────────────────────────────────────────────────────┼─────────────────┼───────────────┼────────────────────┤
│ POST/PUT/PATCH/DELETE /api/products/<slug>/ (JSON or multipart)                               │ 403             │ 403           │ ✅                 │
├───────────────────────────────────────────────────────────────────────────────────────────────┼─────────────────┼───────────────┼────────────────────┤
│ GET /api/ (API root)                                             │ 403 (deny by    │ ✅            │ ✅                 │
│                                                                                               │ default)        │               │                    │
└───────────────────────────────────────────────────────────────────────────────────────────────┴─────────────────┴───────────────┴────────────────────┘

That's the full catalog API from the plan.





What & why

Until now, PowerShell sent your email and password with every request (Basic authentication), and the browser used a session cookie. Neither is right for our React app:
- Basic auth means the frontend would have to store the password and send it thousands of times.
- Session cookies are tied to the browser's same-site rules and need CSRF handling. They're awkward when the frontend (port 5173) and API (port 8000) are different origins.

The standard solution for a single-page app plus an API is token authentication with JWTs:
1. The user logs in once with email and password, and receives two tokens.
2. Every later request carries the short-lived access token in a header.
3. When it expires, the app quietly swaps the long-lived refresh token for a new access token.

Today we add:
- POST /api/auth/token/: email + password → {"access": ..., "refresh": ...}
- POST /api/auth/token/refresh/: refresh → new access
- JWTAuthentication as the main way DRF identifies users, replacing Basic authentication

Files involved (written; verified with the exact versions uv will install)
backend/
├── pyproject.toml / uv.lock   ← YOU: uv add djangorestframework-simplejwt  (→ 5.5.1 + PyJWT)
├── .env / .env.example        ← ✏️ JWT_ACCESS_MINUTES=15, JWT_REFRESH_DAYS=7
├── config/settings.py         ← ✏️ JWTAuthentication replaces BasicAuthentication; SIMPLE_JWT settings
├── config/urls.py             ← ✏️ path('api/auth/', include('accounts.urls'))
└── accounts/urls.py           ← NEW: token/ and token/refresh/
How the pieces connect:
1) LOGIN   POST /api/auth/token/  {"email": "...", "password": "..."}
           config/urls.py 'api/auth/' → accounts/urls.py 'token/' → TokenObtainPairView
           → checks the password → builds 2 tokens signed with SECRET_KEY
           ← 200 {"access": "eyJ...", "refresh": "eyJ..."}

2) USE     GET /api/...   header  Authorization: Bearer eyJ...(access)
           DRF → JWTAuthentication (first in DEFAULT_AUTHENTICATION_CLASSES)
           → verifies signature + expiry → loads User by the token's user_id → request.user
           → permission classes (IsAdminOrReadOnly / IsAuthenticated) as before

3) RENEW   POST /api/auth/token/refresh/  {"refresh": "eyJ..."}
           ← 200 {"access": "eyJ...(new)"}

---

Concept 1: Sessions vs. tokens, and how each identifies you

HTTP is stateless: every request arrives on its own, and the server doesn't automatically remember previous requests. Each authentication method is a way to attach proof of identity to every request.

Session authentication (what the admin uses):
1. You log in, and Django creates a row in the django_session table with a random key and data like {"_auth_user_id": "1"}.
2. The key goes back to the browser in a cookie, sessionid=abc123....
3. The browser sends that cookie with every request. Django looks up the row, finds user 1, and sets request.user.
4. So the state lives on the server, in the database. Logging out deletes the row, which invalidates the session immediately.
5. Because browsers send cookies automatically, a malicious site could trigger requests with your cookie. That's why session-based writes need a CSRF token (the "CSRF Failed" error from Lesson 4.3's ta
3. The server checks the signature with its secret key. If it's valid and not expired, it trusts the user_id inside.
4. The token is stateless: verification needs no database lookup, only a cryptographic check. (Simple JWT still loads the user row once per request to get is_staff, is_active, and so on.)
5. Browsers don't attach it automatically, so classic CSRF attacks don't apply.

The trade-off: a JWT can't be "deleted" on the server. It stays valid until it expires. That's why the access token is short-lived (Concept 3).

Concept 2: What's inside a JWT

A JWT is three base64url-encoded parts joined by dots:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9 . eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjox... . Xq3d8mJ0kP...
└──────────── header ───────────────┘   └──────────────── payload ────────────────┘   └─ signature ─┘
- Header (decoded): {"alg": "HS256", "typ": "JWT"}. It says the signature was made with HMAC-SHA256.
- Payload (decoded): the claims. From my verification run for your customer account:
{"token_type": "access", "exp": 1790576321, "iat": 1790575421, "jti": "891d5c1d...", "user_id": "2"}
| Claim      | Meaning                                                         |
|------------|-----------------------------------------------------------------|
| token_type | access or refresh. Simple JWT refuses to use one as the other.  |
| iat        | "issued at", as a Unix timestamp (seconds since 1 Jan 1970 UTC) |
| exp        | "expires at". Here exp − iat = 900 seconds = our 15 minutes.    |
| jti        | a unique random ID for this token                               |
| user_id    | the primary key of the user (accounts_user.id)                  |

- Signature: HMAC_SHA256(key=SECRET_KEY, message="<header>.<payload>"), base64url-encoded.

Two critical facts:
1. base64url is an encoding, not encryption. Anyone holding the token can decode and read the payload. You'll do it yourself in Step 4. Never put secrets in a JWT.
2. The signature makes it tamper-proof. Change one character of the payload (say user_id: "2" → "1" to become the admin) and the signature no longer matches. Only someone with SECRET_KEY could compute a matching one. I tested exactly this attack, and it was rejected with 401 Token is invalid. This is why SECRET_KEY must stay secret (Lesson 2.3). Whoever has it can mint tokens for any user.

Concept 3: Access tokens vs. refresh tokens

┌─────────────────────────┬───────────────────┬──────────────────────────────────┐
│                         │   Access token    │          Refresh token           │
├─────────────────────────┼───────────────────┼──────────────────────────────────┤
│ Lifetime (our settings) │ 15 minutes        │ 7 days                           │
├─────────────────────────┼───────────────────┼──────────────────────────────────┤
│ Sent with               │ every API request │ only to /api/auth/token/refresh/ │
├─────────────────────────┼───────────────────┼──────────────────────────────────┤
│ Used for                │ proving identity  │ getting a new access token       │
└─────────────────────────┴───────────────────┴──────────────────────────────────┘

Why two? Tokens can't be revoked on the server (Concept 1), so the one that travels constantly (and is most likely to leak, e.g. through logs or browser extensions) should expire quickly. A stolen access token is useless within 15 minutes. The refresh token is sent rarely, so it can live longer and keep you logged in for a week without re-entering your password.

In Phase 12 React will do this automatically: when a request fails with 401 because the access token expired, it calls the refresh endpoint, gets a new access token, and retries the request. The user never notices.

Concept 4: 401 vs. 403 (now they're different)

- 401 Unauthorized actually means "not authenticated": we don't know who you are, or your credentials are invalid or expired. A 401 response must include a WWW-Authenticate header telling the client how to authenticate. Here that's WWW-Authenticate: Bearer realm="api".
- 403 Forbidden means "we know who you are, and you're not allowed."

In Lesson 4.3, anonymous requests got 403. DRF only returns 401 if the first authentication class can produce a WWW-Authenticate header, and SessionAuthentication can't. Now JWTAuthentication is first, and it can (Bearer realm="api"). So:
- no or invalid token → 401, meaning "log in / refresh your token"
- a customer trying an admin action → 403, meaning "you can't do that"

The frontend depends on this difference: 401 → try refreshing the token, 403 → show "not allowed".

---

The code, explained line by line

config/settings.py: new import
- Python style (PEP 8) sorts standard-library imports alphabetically: os, then datetime (a from import), then pathlib.
- A timedelta is a Python object representing a duration, not a point in time. timedelta(minutes=15) is "15 minutes." Simple JWT adds it to "now" to compute exp.

config/settings.py: authentication classes

'DEFAULT_AUTHENTICATION_CLASSES': [
    'rest_framework_simplejwt.authentication.JWTAuthentication',
    'rest_framework.authentication.SessionAuthentication',
],
- This is a Python list (square brackets) of strings. Each string is a dotted import path: package rest_framework_simplejwt → module authentication → class JWTAuthentication. DRF imports these classes itself at startup. We give paths as strings so settings.py doesn't have to import all those libraries directly.
- Order matters. For each request, DRF tries each class in turn:
  - Each class's authenticate(request) method returns either a (user, token) tuple (success, stop here) or None (not my kind of credentials, try the next class).
  - If one finds credentials that are invalid (e.g. an expired token), it raises an exception, and the request fails with 401 immediately.
  - If all return None, the user is anonymous.
- BasicAuthentication is removed. From now on, curl.exe -default '15' if it isn't set. Environment variables are always strings (Lesson 2.3).
  b. int('15'): convert the string to the integer 15. If .env contained JWT_ACCESS_MINUTES=abc, int() would raise ValueError: invalid literal for int() and Django wouldn't start. That's fail-fast behaviour we get for free.
  c. timedelta(minutes=15): build the duration object. minutes= is a keyword argument (naming the parameter makes the call readable, and timedelta(days=7) works the same way).
- ('Bearer',) is a tuple with one element. The trailing comma is essential: ('Bearer') without it is just the string 'Bearer' in parentheses, because parentheses alone only group. A tuple is like a list but immutable (can't be changed after creation). This setting means only headers that start with Bearer  are treated as JWTs.
- 'UPDATE_LAST_LOGIN': True makes Simple JWT update User.last_login each time someone obtains tokens, so you can see it in the admin. True and False are Python's booleans (capitalised).

accounts/urls.py

from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token-obtain'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
]
- from X import A, B imports two names in one line.
- urlpatterns is the variable name Django looks for in every URLconf module. The name is a convention Django relies on, so it must be spelled exactly like this.
- path(route, view, name=...) is a function call that returns a URL pattern object:
  - route is matched against the URL after the prefix already consumed by include().
  - view must be a callable that takes a request and returns a response.
  - name is a label for reverse URL lookups (e.g. in tests: reverse('token-obtain') → /api/auth/token/).
- .as_view(): TokenObtainPairView is a class, but Django needs a function it can call once per request. as_view() is a class method (called on the class itself, not on an instance) that builds and returns such a function. Each time a request arrives, that function creates a fresh instance of the class and calls its dispatch() method, which calls post() for a POST, and so on. A fresh instance per request means no data can leak between users.

What these two library views do internally (you didn't have to write any of this):
- TokenObtainPairView uses TokenObtainPairSerializer:
  - Its fields are named after User.USERNAME_FIELD, which is 'email' in our model (Lesson 2.5). So the login body is {"email": ..., "password": ...}, and sending username gives a 400: {"email": ["This field is required."]}.
  - It calls Django's authenticate(), which hashes the given password with the stored salt and compares (Lesson 2.6), and it also checks is_active.
  - On failure → 401 "No active account found with the given credentials". The message deliberately doesn't say whether the email or the password was wrong, so attackers can't discover which emails exist.
  - On success → RefreshToken.for_user(user) creates the refresh token, derives the access token from it, and returns both as JSON.
- TokenRefreshView validates the refresh token (signature, expiry, token_type == "refresh") and returns a new access token.
- Both views set permission_classes = (AllowAny,) inside the library, so they override our global deny-by-default IsAuthenticated. That has to be so, because you can't require login in order to log in.

config/urls.py

path('api/auth/', include('accounts.urls')),
path('api/', include('catalog.urls')),
- include('accounts.urls') takes a string module path. Django imports accounts/urls.py and attaches its urlpatterns under the api/auth/ prefix. So 'token/' there becomes /api/auth/token/.
- Django tries patterns top to bottom and uses the first match. Here the order is only for readability. The catalog router has no auth/ pattern, so nothing would clash either way.

Version check (done before writing this lesson)

With your django==5.1.7 pin, uv's resolver picks djangorestframework-simplejwt 5.5.1 plus its dependency PyJWT 2.15.0 (the library that does the actual encoding and signing). I verified the code with exactly those versions:

┌─────────────────────────────────────┬─────────────────────────────────────────────┐
│                Check                │                   Result                    │
├─────────────────────────────────────┼─────────────────────────────────────────────┤
│ Anonymous GET /api/                 │ 401, WWW-Authenticate: Bearer realm="api"   │
├─────────────────────────────────────┼─────────────────────────────────────────────┤
│ Wrong password                      │ 401 "No active account found..."            │
├─────────────────────────────────────┼─────────────────────────────────────────────┤
│ Body with username instead of email │ 400 {"email": ["This field is required."]}  │
├─────────────────────────────────────┼─────────────────────────────────────────────┤
│ Valid access token                  │ 200                                         │
├─────────────────────────────────────┼─────────────────────────────────────────────┤
│ Refresh token used as access        │ 401 "Token has wrong type"                  │
├─────────────────────────────────────┼─────────────────────────────────────────────┤
│ Payload changed to user_id: "1"     │ 401 "Token is invalid" (signature mismatch) │
├─────────────────────────────────────┼─────────────────────────────────────────────┤
│ Refresh endpoint                    │ 200 {"access": ...}                         │
└─────────────────────────────────────┴─────────────────────

Window 1:
cd "$env:USERPROFILE\OneDrive\Desktop\django-ecommerce\backend"
uv add djangorestframework-simplejwt
uv tree --depth 2 | Select-String -Pattern "simplejwt|pyjwt"
uv run python manage.py check
- Expect + djangorestframework-simplejwt==5.5.1 and + pyjwt==2.15.0. PyJWT is a transitive dependency: you didn't ask for it, but Simple JWT needs it.
- Before uv add, check would fail with ModuleNotFoundError: No module named 'rest_framework_simplejwt'. Django imports the classes named in DEFAULT_AUTHENTICATION_CLASSES at startup.

uv run python manage.py runserver

Step 1: Set up Window 2

cd "$env:USERPROFILE\OneDrive\Desktop\django-ecommerce\backend"
$api = "http://127.0.0.1:8000/api"

Step 2: Basic auth is gone, and "not logged in" is now 401

curl.exe -i -u "customer@example.com:YOUR_CUSTOMER_PASSWORD" "$api/"
→ HTTP/1.1 401 Unauthorized, the header WWW-Authenticate: Bearer realm="api", and {"detail":"Authentication credentials were not provided."}.

Trace what happened:
1. curl sent Authorization: Basic Y3VzdG9t....
2. JWTAuthentication saw the header type Basic, which isn't in AUTH_HEADER_TYPES, so it returned None ("not mine").
3. SessionAuthentication found no session cookie and returned
$body = @{ email = 'customer@example.com'; password = 'YOUR_CUSTOMER_PASSWORD' } | ConvertTo-Json
$tokens = Invoke-RestMethod -Method Post -Uri "$api/auth/token/" -ContentType 'application/json' -Body $body
$tokens.access
$tokens.refresh
- @{ ... } is a PowerShell hashtable (like a Python dict), and ConvertTo-Json turns it into a JSON string.
- Invoke-RestMethod is a cmdlet (built into PowerShell, not an external program). Arguments reach it intact, so no JSON-quoting problems here, unlike curl.exe in Windows PowerShell 5.1.
- $tokens holds the parsed response object with .access and .refresh. Both are long strings starting with eyJ. That's what {" looks like in base64: every JWT header starts with {"alg"..., so every JWT starts with eyJ.

Wrong password, for comparison (curl shows the status code):
@{ email = 'customer@example.com'; password = 'wrong' } | ConvertTo-Json | Set-Content -Encoding ascii "$env:TEMP\badlogin.json"
curl.exe -sS -w "  <- %{http_code}`n" -H "Content-Type: application/json" --data-binary "@$env:TEMP\badlogin.json" "$api/auth/token/"
→ {"detail":"No active account found with the given credentials"}  <- 401

Step 4: Decode your access token yourself

Define a small helper function in PowerShell (paste the whole block):
function Decode-JwtPart([string]$part) {
    $s = $part.Replace('-', '+').Replace('_', '/')
    switch ($s.Length % 4) { 2 { $s += '==' } 3 { $s += '=' } }
    [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($s))
}
What each line does:
- function Decode-JwtPart([string]$part) declares a function with one string parameter.
- base64url is base64 with two changes, so it's safe in URLs: + becomes -, / becomes _, and the = padding at the end is removed. Line 2 undoes the character swap.
- Standard base64 length must be a multiple of 4, so line 3 adds back the removed = padding. % is the remainder operator.
- Line 4 decodes base64 into bytes (FromBase64String), then bytes into text (UTF8.GetString).

Now split the token at the dots and decode the first two parts:
$parts = $tokens.access.Split('.')
Decode-JwtPart $parts[0]
$payload = Decode-JwtPart $parts[1] | ConvertFrom-Json
$payload
[DateTimeOffset]::FromUnixTimeSeconds($payload.iat).LocalDateTime
[DateTimeOffset]::FromUnixTimeSeconds($payload.exp).LocalDateTime
- Header → {"alg":"HS256","typ":"JWT"}.
- Payload → token_type: access, exp, iat, jti, and user_id: 2 (the customer's id from Lesson 2.6).
- The two timestamps, converted to your local time, are exactly 15 minutes apart.

You just read the token's contents without any password or key. Anyone can. The third part ($parts[2]) is the signature, which is only bytes and can't be "decoded" into anything meaningful.

Step 5: Use the access token

$auth = @{ Authorization = "Bearer $($tokens.access)" }
Invoke-RestMethod "$api/" -Headers $auth
- $( ... ) inside a double-quoted string is a subexpression: PowerShell evaluates the code inside and inserts the result. Without it, "Bearer $tokens.access" would insert $tokens (the whole object) followed by the literal text .access.
- → the API root now answers (categories, products) instead of 401.

The customer is authenticated but not staff, so writing is still forbidden:
curl.exe -sS -w "  <- %{http_code}`n" -X DELETE -H "Authorization: Bearer $($tokens.access)" "$api/products/chef-knife/"
→ {"detail":"You do not have permission to perform this action."}  <- 403. That's the 401/403 difference in practice.

Step 6: Try the two attacks

(a) Use the refresh token as an access token:
curl.exe -sS -w "  <- %{http_code}`n" -H "Authorization: Bearer $($tokens.refresh)" "$api/"
→ ... "message":"Token has wrong type" ...  <- 401. The token_type claim says refresh, and only access is accepted here.

(b) Tamper with the payload to impersonate the admin (user id 1):
function ConvertTo-Base64Url([string]$text) {
    [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($text)).TrimEnd('=').Replace('+', '-').Replace('/', '_')
}
$payload.user_id = '1'
$forged = $parts[0] + '.' + (ConvertTo-Base64Url ($payload | ConvertTo-Json -Compress)) + '.' + $parts[2]
curl.exe -sS -w "  <- %{http_code}`n" -H "Authorization: Bearer $forged" "$api/"
- ConvertTo-Base64Url is the reverse of Decode-JwtPart.
- We change user_id to the admin's id, re-encode the payload, and keep the original signature.

→ {"detail":"Given token not valid for any token type", ..., "message":"Token is invalid"}  <- 401

Why it failed: the server recomputed HMAC_SHA256(SECRET_KEY, header + "." + new_payload), and it doesn't match the old signature. To forge a valid one, you'd need SECRET_KEY.

Step 7: Refresh the access token

$refreshBody = @{ refresh = $tokens.refresh } | ConvertTo-Json
$new = Invoke-RestMethod -Method Post -Uri "$api/auth/token/refresh/" -ContentType 'application/json' -Body $refreshBody
$new.access -eq $tokens.access
(Decode-JwtPart $new.access.Split('.')[1] | ConvertFrom-Json).jti
$payload.jti
- $new contains only access (no new refresh token, because refresh-token rotation isn't enabled).
- -eq compares: False, it's a different token.
- The two jti values differ: each token has its own unique ID. The new access token has a fresh 15-minute window.

Step 8: Log in as admin and write with a token

$adminBody = @{ email = 'subin@ontash.net'; password = 'YOUR_ADMIN_PASSWORD' } | ConvertTo-Json
$adminTokens = Invoke-RestMethod -Method Post -Uri "$api/auth/token/" -ContentType 'application/json' -Body $adminBody
$adminAuth = @{ Authorization = "Bearer $($adminTokens.access)" }

$patch = @{ stock = 41 } | ConvertTo-Json
(Invoke-RestMethod -Method Patch -Uri "$api/products/wireless-mouse/" -Headers $adminAuth -ContentType 'application/json' -Body $patch).stock
→ 41. The same IsAdminOrReadOnly permission from Lesson 4.3 now receives its request.user from the JWT.

In the admin site (log in in the browser), Users → open customer@example.com: Last login now shows the time of Step 3. That's UPDATE_LAST_LOGIN: True.

Step 9 (optional): Re-run the two Lesson 4.6 tests that returned 000

uv run python -c "import os; from PIL import Image; Image.frombytes('RGB', (1200, 1200), os.urandom(1200*1200*3)).save(r'$env:TEMP\big.png')"
Set-Content "$env:TEMP\fake.jpg" "this is not an image"
curl.exe -sS -w "  <- %{http_code}`n" -X PATCH -H "Authorization: Bearer $($adminTokens.access)" -F "image=@$env:TEMP\big.png" "$api/products/wireless-mouse/"
curl.exe -sS -w "  <- %{http_code}`n" -X PATCH -H "Authorization: Bearer $($adminTokens.access)" -F "image=@$env:TEMP\fake.jpg" "$api/products/wireless-mouse/"
→ ...maximum is 2 MB...  <- 400 and ...Upload a valid image...  <- 400.

Step 10 (optional): Watch an access token expire

In Window 1, stop the server and restart it with a 1-minute lifetime. A real environment variable beats .env (Lesson 2.3):
$env:JWT_ACCESS_MINUTES = "1"
uv run python manage.py runserver
In Window 2, log in again (Step 3), wait more than 60 seconds, then:
curl.exe -sS -w "  <- %{http_code}`n" -H "Authorization: Bearer $($tokens.access)" "$api/"
→ ..."message":"Token is expired"...  <- 401. That's exactly the signal React will use to refresh automatically. Afterwards, in Window 1: Ctrl+C, Remove-Item Env:JWT_ACCESS_MINUTES, and restart normally.
"$api/products/wireless-mouse/"
curl.exe -sS -w "  <- %{http_code}`n" -X PATCH -H "Authorization: Bearer $($adminTokens.access)" -F "image=@$env:TEMP\fake.jpg" "$api/products/wireless-mouse/"
→ ...maximum is 2 MB...  <- 400 and ...Upload a valid image...  <- 400.

Step 10 (optional): Watch an access token expire

In Window 1, stop the server and restart it with a 1-minute lifetime. A real environment variable beats .env (Lesson 2.3):
$env:JWT_ACCESS_MINUTES = "1"
uv run python manage.py runserver
In Window 2, log in again (Step 3), wait more than 60 seconds, then:
curl.exe -sS -w "  <- %{http_code}`n" -H "Authorization: Bearer $($tokens.access)" "$api/"
→ ..."message":"Token is expired"...  <- 401. That's exactly the signal React will use to refresh automatically. Afterwards, in Window 1: Ctrl+C, Remove-Item Env:JWT_ACCESS_MINUTES, and restart normally.




What & why

Right now only the admin can create accounts. A shop needs:
1. POST /api/auth/register/: a visitor creates a customer account. The password must pass Django's password validators and be hashed before saving.
2. GET /api/auth/me/: "who am I?" React calls this after login to learn the user's name and whether they're staff (to show admin menus).
3. PATCH /api/auth/me/: the user edits their own name. They must not be able to make themselves staff.

We also fix an inconsistency: Ana@Example.com and ana@example.com should be the same account. Emails are now normalised to lowercase at registration and at login.

Files involved (written, and verified in a rolled-back transaction, so no users were created)
backend/
├── accounts/serializers.py   ← NEW: RegisterSerializer, UserSerializer, EmailTokenObtainPairSerializer
├── accounts/views.py         ← ✏️ RegisterView, MeView
├── accounts/urls.py          ← ✏️ + register/ and me/
└── config/settings.py        ← ✏️ SIMPLE_JWT['TOKEN_OBTAIN_SERIALIZER'] → our login serializer
Request flow for registration:
POST /api/auth/register/ {"email": " Ana.Silva@Example.COM ", "username": "ana", "password": "..."}
  → RegisterView (CreateAPIView): AllowAny, no authentication
  → RegisterSerializer.is_valid():
       field checks (email format, username unique, required fields)
       validate_email()  → " Ana.Silva@Example.COM " → "ana.silva@example.com", then a case-insensitive duplicate check
       validate()        → Django password validators (length, common, numeric, similarity)
  → serializer.save() → create() → User.objects.create_user(...)  (password hashed)
  ← 201 {"id": 5, "email": "ana.silva@example.com", "username": "ana", ...}   (no password in the response)

---

The code, explained line by line (accounts/serializers.py)

Imports

from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()
- import ... as DjangoValidationError renames the imported class in this file only. Django and DRF both have a class called ValidationError, and they're different classes:
  - Django's comes from django.core.exceptions and is raised by validate_password().
  - DRF's is used as serializers.ValidationError and turns into a 400 response.

  Without the alias, the second import of the same name would silently replace the first. The alias keeps both clear.
- User = get_user_model() runs once, when Python first imports this module. It returns the class named by AUTH_USER_MODEL (accounts.User, Lesson 2.5) and stores it in a module-level variable. The rest of the file uses User like a normal class name. This is the pattern Django recommends instead of importing the model directly, so the code keeps working if the user model is ever changed.

A small helper function

def normalize_email(value):
    """Emails are compared case-insensitively: " Ana@Example.COM " -> "ana@example.com"."""
    return value.strip().lower()
- def name(parameters): defines a function. The indented block is its body.
- The triple-quoted string on the first line is a docstring. Python stores it as the function's documentation (help(normalize_email) would show it).
- value.strip().lower() is method chaining. Strings are immutable in Python, so .strip() doesn't change value; it returns a new string without leading or trailing whitespace. .lower() is then called on that new string and returns another new, all-lowercase one.
- We define it once and use it in two places (register and login), so both always normalise identically.

RegisterSerializer: the class and its fields

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'first_name', 'last_name', 'password']
        read_only_fields = ['id']
- class RegisterSerializer(serializers.ModelSerializer): defines a class that inherits from ModelSerializer. It gets all of ModelSerializer's behaviour (auto-generated fields, is_valid(), save(), …), and we only add or override what we need.
- Declaring password explicitly overrides the auto-generated one:
  - write_only=True: accepted as input, never included in output. Without it, ModelSerializer would include the password field in the response, which is the stored hash. Even a hash should never leave the server.
  - style={'input_type': 'password'} is a small dict telling the browsable API to render a password box (dots instead of characters). It has no effect on JSON clients.
- class Meta: is a class nested inside a class. It's just a container for configuration that ModelSerializer reads: which model, which fields.
- fields is an allow-list. Notice what's not there: is_staff, is_superuser, is_active, groups. In my test I sent "is_staff": true in the registration body. It was silently ignored, and the stored user had is_staff = False. This protection against mass assignment (sending extra fields to escalate privileges) comes from using an explicit fields list.
- username and email validation comes free from the model: unique=True becomes "A user with that username already exists.", and EmailField becomes "Enter a valid email address."

validate_email: field-level validation

def validate_email(self, value):
    value = normalize_email(value)
    if User.objects.filter(email__iexact=value).exists():
        raise serializers.ValidationError('An account with this email already exists.')
    return value
- DRF finds this method by its name (validate_ + field name) and calls it with the already format-checked value.
- self is the serializer instance. Every method on a class receives the object itself as its first parameter. Python passes it automatically; you never pass it yourself.
- email__iexact=value uses the iexact lookup, a case-insensitive exact match (in SQL, UPPER(email) = UPPER(%s)). The database's unique constraint compares case-sensitively, so without this check Customer@example.com could create a second account.
- .exists() runs SELECT 1 ... LIMIT 1, the cheapest way to ask "is there at least one?"
- raise stops the method immediately and hands the error to DRF, which attaches it to the email field.
- return value is essential: whatever you return is what gets saved. We return the normalised version, so the database always stores lowercase.

validate: object-level validation with Django's password validators

def validate(self, attrs):
    candidate = User(**{key: value for key, value in attrs.items() if key != 'password'})
    try:
        validate_password(attrs['password'], user=candidate)
    except DjangoValidationError as error:
        raise serializers.ValidationError({'password': list(error.messages)})
    return attrs
The first line packs three Python features together:
1. attrs is a dict of all the validated fields: {'email': 'ana@...', 'username': 'ana', 'password': '...'}.
2. {key: value for key, value in attrs.items() if key != 'password'} is a dict comprehension. It builds a new dict by looping over attrs.items() (which yields (key, value) pairs) and keeps every pair except the password. It's a compact version of:
data = {}
for key, value in attrs.items():
    if key != 'password':
        data[key] = value
3. User(**data): the ** operator unpacks a dict into keyword arguments. So User(**{'email': 'a@b.c', 'username': 'ana'}) means User(email='a@b.c', username='ana').
   - This creates a User object in memory only. Nothing touches the database until .save() is called.
   - We need it because validate_password(password, user=...) includes UserAttributeSimilarityValidator, which compares the password to the user's email and username. It needs a user object to compare against.

The try/except block:
- Code inside try: runs normally. If it raises a DjangoValidationError, Python jumps to the matching except block, and as error names the exception object.
- error.messages is a list of human-readable messages. Wrapping it in list(...) guarantees a plain list.
- We then translate the Django exception into DRF's ValidationError, as a dict {'password': [...]}, so the messages are attached to the password field and returned as a 400. Without this translation, the uncaught Django exception would become a 500.
- Which validators run is decided by AUTH_PASSWORD_VALIDATORS in settings.py, the list from Lesson 2.2. We reuse Django's rules instead of inventing our own.

create: hashing the password

def create(self, validated_data):
    return User.objects.create_user(**validated_data)
- serializer.save() (called by the view) calls create() when there's no existing instance, passing all validated fields as a dict.
- **validated_data unpacks it again: create_user(email=..., username=..., password=..., first_name=...).
- create_user() is a method of Django's UserManager (Lesson 2.6's managers=[('objects', UserManager())]). It calls user.set_password(password), which produces pbkdf2_sha256$870000$..., then saves. My test confirmed the stored value starts with pbkdf2_sha256$870000$.
- The default ModelSerializer.create() would call User.objects.create(**validated_data), which stores the password as plain text. That's the most common security bug in Django registration code, and it's why we override create().

UserSerializer: read-only fields protect the role

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'first_name', 'last_name', 'is_staff', 'date_joined']
        read_only_fields = ['id', 'email', 'is_staff', 'date_joined']
- is_staff must be visible, because React needs it to show admin menus. But it's listed in read_only_fields, so a PATCH {"is_staff": true} is ignored, not applied. My test PATCHed is_staff and email along with last_name: only last_name changed.
- email is read-only because it's the login identifier. Changing it safely would need re-verification, which is out of scope for this course.

EmailTokenObtainPairSerializer: normalising at login

class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        attrs[self.username_field] = normalize_email(attrs[self.username_field])
        return super().validate(attrs)
- We subclass the library's login serializer and override only validate().
- self.username_field is an attribute the parent class sets to User.USERNAME_FIELD, which is 'email' for us. Using the attribute instead of hard-coding 'email' keeps the code correct if the login field changes.
- attrs[...] = ... replaces the value in the dict before the password check.
- super().validate(attrs) calls the parent class's validate(), which does the real work (authenticate(), token creation). super() means "the next class up in the inheritance chain." This pattern (tweak the input, then delegate to the parent) is how you customise library classes without copying their code.
- It's switched on in settings.py with the dotted path 'TOKEN_OBTAIN_SERIALIZER': 'accounts.serializers.EmailTokenObtainPairSerializer'. Simple JWT's TokenObtainPairView reads that setting to decide which serializer to use.

---

The code, explained line by line (accounts/views.py)

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]
    authentication_classes = []
- CreateAPIView implements only post(). Internally it does:
  a. serializer = self.get_serializer(data=request.data)
  b. serializer.is_valid(raise_exception=True): on failure, it raises, and DRF turns that into a 400 with serializer.errors
  c. self.perform_create(serializer), which just calls serializer.save(), which calls our create()
  d. Response(serializer.data, status=201): serializer.data now describes the saved user (password excluded by write_only)
- These are class attributes: variables defined directly in the class body, shared by every instance. DRF's machinery reads them.
- permission_classes = [AllowAny] overrides the global IsAuthenticated default. A visitor can't be logged in before having an account.
- authentication_classes = [] (an empty list) means don't even try to identify the user on this endpoint. Why it matters: JWTAuthentication rejects a request whose header contains an invalid or expired token with a 401, even on an AllowAny view. A browser that still holds an old expired token would then be unable to register. My test sent Authorization: Bearer broken.token.value to /register/ and still got 201. (Simple JWT's own login view does the same thing internally.)

class MeView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'patch', 'head', 'options']

    def get_object(self):
        return self.request.user
- RetrieveUpdateAPIView provides get() (retrieve), put() (update), and patch() (partial update). All three call self.get_object() to find which object to work on.
- Normally get_object() reads an id or slug from the URL. We override it to return self.request.user, the user object that JWTAuthentication built from the token. There is no id in the URL, so a user can never ask for someone else's profile. There's simply no parameter to change.
- http_method_names is a list of allowed HTTP methods (in lowercase). We leave out 'put': a PUT would require every writable field. Anything not listed → 405 Method Not Allowed.
- permission_classes = [IsAuthenticated] is already the global default, but writing it here makes the view's rule obvious to anyone reading the file.

---

Results of my verification (rolled back afterwards)

┌──────────────────────────────────────────────────────────┬─────────────────────────────────────────────────────────────────────────────────────┐
│                         Request                          │                                       Result                                        │
├──────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
│ Register with password 123                               │ 400, password: too short / too common / entirely numeric (three validators at once) │
├──────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
│ Register with CUSTOMER@Example.com                       │ 400 An account with this email already exists. (case-insensitive)                   │
├──────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
│ Register with a bad email + an existing username         │ 400, errors for both fields in one response                                         │
├──────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
│ Register " Ana.Silva@Example.COM " with "is_staff": true │ 201, stored as ana.silva@example.com, is_staff = False, password hashed             │
├──────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
│ Login with ANA.SILVA@example.com                         │ 200, tokens returned                                                                │
├──────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
│ GET /me/ with the token                                  │ 200, Ana's profile                                                                  │
├──────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
│ PATCH /me/ with last_name, is_staff, email               │ 200, only last_name changed                                                         │
├──────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
│ PUT /me/                                                 │ 405                                                                                 │
├──────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
│ GET /me/ without a token                                 │ 401                                                                                 │
└──────────────────────────────────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘

---

▶️ Your turn

Window 1:
cd "$env:USERPROFILE\OneDrive\Desktop\django-ecommerce\backend"
uv run python manage.py check
uv run python manage.py runserver

Step 1: A reusable PowerShell helper that shows status and body, even for errors

Invoke-RestMethod throws on 4xx/5xx in PowerShell 5.1, which makes error testing clumsy. Paste this function once into Window 2 (I tested it in Windows PowerShell 5.1):
function Send-Json {
    param([string]$Method, [string]$Url, $Body = $null, [hashtable]$Headers = @{})
    $json = if ($null -ne $Body) { $Body | ConvertTo-Json } else { $null }
    try {
        $response = Invoke-WebRequest -UseBasicParsing -Method $Method -Uri $Url -Headers $Headers -ContentType 'application/json' -Body $json
        "$($response.StatusCode) $($response.Content)"
    } catch {
        "$([int]$_.Exception.Response.StatusCode) $($_.ErrorDetails.Message)"
    }
}
$api = "http://127.0.0.1:8000/api"
- param(...) declares named parameters. $Body = $null gives a default value, so -Body is optional.
- Invoke-WebRequest returns the raw response (status code + text), unlike Invoke-RestMethod, which parses it. -UseBasicParsing avoids an old Internet Explorer dependency in 5.1.
- In catch, $_ is the error. .Exception.Response.StatusCode is the HTTP status, and .ErrorDetails.Message holds the response body.

Usage: Send-Json POST "$api/..." @{ key = 'value' }. The hashtable is converted to JSON for you.

Step 2: Registration errors

Send-Json POST "$api/auth/register/" @{ email = 'marvellous@example.com'; username = 'marvellous'; password = '123' }
Send-Json POST "$api/auth/register/" @{ email = 'marvellous@example.com'; username = 'marvellous'; password = 'marvellous99' }
Send-Json POST "$api/auth/register/" @{ email = 'CUSTOMER@Example.com'; username = 'someone'; password = 'Sunny-Garden-42' }
Send-Json POST "$api/auth/register/" @{ email = 'not-an-email'; username = 'customer1'; password = 'Sunny-Garden-42' }
Expected, all 400:
1. {"password":["This password is too short...","This password is too common.","This password is entirely numeric."]}
2. {"password":["The password is too similar to the username."]}: the similarity validator, using our temporary candidate user
3. {"email":["An account with this email already exists."]}: our iexact check
4. {"email":["Enter a valid email address."],"username":["A user with that username already exists."]}: all field errors in one response, so a form can highlight every problem at once

Step 3: Register successfully (and try to sneak in is_staff)

Send-Json POST "$api/auth/register/" @{ email = '  Ana.Silva@Example.COM '; username = 'ana'; password = 'Sunny-Garden-42'; first_name = 'Ana'; is_staff = $true }
→ 201 {"id":...,"email":"ana.silva@example.com","username":"ana","first_name":"Ana","last_name":""}
- The email was trimmed and lowercased.
- There's no password in the response (write_only).
- The id is probably 5 or higher: my rolled-back test used up ids 3 and 4 (sequence gaps, Lesson 3.4).

Check the database directly:
docker compose exec db psql -U shoplite -d shoplite -c "SELECT id, email, username, is_staff, left(password, 22) FROM accounts_user ORDER BY id;"
Ana has is_staff = f and a pbkdf2_sha256$870000$... hash. The is_staff: true you sent was ignored.

Step 4: Log in with different capitalisation, then call "me"

$login = Invoke-RestMethod -Method Post -Uri "$api/auth/token/" -ContentType 'application/json' -Body (@{ email = 'ANA.SILVA@example.com'; password = 'Sunny-Garden-42' } | ConvertTo-Json)
$anaAuth = @{ Authorization = "Bearer $($login.access)" }
Send-Json GET "$api/auth/me/" -Headers $anaAuth
- The login works despite the capitals, thanks to EmailTokenObtainPairSerializer.
- -Body (...): the parentheses make PowerShell run the inner pipeline first and pass its result as the argument.
- → 200 {"id":...,"email":"ana.silva@example.com","username":"ana","first_name":"Ana","last_name":"","is_staff":false,"date_joined":"..."}

Step 5: Update the profile, and try to escalate

Send-Json PATCH "$api/auth/me/" @{ last_name = 'Silva'; is_staff = $true; email = 'hacker@example.com' } -Headers $anaAuth
Send-Json PUT "$api/auth/me/" @{ last_name = 'X' } -Headers $anaAuth
Send-Json GET "$api/auth/me/"
1. 200, with "last_name":"Silva", still "is_staff":false, and the same email. The read-only fields were ignored.
2. 405 {"detail":"Method \"PUT\" not allowed."}: http_method_names
3. 401 {"detail":"Authentication credentials were not provided."}: no token

Step 6: Registration ignores a stale token

Send-Json POST "$api/auth/register/" @{ email = 'bob@example.com'; username = 'bob'; password = 'Sunny-Garden-42' } -Headers @{ Authorization = 'Bearer this.is.garbage' }
Send-Json GET "$api/auth/me/" -Headers @{ Authorization = 'Bearer this.is.garbage' }
1. 201: authentication_classes = [] means the header is never examined. (Bob is a real account now, which is useful later as a second customer.)
2. 401 ... "Token is invalid": on a normal endpoint, the same bad header is rejected.

Step 7: Browsable API (optional)

Open http://127.0.0.1:8000/api/auth/register/ in the browser. There's an HTML form with a masked Password box (style={'input_type': 'password'}), and no field for is_staff.

Step 8: Commit

Stop the server, then:
cd ..
git status
git add backend
git commit -m "Register and me endpoints; password validation; case-insensitive email login"

---

❓ If something goes wrong
└──────────────────────────────────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘

---

▶️ Your turn

Window 1:
cd "$env:USERPROFILE\OneDrive\Desktop\django-ecommerce\backend"
uv run python manage.py check
uv run python manage.py runserver

Step 1: A reusable PowerShell helper that shows status and body, even for errors

Invoke-RestMethod throws on 4xx/5xx in PowerShell 5.1, which makes error testing clumsy. Paste this function once into Window 2 (I tested it in Windows PowerShell 5.1):
function Send-Json {
    param([string]$Method, [string]$Url, $Body = $null, [hashtable]$Headers = @{})
    $json = if ($null -ne $Body) { $Body | ConvertTo-Json } else { $null }
    try {
        $response = Invoke-WebRequest -UseBasicParsing -Method $Method -Uri $Url -Headers $Headers -ContentType 'application/json' -Body $json
        "$($response.StatusCode) $($response.Content)"
    } catch {
        "$([int]$_.Exception.Response.StatusCode) $($_.ErrorDetails.Message)"
    }
}
$api = "http://127.0.0.1:8000/api"
- param(...) declares named parameters. $Body = $null gives a default value, so -Body is optional.
- Invoke-WebRequest returns the raw response (status code + text), unlike Invoke-RestMethod, which parses it. -UseBasicParsing avoids an old Internet Explorer dependency in 5.1.
- In catch, $_ is the error. .Exception.Response.StatusCode is the HTTP status, and .ErrorDetails.Message holds the response body.

Usage: Send-Json POST "$api/..." @{ key = 'value' }. The hashtable is converted to JSON for you.

Step 2: Registration errors

Send-Json POST "$api/auth/register/" @{ email = 'marvellous@example.com'; username = 'marvellous'; password = '123' }
Send-Json POST "$api/auth/register/" @{ email = 'marvellous@example.com'; username = 'marvellous'; password = 'marvellous99' }
Send-Json POST "$api/auth/register/" @{ email = 'CUSTOMER@Example.com'; username = 'someone'; password = 'Sunny-Garden-42' }
Send-Json POST "$api/auth/register/" @{ email = 'not-an-email'; username = 'customer1'; password = 'Sunny-Garden-42' }
Expected, all 400:
1. {"password":["This password is too short...","This password is too common.","This password is entirely numeric."]}
2. {"password":["The password is too similar to the username."]}: the similarity validator, using our temporary candidate user
3. {"email":["An account with this email already exists."]}: our iexact check
4. {"email":["Enter a valid email address."],"username":["A user with that username already exists."]}: all field errors in one response, so a form can highlight every problem at once

Step 3: Register successfully (and try to sneak in is_staff)

Send-Json POST "$api/auth/register/" @{ email = '  Ana.Silva@Example.COM '; username = 'ana'; password = 'Sunny-Garden-42'; first_name = 'Ana'; is_staff = $true }
→ 201 {"id":...,"email":"ana.silva@example.com","username":"ana","first_name":"Ana","last_name":""}
- The email was trimmed and lowercased.
- There's no password in the response (write_only).
- The id is probably 5 or higher: my rolled-back test used up ids 3 and 4 (sequence gaps, Lesson 3.4).

Check the database directly:
docker compose exec db psql -U shoplite -d shoplite -c "SELECT id, email, username, is_staff, left(password, 22) FROM accounts_user ORDER BY id;"
Ana has is_staff = f and a pbkdf2_sha256$870000$... hash. The is_staff: true you sent was ignored.

Step 4: Log in with different capitalisation, then call "me"

$login = Invoke-RestMethod -Method Post -Uri "$api/auth/token/" -ContentType 'application/json' -Body (@{ email = 'ANA.SILVA@example.com'; password = 'Sunny-Garden-42' } | ConvertTo-Json)
$anaAuth = @{ Authorization = "Bearer $($login.access)" }
Send-Json GET "$api/auth/me/" -Headers $anaAuth
- The login works despite the capitals, thanks to EmailTokenObtainPairSerializer.
- -Body (...): the parentheses make PowerShell run the inner pipeline first and pass its result as the argument.
- → 200 {"id":...,"email":"ana.silva@example.com","username":"ana","first_name":"Ana","last_name":"","is_staff":false,"date_joined":"..."}

Step 5: Update the profile, and try to escalate

Send-Json PATCH "$api/auth/me/" @{ last_name = 'Silva'; is_staff = $true; email = 'hacker@example.com' } -Headers $anaAuth
Send-Json PUT "$api/auth/me/" @{ last_name = 'X' } -Headers $anaAuth
Send-Json GET "$api/auth/me/"
1. 200, with "last_name":"Silva", still "is_staff":false, and the same email. The read-only fields were ignored.
2. 405 {"detail":"Method \"PUT\" not allowed."}: http_method_names
3. 401 {"detail":"Authentication credentials were not provided."}: no token

Step 6: Registration ignores a stale token

Send-Json POST "$api/auth/register/" @{ email = 'bob@example.com'; username = 'bob'; password = 'Sunny-Garden-42' } -Headers @{ Authorization = 'Bearer this.is.garbage' }
Send-Json GET "$api/auth/me/" -Headers @{ Authorization = 'Bearer this.is.garbage' }
1. 201: authentication_classes = [] means the header is never examined. (Bob is a real account now, which is useful later as a second customer.)
2. 401 ... "Token is invalid": on a normal endpoint, the same bad header is rejected.

Step 7: Browsable API (optional)

Open http://127.0.0.1:8000/api/auth/register/ in the browser. There's an HTML form with a masked Password box (style={'input_type': 'password'}), and no field for is_staff.
Send-Json POST "$api/auth/register/" @{ email = 'CUSTOMER@Example
3. {"email":["An account with this email already exists."]}: our iexact check
4. {"email":["Enter a valid email address."],"username":["A user with that username already exists."]}: all field errors in one response, so a form can highlight every problem at once

Step 3: Register successfully (and try to sneak in is_staff)

Send-Json POST "$api/auth/register/" @{ email = '  Ana.Silva@Example.COM '; username = 'ana'; password = 'Sunny-Garden-42'; first_name = 'Ana'; is_staff = $true }
→ 201 {"id":...,"email":"ana.silva@example.com","username":"ana","first_name":"Ana","last_name":""}
- The email was trimmed and lowercased.
- There's no password in the response (write_only).
- The id is probably 5 or higher: my rolled-back test used up ids 3 and 4 (sequence gaps, Lesson 3.4).

Check the database directly:
docker compose exec db psql -U shoplite -d shoplite -c "SELECT id, email, username, is_staff, left(password, 22) FROM accounts_user ORDER BY id;"
Ana has is_staff = f and a pbkdf2_sha256$870000$... hash. The is_staff: true you sent was ignored.

- The login works despite the capitals, thanks to EmailTokenObtai

Send-Json PATCH "$api/auth/me/" @{ last_name = 'Silva'; is_staff = $true; email = 'hacker@example.com' } -Headers $anaAuth
Send-Json PUT "$api/auth/me/" @{ last_name = 'X' } -Headers $anaAuth
Send-Json GET "$api/auth/me/"
1. 200, with "last_name":"Silva", still "is_staff":false, and the same email. The read-only fields were ignored.
2. 405 {"detail":"Method \"PUT\" not allowed."}: http_method_names
3. 401 {"detail":"Authentication credentials were not provided."}: no token

Step 6: Registration ignores a stale token

Send-Json POST "$api/auth/register/" @{ email = 'bob@example.com'; username = 'bob'; password = 'Sunny-Garden-42' } -Headers @{ Authorization = 'Bearer this.is.garbage' }
Send-Json GET "$api/auth/me/" -Headers @{ Authorization = 'Bearer this.is.garbage' }
1. 201: authentication_classes = [] means the header is never examined. (Bob is a real account now, which is useful later as a second customer.)
2. 401 ... "Token is invalid": on a normal endpoint, the same bad header is rejected.

Step 7: Browsable API (optional)
Step 8: Commit

Stop the server, then:

---

❓ If something goes wrong

┌──────────────────────────────────────────┬──────────────────────────────────────────┬───────────────────────────────────────────────────────────────┐
│                 Symptom                  │                Root cause                │                              Fix                              │
├──────────────────────────────────────────┼──────────────────────────────────────────┼───────────────────────────────────────────────────────────────┤
│ Register returns 201 but login fails     │ create() isn't using create_user(), so   │ Check create(); in psql, the password column must start with  │
│                                          │ the password was stored as plain text    │ pbkdf2_sha256$                                                │
├──────────────────────────────────────────┼──────────────────────────────────────────┼───────────────────────────────────────────────────────────────┤
│ 500 with ValidationError in the          │ Django's ValidationError isn't being     │ Check the try/except in validate() and the                    │
│ traceback on a weak password             │ converted to DRF's                       │ DjangoValidationError import alias                            │
├──────────────────────────────────────────┼──────────────────────────────────────────┼───────────────────────────────────────────────────────────────┤
│ ImportError: ...                         │                                          │ It must be                                                    │
│ EmailTokenObtainPairSerializer at        │ A typo in the dotted path in SIMPLE_JWT  │ 'accounts.serializers.EmailTokenObtainPairSerializer'         │
│ startup                                  │                                          │                                                               │
├──────────────────────────────────────────┼──────────────────────────────────────────┼───────────────────────────────────────────────────────────────┤
│ Login with capitals fails                │ The TOKEN_OBTAIN_SERIALIZER setting is   │ Add it, then restart the server                               │
│                                          │ missing                                  │                                                               │
├──────────────────────────────────────────┼──────────────────────────────────────────┼───────────────────────────────────────────────────────────────┤
│ Send-Json prints 0 and an empty message  │ The server isn't running (no HTTP        │ Start runserver in Window 1                                   │
│                                          │ response at all)
1. the four lines from Step 2,
2. the psql output from Step 3, and




What & why

Everything so far was tested from PowerShell, and it all works. But in Phase 10 the shop's pages will be a React app running in the browser at http://localhost:5173, calling our API at http://127.0.0.1:8000. Browsers have a security rule that blocks this by default, even though the API itself is fine. In this lesson you'll see the block happen, understand why, and then allow our frontend (and only our frontend) through.

What CORS is, in plain language

A website's origin is the combination of three things: http or https, the host name, and the port. So http://localhost:5173 and http://127.0.0.1:8000 are different origins. Even localhost and 127.0.0.1 count as different, because the host name is written differently.

Browsers follow the same-origin policy: JavaScript on a page may send requests to other origins, but it isn't allowed to read the answer unless that other server explicitly says "this origin is allowed." The server says so by adding a response header: Access-Control-Allow-Origin: http://localhost:5173. This mechanism for granting permission is called CORS (Cross-Origin Resource Sharing).

The rule exists to protect users. Without it, any website you visit could quietly use JavaScript to read data from other sites where you're logged in, like your email or bank.

The key point that confuses everyone the first time: when CORS blocks a request, the server usually still received it and answered normally. You'll see 200 in the Django log. It's the browser that throws the answer away, because the permission header was missing. That's also why PowerShell never had this problem: PowerShell isn't a browser and doesn't enforce the rule.

For some requests the browser is extra careful and first sends a "preflight" request. That's an OPTIONS request asking the server "would you accept a GET with an Authorization header from localhost:5173?" Only if the server says yes does the browser send the real request. Requests with our token header, or with a JSON body, always trigger a preflight. Simple public GETs don't.

What I changed

- Added django-cors-headers (you'll install it with uv; the resolver picks 4.9.0 for Django 5.1.7). It's a small, widely used package that adds the permission headers and answers preflight requests.
- Put its middleware at the very top of MIDDLEWARE. Remember from Lesson 2.2 that every request passes through the middleware list from top to bottom, and every response goes back through it bottom to top. Placing CORS first means it can answer preflight requests immediately, and it adds its headers to every response, including errors like 401 or 404. Without that, a failed login could show up in React as a confusing "CORS error" instead of the real 401.
- Made the allowed origins a setting read from .env (CORS_ALLOWED_ORIGINS), the same way we handled secrets and the database in Lessons 2.3 and 2.4. Only the origins listed there get permission. Every other website's JavaScript stays blocked.
- Left that .env value empty on purpose, so you first see the browser block the request. You'll fill it in yourself halfway through the lesson.
- Created a tiny test page at %TEMP%\cors-test\index.html, outside the project. It stands in for the future React app. It has two buttons: one loads products (a simple public request), and one logs in and calls /api/auth/me/ with a token (which triggers a preflight). We'll serve it on port 5173, exactly where React will run.

One thing we deliberately don't need: allowing browser cookies across origins. Our React app will send the JWT in the Authorization header (Lesson 5.1), not in a cookie, so the simpler default is also the safer one.

I verified the configuration in both states:

┌──────────┬───────────────────────────────────────────────────────┬──────────────────────────────┬──────────────────────────────────────────────────┐
│ Setting  │              Request from localhost:5173              │  Request from evil.example   │           Preflight for /api/auth/me/            │
├──────────┼───────────────────────────────────────────────────────┼──────────────────────────────┼──────────────────────────────────────────────────┤
│ Empty    │ 200, no permission header (browser will block)        │ 200, no header               │ no permission headers                            │
├──────────┼───────────────────────────────────────────────────────┼──────────────────────────────┼──────────────────────────────────────────────────┤
│ Filled   │ 200, Access-Control-Allow-Origin:                     │ 200, no header (still        │ allows authorization, content-type, and the      │
│ in       │ http://localhost:5173                                 │ blocked)                     │ methods                                          │
└──────────┴───────────────────────────────────────────────────────┴──────────────────────────────┴──────────────────────────────────────────────────┘

---

▶️ Your turn

You'll need three PowerShell windows this time: the API, the test page, and one for commands.

Step 1: Install the package (Window 1)

cd "$env:USERPROFILE\OneDrive\Desktop\django-ecommerce\backend"
uv add django-cors-headers
uv run python manage.py check
uv run python manage.py runserver
Expect + django-cors-headers==4.9.0, then no issues.

Step 2: Serve the test page on port 5173 (Window 2)

cd "$env:USERPROFILE\OneDrive\Desktop\django-ecommerce\backend"
uv run python -m http.server 5173 --directory "$env:TEMP\cors-test"
Python has a very basic web server built in. This serves the test page's folder, which gives us a page with a different origin from the API.

Step 3: See CORS block the request

1. In your browser, open http://localhost:5173 and press F12 to open DevTools. Keep the Console and Network tabs handy.
2. Click button 1. The page says "Request failed: TypeError: Failed to fetch". That's all JavaScript is told.
3. The Console shows the real reason, in red:
▎ Access to fetch at 'http://127.0.0.1:8000/api/products/?page_size=3' from origin 'http://localhost:5173' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
4. Now look at Window 1 (Django's log): "GET /api/products/?page_size=3 HTTP/1.1" 200. The server answered successfully. The browser blocked it. This is the most important thing to remember about CORS.
5. Type Ana's password (Sunny-Garden-42) and click button 2. It also fails. In the Django log you'll see "OPTIONS /api/auth/token/ HTTP/1.1" 200. That's the preflight: the browser asked first, got no permission, and never sent the actual login request.

Step 4: Allow our frontend's origin

Open backend\.env and fill in the empty line:
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
Then restart the API in Window 1 (Ctrl+C, then uv run python manage.py runserver again). The auto-reloader only watches .py files, and .env is read once at startup, so changes there need a manual restart. We list both localhost and 127.0.0.1 because the browser treats them as different origins.

Step 5: Try again

1. Refresh http://localhost:5173 and click button 1 → Status 200 and three products.
2. Click button 2 (with the password filled in) → Login 200, me 200, plus Ana's profile as JSON.
3. In the Network tab, click the me/ request that has type preflight (or method OPTIONS). Under Response Headers you'll find access-control-allow-origin: http://localhost:5173 and access-control-allow-headers: ... authorization .... Then click the real GET me/ request: it has the same access-control-allow-origin header, plus your authorization: Bearer ... request header.
4. In the Django log you'll now see pairs: OPTIONS /api/auth/me/ followed by GET /api/auth/me/.

Step 6: Confirm that other websites stay blocked (Window 3)

$api = "http://127.0.0.1:8000/api"
curl.exe -sS -D - -o NUL -H "Origin: http://localhost:5173" "$api/products/?page_size=1" | Select-String "HTTP/|access-control"
curl.exe -sS -D - -o NUL -H "Origin: http://evil.example" "$api/products/?page_size=1" | Select-String "HTTP/|access-control"
Here curl pretends to be a page from each origin. -D - prints the response headers, and -o NUL throws away the body.
- From localhost:5173: 200 OK and access-control-allow-origin: http://localhost:5173
- From evil.example: 200 OK and no access-control header, so a real browser on that site would block the answer

Stop the test page server (Window 2) with Ctrl+C. The API can keep running.

Step 7: Commit

cd "$env:USERPROFILE\OneDrive\Desktop\django-ecommerce"
git status
git add backend
git commit -m "CORS with django-cors-headers; allowed origins from .env"
The test page lives in %TEMP%, so it isn't part of the project. .env is ignored as always, and .env.example now shows the value React will need.

---

❓ If something goes wrong

┌───────────────────────────────────────────────┬──────────────────────────────────────────────────┬──────────────────────────────────────────────────┐
Step 6: Confirm that other websites stay blocked (Window 3)

$api = "http://127.0.0.1:8000/api"
curl.exe -sS -D - -o NUL -H "Origin: http://localhost:5173" "$api/products/?page_size=1" | Select-String "HTTP/|access-control"
curl.exe -sS -D - -o NUL -H "Origin: http://evil.example" "$api/products/?page_size=1" | Select-String "HTTP/|access-control"
Here curl pretends to be a page from each origin. -D - prints the response headers, and -o NUL throws away the body.
- From localhost:5173: 200 OK and access-control-allow-origin: http://localhost:5173
- From evil.example: 200 OK and no access-control header, so a real browser on that site would block the answer

Stop the test page server (Window 2) with Ctrl+C. The API can keep running.



Phase 6, Lesson 6.1: Designing the cart

🎉 Phase 5 is complete, and commit 17337d8 (CORS) is in. Glad the explanation style works. I'll keep it this way.

What & why

Customers can now log in and browse products, but they can't collect anything to buy. The next step toward checkout is a shopping cart. In this lesson we decide how the cart works and create the cart app. I'll write the models in the next lesson, the same way we did for the catalog in Phase 3.

Files involved
backend/
├── cart/                  ← NEW app: YOU create it with startapp (this lesson)                                                                            │   └── models.py          ←   Cart + CartItem (next lesson)
└── config/settings.py     ← YOU add 'cart' to INSTALLED_APPS (this lesson)                                                                               
The design, in plain language                                                                                                                             
One cart per customer, stored in the database. Each user gets exactly one cart, linked to their account. Because it lives in PostgreSQL and not in the     browser, a customer who adds a mug on their laptop sees it in . The link is a one-to-one relationship: one user has one cart, and one cart belongs to one user. That's a stricter version of the one-to-many ForeignKey you used for products and categories in Lesson 3.1. The cart     isn't created at registration. It's created automatically the  at it or adds something ("get it, or create it if it doesn'texist yet").                                                                                                                                              
The cart holds "cart items", not products directly. A cart can contain many products, and each needs a quantity, so there's a second table: CartItem. Each row says "this cart contains this product, this many times." Amany, like category → products). Each item points to oneproduct.                                                                                                                                                  
Each product appears at most once per cart. If you add the mug twice, the existing row's quantity goes from 1 to 2, instead of a second "mug" row          appearing. We'll enforce this with a unique rule on the pair (SQL itself, the same idea as the unique slug from Lesson 3.3.Even two very fast clicks can't create a duplicate. Quantity must be at least 1, and that's also enforced by the database, like the price rule from Lesson 3.3. To remove a product, you delete the item rather than sett

The cart doesn't store prices. A cart always shows the productrom the catalog. If an admin changes a price, carts show thenew price immediately. Prices are only "frozen" at checkout, when an order is created (Phase 7, the "price snapshot" from the plan).

What happens when things change underneath the cart:

┌──────────────────────────────────────┬────────────────────────────────────────────────────┬────────────────────────────────────────────────────────┐
│              Situation               │                   Wha │                          Why                           │
├──────────────────────────────────────┼────────────────────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ The customer's account is deleted    │ Their cart and its it │ A cart is worthless without its owner                  │
├──────────────────────────────────────┼────────────────────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ A product is deleted                 │ It disappears from ev │ A cart row pointing at nothing makes no sense. (Unlike │
│                                      │                                                    │  orders, a cart isn't history worth keeping.)          │
├──────────────────────────────────────┼───────────────────────┼────────────────────────────────────────────────────────┤
│ A product is hidden                  │ The item stays, but the API marks it as            │ The customer should see why something can't be bought, │
│ (is_active=False) or its stock drops │ unavailable or over s │  instead of it silently vanishing                      │
├──────────────────────────────────────┼────────────────────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ The customer adds more than is in    │ Rejected with a clear │ Catch the problem as early as possible                 │
│ stock                                │  adding                                            │                                                        │
└──────────────────────────────────────┴───────────────────────┴────────────────────────────────────────────────────────┘

Only logged-in customers have carts. Many real shops also let t (kept in the browser) and merge it into their account atlogin. That's a lot of extra complexity, so for this course the "Add to cart" button asks you to log in first. We planned that already for the product
page in Phase 11.

Who can see what: a customer only ever sees and changes their in the URLs. The API finds "my cart" from the login token,exactly like /api/auth/me/ finds "me" in Lesson 5.2. So nobody can even try to open someone else's cart.

The endpoints we'll build (Lesson 6.3):

┌──────────────────────────────┬──────────────────────────────────────────────────────────────────────────┐
│           Endpoint           │                                             │
├──────────────────────────────┼──────────────────────────────────────────────────────────────────────────┤
│ GET /api/cart/               │ My cart: the items with produthe cart total │
├──────────────────────────────┼──────────────────────────────────────────────────────────────────────────┤
│ POST /api/cart/items/        │ Add a product (or increase itere)           │
├──────────────────────────────┼──────────────────────────────────────────────────────────────────────────┤
│ PATCH /api/cart/items/<id>/  │ Change an item's quantity                   │
├──────────────────────────────┼──────────────────────────────────────────────────────────────────────────┤
│ DELETE /api/cart/items/<id>/ │ Remove an item                              │
├──────────────────────────────┼──────────────────────────────────────────────────────────────────────────┤
│ DELETE /api/cart/            │ Empty the whole cart                        │
└──────────────────────────────┴──────────────────────────────────────────────────────────────────────────┘

---

▶️ Your turn

Step 1: Create the app

cd "$env:USERPROFILE\OneDrive\Desktop\django-ecommerce\backend"
uv run python manage.py startapp cart
Get-ChildItem cart
You'll see the familiar structure from accounts and catalog: m, models.py, tests.py, views.py.

Step 2: Register it

In backend\config\settings.py, add 'cart', under our other app
    # Our apps                                                                                                                                              'accounts',
    'catalog',                                                                                                                                              'cart',
]                                                                                                                                                       
Step 3: Verify                                                                                                                                          
uv run python manage.py check                                                                                                                           uv run python manage.py shell -c "from django.apps import appss.get_app_configs()][-4:])"
Expect no issues and ['corsheaders', 'accounts', 'catalog', 'cart'].                                                                                    
Don't commit yet. The app gets committed together with its models in the next lesson.                                                                   
---                                                                                                                                                     
✅ Checkpoint                                                                                                                                           
Paste the output of Step 3. If you have questions about any of the design decisions above (for example, why products are deleted from carts but will be kept in orders), ask them now, before they turn into code.

Next: Lesson 6.2, the cart models and migration. I write Cart te the migration, look at the unique and "quantity ≥ 1" rulesin the SQL, apply it, and register both models in the admin so you can see carts there.




Phase 6, Lesson 6.2: The cart models, migration, and admin

Checkpoint passed: ['corsheaders', 'accounts', 'catalog', 'cart']. (The usage: ... unrecognized arguments: . error was the trailing dot again. This time Django's argument parser caught it and told you exactly which argument it didn't understand.)

What & why

We turn the design from Lesson 6.1 into real tables and make carts visible in the admin, so you can inspect them before the API exists.

Files involved (written; check passes and the migration preview is correct)
backend/cart/
├── models.py   ← ✏️ Cart and CartItem
└── admin.py    ← ✏️ carts in the admin, with their items shown as a table inside each cart

What I wrote

Cart links to the user with a one-to-one field. It's like the ForeignKey you know from Product → Category, except the database also guarantees that no user can have two carts. I pointed it at settings.AUTH_USER_MODEL, which is the "refer to the user model through the setting" rule from Lesson 2.5, so it follows our custom accounts.User. The related name cart means you can write some_user.cart to reach a user's cart. It's set to be deleted together with the user.

CartItem has two ordinary foreign keys: one to its cart (so cart.items lists the items) and one to a product. Both use cascade deletion, meaning "if the parent row goes, remove this row too." That's the opposite choice from categories, which used PROTECT (Lesson 3.1), and it matches the design decision that deleting a product should remove it from carts. The quantity must be at least 1, checked twice, in the same two layers you saw for prices in Lesson 3.3: a validator for friendly error messages in forms and the API, and a database CHECK rule as the safety net. A second database rule, a unique constraint on (cart, product), makes it impossible to have the same product twice in one cart.

Two small calculated values, line_total on an item (price × quantity) and total on the cart (the sum of all lines), are written as properties: values computed on the fly each time you ask, never stored. That's how the cart always reflects the current product price. The total starts from Decimal('0.00'), so an empty cart shows 0.00 instead of a plain 0, and money stays in exact decimals (Lesson 3.1).

The admin shows each cart with its owner, number of items, and total. Opening a cart shows its items as a small inline table you can edit, with the same product search box you used for categories. I applied both performance lessons from Phase 3 right away: the item count is computed inside the same database query, with an explicit sort order (the GROUP BY ordering trap from Lesson 3.5), and all items and their products are loaded in one extra query, so the "total" column doesn't cause the N+1 problem (Lesson 3.6).

---

▶️ Your turn

cd "$env:USERPROFILE\OneDrive\Desktop\django-ecommerce\backend"

Step 1: Generate and inspect the migration

uv run python manage.py makemigrations cart
uv run python manage.py sqlmigrate cart 0001
In the SQL, find:
- "user_id" bigint NOT NULL UNIQUE: the one-to-one is simply a foreign key that must be unique
- "quantity" integer NOT NULL CHECK ("quantity" >= 0) and CONSTRAINT "cart_item_quantity_at_least_1" CHECK ("quantity" >= 1). The first comes automatically from "positive integer" and allows 0; the second is our stricter rule.
- CONSTRAINT "unique_product_per_cart" UNIQUE ("cart_id", "product_id")
- FOREIGN KEY ... REFERENCES "catalog_product" without any "ON DELETE CASCADE". Just like PROTECT in Lesson 3.3, Django performs cascades itself in Python, before it deletes the parent row.

Step 2: Apply it

uv run python manage.py migrate
→ Applying cart.0001_initial... OK

Step 3: Play with it in the admin

uv run python manage.py runserver
Open http://127.0.0.1:8000/admin/. There's a new CART section with Carts.
1. Add cart + → choose the user customer@example.com. In the Cart items table below, add two rows: Blue Ceramic Mug, quantity 2, and Gel Pen Set, quantity 1. Save and continue editing. The Total field now shows 32.99 (2 × 12.50 + 7.99), and each row shows its line total.
2. Duplicate test: add a third row with Blue Ceramic Mug again and save → "Please correct the duplicate data for product, which must be unique." The unique rule caught it before the database even had to.
3. Quantity test: set a quantity to 0 and save → "Ensure this value is greater than or equal to 1."
4. One cart per user: go back to Carts → Add cart +, choose customer@example.com again, and save → "Cart with this User already exists." That's the one-to-one rule.
5. The cart list shows customer@example.com | 2 | 32.99.

Step 4: Explore it in the shell, and watch the cascade

Stop the server (or use another window):
uv run python manage.py shell
from accounts.models import User
from catalog.models import Category, Product

customer = User.objects.get(email='customer@example.com')
cart = customer.cart
cart.items.all()
[(item.product.name, item.quantity, item.line_total) for item in cart.items.all()]
cart.total
- customer.cart goes from the user to their cart through the one-to-one link.
- The list shows each line with its total, and cart.total → Decimal('32.99').

Now create a throw-away product, put it in the cart, and delete the product:
temp = Product.objects.create(category=Category.objects.get(slug='kitchen'), name='Temporary Spoon', price='2.00', stock=5)
cart.items.create(product=temp, quantity=3)
cart.items.count()
cart.total
temp.delete()
cart.items.count()
cart.total
exit()
- After adding the spoon: 3 items and a total of 38.99.
- temp.delete() prints something like (2, {'catalog.Product': 1, 'cart.CartItem': 1}): Django deleted the product and, because of the cascade rule, the cart item pointing at it.
- Afterwards the cart is back to 2 items and 32.99.

Compare this with Lesson 3.6, where deleting a category that still had products raised ProtectedError. Same kind of relationship, opposite rule, chosen for a different business need.




Phase 6, Lesson 6.3: The cart API

Lesson 6.2 checkpoint passed. The SQL shows both UNIQUE ("cart_id", "product_id") and CHECK ("quantity" >= 1), and temp.delete() removed the product and its cart item ({'cart.CartItem': 1, 'catalog.Product': 1}). Commit 060ef0f is in.

What & why

The cart tables exist, but only the admin can use them. The React shop needs endpoints to view the cart, add products, change quantities, remove lines, and empty the cart. This lesson builds all five from the design in Lesson 6.1.

Files involved (written and tested)
backend/
├── cart/models.py        ← ✏️ small addition: each cart line can explain what's wrong with it ("issue")
├── cart/serializers.py   ← NEW: how a cart looks as JSON, plus the rules for adding and changing items
├── cart/views.py         ← ✏️ the endpoints
├── cart/urls.py          ← NEW: cart/, cart/items/, cart/items/<id>/
├── config/urls.py        ← ✏️ include the cart URLs under /api/
└── tools/api-helpers.ps1 ← NEW: Send-Json and a login helper, loaded with one command

What I built, in plain language

Every cart endpoint answers with the whole cart. Whether you add a product, change a quantity, or remove a line, the response is always the complete, updated cart: every line with its product details, its line total, a total piece count (for the little badge on the cart icon), and the cart total. That makes the React side simple. After any change it just replaces what's on screen with what the server sent back. The cart is created automatically the first time a customer uses any of these endpoints, as planned in Lesson 6.1.

"My cart" comes from the login token, never from the URL. Just like /api/auth/me/ in Lesson 5.2, /api/cart/ looks up the cart belonging to whoever the token says you are. Cart items do have ids in their URLs (/api/cart/items/5/), but the lookup only searches inside your own cart. If Bob tries to change the customer's item, he gets a 404, as if it didn't exist. That's the same "don't even reveal it exists" approach as hidden products in Lesson 4.3. All five endpoints require login, so anonymous visitors get 401.

Adding a product that's already in the cart raises its quantity. The add endpoint accepts a product id and an optional quantity (default 1). If the product is already in your cart, the existing line's quantity goes up, and the answer is 200. If it's new, a line is created, and the answer is 201, the status for "created" from Lesson 4.3. Only products that are visible in the shop can be added. A hidden product gives a clear message instead of a technical one.

Stock is checked at the moment you add or change a quantity. When adding, the check counts what's already in your cart plus what you're adding, so the message can say "Only 5 of "Chef Knife" in stock. You already have 3 in your cart." Out-of-stock products are refused, and changing a line to more than the stock is refused too. Each time, you get a 400 with a readable message, following our Lesson 4.2 rule that anything a customer can get wrong must be a 400, never a crash.

Problems that appear later are shown, not hidden. Stock can drop, or an admin can hide a product, after it's already in your cart. The cart then keeps the line but adds an issue message to it, like "This product is out of stock." or "Only 2 left in stock.", and sets has_issues: true on the cart. I put the logic that decides the message into the CartItem model itself, so the cart API now and the checkout in Phase 7 use exactly the same rules. Checkout will refuse a cart that has issues.

These views are written in a more manual style. For the catalog we used ViewSets, where the router generates everything (Lesson 4.3). The cart doesn't fit that pattern: there's no list of carts, no cart id in the URL, and "add" sometimes updates instead of creating. So I used DRF's basic APIView, where you write a method for each HTTP verb (get, post, patch, delete) and decide exactly what each one does. You now know three levels of DRF views: basic APIView (full control), generic views (Lessons 4.1 and 5.2), and ViewSets (Lesson 4.3). Real projects mix them, as ours now does.

Performance: loading a cart takes 4 database queries no matter how many items it has. The cart and all its items and products are loaded in groups, which avoids the N+1 problem from Lesson 3.6. I measured this with the customer's two-item cart.

The helper script: tools/api-helpers.ps1 contains Send-Json (from Lesson 5.2) and a new Get-AuthHeader that logs in and returns the Authorization header in one line. You load it into any PowerShell window with a single command (Step 1), instead of pasting functions each time.

What my test showed (inside a transaction that was undone afterwards):

┌─────────────────────────────────────────────────────────┬────────────────────────────────────────────────────────────────┐
│                         Action                          │                             Result                             │
├─────────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────┤
│ Anonymous GET /api/cart/                                │ 401                                                            │
├─────────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────┤
│ Bob's first GET                                         │ 200, empty cart, total 0.00                                    │
├─────────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────┤
│ Add Chef Knife ×2, then ×1 more                         │ 201 → quantity 2; then 200 → quantity 3 (same line)            │
├─────────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────┤
│ Add ×5 more                                             │ 400 Only 5 ... You already have 3 in your cart.                │
├─────────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────┤
│ Add Linen Cushion Cover / Discontinued mug / quantity 0 │ 400 out of stock / not available / at least 1                  │
├─────────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────┤
│ PATCH quantity 99, then 1                               │ 400 Only 5..., then 200                                        │
├─────────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────┤
│ Bob changes or deletes the customer's item              │ 404, 404                                                       │
├─────────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────┤
│ Knife stock set to 0 afterwards                         │ the line shows This product is out of stock., has_issues: true │
└─────────────────────────────────────────────────────────┴────────────────────────────────────────────────────────────────┘

One side effect: the final check I ran for the "not available" message created an empty cart for Bob (carts are created on first use), and it stayed. That's harmless, and he'd get one on first use anyway.

---

▶️ Your turn

Window 1:
cd "$env:USERPROFILE\OneDrive\Desktop\django-ecommerce\backend"
uv run python manage.py check
uv run python manage.py runserver

Step 1: Load the helpers and log in two customers (Window 2)

cd "$env:USERPROFILE\OneDrive\Desktop\django-ecommerce"
. .\tools\api-helpers.ps1
$bob  = Get-AuthHeader 'bob@example.com' 'Sunny-Garden-42'
$cust = Get-AuthHeader 'customer@example.com' 'YOUR_CUSTOMER_PASSWORD'
$knife = (Invoke-RestMethod "$api/products/chef-knife/").id
$mug   = (Invoke-RestMethod "$api/products/blue-ceramic-mug/").id
$linen = (Invoke-RestMethod "$api/products/linen-cushion-cover/").id
"knife=$knife mug=$mug linen=$linen"
The dot and space at the start of . .\tools\api-helpers.ps1 matter. They mean "run this script inside my current window," so the functions and $api stay available afterwards. Without the dot, the script runs in a separate scope and everything it defines disappears when it finishes. The last lines look up product ids by slug, so you don't have to remember numbers.

Step 2: Look at an empty cart, then fill it

Send-Json GET "$api/cart/"
Send-Json GET "$api/cart/" -Headers $bob
Send-Json POST "$api/cart/items/" @{ product_id = $knife; quantity = 2 } -Headers $bob
Send-Json POST "$api/cart/items/" @{ product_id = $knife } -Headers $bob
Send-Json POST "$api/cart/items/" @{ product_id = $mug; quantity = 4 } -Headers $bob
1. 401: no token
2. 200, Bob's empty cart: "items":[], "total":"0.00"
3. 201: Chef Knife, quantity 2, line_total 99.98
4. 200 (not 201): the same line, now quantity 3
5. 201: the mug is added as a second line; item_count is 7 and total is 199.97

Step 3: The rules

Send-Json POST "$api/cart/items/" @{ product_id = $knife; quantity = 5 } -Headers $bob
Send-Json POST "$api/cart/items/" @{ product_id = $linen } -Headers $bob
Send-Json POST "$api/cart/items/" @{ product_id = 999999 } -Headers $bob
Send-Json POST "$api/cart/items/" @{ product_id = $mug; quantity = 0 } -Headers $bob
All four are 400:
1. Only 5 of "Chef Knife" in stock. You already have 3 in your cart.
2. "Linen Cushion Cover" is out of stock.
3. This product does not exist or is no longer available.
4. Ensure this value is greater than or equal to 1.

Step 4: Change and remove lines

Get the line ids from Bob's cart first:
$cart = Invoke-RestMethod "$api/cart/" -Headers $bob
$cart.items | Select-Object id, @{n='product'; e={$_.product.name}}, quantity, line_total
$knifeLine = ($cart.items | Where-Object { $_.product.slug -eq 'chef-knife' }).id
$mugLine   = ($cart.items | Where-Object { $_.product.slug -eq 'blue-ceramic-mug' }).id
Send-Json PATCH "$api/cart/items/$knifeLine/" @{ quantity = 99 } -Headers $bob
Send-Json PATCH "$api/cart/items/$knifeLine/" @{ quantity = 1 } -Headers $bob
Send-Json DELETE "$api/cart/items/$mugLine/" -Headers $bob
→ 400 Only 5 of "Chef Knife" in stock., then 200 with the knife at quantity 1, then 200 with the mug line gone and the total 49.99.

Step 5: Nobody can touch another customer's cart

$custLine = (Invoke-RestMethod "$api/cart/" -Headers $cust).items[0].id
Send-Json PATCH "$api/cart/items/$custLine/" @{ quantity = 1 } -Headers $bob
Send-Json DELETE "$api/cart/items/$custLine/" -Headers $bob
Send-Json GET "$api/cart/" -Headers $cust
→ 404, 404, and the customer's cart is unchanged: still the 2 mugs and the gel pens from Lesson 6.2, total 32.99.

Step 6: A problem that appears after adding

As admin, hide the Chef Knife while it's in Bob's cart:
$admin = Get-AuthHeader 'subin@ontash.net' 'YOUR_ADMIN_PASSWORD'
Send-Json PATCH "$api/products/chef-knife/" @{ is_active = $false } -Headers $admin
(Invoke-RestMethod "$api/cart/" -Headers $bob) | Select-Object has_issues, total
(Invoke-RestMethod "$api/cart/" -Headers $bob).items | Select-Object quantity, issue
Send-Json PATCH "$api/products/chef-knife/" @{ is_active = $true } -Headers $admin
While the knife is hidden, Bob's cart still contains it, but has_issues is True and the line says This product is no longer available. The last line makes the knife visible again, and the issue disappears.

Step 7: Empty the cart

Send-Json DELETE "$api/cart/" -Headers $bob
→ 200 with an empty cart. Open Carts in the admin: Bob's cart still exists, with 0 items and a fresh updated at time.





🎉 Phase 6 (the cart) is complete. Every result matched: 201 then 200 for the same line, all four 400 messages, 404 for Bob touching the customer's cart, and the "no longer available" issue while the knife was hidden. Commit 7b92497 is in. The helper script already saved you a lot of typing.

What & why

A cart is only a wish list. When the customer clicks "Place order", the cart must become an order: a permanent record of what was bought, at what price, where to send it, and where it is in the delivery process. Orders are the most important data in a shop, because they're the business's history and its money. So the design rules here are stricter than for the cart. In this lesson we decide the design and you create the orders app. I'll write the models in the next lesson.

Files involved
backend/
├── orders/                ← NEW app: YOU create it with startapp (this lesson)
└── config/settings.py     ← YOU add 'orders' to INSTALLED_APPS (this lesson)

The design, in plain language

Two tables, like the cart: Order (one per checkout) and OrderItem (one per product in that order). An order belongs to one customer, and a customer can have many orders over time. That's one-to-many, unlike the cart's one-to-one.

An order is a snapshot, frozen at the moment of purchase. This is the biggest difference from the cart. The cart always shows today's price (Lesson 6.1). An order must show what the customer actually paid, forever, even if the admin changes the price tomorrow or deletes the product next year. So each order line copies the product's name and price at checkout time (product_name, unit_price) instead of reading them live. The order also stores its total amount and the shipping address as copies. If the customer later moves house, their old orders still show where those parcels actually went.

Orders are never lost when other things are deleted:

┌───────────────┬───────────────────────────────────────────────────────────────┬────────────────────────────────────────────────────────────────────┐
│  If this is   │                             …then                             │                                Why                                 │
│   deleted…    │                                                               │                                                                    │
├───────────────┼───────────────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────┤
│ A product     │ Its order lines stay. The link to the product becomes empty,  │ Sales history must survive catalogue changes. (This is the         │
│               │ but the copied name and price keep the line readable.         │ SET_NULL option from Lesson 3.1: "keep the row, clear the link.")  │
├───────────────┼───────────────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────┤
│ A customer    │ Refused while they have orders. You deactivate the account    │ The same PROTECT idea as categories with products (Lesson 3.4).    │
│ account       │ instead (is_active = False).                                  │ Deleting a customer must never erase sales records.                │
├───────────────┼───────────────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────┤
│ An order      │ Its lines go with it                                          │ A line without its order means nothing. (In practice orders are    │
│               │                                                               │ cancelled, not deleted.)                                           │
└───────────────┴───────────────────────────────────────────────────────────────┴────────────────────────────────────────────────────────────────────┘

Order status: a small, strict lifecycle.
                ┌──────────► cancelled ◄─────────┐
                │ (customer or admin)            │ (admin only, e.g. refund)
   pending ─────┴──► paid ──────► shipped ──────► delivered
  (at checkout)   (admin)        (admin)          (admin)
- Every order starts as pending.
- Only an admin moves it forward: pending → paid → shipped → delivered.
- A customer can cancel their own order only while it's pending. Once paid, only an admin can cancel, for example as a refund.
- delivered and cancelled are final.
- Anything else (like jumping from pending straight to delivered, or reopening a cancelled order) is refused with a clear 400 message. The allowed moves will be written down in one place in the code, so the API and the admin follow the same rules.

Stock moves with the order. At checkout, each product's stock goes down by the quantity ordered. That's the moment the goods are reserved for this customer. If the order is cancelled, the stock goes back up. (Changing to shipped or delivered doesn't touch stock again.)

Checkout is all-or-nothing. Placing an order involves several steps: check the cart has no issues, check stock once more, create the order, create its lines, reduce stock, empty the cart. If anything fails halfway, for example because another customer bought the last knife a second earlier, none of it may stay: no half-created order, no stock reduced for nothing. Databases guarantee this with a transaction, which you already met briefly in the seed command (Lesson 3.6). In Lesson 7.3 we'll also lock the product rows during checkout, so two customers can't both buy the last item at the same moment.

"Checkout basics": no real payment. Taking real payments (Stripe, PayPal) is a large topic of its own. In our shop, an order is created as pending, and an admin marks it paid, as if payment arrived by bank transfer. I'll show where a real payment step would plug in when we get there. The order confirmation email is sent in the background by Celery in Phase 8, triggered right after a successful checkout.

The endpoints we'll build (Lessons 7.3–7.4):

┌────────────────────────────────┬──────────────────┬──────────────────────────────────────────────────────┐
│            Endpoint            │       Who        │                         What                         │
├────────────────────────────────┼──────────────────┼──────────────────────────────────────────────────────┤
│ POST /api/orders/checkout/     │ customer         │ Turn my cart into an order (with a shipping address) │
├────────────────────────────────┼──────────────────┼──────────────────────────────────────────────────────┤
│ GET /api/orders/               │ customer / admin │ My orders / all orders (admins can filter by status) │
├────────────────────────────────┼──────────────────┼──────────────────────────────────────────────────────┤
│ GET /api/orders/<id>/          │ owner or admin   │ One order with its lines                             │
├────────────────────────────────┼──────────────────┼──────────────────────────────────────────────────────┤
│ POST /api/orders/<id>/cancel/  │ owner            │ Cancel my pending order (stock is returned)          │
├────────────────────────────────┼──────────────────┼──────────────────────────────────────────────────────┤
│ PATCH /api/orders/<id>/status/ │ admin            │ Move an order to its next status                     │
└────────────────────────────────┴──────────────────┴──────────────────────────────────────────────────────┘

Just like the cart, customers can only ever see their own orders. Another customer's order id gives 404.

---

▶️ Your turn

Step 1: Create the app

cd "$env:USERPROFILE\OneDrive\Desktop\django-ecommerce\backend"
uv run python manage.py startapp orders
Get-ChildItem orders

Step 2: Register it

In backend\config\settings.py, add 'orders', under our other apps:
    # Our apps
    'accounts',
    'catalog',
    'cart',
    'orders',
]

Step 3: Verify

uv run python manage.py check
uv run python manage.py shell -c "from django.apps import apps; print([a.label for a in apps.get_app_configs()][-4:])"
Expect no issues and ['accounts', 'catalog', 'cart', 'orders'].

Don't commit yet. It'll go in with the models.

---

✅ Checkpoint

Paste the Step 3 output. And if anything in the design seems odd (for example, why the order copies the product name even though it also links to the product), ask now, before it becomes code.

Next: Lesson 7.2, the order models and migration. I write Order and OrderItem with the status choices and allowed transitions. Then you migrate, see the price snapshot and the protection rules in action in the shell (including trying to delete a customer who has an order), and look at orders in the admin.

✻ Churned for 32s · done 5:54 PM



Phase 7, Lesson 7.2: The order models, migration, and admin

Checkpoint passed: ['accounts', 'catalog', 'cart', 'orders']. (Your first check ran from the project root, and again uv fell back to a Python 3.13 with no project. By now you recognise that message straight away.)

What & why

We turn the order design from Lesson 7.1 into tables, and prove the key promises in the shell: prices are frozen, order lines survive product deletion, and customers with orders can't be deleted.

Files involved (written; check passes and the migration preview is correct)
backend/orders/
├── models.py   ← ✏️ Order (with status choices + allowed transitions) and OrderItem
└── admin.py    ← ✏️ orders in the admin, read-only

What I wrote

Order has a link to the customer that refuses deletion of a customer who has orders (the PROTECT rule, the same as categories with products). It has a status field limited to five values: pending, paid, shipped, delivered, cancelled. These are written as a choices list, which gives the admin a dropdown, gives the API automatic validation, and shows nice labels like "Pending". New orders start as pending. Next to it is a small table of allowed transitions, exactly the diagram from Lesson 7.1 written as data ("from pending you may go to paid or cancelled", and so on), plus a helper that answers "is this status change allowed?" Having the rules in one place means the API, the admin actions, and the tests all use the same list. The order also stores the shipping address fields and the total amount as plain copies, and the database refuses a negative total.

OrderItem links to its order (deleted together with it) and to the product with the "clear the link, keep the row" rule (SET_NULL), so deleting a product never erases sales history. Next to that link it stores its own copies of the product's name and unit price. Its line total is calculated from the copied price, never the product's current one. That's the snapshot promise. Quantity must be at least 1, with the same two protection layers you've seen before.

The admin shows orders with their customer, status, number of lines, and total, with filters for status and date and a search box. The order lines appear inside each order, read-only. I also switched off "add order" and "delete order" in the admin completely. Orders must only be created by checkout, and a real shop never deletes them. Even the status is read-only for now: if you could freely pick any status from a dropdown, you could skip the rules (pending → delivered) and stock would never be returned on cancellation. In Lesson 7.4 we'll add proper admin buttons ("Mark as paid", "Mark as shipped", …) that follow the transitions.

---

▶️ Your turn

cd "$env:USERPROFILE\OneDrive\Desktop\django-ecommerce\backend"

Step 1: Generate and inspect the migration

uv run python manage.py makemigrations orders
uv run python manage.py sqlmigrate orders 0001
In the SQL, notice:
- "status" varchar(20) NOT NULL and a CREATE INDEX ... ("status"). The index makes "show me all pending orders" fast. But there's no rule in the database limiting status to our five values. Choices are enforced by Django (forms, API, admin), not by PostgreSQL. That's one more reason all status changes should go through our code.
- In orders_orderitem: "product_id" bigint NULL. NULL is allowed here, which is what makes "clear the link, keep the row" possible.
- CHECK ("total_amount" >= 0) and CHECK ("quantity" >= 1).

Step 2: Apply it

uv run python manage.py migrate

Step 3: Prove the design promises in the shell

Checkout doesn't exist yet (Lesson 7.3), so we'll create one order by hand, only to test the models. (By hand, stock isn't reduced. Checkout will handle that properly.)
uv run python manage.py shell
from decimal import Decimal
from accounts.models import User
from catalog.models import Category, Product
from orders.models import Order

customer = User.objects.get(email='customer@example.com')
teacup = Product.objects.create(category=Category.objects.get(slug='kitchen'), name='Temporary Teacup', price=Decimal('8.00'), stock=10)
order = Order.objects.create(user=customer, full_name='Test Customer', address='1 Test Street', city='Test City', postal_code='00000', country='Testland', total_amount=Decimal('16.00'))
order.items.create(product=teacup, product_name=teacup.name, unit_price=teacup.price, quantity=2)
order, order.status, order.get_status_display()
→ (<Order: Order #1>, 'pending', 'Pending'). The database stores pending, and get_status_display() gives the human label. Django creates that method automatically for every field with choices.

Promise 1: a price change doesn't touch the order.
teacup.price = Decimal('12.00')
teacup.save()
item = order.items.first()
item.unit_price, item.line_total, teacup.price
→ (Decimal('8.00'), Decimal('16.00'), Decimal('12.00')). The order still says 8.00 even though the product now costs 12.00.

Promise 2: deleting the product keeps the order line.
teacup.delete()
item.refresh_from_db()
item.product, item.product_name, item.unit_price
→ (None, 'Temporary Teacup', Decimal('8.00')). The link was cleared, and the copied name and price still tell you exactly what was bought. (refresh_from_db() reloads the line from the database, because the Python object in memory doesn't notice changes by itself, as you saw in Lesson 3.6.)

Promise 3: the status rules.
order.can_change_status_to('paid'), order.can_change_status_to('delivered'), order.can_change_status_to('cancelled')
→ (True, False, True). From pending you may go to paid or cancelled, but not straight to delivered.

Promise 4: customers with orders can't be deleted.
customer.delete()
→ ProtectedError: ("Cannot delete some instances of model 'User' because they are referenced through protected foreign keys: 'Order.user'.", ...). Nothing was deleted, not even the customer's cart.

Leave the shell open for Step 5.

Step 4: Look at it in the admin

In a second window, run uv run python manage.py runserver and open Orders in the admin:
- The list shows Order #1 | customer@example.com | Pending | 1 | 16.00, with By status and By created at filters, and a date bar across the top.
- There's no "Add order" button. Open the order: the status and total are read-only, the shipping address is editable (for typo fixes), and the line (Temporary Teacup, 8.00 × 2) is read-only, with no delete checkbox and no Delete button at the bottom.

Step 5: Clean up the test order

Back in the shell:
order.delete()
exit()
→ (2, {'orders.OrderItem': 1, 'orders.Order': 1}). The line went with its order (cascade). The admin can't delete orders, but the shell is a developer tool and can. The next real order will be #2 (IDs aren't reused, Lesson 3.4).




Phase 7, Lesson 7.3: Checkout

Lesson 7.2 checkpoint passed: the price stayed 8.00 after the product went to 12.00, the order line survived with the name Temporary Teacup after the product was deleted, and the customer couldn't be deleted while they had an order. Commit 742d679 is in.

What & why

When a customer presses "Place order", their cart has to become an order. That sounds like one action, but it's really several steps that must all happen together:
1. check that the cart isn't empty
2. check that every product is still for sale and there's enough of it
3. write down the order with today's prices
4. take the sold items out of stock
5. empty the cart

Two things can go wrong, and checkout must handle both.

Something breaks in the middle. Imagine the order is written down, but the computer crashes before the stock is reduced. Now the shop has an order but still "has" the items, and could sell them twice. Or the stock is reduced, but no order exists, so the items are simply lost. Checkout must be all or nothing: either every step succeeds, or it's as if the customer never pressed the button.

Two customers want the last item at the same moment. There's one cutting board left. Bob and Ana both have it in their carts, and they press "Place order" within the same split second. Both checks run at nearly the same time, both see "1 in stock", both succeed, and the shop has sold one board twice. This is called a race condition: the result depends on who wins a race that neither can see. It's rare, but in a busy shop it will happen, typically on the most popular product during a sale.

What happens now when a customer checks out

1. Their cart is "held." While one checkout is running for a customer, any second checkout for the same customer (a double click, or the shop open in two browser tabs) has to wait. When it gets its turn, the cart is already empty, so it's refused with "Your cart is empty." A double click can never create two orders.
2. The products being bought are "held." Nobody else can buy these particular products until this checkout finishes. If Ana's checkout arrives while Bob's is running, Ana's simply waits a few milliseconds. Only then does it look at the stock, and it sees the number after Bob's purchase. The products are always held in the same fixed order, so two checkouts can never end up each waiting for the other forever.
3. Stock and availability are checked again, using those fresh numbers. The stock check when adding to the cart (Lesson 6.3) isn't enough, because hours may have passed since then. If anything is wrong, checkout stops and lists every problem at once, for example "Only 1 of "Chef Knife" in stock, but your cart has 2." Nothing is changed, and the cart stays exactly as it was, so the customer can fix it.
4. The order is written down, with each product's name and price copied (the snapshot from Lesson 7.2) and the total calculated from those copied prices. It starts as pending.
5. Stock is reduced by the quantities bought. As a last safety net, the database itself refuses negative stock (Lesson 3.3).
6. The cart is emptied.
7. Only now is everything saved, all at once. If any step above fails, even an unexpected crash, every change is undone together: no order, no stock change, and the cart is untouched. Holding the cart and products ends at this moment too, and waiting checkouts continue.

The customer gets the finished order back (number, status, lines, total, address). If checkout was refused, they get a clear list of problems instead.

Where real payment would go: in a real shop, a payment step (for example Stripe) would happen here, and the order would become paid when the payment company confirms it. In our shop, orders stay pending until an admin marks them paid (Lesson 7.4). The confirmation email is added in Phase 8 and sent in the background right after a successful checkout.

What I added

- The checkout logic itself, in its own file in the orders app, separate from the web part. That way the same logic can be used by the API now and by tests later (Phase 9).
- The checkout endpoint: POST /api/orders/checkout/. You send the shipping address (name, address, city, postal code, country, and optionally a phone number) and get the new order back.
- A race demo script (tools/race_demo.py) that makes Bob and Ana press "Place order" for the last cutting board at exactly the same instant, so you can watch the protection work.

What my tests showed (all test data was removed afterwards):

┌──────────────────────────────────────────────────────────────┬─────────────────────────────────────────────────────────────────────────────────────┐
│                             Test                             │                                       Result                                        │
├──────────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
│ Empty cart                                                   │ refused: Your cart is empty.                                                        │
├──────────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
│ Address fields missing                                       │ refused, listing every missing field                                                │
├──────────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
│ 2 knives in the cart, only 1 in stock                        │ refused, with the cart and stock unchanged                                          │
├──────────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
│ A crash simulated halfway, right after the order was written │ nothing saved: 0 orders, same stock, same cart                                      │
├──────────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
│ A normal checkout (2 knives + 3 mugs)                        │ order created as Pending, total 137.48, stock went down 5→3 and 20→17, cart emptied │
├──────────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
│ Bob and Ana buying the last board at the same instant        │ Bob got the order; Ana was told Only 0 ... in stock; stock ended at 0, never −1     │
└──────────────────────────────────────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘

My tests used up some order numbers, so your first real order will probably be #5 (numbers are never reused, Lesson 3.4).

---

▶️ Your turn

Window 1:
cd "$env:USERPROFILE\OneDrive\Desktop\django-ecommerce\backend"
uv run python manage.py check
uv run python manage.py runserver

Window 2:
cd "$env:USERPROFILE\OneDrive\Desktop\django-ecommerce"
. .\tools\api-helpers.ps1
$bob   = Get-AuthHeader 'bob@example.com' 'Sunny-Garden-42'
$admin = Get-AuthHeader 'subin@ontash.net' 'YOUR_ADMIN_PASSWORD'
$knife = (Invoke-RestMethod "$api/products/chef-knife/").id
$mug   = (Invoke-RestMethod "$api/products/blue-ceramic-mug/").id
$ship  = @{ full_name = 'Bob Builder'; address = '5 Hammer Lane'; city = 'Test City'; postal_code = '12345'; country = 'Testland' }

Step 1: The refusals

Send-Json DELETE "$api/cart/" -Headers $bob | Out-Null
Send-Json POST "$api/orders/checkout/" $ship -Headers $bob
Send-Json POST "$api/orders/checkout/" @{ full_name = 'Bob' } -Headers $bob
1. 400 ... "problems":["Your cart is empty."]
2. 400, listing address, city, postal_code, and country as required

Now put 2 knives in the cart, and then (as admin) lower the stock to 1 after they were added. That's the "hours passed since adding" situation:
Send-Json POST "$api/cart/items/" @{ product_id = $knife; quantity = 2 } -Headers $bob | Out-Null
Send-Json POST "$api/cart/items/" @{ product_id = $mug; quantity = 3 } -Headers $bob | Out-Null
Send-Json PATCH "$api/products/chef-knife/" @{ stock = 1 } -Headers $admin | Out-Null
Send-Json POST "$api/orders/checkout/" $ship -Headers $bob
(Invoke-RestMethod "$api/cart/" -Headers $bob).item_count
→ 400 ... "Only 1 of \"Chef Knife\" in stock, but your cart has 2." Bob's cart still has all 5 pieces. Nothing was touched.

Step 2: A successful checkout

Put the stock back and try again:
Send-Json PATCH "$api/products/chef-knife/" @{ stock = 5 } -Headers $admin | Out-Null
$order = Invoke-RestMethod -Method Post -Uri "$api/orders/checkout/" -Headers $bob -ContentType 'application/json' -Body ($ship | ConvertTo-Json)
$order | Select-Object id, status, status_display, total_amount, full_name, city
$order.items | Select-Object product_name, unit_price, quantity, line_total
→ a new order (probably #5) with status Pending and total 137.48: 2 × 49.99 + 3 × 12.50.

Now check the three side effects:
(Invoke-RestMethod "$api/products/chef-knife/").stock
(Invoke-RestMethod "$api/products/blue-ceramic-mug/").stock
(Invoke-RestMethod "$api/cart/" -Headers $bob).item_count
→ 3, 17, 0. The stock went down, and the cart is empty. In the admin (Orders) you'll see Bob's order, with its lines and the address.

Step 3: A double click can't create two orders

The cart is empty now, so pressing "Place order" again changes nothing:
Send-Json POST "$api/orders/checkout/" $ship -Headers $bob
→ 400 ... "Your cart is empty."

Step 4: The race, live

Let Bob and Ana fight over the last cutting board:
uv run --project backend python tools/race_demo.py
It asks for your admin password (typing is hidden), then shows every step:
"Bamboo Cutting Board" has 30 in stock. Setting it to 1 (the last one).
Bob puts the last one in the cart -> 201
Ana puts the last one in the cart -> 201

Both customers press "Place order" at the same moment...

Bob: 201 -> order #6 created, total 18.00
Ana: 400 -> ['Only 0 of "Bamboo Cutting Board" in stock, but your cart has 1.']

Stock now: 0 (never negative, sold exactly once).
Stock restored to 29 (30 minus the one really sold).
Who wins is random. Run it a few times, and sometimes Ana gets the board. But there's always exactly one winner, and stock never goes below 0. (--project backend tells uv to use the backend's Python environment even though you're in the project root.)

After each run, the loser still has the board in their cart. That's proof the refused checkout left their cart alone. And each run creates a real pending order for the winner, which you'll be able to cancel in the next lesson.

Step 5: Commit

git status
git add backend tools
git commit -m "Checkout: all-or-nothing order creation with product locking; race condition demo"

---

❓ If something goes wrong

┌─────────────────────────────────────────────┬──────────────────────────────────────────────────┬───────────────────────────────────────────────────┐
│                What you see                 │                       Why                        │                        Fix                        │
├─────────────────────────────────────────────┼──────────────────────────────────────────────────┼───────────────────────────────────────────────────┤
│ 404 for /api/orders/checkout/               │ The orders web addresses aren't connected        │ config/urls.py must include orders.urls (restart  │
│                                             │                                                  │ the server if it didn't reload)                   │
├─────────────────────────────────────────────┼──────────────────────────────────────────────────┼───────────────────────────────────────────────────┤
│ The race demo stops with Login failed for   │ Ana's password differs from Lesson 5.2           │ Use the password you registered her with (it's    │
│ ana.silva@example.com                       │                                                  │ written at the top of the script)                 │
├─────────────────────────────────────────────┼──────────────────────────────────────────────────┼───────────────────────────────────────────────────┤
│ The race demo: both customers get 400       │ The board's stock was already 0 before the demo, │ Set the board's stock in the admin and run it     │
│                                             │  or someone's cart had more than 1               │ again                                             │
├─────────────────────────────────────────────┼──────────────────────────────────────────────────┼───────────────────────────────────────────────────┤
│ Invoke-RestMethod : (400) Bad Request in    │ The cart had a problem (for example, stock is    │ Use Send-Json to see the problems list            │
│ Step 2                                      │ still 1)                                         │                                                   │
└─────────────────────────────────────────────┴──────────────────────────────────────────────────┴───────────────────────────────────────────────────┘

---

✅ Checkpoint

Paste:
1. the 400 message from Step 1 about the knife,
2. the order summary and lines from Step 2, and
3. the output of one race demo run.

Next: Lesson 7.4, managing orders. Customers can see their order history and cancel pending orders (stock goes back automatically), and admins get "Mark as paid / shipped / delivered / cancelled" actions that only allow the moves from the status diagram.


Phase 7, Lesson 7.4: Managing orders (history, cancelling, and status changes)

Lesson 7.3 checkpoint passed. The knife problem was refused, order #5 was created for 137.48 with stock 5→3 and 20→17, and the race was won once by Ana and once by Bob, with stock never below 0. That's exactly the point: the winner is random, but there's always exactly one. Commit f92df12 is in.

What & why

Orders now exist, but nobody can do anything with them. Customers can't see their past orders or change their mind, and the shop can't record that an order was paid, sent, or arrived. This lesson adds the day-to-day order handling:
- Customers can see a list of their own orders, open any one of them, and cancel an order while it's still waiting for payment. The cancelled items go straight back on the shelf.
- Admins can see every order, filter them by status (for example "everything waiting to be shipped"), and move orders along: paid → shipped → delivered, or cancelled if needed. They can do this from the API (for the React admin screens later) and with buttons in the Django admin.
- Every status change follows the status diagram from Lesson 7.1. Anything else is refused with a message explaining why.

What happens now

Seeing orders. A customer's order list shows only their own orders, newest first, split into pages like the product list. They can open any of their orders to see the lines, prices, and address, but another customer's order number gives "not found", just like the cart. Admins see everyone's orders, including the customer's email, and can narrow the list to one status or sort by amount.

A customer cancels an order. This is only possible while the order is pending (not yet paid). When it happens:
1. The order is marked cancelled.
2. Every item on it goes back into stock. If Bob cancels 2 knives, the knife stock goes up by 2.

Once the order is paid or later, the customer is told "This order is already paid and can no longer be cancelled. Please contact us." From then on, only the shop can cancel it, for example to give a refund.

The double-click problem again. What if Bob clicks "Cancel" twice very quickly, or Bob and an admin cancel the same order at the same moment? Without protection, both could see "pending", and both could return the stock, so 2 knives would come back twice. That's the same kind of race as the last cutting board in Lesson 7.3, and it's solved the same way: while one cancellation is being handled, the order is held, and the second request has to wait. When it gets its turn, the order is already cancelled, so it's refused. Stock is only ever returned once.

An admin moves an order along. The admin chooses the next status, and the shop checks it against the diagram:
- pending → paid ✅, paid → shipped ✅, shipped → delivered ✅
- pending → delivered ❌ (can't skip steps)
- delivered → cancelled ❌ (delivered and cancelled are final)
- paid → cancelled ✅ (the shop can still cancel before shipping, and the stock goes back)

Customers can't change statuses at all: they're refused as "not allowed", and the only thing they can do is cancel their own pending order.

In the Django admin, the order list now has four actions: Mark as paid, Mark as shipped, Mark as delivered, and Cancel. You can select several orders at once. Each order is checked separately: the ones that are allowed to move are moved, and for each one that isn't, a yellow warning explains why, for example "Order #6: An order that is pending cannot be changed to delivered." Every successful change is also written into that order's History. In Lesson 3.5 you saw that bulk actions didn't leave any history. Here I chose the slower, one-by-one way on purpose, because for orders, knowing who changed what and when really matters.

What I added: the order list, order detail, cancel, and status-change endpoints; the admin actions; and one shared piece of logic for "change an order's status" that the API and the admin both use. So there's exactly one set of rules, the one from Lesson 7.1.

What my tests showed (undone afterwards):

┌───────────────────────────────┬─────────────────────────────────────────────────────────────────────────┐
│             Test              │                                 Result                                  │
├───────────────────────────────┼─────────────────────────────────────────────────────────────────────────┤
│ Bob's order list              │ his 2 orders (#7, #5); Ana opening Bob's #5 → not found; no login → 401 │
├───────────────────────────────┼─────────────────────────────────────────────────────────────────────────┤
│ Bob cancels #5                │ cancelled; knife stock 3 → 5                                            │
├───────────────────────────────┼─────────────────────────────────────────────────────────────────────────┤
│ Bob cancels #5 again          │ refused: already cancelled                                              │
├───────────────────────────────┼─────────────────────────────────────────────────────────────────────────┤
│ Bob tries to set a status     │ 403, not allowed                                                        │
├───────────────────────────────┼─────────────────────────────────────────────────────────────────────────┤
│ Admin: #7 pending → delivered │ refused: pending cannot be changed to delivered                         │
├───────────────────────────────┼─────────────────────────────────────────────────────────────────────────┤
│ Admin: #7 → paid → shipped    │ ✅; then Bob tries to cancel → already shipped ... Please contact us.   │
├───────────────────────────────┼─────────────────────────────────────────────────────────────────────────┤
│ Admin: delivered → cancelled  │ refused: delivered cannot be changed to cancelled                       │
└───────────────────────────────┴─────────────────────────────────────────────────────────────────────────┘

---

▶️ Your turn

Right now you have three pending orders: #5 (Bob: 2 knives + 3 mugs), #6 (Ana: 1 board), and #7 (Bob: 1 board).

Window 1:
cd "$env:USERPROFILE\OneDrive\Desktop\django-ecommerce\backend"
uv run python manage.py check
uv run python manage.py runserver

Window 2:
cd "$env:USERPROFILE\OneDrive\Desktop\django-ecommerce"
. .\tools\api-helpers.ps1
$bob   = Get-AuthHeader 'bob@example.com' 'Sunny-Garden-42'
$ana   = Get-AuthHeader 'ana.silva@example.com' 'Sunny-Garden-42'
$admin = Get-AuthHeader 'subin@ontash.net' 'YOUR_ADMIN_PASSWORD'

Step 1: Order history, and privacy

(Invoke-RestMethod "$api/orders/" -Headers $bob).results | Select-Object id, status_display, total_amount, created_at
(Invoke-RestMethod "$api/orders/" -Headers $ana).results | Select-Object id, status_display, total_amount
Send-Json GET "$api/orders/5/" -Headers $ana
(Invoke-RestMethod "$api/orders/?status=pending" -Headers $admin).count
1. Bob sees #7 and #5, newest first.
2. Ana sees only #6.
3. Ana opening Bob's order → 404.
4. The admin sees 3 pending orders from all customers.

Step 2: Bob cancels an order, and the stock comes back

(Invoke-RestMethod "$api/products/chef-knife/").stock
(Invoke-RestMethod "$api/products/blue-ceramic-mug/").stock
Send-Json POST "$api/orders/5/cancel/" -Headers $bob
(Invoke-RestMethod "$api/products/chef-knife/").stock
(Invoke-RestMethod "$api/products/blue-ceramic-mug/").stock
Send-Json POST "$api/orders/5/cancel/" -Headers $bob
→ before: 3 and 17. The cancel returns the order with "status":"cancelled". After: 5 and 20, so both products are back. The second cancel → 400 ... already cancelled ....

Step 3: The admin moves Bob's order #7 along

Send-Json PATCH "$api/orders/7/status/" @{ status = 'paid' } -Headers $bob
Send-Json PATCH "$api/orders/7/status/" @{ status = 'delivered' } -Headers $admin
Send-Json PATCH "$api/orders/7/status/" @{ status = 'paid' } -Headers $admin
Send-Json PATCH "$api/orders/7/status/" @{ status = 'shipped' } -Headers $admin
Send-Json POST "$api/orders/7/cancel/" -Headers $bob
1. Bob → 403: customers can't change statuses.
2. pending → delivered → 400 ... cannot be changed to delivered.
3. → paid ✅
4. → shipped ✅
5. Bob tries to cancel his shipped order → 400 ... already shipped and can no longer be cancelled. Please contact us.

Step 4: The admin buttons, including a refused move

Open http://127.0.0.1:8000/admin/ → Orders.
1. Tick #6 (pending) and #7 (shipped), choose "Mark selected orders as delivered", and click Go. You'll see a green message "1 order(s) changed to delivered." (#7) and a yellow warning "Order #6: An order that is pending cannot be changed to delivered." Each order was checked on its own.
2. Tick #6, choose "Cancel selected orders (returns stock)", and click Go. It's cancelled, and the cutting board's stock goes back up by 1. Check with (Invoke-RestMethod "$api/products/bamboo-cutting-board/").stock in Window 2. It was 28 after the two race demos, and it's 29 now.
3. Open order #7 → History (top right). You'll see "Status changed to delivered.", with your admin account and the time.
4. Try the By status filter on the right: Cancelled shows #5 and #6, and Delivered shows #7.



when Redis is down (I cleaned up both test orders). Here's the lesson.

Phase 8, Lesson 8.1: Background jobs, part 1 (queuing the confirmation email)

Lesson 7.4 checkpoint passed. Bob's cancel returned the stock (3→5 knives, 17→20 mugs), cancelling twice was refused, Bob couldn't change a status, pending→delivered was refused, paid→shipped worked, and Bob couldn't cancel a shipped order. Commit 47ec44e is in. (You skipped the admin-buttons step. That's fine; you can try it any time.)

🎉 Phase 7 is complete. Now Phase 8: background jobs.

What & why

When a customer places an order, they should receive a confirmation email. The obvious approach is to send it during checkout, before answering the customer. But sending an email means talking to a mail server somewhere on the internet, which can take a second or two, sometimes much longer, and sometimes fails. The customer would stare at a spinning "Placing order…" button, and if the mail server is down, their checkout might even fail, although nothing is wrong with their order.

Real shops split the work instead:
1. Checkout writes a short note, "send the confirmation for order #10", into a waiting line, and answers the customer immediately.
2. A separate helper program, the worker, keeps watching that line, picks up each note, and does the slow work (sending the email) on its own time. If sending fails, it tries again later.

The customer's checkout stays fast and reliable, and slow or unreliable work happens in the background. The same idea is used for things like resizing images, generating invoices, or sending shipping notifications.

In our project:
- The waiting line is Redis, the small program already running in Docker since Phase 1.
- The worker is Celery, a widely used tool for exactly this job.

In this lesson we make checkout put notes into the line, and we look at them waiting there. In the next lesson we start the worker in Docker and watch it pick them up.

What happens now when a customer places an order

1. Checkout runs exactly as in Lesson 7.3: everything is saved together, or nothing is.
2. Only after the order is really saved, a note is put into Redis: "send the confirmation for order #N". Why wait for the save?
   - If checkout failed and everything was undone, there's no order, so no email may be sent about it.
   - The worker is fast. If the note were added before the save finished, the worker could pick it up and look for an order that isn't in the database yet.

   Waiting until after the save avoids both problems.
3. The customer gets their answer right away. Adding the note takes a fraction of a second: my test checkout took 0.3 seconds in total.
4. Later, the worker reads the order and "sends" the email. In development, emails are printed on the screen instead of really being sent, so you'll see the whole email text in the worker's output, and nobody receives test emails by accident. Switching to a real mail service later is only a settings change.
5. If sending fails (for example, the mail server is unreachable), the worker tries again, waiting a little longer each time (1, 2, 4… seconds), up to 5 times.

What if Redis itself is down? I tested that too, by pointing the shop at a Redis that doesn't exist. The order still succeeds. The customer never loses an order because of an email problem. The failure is written to the server's error log. But there are two honest limitations:
- that checkout took about 4 seconds, because the shop kept retrying to reach Redis before giving up
- that email is lost

Big shops avoid losing it by first recording "email still to send" in the database itself. That's more than we need here, but worth knowing about.

What I added

- The Celery setup for the project: it tells Celery where Redis is, and lets it find background jobs in any app.
- The "send order confirmation" job in the orders app. It builds a plain-text email with the order number, each line, the total, and the shipping address, and sends it to the customer.
- Checkout now adds that job to the waiting line after a successful save.
- Settings in .env for the Redis address and for "print emails instead of sending them", plus the sender name ShopLite orders@shoplite.local.

---

▶️ Your turn

Step 1: Install Celery with its Redis support (Window 1)

cd "$env:USERPROFILE\OneDrive\Desktop\django-ecommerce\backend"
uv add "celery[redis]"
uv run python manage.py check
uv run python manage.py runserver
- Expect celery 5.6.3, redis 6.4.0, and several helper packages that Celery needs (kombu, billiard, vine, …). Celery brings along everything it needs to talk to Redis.
- The quotes around celery[redis] stop PowerShell from misreading the square brackets, just like psycopg[binary] in Lesson 2.1.
- check → no issues.

Step 2: Look at the empty waiting line (Window 2)

cd "$env:USERPROFILE\OneDrive\Desktop\django-ecommerce"
docker compose exec redis redis-cli LLEN celery
→ (integer) 0. celery is the name of the waiting line inside Redis, and LLEN asks how many notes are in it.

Step 3: Place an order and watch a note appear

. .\tools\api-helpers.ps1
$ana = Get-AuthHeader 'ana.silva@example.com' 'Sunny-Garden-42'
$pen = (Invoke-RestMethod "$api/products/gel-pen-set/").id
$ship = @{ full_name = 'Ana Silva'; address = '12 Garden Road'; city = 'Test City'; postal_code = '54321'; country = 'Testland' }

Send-Json DELETE "$api/cart/" -Headers $ana | Out-Null
Send-Json POST "$api/cart/items/" @{ product_id = $pen; quantity = 2 } -Headers $ana | Out-Null
Measure-Command { $script:order = Invoke-RestMethod -Method Post -Uri "$api/orders/checkout/" -Headers $ana -ContentType 'application/json' -Body ($ship | ConvertTo-Json) } | Select-Object TotalSeconds
$order.id
docker compose exec redis redis-cli LLEN celery
- Measure-Command shows the checkout still answers in well under a second.
- $order.id is probably 10 (my two test orders used up 8 and 9).
- LLEN is now (integer) 1. One note is waiting.

Look at the note itself:
docker compose exec redis redis-cli LRANGE celery 0 -1
It's a long line of text. Look for "task": "orders.tasks.send_order_confirmation" (which job to run) and "argsrepr": "(10,)" (for which order). That's everything the worker needs to know.

Step 4: A failed checkout adds nothing

Send-Json POST "$api/orders/checkout/" $ship -Headers $ana
docker compose exec redis redis-cli LLEN celery
→ 400 ... Your cart is empty., and the line still holds 1. No order, so no email.

Step 5: Place one more order

Send-Json POST "$api/cart/items/" @{ product_id = $pen } -Headers $ana | Out-Null
Send-Json POST "$api/orders/checkout/" $ship -Headers $ana | Out-Null
docker compose exec redis redis-cli LLEN celery
→ (integer) 2. There's no worker yet, so nobody is processing the line, and the notes simply wait. They're safe there. In the next lesson, the worker starts and picks up both.

Step 6: Commit

git status
git add backend
git commit -m "Celery setup; queue order confirmation email after checkout commits"

---

❓ If something goes wrong

┌───────────────────────────────────────┬─────────────────────────────────────────────────┬───────────────────────────────────────────────────────────┐
│             What you see              │                       Why                       │                            Fix                            │
├───────────────────────────────────────┼─────────────────────────────────────────────────┼───────────────────────────────────────────────────────────┤
│ ModuleNotFoundError: No module named  │ uv add not run, or run in the wrong folder      │ Step 1, from backend\                                     │
│ 'celery'                              │                                                 │                                                           │
├───────────────────────────────────────┼─────────────────────────────────────────────────┼───────────────────────────────────────────────────────────┤
│ LLEN stays 0 after a successful order │ Redis isn't reachable from Django, or the       │ docker compose ps (redis must be healthy); restart        │
│                                       │ server is still running old code                │ runserver; look for an error in Window 1                  │
├───────────────────────────────────────┼─────────────────────────────────────────────────┼───────────────────────────────────────────────────────────┤
│ Checkout suddenly takes about 4       │ Redis is stopped                                │ docker compose start redis                                │
│ seconds                               │                                                 │                                                           │
├───────────────────────────────────────┼─────────────────────────────────────────────────┼───────────────────────────────────────────────────────────┤
│ Error: No such container from docker  │ You're not in the project root, or Docker       │ cd to the project root; start Docker Desktop              │
│ compose exec                          │ Desktop isn't running                           │                                                           │
└───────────────────────────────────────┴─────────────────────────────────────────────────┴───────────────────────────────────────────────────────────┘

---

✅ Checkpoint

Paste:
1. the uv add lines showing celery and redis,
2. the checkout time from Step 3 and the order number, and
3. the three LLEN results (Steps 3, 4 and 5).

Next: Lesson 8.2, the worker in Docker. We build a Docker image of our backend (installed with uv, just like on Windows), add a worker next to PostgreSQL and Redis, start it, and watch it pick up the two waiting notes and print the two confirmation emails.

✻ Sautéed for 2m 53s · done 8:04 PM




Quick status: the worker image builds, and inside the container it can reach the database and Redis. I checked this without starting the worker, so your two waiting emails are still in the line for you to watch. Here's the lesson.

Phase 8, Lesson 8.2: The worker in Docker

Lesson 8.1 checkpoint passed: checkout took 0.64 s, the note for order #10 appeared in Redis (you can see "task": "orders.tasks.send_order_confirmation" and "argsrepr": "(10,)" in it), the failed checkout added nothing, and the second order brought the line to 2. Commit 1d71fb2 is in.

What & why

Two confirmation emails are waiting in Redis, and nobody is picking them up. We need the worker: a program that keeps watching the line and does each job. We decided in the plan to run it inside Docker, next to PostgreSQL and Redis, because that's how it would run on a real server. It also avoids the fact that Celery doesn't officially support Windows. So we need two things:
1. A recipe for a container that contains Python and our backend with all its packages (the same ones, in the same versions, as on your Windows machine)
2. An entry in our Docker setup that starts that container as the worker

What happens now

- Building the container. Docker follows the recipe:
  a. start from a small Linux system that already has Python 3.12
  b. add uv
  c. install exactly the package versions listed in uv.lock, the same list your Windows setup uses (Lesson 2.1), so the worker and Django always run identical code libraries
  d. copy in the backend code

  Installing packages is the slow part, so Docker remembers that step and only repeats it when your package list changes. Rebuilding after a code change takes seconds. Your Windows .venv, uploaded images, and .env secrets are left out of the container on purpose. The container gets its own Linux environment instead.
- Starting the worker. When you run docker compose up, the worker waits until PostgreSQL and Redis report healthy (the health checks from Lesson 1.2), then connects to Redis and starts picking up notes. It handles up to two jobs at the same time.
- How the worker finds the database and Redis. On Windows, Django reaches them through localhost and the forwarded ports (5433 and 6379, Lesson 1.1). Inside Docker, containers talk to each other directly by service name: the worker reaches the database at db and Redis at redis. So the worker gets those two addresses as its own settings, and they take priority over the Windows values in backend/.env. That's the "real environment wins over .env" rule from Lesson 2.3, which we prepared for back then. Everything else, like the secret key and database password, it reads from the same .env.
- Your code folder is shared with the worker. The container reads the backend code straight from your folder, so you don't need to rebuild the container after changing code. But the worker only reads the code when it starts, so after changing a background job, restart the worker. Only a change to the package list (uv add ...) needs a rebuild.
- What the worker does for each note: it takes the note out of the line, loads the order from PostgreSQL, builds the email, and "sends" it. In development that means printing it into the worker's log, which you'll read with docker compose logs. If something goes wrong, it retries later (Lesson 8.1).
- For safety, the worker runs as a normal user inside the container, not as the all-powerful administrator account, so a bug in a job can't damage the container's system.

What I added

- backend/Dockerfile: the recipe for the worker container
- backend/.dockerignore: the list of things that must not go into the container (.venv, media, .env, …)
- A worker entry in docker-compose.yml, next to db and redis

I built the container and ran a one-time check inside it, without starting the worker:
- Python 3.12.14 ✓
- Celery installed ✓
- Django's system check passes ✓
- it can reach the database (orders [X] 0001_initial) ✓
- it sees DB_HOST=db and CELERY_BROKER_URL=redis://redis:6379/0 ✓
- your two notes are still waiting ✓

---

▶️ Your turn

The API should still be running in Window 1 (runserver). Use Window 2 from the project root:
cd "$env:USERPROFILE\OneDrive\Desktop\django-ecommerce"

Step 1: Start the worker, and watch it catch up on the waiting emails

docker compose exec redis redis-cli LLEN celery
docker compose up -d --build worker
docker compose logs -f worker
- LLEN → 2, the two waiting notes.
- up -d --build worker builds the container (quick, because I already built it once and Docker remembers the slow steps) and starts it in the background.
- logs -f shows the worker's output and keeps following it. You'll see:
  a. Celery's start-up banner, with transport: redis://redis:6379/0 (it found Redis by its service name) and [tasks] . orders.tasks.send_order_confirmation (it found our job)
  b. celery@... ready.
  c. Two blocks like this, one per waiting note:
Task orders.tasks.send_order_confirmation[a0e08523-...] received
Content-Type: text/plain; charset="utf-8"
Subject: ShopLite order #10 confirmation
From: ShopLite <orders@shoplite.local>
To: ana.silva@example.com
...
Hi Ana Silva,

Thank you for your order #10! ...
  2 x Gel Pen Set @ 7.99 = 15.98

  Total: 15.98
...
Task orders.tasks.send_order_confirmation[...] succeeded in 0.05s: 'Confirmation for order #10 sent to ana.silva@example.com'
     The second block is the same for order #11.

Press Ctrl+C to stop following the log. The worker itself keeps running in the background.

docker compose exec redis redis-cli LLEN celery
docker compose ps
→ 0, so the line is empty. And docker compose ps now shows three services: db, redis, and worker.

Step 2: A new order, live

Open a third window and follow the worker's log there:
cd "$env:USERPROFILE\OneDrive\Desktop\django-ecommerce"
docker compose logs -f --tail 0 worker
(--tail 0 means "show only new lines from now on.")

In Window 2, Bob places an order:
. .\tools\api-helpers.ps1
$bob  = Get-AuthHeader 'bob@example.com' 'Sunny-Garden-42'
$mug  = (Invoke-RestMethod "$api/products/blue-ceramic-mug/").id
$ship = @{ full_name = 'Bob Builder'; address = '5 Hammer Lane'; city = 'Test City'; postal_code = '12345'; country = 'Testland' }
Send-Json POST "$api/cart/items/" @{ product_id = $mug } -Headers $bob | Out-Null
(Invoke-RestMethod -Method Post -Uri "$api/orders/checkout/" -Headers $bob -ContentType 'application/json' -Body ($ship | ConvertTo-Json)).id
Within about a second of the order number appearing in Window 2, Bob's confirmation email appears in Window 3. The customer got their answer immediately, and the email was handled separately right after.

Step 3: What if the worker is down?

docker compose stop worker
Send-Json POST "$api/cart/items/" @{ product_id = $mug } -Headers $bob | Out-Null
(Invoke-RestMethod -Method Post -Uri "$api/orders/checkout/" -Headers $bob -ContentType 'application/json' -Body ($ship | ConvertTo-Json)).id
docker compose exec redis redis-cli LLEN celery
The checkout still works normally. The note simply waits in the line (LLEN → 1), because nobody is processing it. Now bring the worker back:
docker compose start worker
docker compose exec redis redis-cli LLEN celery
After a few seconds LLEN → 0, and the email for that order appears in Window 3. Nothing was lost while the worker was down. That's the big advantage of the waiting line: the shop and the worker don't need to be running at the same moment.

(Stop following the log in Window 3 with Ctrl+C when you're done.)

Step 4: Commit

git status
git add backend/Dockerfile backend/.dockerignore docker-compose.yml
git commit -m "Celery worker in Docker: uv-based image, worker service in compose"

---

❓ If something goes wrong

┌─────────────────────────────────────────────────────────────┬─────────────────────────────┬────────────────────────────────────────────────────────┐
→ 0, so the line is empty. And docker compose ps now shows three services: db, redis, and worker.

Step 2: A new order, live

Open a third window and follow the worker's log there:
cd "$env:USERPROFILE\OneDrive\Desktop\django-ecommerce"
docker compose logs -f --tail 0 worker
(--tail 0 means "show only new lines from now on.")

In Window 2, Bob places an order:
. .\tools\api-helpers.ps1
$bob  = Get-AuthHeader 'bob@example.com' 'Sunny-Garden-42'
$mug  = (Invoke-RestMethod "$api/products/blue-ceramic-mug/").id
$ship = @{ full_name = 'Bob Builder'; address = '5 Hammer Lane'; city = 'Test City'; postal_code = '12345'; country = 'Testland' }
Send-Json POST "$api/cart/items/" @{ product_id = $mug } -Headers $bob | Out-Null
(Invoke-RestMethod -Method Post -Uri "$api/orders/checkout/" -Headers $bob -ContentType 'application/json' -Body ($ship | ConvertTo-Json)).id
Within about a second of the order number appearing in Window 2, Bob's confirmation email appears in Window 3. The customer got their answer immediately, and the email was handled separately right after.

Step 3: What if the worker is down?

docker compose stop worker
Send-Json POST "$api/cart/items/" @{ product_id = $mug } -Headers $bob | Out-Null
(Invoke-RestMethod -Method Post -Uri "$api/orders/checkout/" -Headers $bob -ContentType 'application/json' -Body ($ship | ConvertTo-Json)).id
docker compose exec redis redis-cli LLEN celery
The checkout still works normally. The note simply waits in the line (LLEN → 1), because nobody is processing it. Now bring the worker back:
docker compose start worker
docker compose exec redis redis-cli LLEN celery
After a few seconds LLEN → 0, and the email for that order appears in Window 3. Nothing was lost while the worker was down. That's the big advantage of the waiting line: the shop and the worker don't need to be running at the same moment.

(Stop following the log in Window 3 with Ctrl+C when you're done.)



Quick status: the automated tests are written. All 39 pass in about 2 seconds and exercise 90% of the backend's code. I also checked that the tests never touch your real data or your Redis waiting line. Here's the lesson.

Phase 9: Automated tests for the backend

Lesson 8.2 checkpoint passed: the worker started with transport: redis://redis:6379/0 and our job listed, it caught up on the two waiting emails (#10 and #11), and order #12's note waited while the worker was stopped and was picked up when it came back. Commit 1bce396 is in.

About your log: the emails show up as WARNING/ForkPoolWorker-1. That isn't an error. The "print emails instead of sending" setting writes to the screen, and Celery labels anything a job prints as a warning by default. The real result is on the succeeded line.

🎉 Phase 8 is complete.

What & why

Since Lesson 3 you've checked every feature by hand: run commands, read the output, compare it with what I said it should be. That was the right way to learn, but it doesn't scale. Every time we change something, anything built earlier could quietly break, and nobody is going to repeat 200 manual checks after each change.

Automated tests are small programs that do those checks for us. Each test sets up a situation ("Bob has 2 knives in his cart, but only 1 is left"), does something ("Bob checks out"), and verifies the result ("refused, nothing changed"). You run the whole collection with one command, and within seconds you know whether everything still works. If something broke, the output tells you exactly which behaviour and why. Tests are also the safety net that lets us change code later with confidence, including the Django 5.2 upgrade at the end of the course.

What happens when you run the tests

1. Django creates a separate, empty test database (test_shoplite) next to your real one. Your real products, users, and orders are never touched.
2. Each test builds just the data it needs (a category, a few products, a customer or two), runs its scenario, and checks the result.
3. After each test, its changes are undone, so every test starts clean and tests can't affect each other.
4. When all tests are done, the test database is deleted.
5. You get a summary: one dot per passing test, and a detailed report for any that fail.

A few special arrangements:
- No real emails are queued. Checkout normally drops a note into Redis. In the tests that step is replaced by a stand-in that only records that it was asked to queue the email for the right order. So tests never fill your real Redis line or make the worker send emails about orders that don't exist. (I confirmed the line was still empty after the run.)
- The email itself is tested directly: the test runs the "send confirmation" job without any worker, and Django collects the email in a tray inside the test instead of printing it. The test then checks the recipient, the subject, and the order lines.
- Faster passwords during tests only. Real password protection is deliberately slow (870,000 rounds, Lesson 2.6) to stop attackers guessing. Tests create many users, so while tests run a quick version is used. It's never used outside tests.

What the 39 tests check

Area: Catalog (12)
What's verified: Only visible products are listed, in pages; category/price filters, search, and "in stock" work; a bad filter value gives 400; hidden
products are "not found" for the public but visible to admins; anonymous users get 401 and customers 403 when creating products; admins can create them
(with an automatic web name); a duplicate name gives a clear error instead of a crash; a category with products can't be deleted (409) but an empty one
can; an image over 2 MB is refused
────────────────────────────────────────
Area: Accounts (8)
What's verified: Registration lowercases the email, ignores "make me staff", never returns the password, and stores it protected; weak passwords and
duplicate emails (any capitalisation) are refused; login works with any capitalisation; a wrong password gives 401; a real login token opens /me; /me
needs login and can't change role or email
────────────────────────────────────────
Area: Cart (7)
What's verified: Login required; adding the same product twice raises the quantity (one line, correct total); stock limits (with the "you already have 3"
message); out-of-stock and hidden products are refused; another customer's cart line is "not found"; a product hidden after adding shows an issue on the
line; emptying the cart
────────────────────────────────────────
Area: Orders (12)
What's verified: Checkout creates a pending order with the right total, reduces stock, empties the cart, and queues the email for that order; the order
keeps its price when the product's price changes later; empty cart and not-enough-stock are refused with nothing changed; a crash halfway  leaves nothing
 behind; customers only see their own orders; cancelling returns the stock exactly once; no cancelling after payment; admins must follow the status
steps; customers can't change statuses; the confirmation email content; two customers buying the last item at the  same instant: exactly one succeeds and
 stock ends at 0

That last test is the race from Lesson 7.3, now automated. It really runs two customers at the same moment, each with its own connection to the test database, which is why it runs a little differently from the others.

What I added

- A tests.py in each app (accounts, catalog, cart, orders), replacing the empty ones startapp created
- A small shared helper file (core/testing.py) with shortcuts for creating test users, categories, and products
- The "fast passwords during tests" setting
- Settings for coverage in pyproject.toml (explained in Step 3)

---

▶️ Your turn

cd "$env:USERPROFILE\OneDrive\Desktop\django-ecommerce\backend"
(The API server doesn't need to be running. Tests use their own database and fake requests. PostgreSQL in Docker must be running.)

Step 1: Run all the tests

uv run python manage.py test
Expected:
Creating test database for alias 'default'...
Found 39 test(s).
System check identified no issues (0 silenced).
.......................................
----------------------------------------------------------------------
Ran 39 tests in 1.9s

OK
Destroying test database for alias 'default'...
One dot per passed test. Run it with more detail to see each test's name:
uv run python manage.py test -v 2
You'll see lines like test_last_item_is_sold_only_once (orders.tests.LastItemRaceTests...) ... ok. The test names are written as plain sentences on purpose, so the list reads like a description of how the shop behaves.

You can also run just one app's tests:
uv run python manage.py test orders

Step 2: Break something on purpose, and let the tests catch it

This is the real value of tests. Open backend\orders\models.py and find the allowed status changes. Change the pending line so an order may jump straight to delivered:
        Status.PENDING: {Status.PAID, Status.CANCELLED, Status.DELIVERED},
Save, and run the order tests:
uv run python manage.py test orders
Now you'll see an F instead of a dot, and a report like:
FAIL: test_admin_follows_allowed_status_steps (orders.tests.OrderManagementTests...)
...
AssertionError: 200 != 400
----------------------------------------------------------------------
Ran 12 tests in ...
FAILED (failures=1)
How to read it: the report names the behaviour that broke ("admin follows allowed status steps") and what went wrong: the shop answered 200 (allowed) where 400 (refused) was expected. Read the lines just above the error and you'll see which step. Nobody had to remember to test that by hand.

Undo the change using Git (it restores the file to the last committed version):
git restore orders/models.py
uv run python manage.py test orders
→ OK again.

Step 3: Coverage (which parts of the code the tests actually run)

Coverage is a tool that watches the tests run and reports which lines of our code were used. Lines that no test runs are lines where a bug could hide unnoticed. Coverage is only needed while developing, not by the running shop, so we install it as a development-only package:
uv add --dev coverage
git diff pyproject.toml
The diff shows coverage in a separate [dependency-groups] dev section, not in the main list. That matters: the worker's Docker recipe installs with "no development packages" (Lesson 8.2), so coverage never ends up in the worker. Only your machine gets it.

Now run the tests under coverage, then show the report:
uv run coverage run manage.py test
uv run coverage report
You'll get a table per file, ending with roughly TOTAL ... 90%. The Missing column lists the line numbers no test reached. Most of the gaps are admin-screen details and the seed command, which we checked by hand. The core business rules (serializers, views, the checkout and status logic) are at 94–100%. Aiming for 100% everywhere isn't the goal. The important rules being covered is.

Optionally, for a clickable report in the browser:
uv run coverage html
start htmlcov\index.html
Click a file: lines run by tests are green, and missed ones are red. (.coverage and htmlcov\ are already ignored by Git.)

Step 4: Commit

uv run python manage.py test orders
→ OK again.

Step 3: Coverage (which parts of the code the tests actually run)

Coverage is a tool that watches the tests run and reports which lines of our code were used. Lines that no test runs are lines where a bug could hide unnoticed. Coverage is only needed while developing, not by the running shop, so we install it as a development-only package:
uv add --dev coverage
git diff pyproject.toml
The diff shows coverage in a separate [dependency-groups] dev section, not in the main list. That matters: the worker's Docker recipe installs with "no development packages" (Lesson 8.2), so coverage never ends up in the worker. Only your machine gets it.

Now run the tests under coverage, then show the report:
uv run coverage run manage.py test
uv run coverage report
You'll get a table per file, ending with roughly TOTAL ... 90%. The Missing column lists the line numbers no test reached. Most of the gaps are admin-screen details and the seed command, which we checked by hand. The core business rules (serializers, views, the checkout and status logic) are at 94–100%. Aiming for 100% everywhere isn't the goal. The important rules being covered is.

Optionally, for a clickable report in the browser:
uv run coverage html
start htmlcov\index.html
Click a file: lines run by tests are green, and missed ones are red. (.coverage and htmlcov\ are already ignored by Git.)
│  denied to create database                          │ databases                                    │ DB_USER in .env                                │
├─────────────────────────────────────────────────────┼──────────────────────────────────────────────┼────────────────────────────────────────────────┤
│ database "test_shoplite" already exists and a       │ A previous test run was interrupted and      │ Type yes (it's only the test copy), or run     │
│ question Type 'yes'                                 │ didn't clean up                              │ with --noinput                                 │
├─────────────────────────────────────────────────────┼──────────────────────
---







Phase 10, Lesson 10.1: Creating the React frontend with Vite

Phase 9 checkpoint passed: 39 tests OK, every test name listed, and 90% coverage. Commit d4fe5be is in. (Your two test orders runs both said OK, so it looks like the deliberate break in Step 2 wasn't saved before running. Try it again whenever you like. Seeing a test fail on purpose is worth it once.)

🎉 The backend is complete. Now we build what customers actually see.

What & why

Everything we built so far lives on the server. Customers will never type PowerShell commands. They'll open a website, see products, click "Add to cart", and fill in a checkout form. That website is the frontend. It runs inside the customer's browser and talks to our API exactly the way your PowerShell commands did: it asks for products, sends the login, adds items to the cart.

We'll build it with these tools, each doing one job:
- React builds the page out of reusable pieces, called components: a product card, a navigation bar, a cart line, a "Place order" button. You describe what each piece should look like for the current data (say, "this card shows this product's name, picture, and price"). When the data changes (an item is added to the cart), React updates just the parts of the page that need to change. The page never has to be reloaded.
- TypeScript is JavaScript (the browser's programming language) plus labels describing what each piece of data looks like, for example "a product has a name, which is text, and a price." Your editor can then warn you while you type if you use data wrongly, like misspelling prcie or treating a price as a list, long before a customer would hit the bug.
- Vite is the development tool around it all:
  - While you work, it runs a small development server (at http://localhost:5173, the address we already allowed through CORS in Lesson 5.3). The moment you save a file, the change appears in the browser without a reload, usually in well under a second.
  - When the shop is finished, Vite builds the final optimised files for a real server.

How the frontend fits with what we have

During development, two servers run side by side:

┌──────────────────────────────┬───────────────────────┬───────────────────────────────────────────────────┐
│            Server            │        Address        │             What it gives the browser             │
├──────────────────────────────┼───────────────────────┼───────────────────────────────────────────────────┤
│ Vite (new)                   │ http://localhost:5173 │ the app itself: the pages, components, and styles │
├──────────────────────────────┼───────────────────────┼───────────────────────────────────────────────────┤
│ Django (Window 1, as before) │ http://127.0.0.1:8000 │ the data, through /api/...                        │
└──────────────────────────────┴───────────────────────┴───────────────────────────────────────────────────┘

The customer's browser loads the app from Vite, and the app then calls Django's API for products, login, cart, and orders. That's exactly the "different origins" situation from the CORS lesson, and why we set it up back then.

JavaScript's equivalents of what you already know

You've already learned the same ideas with uv, so the JavaScript side will feel familiar:

┌───────────────────────────────────┬─────────────────────────────┬───────────────────────────────────────────────────────────┐
│       Python / uv (backend)       │ JavaScript / npm (frontend) │                        What it is                         │
├───────────────────────────────────┼─────────────────────────────┼───────────────────────────────────────────────────────────┤
│ uv                                │ npm (comes with Node.js)    │ the package manager                                       │
├───────────────────────────────────┼─────────────────────────────┼───────────────────────────────────────────────────────────┤
│ pyproject.toml                    │ package.json                │ the list of packages the project needs, plus its commands │
├───────────────────────────────────┼─────────────────────────────┼───────────────────────────────────────────────────────────┤
│ uv.lock                           │ package-lock.json           │ the exact versions actually installed (commit it)         │
├───────────────────────────────────┼─────────────────────────────┼───────────────────────────────────────────────────────────┤
│ .venv\                            │ node_modules\               │ the installed packages (never committed, rebuildable)     │
├───────────────────────────────────┼─────────────────────────────┼───────────────────────────────────────────────────────────┤
│ uv run python manage.py runserver │ npm run dev                 │ start the development server                              │
└───────────────────────────────────┴─────────────────────────────┴───────────────────────────────────────────────────────────┘

What happens in this lesson

We create the frontend folder next to backend, install its packages, start Vite, and see the starter page. You'll make one small change and watch it appear instantly. Then we build the final files once, to see what a real deployment would get. We won't style anything or talk to the API yet. That's the next lessons.

---

▶️ Your turn

Step 0: Pause OneDrive

npm install creates thousands of small files in node_modules. Pause OneDrive syncing for 2 hours (cloud icon → ⚙️ → Pause syncing), exactly as in Lesson 0.3.

Step 1: Create the project

From the project root (in a new window; Django can keep running in Window 1):
cd "$env:USERPROFILE\OneDrive\Desktop\django-ecommerce"
npm create vite@latest frontend -- --template react-ts --no-interactive
- npm create vite@latest downloads and runs Vite's project creator (version 9.x). You may see "The following package was not found and will be installed: create-vite@...". That's npm fetching the creator itself, which is fine.
- frontend is the folder name, --template react-ts means React with TypeScript, and --no-interactive means "don't ask questions, use what I said."
- The lone -- in the middle tells npm "everything after this is for the Vite creator, not for npm."

Expected: Scaffolding project in ...\django-ecommerce\frontend... and Done. Now run: cd frontend, npm install, npm run dev.

Step 2: Install the packages

cd frontend
npm install
npm reads package.json, downloads everything into node_modules, and writes package-lock.json. It ends with something like added 60 packages ... found 0 vulnerabilities.

Look at what you got:
Get-ChildItem
Get-Content package.json
The main files and folders:

┌────────────────────────────┬───────────────────────────────────────────────────────────────────────────────────┐
│            Item            │                                   What it's for                                   │
├────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────┤
│ index.html                 │ The single HTML page the browser loads. It's almost empty, and React fills it in. │
├────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────┤
│ src\main.tsx               │ The starting point: it tells React to draw the app inside that page               │
├────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────┤
│ src\App.tsx                │ The top component, and everything you see comes from here. We'll replace it soon. │
├────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────┤
│ src\index.css, src\App.css │ Styles for the starter page (replaced by Tailwind next lesson)                    │
├────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────┤
│ src\assets\, public\       │ Images and icons for the starter page                                             │
├────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────┤
│ vite.config.ts             │ Vite's settings                                                                   │
├────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────┤
│ tsconfig*.json             │ TypeScript's settings                                                             │
├────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────┤
│ package.json               │ Packages and commands (dev, build, lint, preview)                                 │
├────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────┤
│ .gitignore                 │ Tells Git to ignore node_modules and dist                                         │
└────────────────────────────┴───────────────────────────────────────────────────────────────────────────────────┘

In package.json, check the versions: react ^19.2, vite ^8.3, and typescript ~6.0, the versions from our plan. (^ means "this version or a newer compatible one," like >= in pyproject.toml. The exact versions are fixed in package-lock.json.)

Step 3: Start the development server

npm run dev
Expected:
  VITE v8.3.x  ready in 300 ms

  ➜  Local:   http://localhost:5173/
Open http://localhost:5173. You'll see the Vite + React starter page with a "Count is 0" button. Click it a few times. The number goes up without the page reloading: React only redraws the part that changed.

Step 4: Instant updates (hot reload)

Keep the browser visible. Open frontend\src\App.tsx in your editor, find the text Get started, and change it to ShopLite is coming. Save.

The heading changes in the browser within a fraction of a second, and the counter keeps its number. Vite replaced only the changed piece instead of restarting the page. This is what makes frontend work fast: change, save, look.

Now try a mistake on purpose: delete the closing </h1> and save. Instead of a blank page, Vite shows a red error overlay in the browser, naming the file, line, and problem, and the terminal shows the same. Put </h1> back and save, and the page recovers by itself.

Stop the server with Ctrl+C in the terminal.

Step 5: Build the final files (what a real server would get)

npm run build
Get-ChildItem dist, dist\assets
The build first runs TypeScript's full check of every file. If anything is wrong, it stops here, which is another safety net. Then Vite produces a dist folder with an index.html and a few files in dist\assets with odd names like index-Cx8a2.js. These are all our code and React squeezed into a few small files. The random part of the name changes whenever the content changes, so browsers always fetch the newest version. This folder is what you'd upload to a web host. It's ignored by Git, because it can always be rebuilt.

(Optional: npm run preview serves that finished dist folder at http://localhost:4173, so you can check the production version. Ctrl+C to stop.)



Phase 10, Lesson 10.2: Tailwind CSS and shadcn/ui (styling and ready-made components)

Lesson 10.1 checkpoint passed: react 19.2.8, vite 8.3.1, typescript 6.0, hot reload worked (hmr update /src/App.tsx), and the build produced dist\assets. Commit 99dcce2 is in.

First: your first npm i ran in a different project

PS ...\django-ecommerce> npm i
up to date, audited 152 packages ... 13 vulnerabilities (12 high, 1 critical)
You ran it in the project root, where there's no package.json. When npm doesn't find one in the current folder, it walks up the parent folders until it finds one. I checked: it found C:\Users\subin\package.json, an unrelated project in your user folder. It reported that project as "up to date" and changed nothing, so no harm was done. Those 13 vulnerabilities belong to that other project, not ShopLite. Ours, installed next inside frontend\, reported 0 vulnerabilities.

It's the same trap as uv outside backend\ (Lesson 2.2). So from now on: npm commands always from frontend\, uv commands always from backend\. (If you don't know what's in C:\Users\subin\package.json, it's worth a look some time. It may be left over from an old experiment.)

---

What & why

The starter page has its own hand-written styles. For a real shop we need two things:
1. A fast, consistent way to style anything. That's Tailwind CSS. Instead of writing separate style files, you describe the look directly on each element with short words: "padding 4", "bold text", "rounded corners", "grey background", "three columns on wide screens, one on phones". Tailwind has thousands of these small words, all following one consistent scale of sizes and colours, so the whole shop automatically looks coherent. When you build the final files, only the words you actually used are included, so the styles stay tiny.
2. Ready-made interface pieces (buttons, cards, text inputs, dropdowns, pop-up dialogs, notifications, tables) that look good and behave correctly. That's shadcn/ui, built on Radix UI:
   - Radix UI handles the hard, invisible parts that are easy to get wrong: a pop-up dialog traps the keyboard inside it and closes with Esc, a dropdown can be operated with arrow keys, and screen readers for blind users announce everything properly. This is called accessibility, and many shops fail at it.
   - shadcn/ui adds a clean, modern look on top, using Tailwind. Unlike a normal library, it copies each component's source file into our project. They become our files, and we can open and change any of them. There's no hidden library to fight with.

What happens in this lesson

1. You install Tailwind.
2. You run shadcn's setup tool. It checks the project (Vite, Tailwind 4, the @ shortcut), saves its settings in a small file (components.json), installs its helpers (Radix, an icon set, a font), creates one small helper file, and adds the theme to our main style file: the shop's colour palette (background, text, "primary" button colour, borders, …) as named values. Every component uses those names, so changing one colour there changes it everywhere.
3. You add the components we'll need throughout the shop. Eleven files appear in src\components\ui\, one per component.
4. You start Vite and see a new ShopLite welcome page built from those components: a header with navigation and a cart button, a welcome section, and three feature cards. The buttons don't do anything yet. Navigation and real data come in Phase 11.

What I changed

- Connected Tailwind to Vite, so Vite applies Tailwind's styles automatically while you work.
- Set up the @ shortcut in Vite's and TypeScript's settings. Anywhere in the frontend, @/components/ui/button means "the button file in src", however deep the current file is. Without it, imports become long chains like ../../../components/ui/button. shadcn requires this shortcut. (Older guides also show an extra "baseUrl" setting there. TypeScript 6 no longer needs it and warns about it, so I left it out.)
- Replaced the starter styles with Tailwind (the main style file now just says "use Tailwind", and shadcn adds the theme to it).
- Removed the starter page's leftovers: its style file, pictures, and icons.
- Wrote the new welcome page, and renamed the browser tab from "frontend" to "ShopLite".
- I verified all of this in a separate trial project with the same versions: shadcn's setup found Vite, Tailwind v4, and the shortcut, and the welcome page built without errors.

---

▶️ Your turn

Pause OneDrive again (several packages are installed), and stop any running npm run dev.
cd "$env:USERPROFILE\OneDrive\Desktop\django-ecommerce\frontend"

Step 1: Install Tailwind

npm install tailwindcss @tailwindcss/vite
Two packages: Tailwind itself, and its connector for Vite.

Step 2: Set up shadcn/ui on top of Radix

npx shadcn@latest init -b radix -p nova --no-monorepo -y
What the options mean: -b radix means "build on Radix UI" (the plan's choice; shadcn also offers other foundations), -p nova picks the Nova look (with the Lucide icon set and the Geist font), --no-monorepo means "this is a normal single project", and -y means "don't ask for confirmation."

You'll see a checklist of green ticks:
√ Verifying framework. Found Vite.
√ Validating Tailwind CSS. Found v4.
√ Validating import alias.
√ Writing components.json.
√ Installing dependencies.
√ Created 1 file:
  - src\lib\utils.ts
√ Updating src\index.css
Project initialization completed.
If you're curious, open src\index.css: below the Tailwind line there are now two blocks of colour values, one for light mode and one for dark mode. That's the theme.

Step 3: Add the components we'll use

npx shadcn@latest add button card input label badge select dialog sonner table skeleton separator -y
Get-ChildItem src\components\ui
→ Created 11 files, one per component: button, card, input, label, badge, select, dialog, sonner (pop-up notifications), table, skeleton (grey placeholder shapes while data loads), and separator (a thin dividing line). Open button.tsx if you like. It's ordinary code inside our project that we're free to change.

Step 4: See the new welcome page

npm run dev
Open http://localhost:5173:
- The browser tab says ShopLite.
- There's a white header with ShopLite, Products, Sign in, and a cart icon button.
- A grey badge says Coming soon, above a large Welcome to ShopLite heading, a short description, and two buttons (solid and outlined).
- Three cards with icons: Hand-picked products, Order tracking, Secure checkout.

Try these:
- Hover and click with the keyboard: press Tab repeatedly. Each button gets a visible focus ring as you move through them. That's the accessibility work built into the components.
- Make the window narrow, or open DevTools (F12) → the phone icon. The three cards stack vertically on small screens and sit side by side on wide ones. That behaviour is one Tailwind word on the card grid ("three columns from small-screen size upward").

Step 5: Change the look with Tailwind (instant)

With the page still open, edit src\App.tsx:
1. Find bg-muted/40 (on the first line inside return) and change it to bg-amber-50. Save. The whole page background turns a warm cream colour immediately.
2. Find text-4xl in the "Welcome to ShopLite" heading and change it to text-6xl. Save. The heading grows.

Change both back (bg-muted/40, text-4xl) and save. No style files, no reloads: you change a word on the element and see the result.

Step 6: Check the production build

Stop the dev server (Ctrl+C), then:
npm run build
TypeScript checks every file, including the eleven new components, and Vite builds. It ends with ✓ built in ..., and you'll notice a few font files (geist-...woff2) in the output. That's the Nova look's font, now shipped with our shop instead of being loaded from someone else's server.

(If you run npm run lint, you'll see two warnings about button.tsx and badge.tsx. They're harmless notes about how those shadcn files are organised, not errors, and we'll leave the files as shadcn made them.)

Step 7: Resume OneDrive and commit






Phase 11, Lesson 11.1: Pages and navigation with React Router

Lesson 10.2 checkpoint passed: shadcn's setup found Vite, Tailwind v4, and the @ shortcut; the 11 components were created; and the build and lint succeeded (the two lint warnings are the harmless ones I mentioned). Commit 0dd191a is in.

One thing from your output: Vite printed a notice that our settings file used an older way of saying "this folder", which a future Vite version won't support. My setup followed shadcn's guide, which still uses the old way. I've switched it to the newer one Vite suggested, so the notice is gone.

What & why

Right now the shop is one screen. A real shop has many: the home page, the product list, a page per product, the cart, sign-in, and registration. Each should have its own web address, so that:
- customers can bookmark a product or share its link (/products/chef-knife)
- the browser's Back and Forward buttons work as expected
- refreshing the page keeps you where you were

Our frontend is a single-page application. The browser loads one HTML page once, and after that React swaps what's shown depending on the web address, without ever reloading the page. So moving between pages is instant, and anything already loaded (later: your login, your cart) stays in memory. React Router is the piece that watches the address, picks the right page to show, and makes links change the address without a reload.

What happens now

- A shared frame around every page. The header (ShopLite, Products, Sign in, cart button) and the footer are drawn once, in a layout. Only the middle part changes when you move between pages. That's why the header never flickers.
- An address list decides which page appears:

| Address                                           | Page                                                                                                                                      |
|---------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------|
| /                                                 | Home (the welcome page from Lesson 10.2)                                                                                                  |
| /products                                         | Product list (placeholder until Lesson 11.2)                                                                                              |
| /products/chef-knife, /products/wireless-mouse, … | Product page, for any product. The last part of the address is a variable that the page reads, so one page design serves all 20 products. |
| /cart, /login, /register                          | Placeholders until Phases 12–13                                                                                                           |
| anything else                                     | a friendly "404 Page not found" with a way back home                                                                                      |

- Clicking a link doesn't reload the page. React Router changes the address and swaps the middle part. The browser still records each step in its history, so Back and Forward work.
- The current section is highlighted in the header. On any product page, "Products" is highlighted, so customers always know where they are.
- Each new page starts at the top, while Back and Forward return you to where you were scrolled.
- Refreshing or typing an address directly works. Vite's development server always answers with our one HTML page, whatever the address, and React Router then shows the matching page. A real web host needs the same "always answer with the app" rule, and we'll set that up when deploying.
- The welcome page's buttons now work: Browse products goes to /products, and Create an account goes to /register.

What I built

- A layout (header, footer, and the space where pages appear) and the header with highlighted links
- Seven pages: home (the welcome content, moved out of the old single file), products, product detail, cart, sign in, register, and 404. The unfinished ones use a small shared "placeholder" card that says which lesson will build them. The products placeholder has three sample links so you can try product addresses before the real list exists.
- The address list (which page for which address), and the start-up file now hands control to React Router
- Removed the old single-screen file, since its content now lives in the home page

Version note: installing React Router today gives version 8.4, the current release. Our plan just said "React Router". The features we use work as I described, and I verified them in my trial project and in a real browser.

---

▶️ Your turn

Step 1: Install React Router

cd "$env:USERPROFILE\OneDrive\Desktop\django-ecommerce\frontend"
npm install react-router
npm ls react-router
→ react-router@8.4.x. (Only one package. React Router ships everything in it.)

Step 2: Start the app and move around

npm run dev
The Vite notice about the settings file is gone. Open http://localhost:5173 and press F12, then switch to the Network tab.

1. Click Browse products. The address changes to /products, the header stays, and the middle shows the Products placeholder with three sample links. Products in the header is highlighted.
2. In the Network tab, look at the Type column: while you click around, no new "document" appears. The page is never reloaded; only the middle part changes.
3. Click /products/chef-knife. The card says Product: chef-knife, and "Products" stays highlighted. Try the other two samples: the same page shows a different product name each time.
4. Press the browser's Back button twice. You go back through the product pages to the list, exactly as on any normal website.
5. Click the cart icon, then Sign in, then its Create one link, then the ShopLite logo (home).

Step 3: Typed addresses, refresh, and 404

1. Type http://localhost:5173/products/wireless-mouse directly into the address bar and press Enter. It shows Product: wireless-mouse.
2. Press F5 (refresh). You stay on the same page.
3. Type http://localhost:5173/nothing-here. You get the 404 – Page not found page with a Go to the home page button. The header is still there, so the customer isn't lost.
4. Try the old shop idea: http://localhost:5173/products/any-name-at-all. It shows Product: any-name-at-all. The page accepts any name for now. In Lesson 11.3, once it loads real data from the API, an unknown product will show a proper "product not found" message.

Step 4: Scroll position

Make the window short (or zoom in) so the home page scrolls. Scroll to the bottom, click Products in the header, and notice the new page starts at the top. Press Back, and you're returned to the bottom of the home page, where you were.

Step 5: Build and commit

Stop the dev server (Ctrl+C):
npm run build
cd ..
git status
git add frontend
git commit -m "React Router: layout with header, pages for home, products, product detail, cart, login, register and 404"

---

cd "$env:USERPROFILE\OneDrive\Desktop\django-ecommerce\frontend"
npm install react-router
npm ls react-router
→ react-router@8.4.x. (Only one package. React Router ships everything in it.)

Step 2: Start the app and move around

npm run dev
The Vite notice about the settings file is gone. Open http://localhost:5173 and press F12, then switch to the Network tab.

1. Click Browse products. The address changes to /products, the header stays, and the middle shows the Products placeholder with three sample links. Products in the header is highlighted.
2. In the Network tab, look at the Type column: while you click around, no new "document" appears. The page is never reloaded; only the middle part changes.
3. Click /products/chef-knife. The card says Product: chef-knife, and "Products" stays highlighted. Try the other two samples: the same page shows a different product name each time.
4. Press the browser's Back button twice. You go back through the product pages to the list, exactly as on any normal website.
5. Click the cart icon, then Sign in, then its Create one link, then the ShopLite logo (home).

Step 3: Typed addresses, refresh, and 404

1. Type http://localhost:5173/products/wireless-mouse directly into the address bar and press Enter. It shows Product: wireless-mouse.
2. Press F5 (refresh). You stay on the same page.
3. Type http://localhost:5173/nothing-here. You get the 404 – Page not found page with a Go to the home page button. The header is still there, so the customer isn't lost.
4. Try the old shop idea: http://localhost:5173/products/any-name-at-all. It shows Product: any-name-at-all. The page accepts any name for now. In Lesson 11.3, once it loads real data from the API, an unknown product will show a proper "product not found" message.

Step 4: Scroll position

Make the window short (or zoom in) so the home page scrolls. Scroll to the bottom, click Products in the header, and notice the new page starts at the top. Press Back, and you're returned to the bottom of the home page, where you were.
git add frontend
git commit -m "React Router: layout with header, pages for home, products, product detail, cart, login, register and 404"

---

❓ If something goes wrong

│ shows a new "document")                                  │ React Router link                      │ React Router's links.                          │
├──────────────────────────────────────────────────────────┼────────────────────────────────────────┼────────────────────────────────────────────────┤
│ Port 5173 is in use                                      │ An old npm run dev is still running in │ Close it with Ctrl+C                           │
│                                                          │  another window                        │                                                │
└──────────────────────────────────────────────────────────┴────────────────────────────────────────┴────────────────────────────────────────────────┘

---




touched. Here's the lesson.

Phase 11, Lesson 11.2: Loading real products from the API

Lesson 11.1 checkpoint passed: react-router@8.4.0 is installed and commit ba95784 is in. (By the way, the audited 431 packages is expected. shadcn's setup tool added itself and its helpers to the project in Lesson 10.2, and all 431 packages together still have 0 vulnerabilities.)

What & why

The product page is still a placeholder. Now the frontend starts talking to Django. It fetches the real product list and shows it as a grid of cards, with search, category, price range, sorting, and pages, just like a real shop.

Fetching data in a browser app sounds simple ("ask the server, show the answer"), but a good shop has to handle much more:
- Waiting. The answer takes a moment. The page should show something sensible meanwhile (grey placeholder cards), not a blank space.
- Failure. If the server is down, show a clear message and a "Try again" button, not a broken page.
- Nothing found. "No products match your filters", with a quick way out.
- Remembering. If you go to page 2 and back to page 1, the shop shouldn't make you wait for page 1 again.
- Staying fresh. Remembered data can get old (an admin changes a price), so it should be re-checked quietly in the background.
- No flashing. When you switch to page 2, page 1 should stay visible (slightly faded) until page 2 has arrived, instead of the grid disappearing and reappearing.

We use two tools for this:
- Axios makes the actual requests to the API. We set it up once with the API's address, so every part of the frontend uses the same connection. In Phase 12 we'll teach this one place to add the login token automatically.
- TanStack Query handles everything in the list above: waiting, errors, remembering, re-checking, and no flashing. Each piece of data gets a name (for example "products, Kitchen, cheapest first, page 1"), and TanStack Query stores the result under that name. Ask for the same name again and you get it instantly from memory.

What happens now on the product page

- The filters live in the web address, for example /products?category=kitchen&ordering=price&page=2. Choosing a category or sort order updates the address, and the address decides what's shown. That's why you can bookmark or share a search, why Back undoes a filter change, and why refreshing keeps your filters.
- Category and sort apply immediately. Search text and prices apply when you press Enter or Search. That avoids sending a request for every letter typed.
- Changing any filter jumps back to page 1, because page 3 of a new search may not exist.
- First visit: six grey card shapes appear, then the real cards: picture (or a "no image" icon), category, name, and price in your currency. Products with 0 stock get an Out of stock label.
- Next/Previous: the current page stays visible, slightly faded, until the new one arrives. "Page 1 of 2" is calculated from the total count the API returns.
- Coming back to a page or search you've already seen: it appears instantly from memory. If it's more than 30 seconds old, it's also quietly re-checked, and the cards update if something changed.
- Server down: after one automatic retry, you get "Couldn't load the products. Cannot reach the shop server. Is the backend running?" and a Try again button. If the server clearly says no (for example "page doesn't exist"), it doesn't retry pointlessly.
- No results: "No products match your filters." with a Clear filters button.
- Only visible products appear. The hidden "Discontinued Travel Mug" doesn't, because the API decides that (Lesson 4.3), not the frontend.

What I built

- The API connection (Axios): the address comes from a new frontend\.env file, like the backend's settings. There's also a helper that turns any connection problem into a short, readable message.
- The data shapes: a description of what a product, a category, and a "page of results" look like, matching the backend's JSON. TypeScript can now warn us if we misuse them.
- The data layer (TanStack Query): "get a page of products for these filters", "get one product" (for Lesson 11.3), and "get all categories" (reused for 5 minutes, since they rarely change). Plus the shared memory, set to re-check data older than 30 seconds, and a developer panel that lets you look inside that memory. The panel only appears while developing, never in the real shop.
- The product list page: the filter bar, product cards, grey placeholder cards, error and empty messages, and page buttons.
- Price display in your currency: prices come from the API as exact text like "12.50" (Lesson 4.1), and the page formats them for display, like $12.50. The currency is a setting in .env: USD by default, but you can use EUR, GBP, INR, or any other.

---

▶️ Your turn

Step 1: Install the two libraries

cd "$env:USERPROFILE\OneDrive\Desktop\django-ecommerce\frontend"
npm install axios @tanstack/react-query
npm install -D @tanstack/react-query-devtools
The -D means "only needed while developing" (npm's version of uv add --dev from Phase 9). You should get axios 1.20 and @tanstack/react-query 5.104.

Step 2: Create the frontend's settings file

Copy-Item .env.example .env
Get-Content .env
It contains the API address http://127.0.0.1:8000/api and VITE_CURRENCY=USD. Change the currency code to yours if you like (for example INR or EUR).

Two rules about this file that differ from the backend's .env:
- Only settings starting with VITE_ reach the frontend code. That's a safety rule, so other things on your machine can't leak in by accident.
- It must never contain secrets. Everything in the frontend is sent to the customer's browser, where anyone can read it.

The file is ignored by Git (like backend\.env), and .env.example is committed.

Step 3: Start both servers

Window 1 (backend), if it isn't running:
cd "$env:USERPROFILE\OneDrive\Desktop\django-ecommerce\backend"
uv run python manage.py runserver
Window 2 (frontend):
npm run dev
Vite reads .env only when it starts. If you change .env later, restart it.

Step 4: Browse the real catalog

Open http://localhost:5173/products:
1. For a split second there are grey card shapes, then 12 real products. It says 20 products, and at the bottom Page 1 of 2. Your uploaded photos appear on the mug, knife, pen set, pot, and mouse. The Linen Cushion Cover has an Out of stock label.
2. Category → Kitchen. The address becomes ?category=kitchen, and you see 5 products.
3. Sort → Price: low to high. The address gets &ordering=price, and the mug (the cheapest) comes first.
4. Clear the filters, type mug in the search box, and press Enter: only the Blue Ceramic Mug. Now type zzz and search: "No products match your filters." Click Clear filters.
5. Set Min price 10 and Max price 20, then press Search: only products in that range.
6. Go to Next (page 2) and back to Previous.
7. Press the browser's Back button several times. Each press undoes one step, and the filter bar shows the matching values each time.
8. Copy the address of a filtered search, open a new tab, and paste it. You get the same results. That's a shareable search.

Step 5: Watch the memory at work

Press F12 → Network tab → click Fetch/XHR, so only API requests are listed.
1. Click Next (a request for ?page=2 appears), then Previous. Page 1 appears instantly and no new request appears if you're within 30 seconds. It came from memory.
2. Click ShopLite (home), then Products again. It's instant again.
3. Wait more than 30 seconds, then switch to another browser tab and back. A request quietly appears: the stale page is being re-checked in the background while you see the remembered one.
4. Click the small flower icon at the bottom left. That's TanStack Query's developer panel. It lists everything in memory, for example ["products", {"category":"kitchen", ...}] and ["categories"], each marked fresh or stale. Click one to see the exact data the API returned. Close the panel with the same icon.

Step 6: See the error handling

In Window 1, stop Django with Ctrl+C. In the shop, change the category (so it needs new data). After a moment (one automatic retry), you get:

▎ Couldn't load the products. Cannot reach the shop server. Is the backend running?  [Try again]

Start Django again (uv run python manage.py runserver) and click Try again. The products come back.

Step 7: Build and commit

Stop the dev server, then:
npm run build
cd ..
git status
git add frontend
git commit -m "Product list from the API: Axios, TanStack Query, filters in the URL, pagination, loading/error/empty states"
- The build may print a note that one output file is larger than 500 kB. That's only a size suggestion, not an error, and we'll look at it before deploying.
- In git status, confirm that frontend/.env is not listed, but frontend/.env.example is.

---

❓ If something goes wrong
{"category":"kitchen", ...}] and ["categories"], each marked fresh or stale. Click one to see the exact data the API returned. Close the panel with the same icon.

Step 6: See the error handling

In Window 1, stop Django with Ctrl+C. In the shop, change the category (so it needs new data). After a moment (one automatic retry), you get:

▎ Couldn't load the products. Cannot reach the shop server. Is the backend running?  [Try again]

Start Django again (uv run python manage.py runserver) and click Try again. The products come back.

│ Pictures don't appear, but products do  │ Django isn't serving media files (it must run with            │ Check backend\.env (Lesson 3.5)          │
│                                         │ DJANGO_DEBUG=True)                                            │                                          │
├─────────────────────────────────────────┼───────────────────────────────────────────────────────────────┼──────────────────────────────────────────┤
│ Error overlay: Failed to resolve import │ Step 1 wasn't done                                            │ Run it in frontend\                      │
│  "@tanstack/react-query"                │



Phase 11, Lesson 11.3: The product detail page

Lesson 11.2 committed as a41bf1c, and frontend/.env correctly stayed out of Git. (Your first git commit said "no changes added to commit" because the files hadn't been added with git add yet. You spotted it and fixed it right away.)

What & why

Clicking a product card opens /products/chef-knife, but the page is still a placeholder. A real product page needs everything a customer looks at before buying: a big picture, the price, whether it's in stock, the description, how many to buy, and a button to buy it. It also has to cope with bad addresses: an old bookmark to a product that was removed, or a typo.

What happens now

- Open a product and the page asks the API for that one product (the web name at the end of the address), then shows:
  - a breadcrumb at the top: Products › Kitchen › Chef Knife. Clicking Kitchen opens the product list already filtered to that category, reusing the filters from Lesson 11.2.
  - a large picture (or a "no image" icon), the category, the name, and the price in your currency
  - a stock label: In stock, Only 3 left (when 5 or fewer are left, to encourage buying), or Out of stock
  - the description
  - a quantity picker (− 1 +). It can't go below 1 or above the number in stock, so a customer can't choose 8 knives when only 5 exist. The API checks this again when adding to the cart (Lesson 6.3), because the frontend is only a convenience and the backend is the real guard (the golden rule from
    Lesson 0.1).
  - the buy button. Adding to a cart needs a logged-in customer (Lesson 6.1), and login arrives in Phase 12. So for now the button says "Sign in to add to
    cart" and takes you to the sign-in page, remembering which address (/login?next=/products/chef-knife). After we buildlogin, the shop will bring the customer back to this product once they've signed in.
- Out-of-stock products show the label and a short message instead of the picker and button.
- The browser tab shows the product's name, for example Chef Knife | ShopLite, which is useful with many tabs open and for bookmarks. The product list tab says Products | ShopLite.
- Unknown or hidden products show "Product not found", "It may have been removed, or the link is wrong", and a button back to all products. This happens
  because the API answers "404 not found" for both (hidden onethe page recognises that answer. A real connection problemshows "Couldn't load this product" with Try again instead, so customers can tell "it doesn't exist" apart from "something is broken".
- While loading, grey shapes appear in the layout of the real page.
- Faster opening: loading starts when you point at a card. On the mouse moves over a card (or the keyboard reaches it), theshop starts fetching that product's details in the background. By the time you click, usually a fraction of a second later, the data is often already
  there, so the page appears instantly without grey shapes. Itas everything else (Lesson 11.2), so returning to a productyou've already opened is instant too.

What I built

- The full product page, including its loading, "not found", and "couldn't load" versions
- A reusable quantity picker, which we'll use again in the cart (Phase 13)
- "Start loading on hover" for product cards
- Tab titles for the product list and product pages

No new packages this time.

---

▶️ Your turn

Make sure Django is running in Window 1, then in the frontend window:
cd "$env:USERPROFILE\OneDrive\Desktop\django-ecommerce\frontend"
npm run dev

Step 1: A product page

Open http://localhost:5173/products and click the Chef Knife:
- Check the breadcrumb, the picture, $49.99 (or your currency), and Only 5 left (or however many your earlier tests left in stock).
- The browser tab says Chef Knife | ShopLite.
- Click + until it stops. It stops at the stock number, and +  to 1, where − turns grey.
- Click Kitchen in the breadcrumb. You're on the product list, filtered to Kitchen.

Step 2: Loading on hover

Press F12 → Network → Fetch/XHR, and clear the list with the 🚫 icon. On the product list, slowly move the mouse over a card you haven't opened yet (for example Bluetooth Speaker) without clicking. A request for /api/products/bluetooth-speaker/ appears before you click. Now click it: the page opens instantly, with no grey shapes.

Step 3: Out of stock, and not found

- Open Linen Cushion Cover (search for "linen"). You see an Out of stock label and the message, with no picker or button.
- Type http://localhost:5173/products/discontinued-travel-mug in the address bar. You get Product not found (the product is hidden), and the tab says Product not found | ShopLite.
- Try http://localhost:5173/products/no-such-thing: the same message.

In the Console tab you'll see a red line: "Failed to load resource: the server responded with a status of 404". That's just the browser reporting the API's "not found" answer. It's expected here, and the page handles it properly.

Step 4: The sign-in button

Open any in-stock product and click Sign in to add to cart. You're on the Sign in placeholder, and the address is /login?next=%2Fproducts%2F.... That's the "come back here afterwards" note, with the slashes written in address-safe form (%2F).

Step 5: Build and commit

Stop the dev server, then:
npm run build
cd ..
git add frontend
git commit -m "Product detail page: breadcrumb, stock, quantity picker, not-found handling, prefetch on hover, tab titles"



lesson.

Phase 12, Lesson 12.1: Signing in and registering from the frontend

Lesson 11.3 committed as 1fd4dff. (That build's "larger than 500 kB" note is still only a suggestion. It's on my list for before deployment.)

What & why

The backend has had login since Phase 5, but the shop's Sign in page is still a placeholder, so customers can't use their accounts yet. This lesson makes the frontend a real front door:
- a Sign in form and a Create account form, with clear error messages
- keeping the customer logged in, including after closing and reopening the page
- the header changing to "Hi, Ana" with a Sign out button
- after signing in, returning the customer to where they came from (for example, the product they wanted to buy)

What happens now

Signing in:
1. The customer enters email and password and presses Sign in. The button changes to "Signing in..." and can't be clicked twice.
2. The shop sends them to the API's login address (Lesson 5.1) and gets back the two tokens: the short-lived access token (15 minutes) and the long-lived refresh token (7 days).
3. It immediately asks the API "who am I?" (/api/auth/me/, Lesson 5.2) to learn the customer's name and whether they're an admin.
4. A small message pops up at the top, "Welcome back, Ana!", and the header now shows Hi, Ana and Sign out instead of Sign in.
5. The customer is sent back to the page they came from. Remember the "Sign in to add to cart" button that added ?next=/products/chef-knife (Lesson 11.3)? That's used now. They land on the Chef Knife again, and the button there has changed.
6. Wrong password: "Wrong email or password." We deliberately don't say which one was wrong, for the same reason the API doesn't (Lesson 5.1).

Where the tokens are kept (a security decision):
- The access token stays only in the page's memory. It's sent automatically with every request to the API, which is how the API knows who's asking. It vanishes when the tab is closed or reloaded, which makes it harder to steal.
- The refresh token is saved in the browser's own small storage area (localStorage), so it survives a reload. Its only job is to get new access tokens.
- When the page opens and a refresh token is saved, the shop quietly swaps it for a fresh access token and asks "who am I?" again. The customer stays logged in without typing anything. While that check is running, the header shows a small grey placeholder instead of flickering between "Sign in" and "Hi, Ana".
- If the saved refresh token is expired or invalid, it's thrown away, and the customer simply sees "Sign in". If the server is just unreachable, the token is kept, so a network hiccup doesn't log anyone out.
- An honest trade-off: anything in localStorage can be read by JavaScript running on our page. If a malicious script ever got onto the shop (an "XSS" attack), it could steal the refresh token. The main defence is never letting untrusted scripts onto the page. React already protects against the most common way in (it treats text as text, never as code). Bigger shops keep the refresh token in a special cookie that JavaScript can't read at all, but that needs extra backend setup, so it's beyond this course.

Registering:
- The form asks for first name, last name, username, email, and password. The server decides whether it's valid (Lesson 5.2), and its messages appear under the right field, for example "An account with this email already exists." under Email and "A user with that username already exists." under Username.
- The server checks the password rules (length, too common, only numbers) after the other fields are fine. So if the email and username are already taken, you'll see those errors first, and the password errors once those are fixed.
- On success, the customer is logged in straight away and sees "Welcome to ShopLite, Ana!". Nobody wants to type their details twice.

Signing out:
- Both tokens are removed from memory and storage.
- Everything loaded for that customer is forgotten (later, their cart and orders), so the next person using the same computer can't see them.
- They see "You are signed out.", return to the home page, and the header shows Sign in again.

Two safety details:
- If someone who is already signed in opens the Sign in or Create account page, they're simply sent on to their destination.
- The "go back to where you came from" address is only accepted if it points inside our shop. Otherwise a trick link like /login?next=https://evil-site.example could send customers to a fake website right after they sign in. This is called an open redirect, and it's a common phishing trick.

On the product page: signed-out visitors still see "Sign in to add to cart". Signed-in customers see "Add to cart (Phase 13)", greyed out until the cart pages exist.

What I built

- The login state for the whole app: who is signed in, plus sign in, register, and sign out, available to every page and to the header
- Token handling: where tokens are kept, and the automatic attachment of the access token to every API request, done once in the shared connection (the place I mentioned in Lesson 11.2)
- Real Sign in and Create account pages, with a reusable "labelled box with error messages" piece that we'll reuse for the checkout form
- Pop-up messages (the shadcn sonner component from Lesson 10.2) switched on for the whole shop
- The header with the greeting and Sign out
- The "stay inside our shop" check for ?next=

No new packages this time.

---

▶️ Your turn

Django running in Window 1; in the frontend window:
cd "$env:USERPROFILE\OneDrive\Desktop\django-ecommerce\frontend"
npm run dev

Step 1: From a product to signing in, and back

1. Open http://localhost:5173/products/chef-knife and click Sign in to add to cart.
2. Enter ana.silva@example.com and a wrong password, then press Sign in. You get Wrong email or password.
3. Enter the right password (Sunny-Garden-42). You'll see:
   - the pop-up "Welcome back, Ana!"
   - you're back on the Chef Knife page
   - the header says Hi, Ana and Sign out
   - the button now says Add to cart (Phase 13)

Step 2: Look at the tokens

Press F12:
1. Network tab → Fetch/XHR → reload the page (F5). You'll see refresh/ first (swapping the saved refresh token for a new access token), then me/, and you're still signed in. Click me/ → Headers → Request Headers: there's Authorization: Bearer eyJ..., attached automatically.
2. Application tab → Local storage → http://localhost:5173: one entry, shoplite.refresh. That's the refresh token and nothing else. The access token is nowhere in storage, only in memory.

Step 3: Sign out

Click Sign out. You get "You are signed out.", you're on the home page, and the header shows Sign in. In Application → Local storage, shoplite.refresh is gone. Reload, and you stay signed out.

Step 4: Registration errors, then a new account

Click Sign in → Create one:
1. Fill in username customer1, email CUSTOMER@example.com, password 12345678, and press Create account. Errors appear under Username (already exists) and Email (already exists, even with different capitals, Lesson 5.2).
2. Change the username to carol and the email to carol@example.com (keep 12345678), and submit. Now the password errors appear: too common and entirely numeric.
3. Use a proper password, for example Blue-River-2026, add first name Carol, and submit. You get "Welcome to ShopLite, Carol!", you're signed in immediately, and the header says Hi, Carol.

Step 5: The open-redirect guard

Sign out, then open http://localhost:5173/login?next=https://example.com and sign in as Carol. You land on the ShopLite home page, not on example.com. The foreign address was ignored.

Step 6: Build and commit

Stop the dev server, then:
npm run build
cd ..
git add frontend
git commit -m "Frontend sign in / register / sign out: auth state, token storage, Authorization header, header greeting, safe next redirect"

---

❓ If something goes wrong
2. Change the username to carol and the email to carol@example.com (keep 12345678), and submit. Now the password errors appear: too common and entirely numeric.
3. Use a proper password, for example Blue-River-2026, add first name Carol, and submit. You get "Welcome to ShopLite, Carol!", you're signed in immediately, and the header says Hi, Carol.

Step 5: The open-redirect guard

Sign out, then open http://localhost:5173/login?next=https://example.com and sign in as Carol. You land on the ShopLite home page, not on example.com. The foreign address was ignored.




Understood. No more Playwright. I've stopped my temporary servers and saved that preference for future sessions. Here's the lesson.

Phase 12, Lesson 12.2: Staying signed in and protecting pages

Lesson 12.1 committed as 5a5c30f. (The dependency optimized: sonner / next-themes ... reloading lines were Vite preparing the new pop-up library the first time it was used. That's a one-time thing.)

What & why

Two gaps remain from the last lesson:
1. The 15-minute problem. The access token expires after 15 minutes. After that, every request that needs login (cart, orders, account) would fail with 401, even though the customer is still "signed in" with a valid 7-day refresh token. The customer shouldn't notice any of this.
2. Pages for the right people. Cart, orders, and account only make sense for a signed-in customer. The admin area is for staff. Visitors who open these addresses (from a bookmark, or by typing them) need to be guided sensibly, not shown a broken page.

What happens now

When the access token expires in the middle of shopping:
1. A request fails with 401 because the 15-minute token is too old.
2. The shop catches that failure before the page sees it, and sends the refresh token to the API to get a new access token.
3. It repeats the original request with the new token. It succeeds, and the page gets its answer as if nothing had happened.
4. If several requests fail at the same moment (for example, the cart and the order list loading together), they all wait for one single renewal instead of each starting its own.
5. Each request is repeated at most once, so a genuine "you're not allowed" can't cause an endless loop.
6. If the refresh token itself is no longer accepted (after 7 days, or if it's been tampered with), the session is really over: the shop signs the customer out, shows "Your session has expired. Please sign in again.", and a protected page sends them to Sign in (and back afterwards).
7. If the server is simply unreachable, nobody is signed out. That's just a network problem, handled like the other connection errors.

This is exactly the 401 → refresh → retry idea from Lesson 5.1, now automatic. It's also why the API had to answer 401 for "not authenticated" and 403 for "not allowed": only 401 triggers a renewal.

Signed-in-only pages (/cart, /orders, /account):
- A visitor who opens one is sent to Sign in, with the page remembered: /login?next=%2Faccount. After signing in, they land back on that page.
- While the shop is still checking a saved login (right after opening the page), a grey placeholder is shown briefly, so signed-in customers aren't wrongly sent to Sign in during that split second.

Admin-only pages (/admin, which the admin screens will fill in Phase 14):
- Visitors are sent to Sign in.
- Signed-in customers who aren't staff see "Staff only — This part of the shop is only for administrators."
- Staff see the (placeholder) store management page.
- This is only for tidiness. The real protection is in the API (Lessons 4.3, 7.4): even if someone got past the screen, every admin request is refused with 403. The golden rule from Lesson 0.1 again: the frontend is for convenience, the backend enforces the rules.

The header now shows, for signed-in customers: Orders, Admin (staff only), Hi, Ana (a link to the account page), and Sign out.

The account page (/account) shows the email, "member since", and an Administrator badge for staff. It lets customers change their first name, last name, and username. Saving sends only those fields to the API, and the header greeting updates immediately (for example, Hi, Anna). The server's messages appear under the right field (for example, "A user with that username already exists."). The email isn't editable here. It's the login identity, and the API refuses to change it (Lesson 5.2).

What I built

- Automatic renewal of the access token, including the "one renewal for many requests" and "repeat only once" rules, in the shared API connection
- Signing out when the session truly expires, with the warning message
- Two page guards: "signed-in only" and "staff only"
- The account page (a new form, reusing the error-message boxes from Lesson 12.1)
- Placeholder pages for My orders (Phase 13) and Store management (Phase 14)
- The new header links
- The cart page is now signed-in only

What I tested: the build passes. Before you asked me to stop using the browser automation, I had already confirmed in a real browser that:
- /account sent a visitor to /login?next=%2Faccount, and signing in returned there
- /admin showed Staff only for Ana
- with 1-minute tokens, after the token expired, saving the account caused exactly me 401 → refresh 200 → me 200 and Your details were saved.

Not tested by me: the "session expired" message (Step 6 below). Please check that one.

---

▶️ Your turn

Django running normally in Window 1; in the frontend window:
cd "$env:USERPROFILE\OneDrive\Desktop\django-ecommerce\frontend"
npm run dev

Step 1: Signed-in-only pages

Make sure you're signed out, then type http://localhost:5173/account in the address bar.
- You're on Sign in, and the address is /login?next=%2Faccount.
- Sign in as Ana, and you land on My account.

Sign out and try http://localhost:5173/cart and /orders: the same behaviour.

Step 2: The account page

Signed in as Ana:
1. Change First name to Anna and click Save changes. You get "Your details were saved.", and the header says Hi, Anna straight away. Change it back to Ana.
2. Change Username to bob and save. Under Username you get "A user with that username already exists." Put back ana.

Step 3: Staff-only pages

- As Ana, open http://localhost:5173/admin. You get Staff only, and there's no Admin link in her header.
- Sign out, then sign in with your admin account. The header now has Admin. Click it to see the Store management placeholder. My account shows the Administrator badge.

Step 4: Automatic renewal (with 1-minute tokens)

In Window 1, restart Django with short-lived tokens (a real setting in the window beats .env, Lesson 2.3):
cd "$env:USERPROFILE\OneDrive\Desktop\django-ecommerce\backend"
$env:JWT_ACCESS_MINUTES = "1"
uv run python manage.py runserver
In the browser:
1. Sign out and sign in again as Ana, so you get a token that only lasts 1 minute, and open My account via the header link.
2. Press F12 → Network → Fetch/XHR, and clear the list.
3. Wait at least 2 minutes without reloading the page.
4. Click Save changes. In the Network list you'll see me/ 401 (red), then refresh/ 200, then me/ 200, and the page just says "Your details were saved." The customer never noticed the expired token.

Step 5 is intentionally skipped

(Nothing to do here: the old Step 5 was merged into Step 4.)

Step 6: A truly expired session

Still with 1-minute tokens, on My account:
1. F12 → Application → Local storage → http://localhost:5173 → double-click the value of shoplite.refresh and replace it with broken. This simulates a refresh token that's no longer valid.
2. Wait at least 2 minutes (so the access token in memory has also expired).
3. Click Save changes. Expected: the yellow message "Your session has expired. Please sign in again.", the header switches to Sign in, and you're taken to the Sign in page with ?next=%2Faccount.

Please tell me what you see here, since this is the one path I couldn't finish testing.

2. Wait at least 2 minutes (so the access token in memory has also expired).
3. Click Save changes. Expected: the yellow message "Your session has expired. Please sign in again.", the header switches to Sign in, and you're taken to the Sign in page with ?next=%2Faccount.

Please tell me what you see here, since this is the one path I couldn't finish testing.

Step 7: Back to normal

In Window 1: Ctrl+C, then:
Remove-Item Env:JWT_ACCESS_MINUTES
uv run python manage.py runserver





Phase 13, Lesson 13.1: Add to cart, the cart badge, and the cart page

Lesson 12.2 committed as bf126a8. If you haven't tried Step 6 from that lesson (the "session expired" message) yet, it's worth doing some time. It's the one path I couldn't finish testing myself.

What & why

Signed-in customers can now see products, but they still can't buy anything: the button says "Add to cart (Phase 13)" and the cart page is a placeholder. This lesson connects the shop's buying flow to the cart API from Phase 6:
- Add to cart on the product page, with the chosen quantity
- a little number on the cart icon in the header, showing how many pieces are in the cart, on every page
- a real cart page: see your items, change quantities, remove lines, empty the whole cart, see problems, and go on to checkout

What happens now

Adding a product:
1. On a product page, a signed-in customer picks a quantity and clicks Add to cart. The button shows "Adding..." and can't be clicked twice.
2. The shop sends the product and quantity to the API. The API checks the stock again (Lesson 6.3), because the page may be minutes old and someone else may have bought the last ones meanwhile.
3. Success: a message pops up, "Added 2 × Chef Knife to your cart.", with a View cart button inside it. The quantity picker goes back to 1, and the number on the cart icon goes up immediately.
4. Too many: the API's own sentence is shown as a red message, for example 'Only 5 of "Chef Knife" in stock. You already have 4 in your cart.' The cart stays unchanged.

Why the badge updates instantly, without any extra loading:
- Every cart answer from the API contains the whole, updated cart (we designed it that way in Lesson 6.3). The frontend simply replaces its remembered cart with that answer.
- The header's badge and the cart page both show that one remembered cart, so both change at the same moment.
- This is the same memory from Lesson 11.2. The cart is just one more thing stored in it, and only for signed-in customers. Visitors never load a cart. After signing out, the remembered cart is forgotten (Lesson 12.1), so the next person doesn't see it.

On the cart page:
- Each line shows the picture, the name (a link back to the product), the price each, the line total, a quantity picker, and Remove.
- Changing a quantity saves immediately. While it's saving, that line fades slightly. The picker won't go above the stock. If the API refuses anyway (the stock changed meanwhile), the red message explains why.
- Remove takes a line out, with a short message "Chef Knife was removed from your cart."
- Problems the API reports on a line (Lesson 6.3), such as "Only 2 left in stock." or "This product is no longer available.", appear in red on that line. While any line has a problem, Proceed to checkout is greyed out, with a note explaining why. Checkout would refuse such a cart anyway (Lesson 7.3), but it's better to show the reason here. If you have more in the cart than the stock, the − button still works so you can lower it.
- The summary shows the number of pieces and the total, calculated by the server from current prices (Lesson 6.1).
- Empty cart first opens a confirmation dialog, "Empty your cart? All items will be removed. This can't be undone.", with Keep my items and Empty cart buttons. It's the shadcn/Radix dialog from Lesson 10.2: the keyboard stays inside it, and Esc closes it.
- An empty cart shows "Your cart is empty" and a Browse products button.
- Proceed to checkout opens /checkout, a placeholder until the next lesson.

What I built

- The cart connection: view, add, change quantity, remove, empty, plus the rule "store the server's answer as the new cart"
- A type description of the cart, matching the backend's JSON
- The Add to cart button, with its messages
- The badge on the header's cart icon
- The cart page, with its lines, summary, problem messages, empty state, and confirmation dialog
- A small helper that picks the most useful sentence from an API error, so red messages show the API's own words
- A placeholder checkout page, open to signed-in customers only

Tested: the TypeScript check, build, and lint pass. I haven't clicked through it in a browser this time, so the steps below are the real test.

---

▶️ Your turn

Django and the worker running (docker compose ps should show worker up); in the frontend window:
cd "$env:USERPROFILE\OneDrive\Desktop\django-ecommerce\frontend"
npm run dev

Step 1: Add to cart

1. Sign in as Ana and open the Chef Knife.
2. Set the quantity to 2 and click Add to cart. You get "Added 2 × Chef Knife to your cart.", and the cart icon shows 2.
3. Add 2 more. The badge shows 4.
4. Try 2 more again. With only 5 in stock, you get the red message 'Only 5 of "Chef Knife" in stock. You already have 4 in your cart.' and the badge stays at 4.
5. Open the Blue Ceramic Mug, add 1, and click View cart inside the pop-up message.

Step 2: The cart page

1. You see two lines (knife ×4, mug ×1), each with its line total, and the summary shows 5 items and the total.
2. Click + on the mug. The line fades briefly, and the line total, the summary total, and the header badge all change together.
3. On the knife, + stops at 5 (the stock).
4. Click Remove on the mug. The line disappears with a message.
5. Press F12 → Network → Fetch/XHR and change a quantity again. There's exactly one request (PATCH .../cart/items/.../), and no separate "reload the cart" request afterwards. The answer already contained the whole cart.

Step 3: A problem appearing later

Keep the cart page open with the knife in it. In a second tab, open the Django admin (http://127.0.0.1:8000/admin/), sign in with your admin account, and set the Chef Knife's stock to 2. Back in the shop tab, switch away and back (or wait a little). The cart is re-checked:
- the knife line says "Only 2 left in stock." in red
- Proceed to checkout is greyed out, with the note underneath

Lower the knife to 2 with −. The red text and the note disappear, and the button works again. Set the stock back to 5 in the admin afterwards.

Step 4: Empty the cart

Click Empty cart. The dialog opens. Press Esc, and it closes with nothing changed. Click it again, then Empty cart in the dialog. You see "Your cart is empty", and the badge disappears.

Step 5: Signing out forgets the cart

Add something, then Sign out. The badge disappears immediately. Sign back in, and it reappears (the cart is stored on the server, per customer, Lesson 6.1).

Step 6: Build and commit

Stop the dev server, then:
npm run build
cd ..
git add frontend
git commit -m "Frontend cart: add to cart, header badge, cart page with quantities, removal, issues and empty-cart dialog"
- the knife line says "Only 2 left in stock." in red
- Proceed to checkout is greyed out, with the note underneath

Lower the knife to 2 with −. The red text and the note disappear, and the button works again. Set the stock back to 5 in the admin afterwards.

Step 4: Empty the cart

Click Empty cart. The dialog opens. Press Esc, and it closes with nothing changed. Click it again, then Empty cart in the dialog. You see "Your cart is empty", and the badge disappears.

Step 5: Signing out forgets the cart

Add something, then Sign out. The badge disappears immediately. Sign back in, and it reappears (the cart is stored on the server, per customer, Lesson 6.1).

1. the red message from Step 1.4,