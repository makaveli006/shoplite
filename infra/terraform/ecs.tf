# The containers (console step 9): one cluster, three task definitions (web, worker, migrate)
# and two always-running services. Names and container names match what
# .github/workflows/deploy.yml expects.

resource "aws_ecs_cluster" "main" {
  name = "${var.name}-cluster"

  setting {
    name  = "containerInsights"
    value = "disabled" # extra CloudWatch metrics cost money; enable in production
  }
}

resource "aws_cloudwatch_log_group" "app" {
  for_each = toset(["web", "worker", "migrate"])

  name              = "/ecs/${var.name}-${each.key}"
  retention_in_days = var.log_retention_days
}

locals {
  cloudfront_domain = aws_cloudfront_distribution.main.domain_name

  web_image    = "${aws_ecr_repository.app["web"].repository_url}:${var.initial_image_tag}"
  worker_image = "${aws_ecr_repository.app["worker"].repository_url}:${var.initial_image_tag}"

  # Settings shared by all three containers (the same as deploy/aws/task-definitions/*.json).
  database_env = {
    DJANGO_DEBUG = "False"
    DB_NAME      = aws_db_instance.main.db_name
    DB_USER      = aws_db_instance.main.username
    DB_HOST      = aws_db_instance.main.address
    DB_PORT      = tostring(aws_db_instance.main.port)
    DB_SSLMODE   = "require" # RDS over TLS only
  }

  app_env = merge(local.database_env, {
    DJANGO_ALLOWED_HOSTS        = local.cloudfront_domain
    DJANGO_CSRF_TRUSTED_ORIGINS = "https://${local.cloudfront_domain}"
    FRONTEND_URL                = "https://${local.cloudfront_domain}"
    DJANGO_LOG_LEVEL            = "INFO"
    DJANGO_ADMIN_URL            = "django-admin/" # the React app owns /admin
    CELERY_BROKER_URL           = "redis://${aws_elasticache_replication_group.main.primary_endpoint_address}:6379/0"
    AWS_STORAGE_BUCKET_NAME     = aws_s3_bucket.site["media"].bucket
    AWS_S3_REGION_NAME          = var.region
    AWS_S3_CUSTOM_DOMAIN        = local.cloudfront_domain
    SHOP_CURRENCY               = var.shop_currency
    EMAIL_BACKEND               = "django.core.mail.backends.console.EmailBackend" # emails show in the worker's logs
  })

  web_env = merge(local.app_env, {
    # Django sees plain HTTP from the load balancer; CloudFront's header says the visitor used HTTPS.
    DJANGO_SECURE_PROXY_SSL_HEADER = "HTTP_CLOUDFRONT_FORWARDED_PROTO"
    DB_CONN_MAX_AGE                = "60"
    RAZORPAY_KEY_ID                = var.razorpay_key_id
  })

  migrate_env = merge(local.database_env, {
    DJANGO_SUPERUSER_USERNAME = "admin"
    DJANGO_SUPERUSER_EMAIL    = var.admin_email
  })

  # ECS wants [{ name, value }] lists; secrets are [{ name, valueFrom = parameter ARN }], and
  # ECS reads the values (with the execution role) when the container starts.
  secret_arns = { for name, parameter in aws_ssm_parameter.secret : name => parameter.arn }

  web_secrets     = ["DJANGO_SECRET_KEY", "DB_PASSWORD", "RAZORPAY_KEY_SECRET", "RAZORPAY_WEBHOOK_SECRET"]
  worker_secrets  = ["DJANGO_SECRET_KEY", "DB_PASSWORD"]
  migrate_secrets = ["DJANGO_SECRET_KEY", "DB_PASSWORD", "DJANGO_SUPERUSER_PASSWORD"]
}

