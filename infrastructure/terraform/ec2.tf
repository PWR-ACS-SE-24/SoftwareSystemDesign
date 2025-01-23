// It's such a bummer that we can't do it using EKS
resource "aws_instance" "deployment_ec2" {
  ami             = "ami-04b4f1a9cf54c11d0"
  instance_type   = "t3a.large"
  subnet_id       = aws_subnet.app_public_subnet_a.id
  security_groups = [aws_security_group.deployment_sg.id]

  associate_public_ip_address = true

  key_name             = "vockey"
  iam_instance_profile = "LabInstanceProfile"

  root_block_device {
    volume_size = 20
    tags        = {}
  }

  connection {
    type        = "ssh"
    user        = "ubuntu"
    private_key = local.private_key
    host        = self.public_ip
  }

  provisioner "remote-exec" {
    inline = ["echo Waiting for connection..."]
  }

  tags = {
    Name = "Jakprzyjade EC2"
  }
}


resource "aws_security_group" "deployment_sg" {
  name        = "deployment_sg"
  description = "Security group for the Jakprzyjade deployment machine"
  vpc_id      = aws_vpc.jakprzyjade_vpc.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
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
    Name = "Jakprzyjade Deployment Security Group"
  }
}
