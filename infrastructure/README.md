### Config

- `minikube start --memory=6144`
- `aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 143137682504.dkr.ecr.us-east-1.amazonaws.com`
- ```
  kubectl create secret generic regcred \
      --from-file=.dockerconfigjson=<path from above> \
      --type=kubernetes.io/dockerconfigjson
  ```
- `kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.12.0/deploy/static/provider/cloud/deploy.yaml`
- `minikube addons enable ingress`

And best for the last, to expose an app in minikube you have to reverse-proxy with an nginx instance.
