import envSchema, { JSONSchemaType } from 'env-schema';
import fp from 'fastify-plugin';

export interface Env {
  DATABASE_URL: string;
}

declare module 'fastify' {
  export interface FastifyInstance {
    config: Env;
  }
}

/**
 * This plugins adds some utilities to handle loading ENV variables
 *
 * @see https://github.com/fastify/fastify-env
 */
export default fp(async (fastify, _) => {
  const schema: JSONSchemaType<Env> = {
    type: 'object',
    required: ['DATABASE_URL'],
    properties: {
      DATABASE_URL: {
        type: 'string',
      },
    },
  };

  const config = envSchema({
    schema,
    dotenv: true,
  });

  fastify.decorate('config', config);
});
