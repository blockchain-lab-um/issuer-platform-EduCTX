import { Level } from 'level';
import type {
  LevelDbKeyIssuer,
  LevelDbObjectIssuer,
} from '@cef-ebsi/credential-issuer';
import fp from 'fastify-plugin';

declare module 'fastify' {
  export interface FastifyInstance {
    dbOidc: Level<LevelDbKeyIssuer, LevelDbObjectIssuer>;
  }
}

export default fp(async (fastify, _) => {
  const dbOidc = new Level<LevelDbKeyIssuer, LevelDbObjectIssuer>('db/oidc', {
    keyEncoding: 'json',
    valueEncoding: 'json',
  });

  fastify.decorate('dbOidc', dbOidc);
});
