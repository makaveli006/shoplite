# ShopLite on AWS: the deployment, explained for interviews

This document explains how ShopLite (Django + React) was deployed to AWS **by hand in the console**, with a real CI/CD pipeline, and then fully torn down. It covers what every piece does, why it was chosen, what went wrong and how it was fixed, what it cost, and the questions an interviewer is likely to ask.

The Terraform version of the same setup is described separately in `INTERVIEW-TERRAFORM.md`.

> No secrets, account numbers or live addresses appear in this file. The CloudFront address is written as `dxxxx.cloudfront.net`.

---

## 1. The 30-second summary

> "I deployed a Django REST + React e-commerce app to AWS in us-east-1. The React build sits in a private S3 bucket and the Django API runs as Docker containers on ECS Fargate in private subnets, behind an Application Load Balancer. CloudFront is the single HTTPS front door: it serves the React app from S3 and forwards `/api/*` to the load balancer, so there's one domain, no CORS and a free TLS certificate. Data is in RDS PostgreSQL, and Celery uses ElastiCache (Valkey) as its queue; both are in private subnets reachable only from the app's security groups. Secrets are in SSM Parameter Store and injected into containers at start-up. Deployments run from GitHub Actions using OIDC, so no AWS keys are stored in GitHub: after CI passes and a reviewer approves, the pipeline builds the images, pushes them to ECR, runs migrations as a one-off task, does a rolling deploy with no downtime, and uploads the frontend to S3 with a CloudFront invalidation. When testing was done, I tore everything down and verified nothing was left billing."

---

## 2. Architecture

```
                         Browser
                            │  HTTPS (AWS certificate on *.cloudfront.net)
                            ▼
                 ┌─────────────────────┐
                 │     CloudFront      │  one address for the whole shop
                 └─────────────────────┘
      default (*)     │ /media/*      │ /api/*, /api-auth/*, /django-admin/*, /static/*
   + SPA function     │               │ + secret header X-Origin-Verify
          ▼           ▼               ▼
   S3 "frontend"   S3 "media"    Application Load Balancer (public subnets, 2 AZs)
   (React build)   (uploads)       │  only accepts CloudFront (prefix list + secret header)
   private, OAC    private, OAC    ▼
                              ECS Fargate "web" service ──────────┐
                              (Gunicorn + Django + WhiteNoise)    │
                              private subnets, no public IP       │
                                     │            │               │ uploads (task role)
                                     ▼            ▼               ▼
                              RDS PostgreSQL   ElastiCache      S3 "media"
                              (private)        Valkey (private)
                                                  ▲
                              ECS Fargate "worker" service (Celery) ── sends emails

   Private subnets reach the internet (ECR, Razorpay, SMTP) through one NAT gateway.
   Secrets: SSM Parameter Store. Logs: CloudWatch Logs.
   Deploys: GitHub Actions → OIDC → ECR, ECS, S3, CloudFront.
```

### How a request travels

- **Opening a page** (`/products/gel-pen-set`): CloudFront's default behaviour goes to the frontend bucket. A tiny **CloudFront Function** sees there's no dot in the last part of the path and rewrites it to `/index.html`, so React Router can draw the page. Files like `/assets/index-abc123.js` have a dot, so they're served as they are.
- **An API call** (`/api/products/`): CloudFront matches `/api/*`, adds the secret `X-Origin-Verify` header and forwards it to the ALB over HTTP. The ALB's listener rule checks the header and sends the request to a healthy web container. Django answers; nothing is cached.
- **Django admin CSS** (`/static/admin/...`): goes to the ALB too, where **WhiteNoise** serves the files that `collectstatic` baked into the image. CloudFront caches them.
- **A product picture** (`/media/products/pen.jpg`): CloudFront reads it straight from the media bucket. Django never touches it.
- **An image upload in the admin**: the browser sends it to Django; Django saves it to the media bucket using the **task role's** permissions (no keys in the code).
- **An order email**: Django puts a job on the Valkey queue after the database transaction commits; the Celery worker picks it up and sends the email.
- **A Razorpay webhook**: Razorpay calls `https://dxxxx.cloudfront.net/api/payments/webhook/`. That's the same path as any API call, so the signed webhook reaches Django without a tunnel.

### Why this shape

- **One HTTPS address for everything.** CloudFront serves both the React app and the API, so the browser sees one origin: no CORS setup, cookies and CSRF behave simply, and HTTPS is free without buying a domain.
- **Nothing important is reachable directly.** The database, the cache and the containers have no public IP. The load balancer is public, but it only answers CloudFront.
- **Stateless containers.** Uploads go to S3 and sessions/tokens don't live on disk, so any container can be replaced at any moment. That's what makes rolling deploys and self-healing work.
- **No long-lived AWS keys.** The pipeline gets a short-lived token through OIDC; the containers get permissions from their IAM roles.

---

## 3. Every AWS service used, and why

