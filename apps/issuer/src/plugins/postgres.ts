import fastifyPostgres, { PostgresPluginOptions } from '@fastify/postgres';
import fp from 'fastify-plugin';

export default fp<PostgresPluginOptions>(async (fastify) => {
  await fastify.register(fastifyPostgres, {
    connectionString: process.env.DATABASE_URL,
  });
});