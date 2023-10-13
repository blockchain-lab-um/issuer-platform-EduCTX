import fastifyPostgres from '@fastify/postgres';
import { FastifyPluginAsync } from 'fastify';

const issueDeferred: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  await fastify.register(fastifyPostgres, {
    connectionString: fastify.config.DATABASE_URL,
  });

  // const { pool } = fastify.pg;

  fastify.get('/', async (request, reply) => 'Issue Deferred');
};

export default issueDeferred;
