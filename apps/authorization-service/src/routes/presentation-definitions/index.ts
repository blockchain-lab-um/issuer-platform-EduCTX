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
        description: 'List all available presentation definitions',
      },
    },
    async (_, reply) => {
      const presentationDefinitionStorage =
        fastify.presentationDefinitionCache.all();

      const presentationDefinitions = Object.values(
        presentationDefinitionStorage,
      );

      return reply.code(200).send(presentationDefinitions);
    },
  );

  fastify.post(
    '/',
    {
      schema: {
        body: {
          type: 'object',
          properties: {
            presentationDefinition: {
              type: 'object',
            },
          },
          required: ['presentationDefinition'],
        },
      },
      config: {
        description: 'Create a new presentation definition',
      },
      preValidation: apiKeyAuth,
    },
    async (request, reply) => {
      const id = randomUUID();

      fastify.presentationDefinitionCache.set(id, {
        ...request.body.presentationDefinition,
        id,
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
            id: {
              type: 'string',
            },
          },
          required: ['id'],
        },
      },
      preValidation: apiKeyAuth,
    },
    async (request, reply) => {
      if (!fastify.presentationDefinitionCache.get(request.params.id)) {
        return reply.code(404).send();
      }

      fastify.presentationDefinitionCache.delete(request.params.id);
      return reply.code(204).send();
    },
  );
};

export default route;
