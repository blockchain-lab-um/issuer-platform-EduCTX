import {
  validatePostCredential,
  type CredentialIssuerMetadata,
} from '@cef-ebsi/credential-issuer';
import type { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { randomBytes, randomUUID } from 'node:crypto';
import { ES256KSigner, ES256Signer } from 'did-jwt';
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

      const signer =
        fastify.config.KEY_ALG === 'ES256'
          ? ES256Signer(utils.hexToBytes(fastify.config.PRIVATE_KEY))
          : ES256KSigner(utils.hexToBytes(fastify.config.PRIVATE_KEY));

      const issuer = {
        did: fastify.issuerServerConfig.did,
        kid: `${fastify.issuerServerConfig.kid}`,
        alg: fastify.config.KEY_ALG,
        signer: signer,
      } satisfies EbsiIssuer;

      // Store c_nonce to prevent replay attacks
      const dbKey = {
        did: fastify.issuerServerConfig.did,
        nonceAccessToken: accessTokenPayload.claims.c_nonce,
      };

      await fastify.dbOidc.put(dbKey, {
        nonce: accessTokenPayload.claims.c_nonce,
      });

      const issuedAt = `${new Date(Date.now()).toISOString().slice(0, -5)}Z`;

      const vcPayload = {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        id: `urn:uuid:${randomUUID()}`,
        type: credentialRequest.types,
        issuer: issuer.did,
        issuanceDate: issuedAt,
        validFrom: issuedAt,
        issued: issuedAt,
        validUntil: '2050-11-01T00:00:00Z', // TODO: Check if we can issue without expiration
        expirationDate: '2031-11-30T00:00:00Z',
        credentialSubject: {
          id: accessTokenPayload.sub,
        },
        credentialSchema: {
          id: `https://api-${fastify.config.NETWORK}.ebsi.eu/trusted-schemas-registry/v3/schemas/z3MgUFUkb722uq4x3dv5yAJmnNmzDFeK5UC8x83QoeLJM`,
          type: 'FullJsonSchemaValidator2021',
        },
        // termsOfUse: {
        //   id: 'https://api-pilot.ebsi.eu/trusted-issuers-registry/v5/issuers/did:ebsi:zxaYaUtb8pvoAtYNWbKcveg/attributes/b40fd9b404418a44d2d9911377a03130dde450eb546c755b5b80acd782902e6d',
        //   type: 'IssuanceCertificate',
        // },
      } satisfies EbsiVerifiableAttestation;

      const options = {
        network: fastify.config.NETWORK,
        hosts: [`api-${fastify.config.NETWORK}.ebsi.eu`],
      } satisfies CreateVerifiableCredentialOptions;

      const vcJwt = await createVerifiableCredentialJwt(
        vcPayload,
        issuer,
        options,
      );

      // TODO: Should we maybe issue in the deffered endpoint ?
      const deferredCredentials = [
        'CTWalletSameAuthorisedDeferred',
        'CTWalletSamePreAuthorisedDeferred',
      ];

      if (
        credentialRequest.types.some((type) =>
          deferredCredentials.includes(type),
        )
      ) {
        const acceptanceToken = Buffer.from(randomBytes(32)).toString(
          'base64url',
        );

        const defferedCredentialId = `deffered-credential-${acceptanceToken}`;

        await fastify.cache.set(
          defferedCredentialId,
          {
            credential: vcJwt,
            format: credentialRequest.format,
          },
          // 7 days
          604_800_000,
        );

        // TODO: Check if we should include `c_nonce` and `c_nonce_expires_in` in the response
        return reply.code(200).send({
          acceptance_token: acceptanceToken,
          c_nonce: accessTokenPayload.claims.c_nonce,
          c_nonce_expires_in: accessTokenPayload.claims.c_nonce_expires_in,
        });
      }

      // TODO: Check if we should include `c_nonce` and `c_nonce_expires_in` in the response
      const response = {
        format: 'jwt_vc_json',
        credential: vcJwt,
        c_nonce: accessTokenPayload.claims.c_nonce,
        c_nonce_expires_in: accessTokenPayload.claims.c_nonce_expires_in,
      };

      return reply.code(200).send(response);
    },
  );

  fastify.post(
    '/credential-deffered',
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
        description: 'Credential endpoint for OpenID credential issuer',
      },
    },
    async (request, reply) => {
      const accessToken = request.headers.authorization.replace('Bearer ', '');
      const defferedCredentialId = `deffered-credential-${accessToken}`;

      const deferredCredential = await fastify.cache.get(defferedCredentialId);

      if (!deferredCredential) {
        return reply.code(404).send();
      }

      await fastify.cache.del(defferedCredentialId);

      return reply.code(200).send({
        format: deferredCredential.format,
        credential: deferredCredential.credential,
      });
    },
  );
};

export default route;
