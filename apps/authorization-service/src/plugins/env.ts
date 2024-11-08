import envSchema, { type JSONSchemaType } from 'env-schema';
import fp from 'fastify-plugin';

export interface Env {
  VERSION: string;
  NETWORK: 'conformance' | 'pilot';

  KEY_ALG: 'ES256' | 'ES256K';
  PRIVATE_KEY: string;
  DID_METHOD: 'key' | 'ebsi';
  EBSI_SUBJECT_ID: string;

  SERVER_URL: string;

  // Issuer server
  ISSUER_SERVER_URL: string;
  ISSUER_SERVER_PUBLIC_KEY: string;
  ISSUER_SERVER_KEY_ALG: 'ES256' | 'ES256K';
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
    required: [
      'VERSION',
      'NETWORK',
      'KEY_ALG',
      'PRIVATE_KEY',
      'DID_METHOD',
      'SERVER_URL',
      'ISSUER_SERVER_URL',
      'ISSUER_SERVER_PUBLIC_KEY',
      'ISSUER_SERVER_KEY_ALG',
    ],
    properties: {
      VERSION: {
        type: 'string',
      },
      NETWORK: {
        type: 'string',
        enum: ['conformance', 'pilot'],
      },
      KEY_ALG: {
        type: 'string',
        enum: ['ES256', 'ES256K'],
      },
      PRIVATE_KEY: {
        type: 'string',
      },
      DID_METHOD: {
        type: 'string',
        enum: ['key', 'ebsi'],
      },
      EBSI_SUBJECT_ID: {
        type: 'string',
      },
      SERVER_URL: {
        type: 'string',
      },
      ISSUER_SERVER_URL: {
        type: 'string',
      },
      ISSUER_SERVER_PUBLIC_KEY: {
        type: 'string',
      },
      ISSUER_SERVER_KEY_ALG: {
        type: 'string',
        enum: ['ES256', 'ES256K'],
      },
    },
  };

  const config = envSchema({
    schema,
    dotenv: true,
  });

  fastify.decorate('config', config);
});
