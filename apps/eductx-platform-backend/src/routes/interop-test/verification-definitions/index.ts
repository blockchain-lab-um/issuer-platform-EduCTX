import type { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { randomUUID } from 'node:crypto';
import { apiKeyAuth } from '../../../middlewares/apiKeyAuth.js';

const route: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify,
): Promise<void> => {
  fastify.get(
    '/',
    {
      schema: {},
      config: {
        description: '',
        response: {},
      },
    },
    async (_, reply) => {
      const verificationDefinitions = Object.entries(
        fastify.verificationDemoCache.all(),
      ).map(([id, definition]) => ({
        id,
        ...definition,
      }));

      return reply.code(200).send(verificationDefinitions);
    },
  );

  fastify.post(
    '/create',
    {
      schema: {
        body: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
            },
            presentationDefinition: {
              type: 'object',
            },
          },
          required: ['presentationDefinition', 'name'],
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

      const { name } = request.body;

      fastify.verificationDemoCache.set(id, {
        name,
        scope,
      });

      return reply.code(201).send({
        id,
      });
    },
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' },
          },
          required: ['id'],
        },
      },
      preValidation: apiKeyAuth,
    },
    async (request, reply) => {
      fastify.verificationDemoCache.delete(request.params.id);
      return reply.code(204).send();
    },
  );
};

export default route;
