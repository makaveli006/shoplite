# Secrets (console step 6), kept out of Terraform's state file.
#
# Normally every argument Terraform sends to AWS is also saved in the state, so a generated
# password would sit in the state bucket in plain text. Here:
# - "ephemeral" passwords are generated during the run and then forgotten (never saved), and
# - they're passed to AWS through write-only arguments (`value_wo`, `password_wo`), which are
#   sent to AWS but never stored.
# Write-only values are only sent when their *_wo_version number changes. Bumping
# var.secrets_version therefore writes a fresh database password to RDS *and* to SSM in the
# same run (rotation); the running containers pick it up on their next deploy.

ephemeral "random_password" "django_secret_key" {
  length  = 64
  special = false
}

ephemeral "random_password" "db_password" {
  length  = 32
  special = false # RDS refuses some symbols (/ " @ and spaces)
}

locals {
  # Name under /shoplite/ => value. The task definitions inject them as environment variables.
  # Values given as null (an optional variable that wasn't set) are stored as "not-set", because
  # every task definition expects every parameter to exist.
  secret_values = {
    DJANGO_SECRET_KEY         = ephemeral.random_password.django_secret_key.result
    DB_PASSWORD               = ephemeral.random_password.db_password.result
    DJANGO_SUPERUSER_PASSWORD = coalesce(var.django_superuser_password, "not-set")
    RAZORPAY_KEY_SECRET       = coalesce(var.razorpay_key_secret, "not-set")
    RAZORPAY_WEBHOOK_SECRET   = coalesce(var.razorpay_webhook_secret, "not-set")
  }

  secret_names = toset([
    "DJANGO_SECRET_KEY",
    "DB_PASSWORD",
    "DJANGO_SUPERUSER_PASSWORD",
    "RAZORPAY_KEY_SECRET",
    "RAZORPAY_WEBHOOK_SECRET",
  ])
}

resource "aws_ssm_parameter" "secret" {
  for_each = local.secret_names

  name             = "/${var.name}/${each.key}"
  type             = "SecureString" # encrypted with the AWS-managed key aws/ssm
  value_wo         = local.secret_values[each.key]
  value_wo_version = var.secrets_version
}
