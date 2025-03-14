FROM blockchain-lab-um/eductx-platform-base:latest as builder

# Production image, copy all the files and run next
FROM node:20.18.0-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/apps/testing-frontend/.next/standalone ./

# Set the correct permission for prerender cache
RUN chown nextjs:nodejs ./apps/testing-frontend/.next

COPY --from=builder --chown=nextjs:nodejs /app/apps/testing-frontend/.next/static ./apps/testing-frontend/.next/static
COPY --from=builder /app/apps/testing-frontend/public ./apps/testing-frontend/public
COPY --from=builder /app/apps/testing-frontend/next.config.js ./apps/testing-frontend/next.config.js

# Copy entrypoint script which replaces placeholder `NEXT_PUBLIC_` variables
COPY --from=builder --chown=nextjs:nodejs /app/apps/testing-frontend/scripts/entrypoint.sh .

USER nextjs

EXPOSE 3000

ENV PORT 3000

ENV HOSTNAME "0.0.0.0"

ENTRYPOINT [ "./entrypoint.sh" ]

CMD ["node", "./apps/testing-frontend/server.js"]
