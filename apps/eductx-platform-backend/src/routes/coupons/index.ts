import type { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { randomUUID } from 'node:crypto';
import { apiKeyAuth } from '../../middlewares/apiKeyAuth.js';

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
            presentationDefinition: {
              type: 'object',
            },
          },
          required: [
            'presentationDefinition',
            'coupons',
            'name',
            'description',
          ],
        },
      },
      config: {
        description: '',
        response: {},
      },
      preValidation: apiKeyAuth,
    },
    async (request, reply) => {
      // Create presentation definition on the auth server
      const response = await fetch(
        `${fastify.config.VERIFIER_SERVER_URL}/presentation-definitions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.VERIFIER_API_KEY!,
          },
          body: JSON.stringify({
            presentationDefinition: request.body.presentationDefinition,
          }),
        },
      );

      if (response.status !== 201) {
        return reply.code(500).send();
      }

      const { id: presentationDefinitionId } = await response.json();
      const scope = `openid custom:${presentationDefinitionId}`;

      const id = randomUUID();

      const { name, description, coupons } = request.body;

      fastify.couponCache.set(id, {
        name,
        description,
        coupons,
        scope,
        presentationDefinition: request.body.presentationDefinition,
      });

      return reply.code(201).send({
        id,
      });
    },
  );
};

export default route;
