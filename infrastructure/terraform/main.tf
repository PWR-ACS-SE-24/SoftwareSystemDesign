provider "aws" {
  region = "us-east-1"
}

locals {
  private_key = file("~/.ssh/labsuser.pem")
}

data "aws_iam_role" "lab_role" {
  name = "LabRole"
}

data "aws_route53_zone" "bercik_zone" {
  name = "jakprzyjade.bercik.xyz"
}

variable "DATABASE_PASSWORD" {
  type        = string
  description = "Password for the database"
}
