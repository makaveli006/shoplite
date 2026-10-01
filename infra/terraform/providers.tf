provider "aws" {
  region = var.region

  # Named explicitly so the other application's [default] keys can never be used by mistake, and
  # pinned to one account so a wrong key fails before changing anything.
  profile             = var.aws_profile
  allowed_account_ids = [var.account_id]

  # Added to every resource that supports tags: Tag Editor can then list everything this
  # configuration made (ManagedBy = terraform), which is how the teardown is verified.
  default_tags {
    tags = {
      Project   = "shoplite-demo"
      Owner     = var.owner
      ManagedBy = "terraform"
    }
  }
}
