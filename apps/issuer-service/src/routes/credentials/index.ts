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
      const issuedCredentialInfo = Object.values(
        fastify.issuedCredentialCache.all(),
      );

      // Decode JWTs
      const credentials = issuedCredentialInfo.map((info) => {
        const payload = info.credential
          ? decodeJWT(info.credential.split('~')[0]).payload
          : null;

        const isSdJwt =
          info.format === 'sd-jwt' || info.credential?.includes('~');
        const credentialId =
          payload?.vc?.id ?? (isSdJwt ? payload?.id : undefined);

        // SD-JWT stores the claims at the top level. The list uses a VC envelope.
        const credential =
          payload && isSdJwt && !payload.vc
            ? {
                ...payload,
                vc: {
                  id: payload.id,
                  type: info.types,
                  credentialSubject: payload.credentialSubject,
                },
              }
            : payload;

        return {
          ...info,
          credential,
          isRevoked: credentialId
            ? fastify.revocationCache.get(credentialId) !== undefined
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
