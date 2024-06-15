provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Environment    = var.environment_name
      Terraformed    = "true"
      Repository     = "bendhealth/learn-bend-cares-multi"
      Infrastructure = var.infra_environment_name
    }
  }
}
