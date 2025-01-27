FROM blockchain-lab-um/eductx-platform-base:latest as builder

# Production image, copy all the files and run next
FROM node:20.18.0-alpine AS runner
WORKDIR /app

RUN npm i -g pnpm@9.12.2

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 fastify

COPY --from=builder --chown=fastify:nodejs /app/apps/eductx-platform-backend/dist/ ./apps/eductx-platform-backend/dist
COPY --from=builder --chown=fastify:nodejs /app/apps/eductx-platform-backend/package.json ./apps/eductx-platform-backend

# Copy root package.json + pnpm-lock.yaml + pnpm-workspace.yaml + patches
COPY --from=builder --chown=fastify:nodejs /app/pnpm-lock.yaml /app/package.json /app/pnpm-workspace.yaml ./
COPY --from=builder --chown=fastify:nodejs /app/patches ./patches

# Remove prepare script
RUN npm pkg delete scripts.prepare

RUN pnpm i --frozen-lockfile --prod && pnpm store prune

RUN mkdir -p ./db
RUN chown -R fastify:nodejs ./db

USER fastify

ENV HOST 0.0.0.0
ENV PORT 3001

CMD ["node", "apps/eductx-platform-backend/dist/server.js"]
