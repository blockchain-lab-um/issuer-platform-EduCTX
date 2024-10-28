import { createCache, type CacheManagerStore } from 'cache-manager';
import fp from 'fastify-plugin';
import { Keyv } from 'keyv';
import { KeyvCacheableMemory } from 'cacheable';

declare module 'fastify' {
  export interface FastifyInstance {
    cache: CacheManagerStore;
  }
}

export default fp(async (fastify, _) => {
  const store = new KeyvCacheableMemory({ ttl: '1h', lruSize: 5000 });
  const keyv = new Keyv({ store });
  const cache = createCache({ stores: [keyv] });

  fastify.decorate('cache', cache);
});