| Service | What it is | Why it was used here | What it replaced / alternative |
|---|---|---|---|
| **VPC** | Your own private network in AWS | Keeps the database, cache and containers off the internet | Default VPC (everything public: not acceptable) |
| **Subnets (2 public, 2 private, 2 AZs)** | Slices of the VPC, each in one data centre (Availability Zone) | Public: ALB and NAT. Private: containers, DB, cache. ALB and RDS subnet groups need 2 AZs | — |
| **Internet Gateway** | The VPC's door to the internet | Lets the public subnets (ALB, NAT) talk to the internet | — |
| **NAT Gateway + Elastic IP** | Lets private resources make *outgoing* connections without being reachable | Containers must pull images, call Razorpay and send email | VPC endpoints for ECR/logs/SSM (more setup, no internet for Razorpay) |
| **S3 gateway endpoint** | A free private route from the VPC to S3 | Media uploads and image-layer downloads don't go through (paid) NAT | — |
| **Security groups** | Firewalls attached to each resource | Chained rules: "only the ALB may reach the web port" | NACLs (stateless, subnet-wide: kept at the defaults) |
| **RDS PostgreSQL 16 (db.t4g.micro)** | Managed database | Backups, patching and encryption handled by AWS; the search features need PostgreSQL (full-text, trigram) | Postgres in a container (data lost with the container) |
| **ElastiCache Valkey (cache.t4g.micro)** | Managed Redis-compatible cache | Celery's message queue | Valkey was chosen over Redis OSS: same protocol, about 20% cheaper |
| **ECR** | Private Docker image registry | Stores the web and worker images; tags are **immutable** and a lifecycle rule keeps the last 5 | Docker Hub (public, rate limits) |
| **ECS on Fargate** | Runs containers without managing servers | Web and worker services; AWS restarts failed tasks and does rolling deploys | EC2 + Docker Compose, EKS, App Runner (see §14) |
| **Application Load Balancer** | Spreads HTTP traffic over healthy containers | Health checks, rolling deploys without downtime, the secret-header rule | Pointing CloudFront at a single container (no health checks) |
| **CloudFront** | AWS's CDN and edge proxy | Free HTTPS certificate, one address, caching, path-based routing to S3 or ALB | Buying a domain + ACM certificate on the ALB |
| **CloudFront Function** | Tiny JavaScript run at the edge per request | SPA routing: page addresses → `index.html` (only on the default behaviour, so real API 404s stay 404s) | "Custom error response 403/404 → index.html" (also hides API errors) |
| **S3 (2 buckets)** | Object storage | Frontend build and uploaded media; both **private**, readable only by CloudFront through **Origin Access Control** | Public buckets / static website hosting (no HTTPS, public data) |
| **SSM Parameter Store (SecureString)** | Encrypted key-value store | Django secret key, DB password, Razorpay secrets, superuser password; free for standard parameters | Secrets Manager ($0.40 per secret per month, adds automatic rotation) |
| **IAM** | Who may do what | An execution role, 2 task roles, the GitHub deploy role and the OIDC provider, each least-privilege | Access keys in GitHub secrets (long-lived, leakable) |
| **CloudWatch Logs** | Central log storage | Each container's stdout goes to `/ecs/shoplite-{web,worker,migrate}`, kept 1 day | SSH-ing into servers to read files (impossible on Fargate) |
| **AWS WAF** | Web application firewall | Not planned: CloudFront's new setup wizard attached one by default (see §12) | — |

---

## 4. Networking in detail

### The VPC layout

- **VPC:** `10.0.0.0/16` (65,536 addresses), created with the "VPC and more" wizard.
- **Public subnets:** `10.0.0.0/20` (us-east-1a) and `10.0.16.0/20` (us-east-1b). Their route table sends `0.0.0.0/0` to the **Internet Gateway**.
- **Private subnets:** `10.0.128.0/20` and `10.0.144.0/20`. Their route tables send `0.0.0.0/0` to the **NAT Gateway**, plus the S3 prefix list to the **S3 gateway endpoint**.
- **One NAT gateway**, in one AZ, to save money. Production would have one per AZ (see §13).

**Public vs private, in one sentence:** a subnet is "public" only because its route table points at an Internet Gateway; a private subnet has no route in from the internet, and goes out only through the NAT.

### Security-group chaining

Rules point at *other security groups*, not IP addresses, so they keep working as containers come and go:

| Security group | Inbound rule | Meaning |
|---|---|---|
| `shoplite-alb-sg` | TCP 80 from the prefix list `com.amazonaws.global.cloudfront.origin-facing` | Only CloudFront's servers can even open a connection to the ALB |
| `shoplite-web-sg` | TCP 8000 from `shoplite-alb-sg` | Only the ALB can reach Gunicorn |
| `shoplite-worker-sg` | none | The worker only makes outgoing connections |
| `shoplite-db-sg` | TCP 5432 from `web-sg` and `worker-sg` | Only the app can reach PostgreSQL |
| `shoplite-redis-sg` | TCP 6379 from `web-sg` and `worker-sg` | Only the app can reach Valkey |

The migration task reuses `web-sg`, so it can reach the database.

### Why the ALB needs two locks

