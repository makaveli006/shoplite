# ShopLite on AWS with Terraform: explained for interviews

This is the second half of the deployment story. `INTERVIEW-DEPLOYMENT.md` explains the architecture and how it was first built **by hand in the AWS Console**. This document explains how the **same architecture was rebuilt as code with Terraform** (`infra/terraform/`), applied, tested, and destroyed again: what each piece of the code does, why it's written that way, what happened during the real run, and the questions an interviewer is likely to ask.

> No secrets, account numbers or live addresses appear in this file.

---

## 1. The 30-second summary

> "After building the AWS deployment by hand, I rewrote it in Terraform: about 80 resources — VPC, NAT, security groups, RDS, ElastiCache, S3, ECR, IAM with GitHub OIDC, an ALB, ECS Fargate and CloudFront. State lives in an S3 bucket with S3-native locking, created by a small bootstrap configuration. Secrets never touch the state: passwords are ephemeral and written through write-only arguments. The services ignore task-definition changes, so the GitHub Actions pipeline owns the application version while Terraform owns the infrastructure. The provider is pinned to one AWS profile and one account ID, and CI runs `fmt` and `validate` on every pull request. One `apply` built everything in about 20 minutes, the CI/CD pipeline deployed onto it, and one `destroy` removed all 80 resources."

---

## 2. Why Infrastructure as Code (and why Terraform)

**Problems with the console build that IaC solves:**

- **Repeatability:** the console build took a day of careful clicking. With code, the whole environment is one command, and a second copy (staging) is the same code with different variables.
- **Review:** infrastructure changes go through pull requests like application code. `terraform plan` shows exactly what will change before anything does.
- **Documentation that can't go stale:** the `.tf` files *are* the description of what exists.
- **Teardown:** the console teardown was an 18-step checklist with verification. `terraform destroy` deletes exactly what the state says it created — nothing forgotten, nothing else touched.
- **Drift detection:** `plan` reveals changes someone made by hand.

**Why Terraform rather than CloudFormation or CDK:**

- Works across providers (AWS, GitHub, Cloudflare, Datadog…) with one language and one workflow.
- `plan` output is very readable, and the ecosystem is large.
- CloudFormation is AWS-native (no state file to manage, drift detection built in) but AWS-only and more verbose; CDK generates CloudFormation from TypeScript/Python. All three are valid; Terraform is the most common in job descriptions.

---

## 3. Project structure

```
infra/terraform/
├── bootstrap/main.tf        the S3 bucket that stores the state (has its own local state)
├── versions.tf              Terraform and provider version constraints
├── providers.tf             AWS provider: region, profile, allowed account, default tags
├── backend.tf               S3 backend with use_lockfile (bucket name comes from backend.hcl)
├── backend.hcl.example      shape of the git-ignored backend.hcl
├── variables.tf             every input, with descriptions and defaults
├── terraform.tfvars.example shape of the git-ignored terraform.tfvars (account ID, emails)
├── network.tf               VPC, subnets, IGW, NAT + EIP, route tables, S3 endpoint
├── security_groups.tf       5 security groups and their rules
├── database.tf              RDS PostgreSQL, ElastiCache Valkey, subnet groups
├── storage.tf               S3 buckets (frontend, media), ECR repositories + lifecycle
├── secrets.tf               ephemeral passwords → SSM SecureString parameters (write-only)
├── iam.tf                   ECS execution role, web/worker task roles
├── github_oidc.tf           GitHub OIDC provider, deploy role and its least-privilege policy
├── alb.tf                   load balancer, target group, listener + secret-header rule
├── ecs.tf                   cluster, log groups, 3 task definitions, 2 services
├── cdn.tf                   CloudFront, OAC, SPA function, bucket policies
├── monitoring.tf            SNS topic, 3 CloudWatch alarms
├── outputs.tf               shop URL, deploy role ARN, the GitHub variables to copy
└── .terraform.lock.hcl      exact provider versions + checksums (committed)
```

**Why a flat root module, one file per area, and no community modules:**

- For a single environment of this size, one folder is the simplest thing that works; Terraform reads every `.tf` file in the folder as one configuration, so splitting by file is just for humans.
- Writing every resource by hand (instead of `terraform-aws-modules/vpc` etc.) means every setting is visible and explainable — the goal was learning and interviews.
- §13 explains how I would split it into modules and environments for a team.

