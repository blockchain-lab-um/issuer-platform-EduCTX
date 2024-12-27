import fp from 'fastify-plugin';
import { FlatCache } from 'flat-cache';
import path from 'node:path';

declare module 'fastify' {
  export interface FastifyInstance {
    cache: FlatCache;
  }
}

export default fp(async (fastify, _) => {
  const flatCache = new FlatCache({
    cacheDir: path.join(process.cwd(), 'db/persistent-cache'),
    ttl: 8035200000, // 93 d
    lruSize: 10000, // 10000 items
    persistInterval: 1000 * 10, // 5 minutes
  });

  flatCache.load();

  fastify.decorate('cache', flatCache);
});
