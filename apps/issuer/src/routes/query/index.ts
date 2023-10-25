import { randomUUID } from 'node:crypto';
import { FastifyPluginAsync, FastifyRequest } from 'fastify';

import { CredentialsTable, NoncesTable } from '../../db/types/index.js';
import { JWTProof } from '../../types/index.js';
import { verifyProofOfPossession } from '../../utils/proofOfPosession.js';

const query: FastifyPluginAsync = async (fastify): Promise<void> => {
  const { pool } = fastify.pg;

  fastify.get(
    '/test/all',
    {
      config: {
        description: 'Get all from the database',
      },
    },
    async () => {
      const credentials = await pool.query<CredentialsTable>(
        'SELECT * FROM credentials'
      );

      const nonces = await pool.query<NoncesTable>('SELECT * FROM nonces');

      return { credentials: credentials.rows, nonces: nonces.rows };
    }
  );

  fastify.post(
    '/nonce',
    {
      schema: { body: { did: { type: 'string' } } },
      config: {
        description: 'Get nonce and audience for the DID',
      },
    },
    async (
      request: FastifyRequest<{
        Body: { did: string };
      }>
    ) => {
      const { did } = request.body;

      const nonce = randomUUID();
      await pool.query<NoncesTable>(
        "INSERT INTO nonces (did, nonce) VALUES ($1, $2) ON CONFLICT (did) DO UPDATE SET nonce = EXCLUDED.nonce, created_at = NOW(), expires_at = NOW() + INTERVAL '1 hour'",
        [did, nonce]
      );

      return {
        nonce,
        aud: process.env.PROOF_AUDIENCE,
      };
    }
  );

  fastify.post(
    '/test/:did',
    {
      schema: { body: { did: { type: 'string' } } },
      config: {
        description: 'Get all credentials for the DID',
      },
    },
    async (
      request: FastifyRequest<{
        Body: { did: string };
      }>
    ) => {
      const { did } = request.body;
      const didRows = await pool.query<CredentialsTable>(
        'SELECT * FROM credentials WHERE did = $1',
        [did]
      );

      return didRows.rows;
    }
  );

  fastify.post(
    '/claim',
    {
      schema: {
        body: {
          type: 'object',
          properties: {
            proof: { type: 'string' },
          },
          required: ['proof'],
        },
      },
      config: {
        description:
          'Send a proof of possession to the issuer and get all credentials for the DID',
      },
    },
    async (
      request: FastifyRequest<{
        Body: { proof: string };
      }>
    ) => {
      const { proof } = request.body;

      const proofArgs = {
        proof: {
          jwt: proof,
        } as JWTProof,
      };

      const did = await verifyProofOfPossession(
        proofArgs,
        pool,
        fastify.veramoAgent()
      );

      const didRows = await pool.query<CredentialsTable>(
        'SELECT * FROM credentials WHERE did = $1',
        [did]
      );

      return didRows.rows;
    }
  );

  fastify.post(
    '/test/insert',
    {
      config: {
        description:
          'Send a credential to the issuer to be stored in the database',
      },
    },
    async (request) => {
      const data = request.body as Omit<CredentialsTable, 'id' | 'created_at'>;

      const { rows } = await pool.query<CredentialsTable>(
        'INSERT INTO credentials (id, did, credential) VALUES ($1, $2, $3) RETURNING *',
        [randomUUID(), data.did, data.credential]
      );
      return rows;
    }
  );

  fastify.delete(
    '/test',
    {
      config: {
        description: 'Delete all credentials from the database',
      },
    },
    async (request, reply) => {
      await pool.query<CredentialsTable>('TRUNCATE credentials');
      await pool.query<NoncesTable>('TRUNCATE nonces');
      await reply.code(204).send();
    }
  );
};

export default query;