---

## 4. Providers, versions and the lock file

```hcl
terraform {
  required_version = ">= 1.11"            # write-only arguments need 1.11+
  required_providers {
    aws    = { source = "hashicorp/aws",    version = "~> 6.0" }
    random = { source = "hashicorp/random", version = "~> 3.7" }  # ephemeral random_password
  }
}
```

- **`~> 6.0`** allows any 6.x but never 7.0 (major versions can break things).
- **`.terraform.lock.hcl`** records the exact versions picked (AWS 6.67.0, random 3.9.1 in the real run) and their checksums. It's committed, so CI and every teammate download *exactly* the same provider builds. It was locked for both `windows_amd64` (my PC) and `linux_amd64` (GitHub's runners) with `terraform providers lock -platform=...`.

**The provider block is also a safety rail:**

```hcl
provider "aws" {
  region              = var.region
  profile             = var.aws_profile          # "shoplite-terraform"
  allowed_account_ids = [var.account_id]
  default_tags { tags = { Project = "shoplite-demo", Owner = var.owner, ManagedBy = "terraform" } }
}
```

- **`profile`:** my PC also has another application's keys under `[default]`. Naming the profile means Terraform can never pick those up by accident.
- **`allowed_account_ids`:** if the credentials belong to any other account, Terraform stops before changing anything.
- **`default_tags`:** every taggable resource gets the three tags without writing them 80 times. Tag Editor can then find everything Terraform made (`ManagedBy = terraform`), which is how the teardown was verified.

---

## 5. State: Terraform's memory

**What state is:** a JSON file mapping each resource in the code (`aws_lb.main`) to the real object in AWS (its ARN/ID) plus its last known attributes. Without it, Terraform can't know what it created, what to update, or what to destroy.

**Why remote state in S3:**

- On a laptop it can be lost or diverge between teammates. In S3 it's shared, durable, **versioned** (every change kept, so a corrupted state can be rolled back) and **encrypted**.
- The bucket also blocks public access and denies non-HTTPS requests.

**Locking:**

```hcl
backend "s3" {
  key          = "shoplite/terraform.tfstate"
  region       = "us-east-1"
  encrypt      = true
  use_lockfile = true     # S3-native locking
}
```

- While a `plan`/`apply` runs, Terraform writes a `.tflock` object next to the state; a second run waits or fails instead of two people changing the same infrastructure at once.
- Older setups needed a **DynamoDB table** for locking; S3's conditional writes made that unnecessary, and the DynamoDB option is deprecated.

**The bootstrap chicken-and-egg:**

- The main configuration stores its state *in* a bucket, so that bucket must exist before `terraform init` can even run.
- `bootstrap/` is a tiny separate configuration that creates only the bucket and keeps *its own* state in a local file. Order: bootstrap apply → main init/apply → … → main destroy → bootstrap destroy.
- A backend block can't use variables, so the bucket name and profile are passed with `terraform init -backend-config=backend.hcl` (a git-ignored file).

**State security:** state can contain sensitive values (any argument Terraform sends is normally stored). That's why the bucket is private/encrypted/versioned, and why the real secrets here never enter it (§7).

---

## 6. How a run works

```powershell
terraform init "-backend-config=backend.hcl"   # download providers, connect to the state bucket
terraform plan                                  # read real AWS + state, compare with the code, print the diff
terraform apply                                 # show the plan again, ask "yes", then make the changes
terraform destroy                               # plan a deletion of everything in the state, ask "yes", delete
```

(On Windows PowerShell 5.1 the quotes matter: PowerShell splits `-backend-config=backend.hcl` at the dot and Terraform fails with "No positional arguments are expected".)

**Plan symbols:** `+` create, `-` destroy, `~` update in place, `-/+` replace (destroy then create — watch for these on databases!), `<=` read a data source.

### The dependency graph

Terraform builds a graph from references and runs independent branches in parallel (RDS and ElastiCache, the slowest resources, were created at the same time).

