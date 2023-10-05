FROM blockchain-lab-um/eductx-platform-base:latest as builder

# Production image, copy all the files and run next
FROM node:18.17.1-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/apps/dashboard/.next/standalone ./

# Set the correct permission for prerender cache
RUN chown nextjs:nodejs ./apps/dashboard/.next

COPY --from=builder --chown=nextjs:nodejs /app/apps/dashboard/.next/static ./apps/dashboard/.next/static
COPY --from=builder /app/apps/dashboard/public ./apps/dashboard/public

USER nextjs

EXPOSE 3000

ENV PORT 3000

# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

CMD ["node", "./apps/dashboard/server.js"]
