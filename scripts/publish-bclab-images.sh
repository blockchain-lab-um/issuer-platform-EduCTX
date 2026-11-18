#!/bin/bash
set -euo pipefail

publish() {
  local app=$1 image="ghcr.io/blockchain-lab-um/eductx-platform-$2" tag
  tag="$image:sha-$GITHUB_SHA"
  docker tag "eductx-runtime-test-$app:node24" "$tag"
  docker push "$tag" >&2
  docker image inspect "$tag" --format '{{json .RepoDigests}}' |
    jq -er --arg name "$image@" '.[] | select(startswith($name))'
}

# The interop workloads use the same builds with their own runtime configuration.
pins=$(
  set -e
  publish authorization-service authorization-service
  publish authorization-service interop-testing-authorization-service
  publish issuer-service issuer-service
  publish issuer-service interop-testing-issuer-service
  publish eductx-platform-backend backend
  publish eductx-platform-backend interop-testing-backend
  publish dashboard dashboard
  publish testing-frontend testing-frontend
)
echo "pins=$(jq -Rsc 'split("\n") | map(select(length > 0))' <<< "$pins")" >> "$GITHUB_OUTPUT"
