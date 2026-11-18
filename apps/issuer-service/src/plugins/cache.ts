import { createCache } from 'cache-manager';
import fp from 'fastify-plugin';
import { Keyv } from 'keyv';
import { KeyvCacheableMemory } from 'cacheable';
import { FlatCache } from 'flat-cache';
import path from 'node:path';

declare module 'fastify' {
  export interface FastifyInstance {
    cache: any;
    revocationCache: FlatCache;
    issuedCredentialCache: FlatCache;
    idRelationCache: FlatCache;
  }
}

export default fp(async (fastify, _) => {
  const store = new KeyvCacheableMemory({ ttl: undefined, lruSize: 5000 });
  const keyv = new Keyv({ store });
  const flatCache = new FlatCache({
    cacheDir: path.join(process.cwd(), 'db/persistent-cache'),
    ttl: undefined,
    lruSize: 0,
    persistInterval: 1000 * 10, // 5 minutes
  });

  flatCache.load();

  const flatCacheKeyv = new Keyv({
    store: flatCache,
  });

  const cache = createCache({ stores: [keyv, flatCacheKeyv] });

  fastify.decorate('cache', cache);

  const revocationCache = new FlatCache({
    cacheDir: path.join(process.cwd(), 'db/revocation-cache'),
    ttl: undefined, // Unlimited
    lruSize: 0, // Unlimited
    persistInterval: 1000 * 10, // 5 minutes
  });

  revocationCache.load();

  fastify.decorate('revocationCache', revocationCache);

  //  email (optional), types (array string), credential (jwt - if claimed, else null), issuedAt, claimedAt
  const issuedCredentialCache = new FlatCache({
    cacheDir: path.join(process.cwd(), 'db/issued-credential-cache'),
    ttl: undefined, // Unlimited
    lruSize: 0, // Unlimited
    persistInterval: 1000 * 10, // 5 minutes
  });

  issuedCredentialCache.load();

  fastify.decorate('issuedCredentialCache', issuedCredentialCache);

  const idRelationCache = new FlatCache({
    cacheDir: path.join(process.cwd(), 'db/id-relation-cache'),
    ttl: undefined, // Unlimited
    lruSize: 0, // Unlimited
    persistInterval: 1000 * 10, // 5 minutes
  });

  idRelationCache.load();

  fastify.decorate('idRelationCache', idRelationCache);
});
