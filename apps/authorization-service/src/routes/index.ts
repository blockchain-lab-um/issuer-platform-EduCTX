import type { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';

const route: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify,
): Promise<void> => {
  fastify.get(
    '/',
    {
      config: {
        description: 'Get the version of the API',
        response: {
          200: {
            type: 'object',
            properties: {
              version: {
                type: 'string',
              },
            },
          },
        },
      },
    },
    async (_, reply) => {
      return reply.code(200).send({
        version: fastify.config.VERSION,
      });
    },
  );
};

export default route;
