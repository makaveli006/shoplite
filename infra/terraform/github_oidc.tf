# GitHub Actions → AWS without stored keys (console step 7).
# GitHub gives each deploy job a short-lived signed token; AWS checks it against this OIDC
# provider and the role's trust policy, and hands back temporary credentials.

resource "aws_iam_openid_connect_provider" "github" {
  count = var.create_github_oidc_provider ? 1 : 0

  url            = "https://token.actions.githubusercontent.com"
  client_id_list = ["sts.amazonaws.com"]
}

# An account can only have one provider for this address. If another application already made
# it, set create_github_oidc_provider = false and reuse theirs (deleting ours would break theirs).
data "aws_iam_openid_connect_provider" "github" {
  count = var.create_github_oidc_provider ? 0 : 1

  url = "https://token.actions.githubusercontent.com"
}

locals {
  github_oidc_provider_arn = (var.create_github_oidc_provider
    ? aws_iam_openid_connect_provider.github[0].arn
  : data.aws_iam_openid_connect_provider.github[0].arn)
}

# Only deploy jobs of this repository that run in the "production" environment (which needs a
# person's approval) may use the role.
data "aws_iam_policy_document" "github_deploy_trust" {
  statement {
    sid     = "OnlyShopLiteProductionDeploysFromGitHub"
    actions = ["sts:AssumeRoleWithWebIdentity"]

    principals {
      type        = "Federated"
      identifiers = [local.github_oidc_provider_arn]
    }
    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }
    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:sub"
      values   = [var.github_oidc_subject]
    }
  }
}

# Everything .github/workflows/deploy.yml does, and nothing more.
data "aws_iam_policy_document" "github_deploy" {
  statement {
    sid       = "SignInToECR"
    actions   = ["ecr:GetAuthorizationToken"]
    resources = ["*"] # this action has no resource to limit it to
  }
  statement {
    sid = "PushImagesToShopLiteRepositoriesOnly"
    actions = [
      "ecr:BatchCheckLayerAvailability",
      "ecr:InitiateLayerUpload",
      "ecr:UploadLayerPart",
      "ecr:CompleteLayerUpload",
      "ecr:PutImage",
      "ecr:BatchGetImage",
    ]
    resources = [for repository in aws_ecr_repository.app : repository.arn]
  }
  statement {
    sid       = "ReadAndRegisterTaskDefinitions"
    actions   = ["ecs:DescribeTaskDefinition", "ecs:RegisterTaskDefinition"]
    resources = ["*"] # these actions don't support resource limits
  }
  statement {
    sid       = "UpdateShopLiteServices"
    actions   = ["ecs:UpdateService", "ecs:DescribeServices"]
    resources = [aws_ecs_service.web.id, aws_ecs_service.worker.id]
  }
  statement {
    sid       = "RunTheMigrationTask"
    actions   = ["ecs:RunTask"]
    resources = ["arn:aws:ecs:${var.region}:${var.account_id}:task-definition/${aws_ecs_task_definition.migrate.family}:*"]
    condition {
      test     = "ArnEquals"
      variable = "ecs:cluster"
      values   = [aws_ecs_cluster.main.arn]
    }
  }
  statement {
    sid       = "WatchTheMigrationTask"
    actions   = ["ecs:DescribeTasks"]
    resources = ["arn:aws:ecs:${var.region}:${var.account_id}:task/${aws_ecs_cluster.main.name}/*"]
  }
  statement {
    # Registering a task definition that names a role means "let ECS act as this role". Without
    # this limit, the pipeline could hand ECS a more powerful role and escalate its own rights.
    sid       = "HandTheShopLiteRolesToECS"
    actions   = ["iam:PassRole"]
    resources = [aws_iam_role.ecs_execution.arn, aws_iam_role.web_task.arn, aws_iam_role.worker_task.arn]
    condition {
      test     = "StringEquals"
      variable = "iam:PassedToService"
      values   = ["ecs-tasks.amazonaws.com"]
    }
  }
  statement {
    sid       = "UploadTheReactApp"
    actions   = ["s3:PutObject", "s3:DeleteObject"]
    resources = ["${aws_s3_bucket.site["frontend"].arn}/*"]
  }
  statement {
    sid       = "CompareTheReactAppFiles"
    actions   = ["s3:ListBucket"]
    resources = [aws_s3_bucket.site["frontend"].arn]
  }
  statement {
    sid       = "RefreshTheShopLiteDistributionOnly"
    actions   = ["cloudfront:CreateInvalidation"]
    resources = [aws_cloudfront_distribution.main.arn]
  }
}

resource "aws_iam_role" "github_deploy" {
  name               = "${var.name}-github-deploy"
  assume_role_policy = data.aws_iam_policy_document.github_deploy_trust.json
}

resource "aws_iam_role_policy" "github_deploy" {
  name   = "${var.name}-deploy"
  role   = aws_iam_role.github_deploy.id
  policy = data.aws_iam_policy_document.github_deploy.json
}
