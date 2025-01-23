resource "aws_db_instance" "jakprzyjade_database" {
  allocated_storage      = 10
  engine                 = "postgres"
  engine_version         = "17.2"
  instance_class         = "db.t4g.micro"
  username               = "postgres"
  db_name                = "postgres"
  password               = var.DATABASE_PASSWORD
  skip_final_snapshot    = true
  multi_az               = false
  publicly_accessible    = true
  identifier             = "jakprzyjade-db"
  db_subnet_group_name   = aws_db_subnet_group.database_subnet_group.name
  vpc_security_group_ids = [aws_security_group.database_sg.id]
  parameter_group_name   = aws_db_parameter_group.jakprzyjade_parameter_group.name

  tags = {
    Name = "Jakprzyjade Database"
  }
}

resource "aws_db_parameter_group" "jakprzyjade_parameter_group" {
  family = "postgres17"
  name   = "jakprzyjade-db-parameter-group"

  parameter {
    name  = "rds.force_ssl"
    value = "0"
  }
}

resource "aws_security_group" "database_sg" {
  name        = "database_sg"
  description = "Security group for the database"
  vpc_id      = aws_vpc.jakprzyjade_vpc.id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port   = -1
    to_port     = -1
    protocol    = "icmp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "Database Security Group"
  }
}

resource "aws_db_subnet_group" "database_subnet_group" {
  name       = "database_subnet_group"
  subnet_ids = [aws_subnet.database_public_subnet_a.id, aws_subnet.database_public_subnet_b.id]

  tags = {
    Name = "Database Subnet Group"
  }
}

resource "terraform_data" "seed_database" {
  provisioner "local-exec" {
    working_dir = "../"
    command     = "./scripts/seed_db.sh ${aws_db_instance.jakprzyjade_database.address}"
  }

  depends_on = [aws_db_instance.jakprzyjade_database]
}
