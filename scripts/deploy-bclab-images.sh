#!/bin/bash
set -euo pipefail
export LC_ALL=C
: "${CLUSTER_REPO_DEPLOY_KEY:?Set the CLUSTER_REPO_DEPLOY_KEY repository secret}"
jq -e '
  type == "array" and length == 8 and
  (map(split("@")[0]) | unique | length == 8) and
  all(.[]; test("^ghcr\\.io/blockchain-lab-um/eductx-platform-(authorization-service|backend|dashboard|issuer-service|testing-frontend|interop-testing-(authorization-service|backend|issuer-service))@sha256:[0-9a-f]{64}$"))
' <<< "$IMAGE_PINS" > /dev/null
mapfile -t pins < <(jq -r '.[]' <<< "$IMAGE_PINS")

workdir=$(mktemp -d)
trap 'rm -rf "$workdir"' EXIT
umask 077
printf '%s\n' "$CLUSTER_REPO_DEPLOY_KEY" > "$workdir/key"
unset CLUSTER_REPO_DEPLOY_KEY
# GitHub's published Ed25519 host key.
echo 'github.com ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOMqqnkVzrm0SdG6UOoqKLsabgH5C9okWi0dh2l9GKJl' > "$workdir/known_hosts"
printf -v GIT_SSH_COMMAND 'ssh -o BatchMode=yes -o IdentitiesOnly=yes -o IdentityAgent=none -o StrictHostKeyChecking=yes -o GlobalKnownHostsFile=/dev/null -o UserKnownHostsFile=%q -i %q' \
  "$workdir/known_hosts" "$workdir/key"
export GIT_SSH_COMMAND

git clone --single-branch --branch main git@github.com:blockchain-lab-um/bclabum-deployments.git "$workdir/deployments"
cd "$workdir/deployments"
manifest=apps/base/issuer-platform-eductx/kustomization.yaml
git config user.name 'github-actions[bot]'
git config user.email '41898282+github-actions[bot]@users.noreply.github.com'
updates=()
for pin in "${pins[@]}"; do
  updates+=("${pin%@*}=$pin")
done

for attempt in 1 2 3; do
  (cd "${manifest%/*}" && "$RUNNER_TEMP/kustomize" edit set image "${updates[@]}")
  if git diff --quiet -- "$manifest"; then
    echo "Image digests are already pinned."
    exit 0
  fi
  git add -- "$manifest"
  git commit -m "issuer-platform-eductx: deploy ${GITHUB_SHA:0:8}"

  source_head=$(gh api "repos/$GITHUB_REPOSITORY/git/ref/heads/main" --jq .object.sha)
  if [[ "$source_head" != "$GITHUB_SHA" ]]; then
    echo "A newer app commit is on main. Skipping this deploy."
    exit 0
  fi
  if result=$(git push --porcelain origin HEAD:refs/heads/main 2>&1); then
    printf '%s\n' "$result"
    exit 0
  fi
  printf '%s\n' "$result" >&2
  if [[ "$attempt" == 3 ]] || ! grep -Eq '\[rejected\].*\((fetch first|non-fast-forward)\)' <<< "$result"; then
    exit 1
  fi
  git fetch origin main
  git reset --hard FETCH_HEAD
done
