import envSchema, { type JSONSchemaType } from 'env-schema';
import fp from 'fastify-plugin';

export interface Env {
  DATABASE_URL: string;
  ISSUER_URL: string;
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
    required: ['DATABASE_URL', 'ISSUER_URL'],
    properties: {
      DATABASE_URL: {
        type: 'string',
      },
      ISSUER_URL: {
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
