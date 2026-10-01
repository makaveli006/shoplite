terraform {
  # 1.11 is the first version with write-only arguments (`password_wo`, `value_wo`), which keep
  # the generated secrets out of the state file.
  required_version = ">= 1.11"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.7" # 3.7 added the ephemeral random_password
    }
  }
}
