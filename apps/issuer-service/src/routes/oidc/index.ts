import {
  type CredentialResponse,
  validatePostCredential,
  type CredentialIssuerMetadata,
} from '@cef-ebsi/credential-issuer';
import type { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { randomUUID } from 'node:crypto';
import { ES256Signer } from 'did-jwt';
import * as utils from '@noble/curves/abstract/utils';
import {
  createVerifiableCredentialJwt,
  type CreateVerifiableCredentialOptions,
  type EbsiIssuer,
  type EbsiVerifiableAttestation,
} from '@cef-ebsi/verifiable-credential';

const route: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify,
): Promise<void> => {
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
      const metadata: CredentialIssuerMetadata = {
        credential_issuer: `${fastify.config.SERVER_URL}/oidc`,
        credential_endpoint: `${fastify.config.SERVER_URL}/oidc/credential`,
        deferred_credential_endpoint: `${fastify.config.SERVER_URL}/oidc/credential-deffered`,
        // TODO: Move this to config
        credentials_supported:
          fastify.issuerServerConfig.credentialTypesSupported.map(
            (credentialTypes) => ({
              format: 'jwt_vc_json',
              types: credentialTypes,
              display: [],
            }),
          ),
        authorization_server: `${fastify.config.AUTHORIZATION_SERVER_URL}`,
      };

      return reply.code(200).send(metadata);
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
        authorizationServerPublicJwk,
        resolver,
        credentialTypesSupported,
      } = fastify.issuerServerConfig;

      const { accessTokenPayload, credentialRequest } =
        await validatePostCredential(
          fastify.dbOidc,
          did,
          url,
          authorizationServerPublicJwk,
          resolver,
          resolver,
          credentialTypesSupported,
          undefined,
          request.headers.authorization,
          request.body,
        );

      console.log(credentialRequest);

      console.log(accessTokenPayload);
      console.log(accessTokenPayload.claims.authorization_details);

      const issuer = {
        did: fastify.issuerServerConfig.did,
        kid: `${fastify.issuerServerConfig.kid}`,
        alg: 'ES256',
        signer: ES256Signer(utils.hexToBytes(fastify.config.PRIVATE_KEY)),
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

      // TODO: Check correct type
      const response: CredentialResponse = {
        format: 'jwt_vc_json',
        credential: vcJwt,
        // c_nonce: accessTokenPayload.claims.c_nonce,
        // c_nonce_expires_in: accessTokenPayload.claims.c_nonce_expires_in,
      };

      return reply.code(200).send(response);
    },
  );
};

export default route;
