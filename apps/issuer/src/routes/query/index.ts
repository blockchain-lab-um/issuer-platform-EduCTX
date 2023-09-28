import { randomUUID } from 'node:crypto';
import { FastifyPluginAsync } from 'fastify';

import { CredentialsTable } from '../../db/types/index.js';

const query: FastifyPluginAsync = async (fastify): Promise<void> => {
  const { pool } = fastify.pg;

  fastify.get('/', async () => {
    const { rows } = await pool.query<CredentialsTable>(
      'SELECT * FROM credentials'
    );

    return rows;
  });

  fastify.post('/', async (request) => {
    const data = request.body as Omit<CredentialsTable, 'id' | 'created_at'>;

    const { rows } = await pool.query<CredentialsTable>(
      'INSERT INTO credentials (id, did, credential) VALUES ($1, $2, $3) RETURNING *',
      [randomUUID(), data.did, data.credential]
    );
    return rows;
  });
};

export default query;
