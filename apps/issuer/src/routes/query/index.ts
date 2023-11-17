import { randomUUID } from 'node:crypto';
import { FastifyPluginAsync, FastifyRequest } from 'fastify';

import { CredentialsTable, NoncesTable } from '../../db/types/index.js';
import { FastifyReply } from 'fastify/types/reply.js';
import verifyProofPlugin from '../../plugins/proofOfPossession.js';

const query: FastifyPluginAsync = async (fastify): Promise<void> => {
  const { pool } = fastify.pg;

  await fastify.register(verifyProofPlugin, {});

  fastify.get(
    '/nonce/:did',
    {
      schema: { params: { did: { type: 'string' } } },
      config: {
        description: 'Get nonce and audience for the DID',
      },
    },
    async (
      request: FastifyRequest<{
        Params: { did: string };
      }>,
      reply: FastifyReply
    ) => {
      const { did } = request.params;

      const nonce = randomUUID();
      await pool.query<NoncesTable>(
        "INSERT INTO nonces (did, nonce) VALUES ($1, $2) ON CONFLICT (did) DO UPDATE SET nonce = EXCLUDED.nonce, created_at = NOW(), expires_at = NOW() + INTERVAL '1 hour'",
        [did, nonce]
      );

      return reply.send({ nonce, aud: process.env.PROOF_AUDIENCE });
    }
  );

  fastify.get(
    '/claim',
    {
      /* schema: {
        body: {
          type: 'object',
          properties: {
            proof: { type: 'string' },
          },
          required: ['proof'],
        },
      }, */
      preHandler: [fastify.verifyProof()],
      config: {
        description:
          'Send a proof of possession to the issuer and get all credentials for the DID',
      },
    },
    async (
      request: FastifyRequest,
      reply: FastifyReply
    ) => {
      const { did } = request;

      const didRows = await pool.query<CredentialsTable>(
        'SELECT * FROM credentials WHERE did = $1',
        [did]
      );

      return reply.send(didRows.rows);
    }
  );

  fastify.delete(
    '/:id',
    {
      preHandler: [fastify.verifyProof()],
      schema: { params: { id: { type: 'string' } } },
      config: {
        description: 'Delete a credential from the database',
      },
    },
    async (
      request: FastifyRequest,
      reply: FastifyReply
    ) => {
      try {
        const { id } = (request.params as FastifyRequest<{ Params: { id: string } }>);
        await pool.query<CredentialsTable>(
          'DELETE FROM credentials WHERE id = $1',
          [id]
        );
        return await reply.code(204).send();
      } catch (error) {
        return reply.code(500).send({ error: (error as Error).message });
      }
    }
  );

  fastify.post(
    '/delete',
    {
      preHandler: [fastify.verifyProof()],
      schema: {
        body: { type: 'array', items: { type: 'string' } },
      },
      config: {
        description: 'Delete all passed credentials from the database',
      },
    },
    async (
      request: FastifyRequest,
      reply: FastifyReply
    ) => {
      try {
        const { body } = (request as FastifyRequest<{
          Body: string[];
        }>);
        const res = await pool.query<CredentialsTable>(
          'DELETE FROM credentials WHERE id = ANY($1)',
          [body]
        );
        if (!res) {
          return await reply.code(404).send();
        }
        return await reply.code(204).send({ deleted: res.rowCount });
      } catch (error) {
        return reply.code(500).send({ error: (error as Error).message });
      }
    }
  );
};

export default query;
