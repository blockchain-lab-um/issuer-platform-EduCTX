import fastifyEnv, { FastifyEnvOptions } from '@fastify/env';
import fp from 'fastify-plugin';

/**
 * This plugins adds some utilities to handle loading ENV variables
 *
 * @see https://github.com/fastify/fastify-env
 */
export default fp<FastifyEnvOptions>(async (fastify) => {
  await fastify.register(fastifyEnv, {
    dotenv: true,
    confKey: 'config',
    schema: {
      type: 'object',
      required: ['DATABASE_URL'],
      properties: {
        DATABASE_URL: {
          type: 'string',
        },
      },
    },
  });
});

declare module 'fastify' {
  interface FastifyInstance {
    config: {
      DATABASE_URL: string;
    };
  }
}
