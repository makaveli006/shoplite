# Roles for the containers (console step 7). The same permissions as deploy/aws/iam/*.json, but
# written as aws_iam_policy_document data sources: Terraform fills in the real ARNs, so there
# are no <PLACEHOLDERS> to edit by hand.
#
# Execution role = used by ECS itself to start a container (pull the image, read the secrets,
#                  send the logs).
# Task role      = used by the application code inside the container (Django saving to S3).

data "aws_iam_policy_document" "ecs_tasks_assume" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

# ---------- Execution role ----------

resource "aws_iam_role" "ecs_execution" {
  name               = "${var.name}-ecs-execution-role"
  assume_role_policy = data.aws_iam_policy_document.ecs_tasks_assume.json
}

# AWS's own policy: pull from ECR, write to CloudWatch Logs.
resource "aws_iam_role_policy_attachment" "ecs_execution_managed" {
  role       = aws_iam_role.ecs_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

data "aws_iam_policy_document" "read_secrets" {
  statement {
    sid       = "ReadShopLiteSecretsOnly"
    actions   = ["ssm:GetParameters"]
    resources = [for parameter in aws_ssm_parameter.secret : parameter.arn]
  }
}

resource "aws_iam_role_policy" "ecs_execution_secrets" {
  name   = "${var.name}-read-secrets"
  role   = aws_iam_role.ecs_execution.id
  policy = data.aws_iam_policy_document.read_secrets.json
}

# ---------- Task roles ----------

data "aws_iam_policy_document" "web_media" {
  statement {
    sid       = "ReadWriteProductPictures"
    actions   = ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"]
    resources = ["${aws_s3_bucket.site["media"].arn}/media/*"]
  }
  statement {
    sid       = "SeeWhichPicturesExist"
    actions   = ["s3:ListBucket"]
    resources = [aws_s3_bucket.site["media"].arn]
  }
}

data "aws_iam_policy_document" "worker_media" {
  statement {
    sid       = "ReadProductPicturesForEmails"
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.site["media"].arn}/media/*"]
  }
  statement {
    sid       = "SeeWhichPicturesExist"
    actions   = ["s3:ListBucket"]
    resources = [aws_s3_bucket.site["media"].arn]
  }
}

resource "aws_iam_role" "web_task" {
  name               = "${var.name}-web-task-role"
  assume_role_policy = data.aws_iam_policy_document.ecs_tasks_assume.json
}

resource "aws_iam_role_policy" "web_task_media" {
  name   = "${var.name}-web-media"
  role   = aws_iam_role.web_task.id
  policy = data.aws_iam_policy_document.web_media.json
}

resource "aws_iam_role" "worker_task" {
  name               = "${var.name}-worker-task-role"
  assume_role_policy = data.aws_iam_policy_document.ecs_tasks_assume.json
}

resource "aws_iam_role_policy" "worker_task_media" {
  name   = "${var.name}-worker-media"
  role   = aws_iam_role.worker_task.id
  policy = data.aws_iam_policy_document.worker_media.json
}
