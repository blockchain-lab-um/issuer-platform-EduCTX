#!/bin/sh

find /app/apps/testing-frontend/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#NEXT_PUBLIC_BACKEND_API_URL_PLACEHOLDER#$NEXT_PUBLIC_BACKEND_API_URL#g"
find /app/apps/testing-frontend/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#/NEXT_PUBLIC_BASE_PATH_PLACEHOLDER#$NEXT_PUBLIC_BASE_PATH#g"

exec "$@"
