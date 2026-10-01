# ---------- Where and who ----------

variable "account_id" {
  description = "The AWS account number. Terraform refuses to run against any other account. Set it in terraform.tfvars (git-ignored: the repository is public)."
  type        = string
}

variable "aws_profile" {
  description = "The profile in %USERPROFILE%\\.aws\\credentials that holds the shoplite-terraform key."
  type        = string
  default     = "shoplite-terraform"
}

variable "region" {
  type    = string
  default = "us-east-1"
}

variable "owner" {
  description = "Value of the Owner tag."
  type        = string
  default     = "subin"
}

variable "name" {
  description = "Prefix for resource names. The IAM permissions of the shoplite-terraform user only allow roles named shoplite-*."
  type        = string
  default     = "shoplite"
}

# ---------- Network ----------

variable "vpc_cidr" {
  type    = string
  default = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "Two zones: the load balancer and the database subnet group both need at least two."
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b"]
}

# ---------- Application ----------

variable "app_desired_count" {
  description = "How many web and worker containers to run. 0 for the first apply (no images exist yet), then 1."
  type        = number
  default     = 0
}

variable "initial_image_tag" {
  description = "Image tag written into the first task definitions. The deploy pipeline replaces it with the commit id, and the services ignore later changes."
  type        = string
  default     = "not-built-yet"
}

variable "db_instance_class" {
  type    = string
  default = "db.t4g.micro"
}

variable "cache_node_type" {
  type    = string
  default = "cache.t4g.micro"
}

variable "log_retention_days" {
  description = "How long CloudWatch keeps container logs. Short on purpose: this is a demo."
  type        = number
  default     = 1
}

variable "admin_email" {
  description = "Email of the Django superuser created by the one-off createsuperuser task."
  type        = string
}

variable "shop_currency" {
  type    = string
  default = "INR"
}

variable "razorpay_key_id" {
  description = "Razorpay test key id (public). Leave empty to run without payments."
  type        = string
  default     = ""
}

# ---------- GitHub deployments (OIDC) ----------

variable "github_oidc_subject" {
  description = "The exact 'sub' claim of the deploy job's token. This repository uses GitHub's immutable format with owner and repository ids."
  type        = string
  default     = "repo:makaveli006@96381765/shoplite@1394721505:environment:production"
}

variable "create_github_oidc_provider" {
  description = "An account can have only one GitHub OIDC provider. Set to false if another application already created it; it's then looked up instead."
  type        = bool
  default     = true
}

# ---------- Secrets ----------
# Ephemeral variables are never written to the state or the plan file. Set them as TF_VAR_...
# environment variables in the terminal before the first apply (or a secrets_version bump), e.g.
#   $env:TF_VAR_django_superuser_password = ...

variable "secrets_version" {
  description = "Bump this number to write new secret values (rotation). Write-only values are only sent to AWS when it changes."
  type        = number
  default     = 1
}

variable "django_superuser_password" {
  description = "Password for the Django superuser. Needed when the secrets are written (first apply or a new secrets_version)."
  type        = string
  sensitive   = true
  ephemeral   = true
  default     = null
}

variable "razorpay_key_secret" {
  type      = string
  sensitive = true
  ephemeral = true
  default   = null
}

variable "razorpay_webhook_secret" {
  type      = string
  sensitive = true
  ephemeral = true
  default   = null
}

# ---------- Monitoring ----------

variable "alarm_email" {
  description = "Email for CloudWatch alarm notifications (you must click the confirmation link AWS sends). null = no email."
  type        = string
  default     = null
}
