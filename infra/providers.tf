terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket       = "tf-state-cloud-resume--862264091652-us-east-2-an"
    key          = "prod/terraform.tfstate"
    region       = "us-east-2"
    use_lockfile = true
    encrypt      = true
  }

}

# Default provider (Ohio)
provider "aws" {
  region  = "us-east-2"
}

# Secondary provider (N. Virginia) 
provider "aws" {
  alias   = "us_east_1"
  region  = "us-east-1"
}
