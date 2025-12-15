import type { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';

const x402Test: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify,
): Promise<void> => {
  fastify.get(
    '/',
    {
      schema: {
        params: {
          type: 'object',
          properties: {},
        },
      },
      config: {
        description: 'Test x402 protocol',
      },
    },
    async (_, reply) => {
      return reply.code(200).send({
        message: 'Hello, world from x402 test!',
      });
    },
  );
};

export default x402Test;
