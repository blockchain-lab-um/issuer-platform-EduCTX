ARG BASE_IMAGE=blockchain-lab-um/eductx-platform-base:latest
FROM ${BASE_IMAGE} AS builder

# Production image, copy all the files and run next
FROM node:24.22.1-alpine@sha256:06d7adf3e0ef61a13f1d28682726366f97a15aa1888c934d3ecec86c33918b53 AS runner
WORKDIR /app

RUN apk add --no-cache libc6-compat

RUN npm i -g pnpm@9.12.2

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 fastify

COPY --from=builder --chown=fastify:nodejs /app/apps/issuer-service/dist/ ./apps/issuer-service/dist
COPY --from=builder --chown=fastify:nodejs /app/apps/issuer-service/package.json ./apps/issuer-service
COPY --from=builder --chown=fastify:nodejs /app/libs/shared/dist/ ./libs/shared/dist
COPY --from=builder --chown=fastify:nodejs /app/libs/shared/package.json ./libs/shared

# Copy root package.json + pnpm-lock.yaml + pnpm-workspace.yaml + patches
COPY --from=builder --chown=fastify:nodejs /app/pnpm-lock.yaml /app/package.json /app/pnpm-workspace.yaml ./
COPY --from=builder --chown=fastify:nodejs /app/patches ./patches

# Remove prepare script
RUN npm pkg delete scripts.prepare

RUN pnpm i --frozen-lockfile --prod && pnpm store prune

RUN mkdir -p ./db
RUN chown -R fastify:nodejs ./db

USER fastify

ENV HOST=0.0.0.0
ENV PORT=3001

CMD ["node", "apps/issuer-service/dist/server.js"]
