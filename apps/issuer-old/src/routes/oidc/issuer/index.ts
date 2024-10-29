import { isError } from '@blockchain-lab-um/oidc-rp-plugin';
import { fastifyFormbody } from '@fastify/formbody';

import type { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import type { UserSessionsTable } from '../../../db/types/index.js';
import { apiKeyAuth } from '../../../middlewares/apiKeyAuth.js';
import { routeSchemas } from '../../../utils/schemas/index.js';
import { validatePostCredential } from '@cef-ebsi/credential-issuer';
import type { CredentialResponse } from '@blockchain-lab-um/oidc-types';
import { ES256Signer } from 'did-jwt';
import {
  createVerifiableCredentialJwt,
  type CreateVerifiableCredentialOptions,
  type EbsiIssuer,
  type EbsiVerifiableAttestation,
} from '@cef-ebsi/verifiable-credential';
import * as utils from '@noble/curves/abstract/utils';
import { randomUUID } from 'node:crypto';

const oidc: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify,
): Promise<void> => {
  await fastify.register(fastifyFormbody, { bodyLimit: 1048576 * 10 });

  const pool = fastify.pg.pool;

  /**
   * Issuer server endpoints
   */
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

      return reply.code(200).send({
        ...res.data,
        credential_issuer: `${process.env.ISSUER_URL}/oidc/issuer`,
        credential_endpoint: `${process.env.ISSUER_URL}/oidc/issuer/credential`,
        deferred_credential_endpoint: `${process.env.ISSUER_URL}/oidc/issuer/credential-deffered`,
      });
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
        userPinRequired: true,
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
          userPin: userSession.user_pin,
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
      const {
        did,
        url,
        authorizationMockPublicKeyJwk,
        resolver,
        credentialTypesSupported,
      } = fastify.issuerServerConfig;

      const { accessTokenPayload, credentialRequest } =
        await validatePostCredential(
          fastify.dbIssuerServer,
          did,
          url,
          authorizationMockPublicKeyJwk,
          resolver,
          resolver,
          credentialTypesSupported,
          undefined,
          request.headers.authorization,
          request.body,
        );

      const issuer = {
        did: fastify.issuerIdentifier.did,
        kid: `${fastify.issuerIdentifier.did}#${fastify.issuerIdentifier.did.split(':')[2]}`,
        alg: 'ES256',
        signer: ES256Signer(utils.hexToBytes(process.env.ISSUER_PRIVATE_KEY!)),
      } satisfies EbsiIssuer;

      const vcPayload = {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        id: `urn:uuid:${randomUUID()}`,
        type: credentialRequest.types,
        issuer: issuer.did,
        issuanceDate: '2021-11-01T00:00:00Z',
        validFrom: '2021-11-01T00:00:00Z',
        validUntil: '2050-11-01T00:00:00Z',
        expirationDate: '2031-11-30T00:00:00Z',
        issued: '2021-10-30T00:00:00Z',
        credentialSubject: {
          id: accessTokenPayload.sub,
        },
        credentialSchema: {
          id: 'https://api-pilot.ebsi.eu/trusted-schemas-registry/v3/schemas/z3MgUFUkb722uq4x3dv5yAJmnNmzDFeK5UC8x83QoeLJM',
          type: 'FullJsonSchemaValidator2021',
        },
        // termsOfUse: {
        //   id: 'https://api-pilot.ebsi.eu/trusted-issuers-registry/v5/issuers/did:ebsi:zxaYaUtb8pvoAtYNWbKcveg/attributes/b40fd9b404418a44d2d9911377a03130dde450eb546c755b5b80acd782902e6d',
        //   type: 'IssuanceCertificate',
        // },
      } satisfies EbsiVerifiableAttestation;

      const options = {
        network: 'conformance',
        hosts: ['api-conformance.ebsi.eu'],
      } satisfies CreateVerifiableCredentialOptions;

      const vcJwt = await createVerifiableCredentialJwt(
        vcPayload,
        issuer,
        options,
      );

      const response: CredentialResponse = {
        format: 'jwt_vc_json',
        credential: vcJwt,
        c_nonce: accessTokenPayload.claims.c_nonce,
        c_nonce_expires_in: accessTokenPayload.claims.c_nonce_expires_in,
      };

      return reply.code(200).send(response);
    },
  );
};

export default oidc;
