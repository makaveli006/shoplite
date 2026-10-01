# The data tier (console step 4): PostgreSQL and the Celery queue, both in the private subnets.

resource "aws_db_subnet_group" "main" {
  name       = "${var.name}-db-subnets"
  subnet_ids = aws_subnet.private[*].id
}

resource "aws_db_instance" "main" {
  identifier     = "${var.name}-db"
  engine         = "postgres"
  engine_version = "16" # the newest 16.x; the search features need PostgreSQL (full-text, trigram)
  instance_class = var.db_instance_class

  allocated_storage = 20
  storage_type      = "gp3"
  storage_encrypted = true

  db_name  = "shoplite"
  username = "shoplite"
  # Write-only: sent to AWS, never saved in the state (see secrets.tf). The same value is
  # stored in SSM as /shoplite/DB_PASSWORD for the containers.
  password_wo         = ephemeral.random_password.db_password.result
  password_wo_version = var.secrets_version

  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.db.id]
  publicly_accessible    = false
  multi_az               = false # production: true (a standby copy in the second zone, double the price)

  backup_retention_period = 1
  # Demo settings so `terraform destroy` removes everything. Production: keep a final snapshot,
  # keep automated backups, and turn deletion protection on.
  skip_final_snapshot      = true
  delete_automated_backups = true
  deletion_protection      = false
  apply_immediately        = true
}

resource "aws_elasticache_subnet_group" "main" {
  name       = "${var.name}-cache-subnets"
  subnet_ids = aws_subnet.private[*].id
}

# Valkey: the open-source fork of Redis, same protocol (Celery's redis:// URL works), about 20%
# cheaper on ElastiCache. One node, no replica.
resource "aws_elasticache_replication_group" "main" {
  replication_group_id = "${var.name}-cache"
  description          = "Celery message queue for ShopLite"
  engine               = "valkey"
  node_type            = var.cache_node_type
  num_cache_clusters   = 1
  port                 = 6379

  subnet_group_name  = aws_elasticache_subnet_group.main.name
  security_group_ids = [aws_security_group.redis.id]

  automatic_failover_enabled = false # needs a replica
  at_rest_encryption_enabled = true
  # Off, so Celery can use plain redis://. Production: turn it on plus an auth token, and use
  # rediss:// in CELERY_BROKER_URL.
  transit_encryption_enabled = false

  snapshot_retention_limit = 0 # a queue, nothing worth backing up
  apply_immediately        = true
}
