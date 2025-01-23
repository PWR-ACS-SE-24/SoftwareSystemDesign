resource "local_file" "ips" {
  content  = <<-EOT
  [deployment]
  ${aws_instance.deployment_ec2.public_ip}
  EOT
  filename = "../ansible/inventory.ini"
}

resource "terraform_data" "deployment_provisioner" {
  provisioner "local-exec" {
    working_dir = "../ansible/"
    command     = "ansible-playbook setup_deployment.yaml"
  }

  depends_on = [local_file.ips]
}
