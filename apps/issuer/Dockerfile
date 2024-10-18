FROM blockchain-lab-um/eductx-platform-base:latest as builder

# Production image, copy all the files and run next
FROM node:20.18.0-alpine AS runner
WORKDIR /app

RUN npm i -g pnpm@9.12.2

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 fastify

COPY --from=builder --chown=fastify:nodejs /app/apps/issuer/dist/ ./apps/issuer/dist
COPY --from=builder --chown=fastify:nodejs /app/apps/issuer/package.json ./apps/issuer

# Copy root package.json + pnpm-lock.yaml + pnpm-workspace.yaml + patches
COPY --from=builder --chown=fastify:nodejs /app/pnpm-lock.yaml /app/package.json /app/pnpm-workspace.yaml /app/patches ./

# Remove prepare script
RUN npm pkg delete scripts.prepare

RUN pnpm i --frozen-lockfile --prod && pnpm store prune

USER fastify

ENV HOST 0.0.0.0
ENV PORT 3001

CMD ["node", "apps/issuer/dist/server.js"]
