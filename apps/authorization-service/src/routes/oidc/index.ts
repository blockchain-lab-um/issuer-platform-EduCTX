import { fastifyFormbody } from '@fastify/formbody';
import type { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';

const authorization: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify,
): Promise<void> => {
  await fastify.register(fastifyFormbody, { bodyLimit: 1048576 * 10 });

  /**
   * Authorization server endpoints
   */
  fastify.get(
    '/.well-known/openid-configuration',
    {
      config: {
        description: 'Well-known endpoint for OpenID authorization server',
        response: {},
      },
    },
    async (_, reply) => {
      return reply.code(200).send(fastify.auth.getOPMetadata());
    },
  );

  fastify.post(
    '/direct_post',
    {
      schema: {
        body: {
          type: 'object',
        },
      },
      config: {
        description: '',
        response: {},
      },
    },
    async (request, reply) => {
      const body = request.body;

      const location = await fastify.auth.directPost(body);

      return reply.redirect(location);
    },
  );

  fastify.get(
    '/jwks',
    {
      config: {
        description: '',
        response: {},
      },
    },
    async (_, reply) => {
      const jwks = await fastify.auth.getPublicJwks();
      return reply.code(200).send(jwks);
    },
  );

  fastify.get(
    '/authorize',
    {
      schema: {
        querystring: {
          type: 'object',
          properties: {
            scope: {
              type: 'string',
              enum: [
                'openid',
                'openid ver_test:id_token',
                'openid ver_test:vp_token',
              ],
            },
            client_id: {
              type: 'string',
            },
            client_metadata: {
              type: 'string',
            },
            authorization_details: {
              type: 'string',
            },
            redirect_uri: {
              type: 'string',
            },
            response_type: {
              type: 'string',
              enum: ['code'],
            },
            state: {
              type: 'string',
            },
            issuer_state: {
              type: 'string',
            },
            code_challenge: {
              type: 'string',
            },
            code_challenge_method: {
              type: 'string',
              enum: ['S256', 'plain'],
            },
            nonce: {
              type: 'string',
            },
            request: {
              type: 'string',
            },
            request_uri: {
              type: 'string',
            },
          },
          required: ['scope', 'client_id', 'redirect_uri', 'response_type'],
        },
      },
      config: {
        description: '',
        response: {},
      },
    },
    async (request, reply) => {
      const redirectLocation = await fastify.auth.authorize(request.query);
      return reply.redirect(redirectLocation);
    },
  );

  fastify.get(
    '/request_uri/:requestId',
    {
      schema: {
        params: {
          type: 'object',
          properties: {
            requestId: {
              type: 'string',
            },
          },
          required: ['requestId'],
        },
      },
      config: {
        description: '',
        response: {},
      },
    },
    async (request, reply) => {
      const authRequest = await fastify.auth.getRequestById(
        request.params.requestId,
      );

      return reply.code(200).send(authRequest);
    },
  );

  fastify.post(
    '/token',
    {
      schema: {
        headers: {
          type: 'object',
          properties: {
            'content-type': {
              type: 'string',
              enum: ['application/x-www-form-urlencoded'],
            },
          },
        },
        body: {
          type: 'object',
          properties: {
            grant_type: {
              type: 'string',
              enum: [
                'authorization_code',
                'urn:ietf:params:oauth:grant-type:pre-authorized_code',
              ],
            },
            code: {
              type: 'string',
            },
            client_id: {
              type: 'string',
            },
            'pre-authorized_code': {
              type: 'string',
            },
            user_pin: {
              type: 'string',
            },
          },
          required: ['grant_type'],
        },
      },

      config: {
        description: 'Token endpoint for OpenID credential issuer',
      },
    },
    async (request, reply) => {
      const response = await fastify.auth.token(request.body);

      return reply.code(200).send(response);
    },
  );
};

export default authorization;
