import type { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { randomUUID } from 'node:crypto';

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
      const state = randomUUID();

      const queryString = new URLSearchParams({
        response_type: 'code',
        scope: 'openid interop_test',
        client_id: 'eductx-platform-backend',
        redirect_uri: 'openid://',
        state,
        request_object: 'reference',
      }).toString();

      const response = await fetch(
        `${fastify.config.VERIFIER_SERVER_URL}/oidc/authorize?${queryString}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          redirect: 'manual',
        },
      );

      return reply.code(200).send({
        authRequestId: state,
        location: response.headers.get('location'),
      });
    },
  );

  fastify.get(
    '/status/:authRequestId',
    {
      schema: {
        params: {
          type: 'object',
          properties: {
            authRequestId: {
              type: 'string',
            },
          },
          required: ['authRequestId'],
        },
      },
      config: {
        description: '',
        response: {},
      },
    },
    async (request, reply) => {
      const response = await fetch(
        `${fastify.config.VERIFIER_SERVER_URL}/oidc/status/${request.params.authRequestId}`,
        {
          headers: {
            'x-api-key': fastify.config.VERIFIER_API_KEY,
          },
        },
      );

      if (response.status === 404) {
        return reply.code(404).send();
      }

      const data = await response.json();

      if (data.status === 'Success') {
        return reply.code(200).send({
          status: 'Success',
        });
      }

      return reply.code(200).send(data);
    },
  );
};

export default route;
