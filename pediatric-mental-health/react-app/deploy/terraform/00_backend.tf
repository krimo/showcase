terraform {
  cloud {
    organization = "Bend-Health"

    workspaces {
      tags = ["source:cli"]
    }
  }

  required_providers {
    aws = {
      version = "~> 4.0"
      source  = "hashicorp/aws"
    }
  }
}