resource "aws_ecs_task_definition" "web" {
  family                   = "${var.name}-web"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "512"
  memory                   = "1024"
  execution_role_arn       = aws_iam_role.ecs_execution.arn
  task_role_arn            = aws_iam_role.web_task.arn

  runtime_platform {
    cpu_architecture        = "X86_64" # GitHub's runners build x86 images
    operating_system_family = "LINUX"
  }

  container_definitions = jsonencode([{
    name         = "web"
    image        = local.web_image
    essential    = true
    portMappings = [{ name = "web-8000", containerPort = 8000, protocol = "tcp" }]
    environment  = [for key, value in local.web_env : { name = key, value = value }]
    secrets      = [for key in local.web_secrets : { name = key, valueFrom = local.secret_arns[key] }]
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        awslogs-group         = aws_cloudwatch_log_group.app["web"].name
        awslogs-region        = var.region
        awslogs-stream-prefix = "web"
      }
    }
  }])
}

resource "aws_ecs_task_definition" "worker" {
  family                   = "${var.name}-worker"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_execution.arn
  task_role_arn            = aws_iam_role.worker_task.arn

  runtime_platform {
    cpu_architecture        = "X86_64"
    operating_system_family = "LINUX"
  }

  container_definitions = jsonencode([{
    name        = "worker"
    image       = local.worker_image
    essential   = true
    environment = [for key, value in local.app_env : { name = key, value = value }]
    secrets     = [for key in local.worker_secrets : { name = key, valueFrom = local.secret_arns[key] }]
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        awslogs-group         = aws_cloudwatch_log_group.app["worker"].name
        awslogs-region        = var.region
        awslogs-stream-prefix = "worker"
      }
    }
  }])
}

# One-off task: the pipeline runs it before every deploy (migrate). The same definition, with a
# command override in the console, creates the superuser and loads the sample catalog.
# No task role: migrations never touch S3.
resource "aws_ecs_task_definition" "migrate" {
  family                   = "${var.name}-migrate"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_execution.arn

  runtime_platform {
    cpu_architecture        = "X86_64"
    operating_system_family = "LINUX"
  }

  container_definitions = jsonencode([{
    name        = "migrate"
    image       = local.web_image
    essential   = true
    command     = ["python", "manage.py", "migrate", "--noinput"]
    environment = [for key, value in local.migrate_env : { name = key, value = value }]
    secrets     = [for key in local.migrate_secrets : { name = key, valueFrom = local.secret_arns[key] }]
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        awslogs-group         = aws_cloudwatch_log_group.app["migrate"].name
        awslogs-region        = var.region
        awslogs-stream-prefix = "migrate"
      }
    }
  }])
}

resource "aws_ecs_service" "web" {
  name            = "${var.name}-web"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.web.arn
  desired_count   = var.app_desired_count
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = aws_subnet.private[*].id
    security_groups  = [aws_security_group.web.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.web.arn
    container_name   = "web"
    container_port   = 8000
  }

  # Rolling deploys without downtime: a new container must be healthy before an old one stops.
  deployment_minimum_healthy_percent = 100
  deployment_maximum_percent         = 200
  health_check_grace_period_seconds  = 60

  # If new containers keep failing, ECS stops the deploy and goes back to the last working version.
  deployment_circuit_breaker {
    enable   = true
    rollback = true
  }

  # The deploy pipeline registers a new task definition revision with every release (new image).
  # Without this, the next `terraform apply` would roll the service back to Terraform's revision
  # with the old image. Terraform owns the service; the pipeline owns which revision it runs.
  lifecycle {
    ignore_changes = [task_definition]
  }

  # The target group must be attached to the load balancer before a service can use it.
  depends_on = [aws_lb_listener_rule.from_cloudfront]
}

resource "aws_ecs_service" "worker" {
  name            = "${var.name}-worker"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.worker.arn
  desired_count   = var.app_desired_count
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = aws_subnet.private[*].id
    security_groups  = [aws_security_group.worker.id]
    assign_public_ip = false
  }

  deployment_minimum_healthy_percent = 100
  deployment_maximum_percent         = 200

  deployment_circuit_breaker {
    enable   = true
    rollback = true
  }

  lifecycle {
    ignore_changes = [task_definition]
  }
}
