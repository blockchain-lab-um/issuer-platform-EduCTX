import { fastifyFormbody } from '@fastify/formbody';
import type { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { createJWT, ES256KSigner, ES256Signer } from 'did-jwt';
import * as utils from '@noble/curves/abstract/utils';
import { importJWK, jwtVerify } from 'jose';
import { getPublicJwk } from '@blockchain-lab-um/eductx-platform-shared';

const route: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify,
): Promise<void> => {
  await fastify.register(fastifyFormbody, { bodyLimit: 1048576 * 10 });

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
          properties: {
            vp_token: {
              type: 'string',
            },
            presentation_submission: {
              type: 'string',
            },
            state: {
              type: 'string',
            },
            id_token: {
              type: 'string',
            },
          },
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
      let pin: null | string = null;

      const preAuthorizedCode = request.body['pre-authorized_code'];
      if (preAuthorizedCode) {
        pin = await fastify.cache.get(preAuthorizedCode);
      }

      const response = await fastify.auth.token(request.body, { pin });

      if (preAuthorizedCode) {
        const now = Math.floor(Date.now() / 1000);

        const jwt = await createJWT(
          {
            iss: `${fastify.config.SERVER_URL}/oidc`,
            aud: fastify.config.ISSUER_SERVER_URL,
            iat: now,
            exp: now + 180, // 3 minutes
            data: {
              id: preAuthorizedCode,
              newId: response.access_token,
            },
          },
          {
            issuer: fastify.config.SERVER_URL,
            signer:
              fastify.config.KEY_ALG === 'ES256'
                ? ES256Signer(utils.hexToBytes(fastify.config.PRIVATE_KEY))
                : ES256KSigner(utils.hexToBytes(fastify.config.PRIVATE_KEY)),
          },
          {
            type: 'JWT',
            alg: fastify.config.KEY_ALG,
            kid: fastify.kid,
          },
        );

        await fetch(
          `${fastify.config.ISSUER_SERVER_URL}/stored-credential-data`,
          {
            method: 'POST',
            headers: {
              authorization: `Bearer ${jwt}`,
            },
          },
        );
      }

      return reply.code(200).send(response);
    },
  );

  fastify.post(
    '/set-pin',
    {
      schema: {
        headers: {
          type: 'object',
          properties: {
            authorization: {
              type: 'string',
              pattern: '^Bearer .+$',
            },
          },
          required: ['authorization'],
        },
      },
      config: {
        description: '',
      },
    },
    async (request, reply) => {
      const issuerServerPublicJwk = await getPublicJwk(
        fastify.config.ISSUER_SERVER_PUBLIC_KEY,
        fastify.config.ISSUER_SERVER_KEY_ALG,
      );

      const issuerMockPublicKey = await importJWK(
        issuerServerPublicJwk,
        fastify.config.ISSUER_SERVER_KEY_ALG,
      );

      try {
        const { payload } = await jwtVerify(
          request.headers.authorization.replace('Bearer ', ''),
          issuerMockPublicKey,
        );

        const data = payload.data as
          | { preAuthorizedCode?: string; pin?: string }
          | undefined;

        if (!data?.preAuthorizedCode || !data?.pin)
          return reply.code(400).send();

        await fastify.cache.set(data.preAuthorizedCode, data.pin);
      } catch (error) {
        return reply.code(401).send({
          error: 'Unauthorized',
        });
      }

      return reply.code(200).send();
    },
  );
};

export default route;
