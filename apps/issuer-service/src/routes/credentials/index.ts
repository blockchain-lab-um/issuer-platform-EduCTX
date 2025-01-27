import { fastifyFormbody } from '@fastify/formbody';

import type { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { apiKeyAuth } from '../../middlewares/apiKeyAuth.js';
import { decodeJWT } from 'did-jwt';

const credentials: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify,
): Promise<void> => {
  await fastify.register(fastifyFormbody, { bodyLimit: 1048576 * 10 });

  fastify.get(
    '/',
    {
      config: {
        description: 'Returns list of issued credentials',
      },
      preValidation: apiKeyAuth,
    },
    async (_, reply) => {
      const credentialJWTs = Object.values(fastify.credentialCache.all());

      // Decode JWTs
      const credentials = credentialJWTs.map((credentialJWT) => {
        return decodeJWT(credentialJWT).payload;
      });

      return reply.code(200).send(credentials);
    },
  );
};

export default credentials;
