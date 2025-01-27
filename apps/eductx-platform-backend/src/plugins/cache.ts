import fp from 'fastify-plugin';
import { FlatCache } from 'flat-cache';
import path from 'node:path';

declare module 'fastify' {
  export interface FastifyInstance {
    claimCache: FlatCache;
    couponCache: FlatCache;
    authRequestCache: FlatCache;
  }
}

export default fp(async (fastify, _) => {
  const claimCache = new FlatCache({
    cacheDir: path.join(process.cwd(), 'db/claim-cache'),
    ttl: undefined, // Unlimited
    lruSize: 0, // Unlimited
    persistInterval: 1000 * 10, // 5 minutes
  });

  claimCache.load();

  const couponCache = new FlatCache({
    cacheDir: path.join(process.cwd(), 'db/coupon-cache'),
    ttl: undefined, // Unlimited
    lruSize: 0, // Unlimited
    persistInterval: 1000 * 10, // 5 minutes
  });

  couponCache.load();

  const authRequestCache = new FlatCache({
    cacheDir: path.join(process.cwd(), 'db/auth-request-cache'),
    ttl: undefined, // Unlimited
    lruSize: 0, // Unlimited
    persistInterval: 1000 * 10, // 5 minutes
  });

  authRequestCache.load();

  fastify.decorate('couponCache', couponCache);
  fastify.decorate('claimCache', claimCache);
  fastify.decorate('authRequestCache', authRequestCache);
});
