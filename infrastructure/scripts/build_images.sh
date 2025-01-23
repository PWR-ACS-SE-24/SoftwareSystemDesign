#/bin/sh
set -e

SCRIPT_DIR=$(dirname "$0")
ROOT=$(realpath "$SCRIPT_DIR/../../")

REPOSITORIES=$(aws ecr describe-repositories --query 'repositories[*].[repositoryName, repositoryUri]' | jq -r 'map(select(.[0] | startswith("jakprzyjade")) | {key: .[0], value: .[1]}) | from_entries')
CURRENT_TAG=$(git log --pretty=format:'%h' -n 1)



build_image() {
  local image_name=$1
  local dockerfile=$2
  local context=$3

  echo "Building image $image_name"
  docker build -t $image_name -f $dockerfile $context
}

tag_image() {
  local image_name=$1
  local tags=$2
  for tag in $tags; do
    echo "Tagging image $image_name with $tag"
    docker tag $image_name $tag
  done
}

for repository in $(echo $REPOSITORIES | jq -r 'to_entries | .[].key'); do
  service=$(echo $repository | awk '{split($0,a,"/"); print a[2]}');
  repository_uri=$(echo $REPOSITORIES | jq -r ".[\"$repository\"]")

  echo "Processing repository $repository"
  build_image $repository \
              "$ROOT/implementation/$service/Dockerfile" \
              "$ROOT/implementation/$service"
              
  tag_image jakprzyjade/$service:latest \
            "$repository_uri:latest
             $repository_uri:$CURRENT_TAG";

  docker push "$repository_uri:latest";
  docker push "$repository_uri:$CURRENT_TAG";
done