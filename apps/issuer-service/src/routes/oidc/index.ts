import {
  type CredentialOfferPayload,
  validatePostCredential,
  type CredentialIssuerMetadata,
} from '@cef-ebsi/credential-issuer';
import type { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { randomBytes, randomInt, randomUUID } from 'node:crypto';
import { createJWT, ES256KSigner, ES256Signer } from 'did-jwt';
import * as utils from '@noble/curves/abstract/utils';
import {
  createVerifiableCredentialJwt,
  type CreateVerifiableCredentialOptions,
  type EbsiIssuer,
  type EbsiVerifiableAttestation,
} from '@cef-ebsi/verifiable-credential';
import { decodeJwt, importJWK, jwtVerify } from 'jose';
import {
  getKeyPair,
  getPublicJwk,
} from '@blockchain-lab-um/eductx-platform-shared';
import { apiKeyAuth } from '../../middlewares/apiKeyAuth.js';
import { CREDENTIAL_TYPE_TO_SCHEMA } from '../../plugins/issuer.js';

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
        deferred_credential_endpoint: `${fastify.config.SERVER_URL}/oidc/credential_deffered`,
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

      // Check if any cached data is available
      const cachedData = await fastify.cache.get(
        request.headers.authorization.replace('Bearer ', ''),
      );

      const proofJwt = decodeJwt(credentialRequest.proof.jwt);

      let schema = CREDENTIAL_TYPE_TO_SCHEMA.get(
        JSON.stringify(credentialRequest.types),
      );

      // If schema is not found, fallback to the EBSI schema
      if (!schema) {
        schema = `https://api-${fastify.config.NETWORK}.ebsi.eu/trusted-schemas-registry/v3/schemas/z3MgUFUkb722uq4x3dv5yAJmnNmzDFeK5UC8x83QoeLJM`;
      }

      const vcPayload = {
        // TODO: Do we need to add contexts based on requested credential types ?
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        id: `urn:uuid:${randomUUID()}`,
        type: credentialRequest.types,
        issuer: issuer.did,
        issuanceDate: issuedAt,
        validFrom: issuedAt,
        issued: issuedAt,
        credentialSubject: {
          ...(cachedData?.credentialSubject ?? {}),
          id: accessTokenPayload.sub ?? proofJwt.iss,
        },
        credentialSchema: {
          id: schema,
          type: 'FullJsonSchemaValidator2021',
        },
        // termsOfUse: {
        //   id: 'https://api-pilot.ebsi.eu/trusted-issuers-registry/v5/issuers/did:ebsi:zxaYaUtb8pvoAtYNWbKcveg/attributes/b40fd9b404418a44d2d9911377a03130dde450eb546c755b5b80acd782902e6d',
        //   type: 'IssuanceCertificate',
        // },
      } satisfies EbsiVerifiableAttestation;

      const options = {
        network: fastify.config.NETWORK,
        hosts: [
          `api-${fastify.config.NETWORK}.ebsi.eu`,
          'raw.githubusercontent.com',
        ],
        skipValidation: true,
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

        return reply.code(200).send({
          acceptance_token: acceptanceToken,
          c_nonce: accessTokenPayload.claims.c_nonce,
          c_nonce_expires_in: accessTokenPayload.claims.c_nonce_expires_in,
        });
      }

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
    '/credential_deffered',
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

  fastify.post(
    '/create-credential-offer',
    {
      schema: {
        body: {
          type: 'object',
          properties: {
            credential_type: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
            format: {
              type: 'string',
              enum: ['jwt_vc', 'jwt_vc_json'],
            },
            credential_offer_endpoint: {
              type: 'string',
            },
            flow: {
              type: 'string',
              enum: ['authorization_code', 'pre-authorized_code'],
            },
            credential_subject: {
              type: 'object',
            },
          },
          required: ['credential_type'],
        },
      },
      config: {
        description: 'Credential endpoint for OpenID credential issuer',
      },
      preValidation: apiKeyAuth,
    },
    async (request, reply) => {
      const credentialOfferEndpoint =
        request.body.credential_offer_endpoint ?? 'openid-credential-offer://';
      const format = request.body.format ?? 'jwt_vc_json';
      const flow = request.body.flow ?? 'pre-authorized_code';

      const { credential_type } = request.body;

      // Check if we support the credential type
      const isSupportedCredentialType =
        fastify.issuerServerConfig.credentialTypesSupported.some(
          (credentialTypes) => {
            if (credentialTypes.length !== credential_type.length) return false;

            for (let i = 0; i < credentialTypes.length; i++) {
              if (credentialTypes[i] !== credential_type[i]) return false;
            }

            return true;
          },
        );

      if (!isSupportedCredentialType) {
        return reply.code(400).send('Unsupported credential type');
      }

      let grants = {};
      const now = Math.floor(Date.now() / 1000);

      const response: {
        id: string;
        pin?: string;
        location: string;
      } = {
        id: '',
        location: '',
      };

      if (flow === 'authorization_code') {
        // Authorized code flow
        const issuerState = await createJWT(
          {
            credential_types: credential_type,
            iss: fastify.issuerServerConfig.url,
            aud: fastify.config.AUTHORIZATION_SERVER_URL,
            iat: now,
            exp: now + 600, // 10 minutes
          },
          {
            issuer: fastify.issuerServerConfig.url,
            signer:
              fastify.config.KEY_ALG === 'ES256'
                ? ES256Signer(utils.hexToBytes(fastify.config.PRIVATE_KEY))
                : ES256KSigner(utils.hexToBytes(fastify.config.PRIVATE_KEY)),
          },
          {
            type: 'JWT',
            alg: fastify.config.KEY_ALG,
            kid: fastify.issuerServerConfig.kid,
          },
        );

        grants = {
          authorization_code: {
            issuer_state: issuerState,
          },
        };

        // If credential_data is provided, we need to add store it so we can retrieve it later
        if (request.body.credential_subject) {
          const credentialSubject = request.body.credential_subject;
          await fastify.cache.set(issuerState, { credentialSubject });
        }
      } else {
        // Pre-authorized code flow
        const { publicKeyJwk } = await getKeyPair(
          fastify.config.PRIVATE_KEY,
          fastify.config.KEY_ALG,
        );

        const preAuthorizedCode = await createJWT(
          {
            authorization_details: [
              {
                type: 'openid_credential',
                format: format,
                locations: [fastify.issuerServerConfig.url],
                types: credential_type,
              },
            ],
            iss: fastify.issuerServerConfig.url,
            aud: fastify.config.AUTHORIZATION_SERVER_URL,
            iat: now,
            exp: now + 8035200, // 3 Months
          },
          {
            issuer: fastify.issuerServerConfig.url,
            signer:
              fastify.config.KEY_ALG === 'ES256'
                ? ES256Signer(utils.hexToBytes(fastify.config.PRIVATE_KEY))
                : ES256KSigner(utils.hexToBytes(fastify.config.PRIVATE_KEY)),
          },
          {
            type: 'JWT',
            alg: fastify.config.KEY_ALG,
            kid: publicKeyJwk.kid,
          },
        );

        grants = {
          'urn:ietf:params:oauth:grant-type:pre-authorized_code': {
            'pre-authorized_code': preAuthorizedCode,
            user_pin_required: true,
          },
        };

        // If credential_data is provided, we need to add store it so we can retrieve it later
        if (request.body.credential_subject) {
          await fastify.cache.set(
            preAuthorizedCode,
            request.body.credential_subject,
          );
        }

        const pin = randomInt(100000, 999999).toString();
        response.pin = pin;

        const jwt = await createJWT(
          {
            iss: fastify.issuerServerConfig.url,
            aud: `${fastify.config.AUTHORIZATION_SERVER_URL}/oidc`,
            iat: now,
            exp: now + 8035200, // 3 Months
            data: {
              preAuthorizedCode,
              pin,
            },
          },
          {
            issuer: fastify.issuerServerConfig.url,
            signer:
              fastify.config.KEY_ALG === 'ES256'
                ? ES256Signer(utils.hexToBytes(fastify.config.PRIVATE_KEY))
                : ES256KSigner(utils.hexToBytes(fastify.config.PRIVATE_KEY)),
          },
          {
            type: 'JWT',
            alg: fastify.config.KEY_ALG,
          },
        );

        await fetch(`${fastify.config.AUTHORIZATION_SERVER_URL}/set-pin`, {
          method: 'POST',
          headers: {
            authorization: `Bearer ${jwt}`,
          },
        });
      }

      const credentialOffer = {
        credential_issuer: fastify.issuerServerConfig.url,
        credentials: [
          {
            format: format,
            types: credential_type,
          },
        ],
        grants,
      };

      let location = `${credentialOfferEndpoint}?${new URLSearchParams({
        credential_offer: JSON.stringify(credentialOffer),
      }).toString()}`;

      // For long credential offers we return `credential_offer_uri`
      if (location.length > 500) {
        // Store request
        const id = randomUUID();
        await fastify.cache.set(id, credentialOffer);

        location = `${credentialOfferEndpoint}?${new URLSearchParams({
          credential_offer_uri: `${fastify.issuerServerConfig.url}/credential_offer/${id}`,
        }).toString()}`;
      }

      /*
        NOTE: This was replaced with uploading images to Uploadthing on the dashboard backend

        // Store location in cache (needed for generating images)
        const requestId = randomUUID();
        await fastify.cache.set(requestId, location);
        response.id = requestId;
      */

      response.location = location;

      return reply.code(200).send(response);
    },
  );

  fastify.get(
    '/credential_offer/:id',
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
      config: {
        description: 'Credential endpoint for OpenID credential issuer',
      },
    },
    async (request, reply) => {
      const credentialOffer = await fastify.cache.get(request.params.id);

      if (!credentialOffer) {
        return reply.code(404).send();
      }

      return reply.code(200).send(credentialOffer);
    },
  );

  fastify.post(
    '/stored-credential-data',
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
      const authorizationServerPublicJwk = await getPublicJwk(
        fastify.config.AUTHORIZATION_SERVER_PUBLIC_KEY,
        fastify.config.AUTHORIZATION_SERVER_KEY_ALG,
      );

      const issuerMockPublicKey = await importJWK(
        authorizationServerPublicJwk,
        fastify.config.AUTHORIZATION_SERVER_KEY_ALG,
      );

      try {
        const { payload } = await jwtVerify(
          request.headers.authorization.replace('Bearer ', ''),
          issuerMockPublicKey,
        );

        const data = payload.data as
          | { id?: string; newId?: string }
          | undefined;

        if (!data?.id || !data?.newId) return reply.code(400).send();

        const cachedData = await fastify.cache.get(data.id);

        if (!cachedData) return reply.code(400).send();

        await fastify.cache.del(data.id);

        await fastify.cache.set(data.newId, cachedData);
      } catch (error) {
        return reply.code(401).send({
          error: 'Unauthorized',
        });
      }

      return reply.code(200).send();
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
      const { publicKeyJwk } = await getKeyPair(
        fastify.config.PRIVATE_KEY,
        fastify.config.KEY_ALG,
      );

      return reply.code(200).send({
        keys: [publicKeyJwk],
      });
    },
  );
};

export default route;
