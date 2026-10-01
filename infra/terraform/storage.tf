# Storage (console step 5): two private S3 buckets and two image repositories.

# Bucket names are global across all AWS accounts, so a random ending avoids clashes
# (and avoids reusing the names of the console build's deleted buckets).
resource "random_id" "bucket_suffix" {
  byte_length = 3
}

locals {
  buckets = {
    frontend = "${var.name}-frontend-${random_id.bucket_suffix.hex}" # the React build
    media    = "${var.name}-media-${random_id.bucket_suffix.hex}"    # uploaded product pictures
  }
}

resource "aws_s3_bucket" "site" {
  for_each = local.buckets

  bucket = each.value
  # Lets `terraform destroy` delete the buckets even with files in them. Fine for a demo; on a
  # real shop this would destroy every uploaded picture, so it would be false.
  force_destroy = true
}

# Nobody reads these buckets directly; only CloudFront can (bucket policies in cdn.tf).
resource "aws_s3_bucket_public_access_block" "site" {
  for_each = aws_s3_bucket.site

  bucket                  = each.value.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_ecr_repository" "app" {
  for_each = toset(["web", "worker"])

  name = "${var.name}/${each.key}"
  # A tag (the commit id) can never be pointed at different code later.
  image_tag_mutability = "IMMUTABLE"
  # Lets `terraform destroy` delete the repositories with their images inside.
  force_delete = true

  image_scanning_configuration {
    scan_on_push = true # free basic scan for known vulnerabilities
  }
}

# Keep only the last 5 images, so storage doesn't grow with every deploy (rollback room: 4).
resource "aws_ecr_lifecycle_policy" "app" {
  for_each = aws_ecr_repository.app

  repository = each.value.name
  policy = jsonencode({
    rules = [{
      rulePriority = 1
      description  = "Keep the last 5 images"
      selection = {
        tagStatus   = "any"
        countType   = "imageCountMoreThan"
        countNumber = 5
      }
      action = { type = "expire" }
    }]
  })
}