- **Implicit dependencies** (preferred): referencing an attribute creates the edge. `aws_subnet.private` uses `aws_vpc.main.id`, so the VPC is created first and destroyed last.
- **Explicit `depends_on`** only where there's a hidden dependency the references don't show. The three used here:
  - `aws_nat_gateway` → `depends_on = [aws_internet_gateway.main]`: a NAT gateway only works once the VPC has an IGW, but nothing in its arguments references the IGW.
  - `aws_ecs_service.web` → `depends_on = [aws_lb_listener_rule.from_cloudfront]`: a service can't attach to a target group that isn't yet connected to a load balancer.
  - `aws_s3_bucket_policy` → `depends_on = [aws_s3_bucket_public_access_block...]`: avoids a race between the two S3 calls.
- **Destroy runs the graph in reverse**: services → load balancer → CloudFront → database/cache → NAT → subnets → VPC.

---

## 7. Secrets that never touch the state

**The problem:** a normal `aws_db_instance { password = random_password.db.result }` stores the password in plain text in the state file (and the plan file).

**The solution used here (Terraform 1.11+):**

```hcl
ephemeral "random_password" "db_password" {      # generated during the run, never saved
  length  = 32
  special = false                                 # RDS refuses / " @ and spaces
}

resource "aws_db_instance" "main" {
  password_wo         = ephemeral.random_password.db_password.result   # write-only: sent, never stored
  password_wo_version = var.secrets_version
}

resource "aws_ssm_parameter" "secret" {
  for_each         = local.secret_names
  type             = "SecureString"
  value_wo         = local.secret_values[each.key]
  value_wo_version = var.secrets_version
}
```

- **Ephemeral** values exist only while Terraform runs. **Write-only** arguments (`*_wo`) are sent to AWS but never recorded.
- Because Terraform can't compare a value it never stored, write-only arguments are only sent when their **`*_wo_version`** changes. Bumping `secrets_version` writes a new DB password to RDS **and** the same value to SSM in one run — that's rotation. Running containers pick it up on their next deploy.
- **Typed secrets** (the Django superuser password, the Razorpay secrets) are `ephemeral` input variables. They're set as `TF_VAR_...` environment variables from a hidden `Read-Host -AsSecureString` prompt, so they never appear on screen, in shell history, in a file, in the plan or in the state.
- The containers read the secrets from SSM at start-up (task definition `secrets` → parameter ARNs, read by the execution role).
- **One deliberate exception:** the CloudFront → ALB `X-Origin-Verify` header value is a normal `random_password` and *is* in the state, because CloudFront and the listener rule need it as a plain argument. It only proves "this request came through our CloudFront", and the state bucket is private and encrypted.

---

## 8. Terraform and the CI/CD pipeline: who owns what

Both Terraform and the GitHub Actions pipeline touch ECS. Without a clear split they would fight: every pipeline deploy registers a new task-definition revision with the new image, and the next `terraform apply` would roll the service back to Terraform's revision with the old image.

**The split:**

- **Terraform owns the infrastructure**: the services, their networking, load balancer wiring, desired count, and the *initial* task definitions (environment variables, secrets, roles, log settings).
- **The pipeline owns the application version**: which image (commit SHA) runs.

```hcl
resource "aws_ecs_service" "web" {
  task_definition = aws_ecs_task_definition.web.arn
  desired_count   = var.app_desired_count
  lifecycle {
    ignore_changes = [task_definition]   # the pipeline moves this forward; Terraform leaves it alone
  }
}
```

- The pipeline (`deploy.yml`) downloads the **latest** task definition, swaps only the image, and registers it. So if Terraform changes an environment variable, the next pipeline deploy carries that change forward too.
- **The first-run order** solves a chicken-and-egg: ECS can't start a container whose image doesn't exist yet. So the first `apply` uses `initial_image_tag = "not-built-yet"` and `app_desired_count = 0`; then the pipeline builds and pushes the images, runs migrations and registers real revisions; then `app_desired_count = 1` and `apply` starts the containers.
- Terraform's outputs print every value the pipeline needs (`github_environment_variables`, `github_deploy_role_arn`), so wiring GitHub is copy-paste.

---

## 9. Drift

**Drift** = the real infrastructure no longer matches the code because someone changed it by hand.

