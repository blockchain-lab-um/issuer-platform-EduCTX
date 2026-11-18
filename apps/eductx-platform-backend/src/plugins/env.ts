import envSchema, { type JSONSchemaType } from 'env-schema';
import fp from 'fastify-plugin';

export interface Env {
  VERSION: string;
  VERIFIER_SERVER_URL: string;
  VERIFIER_API_KEY: string;
  API_KEY: string;
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
    required: ['VERSION', 'VERIFIER_SERVER_URL', 'VERIFIER_API_KEY', 'API_KEY'],
    properties: {
      VERSION: {
        type: 'string',
      },
      VERIFIER_SERVER_URL: {
        type: 'string',
      },
      VERIFIER_API_KEY: {
        type: 'string',
      },
      API_KEY: {
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
