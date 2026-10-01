# CloudFront (console step 10): the one HTTPS address for the whole shop.
#   default      → S3 frontend bucket (React build) + the SPA-routing function
#   /media/*     → S3 media bucket (uploaded pictures)
#   /api/*, /api-auth/*, /django-admin/*, /static/*  → the load balancer (Django)
# Written out explicitly, so nothing is added behind our back (the console wizard attached a
# WAF whose rules blocked uploads over 8 KB).

# Lets CloudFront sign its requests to the private buckets; the bucket policies below only
# accept requests signed for this distribution.
resource "aws_cloudfront_origin_access_control" "s3" {
  name                              = "${var.name}-s3"
  description                       = "CloudFront reads the private ShopLite buckets"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# The same file that was pasted into the console: React page addresses → /index.html.
resource "aws_cloudfront_function" "spa_routing" {
  name    = "${var.name}-spa-routing"
  runtime = "cloudfront-js-2.0"
  comment = "Serve index.html for React page addresses"
  publish = true
  code    = file("${path.module}/../../deploy/aws/cloudfront-spa-routing.js")
}

# AWS-managed policies, looked up by name.
data "aws_cloudfront_cache_policy" "disabled" {
  name = "Managed-CachingDisabled"
}

data "aws_cloudfront_cache_policy" "optimized" {
  name = "Managed-CachingOptimized"
}

# Forwards everything the browser sent (cookies, query strings, the Authorization header, Host)
# plus CloudFront's own headers such as CloudFront-Forwarded-Proto, which Django uses to know
# the visitor used HTTPS.
data "aws_cloudfront_origin_request_policy" "all_viewer" {
  name = "Managed-AllViewerAndCloudFrontHeaders-2022-06"
}

locals {
  # Django's paths: never cached, every method allowed.
  django_paths = ["/api/*", "/api-auth/*", "/django-admin/*"]
}

resource "aws_cloudfront_distribution" "main" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "ShopLite"
  default_root_object = "index.html"
  price_class         = "PriceClass_100" # North America + Europe edges only: the cheapest class

  origin {
    origin_id                = "frontend"
    domain_name              = aws_s3_bucket.site["frontend"].bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.s3.id
  }

  origin {
    origin_id                = "media"
    domain_name              = aws_s3_bucket.site["media"].bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.s3.id
  }

  origin {
    origin_id   = "alb"
    domain_name = aws_lb.main.dns_name

    # CloudFront → load balancer is plain HTTP inside AWS's network. With a custom domain,
    # production would put a certificate on the load balancer and use https-only here.
    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }

    # The secret that the load balancer's listener rule checks.
    custom_header {
      name  = "X-Origin-Verify"
      value = random_password.origin_verify.result
    }
  }

  # Default: the React app.
  default_cache_behavior {
    target_origin_id       = "frontend"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    cache_policy_id        = data.aws_cloudfront_cache_policy.optimized.id
    compress               = true

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.spa_routing.arn
    }
  }

  dynamic "ordered_cache_behavior" {
    for_each = local.django_paths

    content {
      path_pattern             = ordered_cache_behavior.value
      target_origin_id         = "alb"
      viewer_protocol_policy   = "redirect-to-https"
      allowed_methods          = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
      cached_methods           = ["GET", "HEAD"]
      cache_policy_id          = data.aws_cloudfront_cache_policy.disabled.id
      origin_request_policy_id = data.aws_cloudfront_origin_request_policy.all_viewer.id
      compress                 = true
    }
  }

  # The Django admin's CSS/JS, served by WhiteNoise. Filenames carry a hash, so caching is safe.
  ordered_cache_behavior {
    path_pattern             = "/static/*"
    target_origin_id         = "alb"
    viewer_protocol_policy   = "redirect-to-https"
    allowed_methods          = ["GET", "HEAD"]
    cached_methods           = ["GET", "HEAD"]
    cache_policy_id          = data.aws_cloudfront_cache_policy.optimized.id
    origin_request_policy_id = data.aws_cloudfront_origin_request_policy.all_viewer.id
    compress                 = true
  }

  # Uploaded pictures: /media/products/x.jpg is the object media/products/x.jpg
  # (django-storages saves under location="media").
  ordered_cache_behavior {
    path_pattern           = "/media/*"
    target_origin_id       = "media"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    cache_policy_id        = data.aws_cloudfront_cache_policy.optimized.id
    compress               = true
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  # The free *.cloudfront.net certificate: HTTPS without buying a domain.
  viewer_certificate {
    cloudfront_default_certificate = true
  }
}

# ---------- Bucket policies: only this distribution may read ----------

data "aws_iam_policy_document" "cloudfront_reads_frontend" {
  statement {
    sid       = "CloudFrontReadsTheReactApp"
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.site["frontend"].arn}/*"]
    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }
    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.main.arn]
    }
  }
}

data "aws_iam_policy_document" "cloudfront_reads_media" {
  statement {
    sid       = "CloudFrontReadsProductPictures"
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.site["media"].arn}/media/*"]
    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }
    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.main.arn]
    }
  }
}

resource "aws_s3_bucket_policy" "frontend" {
  bucket = aws_s3_bucket.site["frontend"].id
  policy = data.aws_iam_policy_document.cloudfront_reads_frontend.json

  depends_on = [aws_s3_bucket_public_access_block.site]
}

resource "aws_s3_bucket_policy" "media" {
  bucket = aws_s3_bucket.site["media"].id
  policy = data.aws_iam_policy_document.cloudfront_reads_media.json

  depends_on = [aws_s3_bucket_public_access_block.site]
}