- `terraform plan` refreshes every resource in the state from AWS and compares it with the code. Example: changing the log group's retention from 1 to 3 days in the console shows `~ retention_in_days = 3 -> 1`; `apply` puts it back. The code is the source of truth.
- **Not drift, on purpose:** pipeline deploys (the `ignore_changes` above). After a pipeline deploy, `plan` shows no change to the services.
- **Not detected, by design:** things created *beside* Terraform's resources. An inbound rule added by hand to a security group is invisible to `plan`, because security-group rules here are separate `aws_vpc_security_group_ingress_rule` resources and that rule was never in the state. (With inline `ingress {}` blocks inside the group, Terraform would remove unknown rules — a trade-off between strictness and flexibility.) Teams catch these with AWS Config rules or by removing console write access.
- `terraform plan -refresh-only` shows only what changed outside Terraform, and `apply -refresh-only` accepts those changes into the state instead of reverting them.

**A plan-noise lesson from the real run:** the deploy policy first referenced `aws_ecs_service.web.id`. When the services' desired count changed, Terraform marked the whole policy as `(known after apply)` even though its content wouldn't change. Building the service ARNs from names (`"arn:aws:ecs:${var.region}:${var.account_id}:service/${cluster}/${name}"`) removed that noise. Rule of thumb: don't make documents depend on attributes of resources that change often when the value can be computed.

---

## 10. Language features used (and why)

| Feature | Where | Why |
|---|---|---|
| `count` | subnets, route-table associations, the optional OIDC provider and SNS subscription | identical copies, or "create 0 or 1" |
| `for_each` over a set/map | buckets, ECR repositories, log groups, SSM parameters, SG rules | each copy has a stable name key (`["media"]`), so removing one doesn't shift the others like `count` indexes do |
| `dynamic` block | CloudFront's three Django behaviours | the same block repeated for `/api/*`, `/api-auth/*`, `/django-admin/*` |
| `locals` | shared container environment, bucket names, secret maps | name a value once, reuse it |
| data sources | the CloudFront prefix list, managed cache/origin-request policies, an existing OIDC provider | read things AWS (or someone else) owns instead of hard-coding IDs |
| `aws_iam_policy_document` | every IAM policy | real ARNs filled in, validated HCL instead of JSON strings with `<PLACEHOLDERS>` |
| `jsonencode()` | container definitions, ECR lifecycle policy | build JSON from HCL values |
| `file()` | the CloudFront Function | reuses `deploy/aws/cloudfront-spa-routing.js` from the console build |
| `cidrsubnet()` | subnet ranges | computes 10.0.0.0/20, 10.0.16.0/20, 10.0.128.0/20, 10.0.144.0/20 from the VPC range |
| `lifecycle { ignore_changes }` | ECS services | the pipeline owns the task definition |
| `ephemeral` + write-only | secrets | keeps secrets out of state |
| `sensitive` / `ephemeral` variables | passwords | hidden in output, never stored |
| outputs | URL, role ARN, GitHub variables | hand values to people and to the pipeline |

---

## 11. Console step → Terraform resources

| Console step (INTERVIEW-DEPLOYMENT.md) | Terraform |
|---|---|
| 2. VPC wizard | `aws_vpc`, `aws_subnet` ×4, `aws_internet_gateway`, `aws_eip`, `aws_nat_gateway`, `aws_route_table` ×2 + associations, `aws_vpc_endpoint` (S3) |
| 3. Security groups | `aws_security_group` ×5, `aws_vpc_security_group_ingress_rule` / `_egress_rule`, `data.aws_ec2_managed_prefix_list` (CloudFront) |
| 4. RDS + ElastiCache | `aws_db_subnet_group`, `aws_db_instance`, `aws_elasticache_subnet_group`, `aws_elasticache_replication_group` (engine `valkey`) |
| 5. S3 + ECR | `aws_s3_bucket` ×2 + public access blocks, `aws_ecr_repository` ×2 + lifecycle policies |
| 6. SSM secrets (typed by hand) | `ephemeral "random_password"` + `aws_ssm_parameter` ×5 (write-only) |
| 7. IAM roles, OIDC | `aws_iam_role` ×4, inline `aws_iam_role_policy`, managed policy attachment, `aws_iam_openid_connect_provider` |
| 9. ECS + ALB | `aws_ecs_cluster`, `aws_cloudwatch_log_group` ×3, `aws_ecs_task_definition` ×3, `aws_ecs_service` ×2, `aws_lb`, `aws_lb_target_group`, `aws_lb_listener`, `aws_lb_listener_rule`, `random_password` (origin header) |
| 10. CloudFront wizard + edits | `aws_cloudfront_distribution` (3 origins, 6 behaviours, **no WAF**), `aws_cloudfront_origin_access_control`, `aws_cloudfront_function`, managed policy data sources, `aws_s3_bucket_policy` ×2 |
| (planned, never done by hand) | `aws_sns_topic`, `aws_cloudwatch_metric_alarm` ×3 |

