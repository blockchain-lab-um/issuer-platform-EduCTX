#!/bin/bash
set -euo pipefail

base_image=eductx-runtime-test-base:node24
docker build --pull -t "$base_image" .
for app in authorization-service issuer-service eductx-platform-backend dashboard testing-frontend; do
  image="eductx-runtime-test-${app}:node24"
  docker build --build-arg "BASE_IMAGE=$base_image" -t "$image" "apps/$app"
  docker run --rm -i --entrypoint node "$image" - "$app" < scripts/test-image-runtime.cjs
done
