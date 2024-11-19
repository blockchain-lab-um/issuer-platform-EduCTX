#!/bin/sh

find /app/apps/dashboard/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#NEXT_PUBLIC_ISSUER_ENDPOINT_PLACEHOLDER#$NEXT_PUBLIC_ISSUER_ENDPOINT#g"
find /app/apps/dashboard/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#NEXT_PUBLIC_APP_URL_PLACEHOLDER#$NEXT_PUBLIC_APP_URL#g"

exec "$@"
