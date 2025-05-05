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
      // TODO: Remove this after first run
      // Migrate old entries to new cache
      const oldEntries = Object.entries(fastify.issuedCredentialCache.all());
      for (const [key, value] of oldEntries) {
        const credential = value.credential
          ? decodeJWT(value.credential).payload
          : null;

        if (credential && !key.startsWith('urn:uuid:')) {
          fastify.issuedCredentialCache.set(credential.vc.id, value);
          fastify.issuedCredentialCache.delete(key);
        }
      }

      const issuedCredentialInfo = Object.values(
        fastify.issuedCredentialCache.all(),
      );

      // Decode JWTs
      const credentials = issuedCredentialInfo.map((info) => {
        const credential = info.credential
          ? decodeJWT(info.credential).payload
          : null;

        return {
          ...info,
          credential,
          isRevoked: credential
            ? fastify.revocationCache.get(credential.vc.id) !== undefined
            : false,
        };
      });

      // Sort by issuance date ascending
      credentials.sort((a, b) => {
        return new Date(a.issuedAt).getTime() - new Date(b.issuedAt).getTime();
      });

      return reply.code(200).send(credentials);
    },
  );
};

export default credentials;
