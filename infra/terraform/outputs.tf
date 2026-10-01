output "shop_url" {
  description = "The shop's HTTPS address."
  value       = "https://${aws_cloudfront_distribution.main.domain_name}"
}

output "cloudfront_domain" {
  value = aws_cloudfront_distribution.main.domain_name
}

output "razorpay_webhook_url" {
  value = "https://${aws_cloudfront_distribution.main.domain_name}/api/payments/webhook/"
}

output "github_deploy_role_arn" {
  description = "Save as the secret AWS_ROLE_ARN of the GitHub environment \"production\"."
  value       = aws_iam_role.github_deploy.arn
}

# Everything .github/workflows/deploy.yml reads from the "production" environment's variables.
output "github_environment_variables" {
  description = "Variables for the GitHub environment \"production\" (Settings → Environments → production)."
  value = {
    AWS_REGION                 = var.region
    ECR_REPOSITORY_WEB         = aws_ecr_repository.app["web"].name
    ECR_REPOSITORY_WORKER      = aws_ecr_repository.app["worker"].name
    ECS_CLUSTER                = aws_ecs_cluster.main.name
    ECS_SERVICE_WEB            = aws_ecs_service.web.name
    ECS_SERVICE_WORKER         = aws_ecs_service.worker.name
    ECS_TASK_FAMILY_WEB        = aws_ecs_task_definition.web.family
    ECS_TASK_FAMILY_WORKER     = aws_ecs_task_definition.worker.family
    ECS_TASK_FAMILY_MIGRATE    = aws_ecs_task_definition.migrate.family
    PRIVATE_SUBNETS            = join(",", aws_subnet.private[*].id)
    MIGRATE_SECURITY_GROUP     = aws_security_group.web.id
    FRONTEND_BUCKET            = aws_s3_bucket.site["frontend"].bucket
    CLOUDFRONT_DISTRIBUTION_ID = aws_cloudfront_distribution.main.id
    VITE_CURRENCY              = var.shop_currency
  }
}

output "one_off_task_network" {
  description = "Network settings for running the migrate task by hand (createsuperuser, seed_catalog)."
  value = {
    cluster         = aws_ecs_cluster.main.name
    subnets         = aws_subnet.private[*].id
    security_group  = aws_security_group.web.id
    public_ip       = "off"
    task_definition = aws_ecs_task_definition.migrate.family
  }
}
