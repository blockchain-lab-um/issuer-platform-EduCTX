import type { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { randomUUID } from 'node:crypto';

// TODO: Protect with api key
const route: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify,
): Promise<void> => {
  fastify.get(
    '/',
    {
      config: {
        description: '',
        response: {},
      },
    },
    async (_, reply) => {
      let coupons = fastify.couponCache.all();

      coupons = Object.entries(coupons).map(([key, value]) => ({
        id: key,
        name: value.name,
        description: value.description,
      }));

      return reply.code(200).send({
        coupons,
      });
    },
  );

  fastify.post(
    '/create',
    {
      schema: {
        body: {
          type: 'object',
          properties: {
            coupons: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
            name: {
              type: 'string',
            },
            description: {
              type: 'string',
            },
            // TODO: Replace scope with presentation definition
            // Use the presentation definition to create a new scope (API call to the auth server)
            // Use the UUID (scope) from the auth server response, the same way as the one in this request body
            scope: {
              type: 'string',

              enum: ['openid coupon:demo'], // Currenty this is mapped 1:1 to the verifier types (could be different)
            },
          },
          required: ['scope', 'coupons', 'name', 'description'],
        },
      },
      config: {
        description: '',
        response: {},
      },
    },
    async (request, reply) => {
      const id = randomUUID();

      const { name, description, coupons, scope } = request.body;

      fastify.couponCache.set(id, {
        name,
        description,
        coupons,
        scope,
      });

      return reply.code(201).send({
        id,
      });
    },
  );
};

export default route;
