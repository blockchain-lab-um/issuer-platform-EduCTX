import { fastifyFormbody } from '@fastify/formbody';

import type { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import QRCode from 'qrcode';
import type { UserSessionsTable } from '../../db/types/index.js';

const image: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify,
): Promise<void> => {
  await fastify.register(fastifyFormbody, { bodyLimit: 1048576 * 10 });

  const pool = fastify.pg.pool;

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
        const { rows } = await pool.query<
          Pick<UserSessionsTable, 'credential_offer_request'>
        >('SELECT credential_offer_request FROM user_sessions WHERE id = $1', [
          request.params.id,
        ]);

        if (rows.length === 0) {
          return reply.code(404).send('Not found');
        }

        credentialOfferRequest = rows[0].credential_offer_request;
      } catch (e) {
        return reply.code(500);
      }

      const qrCodeBuffer = await QRCode.toBuffer(credentialOfferRequest);

      return reply.header('Content-Type', 'image/png').send(qrCodeBuffer);
    },
  );
};

export default image;