1. **The prefix list** stops anyone on the internet from connecting to the ALB — but *any* CloudFront distribution (including someone else's) comes from those same addresses.
2. **The secret header.** Our distribution adds `X-Origin-Verify: <40-character secret>` to every request it sends to the ALB. The listener rule forwards only requests carrying that value; the **default action is a fixed 403**. So only *our* distribution gets through.

### HTTPS

The browser speaks HTTPS to CloudFront (redirect HTTP → HTTPS, TLS 1.2+, AWS's certificate for `*.cloudfront.net`). CloudFront → ALB is plain HTTP inside AWS's network, which is common for this setup; production with a custom domain would add an ACM certificate on the ALB and use HTTPS for that hop too.

Because Django only sees HTTP from the ALB, it would think every request is insecure (and redirect forever, or refuse secure cookies). CloudFront adds the header `CloudFront-Forwarded-Proto: https`, and Django is told to trust it:
`SECURE_PROXY_SSL_HEADER = ('HTTP_CLOUDFRONT_FORWARDED_PROTO', 'https')` (set through the `DJANGO_SECURE_PROXY_SSL_HEADER` environment variable).

---

## 5. Security, layer by layer

- **Edge:** HTTPS only; CloudFront hides the ALB's address.
- **Load balancer:** CloudFront-only prefix list + secret header, default 403.
- **Network:** containers, database and cache in private subnets without public IPs; chained security groups.
- **Data:** RDS encrypted at rest, `DB_SSLMODE=require` so Django only talks to Postgres over TLS; S3 buckets private with Block Public Access on, read through OAC only.
- **Secrets:** never in the image, the repository or the task-definition JSON — only SSM ARNs are in the task definition, and ECS fetches the values at start-up.
- **Identity:** no long-lived access keys anywhere in the deployment. Humans use the console with MFA; GitHub uses OIDC; containers use IAM roles.
- **Least privilege:** each role can do only its own job (details in §6).
- **Django itself:** `DEBUG=False`, strict `ALLOWED_HOSTS` (the CloudFront domain only), `CSRF_TRUSTED_ORIGINS`, secure cookies, HSTS, the admin moved to `/django-admin/`.
- **Containers:** they run as a non-root user (`appuser`).
- **Public repository:** the account number is masked in the Actions logs (`mask-aws-account-id: true`), the role ARN is a GitHub *secret*, and the filled-in JSON files with real IDs are git-ignored (`*.local.json`).

---

## 6. Identity and permissions (IAM)

### Four roles, each with one job

| Role | Used by | Can do |
|---|---|---|
| `shoplite-ecs-execution-role` | **ECS itself**, before the container starts | Pull images from ECR, write logs (AWS managed policy `AmazonECSTaskExecutionRolePolicy`) + `ssm:GetParameters` on `parameter/shoplite/*` only |
| `shoplite-web-task-role` | **The Django code** inside the web container | Get/Put/Delete objects under `media/*` in the media bucket, and list it |
| `shoplite-worker-task-role` | **The Celery code** | Only *read* media (for email thumbnails) |
| `shoplite-github-deploy` | **GitHub Actions**, through OIDC | Push to the two ECR repositories; register task definitions; update the two services; run only the `shoplite-migrate` task, only in `shoplite-cluster`; `iam:PassRole` for exactly the three roles above, only to `ecs-tasks.amazonaws.com`; write to the frontend bucket; invalidate that one distribution |

**Execution role vs task role** (a classic interview question): the execution role is what the *ECS agent* uses to set the container up (pull the image, fetch secrets, send logs). The task role is what *your application code* uses at runtime (e.g. boto3 → S3). The migrate task has no task role at all, because migrations don't touch S3.

**`iam:PassRole`:** registering a task definition that names a role means "let ECS act as this role". Without a limit, the deploy role could hand ECS an admin role and escalate. The policy only allows passing the three ShopLite roles, and only to ECS tasks (`iam:PassedToService` condition).

### GitHub → AWS without keys (OIDC)

1. The workflow has `permissions: id-token: write`, so GitHub can mint a short-lived signed token (a JWT) for this run.
2. The token says who is asking: issuer `token.actions.githubusercontent.com`, audience `sts.amazonaws.com`, and a **subject** like "this repository, environment `production`".
3. `configure-aws-credentials` sends the token to AWS STS (`AssumeRoleWithWebIdentity`).
4. AWS checks the signature against the **OIDC identity provider** registered in IAM, and the role's **trust policy** checks the audience and the exact subject.
5. STS returns temporary credentials that expire in about an hour. Nothing is stored in GitHub except the role's ARN.

Because the trust policy pins the subject to the `production` **environment**, a workflow on a random branch or a fork can't assume the role, and every deploy needs the environment's required reviewer to approve first.

---

## 7. Secrets and configuration

- **Plain settings** (not secret) are environment variables in the task definition: `DJANGO_ALLOWED_HOSTS`, `DB_HOST`, the bucket name, `CELERY_BROKER_URL`, `DJANGO_ADMIN_URL`, etc.
- **Secrets** are **SSM SecureStrings** under `/shoplite/` (encrypted with the AWS-managed KMS key): `DJANGO_SECRET_KEY`, `DB_PASSWORD`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, `DJANGO_SUPERUSER_PASSWORD`. The task definition's `secrets` section lists their ARNs; ECS reads them with the execution role and passes them to the container as environment variables.
- The values were typed into the console by hand. They never appeared in chat, Git or the logs.
- **Changing a secret** means a new deployment (containers read the values only when they start).
- The **pipeline's configuration** lives in GitHub: repository variables `DEPLOY_ENABLED` / `DEPLOY_IMAGES_ONLY`, `production` environment variables (cluster, service, family names, subnets, bucket, distribution ID), and the environment secret `AWS_ROLE_ARN`.

---

## 8. What had to change in the code to run in the cloud

All on the branch `feature/aws-deploy`; local development still works exactly as before because every cloud feature is switched on by environment variables.

| Problem | Change |
|---|---|
| The Dockerfile only started Celery; no web server | Multi-stage Dockerfile: `base` (dependencies with uv) → `web` (Gunicorn, 2 workers) → `worker` (Celery). One build, two images, same code |
| Nothing served the admin's CSS/JS with `DEBUG=False` | **WhiteNoise** middleware + `CompressedManifestStaticFilesStorage`; `collectstatic` runs **at image build time** with placeholder env vars |
| Uploads went to the container's disk, which disappears when the container is replaced | **django-storages** `S3Storage` when `AWS_STORAGE_BUCKET_NAME` is set: files under `media/`, URLs on the CloudFront domain, no signed URLs, no ACLs, credentials from the task role |
| Email thumbnails opened `product.image.path`, which doesn't exist on S3 | `product.image.open('rb')`, which works with any storage |
| The ALB health check uses the container's IP as the Host, which `ALLOWED_HOSTS` rejects | `HealthCheckMiddleware`, **first** in `MIDDLEWARE`, answers `/healthz/` before the host check and the HTTPS redirect, and doesn't touch the database |
| Django behind CloudFront → ALB thinks requests are HTTP | `DJANGO_SECURE_PROXY_SSL_HEADER=HTTP_CLOUDFRONT_FORWARDED_PROTO` |
| RDS should be reached over TLS; connections are expensive to open | `DB_SSLMODE=require`, `CONN_MAX_AGE=60`, `CONN_HEALTH_CHECKS=True` |
| Fargate has no files to read logs from | `LOGGING` to stdout → CloudWatch; Django's own logger at ERROR |
| The React staff area and the Django admin both wanted `/admin` | `DJANGO_ADMIN_URL` setting: `admin/` locally, `django-admin/` on AWS |
| The frontend called `http://localhost:8000/api` | Built with `VITE_API_URL=/api` (same origin) |

Tests were added for the health check and the storage-based thumbnail; all 125 backend tests stay green.

---

## 9. CI/CD

### The flow

```
push to main ──► CI workflow (ci.yml)
                  ├─ backend: migrations check, tests against a Postgres service
                  └─ frontend: lint, tests, build
                         │ success
                         ▼
               Deploy workflow (deploy.yml), triggered by workflow_run
                         │ waits for a person to approve the "production" environment
                         ▼
  1. OIDC → temporary AWS credentials
  2. docker build --target web / --target worker, tag = commit SHA, push to ECR
  3. download the current task definitions, swap in the new image
  4. register the migrate task definition, run it as a one-off Fargate task,
     wait for it to stop, fail the deploy if its exit code isn't 0
  5. deploy the web service, wait for it to be stable
  6. deploy the worker service, wait for it to be stable
  7. npm ci && npm run build (VITE_API_URL=/api)
  8. s3 sync the build: fingerprinted files cached 1 year (immutable),
     index.html uploaded with no-cache
  9. CloudFront invalidation of /index.html only
```

### Design decisions worth explaining

- **CI and CD are separate workflows.** `deploy.yml` listens for `workflow_run` of the CI workflow on `main`, and its job only runs if CI's conclusion was `success`. `concurrency: deploy-production` means only one deploy at a time, and none is cancelled half-way.
- **Image tag = git commit SHA**, and ECR tags are immutable. You can always tell exactly which code is running, and roll back by redeploying an older SHA.
- **Migrations run before the new code**, as a separate one-off task, so they run exactly once (not once per container) and a failed migration stops the deploy before any traffic sees new code. This relies on migrations being backward-compatible with the old code for a few minutes (add columns first, remove them in a later release).
- **Rolling deployment:** ECS starts the new task, waits for the ALB health check to pass, then drains and stops the old one (minimum healthy 100%). **No downtime.** The **deployment circuit breaker** rolls back automatically if new tasks keep failing.
- **Frontend caching:** Vite puts a content hash in every JS/CSS filename, so those can be cached forever. Only `index.html` (which points at the newest filenames) must be fresh, so only it is invalidated — the first 1,000 invalidation paths per month are free.
- **The pipeline owns the image tag.** It downloads the *current* task definitions from AWS and only changes the image, so settings added in the console are kept.
- **Kill switch:** the repository variable `DEPLOY_ENABLED` must be `true`; delete it after teardown so pushes don't try to deploy to nothing.
- **First run:** ECS services can't be created before an image exists, so the very first run used `images_only` to fill ECR.

---

## 10. Logging and monitoring

- **Logs:** each container's stdout/stderr goes to CloudWatch Logs through the `awslogs` driver: `/ecs/shoplite-web` (Gunicorn access log + Django), `/ecs/shoplite-worker` (Celery; the console email backend prints emails here) and `/ecs/shoplite-migrate`. Retention: 1 day (it's a demo).
- **Where I looked when something broke:**
  - **ECS → service → Events / Deployments:** tasks failing health checks, rollbacks, "unable to pull secrets".
  - **ECS → stopped task → "Stopped reason"** and the container's exit code (e.g. the migrate task).
  - **EC2 → Target groups → Targets:** healthy / unhealthy and why.
  - **CloudWatch Logs:** Python tracebacks.
  - **curl against CloudFront** and the `Server:` header, to see *which* origin answered (`AmazonS3` vs `gunicorn` / `awselb`).
- **Health:** ALB target group health check on `/healthz/` (HTTP 200).
- **What production would add:** CloudWatch alarms (ALB 5xx rate, unhealthy host count, RDS CPU/free storage, queue depth) sent to SNS → email/Slack; Container Insights; error tracking (Sentry); a dashboard; ALB and CloudFront access logs to S3; CloudTrail (already on for the account) for "who changed what".

---

## 11. Cost

Prices in us-east-1, on demand; 1 USD = ₹95.90.

| Resource | ≈ USD / hour | ≈ INR / hour | Bills when "stopped"? |
|---|---|---|---|
| NAT gateway + its Elastic IP | 0.045 + 0.005 | ₹4.80 | Can't be stopped — bills until deleted, plus $0.045 per GB processed |
| ALB (+ LCU + 2 public IPv4 addresses) | ~0.0225 + ~0.008 + 0.010 | ~₹3.90 | Can't be stopped |
| Fargate web (0.5 vCPU, 1 GB) | ~0.025 | ~₹2.40 | Desired count 0 = $0 |
| Fargate worker (0.25 vCPU, 0.5 GB) | ~0.012 | ~₹1.20 | Desired count 0 = $0 |
| RDS db.t4g.micro + 20 GB gp3 | ~0.016 + ~0.003 | ~₹1.80 | Stopped: storage still bills; **auto-starts after 7 days** |
| ElastiCache Valkey cache.t4g.micro | ~0.0128 | ~₹1.23 | Can't be stopped |
| ECR, S3, CloudWatch Logs | cents per month | ~0 | Storage only |
| CloudFront | 0 (always-free: 1 TB + 10 M requests / month) | 0 | — |
| SSM standard parameters, IAM, OIDC, security groups, VPC | 0 | 0 | — |

- **Everything running:** about **$0.16–0.17 / hour ≈ ₹16 / hour** — about ₹380 a day, or **≈ ₹11,500 a month** if forgotten.
- **The expensive parts are the always-on network pieces** (NAT and ALB), not the containers.
- **Overnight pause** (used during the build): scale both services to 0, delete the NAT (release its IP) and the ALB, stop RDS. Only Valkey and storage kept billing (≈ ₹1.5 / hour). Resuming meant recreating the NAT and ALB (the ALB gets a new DNS name, so the CloudFront origin must be updated).
- **Surprise cost to know about:** CloudFront's new wizard attached a **WAF web ACL** (~$5 / month + ~$1 per rule group, prorated) — see §12.

---

## 12. Real problems I hit, and how I fixed them

These are the best interview material: each one is a real debugging story.

1. **"Not authorized to perform sts:AssumeRoleWithWebIdentity."**
   *Cause:* the repository uses GitHub's **immutable OIDC subject** format, which contains the owner and repository **IDs** (`repo:<owner>@<owner-id>/<repo>@<repo-id>:environment:production`), not just `repo:owner/repo:...`. The trust policy's `sub` didn't match.
   *Fix:* copied the exact subject format into the trust policy. *Lesson:* when OIDC fails, compare the token's claims with the trust policy condition — character for character.

2. **Every path returned the React app, even `/api/...`.**
   *Diagnosis:* `curl -i https://dxxxx.cloudfront.net/api/products/` showed `Server: AmazonS3`. The new CloudFront wizard had only created the S3 origin; the ALB and media origins and the path behaviours didn't exist.
   *Fix:* added the `alb` origin (with the `X-Origin-Verify` custom header) and the `media-s3` origin, and behaviours `/api/*`, `/api-auth/*`, `/django-admin/*` (caching disabled, all viewer headers forwarded), `/static/*` (cached) and `/media/*`. *Lesson:* check which origin answered using response headers.

3. **Two apps wanted `/admin`.** The React app has its own `/admin` staff pages; Django's admin was also at `/admin/`. A CloudFront behaviour `/admin/*` → ALB would have broken the React staff area.
   *Fix:* a `DJANGO_ADMIN_URL` setting (`django-admin/` on AWS, `admin/` locally) and a `/django-admin/*` behaviour. *Lesson:* with path-based routing on one domain, the URL namespaces of the apps behind it must not overlap.

4. **Image uploads failed with a CloudFront "Request blocked" 403**, but a 182-byte image worked.
   *Cause:* the CloudFront wizard had enabled **AWS WAF** with the core rule set, which blocks request bodies larger than **8 KB**.
   *Options:* exclude/override the `SizeRestrictions_BODY` rule for `/django-admin/*` and `/api/admin/*`, or upload straight to S3 with presigned URLs (the better design for big files anyway). For a short demo I left it and noted it. *Lesson:* know what a wizard turns on for you — it can cost money and change behaviour.

5. **A manually created task-definition revision ran old code.**
   *Cause:* I built revision 6 in the console from a stale local JSON that still had an older image tag.
   *Fix:* let the pipeline deploy (revision 7), since it always starts from the current revision and only changes the image. *Lesson:* one owner per field — the pipeline owns the image tag; manual edits must start from the latest revision.

6. **"Payments are not set up" after adding Razorpay keys.** The test happened before the new revision with the Razorpay settings had finished rolling out. *Lesson:* check the service's Deployments tab (primary vs active) before testing.

7. **The load balancer health check would have failed with `DisallowedHost`.** The ALB calls `http://10.0.x.x:8000/healthz/`, and Django rejects the IP as Host. Solved *before* deploying with the health-check middleware placed ahead of Django's host validation. (The alternative, adding the task's private IP to `ALLOWED_HOSTS` at start-up from the ECS metadata endpoint, is more moving parts.)

