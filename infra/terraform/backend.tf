# Where Terraform keeps its state (its record of what it created): an S3 bucket made by
# bootstrap/. The bucket name and the profile come from backend.hcl, because a backend block
# can't use variables:   terraform init -backend-config=backend.hcl
#
# use_lockfile: while a plan/apply runs, Terraform writes a small .tflock file next to the state,
# so two people (or two terminals) can't change the infrastructure at the same time.
# (Older setups used a DynamoDB table for this; S3's own locking replaced it.)
terraform {
  backend "s3" {
    key          = "shoplite/terraform.tfstate"
    region       = "us-east-1"
    encrypt      = true
    use_lockfile = true
  }
}