**Improvements over the console build that came "for free" by writing it down:**

- **No WAF:** the console wizard silently attached one whose rule blocked uploads over 8 KB. Here the distribution is fully explicit; uploads of normal photos worked.
- **No hand-filled `<PLACEHOLDERS>`:** IAM policies reference real ARNs.
- **Secrets out of every file:** generated, not typed into a console form.
- **Alarms** that were only planned before.

---

## 12. The real run, step by step

| Step | What happened |
|---|---|
| Prerequisites | Terraform 1.16 via `winget`; an access key for Terraform in a named profile `[shoplite-terraform]` in the credentials file (next to the other app's `[default]`, untouched) |
| Bootstrap | `apply` → 6 resources: the state bucket with versioning, encryption, public access block, HTTPS-only policy |
| Main `plan` | ~80 resources to add, reviewed before spending anything; passwords shown as `(write-only attribute)` |
| Main `apply` | ~20 minutes (RDS, Valkey and CloudFront are the slow ones); services at 0 containers |
| GitHub | recreated the `production` environment (required reviewer), 14 variables and the role ARN secret from Terraform's outputs; turned `DEPLOY_ENABLED` on |
| First deploy | "Run workflow" on the feature branch → approve → images built and pushed, migrations as a one-off task, frontend uploaded — all green |
| Start the app | `app_desired_count = 1` → plan showed 2 services `0 -> 1` (plus the policy noise fixed in §9). The API returned **503 from the ALB for a minute or two** while the first container passed the health check twice — normal warm-up |
| Data | one-off ECS tasks (`createsuperuser --noinput`, `seed_catalog`) using the migrate task definition with a command override |
| Tests | registration, search, wishlist, Razorpay test payment + webhook, emails in the worker logs, image upload > 8 KB, order statuses, review, password reset — all passed |
| Second deploy | a code change deployed through the pipeline with a rolling update; Terraform didn't fight it (`ignore_changes`) |
| Teardown | `DEPLOY_ENABLED` deleted first → `terraform destroy` → **80 destroyed** (~20 min) → pipeline-registered task-definition revisions, the GitHub environment and the Razorpay webhook removed by hand → bootstrap destroy (6) → the access key and its profile deleted |
| Verification | Tag Editor showed only *inactive* ECS task definitions and the inactive cluster (free, cleaned up by AWS); no NAT, EIP, ALB, RDS, cache, buckets or distribution left; next-day bill check |

**Cost:** ≈ ₹11/hour with 0 containers, ≈ ₹15/hour with both running (NAT and ALB are the biggest parts). The whole build–test–destroy day cost well under ₹100.

---

## 13. What I would change for a team

- **Modules and environments:**
  - Split into modules (`network`, `data`, `app`, `edge`) with clear inputs/outputs.
  - One root configuration per environment (`envs/staging`, `envs/prod`), each with its own state key and `.tfvars`. Directories are clearer than `terraform workspace` for environments with different sizes and permissions.
- **Run Terraform from CI, not laptops:**
  - On a pull request: `fmt -check`, `validate`, `tflint`, a security scanner (Checkov / Trivy), and `terraform plan` posted as a PR comment.
  - On merge to `main`: `apply` of that exact plan, behind an environment approval.
  - CI authenticates with **OIDC** (like the deploy pipeline), so there are no long-lived keys at all. Tools for this: GitHub Actions, Atlantis, HCP Terraform.
- **Human credentials:** short-lived credentials from IAM Identity Center (SSO) instead of an access key on an admin user. In this demo I used one access key on my own IAM user and deleted it right after the teardown.
- **Protect important data:** `deletion_protection = true` and a final snapshot on RDS, `force_destroy = false` on buckets, and `lifecycle { prevent_destroy = true }` on anything irreplaceable.
- **Existing resources:** bring hand-made resources under Terraform with `import` blocks instead of recreating them; rename resources safely with `moved` blocks.
- **Policy as code:** OPA/Sentinel or Checkov rules ("no public buckets", "RDS must be encrypted") enforced in CI.
- **Drift monitoring:** a scheduled `plan -detailed-exitcode` that alerts when anything has changed outside Terraform.

---

## 14. Interview questions and answers

### Basics

**1. What is Terraform, in one sentence?**
A tool that reads declarative configuration files describing infrastructure, compares them with what exists, and makes the API calls needed to make reality match — and can delete it all again.

**2. Declarative vs imperative?**
Declarative: I describe the end state ("one VPC with four subnets"); Terraform works out the steps. Imperative (a script of AWS CLI calls): I describe the steps, and re-running it may create duplicates.

**3. What does `terraform init` do?**
Downloads the providers (pinned by the lock file), configures the backend (connects to the state bucket), and installs modules.

**4. Difference between `plan` and `apply`?**
`plan` only reads and shows the diff; `apply` makes the changes (after showing the plan again and asking for confirmation, or applying a saved plan file exactly).

**5. What is a provider?**
A plugin that translates Terraform resources into one platform's API calls — here the AWS provider (and the `random` provider for passwords and suffixes).

**6. Resource vs data source?**
A resource is something Terraform creates and manages. A data source only reads something that exists already — e.g. the AWS-managed CloudFront prefix list or the managed cache policies.

**7. What's the lock file for?**
`.terraform.lock.hcl` pins exact provider versions and checksums so every machine and CI uses the same builds. It's committed.

### State

**8. What is state and why does Terraform need it?**
The mapping between the code and the real objects (IDs, attributes). It's how Terraform knows what to update or destroy, and it speeds up planning.

**9. Why remote state?**
Shared between people and CI, durable, versioned, encrypted, and lockable. Local state gets lost or diverges.

**10. How does locking work, and why does it matter?**
Before changing anything, Terraform takes a lock (here a `.tflock` object in S3 via `use_lockfile`). A second concurrent run can't corrupt the state or make conflicting changes. Older setups used DynamoDB for this.

**11. Where did the state bucket come from?**
A separate bootstrap configuration with local state — the chicken-and-egg of a backend that must exist before `init`. It's destroyed last.

**12. Is state sensitive?**
Yes — it can contain any argument value. So the bucket is private, encrypted, versioned and HTTPS-only, and secrets here are kept out entirely with ephemeral values and write-only arguments.

**13. What if the state is lost?**
Terraform no longer knows what it created: a `plan` would try to create everything again (and fail on names that exist). Recovery is restoring a previous S3 version, or re-importing resources with `import` blocks. That's why versioning is on.

### Secrets

**14. How did you keep passwords out of the state?**
`ephemeral "random_password"` generates them during the run without saving them, and write-only arguments (`password_wo`, `value_wo`) send them to AWS without storing them. Typed secrets are ephemeral variables set from hidden prompts.

**15. If Terraform doesn't store the password, how does it know when to change it?**
It doesn't compare values; it sends them only when `*_wo_version` changes. Bumping `secrets_version` rotates the DB password in RDS and SSM together.

**16. How do the containers get the secrets?**
The task definition lists SSM parameter ARNs; ECS reads them with the execution role when the container starts and injects them as environment variables.

### Design

**17. Why one flat folder instead of modules?**
One environment, ~80 resources, one owner: modules would add indirection without reuse. I'd modularise for multiple environments or teams (§13).

**18. `count` vs `for_each`?**
`count` makes numbered copies; removing one in the middle shifts the indexes and can destroy/recreate the wrong resources. `for_each` keys copies by name (`["media"]`), so they're stable. I used `count` for the per-AZ subnets and on/off toggles, `for_each` for named things.

**19. When do you use `depends_on`?**
Only for dependencies the references don't express — the NAT gateway needing the internet gateway, the ECS service needing the listener rule. Otherwise references create the ordering automatically.

**20. How did you avoid hard-coding IDs?**
References between resources, data sources for AWS-managed objects, `aws_iam_policy_document` for policies, and outputs for anything people need.

**21. How do you protect against running against the wrong account?**
`allowed_account_ids` in the provider plus a named `profile`; `default_tags` make everything traceable.

**22. Why `force_destroy` on the buckets? Isn't that dangerous?**
For a demo it lets `destroy` delete buckets with files in them. On a real shop it would delete every uploaded picture, so it would be `false`, with `prevent_destroy` on the bucket.

### Terraform + CI/CD

**23. Who decides which image runs — Terraform or the pipeline?**
The pipeline. Terraform creates the services and initial task definitions; `ignore_changes = [task_definition]` stops Terraform from rolling back the pipeline's revisions.

**24. How did you deploy before any image existed?**
First apply with `desired_count = 0` and a placeholder tag; then the pipeline pushed images and registered real revisions; then `desired_count = 1`.

**25. How would you run Terraform in CI?**
Plan on pull requests (posted as a comment, with fmt/validate/lint/security scan), apply on merge after approval, authenticated with OIDC — no stored keys. In this project CI already runs `fmt -check` and `validate` on every PR.

**26. What does the CI Terraform job check, and why doesn't it need AWS access?**
Formatting and validation (`init -backend=false`): syntax, types, references and provider schemas. Neither talks to AWS.

### Operations

**27. What is drift and how do you handle it?**
Changes made outside Terraform. `plan` shows them; `apply` reverts to the code, or `apply -refresh-only` accepts them into state. Long term: restrict console write access and run scheduled drift checks.

**28. Can Terraform miss a manual change?**
Yes — anything that isn't in its state, like an extra security-group rule added beside our separate rule resources. AWS Config or restricting console access covers that.

**29. A plan shows `-/+` on the database. What do you do?**
Stop. That's destroy-and-recreate, i.e. data loss. Find which argument forces replacement, and either change it in a non-destructive way, take a snapshot first, or use `lifecycle { prevent_destroy = true }` to make Terraform refuse.

**30. Why did a policy show "(known after apply)" when only the container count changed?**
It referenced an attribute of the service being updated, so Terraform couldn't prove the value was unchanged until after apply. Computing the ARN from names removed the noise.

**31. How do you bring an existing hand-made resource under Terraform?**
Write the resource block, add an `import` block (or `terraform import`), run `plan` until it shows no changes, then apply.

**32. How do you rename a resource without destroying it?**
A `moved { from = ..., to = ... }` block; Terraform updates the state address instead of replacing the object.

**33. How long did apply and destroy take, and what was slowest?**
About 20 minutes each way. RDS, ElastiCache and CloudFront (which must be disabled worldwide before deletion) are the slow ones; Terraform parallelises independent resources.

**34. What did you verify after `destroy`?**
Tag Editor by tag, then the console for anything billable — NAT, Elastic IPs, load balancers, RDS and snapshots, caches, buckets, CloudFront — plus the next-day bill. Only inactive ECS records were left, which cost nothing.

**35. Terraform vs CloudFormation?**
Terraform: multi-cloud, readable plans, big ecosystem, but you manage state. CloudFormation: AWS-native, no state file, built-in drift detection and rollback, AWS-only. CDK generates CloudFormation from real code.

---

## 15. The 2-minute story

> "After deploying my Django and React shop to AWS by hand, I rebuilt the same setup in Terraform so it was repeatable and reviewable — about 80 resources: VPC with a NAT gateway, RDS PostgreSQL, ElastiCache, S3, ECR, ECS Fargate behind an ALB, CloudFront, IAM with GitHub OIDC, and CloudWatch alarms.
>
> The state lives in an S3 bucket with versioning and S3-native locking; a small bootstrap configuration creates that bucket, which solves the chicken-and-egg problem. I pinned the provider to a named profile and my account ID so it could never run against the wrong account, and default tags marked every resource.
>
> Two design decisions I'm happy with. First, secrets never touch the state: database and Django passwords are ephemeral and written through write-only arguments, with a version number to rotate them. Second, Terraform and the deploy pipeline don't fight: the ECS services ignore task-definition changes, so Terraform owns the infrastructure and GitHub Actions owns which image runs. The very first apply runs with zero containers, the pipeline pushes the images, then I scale to one.
>
> Writing it as code also fixed problems from the console build — the console wizard had silently attached a WAF that blocked uploads over 8 KB; here every CloudFront setting is explicit. And reading plans carefully paid off: a policy showed 'known after apply' on an unrelated change, which I removed by computing ARNs instead of referencing a changing resource.
>
> Apply took about 20 minutes, the CI/CD pipeline deployed onto it, everything passed testing including real Razorpay test payments, and `terraform destroy` removed all 80 resources, which I verified in Tag Editor and on the bill."