8. **The worker ran on UTC while local Windows ran on IST (before AWS).** A password-reset token built inside the worker looked hours old to the web process. The fix — build time-sensitive tokens in the web process and pass them to the task — matters even more in the cloud, where the processes run on different machines.

---

## 13. Trade-offs, and what real production would add

This was a cost-conscious, short-lived deployment. For a real shop I would add:

- **High availability:** RDS **Multi-AZ** (≈ doubles the DB cost), a NAT gateway **per AZ**, at least 2 web tasks spread over both AZs, ElastiCache with a replica.
- **Autoscaling:** ECS service auto scaling on CPU or ALB requests per target; Celery workers scaled on queue length.
- **A real domain:** Route 53 + an ACM certificate on CloudFront (us-east-1) and on the ALB, so CloudFront → ALB is HTTPS too.
- **Transport encryption for the cache:** ElastiCache in-transit encryption (`rediss://`) and an AUTH token.
- **WAF, tuned:** managed rule sets plus rate limiting on login and password reset, with the body-size rule relaxed only where uploads happen.
- **Uploads:** presigned S3 POSTs from the browser, so large files never pass through Django.
- **Secrets Manager** with automatic rotation for the DB password.
- **Cheaper outgoing traffic:** VPC interface endpoints for ECR, CloudWatch Logs and SSM, so image pulls don't pay NAT data charges.
- **Monitoring:** alarms + SNS, dashboards, Sentry, log retention of 30–90 days.
- **Safer releases:** blue/green deployments with CodeDeploy, or canaries; a staging environment deployed first.
- **Backups:** longer RDS backup retention, point-in-time recovery drills, deletion protection on.
- **Everything as code:** Terraform (the next phase of this project), so the environment can be recreated or reviewed in pull requests.
- **Email:** Amazon SES instead of SMTP credentials.

