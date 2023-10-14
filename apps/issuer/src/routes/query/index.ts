import { randomUUID } from 'node:crypto';
import { FastifyPluginAsync, FastifyRequest } from 'fastify';

import { CredentialsTable, NoncesTable } from '../../db/types/index.js';
import { JWTProof } from '../../types/index.js';
import { verifyProofOfPossession } from '../../utils/proofOfPosession.js';

const query: FastifyPluginAsync = async (fastify): Promise<void> => {
  const { pool } = fastify.pg;

  fastify.get('/', async () => {
    const credentials = await pool.query<CredentialsTable>(
      'SELECT * FROM credentials'
    );

    const nonces = await pool.query<NoncesTable>('SELECT * FROM nonces');

    return { credentials: credentials.rows, nonces: nonces.rows };
  });

  fastify.get(
    '/:did',
    { schema: { params: { did: { type: 'string' } } } },
    async (
      request: FastifyRequest<{
        Params: { did: string };
      }>
    ) => {
      const { did } = request.params;

      const nonce = randomUUID();
      await pool.query<NoncesTable>(
        'INSERT INTO nonces (did, nonce) VALUES ($1, $2) ON CONFLICT (did) DO UPDATE SET nonce = EXCLUDED.nonce',
        [did, nonce]
      );
      return nonce;
    }
  );

  fastify.get(
    '/test/:did',
    { schema: { params: { did: { type: 'string' } } } },
    async (
      request: FastifyRequest<{
        Params: { did: string };
      }>
    ) => {
      const { did } = request.params;
      const didRows = await pool.query<CredentialsTable>(
        'SELECT * FROM credentials WHERE did = $1',
        [did]
      );

      return didRows.rows;
    }
  );

  fastify.post(
    '/test_proof',
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

  fastify.post('/test_insert', async (request) => {
    const data = request.body as Omit<CredentialsTable, 'id' | 'created_at'>;

    const { rows } = await pool.query<CredentialsTable>(
      'INSERT INTO credentials (id, did, credential) VALUES ($1, $2, $3) RETURNING *',
      [randomUUID(), data.did, data.credential]
    );
    return rows;
  });
};

export default query;
