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