---

## 14. Alternatives, and why I didn't choose them

| Option | Good | Why not here |
|---|---|---|
| **Single EC2 instance + Docker Compose** | Cheapest, simplest, same as local | One machine = one point of failure, manual patching, no rolling deploys; less to learn for "production" |
| **Elastic Beanstalk** | Quick Django deploys | Hides the building blocks I wanted to learn; less control |
| **App Runner** | Fully managed containers from ECR, HTTPS included | Still needs RDS/VPC connectors; less control over networking; no separate worker model |
| **EKS (Kubernetes)** | Industry standard at scale, portable | Control plane alone ≈ $73/month; a lot of complexity for two containers |
| **Lambda (Zappa / Mangum)** | Pay per request, scales to zero | Celery, long requests and DB connection limits need rework |
| **NAT-free design** (VPC endpoints only, or tasks in public subnets with public IPs) | Saves the NAT cost | Endpoints cost ~$7/month each per AZ and don't reach Razorpay/SMTP; public IPs on tasks weaken the design |
| **Render / Railway / DigitalOcean App Platform** | Much simpler and cheaper for a hobby app | The goal was to learn AWS as teams use it |

---

## 15. Teardown, and proving nothing is left

Order matters, because resources depend on each other:

1. ECS: set both services to 0, delete the services, then the cluster; deregister and delete the task-definition revisions.
2. CloudFront: disable the distribution, wait until it's deployed, then delete it; delete the WAF web ACL (region "Global (CloudFront)"), the CloudFront Function and the OAC.
3. The ALB, then the target group.
4. RDS without a final snapshot, plus its automated backups; then the DB subnet group.
5. ElastiCache, then its subnet group.
6. The NAT gateway, then **release its Elastic IP** (an unattached IP still bills).
7. The VPC (removes subnets, route tables, the IGW, the S3 endpoint and the security groups).
8. Empty and delete both S3 buckets; delete the ECR repositories with their images.
9. SSM parameters, CloudWatch log groups.
10. IAM: the four roles and their policies, and the GitHub OIDC provider.
11. GitHub: the `production` environment (variables + secret), the `DEPLOY_ENABLED` variable; Razorpay: the webhook.

