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
      return reply.code(200).send(fastify.authServer.getOPMetadata());
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

      const location = await fastify.authServer.directPost(body);

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
      const jwks = await fastify.authServer.getPublicJwks();
      return reply.code(200).send(jwks);
    },
  );

  // [App]   scope: 'openid',
  // [App]   client_id: 'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9Kboj7g9PfXJxbbs4KYegyr7ELnFVnpDMzbJJDDNZjavX6jvtDmALMbXAGW67pdTgFea2FrGGSFs8Ejxi96oFLGHcL4P6bjLDPBJEvRRHSrG4LsPne52fczt2MWjHLLJBvhAC',
  // [App]   client_metadata: '{"redirect_uris":["openid://redirect"],"jwks_uri":"https://api-conformance.ebsi.eu/conformance/v3/issuer-mock/jwks","authorization_endpoint":"openid:"}',
  // [App]   authorization_details: '[{"type":"openid_credential","locations":["https://4ff1-2a00-1a20-217f-f797-e84e-2517-97cc-f585.ngrok-free.app/oidc"],"format":"jwt_vc_json","types":["VerifiableCredential","VerifiableAttestation","CTWalletSameAuthorisedInTime"]}]',
  // [App]   redirect_uri: 'openid://redirect',
  // [App]   response_type: 'code',
  // [App]   state: '07e6a794-01d3-45dd-aa47-b9afe1736fae',
  // [App]   code_challenge: 'XgTf7JUFfpi913BSCyucy51hvryZDagKCTLrNPoQJvc',
  // [App]   code_challenge_method: 'S256'
  fastify.get(
    '/authorize',
    {
      schema: {
        querystring: {
          type: 'object',
          properties: {
            scope: {
              type: 'string',
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
            },
            state: {
              type: 'string',
            },
            code_challenge: {
              type: 'string',
            },
            code_challenge_method: {
              type: 'string',
            },
          },
          required: [
            'scope',
            'client_id',
            'client_metadata',
            'authorization_details',
            'redirect_uri',
            'response_type',
            'state',
            'code_challenge',
            'code_challenge_method',
          ],
        },
      },
      config: {
        description: '',
        response: {},
      },
    },
    async (request, reply) => {
      const redirectLocation = await fastify.authServer.authorize(
        request.query,
      );
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
      const authRequest = await fastify.authServer.getRequestById(
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
          'content-type': {
            type: 'string',
            enum: ['application/x-www-form-urlencoded'],
          },
        },
        body: {
          type: 'object',
          properties: {},
          required: [],
        },
      },

      config: {
        description: 'Token endpoint for OpenID credential issuer',
      },
      // response: {},
    },
    async (request, reply) => {
      const response = await fastify.authServer.token(request.body);

      return reply.code(200).send(response);
    },
  );
};

export default authorization;
