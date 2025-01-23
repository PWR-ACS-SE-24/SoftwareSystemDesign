### Config

- `aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 143137682504.dkr.ecr.us-east-1.amazonaws.com`
- ```
  kubectl create secret generic regcred \
      --from-file=.dockerconfigjson=<path from above> \
      --type=kubernetes.io/dockerconfigjson
  ```
- `kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.12.0/deploy/static/provider/cloud/deploy.yaml`
