import type { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { randomUUID } from 'node:crypto';

const route: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify,
): Promise<void> => {
  // TODO: Change to POST
  fastify.get(
    '/',
    {
      config: {
        description: '',
        response: {},
      },
    },
    async (_, reply) => {
      // Create state
      const state = randomUUID();
      console.log(`State: ${state}`);
      // Call `/oidc/authorize` with state

      const queryString = new URLSearchParams({
        response_type: 'code',
        scope: 'openid coupon:demo',
        client_id: 'eductx-platform-backend',
        redirect_uri: 'openid://',
        state,
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
    '/:authRequestId',
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
      );

      if (response.status === 404) {
        return reply.code(404).send();
      }

      const data = await response.json();

      if (data.status === 'Success') {
        // TODO: Extra bussines logic
        return reply.code(200).send({
          status: 'Success',
          data: {
            coupon: 'test-coupon-12',
          },
        });
      }

      return reply.code(200).send(data);
    },
  );
};

export default route;
