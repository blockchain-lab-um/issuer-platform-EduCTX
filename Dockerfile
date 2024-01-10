FROM node:20.10.0-alpine AS base

# Install dependencies only when needed
FROM base AS deps

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy root package.json + pnpm-lock.yaml + pnpm-workspace.yaml + .npmrc
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml .npmrc ./

##########
#  APPS  #
##########
COPY ./apps/dashboard/package.json ./apps/dashboard/
COPY ./apps/issuer/package.json ./apps/issuer/

# Remove prepare script
RUN npm pkg delete scripts.prepare

RUN npm i -g pnpm@8.7.6 && pnpm i --frozen-lockfile

COPY . .

ENV NODE_ENV=production

RUN pnpm build
