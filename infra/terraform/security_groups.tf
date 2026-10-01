# Firewalls (console step 3). Rules point at other security groups instead of IP addresses
# ("only the load balancer may reach the web port"), so they keep working as containers come and go.
#
# Each rule is its own resource (aws_vpc_security_group_*_rule) rather than an inline block:
# that's the current recommended style, and a rule can change without touching the group.
# Note: Terraform removes AWS's default "allow all outgoing" rule from groups it creates,
# so the outgoing rules are written out below.

# CloudFront's servers, as an AWS-managed list of address ranges.
data "aws_ec2_managed_prefix_list" "cloudfront" {
  name = "com.amazonaws.global.cloudfront.origin-facing"
}

resource "aws_security_group" "alb" {
  name        = "${var.name}-alb-sg"
  description = "Load balancer: HTTP only from CloudFront"
  vpc_id      = aws_vpc.main.id
  tags        = { Name = "${var.name}-alb-sg" }
}

resource "aws_security_group" "web" {
  name        = "${var.name}-web-sg"
  description = "Web containers (Gunicorn): port 8000 only from the load balancer"
  vpc_id      = aws_vpc.main.id
  tags        = { Name = "${var.name}-web-sg" }
}

resource "aws_security_group" "worker" {
  name        = "${var.name}-worker-sg"
  description = "Celery worker: no incoming connections"
  vpc_id      = aws_vpc.main.id
  tags        = { Name = "${var.name}-worker-sg" }
}

resource "aws_security_group" "db" {
  name        = "${var.name}-db-sg"
  description = "PostgreSQL: only from the web and worker containers"
  vpc_id      = aws_vpc.main.id
  tags        = { Name = "${var.name}-db-sg" }
}

resource "aws_security_group" "redis" {
  name        = "${var.name}-redis-sg"
  description = "Valkey (Celery queue): only from the web and worker containers"
  vpc_id      = aws_vpc.main.id
  tags        = { Name = "${var.name}-redis-sg" }
}

# ---------- Incoming ----------

resource "aws_vpc_security_group_ingress_rule" "alb_from_cloudfront" {
  security_group_id = aws_security_group.alb.id
  description       = "HTTP from CloudFront only"
  prefix_list_id    = data.aws_ec2_managed_prefix_list.cloudfront.id
  ip_protocol       = "tcp"
  from_port         = 80
  to_port           = 80
}

resource "aws_vpc_security_group_ingress_rule" "web_from_alb" {
  security_group_id            = aws_security_group.web.id
  description                  = "Gunicorn from the load balancer"
  referenced_security_group_id = aws_security_group.alb.id
  ip_protocol                  = "tcp"
  from_port                    = 8000
  to_port                      = 8000
}

# The database and the cache accept the web containers (which the migration task also uses)
# and the worker.
locals {
  app_security_groups = {
    web    = aws_security_group.web.id
    worker = aws_security_group.worker.id
  }
}

resource "aws_vpc_security_group_ingress_rule" "db_from_app" {
  for_each = local.app_security_groups

  security_group_id            = aws_security_group.db.id
  description                  = "PostgreSQL from the ${each.key} containers"
  referenced_security_group_id = each.value
  ip_protocol                  = "tcp"
  from_port                    = 5432
  to_port                      = 5432
}

resource "aws_vpc_security_group_ingress_rule" "redis_from_app" {
  for_each = local.app_security_groups

  security_group_id            = aws_security_group.redis.id
  description                  = "Valkey from the ${each.key} containers"
  referenced_security_group_id = each.value
  ip_protocol                  = "tcp"
  from_port                    = 6379
  to_port                      = 6379
}

# ---------- Outgoing ----------

# The load balancer only needs to reach the web containers.
resource "aws_vpc_security_group_egress_rule" "alb_to_web" {
  security_group_id            = aws_security_group.alb.id
  description                  = "To the web containers"
  referenced_security_group_id = aws_security_group.web.id
  ip_protocol                  = "tcp"
  from_port                    = 8000
  to_port                      = 8000
}

# The containers make outgoing connections to many places (ECR, SSM, CloudWatch, S3, the
# database, the cache, Razorpay, the mail server), so they may go anywhere. The database and
# the cache need no outgoing rules at all.
resource "aws_vpc_security_group_egress_rule" "app_anywhere" {
  for_each = local.app_security_groups

  security_group_id = each.value
  description       = "Outgoing connections from the ${each.key} containers"
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "-1"
}
