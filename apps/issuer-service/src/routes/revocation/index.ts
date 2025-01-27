import { fastifyFormbody } from '@fastify/formbody';

import type { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { apiKeyAuth } from '../../middlewares/apiKeyAuth.js';
import {
  createVerifiableCredentialJwt,
  type EbsiIssuer,
  type CreateVerifiableCredentialOptions,
  type EbsiVerifiableAttestation,
} from '@cef-ebsi/verifiable-credential';
import { ES256KSigner, ES256Signer } from 'did-jwt';
import * as utils from '@noble/curves/abstract/utils';
import { CREDENTIAL_TYPE_TO_SCHEMA } from '../../plugins/issuer.js';

const revocation: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify,
): Promise<void> => {
  await fastify.register(fastifyFormbody, { bodyLimit: 1048576 * 10 });

  fastify.post(
    '/:id',
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
        description: 'Revokes credential by id',
      },
      preValidation: apiKeyAuth,
    },
    async (request, reply) => {
      const credential = fastify.credentialCache.get(request.params.id);

      if (!credential) {
        return reply.code(404).send();
      }

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

      const vcId = request.params.id;
      const vcType = ['VerifiableCredential', 'CRLPlain2023Credential'];
      const issuedAt = `${new Date(Date.now()).toISOString().slice(0, -5)}Z`;
      const schema = CREDENTIAL_TYPE_TO_SCHEMA.get(JSON.stringify(vcType))!;

      const vcPayload = {
        // TODO: Do we need to add contexts based on requested credential types ?
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        id: vcId,
        type: vcType,
        issuer: issuer.did,
        issuanceDate: issuedAt,
        validFrom: issuedAt,
        issued: issuedAt,
        credentialSubject: {
          purpose: 'revocation',
        },
        credentialSchema: {
          id: schema,
          type: 'FullJsonSchemaValidator2021',
        },
        credentialStatus: {
          id: vcId,
          type: 'CRLPlain2023Entry',
          purpose: 'revocation',
          credential: `${fastify.config.SERVER_URL}/oidc/credential_status/${vcId}`,
        },
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

      fastify.revocationCache.set(vcId, vcJwt);

      return reply.code(200).send();
    },
  );
};

export default revocation;
