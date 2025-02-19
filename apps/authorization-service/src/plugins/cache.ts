import { createCache } from 'cache-manager';
import fp from 'fastify-plugin';
import { Keyv } from 'keyv';
import { KeyvCacheableMemory } from 'cacheable';
import { FlatCache } from 'flat-cache';
import path from 'node:path';

declare module 'fastify' {
  export interface FastifyInstance {
    cache: any;
    presentationDefinitionCache: FlatCache;
  }
}

export default fp(async (fastify, _) => {
  const store = new KeyvCacheableMemory({ ttl: '93d', lruSize: 5000 });
  const keyv = new Keyv({ store });
  const flatCache = new FlatCache({
    cacheDir: path.join(process.cwd(), 'db/persistent-cache'),
    ttl: 8035200000, // 93 d
    lruSize: 10000, // 10000 items
    persistInterval: 1000 * 5, // 5 minutes
  });

  flatCache.load();

  const flatCacheKeyv = new Keyv({
    store: flatCache,
  });
  const cache = createCache({ stores: [keyv, flatCacheKeyv] });

  fastify.decorate('cache', cache);

  // Create a persistent store for presentation definitions
  const presentationDefinitionCache = new FlatCache({
    cacheDir: path.join(process.cwd(), 'db/presentation-definition-cache'),
    ttl: undefined, // Unlimited
    lruSize: 0, // Unlimited
    persistInterval: 1000 * 10, // 5 minutes
  });

  presentationDefinitionCache.load();
  fastify.decorate('presentationDefinitionCache', presentationDefinitionCache);
});