**Verification:**

- **Tag Editor** (all regions, tag `Project`) — note it lags by hours, and deleted ECS clusters and task definitions stay visible as **INACTIVE** for a while at no cost.
- **EC2:** no Elastic IPs, NAT gateways, load balancers, volumes or snapshots of ours. (The account has resources from other company apps; those were deliberately left alone, which is why everything of ours had a `shoplite` name.)
- **RDS:** no snapshots or retained backups.
- **Next day: Billing → Bills**, because charges appear with up to a 24-hour delay.

---

## 16. Interview questions and answers

### Architecture

**1. Walk me through your architecture.**
Use §1. Then draw §2: CloudFront in front, S3 for the SPA and media, ALB → Fargate for the API, RDS and ElastiCache in private subnets, NAT for outgoing traffic, GitHub Actions with OIDC for deployments.

**2. Why put CloudFront in front of both the frontend and the API?**
One HTTPS origin: no CORS, simpler cookies/CSRF, a free certificate without a domain, caching for static files, and the ALB can be locked to CloudFront only. The cost is that CloudFront's behaviours must route each path correctly.

**3. Why ECS Fargate rather than EC2 or EKS?**
No servers to patch or scale; I pay per task per second; ECS gives health checks, restarts and rolling deploys. EC2 is cheaper but I'd manage the OS; EKS is overkill for two containers and its control plane alone costs ~$73/month.

**4. Why is the Celery worker a separate service?**
Different job, different scaling and resources. Web scales with requests, the worker with the queue. A slow email must never block a web request, and a worker crash must not take the site down.

