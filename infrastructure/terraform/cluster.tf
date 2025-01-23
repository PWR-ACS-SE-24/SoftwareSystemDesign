resource "aws_eks_cluster" "jakprzyjade-cluster" {
  name     = "jakprzyjade-cluster"
  role_arn = data.aws_iam_role.lab_role.arn

  vpc_config {
    subnet_ids = [aws_subnet.app_public_subnet_a.id, aws_subnet.app_public_subnet_b.id, aws_subnet.app_public_subnet_c.id]
  }
}

resource "aws_eks_node_group" "jakprzyjade_primary_node_group" {
  cluster_name    = aws_eks_cluster.jakprzyjade-cluster.name
  node_group_name = "node-group"
  node_role_arn   = data.aws_iam_role.lab_role.arn
  subnet_ids      = [aws_subnet.app_public_subnet_a.id, aws_subnet.app_public_subnet_b.id, aws_subnet.app_public_subnet_c.id]

  instance_types = ["t2.medium"]

  scaling_config {
    desired_size = 2
    max_size     = 6
    min_size     = 1
  }

  update_config {
    max_unavailable = 1
  }
}
