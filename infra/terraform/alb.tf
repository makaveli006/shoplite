# The load balancer (console step 9). It spreads requests over healthy web containers and only
# answers CloudFront: the security group allows only CloudFront's addresses, and the listener
# forwards only requests that carry the secret header CloudFront adds (every CloudFront
# distribution in the world uses those addresses, but only ours knows the header).

# Stored in the Terraform state (CloudFront and the listener both need the real value as a
# normal argument). Acceptable: it only proves "this came through our CloudFront".
resource "random_password" "origin_verify" {
  length  = 40
  special = false
}

resource "aws_lb" "main" {
  name               = "${var.name}-alb"
  load_balancer_type = "application"
  internal           = false
  security_groups    = [aws_security_group.alb.id]
  subnets            = aws_subnet.public[*].id

  drop_invalid_header_fields = true
}

resource "aws_lb_target_group" "web" {
  name        = "${var.name}-web-tg"
  port        = 8000
  protocol    = "HTTP"
  target_type = "ip" # Fargate containers are registered by their private IP
  vpc_id      = aws_vpc.main.id

  # Old containers get 30 s to finish their requests during a deploy (the default 300 s only
  # makes deploys slower).
  deregistration_delay = 30

  # Answered by core.middleware.HealthCheckMiddleware, before Django's ALLOWED_HOSTS check
  # (the load balancer calls the container by IP address).
  health_check {
    path                = "/healthz/"
    matcher             = "200"
    interval            = 15
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 3
  }
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main.arn
  port              = 80
  protocol          = "HTTP"

  # Anything without the secret header: refused.
  default_action {
    type = "fixed-response"
    fixed_response {
      content_type = "text/plain"
      message_body = "Forbidden"
      status_code  = "403"
    }
  }
}

resource "aws_lb_listener_rule" "from_cloudfront" {
  listener_arn = aws_lb_listener.http.arn
  priority     = 1

  condition {
    http_header {
      http_header_name = "X-Origin-Verify"
      values           = [random_password.origin_verify.result]
    }
  }

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.web.arn
  }
}