**5. How do you run database migrations?**
As a one-off ECS task using the same image, run by the pipeline *before* the services update. It runs exactly once, and a non-zero exit code stops the deploy. Migrations must be backward-compatible with the previous release while both versions briefly run.

**6. What does the ALB do that CloudFront can't?**
It knows which containers exist and whether they're healthy, spreads requests over them, and drains old tasks during deploys. CloudFront only knows one origin address.

**7. Why is the media bucket separate from the frontend bucket?**
Different owners and lifecycles: the pipeline replaces the frontend with `s3 sync --delete` on every deploy, which would wipe uploaded images. Different permissions too: only the app writes media; only the pipeline writes the frontend.

**8. How does React Router work behind CloudFront and S3?**
S3 has no `/products/x` object. A CloudFront Function on the default behaviour rewrites paths without a file extension to `/index.html`; React then draws the right page. It's only on the default behaviour, so `/api/...` 404s stay real 404s.

### Networking

**9. What makes a subnet public or private?**
Its route table: a public subnet routes `0.0.0.0/0` to an Internet Gateway; a private one routes it to a NAT gateway (or nowhere).

**10. Why do private containers need a NAT gateway?**
To make outgoing connections: pulling images from ECR, fetching SSM parameters, sending logs, calling Razorpay and the SMTP server. NAT allows outgoing only; nothing can connect in.

**11. How could you avoid the NAT cost?**
VPC interface endpoints for ECR, logs and SSM plus the free S3 gateway endpoint — but each interface endpoint costs about $7/month per AZ and they don't reach third-party APIs. Or put tasks in public subnets with public IPs and tight security groups, which is cheaper but exposes them.

**12. Security groups vs NACLs?**
Security groups are stateful (replies are allowed automatically), attach to resources, and only have allow rules; they can refer to other security groups. NACLs are stateless, apply to whole subnets, and have allow and deny rules. I used chained security groups and default NACLs.

**13. How is the ALB protected?**
Its security group allows only the CloudFront origin-facing prefix list, and its listener forwards only requests carrying our secret `X-Origin-Verify` header; everything else gets a fixed 403. The prefix list alone isn't enough because every CloudFront distribution uses those addresses.

**14. Why two Availability Zones if you run one task?**
The ALB and RDS subnet groups require subnets in at least two AZs, and it's what lets you scale to a highly available setup later just by adding tasks.

**15. Why does the S3 gateway endpoint matter?**
It's free and keeps S3 traffic (media uploads, ECR image layers, which are stored in S3) on AWS's network instead of paying NAT data processing.

### Security and IAM

**16. How does GitHub Actions authenticate to AWS?**
OIDC: GitHub issues a short-lived signed token for the job; STS `AssumeRoleWithWebIdentity` checks it against the IAM OIDC provider and the role's trust policy (audience + subject pinned to the repo and the `production` environment) and returns temporary credentials. No keys are stored in GitHub.

**17. Why is that better than access keys in GitHub secrets?**
Keys live until someone rotates them and can leak through logs, forks or a compromised action; OIDC credentials expire within an hour, are tied to a specific repository and environment, and there's nothing to rotate.

**18. What's the difference between the task execution role and the task role?**
The execution role is used by ECS to start the container: pull the image, read secrets, write logs. The task role is used by the application code at runtime, e.g. Django writing to S3.

**19. What is `iam:PassRole` and why restrict it?**
It allows handing a role to an AWS service. A deploy role that can pass any role could give ECS an admin role and escalate its own power. I limited it to the three ShopLite roles and to `ecs-tasks.amazonaws.com`.

**20. Where are the secrets, and how do they reach Django?**
SSM Parameter Store SecureStrings. The task definition lists only their ARNs; ECS fetches the values with the execution role at start-up and injects them as environment variables. They're never in Git, the image or the logs.

**21. Parameter Store or Secrets Manager?**
Parameter Store standard parameters are free and enough here. Secrets Manager costs $0.40 per secret per month but adds automatic rotation (e.g. for RDS passwords) and cross-account sharing — I'd use it in production for the DB password.

**22. How did you keep a public repository safe?**
No secrets or account numbers in Git (filled files are git-ignored), `mask-aws-account-id` in Actions, the role ARN stored as a secret, and the OIDC trust policy pinned to one repository and environment with a required reviewer.

**23. Is the database encrypted?**
At rest by RDS (KMS), and in transit because Django connects with `sslmode=require`. It has no public IP and only the app security groups can reach port 5432.

**24. What would you do about the cache's security?**
Turn on in-transit encryption and an AUTH token (Celery then uses `rediss://`). Here it's reachable only from the app security groups in private subnets.

### Django-specific

**25. How are static files served?**
`collectstatic` runs during the Docker build; WhiteNoise serves them from the container with far-future cache headers and hashed filenames, and CloudFront caches them. No separate static bucket is needed.

**26. How are uploads stored?**
django-storages writes them to the media bucket using the task role; URLs point at the CloudFront domain, and CloudFront reads the private bucket through OAC.

**27. Why did you need a special health-check middleware?**
The ALB calls the task by IP, and Django rejects unknown hosts. A middleware placed first answers `/healthz/` before `ALLOWED_HOSTS` and the HTTPS redirect run, so `ALLOWED_HOSTS` stays strict. It doesn't touch the database, so a brief DB problem doesn't make ECS kill healthy containers.

