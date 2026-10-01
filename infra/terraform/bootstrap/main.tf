# Bootstrap: the S3 bucket that stores the main configuration's Terraform state.
#
# Why a separate folder: the main configuration keeps its state in this bucket, so the bucket must
# exist before the main configuration can even start (`terraform init` needs it). This small
# configuration creates it, and keeps its own tiny state in a local file (terraform.tfstate here,
# git-ignored). Run it once at the beginning and destroy it once at the very end.

terraform {
  required_version = ">= 1.11"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.7"
    }
  }
}

variable "account_id" {
  description = "The AWS account number. Terraform refuses to run against any other account."
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

provider "aws" {
  region = var.region
  # Named explicitly so the other application's [default] keys can never be used by mistake.
  profile             = var.aws_profile
  allowed_account_ids = [var.account_id]

  default_tags {
    tags = {
      Project   = "shoplite-demo"
      Owner     = "subin"
      ManagedBy = "terraform"
    }
  }
}

# Bucket names are global across all AWS accounts, so a random ending avoids clashes.
resource "random_id" "suffix" {
  byte_length = 3
}

resource "aws_s3_bucket" "state" {
  bucket = "shoplite-tfstate-${random_id.suffix.hex}"

  # Lets `terraform destroy` delete the bucket together with every old state version at the end.
  # A real team would set this to false (and add deletion protection): losing the state means
  # Terraform no longer knows what it created.
  force_destroy = true
}

# Every state change is kept as a version, so a broken state can be rolled back.
resource "aws_s3_bucket_versioning" "state" {
  bucket = aws_s3_bucket.state.id

  versioning_configuration {
    status = "Enabled"
  }
}

# State files can contain resource details, so they're encrypted at rest.
resource "aws_s3_bucket_server_side_encryption_configuration" "state" {
  bucket = aws_s3_bucket.state.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "state" {
  bucket = aws_s3_bucket.state.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Refuse any request that isn't over HTTPS.
resource "aws_s3_bucket_policy" "state" {
  bucket = aws_s3_bucket.state.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid       = "HttpsOnly"
      Effect    = "Deny"
      Principal = "*"
      Action    = "s3:*"
      Resource  = [aws_s3_bucket.state.arn, "${aws_s3_bucket.state.arn}/*"]
      Condition = { Bool = { "aws:SecureTransport" = "false" } }
    }]
  })

  depends_on = [aws_s3_bucket_public_access_block.state]
}

output "state_bucket" {
  description = "Put this name into ../backend.hcl."
  value       = aws_s3_bucket.state.bucket
}
