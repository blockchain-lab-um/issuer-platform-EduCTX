import { fastifyFormbody } from '@fastify/formbody';

import type { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import QRCode from 'qrcode';

const image: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify,
): Promise<void> => {
  await fastify.register(fastifyFormbody, { bodyLimit: 1048576 * 10 });

  fastify.get(
    '/:id',
    {
      schema: {
        params: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
            },
          },
          required: ['id'],
        },
      },
      config: {
        description: 'Return QR code for credential request',
      },
    },
    async (request, reply) => {
      let credentialOfferRequest: string;
      try {
        credentialOfferRequest = await fastify.cache.get(request.params.id);

        if (!credentialOfferRequest) {
          return reply.code(404);
        }
      } catch (e) {
        return reply.code(500);
      }

      const qrCodeBuffer = await QRCode.toBuffer(credentialOfferRequest);

      return reply.header('Content-Type', 'image/png').send(qrCodeBuffer);
    },
  );
};

export default image;
