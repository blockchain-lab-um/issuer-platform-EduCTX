import { isError } from '@blockchain-lab-um/oidc-rp-plugin';
import { fastifyFormbody } from '@fastify/formbody';

import type { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import type { UserSessionsTable } from '../../db/types/index.js';
import { apiKeyAuth } from '../../middlewares/apiKeyAuth.js';
import { routeSchemas } from '../../utils/schemas/index.js';

const oidc: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify,
): Promise<void> => {
  await fastify.register(fastifyFormbody, { bodyLimit: 1048576 * 10 });

  const pool = fastify.pg.pool;

  fastify.get(
    '/.well-known/openid-credential-issuer',
    {
      config: {
        description: 'Well-known endpoint for OpenID credential issuer',
        response: {},
      },
    },
    async (_, reply) => {
      const res = await fastify.veramoAgent.handleIssuerServerMetadataRequest();

      if (isError(res)) {
        throw res.error;
      }

      return reply.code(200).send(res.data);
    },
  );

  fastify.post(
    '/credential-offer',
    {
      preValidation: apiKeyAuth,
      schema: {
        body: routeSchemas,
        response: {
          200: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
              },
              credentialOfferRequest: {
                type: 'string',
              },
              userPin: {
                type: 'string',
              },
            },
            required: ['id', 'credentialOfferRequest'],
          },
          500: {
            type: 'object',
            properties: {
              error: {
                type: 'string',
              },
            },
            required: ['error'],
          },
        },
      },
      config: {
        description: 'Credential offer endpoint for OpenID credential issuer',
      },
    },
    async (request, reply) => {
      const res = await fastify.veramoAgent.createCredentialOfferRequest({
        credentials: [
          {
            format: 'jwt_vc_json',
            types: ['VerifiableCredential', 'EducationCredential'],
          },
        ],
        grants: ['urn:ietf:params:oauth:grant-type:pre-authorized_code'],
        userPinRequired: false,
      });

      if (isError(res)) {
        throw res.error;
      }

      const {
        credentialOfferRequest,
        credentials,
        preAuthorizedCode,
        userPin,
      } = res.data;

      if (!preAuthorizedCode) {
        return reply.code(500).send({
          error:
            'internal_server_error: Error creating credential offer request.',
        });
      }

      const claims = (request.body as any).credentialSubject;

      try {
        await pool.query<UserSessionsTable>(
          'INSERT INTO user_sessions (id, user_pin, credentials, claims, credential_offer_request) VALUES ($1, $2, $3, $4, $5)',
          [
            preAuthorizedCode,
            userPin ?? '',
            credentials,
            claims,
            credentialOfferRequest,
          ],
        );
      } catch (error) {
        return reply.code(500).send({
          error: 'internal_server_error: Error creating user session.',
        });
      }

      return reply.code(200).send({
        id: preAuthorizedCode,
        credentialOfferRequest,
        userPin: userPin ?? '',
      });
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
          properties: {
            grant_type: {
              type: 'string',
              enum: ['urn:ietf:params:oauth:grant-type:pre-authorized_code'],
            },
            'pre-authorized_code': { type: 'string' },
            user_pin: { type: 'string' },
          },
          required: ['grant_type', 'pre-authorized_code'],
        },
      },

      config: {
        description: 'Token endpoint for OpenID credential issuer',
      },
      // response: {},
    },
    async (request, reply) => {
      const { 'pre-authorized_code': preAuthorizedCode } = request.body;

      let userSession: UserSessionsTable;

      try {
        const { rows } = await pool.query<UserSessionsTable>(
          'SELECT * FROM user_sessions WHERE id = $1',
          [preAuthorizedCode],
        );

        if (rows.length === 0) {
          // Return unauthorized
          return reply.code(401).send('Unauthorized');
        }

        userSession = rows[0];
      } catch (error) {
        return reply.code(500).send({
          error: 'internal_server_error: Error getting user session.',
        });
      }

      const tokenRequestResult =
        await fastify.veramoAgent.handlePreAuthorizedCodeTokenRequest({
          body: request.body,
          preAuthorizedCode,
          // userPin: userSession.user_pin,
        });

      if (isError(tokenRequestResult)) {
        return reply.code(401).send({
          error: tokenRequestResult.error.error,
          error_description: tokenRequestResult.error.errorDescription,
        });
      }

      const {
        access_token: accessToken,
        c_nonce: cNonce,
        c_nonce_expires_in: expCNonce,
      } = tokenRequestResult.data;

      const nonceExpirationTimestamp = new Date(expCNonce!);

      // Update user session in database
      try {
        await pool.query(
          'UPDATE user_sessions SET c_nonce = $1, c_nonce_expires_in = $2, access_token = $3 WHERE id = $4',
          [cNonce, nonceExpirationTimestamp, accessToken, preAuthorizedCode],
        );
      } catch (error) {
        console.log(error);
        return reply.code(500).send({
          error: 'internal_server_error: Error updating user session.',
        });
      }

      return reply.code(200).send(tokenRequestResult.data);
    },
  );

  fastify.post(
    '/credential',
    {
      schema: {
        headers: {
          type: 'object',
          properties: {
            Authorization: {
              type: 'string',
              pattern: '^Bearer .+$',
            },
          },
          required: ['Authorization'],
        },
        body: {
          type: 'object',
          properties: {
            format: {
              type: 'string',
              enum: ['jwt_vc_json'],
            },
            types: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
            proof: {
              type: 'object',
              properties: {
                proof_type: {
                  type: 'string',
                  enum: ['jwt'],
                },
                jwt: {
                  type: 'string',
                },
              },
              required: ['proof_type', 'jwt'],
            },
          },
          required: ['format', 'types', 'proof'],
        },
      },
      config: {
        description: 'Credential endpoint for OpenID credential issuer',
      },
    },
    async (request, reply) => {
      const authorizationHeader = request.headers.authorization;

      const [_, token] = authorizationHeader.split(' ');

      let userSession: UserSessionsTable;
      try {
        const { rows } = await pool.query<UserSessionsTable>(
          'SELECT * FROM user_sessions WHERE access_token = $1',
          [token],
        );
        if (rows.length === 0) {
          // Return unauthorized
          return reply.code(401).send('Unauthorized');
        }
        userSession = rows[0];
      } catch (error) {
        return reply.code(500).send({
          error: 'internal_server_error: Error getting user session.',
        });
      }

      // Check expiration
      if (new Date(userSession.expires_in) < new Date()) {
        return reply.code(401).send('Session expired');
      }

      const proofOfPossessionResult =
        await fastify.veramoAgent.proofOfPossession({
          cNonce: userSession.c_nonce,
          cNonceExpiresIn: Number(userSession.c_nonce_expires_in),
          proof: request.body.proof,
        });

      if (isError(proofOfPossessionResult)) {
        return reply.code(400).send({
          error: proofOfPossessionResult.error.error,
          error_description: proofOfPossessionResult.error.errorDescription,
        });
      }

      const { did } = proofOfPossessionResult.data;

      // TODO: Check if same credentials were requested as in the credential offer
      const credentialResponse =
        await fastify.veramoAgent.handleCredentialRequest({
          body: request.body,
          issuerDid: fastify.issuerIdentifier.did,
          subjectDid: did,
          credentialSubjectClaims: userSession.claims,
        });

      if (isError(credentialResponse)) {
        throw credentialResponse.error;
      }

      return reply.code(200).send(credentialResponse.data);
    },
  );
};

export default oidc;
