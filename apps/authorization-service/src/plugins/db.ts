import { Level } from 'level';
import type { LevelDbKeyAuth, LevelDbObjectAuth } from '@cef-ebsi/auth-server';
import fp from 'fastify-plugin';
import path from 'node:path';

declare module 'fastify' {
  export interface FastifyInstance {
    dbOidc: Level<LevelDbKeyAuth, LevelDbObjectAuth>;
  }
}

export default fp(async (fastify, _) => {
  const dbOidc = new Level<LevelDbKeyAuth, LevelDbObjectAuth>(
    path.join(process.cwd(), 'db/oidc'),
    {
      keyEncoding: 'json',
      valueEncoding: 'json',
    },
  );

  fastify.decorate('dbOidc', dbOidc);
});