**28. Why `SECURE_PROXY_SSL_HEADER`, and why that header?**
Django only sees HTTP from the ALB. CloudFront adds `CloudFront-Forwarded-Proto: https`; trusting it tells Django the original request was secure (so no redirect loop, and secure cookies work). It's safe because only CloudFront can reach the ALB.

**29. What does `CONN_MAX_AGE` do?**
Reuses database connections for 60 seconds instead of opening one per request, which saves TLS handshakes to RDS. `CONN_HEALTH_CHECKS` makes sure a reused connection is still alive.

### CI/CD

**30. Walk me through your pipeline.**
§9: CI → approval → OIDC → build/push images tagged with the SHA → migrate task → rolling deploy of web and worker → build and upload the frontend → invalidate `index.html`.

**31. How do you get zero downtime?**
ECS rolling updates with minimum healthy 100%: new tasks start and must pass the ALB health check before old tasks are drained and stopped. The ALB's deregistration delay lets in-flight requests finish.

**32. How do you roll back?**
Automatically, the ECS deployment circuit breaker rolls back if new tasks keep failing. Manually, update the service to the previous task-definition revision (or re-run the pipeline on an older commit); images are immutable and tagged by SHA, so the old one still exists.

**33. Why tag images with the commit SHA instead of `latest`?**
You know exactly what's running, every deploy is reproducible, rollbacks are exact, and immutable tags mean a tag can never silently change.

**34. Why invalidate only `index.html`?**
All JS/CSS files have a content hash in their names and are cached forever; a new build produces new names. Only `index.html` changes in place, so only it must be refreshed. It's quicker, and invalidations beyond 1,000 paths a month cost money.

**35. What stops a bad commit from reaching production?**
CI tests and a migrations check must pass, a human must approve the `production` environment, the migration must succeed, new tasks must pass health checks, and the circuit breaker rolls back failures.

**36. What if a migration is not backward-compatible?**
The old code would break during the rollout. Use expand/contract: first add new columns or tables (compatible with both versions), deploy the code that uses them, and remove old columns in a later release.

### Operations and cost

**37. How would you debug a task that keeps restarting?**
ECS service events and the stopped task's "stopped reason" and exit code; the container's CloudWatch logs; target group health (which check failed); then check the task definition's environment, secrets and IAM permissions (e.g. `ResourceInitializationError` = can't pull the image or read a secret, often a missing NAT route or permission).

**38. What did it cost, and what was the biggest cost driver?**
About ₹16 an hour with everything running. The NAT gateway and ALB are the biggest parts because they bill per hour no matter the traffic; the containers were cheap.

**39. How did you keep the bill under control?**
Created expensive resources only on testing days, paused overnight (services to 0, NAT and ALB deleted, RDS stopped), small instance sizes, no Multi-AZ, and a same-day teardown verified with Tag Editor, the EC2/RDS consoles and the next-day bill.

**40. What surprised you?**
The CloudFront wizard silently enabling WAF (which blocked uploads over 8 KB and costs money), GitHub's immutable OIDC subject format, and the `/admin` path clash between React and Django. Each was found by reading the actual response (headers, error text) instead of guessing.

**41. How would you scale this?**
ECS service auto scaling on CPU / requests per target, more Gunicorn workers per task, Celery workers scaled on queue length, an RDS read replica (or a bigger instance), and more caching in CloudFront. The containers are stateless, so scaling out needs no code changes.

**42. What would you do differently next time?**
Write it in Terraform from the start, create the CloudFront distribution with all origins/behaviours explicitly (not through a wizard), use presigned uploads, and add alarms before the first test.

---

## 17. The 2-minute story ("tell me about a deployment you did")

> "I built a full-stack shop — Django REST, React, PostgreSQL, Celery — and wanted to deploy it the way a team would, so I did it on AWS by hand first to really understand each piece, then rebuilt it with Terraform.
>
> The design puts CloudFront in front of everything. It serves the React build from a private S3 bucket and sends `/api/*` to an Application Load Balancer. That gave me one HTTPS address with no CORS and no domain purchase. The API runs as two ECS Fargate services — Gunicorn and a Celery worker — in private subnets, with RDS PostgreSQL and ElastiCache also private. The load balancer only accepts CloudFront, through AWS's CloudFront prefix list plus a secret header that CloudFront adds.
>
> Making Django cloud-ready took a few changes: WhiteNoise for static files, S3 storage for uploads via the task role, a health-check middleware that runs before the host check so the load balancer can probe containers by IP, and trusting CloudFront's protocol header so Django knows requests are HTTPS.
>
> For deployments, GitHub Actions assumes an IAM role through OIDC — there are no AWS keys in GitHub. After CI passes and I approve the production environment, it builds images tagged with the commit SHA, runs migrations as a one-off task, and does a rolling deploy with zero downtime, then uploads the frontend and invalidates just `index.html`.
>
> The interesting part was debugging: the OIDC trust failed because the repo uses GitHub's newer immutable subject format; every URL returned the React app because the CloudFront wizard hadn't created my API routes — I found it by checking the `Server` header; and uploads failed because the wizard had quietly enabled a WAF rule that blocks bodies over 8 KB.
>
> It cost about ₹16 an hour while running. I paused it overnight by deleting the NAT and load balancer, and at the end tore everything down and verified in Tag Editor and the bill that nothing was left."
