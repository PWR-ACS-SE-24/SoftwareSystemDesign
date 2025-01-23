resource "aws_vpc" "jakprzyjade_vpc" {
  cidr_block       = "10.0.0.0/16"
  instance_tenancy = "default"

  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "Jakprzyjade VPC"
  }
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.jakprzyjade_vpc.id

  tags = {
    Name = "Jakprzyjade IGW"
  }
}

resource "aws_route" "public_route" {
  route_table_id         = aws_vpc.jakprzyjade_vpc.default_route_table_id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.igw.id
}

resource "aws_route_table_association" "subnet_route_association_1" {
  subnet_id      = aws_subnet.database_public_subnet_a.id
  route_table_id = aws_vpc.jakprzyjade_vpc.default_route_table_id
}

resource "aws_route_table_association" "subnet_route_association_2" {
  subnet_id      = aws_subnet.database_public_subnet_b.id
  route_table_id = aws_vpc.jakprzyjade_vpc.default_route_table_id
}

resource "aws_route_table_association" "subnet_route_association_3" {
  subnet_id      = aws_subnet.app_public_subnet_a.id
  route_table_id = aws_vpc.jakprzyjade_vpc.default_route_table_id
}

resource "aws_subnet" "database_public_subnet_a" {
  vpc_id            = aws_vpc.jakprzyjade_vpc.id
  cidr_block        = "10.0.0.0/24"
  availability_zone = "us-east-1a"

  tags = {
    Name = "Database Public Subnet 1"
  }
}

resource "aws_subnet" "database_public_subnet_b" {
  vpc_id            = aws_vpc.jakprzyjade_vpc.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "us-east-1b"

  tags = {
    Name = "Database Public Subnet 2"
  }
}

resource "aws_subnet" "app_public_subnet_a" {
  vpc_id            = aws_vpc.jakprzyjade_vpc.id
  cidr_block        = "10.0.10.0/24"
  availability_zone = "us-east-1a"

  tags = {
    Name = "App Public Subnet 1"
  }
}
