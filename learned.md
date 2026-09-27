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