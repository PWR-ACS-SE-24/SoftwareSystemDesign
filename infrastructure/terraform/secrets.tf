resource "local_sensitive_file" "name" {
  filename = "../eks/secrets/secrets.yaml"
  content  = <<EOT

apiVersion: v1
kind: Secret
metadata:
  name: jobberknoll-secret-map
type: Opaque
stringData:
  JWT_ALGORITHM: "ES384"
  JWT_PRIVATE_KEY: ${replace(file("../eks/secrets/ec_p384_private.pem"), "\n", "")}
  JWT_PUBLIC_KEY: ${replace(file("../eks/secrets/ec_p384_public.pem"), "\n", "")}

---

# This is a generic secret that can be used by any service that needs to connect to the database
apiVersion: v1
kind: Secret
metadata:
  name: generic-database-info
type: Opaque
stringData:

  # java folks:
  DATABASE_HOST: ${aws_db_instance.jakprzyjade_database.address}
  DATABASE_USER: ${aws_db_instance.jakprzyjade_database.username}
  DATABASE_PASSWORD: ${var.DATABASE_PASSWORD}

  # node folks:
  LEPRECHAUN_DATABASE_HOST: postgres://${aws_db_instance.jakprzyjade_database.username}:${var.DATABASE_PASSWORD}@${aws_db_instance.jakprzyjade_database.address}:5432/
  JOBBERKNOLL_DATABASE_URL: postgres://${aws_db_instance.jakprzyjade_database.username}:${var.DATABASE_PASSWORD}@${aws_db_instance.jakprzyjade_database.address}:5432/jobberknoll
EOT
}
